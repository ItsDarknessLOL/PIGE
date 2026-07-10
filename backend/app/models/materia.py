from sqlalchemy import Column, Integer, String, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from app.database import Base


class Materia(Base):
    __tablename__ = "materias"
    
    id = Column(Integer, primary_key=True)
    nombre = Column(String(200), nullable=False)
    clave = Column(String(50))
    creditos = Column(Integer, default=0)
    semestre = Column(Integer)
    carrera_id = Column(Integer, ForeignKey("carreras.id"), nullable=False)
    docente_id = Column(Integer, ForeignKey("perfiles_docentes.id"))
    
    carrera = relationship("Carrera", back_populates="materias")
    docente = relationship("PerfilDocente", back_populates="materias")