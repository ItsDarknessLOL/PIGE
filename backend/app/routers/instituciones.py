from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.institucion import Institucion
from app.schemas.institucion import InstitucionResponse
from geoalchemy2.shape import to_shape

router = APIRouter(prefix="/instituciones", tags=["Instituciones - SIG"])


@router.get("/", response_model=List[InstitucionResponse])
def list_instituciones(
    estado: Optional[str] = Query(None),
    municipio: Optional[str] = Query(None),
    subsistema: Optional[str] = Query(None),
    tipo: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Endpoint del módulo Invitado/SIG.
    Retorna instituciones con coordenadas lat/lng extraídas de PostGIS.
    """
    query = db.query(Institucion)
    if estado:
        query = query.filter(Institucion.estado.ilike(f"%{estado}%"))
    if municipio:
        query = query.filter(Institucion.municipio.ilike(f"%{municipio}%"))
    if subsistema:
        query = query.filter(Institucion.subsistema.ilike(f"%{subsistema}%"))
    if tipo:
        query = query.filter(Institucion.tipo == tipo)
    
    results = []
    for inst in query.all():
        data = {
            "id": inst.id,
            "nombre": inst.nombre,
            "clave": inst.clave,
            "tipo": inst.tipo,
            "subsistema": inst.subsistema,
            "estado": inst.estado,
            "municipio": inst.municipio,
            "localidad": inst.localidad,
            "direccion": inst.direccion,
            "telefono": inst.telefono,
            "email": inst.email,
            "sitio_web": inst.sitio_web,
            "foto_url": inst.foto_url,
            "servicios": inst.servicios,
            "infraestructura": inst.infraestructura,
            "lat": None,
            "lng": None
        }
        if inst.ubicacion:
            point = to_shape(inst.ubicacion)
            data["lat"] = point.y
            data["lng"] = point.x
        results.append(InstitucionResponse.model_validate(data))
    return results