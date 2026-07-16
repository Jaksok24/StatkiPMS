# 🚢 Ships Port Management System

A modern full-stack web application for managing cruise operations, reservations, vessel maintenance, and user administration.

The project was built to simulate a production-like business application using a modern backend architecture with **FastAPI**, **React**, **Docker**, and **JWT Authentication**.

---

## ✨ Features

- 🔐 Secure JWT Authentication & Authorization
- 🚢 Cruise management
- 📅 Reservation management
- 🔧 Vessel maintenance scheduling
- 👥 User management
- 📄 Interactive Swagger API documentation
- 🐳 Fully Dockerized deployment
- ⚡ Modern React frontend communicating with FastAPI backend

---

## 🛠️ Tech Stack

| Layer | Technology |
|--------|------------|
| Frontend | React, Vite, Axios, React Router |
| Backend | FastAPI |
| ORM | SQLAlchemy |
| Database | SQLite |
| Authentication | JWT, Passlib, Bcrypt |
| Containerization | Docker, Docker Compose |

---

# 🏗️ Architecture

```
React (Vite)
      │
    Axios
      │
 REST API
      │
   FastAPI
      │
 SQLAlchemy
      │
    SQLite
```

---

## 📂 Project Structure

```
project/
│
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   ├── utils/
│   │   ├── auth.py
│   │   ├── db.py
│   │   ├── main.py
│   │   ├── models.py
│   │   └── schemas.py
│   │
│   ├── storage/
│   │   └── app.db
│   │
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   └── package.json
│
└── docker-compose.yml
```

---

# 📸 Screenshots

> Screenshots of the application will be added soon.

- Login
- Dashboard
- Cruise Management
- Reservations
- Vessel Maintenance
- Swagger API

---

# 🚀 Getting Started

## Clone the repository

```bash
git clone https://github.com/Jaksok24/StatkiPMS.git
cd StatkiPMS
```

---

## Run with Docker

```bash
docker compose up --build
```

---

## Application URLs

Frontend

```
http://localhost:5173
```

Backend

```
http://127.0.0.1:8000
```

Swagger

```
http://127.0.0.1:8000/docs
```

---

## Default Administrator Account

A default administrator account is automatically created during the first application startup.

```
Username: admin
Password: zaq1@WSX
```

> The default credentials are intended for local development only.

---

# 🔐 Authentication

The application implements:

- JWT Authentication
- Bearer Token
- Password hashing using Bcrypt
- Protected API endpoints

After logging in, the access token is automatically stored in the browser and attached to every authorized request.

---

# 🗄️ Database

SQLite database location:

```
backend/storage/app.db
```

To reset the database:

Linux / macOS

```bash
rm backend/storage/app.db
```

Windows

```cmd
del backend\storage\app.db
```

Then rebuild the application:

```bash
docker compose down -v
docker compose up --build
```

---

# 📖 API Documentation

Interactive API documentation is available via Swagger UI:

```
http://127.0.0.1:8000/docs
```

---

# 💻 Local Development

Backend

```bash
uvicorn app.main:app --reload
```

Frontend

```bash
npm install
npm run dev
```

---

# 🚀 Future Improvements

- PostgreSQL support
- Role-based authorization
- Unit and integration tests
- CI/CD pipeline
- Redis caching
- Environment variables
- Cloud deployment
- Production-ready logging

---

# 🎯 Project Goals

The primary objective of this project was to gain hands-on experience in designing and developing a modern full-stack application using industry-standard technologies.

The project demonstrates experience with:

- Backend development using FastAPI
- REST API design
- SQL database modeling
- JWT Authentication
- Dockerized applications
- React frontend integration
- Software architecture
- Business process automation

---

# 👨‍💻 Author

**Jakub Sokołowski**

Software & Data Engineer

📍 Poznań, Poland

LinkedIn:
https://linkedin.com/in/...

GitHub:
https://github.com/Jaksok24
