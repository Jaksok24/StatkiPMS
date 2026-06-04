# Ships Port Management System

A modern system for managing:
* cruises,
* reservations,
* vessel schedules,
* technical maintenance breaks,
* web forms,
* users and JWT authentication.

Project based on:
* React + Vite
* FastAPI
* SQLite
* Docker
* JWT Authentication

---

# Technologies
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

# Project Structure
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

# Getting Started
## 1. Clone the repository
git clone REPO_URL
cd project

---

# Docker
## Running the application
docker compose up --build

---

# Frontend
Frontend is available at:
http://localhost:5173

---

# Backend API
Backend is available at:
http://127.0.0.1:8000

Swagger UI:
http://127.0.0.1:8000/docs

---

# Administrator Account
The system automatically creates an administrator account during the first startup.

## Username
admin

## Password
zaq1@WSX

---

# JWT Authentication
The system utilizes:
* Bearer Token
* JWT
* Authentication Middleware

Once logged in, the token is:
* saved in localStorage,
* automatically added to Axios requests.

---

# SQLite
The database file is located at:
backend/storage/app.db

---

# Database Reset
## Linux / Mac
rm backend/storage/app.db

## Windows
del backend\storage\app.db

Then run:
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
The backend supports:
http://localhost:5173
http://127.0.0.1:5173

Configuration is located in:
backend/app/main.py

---

# Development
## Backend
uvicorn app.main:app --reload

## Frontend
npm install
npm run dev

---

# Docker Rebuild
After making changes to requirements.txt or Dockerfile:
docker compose down
docker compose build --no-cache
docker compose up

---

# Production
Recommended:
* PostgreSQL
* Nginx reverse proxy
* HTTPS
* Environment variables (ENV)
* Separate domains for frontend/backend
* Docker volumes

---

# Author
Jakub Sokołowski
Poznań, Poland
