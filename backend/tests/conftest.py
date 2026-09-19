import os
import pytest
from typing import Generator
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool

os.environ["ENVIRONMENT"] = "test"
os.environ["SECRET_KEY"] = "test-secret-key-at-least-32-chars-long-darukaa"
os.environ["DATABASE_URL"] = "sqlite:///:memory:"

from app.core.config import settings
settings.ENVIRONMENT = "test"
settings.DATABASE_URL = "sqlite:///:memory:"

import app.core.database as app_db
from app.db.base import Base
from app.api.deps import get_db
from app.core.security import get_password_hash, create_access_token
from app.models.user import User
from app.main import app

# Shared test engine
test_engine = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

# Rebind app_db engine
app_db.engine = test_engine
app_db.SessionLocal = TestingSessionLocal


@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=test_engine)
    yield
    Base.metadata.drop_all(bind=test_engine)


@pytest.fixture
def db() -> Generator[Session, None, None]:
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture
def client(db: Session) -> Generator[TestClient, None, None]:
    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app, raise_server_exceptions=True)
    app.dependency_overrides.clear()


@pytest.fixture
def test_admin(db: Session) -> User:
    # Check if already exists in session
    existing = db.query(User).filter(User.email == "testadmin@darukaa.earth").first()
    if existing:
        return existing
    user = User(
        name="Test Admin",
        email="testadmin@darukaa.earth",
        password_hash=get_password_hash("AdminPass123!"),
        role="admin",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture
def admin_token(test_admin: User) -> str:
    return create_access_token(test_admin.id)


@pytest.fixture
def auth_headers(admin_token: str) -> dict:
    return {"Authorization": f"Bearer {admin_token}"}
