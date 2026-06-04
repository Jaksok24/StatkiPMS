from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .auth_routes import get_current_user
from .. import models, schemas
from ..db import get_db
from ..utils.schedule_conflicts import overlaps, reservation_range, break_range

SHIPS = [
    "Albatros",
    "Perkoz",
    "Kormoran",
    "CKT VIP"
]

router = APIRouter(prefix="/reservations", tags=["reservations"])

def validate_ship(ship: str):
    if ship not in SHIPS:
        raise HTTPException(status_code=404, detail="Ship not found")

def validate_cruise(db: Session, cruise_id: int):
    cruise = db.query(models.Cruise).get(cruise_id)
    if not cruise:
        raise HTTPException(status_code=404, detail="Cruise not found")
    return cruise

@router.post("/", response_model=schemas.ReservationResponse)
def create_reservation(
    data: schemas.ReservationCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    reservation = models.Reservation(
        **data.model_dump(),
        created_by_user_id=current_user.id,
    )

    cruise = validate_cruise(db, data.cruise_id)

    new_start, new_end = reservation_range(data.date, data.hour, cruise.duration)

    same_ship_reservations = (
        db.query(models.Reservation)
        .join(models.Cruise)
        .filter(
            models.Reservation.ship == data.ship,
            models.Reservation.date == data.date,
        )
        .all()
    )

    for existing in same_ship_reservations:
        existing_start, existing_end = reservation_range(
            existing.date,
            existing.hour,
            existing.cruise.duration,
        )
        if overlaps(new_start, new_end, existing_start, existing_end):
            raise HTTPException(
                status_code=400,
                detail=f"Statek {data.ship} jest już zajęty w tym czasie."
            )

    same_ship_breaks = (
        db.query(models.Break)
        .filter(
            models.Break.ship == data.ship,
            models.Break.date == data.date,
        )
        .all()
    )

    for existing_break in same_ship_breaks:
        break_start, break_end = break_range(
            existing_break.date,
            existing_break.start_time,
            existing_break.end_time,
        )
        if overlaps(new_start, new_end, break_start, break_end):
            raise HTTPException(
                status_code=400,
                detail=f"Statek {data.ship} ma w tym czasie przerwę."
            )

    db.add(reservation)
    db.commit()
    db.refresh(reservation)
    return reservation

@router.get("/", response_model=list[schemas.ReservationResponse])
def get_reservations(db: Session = Depends(get_db)):
    return db.query(models.Reservation).all()

@router.put("/{reservation_id}", response_model=schemas.ReservationResponse)
def update_reservation(
    reservation_id: int,
    data: schemas.ReservationUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    reservation = (
        db.query(models.Reservation)
        .filter(models.Reservation.id == reservation_id)
        .first()
    )

    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")

    update_data = data.model_dump(exclude_unset=True)

    if "cruise_id" in update_data and update_data["cruise_id"] is not None:
        cruise = (
            db.query(models.Cruise)
            .filter(models.Cruise.id == update_data["cruise_id"])
            .first()
        )
        if not cruise:
            raise HTTPException(status_code=404, detail="Cruise not found")
        reservation.cruise_id = update_data["cruise_id"]

    if "customer" in update_data and update_data["customer"] is not None:
        reservation.customer = update_data["customer"]

    if "phone" in update_data and update_data["phone"] is not None:
        reservation.phone = update_data["phone"]

    if "date" in update_data and update_data["date"] is not None:
        reservation.date = update_data["date"]

    if "hour" in update_data and update_data["hour"] is not None:
        reservation.hour = update_data["hour"]

    if "ship" in update_data and update_data["ship"] is not None:
        reservation.ship = update_data["ship"]

    if "people" in update_data and update_data["people"] is not None:
        reservation.people = update_data["people"]

    if "fee" in update_data and update_data["fee"] is not None:
        reservation.fee = update_data["fee"]

    if "catering" in update_data and update_data["catering"] is not None:
        reservation.catering = update_data["catering"]

    if "note" in update_data:
        reservation.note = update_data["note"]

    db.commit()
    db.refresh(reservation)
    return reservation

@router.delete("/{reservation_id}")
def delete_reservation(reservation_id: int, db: Session = Depends(get_db)):
    reservation = db.query(models.Reservation).get(reservation_id)

    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")

    db.delete(reservation)
    db.commit()
    return {"message": "Reservation deleted"}