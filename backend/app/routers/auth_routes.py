from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas
from ..auth import (
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password,
)
from ..db import get_db

router = APIRouter(prefix="/auth", tags=["auth"])


def get_current_user(
    authorization: str | None = Header(default=None),
    db: Session = Depends(get_db),
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")

    token = authorization.replace("Bearer ", "")
    payload = decode_access_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    user = db.query(models.User).filter(models.User.id == int(user_id)).first()

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    if not user.is_active:
        raise HTTPException(status_code=403, detail="User is inactive")

    return user


def require_admin(current_user: models.User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


@router.post("/register", response_model=schemas.UserResponse)
def register_user(data: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_username = (
        db.query(models.User).filter(models.User.username == data.username).first()
    )
    if existing_username:
        raise HTTPException(status_code=400, detail="Username already exists")

    if data.email:
        existing_email = (
            db.query(models.User)
            .filter(models.User.email == data.email)
            .first()
        )
        if existing_email:
            raise HTTPException(status_code=400, detail="Email already exists")

    if data.role not in ["admin", "worker"]:
        raise HTTPException(status_code=400, detail="Invalid role")

    user = models.User(
        username=data.username.strip(),
        email=data.email.strip().lower() if data.email else None,
        hashed_password=hash_password(data.password),
        role=data.role,
        is_active=True,
    )

    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login", response_model=schemas.TokenResponse)
def login(data: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == data.username).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    if not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    if not user.is_active:
        raise HTTPException(status_code=403, detail="User is inactive")

    token = create_access_token(
        {
            "sub": str(user.id),
            "role": user.role,
            "username": user.username,
        }
    )

    return {"access_token": token, "token_type": "bearer"}


@router.get("/me", response_model=schemas.UserResponse)
def me(current_user: models.User = Depends(get_current_user)):
    return current_user