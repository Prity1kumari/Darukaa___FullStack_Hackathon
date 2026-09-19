# Darukaa.Earth Platform Architecture

## System Architecture

Darukaa.Earth is an enterprise-grade full-stack geospatial intelligence platform engineered for nature-based carbon sequestration and biodiversity monitoring projects.

```mermaid
graph TB
    subgraph Client ["Client Presentation Layer"]
        ReactUI["React 18 + Vite + TypeScript"]
        Tailwind["Tailwind CSS (Earth/Slate Dark UI)"]
        MapboxEngine["Mapbox GL JS + Mapbox Draw + Turf.js"]
        ChartsEngine["Chart.js + React-Chartjs-2 (Line, Bar, Doughnut, Area)"]
        ReactQuery["TanStack React Query v5 (Data Caching)"]
        AxiosClient["Axios Client (Automatic Token Refresh & Interceptors)"]
    end

    subgraph API ["Application Gateway (FastAPI)"]
        FastAPIApp["FastAPI 0.115+ (ASGI Engine)"]
        CORSMiddleware["CORS & Origin Security"]
        AuthGuards["JWT Bearer Authentication & Admin RBAC"]
        APIRouter["API v1 Router (/api)"]
        Endpoints["Auth | Projects | Sites | Analytics | Health"]
    end

    subgraph Logic ["Business & Geospatial Logic"]
        GeoService["GeoService (WGS84 Ellipsoidal Geodesic Calculation)"]
        AnalyticsEngine["Ecological Timeseries Generator (NDVI, Carbon, Bio)"]
        CRUDLayer["Repository / CRUD Data Access Layer"]
    end

    subgraph Persistence ["Data Layer"]
        SQLAlchemyORM["SQLAlchemy 2.0 ORM + GeoAlchemy2"]
        Alembic["Alembic Schema Migrations"]
        PostgreSQL[("PostgreSQL 16 + PostGIS 3.4")]
        Polygons[("Sites: Polygons SRID 4326")]
        Timeseries[("Analytics: Monthly Sensor Measurements")]
    end

    ReactUI --> MapboxEngine
    ReactUI --> ChartsEngine
    ReactUI --> ReactQuery --> AxiosClient
    AxiosClient -- "HTTPS / GeoJSON" --> API
    FastAPIApp --> CORSMiddleware --> AuthGuards --> APIRouter --> Endpoints
    Endpoints --> Logic
    GeoService --> CRUDLayer
    AnalyticsEngine --> CRUDLayer
    CRUDLayer --> SQLAlchemyORM --> PostgreSQL
    PostgreSQL --> Polygons
    PostgreSQL --> Timeseries
```

---

## Geospatial Processing Pipeline

1. **Polygon Boundary Ingestion**:
   - Polygons are drawn in the browser using `@mapbox/mapbox-gl-draw`.
   - The boundary vertices are sent as RFC 7946 standard GeoJSON `Polygon`.
2. **Server-Side Geodesic Calculation**:
   - `GeoService.calculate_polygon_area_hectares` calculates true surface area on the WGS84 ellipsoid.
   - Converts GeoJSON to Well-Known Text (`POLYGON((lng lat, ...))`) for PostGIS spatial indexing.
3. **Optimized GeoJSON Serialization**:
   - Both native spatial geometry (for SQL spatial joins) and cached GeoJSON representations are maintained.
   - Mapbox GL JS can consume `/api/sites?format=geojson` directly as a native vector/GeoJSON source.

---

## Security Architecture

- **Password Hashing**: Bcrypt with salted cryptographic rounds.
- **Access Tokens**: Short-lived JWT (60 mins) containing user UUID and role claims.
- **Refresh Tokens**: Long-lived JWT (7 days) exchanged securely via `/api/auth/refresh`.
- **Role-Based Access Control**:
  - `admin`: Project creation, editing, deletion, site creation/updating, data seeding.
  - `user` / `viewer`: Read-only telemetry, map exploration, chart inspection.
- **CORS Protection**: Restricted to configured origins.
