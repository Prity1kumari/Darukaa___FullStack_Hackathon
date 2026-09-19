from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from app.models.site import Site
from app.models.analytics import Analytics
from app.schemas.site import SiteCreate, SiteUpdate, SiteGeoJSONFeature, SiteGeoJSONFeatureCollection
from app.services.geo_service import geo_service
from app.services.analytics_service import analytics_service


class CRUDSite:
    def get(self, db: Session, id: str) -> Optional[Site]:
        return db.query(Site).filter(Site.id == id).first()

    def get_multi(
        self, db: Session, skip: int = 0, limit: int = 100, project_id: Optional[str] = None
    ) -> List[Site]:
        query = db.query(Site)
        if project_id:
            query = query.filter(Site.project_id == project_id)
        return query.order_by(Site.created_at.desc()).offset(skip).limit(limit).all()

    def create(self, db: Session, obj_in: SiteCreate) -> Site:
        geojson_dict = obj_in.polygon.model_dump()
        
        # Calculate geodesic area in hectares if not explicitly given
        calculated_area = obj_in.area
        if calculated_area is None or calculated_area <= 0:
            calculated_area = geo_service.calculate_polygon_area_hectares(geojson_dict)

        wkt_geom = geo_service.geojson_to_wkt(geojson_dict)

        db_obj = Site(
            project_id=obj_in.project_id,
            name=obj_in.name,
            polygon_geometry=wkt_geom,
            polygon_geojson=geojson_dict,
            area=calculated_area,
            ecosystem_type=obj_in.ecosystem_type,
            status=obj_in.status,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)

        # Generate realistic timeseries measurements so analytics are immediately available
        measurements = analytics_service.generate_site_timeseries(
            site_id=db_obj.id,
            ecosystem_type=db_obj.ecosystem_type,
            area_hectares=db_obj.area,
            months=24
        )
        for m in measurements:
            analytics_entry = Analytics(**m)
            db.add(analytics_entry)
        db.commit()
        db.refresh(db_obj)

        return db_obj

    def update(self, db: Session, db_obj: Site, obj_in: SiteUpdate) -> Site:
        if obj_in.name is not None:
            db_obj.name = obj_in.name
        if obj_in.ecosystem_type is not None:
            db_obj.ecosystem_type = obj_in.ecosystem_type
        if obj_in.status is not None:
            db_obj.status = obj_in.status
        if obj_in.polygon is not None:
            geojson_dict = obj_in.polygon.model_dump()
            db_obj.polygon_geojson = geojson_dict
            db_obj.polygon_geometry = geo_service.geojson_to_wkt(geojson_dict)
            if obj_in.area is not None and obj_in.area > 0:
                db_obj.area = obj_in.area
            else:
                db_obj.area = geo_service.calculate_polygon_area_hectares(geojson_dict)

        db.commit()
        db.refresh(db_obj)
        return db_obj

    def remove(self, db: Session, id: str) -> Optional[Site]:
        obj = db.query(Site).filter(Site.id == id).first()
        if obj:
            db.delete(obj)
            db.commit()
        return obj

    def get_latest_metrics(self, db: Session, site_id: str) -> Dict[str, Any]:
        """Fetch latest snapshot metrics for a site."""
        latest = (
            db.query(Analytics)
            .filter(Analytics.site_id == site_id)
            .order_by(Analytics.timestamp.desc())
            .first()
        )
        if not latest:
            return {}
        return {
            "latest_carbon_score": latest.carbon_score,
            "latest_biodiversity_score": latest.biodiversity_score,
            "latest_vegetation_index": latest.vegetation_index,
            "latest_canopy_cover": latest.canopy_cover,
            "latest_soil_moisture": latest.soil_moisture,
            "last_updated": latest.timestamp,
        }

    def to_geojson_collection(self, db: Session, sites: List[Site]) -> Dict[str, Any]:
        """Convert a list of Site model instances into a GeoJSON FeatureCollection for Mapbox."""
        features = []
        for site in sites:
            metrics = self.get_latest_metrics(db, site.id)
            feature = {
                "type": "Feature",
                "id": site.id,
                "geometry": site.polygon_geojson,
                "properties": {
                    "id": site.id,
                    "project_id": site.project_id,
                    "name": site.name,
                    "area": site.area,
                    "ecosystem_type": site.ecosystem_type,
                    "status": site.status,
                    "carbon_score": metrics.get("latest_carbon_score", 0),
                    "biodiversity_score": metrics.get("latest_biodiversity_score", 0),
                    "vegetation_index": metrics.get("latest_vegetation_index", 0),
                },
            }
            features.append(feature)
        return {"type": "FeatureCollection", "features": features}


site_crud = CRUDSite()
