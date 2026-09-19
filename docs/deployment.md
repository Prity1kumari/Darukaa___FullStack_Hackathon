# Darukaa.Earth Deployment Guide

This guide outlines deployment options for Darukaa.Earth across Docker Compose, Render, and Vercel.

---

## 1. Local & Production Deployment with Docker Compose

### Prerequisites
- Docker Engine 24.0+
- Docker Compose v2.20+

### Step-by-Step
1. **Clone and Configure Environment**:
   ```bash
   cp .env.example .env
   ```
   Configure your PostgreSQL credentials, JWT secret keys, and optional Mapbox token:
   ```env
   POSTGRES_USER=darukaa_user
   POSTGRES_PASSWORD=darukaa_secure_password
   POSTGRES_DB=darukaa_earth
   SECRET_KEY=generate-a-strong-random-32-char-secret
   VITE_API_BASE_URL=http://localhost:8000
   VITE_MAPBOX_ACCESS_TOKEN=pk.your_token_here
   ```

2. **Launch Services**:
   ```bash
   docker compose up --build -d
   ```

3. **Verify Health**:
   - Backend API Health: `http://localhost:8000/api/health`
   - Interactive Swagger Docs: `http://localhost:8000/api/docs`
   - Frontend Web Console: `http://localhost:5173`

4. **Database Seeding**:
   The backend automatically seeds initial sample projects and 24 months of telemetry on startup. You can also re-trigger seeding anytime via the frontend "Seed Demo Data" button or via `POST /api/analytics/seed`.

---

## 2. Cloud Deployment: Render (Backend & PostGIS)

Render provides managed PostgreSQL with PostGIS extension support and native Python web services.

1. **Deploy PostGIS Database**:
   - In Render Dashboard, click **New +** -> **PostgreSQL**.
   - Database Name: `darukaa_earth`
   - User: `darukaa_user`
   - Enable PostGIS by opening the database shell in Render and running:
     ```sql
     CREATE EXTENSION IF NOT EXISTS postgis;
     ```

2. **Deploy FastAPI Web Service**:
   - Click **New +** -> **Web Service** and connect the repository.
   - Root Directory: `backend`
   - Environment: `Python 3`
   - Build Command: `pip install --upgrade pip && pip install -r requirements.txt`
   - Start Command: `alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Environment Variables:
     - `DATABASE_URL`: *(Connect from Render Database connection string)*
     - `SECRET_KEY`: *(Generate strong 64-character secret)*
     - `ENVIRONMENT`: `production`
     - `BACKEND_CORS_ORIGINS`: `https://your-frontend.vercel.app,https://darukaa.earth`

Alternatively, use the provided `infrastructure/render.yaml` Blueprint spec for 1-click infrastructure as code.

---

## 3. Cloud Deployment: Vercel (Frontend React SPA)

1. **Import Repository to Vercel**:
   - Root Directory: `frontend`
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`

2. **Environment Variables**:
   - `VITE_API_BASE_URL`: `https://your-render-backend.onrender.com`
   - `VITE_MAPBOX_ACCESS_TOKEN`: `pk.your_mapbox_token`

3. **Routing Configuration**:
   The provided `infrastructure/vercel.json` ensures all client-side routes (`/`, `/map`, `/projects`, `/sites/:id`) correctly rewrite to `index.html` and sets security headers (`X-Frame-Options`, `X-Content-Type-Options`).
