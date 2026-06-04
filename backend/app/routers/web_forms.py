from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List

from ..db import get_db
from .. import models, schemas

router = APIRouter(prefix="/web-forms", tags=["web-forms"])


@router.get("/", response_model=List[schemas.WebFormResponse])
def get_web_forms(
    unread_only: bool = Query(default=False),
    db: Session = Depends(get_db),
):
    query = db.query(models.WebForm)

    if unread_only:
        query = query.filter(
            (models.WebForm.odczytano == 0) |
            (models.WebForm.odczytano.is_(None))
        )

    return query.order_by(models.WebForm.created_at.desc(), models.WebForm.id.desc()).all()


@router.get("/unread-count")
def get_unread_count(db: Session = Depends(get_db)):
    count = (
        db.query(models.WebForm)
        .filter(
            (models.WebForm.odczytano == 0) |
            (models.WebForm.odczytano.is_(None))
        )
        .count()
    )

    return {"count": count}


@router.put("/{form_id}/mark-read")
def mark_as_read(form_id: int, db: Session = Depends(get_db)):
    form = db.query(models.WebForm).filter(models.WebForm.id == form_id).first()

    if not form:
        raise HTTPException(status_code=404, detail="Wpis nie został znaleziony")

    form.odczytano = 1
    db.commit()

    return {"ok": True}


@router.put("/{form_id}/mark-unread")
def mark_as_unread(form_id: int, db: Session = Depends(get_db)):
    form = db.query(models.WebForm).filter(models.WebForm.id == form_id).first()

    if not form:
        raise HTTPException(status_code=404, detail="Wpis nie został znaleziony")

    form.odczytano = 0
    db.commit()

    return {"ok": True}