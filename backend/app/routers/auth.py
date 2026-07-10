from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from app.database import get_db
from app.models.usuario import Usuario
from app.schemas.usuario import UsuarioCreate, UsuarioResponse
from app.security import verify_password, get_password_hash, create_access_token, create_refresh_token
from app.config import settings

router = APIRouter(prefix="/auth", tags=["Autenticación"])


@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(Usuario).filter(Usuario.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.activo:
        raise HTTPException(status_code=403, detail="Usuario inactivo")
    
    access_token = create_access_token(data={"sub": user.email, "rol": user.rol.value})
    refresh_token = create_refresh_token(data={"sub": user.email})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "usuario": UsuarioResponse.model_validate(user)
    }


@router.post("/register", response_model=UsuarioResponse)
def register(user: UsuarioCreate, db: Session = Depends(get_db)):
    if db.query(Usuario).filter(Usuario.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email ya registrado")
    
    db_user = Usuario(
        email=user.email,
        hashed_password=get_password_hash(user.password),
        nombre=user.nombre,
        apellido_paterno=user.apellido_paterno,
        apellido_materno=user.apellido_materno,
        rol=user.rol
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user