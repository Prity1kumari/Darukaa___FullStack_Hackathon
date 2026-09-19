from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.crud.crud_project import project_crud
from app.models.user import User
from app.schemas.project import (
    ProjectCreate,
    ProjectUpdate,
    ProjectResponse,
    ProjectDetailResponse,
    ProjectSummary,
)

router = APIRouter()


@router.get("", response_model=List[ProjectResponse])
def read_projects(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """Retrieve all projects with calculated summaries."""
    projects = project_crud.get_multi(db, skip=skip, limit=limit)
    response = []
    for p in projects:
        summary_dict = project_crud.get_project_summary(db, p.id)
        p_dict = {
            "id": p.id,
            "name": p.name,
            "description": p.description,
            "created_by": p.created_by,
            "created_at": p.created_at,
            "updated_at": p.updated_at,
            "summary": ProjectSummary(**summary_dict),
        }
        response.append(p_dict)
    return response


@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    *,
    db: Session = Depends(deps.get_db),
    project_in: ProjectCreate,
    current_user: User = Depends(deps.get_current_admin),
) -> Any:
    """Create new ecological project (admin only)."""
    project = project_crud.create_with_owner(db=db, obj_in=project_in, user_id=current_user.id)
    summary_dict = project_crud.get_project_summary(db, project.id)
    return {
        "id": project.id,
        "name": project.name,
        "description": project.description,
        "created_by": project.created_by,
        "created_at": project.created_at,
        "updated_at": project.updated_at,
        "summary": ProjectSummary(**summary_dict),
    }


@router.get("/{id}", response_model=ProjectDetailResponse)
def read_project_by_id(
    id: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """Get project details including child sites and summaries."""
    project = project_crud.get(db=db, id=id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )
    summary_dict = project_crud.get_project_summary(db, project.id)
    sites_data = [
        {
            "id": s.id,
            "name": s.name,
            "area": s.area,
            "ecosystem_type": s.ecosystem_type,
            "status": s.status,
            "created_at": s.created_at,
            "polygon_geojson": s.polygon_geojson,
        }
        for s in project.sites
    ]
    return {
        "id": project.id,
        "name": project.name,
        "description": project.description,
        "created_by": project.created_by,
        "created_at": project.created_at,
        "updated_at": project.updated_at,
        "summary": ProjectSummary(**summary_dict),
        "sites": sites_data,
    }


@router.put("/{id}", response_model=ProjectResponse)
def update_project(
    *,
    db: Session = Depends(deps.get_db),
    id: str,
    project_in: ProjectUpdate,
    current_user: User = Depends(deps.get_current_admin),
) -> Any:
    """Update project details (admin only)."""
    project = project_crud.get(db=db, id=id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )
    project = project_crud.update(db=db, db_obj=project, obj_in=project_in)
    summary_dict = project_crud.get_project_summary(db, project.id)
    return {
        "id": project.id,
        "name": project.name,
        "description": project.description,
        "created_by": project.created_by,
        "created_at": project.created_at,
        "updated_at": project.updated_at,
        "summary": ProjectSummary(**summary_dict),
    }


@router.delete("/{id}", response_model=dict)
def delete_project(
    *,
    db: Session = Depends(deps.get_db),
    id: str,
    current_user: User = Depends(deps.get_current_admin),
) -> Any:
    """Delete a project and its sites (admin only)."""
    project = project_crud.get(db=db, id=id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )
    project_crud.remove(db=db, id=id)
    return {"message": "Project deleted successfully", "id": id}
