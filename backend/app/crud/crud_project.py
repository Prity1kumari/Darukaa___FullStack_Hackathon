from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.project import Project
from app.models.site import Site
from app.models.analytics import Analytics
from app.schemas.project import ProjectCreate, ProjectUpdate


class CRUDProject:
    def get(self, db: Session, id: str) -> Optional[Project]:
        return db.query(Project).filter(Project.id == id).first()

    def get_multi(
        self, db: Session, skip: int = 0, limit: int = 100, user_id: Optional[str] = None
    ) -> List[Project]:
        query = db.query(Project)
        if user_id:
            query = query.filter(Project.created_by == user_id)
        return query.order_by(Project.created_at.desc()).offset(skip).limit(limit).all()

    def create_with_owner(self, db: Session, obj_in: ProjectCreate, user_id: str) -> Project:
        db_obj = Project(
            name=obj_in.name,
            description=obj_in.description,
            created_by=user_id,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, db_obj: Project, obj_in: ProjectUpdate) -> Project:
        if obj_in.name is not None:
            db_obj.name = obj_in.name
        if obj_in.description is not None:
            db_obj.description = obj_in.description
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def remove(self, db: Session, id: str) -> Optional[Project]:
        obj = db.query(Project).filter(Project.id == id).first()
        if obj:
            db.delete(obj)
            db.commit()
        return obj

    def get_project_summary(self, db: Session, project_id: str) -> Dict[str, Any]:
        """Compute aggregate metrics for a project."""
        sites = db.query(Site).filter(Site.project_id == project_id).all()
        site_count = len(sites)
        total_area = sum(s.area for s in sites)

        if not sites:
            return {
                "site_count": 0,
                "total_area_hectares": 0.0,
                "avg_carbon_score": 0.0,
                "avg_biodiversity_score": 0.0,
                "avg_vegetation_index": 0.0,
            }

        site_ids = [s.id for s in sites]
        
        # Get latest analytics for each site
        carbon_scores = []
        bio_scores = []
        veg_scores = []

        for site_id in site_ids:
            latest = (
                db.query(Analytics)
                .filter(Analytics.site_id == site_id)
                .order_by(Analytics.timestamp.desc())
                .first()
            )
            if latest:
                carbon_scores.append(latest.carbon_score)
                bio_scores.append(latest.biodiversity_score)
                veg_scores.append(latest.vegetation_index)

        avg_carbon = round(sum(carbon_scores) / len(carbon_scores), 2) if carbon_scores else 0.0
        avg_bio = round(sum(bio_scores) / len(bio_scores), 1) if bio_scores else 0.0
        avg_veg = round(sum(veg_scores) / len(veg_scores), 3) if veg_scores else 0.0

        return {
            "site_count": site_count,
            "total_area_hectares": round(total_area, 2),
            "avg_carbon_score": avg_carbon,
            "avg_biodiversity_score": avg_bio,
            "avg_vegetation_index": avg_veg,
        }


project_crud = CRUDProject()
