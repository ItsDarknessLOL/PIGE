from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class PerfilDocente(Base):
    __tablename__ = "perfiles_docentes"
    
    id = Column(Integer, primary_key=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), unique=True, nullable=False)
    cedula_profesional = Column(String(50))
    especialidad = Column(String(200))
    grado_estudios = Column(String(100))  # licenciatura, maestría, doctorado
    
    usuario = relationship("Usuario", back_populates="perfil_docente")
    materias = relationship("Materia", back_populates="docente")
    actividades = relationship("Actividad", back_populates="docente")