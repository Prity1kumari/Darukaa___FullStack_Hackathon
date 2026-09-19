from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.crud.crud_analytics import analytics_crud
from app.db.seed_data import seed_database
from app.models.user import User
from app.schemas.analytics import (
    SiteAnalyticsResponse,
    ProjectAnalyticsResponse,
    OverviewKPIs,
)

router = APIRouter()


@router.get("/overview", response_model=OverviewKPIs)
def get_global_overview(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """Get high-level summary KPIs across all projects and sites."""
    return analytics_crud.get_overview_kpis(db)


@router.get("/site/{id}", response_model=SiteAnalyticsResponse)
def get_site_analytics(
    id: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """Get timeseries history and ecological analytics for a specific site."""
    data = analytics_crud.get_site_analytics(db, site_id=id)
    if not data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Site not found or no analytics available",
        )
    return data


@router.get("/project/{id}", response_model=ProjectAnalyticsResponse)
def get_project_analytics(
    id: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """Get aggregated metrics and comparative site performance for a project."""
    data = analytics_crud.get_project_analytics(db, project_id=id)
    if not data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found or has no active sites",
        )
    return data


@router.post("/seed", response_model=dict)
def trigger_seed_data(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_admin),
) -> Any:
    """Seed or reset realistic sample projects and environmental data (admin only)."""
    seed_database(db)
    return {"message": "Sample ecological projects and timeseries successfully seeded"}
