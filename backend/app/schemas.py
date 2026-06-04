from datetime import date as dt_date, time as dt_time, datetime
from typing import Optional

from pydantic import BaseModel, Field, ConfigDict, EmailStr


# =========================================
# CRUISES
# =========================================

class CruiseCreate(BaseModel):
    name: str = Field(..., min_length=1)
    duration: int = Field(..., gt=0)


class CruiseResponse(BaseModel):
    id: int
    name: str
    duration: int

    model_config = ConfigDict(from_attributes=True)


class CruiseUpdate(BaseModel):
    name: str | None = Field(None, min_length=1)
    duration: int | None = Field(None, gt=0)


# =========================================
# RESERVATIONS
# =========================================

class ReservationCreate(BaseModel):
    cruise_id: int
    customer: str
    phone: str
    date: dt_date
    hour: dt_time
    ship: str

    people: int = Field(..., ge=1, le=60)

    fee: int

    catering: bool = False
    note: str | None = None


class ReservationResponse(ReservationCreate):
    id: int

    model_config = ConfigDict(from_attributes=True)


class ReservationUpdate(BaseModel):
    cruise_id: int | None = None
    customer: str | None = None
    phone: str | None = None

    date: dt_date | None = None
    hour: dt_time | None = None

    ship: str | None = None

    people: int | None = Field(None, ge=1, le=60)

    fee: int | None = None

    catering: bool | None = None
    note: str | None = None


# =========================================
# BREAKS
# =========================================

class BreakCreate(BaseModel):
    date: dt_date
    start_time: dt_time
    end_time: dt_time

    ship: str

    note: str | None = None


class BreakResponse(BreakCreate):
    id: int

    model_config = ConfigDict(from_attributes=True)


class BreakUpdate(BaseModel):
    date: dt_date | None = None

    start_time: dt_time | None = None
    end_time: dt_time | None = None

    ship: str | None = None

    note: str | None = None


# =========================================
# USERS
# =========================================

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)

    email: EmailStr | None = None

    password: str = Field(..., min_length=6)

    role: str = "worker"


class UserResponse(BaseModel):
    id: int

    username: str

    email: EmailStr | None = None

    role: str

    is_active: bool

    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UserUpdate(BaseModel):
    username: str | None = None

    email: EmailStr | None = None

    password: str | None = None

    role: str | None = None

    is_active: bool | None = None


# =========================================
# WEB FORM
# =========================================

class WebFormResponse(BaseModel):
    id: int

    imie_nazwisko: Optional[str]

    email: Optional[str]

    nr_tel: Optional[str]

    dzien: Optional[dt_date]

    godzina: Optional[dt_time]

    rejs: Optional[str]

    liczba_ludzi: Optional[int]

    catering: Optional[str]

    miejsce_catering: Optional[str]

    zgoda_rodo: Optional[bool]

    odczytano: Optional[bool]

    created_at: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)


# =========================================
# AUTH
# =========================================

class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"