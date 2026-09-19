from datetime import datetime
from typing import Optional, List, Literal, Dict, Any
from pydantic import BaseModel, Field, field_validator


class GeoJSONPolygon(BaseModel):
    type: Literal["Polygon"] = "Polygon"
    coordinates: List[List[List[float]]] = Field(
        ...,
        description="GeoJSON Polygon coordinates [linear ring [ [lng, lat], ... ]]"
    )

    @field_validator("coordinates")
    @classmethod
    def validate_coordinates(cls, v: List[List[List[float]]]) -> List[List[List[float]]]:
        if not v or len(v) == 0:
            raise ValueError("Polygon coordinates must contain at least one linear ring")
        outer_ring = v[0]
        if len(outer_ring) < 4:
            raise ValueError("A polygon linear ring must contain at least 4 positions (minimum 3 distinct points + closing point)")
        # Check closed ring
        if outer_ring[0] != outer_ring[-1]:
            # Close it automatically if slightly unclosed
            outer_ring.append(outer_ring[0])
        return v


class SiteBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    ecosystem_type: str = Field(default="Tropical Rainforest")
    status: str = Field(default="Active")


class SiteCreate(SiteBase):
    project_id: str
    polygon: GeoJSONPolygon
    area: Optional[float] = None  # If not provided, computed by GeoService


class SiteUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=255)
    ecosystem_type: Optional[str] = None
    status: Optional[str] = None
    polygon: Optional[GeoJSONPolygon] = None
    area: Optional[float] = None


class SiteMetricsSummary(BaseModel):
    latest_carbon_score: Optional[float] = None
    latest_biodiversity_score: Optional[float] = None
    latest_vegetation_index: Optional[float] = None
    latest_canopy_cover: Optional[float] = None
    latest_soil_moisture: Optional[float] = None
    last_updated: Optional[datetime] = None


class SiteResponse(SiteBase):
    id: str
    project_id: str
    polygon_geojson: Dict[str, Any]
    area: float
    created_at: datetime
    metrics: Optional[SiteMetricsSummary] = None

    class Config:
        from_attributes = True


# GeoJSON Feature standard for Mapbox
class SiteGeoJSONFeature(BaseModel):
    type: Literal["Feature"] = "Feature"
    id: str
    geometry: Dict[str, Any]
    properties: Dict[str, Any]


class SiteGeoJSONFeatureCollection(BaseModel):
    type: Literal["FeatureCollection"] = "FeatureCollection"
    features: List[SiteGeoJSONFeature]
