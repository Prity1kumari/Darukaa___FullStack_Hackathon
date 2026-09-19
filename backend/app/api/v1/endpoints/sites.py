from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api import deps
from app.crud.crud_site import site_crud
from app.crud.crud_project import project_crud
from app.models.user import User
from app.schemas.site import (
    SiteCreate,
    SiteUpdate,
    SiteResponse,
    SiteMetricsSummary,
)

router = APIRouter()


@router.get("", response_model=Any)
def read_sites(
    db: Session = Depends(deps.get_db),
    project_id: Optional[str] = None,
    skip: int = 0,
    limit: int = 200,
    format: Optional[str] = Query(None, description="Set to 'geojson' for Mapbox FeatureCollection"),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """List sites with optional project filter and GeoJSON formatting."""
    sites = site_crud.get_multi(db, skip=skip, limit=limit, project_id=project_id)
    
    if format == "geojson":
        return site_crud.to_geojson_collection(db, sites)

    response = []
    for s in sites:
        metrics_dict = site_crud.get_latest_metrics(db, s.id)
        response.append({
            "id": s.id,
            "project_id": s.project_id,
            "name": s.name,
            "polygon_geojson": s.polygon_geojson,
            "area": s.area,
            "ecosystem_type": s.ecosystem_type,
            "status": s.status,
            "created_at": s.created_at,
            "metrics": SiteMetricsSummary(**metrics_dict) if metrics_dict else None,
        })
    return response


@router.post("", response_model=SiteResponse, status_code=status.HTTP_201_CREATED)
def create_site(
    *,
    db: Session = Depends(deps.get_db),
    site_in: SiteCreate,
    current_user: User = Depends(deps.get_current_admin),
) -> Any:
    """Create a new site under a project with drawn polygon boundary (admin only)."""
    project = project_crud.get(db=db, id=site_in.project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Parent project not found",
        )

    site = site_crud.create(db=db, obj_in=site_in)
    metrics_dict = site_crud.get_latest_metrics(db, site.id)
    return {
        "id": site.id,
        "project_id": site.project_id,
        "name": site.name,
        "polygon_geojson": site.polygon_geojson,
        "area": site.area,
        "ecosystem_type": site.ecosystem_type,
        "status": site.status,
        "created_at": site.created_at,
        "metrics": SiteMetricsSummary(**metrics_dict) if metrics_dict else None,
    }


@router.get("/{id}", response_model=SiteResponse)
def read_site_by_id(
    id: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """Get site details and latest metrics by ID."""
    site = site_crud.get(db=db, id=id)
    if not site:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Site not found",
        )
    metrics_dict = site_crud.get_latest_metrics(db, site.id)
    return {
        "id": site.id,
        "project_id": site.project_id,
        "name": site.name,
        "polygon_geojson": site.polygon_geojson,
        "area": site.area,
        "ecosystem_type": site.ecosystem_type,
        "status": site.status,
        "created_at": site.created_at,
        "metrics": SiteMetricsSummary(**metrics_dict) if metrics_dict else None,
    }


@router.put("/{id}", response_model=SiteResponse)
def update_site(
    *,
    db: Session = Depends(deps.get_db),
    id: str,
    site_in: SiteUpdate,
    current_user: User = Depends(deps.get_current_admin),
) -> Any:
    """Update site name, status, or edited polygon geometry (admin only)."""
    site = site_crud.get(db=db, id=id)
    if not site:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Site not found",
        )
    site = site_crud.update(db=db, db_obj=site, obj_in=site_in)
    metrics_dict = site_crud.get_latest_metrics(db, site.id)
    return {
        "id": site.id,
        "project_id": site.project_id,
        "name": site.name,
        "polygon_geojson": site.polygon_geojson,
        "area": site.area,
        "ecosystem_type": site.ecosystem_type,
        "status": site.status,
        "created_at": site.created_at,
        "metrics": SiteMetricsSummary(**metrics_dict) if metrics_dict else None,
    }


@router.delete("/{id}", response_model=dict)
def delete_site(
    *,
    db: Session = Depends(deps.get_db),
    id: str,
    current_user: User = Depends(deps.get_current_admin),
) -> Any:
    """Delete site and associated environmental data (admin only)."""
    site = site_crud.get(db=db, id=id)
    if not site:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Site not found",
        )
    site_crud.remove(db=db, id=id)
    return {"message": "Site deleted successfully", "id": id}
