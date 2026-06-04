from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas
from ..db import get_db
from .auth_routes import get_current_user, require_admin

router = APIRouter(prefix="/cruises", tags=["cruises"])


@router.post("/", response_model=schemas.CruiseResponse)
def create_cruise(
    data: schemas.CruiseCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin),
):
    clean_name = data.name.strip()

    if not clean_name:
        raise HTTPException(status_code=400, detail="Cruise name cannot be empty")

    if data.duration <= 0:
        raise HTTPException(status_code=400, detail="Duration must be greater than 0")

    cruise = models.Cruise(
        name=clean_name,
        duration=data.duration,
    )

    db.add(cruise)
    db.commit()
    db.refresh(cruise)
    return cruise


@router.get("/", response_model=list[schemas.CruiseResponse])
def get_cruises(
    db: Session = Depends(get_db),
    current_user = Depends(require_admin),
):
    return db.query(models.Cruise).all()


@router.put("/{cruise_id}", response_model=schemas.CruiseResponse)
def update_cruise(
    cruise_id: int,
    data: schemas.CruiseUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin),
):
    cruise = db.query(models.Cruise).filter(models.Cruise.id == cruise_id).first()

    if not cruise:
        raise HTTPException(status_code=404, detail="Cruise not found")

    update_data = data.model_dump(exclude_unset=True)

    if "name" in update_data and update_data["name"] is not None:
        clean_name = update_data["name"].strip()
        if not clean_name:
            raise HTTPException(status_code=400, detail="Cruise name cannot be empty")
        cruise.name = clean_name

    if "duration" in update_data and update_data["duration"] is not None:
        if update_data["duration"] <= 0:
            raise HTTPException(status_code=400, detail="Duration must be greater than 0")
        cruise.duration = update_data["duration"]

    db.commit()
    db.refresh(cruise)
    return cruise


@router.delete("/{cruise_id}")
def delete_cruise(
    cruise_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin),
):
    cruise = db.query(models.Cruise).filter(models.Cruise.id == cruise_id).first()

    if not cruise:
        raise HTTPException(status_code=404, detail="Cruise not found")

    db.delete(cruise)
    db.commit()
    return {"message": "Cruise deleted"}