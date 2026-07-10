from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class Bitacora(Base):
    __tablename__ = "bitacoras"
    
    id = Column(Integer, primary_key=True)
    accion = Column(String(100), nullable=False, index=True)
    modulo = Column(String(50), index=True)
    descripcion = Column(Text)
    ip_address = Column(String(45))
    usuario_id = Column(Integer, ForeignKey("usuarios.id"))
    
    usuario = relationship("Usuario", back_populates="bitacoras")
    creado_en = Column(DateTime(timezone=True), server_default=func.now(), index=True)