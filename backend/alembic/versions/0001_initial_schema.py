"""initial_schema

Revision ID: 0001_initial_schema
Revises: 
Create Date: 2026-09-17 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
import geoalchemy2

revision = "0001_initial_schema"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # 0. Ensure PostGIS extension exists if running on PostgreSQL
    bind = op.get_bind()
    if bind.dialect.name == "postgresql":
        op.execute("CREATE EXTENSION IF NOT EXISTS postgis;")

    # 1. Create users table
    op.create_table(
        "users",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("role", sa.String(length=50), nullable=False, server_default="admin"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_users_email"), "users", ["email"], unique=True)

    # 2. Create projects table
    op.create_table(
        "projects",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("created_by", sa.String(length=36), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["created_by"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_projects_name"), "projects", ["name"], unique=False)

    # 3. Create sites table
    op.create_table(
        "sites",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("project_id", sa.String(length=36), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("polygon_geometry", sa.Text(), nullable=True),
        sa.Column("polygon_geojson", sa.JSON(), nullable=False),
        sa.Column("area", sa.Float(), nullable=False, server_default="0.0"),
        sa.Column("ecosystem_type", sa.String(length=100), nullable=False, server_default="Tropical Rainforest"),
        sa.Column("status", sa.String(length=50), nullable=False, server_default="Active"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["project_id"], ["projects.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_sites_project_id"), "sites", ["project_id"], unique=False)
    op.create_index(op.f("ix_sites_name"), "sites", ["name"], unique=False)

    # 4. Create analytics table
    op.create_table(
        "analytics",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("site_id", sa.String(length=36), nullable=False),
        sa.Column("carbon_score", sa.Float(), nullable=False),
        sa.Column("biodiversity_score", sa.Float(), nullable=False),
        sa.Column("vegetation_index", sa.Float(), nullable=False),
        sa.Column("canopy_cover", sa.Float(), nullable=True),
        sa.Column("soil_moisture", sa.Float(), nullable=True),
        sa.Column("timestamp", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["site_id"], ["sites.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_analytics_site_id"), "analytics", ["site_id"], unique=False)
    op.create_index(op.f("ix_analytics_timestamp"), "analytics", ["timestamp"], unique=False)


def downgrade() -> None:
    op.drop_table("analytics")
    op.drop_table("sites")
    op.drop_table("projects")
    op.drop_table("users")
