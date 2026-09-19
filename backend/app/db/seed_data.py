import logging
from sqlalchemy.orm import Session
from app.core.security import get_password_hash
from app.models.user import User
from app.models.project import Project
from app.models.site import Site
from app.models.analytics import Analytics
from app.services.geo_service import geo_service
from app.services.analytics_service import analytics_service

logger = logging.getLogger(__name__)

SAMPLE_PROJECTS_AND_SITES = [
    {
        "name": "Amazonian Canopy & Peatland Reserve",
        "description": "Large-scale tropical primary forest conservation and riparian corridor restoration in the South-Western Amazon basin.",
        "sites": [
            {
                "name": "Acre Old-Growth Primary Zone",
                "ecosystem_type": "Tropical Rainforest",
                "status": "Active",
                "polygon": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [-70.525, -9.120],
                            [-70.475, -9.120],
                            [-70.465, -9.165],
                            [-70.510, -9.185],
                            [-70.540, -9.150],
                            [-70.525, -9.120],
                        ]
                    ],
                },
            },
            {
                "name": "Juruá River Basin Reforestation",
                "ecosystem_type": "Tropical Rainforest",
                "status": "Restoring",
                "polygon": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [-70.380, -9.210],
                            [-70.330, -9.200],
                            [-70.315, -9.245],
                            [-70.365, -9.260],
                            [-70.395, -9.235],
                            [-70.380, -9.210],
                        ]
                    ],
                },
            },
        ],
    },
    {
        "name": "Sundarbans Coastal Mangrove Shield",
        "description": "Tidal blue carbon sequestration and delta biodiversity stabilization across sensitive mangrove delta systems.",
        "sites": [
            {
                "name": "Matla Estuary Blue Carbon Delta",
                "ecosystem_type": "Mangrove",
                "status": "Active",
                "polygon": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [88.650, 21.920],
                            [88.710, 21.935],
                            [88.725, 21.880],
                            [88.670, 21.865],
                            [88.635, 21.895],
                            [88.650, 21.920],
                        ]
                    ],
                },
            },
            {
                "name": "Gosaba Island Buffer Zone",
                "ecosystem_type": "Mangrove",
                "status": "Restoring",
                "polygon": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [88.780, 22.140],
                            [88.830, 22.155],
                            [88.845, 22.110],
                            [88.790, 22.095],
                            [88.765, 22.115],
                            [88.780, 22.140],
                        ]
                    ],
                },
            },
        ],
    },
    {
        "name": "Caledonian Highlands Rewilding Initiative",
        "description": "Peat bog re-wetting and native Scots pine regeneration for high-latitude terrestrial carbon storage and raptor return.",
        "sites": [
            {
                "name": "Glen Affric Peat & Pine Plateau",
                "ecosystem_type": "Peatland",
                "status": "Active",
                "polygon": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [-4.980, 57.280],
                            [-4.920, 57.290],
                            [-4.905, 57.255],
                            [-4.960, 57.240],
                            [-4.995, 57.260],
                            [-4.980, 57.280],
                        ]
                    ],
                },
            },
            {
                "name": "Strathglass Native Woodland",
                "ecosystem_type": "Temperate Forest",
                "status": "Monitored",
                "polygon": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [-4.820, 57.340],
                            [-4.770, 57.350],
                            [-4.760, 57.315],
                            [-4.810, 57.305],
                            [-4.835, 57.320],
                            [-4.820, 57.340],
                        ]
                    ],
                },
            },
        ],
    },
    {
        "name": "Serengeti Wildlife & Acacia Corridor",
        "description": "Savannah soil carbon enhancement, fire management, and megafauna migratory corridor protection.",
        "sites": [
            {
                "name": "Mara River Riparian Sector",
                "ecosystem_type": "Savannah",
                "status": "Active",
                "polygon": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [34.950, -1.580],
                            [35.010, -1.570],
                            [35.030, -1.620],
                            [34.975, -1.635],
                            [34.935, -1.605],
                            [34.950, -1.580],
                        ]
                    ],
                },
            },
            {
                "name": "Grumeti Biomass Reserve",
                "ecosystem_type": "Savannah",
                "status": "Monitored",
                "polygon": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [34.420, -2.150],
                            [34.480, -2.140],
                            [34.495, -2.190],
                            [34.440, -2.205],
                            [34.405, -2.175],
                            [34.420, -2.150],
                        ]
                    ],
                },
            },
        ],
    },
]


def seed_database(db: Session) -> None:
    """Seed administrator user, sample projects, sites, and monthly metrics."""
    # 1. Admin user
    admin_email = "admin@darukaa.earth"
    admin = db.query(User).filter(User.email == admin_email).first()
    if not admin:
        admin = User(
            name="Darukaa Administrator",
            email=admin_email,
            password_hash=get_password_hash("AdminPass123!"),
            role="admin",
        )
        db.add(admin)
        db.commit()
        db.refresh(admin)
        logger.info("Created default admin user: %s", admin_email)

    # 2. Check if projects exist
    existing_project_count = db.query(Project).count()
    if existing_project_count > 0:
        logger.info("Projects already present in database (%d), skipping project seeding.", existing_project_count)
        return

    logger.info("Seeding realistic sample nature projects and environmental datasets...")
    for proj_data in SAMPLE_PROJECTS_AND_SITES:
        project = Project(
            name=proj_data["name"],
            description=proj_data["description"],
            created_by=admin.id,
        )
        db.add(project)
        db.commit()
        db.refresh(project)

        for site_data in proj_data["sites"]:
            geojson_poly = site_data["polygon"]
            area_ha = geo_service.calculate_polygon_area_hectares(geojson_poly)
            wkt_poly = geo_service.geojson_to_wkt(geojson_poly)

            site = Site(
                project_id=project.id,
                name=site_data["name"],
                polygon_geometry=wkt_poly,
                polygon_geojson=geojson_poly,
                area=area_ha,
                ecosystem_type=site_data["ecosystem_type"],
                status=site_data["status"],
            )
            db.add(site)
            db.commit()
            db.refresh(site)

            # Generate 24 months of realistic metrics
            measurements = analytics_service.generate_site_timeseries(
                site_id=site.id,
                ecosystem_type=site.ecosystem_type,
                area_hectares=site.area,
                months=24,
            )
            for m in measurements:
                db.add(Analytics(**m))
            db.commit()

    logger.info("Database successfully seeded with realistic nature projects!")


if __name__ == "__main__":
    from app.core.database import SessionLocal
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
