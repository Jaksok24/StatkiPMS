from fastapi import APIRouter

router = APIRouter(prefix="/ships", tags=["ships"])

SHIPS = [
    "Albatros",
    "Perkoz",
    "Kormoran",
    "CKT VIP"
]


@router.get("/")
def get_ships():
    return SHIPS