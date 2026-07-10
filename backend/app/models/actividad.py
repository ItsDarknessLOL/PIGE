from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Numeric
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class Actividad(Base):
    __tablename__ = "actividades"
    
    id = Column(Integer, primary_key=True)
    titulo = Column(String(200), nullable=False)
    descripcion = Column(Text)
    tipo = Column(String(50), nullable=False, index=True)  # tarea, examen, proyecto, rubrica
    fecha_creacion = Column(DateTime(timezone=True), server_default=func.now())
    fecha_entrega = Column(DateTime(timezone=True))
    ponderacion = Column(Numeric(5, 2), default=0)
    materia_id = Column(Integer, ForeignKey("materias.id"))
    docente_id = Column(Integer, ForeignKey("perfiles_docentes.id"))
    
    docente = relationship("PerfilDocente", back_populates="actividades")