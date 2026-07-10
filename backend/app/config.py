"""
Configuración centralizada de PIGE.
Usa pydantic-settings para variables de entorno.
"""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://pige_user:pige_secure_2026@localhost:5432/pige_db"
    SECRET_KEY: str = "change-me-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 10080  # 7 días
    
    class Config:
        env_file = ".env"


settings = Settings()