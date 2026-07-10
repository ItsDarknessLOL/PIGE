"""
Conexión a PostgreSQL + PostGIS con SQLAlchemy.
Patrón SessionLocal para inyección de dependencias.
"""
from sqlalchemy import create_engine, event
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
    echo=False
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """Generador de sesiones para FastAPI Depends."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@event.listens_for(engine, "connect")
def on_connect(dbapi_conn, connection_record):
    """Configura zona horaria y extensiones por conexión."""
    cursor = dbapi_conn.cursor()
    cursor.execute("SET TIME ZONE 'America/Mexico_City'")
    cursor.close()