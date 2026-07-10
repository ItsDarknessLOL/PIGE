"""
Inicialización de esquema y extensión PostGIS.
"""
from sqlalchemy import text
from app.database import engine, Base
from app.models import *  # noqa


def init():
    with engine.connect() as conn:
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS postgis;"))
        conn.commit()
    Base.metadata.create_all(bind=engine)
    print("✅ Base de datos inicializada correctamente")