from datetime import datetime, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import models
from ..db import get_db

router = APIRouter(prefix="/schedule", tags=["schedule"])


@router.get("/")
def get_schedule(date: str, db: Session = Depends(get_db)):
    selected_date = datetime.strptime(date, "%Y-%m-%d").date()

    reservations = (
        db.query(models.Reservation)
        .filter(models.Reservation.date == selected_date)
        .all()
    )

    result = []

    for r in reservations:
      cruise = r.cruise
      start_time = datetime.combine(selected_date, r.hour)
      end_time = start_time + timedelta(minutes=cruise.duration)

      result.append({
          "id": r.id,
          "ship": r.ship,
          "cruise_name": cruise.name,
          "people": r.people,
          "start": start_time.strftime("%H:%M"),
          "end": end_time.strftime("%H:%M"),
      })

    result.sort(key=lambda x: (x["ship"], x["start"]))
    return result