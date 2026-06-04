from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas
from ..auth import hash_password
from ..db import get_db
from .auth_routes import get_current_user, require_admin

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/", response_model=list[schemas.UserResponse])
def get_users(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_admin),
):
    return db.query(models.User).order_by(models.User.id.asc()).all()


@router.post("/", response_model=schemas.UserResponse)
def create_user(
    data: schemas.UserCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_admin),
):
    existing_username = db.query(models.User).filter(models.User.username == data.username).first()
    if existing_username:
        raise HTTPException(status_code=400, detail="Username already exists")

    existing_email = db.query(models.User).filter(models.User.email == data.email).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already exists")

    if data.role not in ["admin", "worker"]:
        raise HTTPException(status_code=400, detail="Invalid role")

    user = models.User(
        username=data.username.strip(),
        email=data.email.strip().lower(),
        hashed_password=hash_password(data.password),
        role=data.role,
        is_active=True,
    )

    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.put("/{user_id}", response_model=schemas.UserResponse)
def update_user(
    user_id: int,
    data: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_admin),
):
    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    update_data = data.model_dump(exclude_unset=True)

    if "username" in update_data and update_data["username"]:
        existing_username = (
            db.query(models.User)
            .filter(models.User.username == update_data["username"], models.User.id != user_id)
            .first()
        )
        if existing_username:
            raise HTTPException(status_code=400, detail="Username already exists")
        user.username = update_data["username"].strip()

    if "email" in update_data:
        if update_data["email"]:
            normalized_email = update_data["email"].strip().lower()

            existing_email = (
                db.query(models.User)
                .filter(models.User.email == normalized_email, models.User.id != user_id)
                .first()
            )
            if existing_email:
                raise HTTPException(status_code=400, detail="Email already exists")

            user.email = normalized_email
        else:
            user.email = None

    if "role" in update_data and update_data["role"] is not None:
        if update_data["role"] not in ["admin", "worker"]:
            raise HTTPException(status_code=400, detail="Invalid role")
        user.role = update_data["role"]

    if "is_active" in update_data and update_data["is_active"] is not None:
        user.is_active = update_data["is_active"]

    if "password" in update_data and update_data["password"]:
        user.hashed_password = hash_password(update_data["password"])

    db.commit()
    db.refresh(user)
    return user


@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_admin),
):
    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.id == current_user.id:
        raise HTTPException(status_code=400, detail="You cannot delete your own account")

    db.delete(user)
    db.commit()
    return {"message": "User deleted"}