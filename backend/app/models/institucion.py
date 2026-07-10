from sqlalchemy import Column, Integer, String, Text
from geoalchemy2 import Geometry
from app.database import Base


class Institucion(Base):
    __tablename__ = "instituciones"
    
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(255), nullable=False, index=True)
    clave = Column(String(50), unique=True, index=True)
    tipo = Column(String(50), index=True)  # universidad, bachillerato, tecnologico
    subsistema = Column(String(100), index=True)  # UNAM, IPN, UAEM, etc.
    estado = Column(String(100), nullable=False, index=True)
    municipio = Column(String(100), nullable=False, index=True)
    localidad = Column(String(100))
    direccion = Column(Text)
    telefono = Column(String(50))
    email = Column(String(100))
    sitio_web = Column(String(255))
    foto_url = Column(String(500))
    servicios = Column(Text)      # JSON string: biblioteca, cafeteria, estacionamiento
    infraestructura = Column(Text) # JSON string: laboratorios, aulas, canchas
    ubicacion = Column(Geometry('POINT', srid=4326))
    
    carreras = relationship("Carrera", back_populates="institucion", cascade="all, delete-orphan")