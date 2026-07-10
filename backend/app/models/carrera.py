from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Carrera(Base):
    __tablename__ = "carreras"
    
    id = Column(Integer, primary_key=True)
    nombre = Column(String(200), nullable=False)
    clave = Column(String(50))
    nivel = Column(String(50))  # licenciatura, maestria, bachillerato, tsu
    duracion_semestres = Column(Integer, default=8)
    institucion_id = Column(Integer, ForeignKey("instituciones.id"), nullable=False)
    
    institucion = relationship("Institucion", back_populates="carreras")
    materias = relationship("Materia", back_populates="carrera", cascade="all, delete-orphan")
    grupos = relationship("Grupo", back_populates="carrera")