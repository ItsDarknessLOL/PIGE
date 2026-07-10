from sqlalchemy import Column, Integer, String, Date, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.database import Base


class Asistencia(Base):
    __tablename__ = "asistencias"
    
    id = Column(Integer, primary_key=True)
    fecha = Column(Date, nullable=False, index=True)
    estado = Column(String(20), default="presente", index=True)
    alumno_id = Column(Integer, ForeignKey("perfiles_alumnos.id"), nullable=False)
    materia_id = Column(Integer, ForeignKey("materias.id"), nullable=False)
    creado_en = Column(DateTime(timezone=True), server_default=func.now())