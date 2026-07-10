"""
Punto de entrada de la API REST de PIGE.
Configura CORS, middleware de seguridad y monta routers modulares.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from app.database import engine
from app.init_db import init
from app.routers import auth, usuarios, instituciones, docente, alumno, analitica, ia

app = FastAPI(
    title="PIGE API",
    description="Plataforma Inteligente para la Gestión Educativa - Beta 0.1.0",
    version="0.1.0-beta",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configurado para desarrollo. En producción, restringir orígenes.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers modulares
app.include_router(auth.router)
app.include_router(usuarios.router)
app.include_router(instituciones.router)
app.include_router(docente.router)
app.include_router(alumno.router)
app.include_router(analitica.router)
app.include_router(ia.router)


@app.on_event("startup")
async def startup_event():
    with engine.connect() as conn:
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS postgis;"))
        conn.commit()
    init()


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "pige-api", "version": "0.1.0-beta"}