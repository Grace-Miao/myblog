from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .database import engine, Base
from .routers import health, posts, auth

# Import models so SQLAlchemy registers them before create_all
from .models import user, post  # noqa: F401

app = FastAPI(
    title="MyBlog API",
    version="0.1.0",
    docs_url="/docs",      # Swagger UI: http://localhost:8000/docs
    redoc_url="/redoc",    # ReDoc:      http://localhost:8000/redoc
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(posts.router, prefix="/api")
app.include_router(auth.router, prefix="/api")


@app.on_event("startup")
def create_tables():
    # Week 1: 直接建表，Week 5 换成 Alembic 迁移
    Base.metadata.create_all(bind=engine)
