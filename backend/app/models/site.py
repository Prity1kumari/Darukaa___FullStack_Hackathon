import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, JSON, Text
from sqlalchemy.types import TypeDecorator
from sqlalchemy.orm import relationship
from app.db.base_class import Base

try:
    from geoalchemy2 import Geometry
    HAS_GEO = True
except ImportError:
    HAS_GEO = False


class SpatialPolygon(TypeDecorator):
    """
    Polymorphic polygon type:
    Uses PostGIS Geometry(POLYGON, 4326) on PostgreSQL,
    and falls back cleanly to Text representation on SQLite for testing.
    """
    impl = Text
    cache_ok = True

    def load_dialect_impl(self, dialect):
        if dialect.name == "postgresql" and HAS_GEO:
            return dialect.type_descriptor(Geometry(geometry_type="POLYGON", srid=4326))
        return dialect.type_descriptor(Text())


class Site(Base):
    __tablename__ = "sites"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False, index=True)
    
    # Native PostGIS geometry column for geospatial queries and indexing
    polygon_geometry = Column(SpatialPolygon, nullable=True)
    
    # Cached GeoJSON Polygon structure for rapid client serialization
    polygon_geojson = Column(JSON, nullable=False)
    
    # Calculated Area in Hectares
    area = Column(Float, nullable=False, default=0.0)
    
    # Metadata
    ecosystem_type = Column(String(100), default="Tropical Rainforest", nullable=False)
    status = Column(String(50), default="Active", nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    project = relationship("Project", back_populates="sites")
    analytics = relationship("Analytics", back_populates="site", cascade="all, delete-orphan", order_by="Analytics.timestamp")
