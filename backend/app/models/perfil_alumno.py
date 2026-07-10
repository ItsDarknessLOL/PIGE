from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class PerfilAlumno(Base):
    __tablename__ = "perfiles_alumnos"
    
    id = Column(Integer, primary_key=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), unique=True, nullable=False)
    matricula = Column(String(50), unique=True, index=True)
    grupo_id = Column(Integer, ForeignKey("grupos.id"))
    carrera_id = Column(Integer, ForeignKey("carreras.id"))
    ingreso_anio = Column(Integer)
    estatus = Column(String(50), default="activo")  # activo, baja, egresado, titulado
    
    usuario = relationship("Usuario", back_populates="perfil_alumno")
    grupo = relationship("Grupo", back_populates="alumnos")