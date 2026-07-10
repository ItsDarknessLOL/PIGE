from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import datetime
from app.models.usuario import RolEnum


class UsuarioBase(BaseModel):
    email: EmailStr
    nombre: str
    apellido_paterno: str
    apellido_materno: Optional[str] = None
    rol: RolEnum = RolEnum.INVITADO


class UsuarioCreate(UsuarioBase):
    password: str


class UsuarioResponse(UsuarioBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    activo: bool
    creado_en: datetime
    ultimo_acceso: Optional[datetime] = None