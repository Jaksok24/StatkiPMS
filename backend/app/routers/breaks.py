from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .auth_routes import get_current_user
from .. import models, schemas
from ..db import get_db
from ..utils.schedule_conflicts import overlaps, reservation_range, break_range

router = APIRouter(prefix="/breaks", tags=["breaks"])

SHIPS = [
    "Albatros",
    "Perkoz",
    "Kormoran",
    "CKT VIP"
]


def validate_ship(ship: str):
    if ship not in SHIPS:
        raise HTTPException(status_code=400, detail="Invalid ship")


def validate_time_range(start_time, end_time):
    if end_time <= start_time:
        raise HTTPException(
            status_code=400,
            detail="End time must be later than start time"
        )


@router.post("/", response_model=schemas.BreakResponse)
def create_breaks(
    data: schemas.ReservationCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    breaks = models.Break(
        **data.model_dump(),
        created_by_user_id=current_user.id,
    )

    new_start, new_end = break_range(data.date, data.start_time, data.end_time)

    same_ship_reservations = (
        db.query(models.Reservation)
        .join(models.Cruise)
        .filter(
            models.Reservation.ship == data.ship,
            models.Reservation.date == data.date,
        )
        .all()
    )

    for reservation in same_ship_reservations:
        reservation_start, reservation_end = reservation_range(
            reservation.date,
            reservation.hour,
            reservation.cruise.duration,
        )
        if overlaps(new_start, new_end, reservation_start, reservation_end):
            raise HTTPException(
                status_code=400,
                detail=f"Statek {data.ship} ma już zaplanowany rejs w tym czasie."
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
                detail=f"Statek {data.ship} ma już inną przerwę w tym czasie."
            )

    db.add(breaks)
    db.commit()
    db.refresh(breaks)
    return breaks


@router.get("/", response_model=list[schemas.BreakResponse])
def get_breaks(db: Session = Depends(get_db)):
    return db.query(models.Break).all()


@router.delete("/{break_id}")
def delete_break(break_id: int, db: Session = Depends(get_db)):
    item = db.query(models.Break).filter(models.Break.id == break_id).first()

    if not item:
        raise HTTPException(status_code=404, detail="Break not found")

    db.delete(item)
    db.commit()
    return {"message": "Break deleted"}