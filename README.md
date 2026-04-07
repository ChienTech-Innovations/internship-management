# Internship Management System

A full-stack web application for managing internship programs. It supports three roles — **Admin**, **Mentor**, and **Intern** — with real-time notifications, AI-powered chat, and a RAG (Retrieval-Augmented Generation) pipeline for context-aware assistance.

---

## Features

### Admin
- User management: create, update, and deactivate accounts for mentors and interns
- Training plan and task definition management
- Assignment of training plans and tasks to interns
- System-wide dashboard with analytics and progress overview

### Mentor
- View and monitor assigned interns
- Track intern attendance and task progress
- Generate and export intern performance reports
- AI chat with RAG context pulled from intern data

### Intern
- Personal dashboard with assigned tasks and training plan progress
- Attendance check-in
- AI chat assistant for internship-related queries

### Shared / Cross-cutting
- JWT-based authentication with role-based access control
- Real-time notifications via WebSocket (Socket.IO)
- AI chat powered by Gemini with optional RAG retrieval from ChromaDB
- PDF/report export

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Backend** | NestJS, TypeScript, PostgreSQL, TypeORM, Socket.IO, Passport JWT |
| **AI / RAG** | Google Gemini API, OpenAI Embeddings, ChromaDB, Puppeteer |
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS, Radix UI |
| **State / Data** | Zustand, SWR, socket.io-client, Framer Motion |
| **Infrastructure** | Docker, Docker Compose, Vercel (frontend) |

---

## Architecture

This is a **monorepo** with two independent applications:

```
internship-management/
├── be/          # NestJS backend  (REST API + WebSocket, port 3001)
├── fe/          # Next.js frontend (App Router, port 3000)
└── docker-compose.yml
```

**Communication:**
- The frontend calls the backend over REST (`NEXT_PUBLIC_API_BASE_URL`), sending `Authorization: Bearer <token>` on every request.
- Real-time notifications flow over a Socket.IO connection.
- All backend responses are wrapped in a `ResponseBase<T>` envelope; the frontend service layer unwraps them.

**RAG pipeline** (optional, requires `--profile rag`):
1. Documents are scraped with Puppeteer.
2. Chunks are embedded via OpenAI Embeddings and stored in ChromaDB.
3. At query time, relevant chunks are retrieved with role-based filtering and injected into the Gemini prompt as context.

---

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose **— recommended path**
- Or: Node.js 20+, PostgreSQL 16, and (optionally) a running ChromaDB instance for the manual path

### Quick Start — Docker (recommended)

```bash
# 1. Copy and fill in environment files
cp be/.env.example be/.env        # add JWT_SECRET, GEMINI_API_KEY, etc.

# 2. Start the full stack (PostgreSQL + Backend + Frontend)
docker compose up --build

# Frontend → http://localhost:3000
# Backend  → http://localhost:3001
# Swagger  → http://localhost:3001/api/docs

# 3. (Optional) Also start ChromaDB for the RAG/AI-chat features
docker compose --profile rag up --build
```

### Manual Setup

#### Backend

```bash
cd be
npm install
cp .env.example .env        # fill in required values (see Environment Variables)
npm run start:dev           # starts on http://localhost:3000 (port set in .env)
```

#### Frontend

```bash
cd fe
npm install
cp .env.example .env        # set NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
npm run dev                 # starts on http://localhost:3000
```

---

## Environment Variables

### Backend (`be/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string. Set automatically by Docker Compose; override for local dev. |
| `JWT_SECRET` | Yes | Secret key used to sign/verify JWT tokens. Use a long random string. |
| `GEMINI_API_KEY` | Yes | Google Gemini API key for LLM chat responses. |
| `GEMINI_MODEL` | No | Gemini model name. Defaults to `gemini-2.5-flash`. |
| `OPENAI_API_KEY` | No | OpenAI API key for generating document embeddings (RAG). |
| `OPENAI_EMBEDDING_MODEL` | No | Embedding model. Defaults to `text-embedding-3-small`. |
| `CHROMA_URL` | No | ChromaDB URL. Required only when running with `--profile rag`. |
| `PORT` | No | Backend listen port. Defaults to `3000`. |

### Frontend (`fe/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_BASE_URL` | Yes (local dev) | Base URL of the backend API. Baked into the JS bundle at build time. Set via Docker Compose `build.args` in production. |

---

## Project Structure

### Backend (`be/src/`)

```
src/
├── main.ts                  # Entry point; bootstraps NestJS app on PORT
├── app.module.ts            # Root module
├── auth/                    # JWT authentication, Passport strategies, guards
├── users/                   # User CRUD; roles: admin, mentor, intern
├── assignments/             # Links training plans + tasks + interns
├── training-plans/          # Skill-based training program templates
├── tasks/                   # Task definitions
├── attendance/              # Intern attendance tracking
├── chat/                    # Chat sessions and messages
├── llm/                     # Gemini API integration
├── rag/                     # RAG pipeline (ChromaDB + embeddings + Puppeteer)
├── notifications/           # Real-time notifications via Socket.IO
├── dashboard/               # Analytics aggregation
├── reports/                 # Report generation
├── skills/                  # Skill catalog
├── interns-information/     # Extended intern profile data
└── common/                  # Shared utilities, filters, interceptors
```

### Frontend (`fe/src/app/`)

```
src/app/
├── (auth)/login/            # Public login page
├── (protected)/
│   ├── (admin-only)/        # Admin dashboard & user management
│   ├── (mentor-only)/       # Mentor views & report generation
│   ├── (intern-only)/       # Intern dashboard & task views
│   └── (shared)/            # Assignments, chat, skills, tasks, training plans
├── error/access-denied/     # Shown when a role accesses a forbidden route
└── export/                  # PDF / report export pages
```

**Auth flow:**
- `AuthProvider` wraps the whole app; redirects unauthenticated users to `/login`.
- `RoleGuard` enforces per-route role access; unauthorized users see the Access Denied page.
- Authenticated users landing on `/` are redirected to their role-specific dashboard.

---

## API Documentation

Interactive Swagger UI is available at:

```
http://localhost:3001/api/docs
```

This is only served in development mode (`NODE_ENV !== 'production'`).

---

## License

This project is for academic/thesis purposes.
