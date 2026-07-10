from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import require_rol
from app.models.usuario import RolEnum, Usuario

router = APIRouter(prefix="/alumno", tags=["Alumno"])


@router.get("/mi-horario")
def mi_horario(user: Usuario = Depends(require_rol(RolEnum.ALUMNO)), db: Session = Depends(get_db)):
    return {"horario": []}


@router.get("/mis-calificaciones")
def mis_calificaciones(user: Usuario = Depends(require_rol(RolEnum.ALUMNO)), db: Session = Depends(get_db)):
    return {"promedio_general": 8.7, "materias": []}


@router.get("/mis-tareas")
def mis_tareas(user: Usuario = Depends(require_rol(RolEnum.ALUMNO)), db: Session = Depends(get_db)):
    return {"pendientes": 4, "proxima_entrega": "2026-07-15T23:59:00"}