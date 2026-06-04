from datetime import date
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import models
from ..db import get_db
from .auth_routes import get_current_user

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/summary")
def get_dashboard_summary(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    today = date.today()

    reservations_today = (
        db.query(models.Reservation)
        .filter(models.Reservation.date == today)
        .count()
    )

    breaks_today = (
        db.query(models.Break)
        .filter(models.Break.date == today)
        .count()
    )

    unread_web_forms = (
        db.query(models.WebForm)
        .filter(
            (models.WebForm.odczytano == 0) |
            (models.WebForm.odczytano.is_(None))
        )
        .count()
    )

    return {
        "reservations_today": reservations_today,
        "breaks_today": breaks_today,
        "unread_web_forms": unread_web_forms,
        "schedule_items_today": reservations_today + breaks_today,
    }