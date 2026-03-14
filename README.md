# LTI — Applicant Tracking System

A full-stack Applicant Tracking System scaffold built with React 18, Node.js, TypeScript, and PostgreSQL.

---

## Architecture

```
Browser (React 18 + Vite)
        │
        │  HTTP /api/*  (proxied by Vite dev server)
        ▼
Express REST API (Node.js + TypeScript)
        │
        │  Prisma ORM
        ▼
PostgreSQL (Docker)
```

- **Frontend** — React 18 SPA served by Vite on port `5173`. All `/api` requests are proxied to the backend during development.
- **Backend** — Express server on port `3000`. Exposes a REST API under `/api`. Connects to PostgreSQL via Prisma.
- **Database** — PostgreSQL 16, managed with Prisma Migrate. Schema is defined in `backend/prisma/schema.prisma`.

---

## Project Structure

```
lti-starter/
├── frontend/                   # React 18 + TypeScript + Vite
│   ├── src/
│   │   ├── App.tsx             # Root component (health check UI)
│   │   ├── main.tsx            # Entry point
│   │   └── vite-env.d.ts       # Vite type declarations
│   ├── index.html
│   ├── vite.config.ts          # Vite config + API proxy
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── package.json
│
├── backend/                    # Node.js + TypeScript + Express
│   ├── src/
│   │   ├── index.ts            # Server entry point
│   │   ├── config/
│   │   │   └── database.ts     # Prisma client singleton
│   │   └── routes/
│   │       ├── index.ts        # Route aggregator
│   │       └── health.ts       # GET /api/health
│   ├── prisma/
│   │   └── schema.prisma       # DB schema (Candidate, Position, Application)
│   ├── tsconfig.json
│   ├── .env.example
│   └── package.json
│
├── docker-compose.yml          # PostgreSQL service
├── .env.example                # Root-level env reference
├── .gitignore
├── package.json                # npm workspaces root
├── PROMPT.md
└── README.md
```

---

## API Contracts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Returns server and database status |

Response example:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2024-03-14T12:00:00.000Z"
}
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [npm](https://www.npmjs.com/) >= 9 (comes with Node.js)
- [Docker](https://www.docker.com/) and Docker Compose (for PostgreSQL)

---

## Local Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd lti-starter
```

### 2. Start the database

```bash
docker compose up -d
```

This starts a PostgreSQL 16 instance on port `5432` with:
- User: `postgres`
- Password: `postgres`
- Database: `lti_db`

### 3. Configure environment variables

```bash
cp .env.example backend/.env
```

Edit `backend/.env` if your database credentials differ from the defaults.

### 4. Install dependencies

```bash
npm install
```

This installs dependencies for both workspaces (`frontend` and `backend`) from the root.

### 5. Generate Prisma client and run migrations

```bash
cd backend
npx prisma migrate dev --name init
cd ..
```

### 6. Start both dev servers

```bash
npm run dev
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:3000 |
| Health check | http://localhost:3000/api/health |

---

## Individual Commands

```bash
# Backend only
npm run dev:backend

# Frontend only
npm run dev:frontend

# Prisma Studio (database browser)
cd backend && npx prisma studio

# Build for production
npm run build
```

---

## Database Schema

Three core models are defined as the ATS foundation:

- **Candidate** — person applying for a job (name, email, phone)
- **Position** — open role at the company (title, department, location, status)
- **Application** — join between a Candidate and a Position, with a pipeline status

Status enums:
- `PositionStatus`: `OPEN` | `CLOSED` | `ON_HOLD`
- `ApplicationStatus`: `APPLIED` | `SCREENING` | `INTERVIEW` | `OFFER` | `HIRED` | `REJECTED`
