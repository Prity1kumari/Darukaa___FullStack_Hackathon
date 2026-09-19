from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class AnalyticsBase(BaseModel):
    carbon_score: float = Field(..., description="Carbon density / total sequestered tCO2e")
    biodiversity_score: float = Field(..., ge=0, le=100, description="Biodiversity health index 0-100")
    vegetation_index: float = Field(..., ge=-1.0, le=1.0, description="Normalized Difference Vegetation Index (NDVI)")
    canopy_cover: Optional[float] = Field(None, ge=0, le=100, description="Canopy cover %")
    soil_moisture: Optional[float] = Field(None, ge=0, le=100, description="Soil moisture %")
    timestamp: Optional[datetime] = None


class AnalyticsCreate(AnalyticsBase):
    site_id: str


class AnalyticsResponse(AnalyticsBase):
    id: str
    site_id: str
    timestamp: datetime

    class Config:
        from_attributes = True


class MetricTrendPoint(BaseModel):
    timestamp: datetime
    carbon_score: float
    biodiversity_score: float
    vegetation_index: float
    canopy_cover: Optional[float] = None
    soil_moisture: Optional[float] = None


class SiteAnalyticsResponse(BaseModel):
    site_id: str
    site_name: str
    area_hectares: float
    ecosystem_type: str
    current_metrics: Dict[str, Any]
    trends: List[MetricTrendPoint]
    summary_stats: Dict[str, Any]


class SiteComparisonMetric(BaseModel):
    site_id: str
    site_name: str
    area_hectares: float
    ecosystem_type: str
    carbon_score: float
    biodiversity_score: float
    vegetation_index: float


class ProjectAnalyticsResponse(BaseModel):
    project_id: str
    project_name: str
    total_area_hectares: float
    total_sites: int
    aggregate_trends: List[Dict[str, Any]]
    site_comparisons: List[SiteComparisonMetric]
    ecosystem_breakdown: Dict[str, float]


class OverviewKPIs(BaseModel):
    total_projects: int
    total_sites: int
    total_area_hectares: float
    total_carbon_sequestered: float
    average_biodiversity_score: float
    average_vegetation_index: float
