# Statki Port Management System

Nowoczesny system do zarządzania:
* rejsami,
* rezerwacjami,
* harmonogramem statków,
* przerwami technicznymi,
* formularzami WWW,
* użytkownikami i autoryzacją JWT.

Projekt oparty o:
* React + Vite
* FastAPI
* SQLite
* Docker
* JWT Authentication

---

# Technologie
## Frontend
* React
* Vite
* Axios
* React Router

## Backend
* FastAPI
* SQLAlchemy
* SQLite
* JWT
* Passlib / Bcrypt

## DevOps
* Docker
* Docker Compose

---

# Struktura projektu
project/
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   ├── utils/
│   │   ├── main.py
│   │   ├── db.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── auth.py
│   │   └── __init__.py
│   │
│   ├── storage/
│   │   └── app.db
│   │
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .dockerignore
│
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   └── package.json
│
└── docker-compose.yml

---

# Uruchomienie projektu
## 1. Klonowanie repozytorium
git clone REPO_URL
cd project

---

# Docker
## Uruchomienie
docker compose up --build

---

# Frontend
Frontend dostępny pod:
http://localhost:5173

---

# Backend API
Backend dostępny pod:
http://127.0.0.1:8000

Swagger:
http://127.0.0.1:8000/docs

---

# Konto administratora
Przy pierwszym uruchomieniu system automatycznie tworzy konto administratora.

## Login
admin

## Hasło
zaq1@WSX

---

# JWT Authentication
System wykorzystuje:
* Bearer Token
* JWT
* Middleware autoryzacji

Po zalogowaniu token jest:
* zapisywany w localStorage,
* automatycznie dodawany do requestów Axios.

---

# SQLite
Baza danych znajduje się w:
backend/storage/app.db

---

# Reset bazy danych
## Linux / Mac
rm backend/storage/app.db

## Windows
del backend\storage\app.db

Następnie:
docker compose down -v
docker compose up --build

---

# API Endpoints
## Auth
POST   /auth/login
GET    /auth/me
POST   /auth/register

## Cruises
GET    /cruises
POST   /cruises
PUT    /cruises/{id}
DELETE /cruises/{id}

## Reservations
GET    /reservations
POST   /reservations
PUT    /reservations/{id}
DELETE /reservations/{id}

## Breaks
GET    /breaks
POST   /breaks
PUT    /breaks/{id}
DELETE /breaks/{id}

---

# CORS
Backend obsługuje:
http://localhost:5173
http://127.0.0.1:5173

Konfiguracja znajduje się w:
backend/app/main.py

---

# Development
## Backend
uvicorn app.main:app --reload

## Frontend
npm install
npm run dev

---

# Docker rebuild
Po zmianach w requirements.txt lub Dockerfile:
docker compose down
docker compose build --no-cache
docker compose up

---

# Produkcja
Rekomendowane:
* PostgreSQL
* Nginx reverse proxy
* HTTPS
* ENV variables
* oddzielny frontend/backend domain
* Docker volumes

---

# Autor
Jakub Sokołowski
Poznań, Poland
