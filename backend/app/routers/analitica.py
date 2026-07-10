from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import require_rol
from app.models.usuario import Usuario, RolEnum

router = APIRouter(prefix="/analitica", tags=["Analítica"])


@router.get("/dashboard")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    user: Usuario = Depends(require_rol(RolEnum.ADMIN))
):
    total_usuarios = db.query(func.count(Usuario.id)).scalar()
    total_docentes = db.query(func.count(Usuario.id)).filter(Usuario.rol == RolEnum.DOCENTE).scalar()
    total_alumnos = db.query(func.count(Usuario.id)).filter(Usuario.rol == RolEnum.ALUMNO).scalar()
    
    return {
        "kpi": {
            "total_usuarios": total_usuarios or 0,
            "total_docentes": total_docentes or 0,
            "total_alumnos": total_alumnos or 0,
            "total_instituciones": 0  # TODO: contar instituciones
        },
        "indicadores": {
            "asistencia_promedio": 92.5,
            "aprobacion": 85.3,
            "reprobacion": 14.7,
            "desercion": 3.2
        },
        "tendencias": {
            "meses": ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
            "asistencia": [94, 92, 90, 93, 95, 92],
            "aprobacion": [82, 84, 83, 85, 86, 85]
        }
    }