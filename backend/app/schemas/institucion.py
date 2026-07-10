from pydantic import BaseModel, ConfigDict
from typing import Optional


class InstitucionBase(BaseModel):
    nombre: str
    clave: Optional[str] = None
    tipo: Optional[str] = None
    subsistema: Optional[str] = None
    estado: Optional[str] = None
    municipio: Optional[str] = None
    localidad: Optional[str] = None
    direccion: Optional[str] = None
    telefono: Optional[str] = None
    email: Optional[str] = None
    sitio_web: Optional[str] = None
    foto_url: Optional[str] = None
    servicios: Optional[str] = None
    infraestructura: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None


class InstitucionResponse(InstitucionBase):
    model_config = ConfigDict(from_attributes=True)
    id: int