from sqlalchemy import Column, Integer, Numeric, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.database import Base


class Calificacion(Base):
    __tablename__ = "calificaciones"
    
    id = Column(Integer, primary_key=True)
    valor = Column(Numeric(5, 2), nullable=False)
    tipo = Column(String(50), default="ordinario")
    actividad_id = Column(Integer, ForeignKey("actividades.id"))
    alumno_id = Column(Integer, ForeignKey("perfiles_alumnos.id"), nullable=False)
    creado_en = Column(DateTime(timezone=True), server_default=func.now())