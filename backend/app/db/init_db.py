from sqlalchemy.orm import Session
from app.db.base import Base
from app.core.database import engine
from app.db.seed_data import seed_database


def init_db(db: Session) -> None:
    # Create tables if not exist
    Base.metadata.create_all(bind=engine)
    # Seed default data
    seed_database(db)
