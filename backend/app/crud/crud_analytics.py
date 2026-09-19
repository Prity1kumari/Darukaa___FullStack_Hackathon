from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.analytics import Analytics
from app.models.site import Site
from app.models.project import Project
from app.services.analytics_service import analytics_service


class CRUDAnalytics:
    def get_site_analytics(self, db: Session, site_id: str) -> Optional[Dict[str, Any]]:
        site = db.query(Site).filter(Site.id == site_id).first()
        if not site:
            return None

        trends = (
            db.query(Analytics)
            .filter(Analytics.site_id == site_id)
            .order_by(Analytics.timestamp.asc())
            .all()
        )

        trend_points = [
            {
                "timestamp": t.timestamp,
                "carbon_score": t.carbon_score,
                "biodiversity_score": t.biodiversity_score,
                "vegetation_index": t.vegetation_index,
                "canopy_cover": t.canopy_cover,
                "soil_moisture": t.soil_moisture,
            }
            for t in trends
        ]

        latest = trends[-1] if trends else None
        current_metrics = {
            "carbon_score": latest.carbon_score if latest else 0.0,
            "biodiversity_score": latest.biodiversity_score if latest else 0.0,
            "vegetation_index": latest.vegetation_index if latest else 0.0,
            "canopy_cover": latest.canopy_cover if latest else 0.0,
            "soil_moisture": latest.soil_moisture if latest else 0.0,
            "last_measured": latest.timestamp if latest else None,
        }

        summary_stats = analytics_service.calculate_stats(trends)

        return {
            "site_id": site.id,
            "site_name": site.name,
            "area_hectares": site.area,
            "ecosystem_type": site.ecosystem_type,
            "current_metrics": current_metrics,
            "trends": trend_points,
            "summary_stats": summary_stats,
        }

    def get_project_analytics(self, db: Session, project_id: str) -> Optional[Dict[str, Any]]:
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            return None

        sites = db.query(Site).filter(Site.project_id == project_id).all()
        site_comparisons = []
        ecosystem_counts: Dict[str, float] = {}
        total_area = sum(s.area for s in sites)

        for s in sites:
            latest = (
                db.query(Analytics)
                .filter(Analytics.site_id == s.id)
                .order_by(Analytics.timestamp.desc())
                .first()
            )
            site_comparisons.append({
                "site_id": s.id,
                "site_name": s.name,
                "area_hectares": s.area,
                "ecosystem_type": s.ecosystem_type,
                "carbon_score": latest.carbon_score if latest else 0.0,
                "biodiversity_score": latest.biodiversity_score if latest else 0.0,
                "vegetation_index": latest.vegetation_index if latest else 0.0,
            })
            ecosystem_counts[s.ecosystem_type] = ecosystem_counts.get(s.ecosystem_type, 0) + s.area

        # Aggregate monthly trends across all sites
        # Group by month and compute averages
        site_ids = [s.id for s in sites]
        all_analytics = (
            db.query(Analytics)
            .filter(Analytics.site_id.in_(site_ids))
            .order_by(Analytics.timestamp.asc())
            .all()
        ) if site_ids else []

        grouped_by_month: Dict[str, List[Analytics]] = {}
        for a in all_analytics:
            month_key = a.timestamp.strftime("%Y-%m")
            if month_key not in grouped_by_month:
                grouped_by_month[month_key] = []
            grouped_by_month[month_key].append(a)

        aggregate_trends = []
        for month_str, items in sorted(grouped_by_month.items()):
            aggregate_trends.append({
                "month": month_str,
                "avg_carbon_score": round(sum(i.carbon_score for i in items) / len(items), 2),
                "avg_biodiversity_score": round(sum(i.biodiversity_score for i in items) / len(items), 1),
                "avg_vegetation_index": round(sum(i.vegetation_index for i in items) / len(items), 3),
            })

        return {
            "project_id": project.id,
            "project_name": project.name,
            "total_area_hectares": round(total_area, 2),
            "total_sites": len(sites),
            "aggregate_trends": aggregate_trends,
            "site_comparisons": site_comparisons,
            "ecosystem_breakdown": ecosystem_counts,
        }

    def get_overview_kpis(self, db: Session) -> Dict[str, Any]:
        total_projects = db.query(Project).count()
        sites = db.query(Site).all()
        total_sites = len(sites)
        total_area = sum(s.area for s in sites)

        carbon_scores = []
        bio_scores = []
        veg_scores = []

        for s in sites:
            latest = (
                db.query(Analytics)
                .filter(Analytics.site_id == s.id)
                .order_by(Analytics.timestamp.desc())
                .first()
            )
            if latest:
                # Total carbon sequestered estimate = density (tCO2e/ha) * area
                carbon_scores.append(latest.carbon_score * s.area)
                bio_scores.append(latest.biodiversity_score)
                veg_scores.append(latest.vegetation_index)

        total_carbon = sum(carbon_scores)
        avg_bio = sum(bio_scores) / len(bio_scores) if bio_scores else 0.0
        avg_veg = sum(veg_scores) / len(veg_scores) if veg_scores else 0.0

        return {
            "total_projects": total_projects,
            "total_sites": total_sites,
            "total_area_hectares": round(total_area, 2),
            "total_carbon_sequestered": round(total_carbon, 2),
            "average_biodiversity_score": round(avg_bio, 1),
            "average_vegetation_index": round(avg_veg, 3),
        }


analytics_crud = CRUDAnalytics()
