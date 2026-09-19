import math
from typing import Dict, Any, List, Tuple

try:
    from shapely.geometry import shape, Polygon
    HAS_SHAPELY = True
except ImportError:
    HAS_SHAPELY = False


class GeoService:
    @staticmethod
    def calculate_polygon_area_hectares(geojson_dict: Dict[str, Any]) -> float:
        """
        Calculate geodesic area of a GeoJSON Polygon in hectares using WGS84 geodesic calculation
        or spherical Earth Shoelace formula.
        """
        try:
            from pyproj import Geod
            if HAS_SHAPELY:
                geod = Geod(ellps="WGS84")
                poly_geom = shape(geojson_dict)
                poly_area_meters, _ = geod.geometry_area_perimeter(poly_geom)
                return round(abs(poly_area_meters) / 10000.0, 2)
        except Exception:
            pass

        # Robust spherical earth polygon area calculation
        coordinates = geojson_dict.get("coordinates", [[]])[0]
        if len(coordinates) < 3:
            return 0.0

        # Mean Earth radius in meters
        R = 6378137.0
        total = 0.0
        num_points = len(coordinates)
        for i in range(num_points):
            p1 = coordinates[i]
            p2 = coordinates[(i + 1) % num_points]
            lat1 = math.radians(p1[1])
            lat2 = math.radians(p2[1])
            lon1 = math.radians(p1[0])
            lon2 = math.radians(p2[0])
            total += (lon2 - lon1) * (2 + math.sin(lat1) + math.sin(lat2))

        area_sq_m = abs(total * R * R / 2.0)
        return round(area_sq_m / 10000.0, 2)

    @staticmethod
    def geojson_to_wkt(geojson_dict: Dict[str, Any]) -> str:
        """Convert a GeoJSON Polygon dict to WKT (Well-Known Text)."""
        if HAS_SHAPELY:
            try:
                poly = shape(geojson_dict)
                return poly.wkt
            except Exception:
                pass

        coords = geojson_dict.get("coordinates", [[]])[0]
        ring_str = ", ".join([f"{pt[0]} {pt[1]}" for pt in coords])
        return f"POLYGON(({ring_str}))"

    @staticmethod
    def get_centroid_and_bbox(geojson_dict: Dict[str, Any]) -> Tuple[Tuple[float, float], List[float]]:
        """Calculate centroid (lng, lat) and bounding box [min_lng, min_lat, max_lng, max_lat]."""
        if HAS_SHAPELY:
            try:
                poly = shape(geojson_dict)
                centroid = (round(poly.centroid.x, 6), round(poly.centroid.y, 6))
                bounds = [round(b, 6) for b in poly.bounds]
                return centroid, bounds
            except Exception:
                pass

        coords = geojson_dict.get("coordinates", [[]])[0]
        if not coords:
            return (0.0, 0.0), [0.0, 0.0, 0.0, 0.0]

        lngs = [pt[0] for pt in coords]
        lats = [pt[1] for pt in coords]
        min_lng, max_lng = min(lngs), max(lngs)
        min_lat, max_lat = min(lats), max(lats)
        centroid = (round(sum(lngs) / len(lngs), 6), round(sum(lats) / len(lats), 6))
        bounds = [min_lng, min_lat, max_lng, max_lat]
        return centroid, bounds


geo_service = GeoService()
