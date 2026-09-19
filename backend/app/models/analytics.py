import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base


class Analytics(Base):
    __tablename__ = "analytics"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    site_id = Column(String(36), ForeignKey("sites.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Core Ecological Metrics
    carbon_score = Column(Float, nullable=False)          # e.g., tCO2e / ha or total sequestered tCO2e
    biodiversity_score = Column(Float, nullable=False)    # Index 0 - 100 (species richness / Shannon index)
    vegetation_index = Column(Float, nullable=False)      # NDVI (-1.0 to +1.0)
    canopy_cover = Column(Float, nullable=True)          # Percentage (0 - 100%)
    soil_moisture = Column(Float, nullable=True)         # Percentage (0 - 100%)
    
    timestamp = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False, index=True)

    # Relationship
    site = relationship("Site", back_populates="analytics")
