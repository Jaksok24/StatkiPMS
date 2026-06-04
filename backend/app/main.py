from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

from .db import Base, engine
from sqlalchemy.orm import Session
from .auth import hash_password
from . import models
from .db import SessionLocal

from .routers import (
    cruises,
    reservations,
    ships,
    schedule,
    breaks,
    auth_routes,
    users,
    health,
    history,
    web_forms,
    dashboard
)

# =========================================
# APP
# =========================================

app = FastAPI(
    title="StatkiPMS API",
    version="1.0.2"
)

# =========================================
# CORS
# =========================================

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================================
# TRUSTED HOST
# =========================================

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=[
        "localhost",
        "127.0.0.1",
        "*"
    ]
)

# =========================================
# DATABASE
# =========================================

Base.metadata.create_all(bind=engine)

from sqlalchemy.orm import Session

from .db import SessionLocal
from . import models
from .auth import hash_password


def create_admin():
    db: Session = SessionLocal()

    try:
        existing_admin = (
            db.query(models.User)
            .filter(models.User.username == "admin")
            .first()
        )

        if existing_admin:
            print("ℹ️ Admin already exists")
            return

        admin = models.User(
            username="admin",
            email="admin@example.com",
            hashed_password=hash_password("zaq1@WSX"),
            role="admin",
            is_active=True,
        )

        db.add(admin)
        db.commit()

        print("✅ Admin account created")

    except Exception as e:
        print(f"❌ Error creating admin: {e}")

    finally:
        db.close()


create_admin()

# =========================================
# ROUTERS
# =========================================

app.include_router(auth_routes.router)
app.include_router(users.router)

app.include_router(cruises.router)
app.include_router(reservations.router)
app.include_router(ships.router)

app.include_router(schedule.router)
app.include_router(breaks.router)

app.include_router(history.router)
app.include_router(web_forms.router)
app.include_router(dashboard.router)

app.include_router(health.router)

# =========================================
# ROOT
# =========================================

@app.get("/")
def root():
    return {
        "message": "API działa poprawnie"
    }

# =========================================
# DATABASE
# =========================================

Base.metadata.create_all(bind=engine)


def create_admin():
    db: Session = SessionLocal()

    existing_admin = (
        db.query(models.User)
        .filter(models.User.username == "admin")
        .first()
    )

    if not existing_admin:
        admin = models.User(
            username="admin",
            email="admin@example.com",
            hashed_password=hash_password("admin123"),
            role="admin",
            is_active=True,
        )

        db.add(admin)
        db.commit()

        print("✅ Admin account created")
    else:
        print("ℹ️ Admin already exists")

    db.close()


create_admin()