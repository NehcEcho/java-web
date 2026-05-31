# Hotel Room Management System

酒店房间管理系统 — Spring Boot + React

## Tech Stack

- **Backend:** Spring Boot 3.2, Spring Data JPA, Spring Security, SQLite, JWT
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui

## Getting Started

### Backend

```bash
cd backend
mvn spring-boot:run
```

Server runs on http://localhost:8080

Default admin account: `admin` / `admin123`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:5173

## Features

- Room management (CRUD, status)
- Room type management (CRUD)
- Customer room search and booking
- Check-in/check-out workflow
- Admin dashboard with stats
- JWT authentication

## Project Structure

```
hotel-management/
├── backend/          # Spring Boot REST API
│   └── src/main/java/com/hotel/
│       ├── controller/
│       ├── service/
│       ├── repository/
│       ├── entity/
│       ├── dto/
│       ├── config/
│       ├── security/
│       └── exception/
├── frontend/         # React SPA
│   └── src/
│       ├── api/
│       ├── hooks/
│       ├── components/
│       ├── pages/
│       └── lib/
└── docs/             # Design specs & implementation plans
```

## API Endpoints

See `docs/superpowers/specs/2026-05-30-hotel-room-management-design.md` for full API documentation.