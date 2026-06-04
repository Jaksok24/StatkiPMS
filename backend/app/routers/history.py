from datetime import datetime
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from .. import models
from ..db import get_db
from .auth_routes import get_current_user

router = APIRouter(prefix="/history", tags=["history"])


@router.get("/")
def get_history(
    date_from: str | None = Query(default=None),
    date_to: str | None = Query(default=None),
    ship: str | None = Query(default=None),
    type: str | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    reservations_query = db.query(models.Reservation)
    breaks_query = db.query(models.Break)

    if date_from:
        parsed_from = datetime.strptime(date_from, "%Y-%m-%d").date()
        reservations_query = reservations_query.filter(models.Reservation.date >= parsed_from)
        breaks_query = breaks_query.filter(models.Break.date >= parsed_from)

    if date_to:
        parsed_to = datetime.strptime(date_to, "%Y-%m-%d").date()
        reservations_query = reservations_query.filter(models.Reservation.date <= parsed_to)
        breaks_query = breaks_query.filter(models.Break.date <= parsed_to)

    if ship:
        reservations_query = reservations_query.filter(models.Reservation.ship == ship)
        breaks_query = breaks_query.filter(models.Break.ship == ship)

    items = []

    if type in (None, "", "all", "reservation"):
        reservations = reservations_query.all()
        for r in reservations:
            items.append(
                {
                    "id": r.id,
                    "type": "reservation",
                    "date": r.date.isoformat() if r.date else None,
                    "time_start": r.hour.strftime("%H:%M") if r.hour else None,
                    "ship": r.ship,
                    "title": r.cruise.name if r.cruise else "Brak rejsu",
                    "customer": r.customer,
                    "people": r.people,
                    "fee": r.fee,
                    "note": r.note,
                    "created_at": r.created_at.isoformat() if r.created_at else None,
                    "created_by": r.created_by_user.username if r.created_by_user else None,
                }
            )

    if type in (None, "", "all", "break"):
        breaks = breaks_query.all()
        for b in breaks:
            items.append(
                {
                    "id": b.id,
                    "type": "break",
                    "date": b.date.isoformat() if b.date else None,
                    "time_start": b.start_time.strftime("%H:%M") if b.start_time else None,
                    "time_end": b.end_time.strftime("%H:%M") if b.end_time else None,
                    "ship": b.ship,
                    "title": "Przerwa",
                    "customer": None,
                    "people": None,
                    "fee": None,
                    "note": b.note,
                    "created_at": b.created_at.isoformat() if b.created_at else None,
                    "created_by": b.created_by_user.username if b.created_by_user else None,
                }
            )

    items.sort(
        key=lambda x: (
            x["date"] or "",
            x["time_start"] or "",
            x["ship"] or "",
            x["type"] or "",
        ),
        reverse=True,
    )

    return items