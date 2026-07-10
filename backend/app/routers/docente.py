from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import require_rol
from app.models.usuario import RolEnum, Usuario

router = APIRouter(prefix="/docente", tags=["Docente"])


@router.get("/mis-grupos")
def mis_grupos(
    user: Usuario = Depends(require_rol(RolEnum.DOCENTE)),
    db: Session = Depends(get_db)
):
    """Retorna los grupos asignados al docente autenticado."""
    # TODO: Implementar lógica real con joins
    return {"grupos": [], "docente": user.nombre}


@router.get("/mis-materias")
def mis_materias(
    user: Usuario = Depends(require_rol(RolEnum.DOCENTE)),
    db: Session = Depends(get_db)
):
    return {"materias": []}


@router.get("/dashboard-stats")
def dashboard_docente(
    user: Usuario = Depends(require_rol(RolEnum.DOCENTE)),
    db: Session = Depends(get_db)
):
    return {
        "total_grupos": 3,
        "total_alumnos": 87,
        "actividades_pendientes": 5,
        "alertas_riesgo": 2
    }