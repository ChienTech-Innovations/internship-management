# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Layout

This is a monorepo with two independent applications:
- `be/` — NestJS backend (API + WebSocket + AI/RAG)
- `fe/` — Next.js frontend (App Router)

---

## Backend (`be/`)

### Commands

```bash
cd be
npm run start:dev     # Development with hot reload
npm run build         # Compile TypeScript → dist/
npm run start:prod    # Run production build
npm run test          # Unit tests (Jest)
npm run test:e2e      # End-to-end tests
npm run test:cov      # Coverage report
npm run lint          # ESLint with auto-fix
npm run format        # Prettier format
```

### Architecture

NestJS modular architecture. Key modules in `src/`:

| Module | Responsibility |
|--------|---------------|
| `auth/` | JWT authentication, Passport strategies, guards |
| `users/` | User CRUD; roles: `admin`, `mentor`, `intern` |
| `assignments/` | Links training plans + tasks + interns |
| `training-plans/` | Skill-based training program templates |
| `tasks/` | Task definitions |
| `attendance/` | Intern attendance tracking |
| `chat/` | Chat sessions and messages |
| `llm/` | Gemini API integration |
| `rag/` | Retrieval-Augmented Generation pipeline (ChromaDB + embeddings) |
| `notifications/` | Real-time notifications via Socket.IO |
| `dashboard/` | Analytics aggregation |
| `reports/` | Report generation |

**Entry point**: `src/main.ts`, default port `3000` (override with `PORT` env var).

**Swagger docs**: available at `/api/docs` in development.

**RAG pipeline**: documents are extracted (Puppeteer), embedded (OpenAI or Gemini), stored in ChromaDB, and retrieved with role-based filtering for AI chat context.

### Environment Variables

Backend requires a `.env` file with at minimum:
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET`
- `GEMINI_API_KEY`
- `CHROMA_URL` / `CHROMA_HOST` — ChromaDB vector store
- `PORT` (optional, defaults to 3000)

---

## Frontend (`fe/`)

### Commands

```bash
cd fe
npm run dev       # Dev server at localhost:3000
npm run build     # Production bundle
npm run start     # Serve production build
npm run lint      # ESLint
```

### Architecture

Next.js App Router with route-group-based role isolation:

```
src/app/
├── (auth)/login/               # Public login page
├── (protected)/
│   ├── (admin-only)/           # Admin dashboard & user management
│   ├── (mentor-only)/          # Mentor views & reports
│   ├── (intern-only)/          # Intern dashboard & task views
│   └── (shared)/               # Assignments, chat, skills, tasks, training plans
├── error/access-denied/
└── export/                     # PDF/report export
```

**Auth flow** (`src/components/providers/`):
- `AuthProvider` wraps the whole app; redirects unauthenticated users to `/login`
- `RoleGuard` enforces per-route role access; unauthorized → `/error/access-denied`
- Authenticated users on `/` are redirected to their role-specific dashboard

**State management**: Zustand stores in `src/store/` (auth state, notifications, UI state).

**Data fetching**: SWR (`swr`) for server data; fetch-based service layer in `src/services/` sends `Authorization: Bearer {token}` headers.

**API base URL**: defined in `src/constants/` as `API_URL`.

**Real-time**: `socket.io-client` connects to backend for live notifications.

**UI stack**: TailwindCSS + Radix UI primitives (wrapped in `src/components/ui/`) + Framer Motion for animations. Dark mode via `darkMode: "class"`.

---

## Key Cross-Cutting Patterns

- **TypeScript strict mode** in both apps.
- **Role-based access** enforced at both layers: NestJS guards (backend) and route groups + `RoleGuard` (frontend).
- **Response envelope**: backend wraps all responses in `ResponseBase<T>`; frontend services unwrap accordingly.
- **CORS**: backend allows `localhost:3000/3001/3002` and configured Vercel deployment URL.
- **Database**: PostgreSQL via TypeORM; entities live alongside their module in `be/src/<module>/entities/`.
