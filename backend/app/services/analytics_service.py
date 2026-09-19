import math
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Any, Optional
from app.models.analytics import Analytics


class AnalyticsService:
    @staticmethod
    def generate_site_timeseries(
        site_id: str,
        ecosystem_type: str,
        area_hectares: float,
        months: int = 24
    ) -> List[Dict[str, Any]]:
        """
        Generate realistic, scientifically grounded timeseries measurements
        for carbon sequestration, biodiversity, and NDVI vegetation index.
        """
        records = []
        now = datetime.now(timezone.utc)
        
        # Base ecological parameters based on biome
        biome_params = {
            "Tropical Rainforest": {"base_carbon": 140.0, "growth_rate": 0.35, "base_bio": 82.0, "ndvi_mean": 0.82},
            "Mangrove": {"base_carbon": 180.0, "growth_rate": 0.45, "base_bio": 76.0, "ndvi_mean": 0.78},
            "Peatland": {"base_carbon": 220.0, "growth_rate": 0.25, "base_bio": 68.0, "ndvi_mean": 0.71},
            "Temperate Forest": {"base_carbon": 110.0, "growth_rate": 0.30, "base_bio": 72.0, "ndvi_mean": 0.74},
            "Savannah": {"base_carbon": 45.0, "growth_rate": 0.20, "base_bio": 65.0, "ndvi_mean": 0.55},
        }
        params = biome_params.get(ecosystem_type, biome_params["Tropical Rainforest"])

        for i in range(months - 1, -1, -1):
            date = now - timedelta(days=i * 30.4)
            month_idx = date.month
            
            # Seasonal oscillation (sine wave)
            seasonal = math.sin((month_idx - 3) * (2 * math.pi / 12))
            
            # Progress factor over time (older dates have less growth)
            progress = (months - i) * params["growth_rate"]
            
            # Carbon density in tCO2e/ha plus total site sequestration
            carbon_density = params["base_carbon"] + progress + (seasonal * 2.5)
            # Add realistic minor variance
            carbon_density += (math.sin(i * 1.7) * 1.2)
            
            # Biodiversity index (0-100)
            bio = min(98.0, max(15.0, params["base_bio"] + ((months - i) * 0.18) + (seasonal * 3.0)))
            
            # NDVI (-1 to 1)
            ndvi = min(0.92, max(0.2, params["ndvi_mean"] + (seasonal * 0.06) + ((months - i) * 0.002)))
            
            # Canopy cover (0-100%)
            canopy = min(95.0, max(20.0, 70.0 + ((months - i) * 0.25) + (seasonal * 4.0)))
            
            # Soil moisture (0-100%)
            soil = min(90.0, max(15.0, 55.0 + (seasonal * 12.0) + (math.cos(i) * 3.0)))

            records.append({
                "site_id": site_id,
                "timestamp": date,
                "carbon_score": round(carbon_density, 2),
                "biodiversity_score": round(bio, 1),
                "vegetation_index": round(ndvi, 3),
                "canopy_cover": round(canopy, 1),
                "soil_moisture": round(soil, 1),
            })

        return records

    @staticmethod
    def calculate_stats(trends: List[Analytics]) -> Dict[str, Any]:
        """Calculate statistical summaries and changes."""
        if not trends:
            return {}

        first = trends[0]
        latest = trends[-1]

        def pct_change(initial: float, current: float) -> float:
            if initial == 0:
                return 0.0
            return round(((current - initial) / initial) * 100, 1)

        return {
            "carbon_change_pct": pct_change(first.carbon_score, latest.carbon_score),
            "biodiversity_change_pct": pct_change(first.biodiversity_score, latest.biodiversity_score),
            "vegetation_change_pct": pct_change(first.vegetation_index, latest.vegetation_index),
            "records_count": len(trends),
            "first_recorded": first.timestamp,
            "latest_recorded": latest.timestamp,
        }


analytics_service = AnalyticsService()
