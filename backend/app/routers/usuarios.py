from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.usuario import Usuario, RolEnum
from app.schemas.usuario import UsuarioResponse
from app.dependencies import require_rol

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])


@router.get("/", response_model=List[UsuarioResponse])
def list_usuarios(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_rol(RolEnum.ADMIN))
):
    """Listado completo de usuarios. Solo administradores."""
    return db.query(Usuario).all()