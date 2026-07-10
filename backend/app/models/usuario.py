import enum
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum, event
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class RolEnum(str, enum.Enum):
    ADMIN = "administrador"
    DOCENTE = "docente"
    ALUMNO = "alumno"
    INVITADO = "invitado"


class Usuario(Base):
    __tablename__ = "usuarios"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    nombre = Column(String(100), nullable=False)
    apellido_paterno = Column(String(100), nullable=False)
    apellido_materno = Column(String(100), nullable=True)
    rol = Column(Enum(RolEnum), default=RolEnum.INVITADO, nullable=False, index=True)
    activo = Column(Boolean, default=True)
    ultimo_acceso = Column(DateTime(timezone=True), nullable=True)
    creado_en = Column(DateTime(timezone=True), server_default=func.now())
    actualizado_en = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
    
    # Relaciones
    perfil_docente = relationship("PerfilDocente", back_populates="usuario", uselist=False)
    perfil_alumno = relationship("PerfilAlumno", back_populates="usuario", uselist=False)
    bitacoras = relationship("Bitacora", back_populates="usuario", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Usuario {self.email} ({self.rol})>"


@event.listens_for(Usuario, 'before_update')
def receive_before_update(mapper, connection, target):
    """Actualiza timestamp automáticamente."""
    target.actualizado_en = func.now()