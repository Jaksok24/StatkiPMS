from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    Date,
    Time,
    ForeignKey,
    DateTime,
)
from sqlalchemy.orm import relationship
from datetime import datetime

from .db import Base


# =========================================
# CRUISES
# =========================================

class Cruise(Base):
    __tablename__ = "app_cruises"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(255), nullable=False)
    duration = Column(Integer, nullable=False)

    reservations = relationship(
        "Reservation",
        back_populates="cruise",
        cascade="all, delete"
    )


# =========================================
# RESERVATIONS
# =========================================

class Reservation(Base):
    __tablename__ = "app_reservations"

    id = Column(Integer, primary_key=True, index=True)

    cruise_id = Column(
        Integer,
        ForeignKey("app_cruises.id"),
        nullable=False
    )

    customer = Column(String(255), nullable=False)
    phone = Column(String(100), nullable=True)

    date = Column(Date, nullable=False)
    hour = Column(Time, nullable=False)

    ship = Column(String(100), nullable=False)

    people = Column(Integer, nullable=False, default=1)
    fee = Column(Integer, nullable=False, default=0)

    catering = Column(Boolean, default=False)
    note = Column(String(500), nullable=True)

    created_by_user_id = Column(
        Integer,
        ForeignKey("app_users.id"),
        nullable=True
    )

    created_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow
    )

    created_by_user = relationship(
        "User",
        foreign_keys=[created_by_user_id]
    )

    cruise = relationship(
        "Cruise",
        back_populates="reservations"
    )


# =========================================
# BREAKS
# =========================================

class Break(Base):
    __tablename__ = "app_breaks"

    id = Column(Integer, primary_key=True, index=True)

    date = Column(Date, nullable=False)

    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)

    ship = Column(String(100), nullable=False)

    note = Column(String(500), nullable=True)

    created_by_user_id = Column(
        Integer,
        ForeignKey("app_users.id"),
        nullable=True
    )

    created_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow
    )

    created_by_user = relationship(
        "User",
        foreign_keys=[created_by_user_id]
    )


# =========================================
# USERS
# =========================================

class User(Base):
    __tablename__ = "app_users"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(
        String(255),
        unique=True,
        nullable=False,
        index=True
    )

    email = Column(
        String(255),
        unique=True,
        nullable=True,
        index=True
    )

    hashed_password = Column(String(255), nullable=False)

    role = Column(
        String(100),
        nullable=False,
        default="worker"
    )

    is_active = Column(
        Boolean,
        nullable=False,
        default=True
    )

    created_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow
    )


# =========================================
# WEB FORM
# =========================================

class WebForm(Base):
    __tablename__ = "app_webforms"

    id = Column(Integer, primary_key=True, index=True)

    imie_nazwisko = Column(String(255), nullable=False)

    email = Column(String(255), nullable=True)

    nr_tel = Column(String(50), nullable=False)

    dzien = Column(Date, nullable=False)
    godzina = Column(Time, nullable=False)

    rejs = Column(String(255), nullable=False)

    liczba_ludzi = Column(Integer, nullable=False)

    catering = Column(String(20), nullable=True)

    miejsce_catering = Column(String(255), nullable=True)

    zgoda_rodo = Column(Boolean, default=False)

    odczytano = Column(Boolean, default=False)

    created_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow
    )
