from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


class ProjectBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    description: Optional[str] = None


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=255)
    description: Optional[str] = None


class ProjectSummary(BaseModel):
    site_count: int = 0
    total_area_hectares: float = 0.0
    avg_carbon_score: float = 0.0
    avg_biodiversity_score: float = 0.0
    avg_vegetation_index: float = 0.0


class ProjectResponse(ProjectBase):
    id: str
    created_by: str
    created_at: datetime
    updated_at: datetime
    summary: Optional[ProjectSummary] = None

    class Config:
        from_attributes = True


class ProjectDetailResponse(ProjectResponse):
    sites: List[dict] = []
