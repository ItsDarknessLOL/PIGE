from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Grupo(Base):
    __tablename__ = "grupos"
    
    id = Column(Integer, primary_key=True)
    nombre = Column(String(50), nullable=False)
    generacion = Column(String(20))
    carrera_id = Column(Integer, ForeignKey("carreras.id"), nullable=False)
    
    carrera = relationship("Carrera", back_populates="grupos")
    alumnos = relationship("PerfilAlumno", back_populates="grupo")