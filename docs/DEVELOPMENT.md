# Development guide

This guide covers local setup, data, and API routes. For a quick introduction, see the [README](../README.md).

## Run without Docker

Requirements: Node.js 22 or newer, npm 10 or newer, and a PostgreSQL database.

```bash
npm install
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
```

Set `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` in `backend/.env`. The included example uses Supabase: `DATABASE_URL` points to its transaction pooler, while `DIRECT_URL` points to its session pooler for Prisma migrations. Replace `[YOUR-PASSWORD]` with your URL-encoded database password. You can also use your own PostgreSQL database in both URLs. Keep `backend/.env` private.

The frontend calls `http://localhost:4000` by default. Change `NEXT_PUBLIC_BACKEND_URL` in `frontend/.env.local` if the backend runs elsewhere.

```bash
npm run prisma:seed --workspace backend
npm run dev
```

The app runs at `http://localhost:3000`, the backend at `http://localhost:4000`, and the admin login at `http://localhost:3000/admin`. To run services separately, use `npm run dev:frontend` and `npm run dev:backend`.

## Run with Docker

```bash
cp compose.env.example .env
```

Set `JWT_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` in the root `.env`, then run:

```bash
docker compose up --build
```

The Docker setup uses its own PostgreSQL container and the root `.env`. It does not use `backend/.env` or the Supabase URLs. Stop with `docker compose down`; the named database volume remains. The seed service runs when Compose creates it, so a later run may update the admin password to the current root `.env` value.

## Seed data and admin edits

`npm run prisma:seed --workspace backend` applies pending migrations, loads the included learning content, and creates or updates the admin account. Re-running it adds missing seed records while preserving content edited in the admin portal, but it resets the admin password to `ADMIN_PASSWORD`. To apply migrations without seeding, run `npm run prisma:deploy --workspace backend`.

Initial content lives in `backend/prisma/*.json`. The seed includes seven subject courses with 228 structured lessons, a subject catalog, nine interview question collections, six DSA sheets, three public roadmaps, WebDev resources, and a quiz. Static images and logos live in `frontend/public`.

Sign in at `/admin` with the credentials from `backend/.env` or the root Docker `.env`. The password is stored as a hash in PostgreSQL. Open **Public content** in the admin header, or visit `/admin/dashboard/content`, to edit the content used by the public pages through labeled fields. The topic, question, roadmap, and quiz admin forms manage separate records. Quiz progress, note reader progress, and theme preference remain in the visitor's browser.

## Main routes

| Frontend                           | Backend                                  |
| ---------------------------------- | ---------------------------------------- |
| `/subjects` and `/subjects/[slug]` | `/subjects`, `/catalog/subjects`         |
| `/interview-questions`             | `/interview-questions`                   |
| `/roadmaps`                        | `/roadmaps`                              |
| `/quizzes/[quizSlug]`              | `/quizzes/:slug`, `/quizzes/:slug/grade` |
| `/webdev`                          | `/webdev`                                |
| `/dsa`                             | `/dsa/sheets`                            |
| `/dsa/visualizations`              | Playback runs in the frontend            |
| `/contact` and `/feedback`         | `/messages`                              |

The backend uses direct paths without an `/api/v1` prefix. `GET /health` returns `200` when PostgreSQL is reachable and `503` when it is unavailable. Reading submissions and changing content require an admin token.

## Project layout

```text
frontend/         Next.js pages, visualizations, admin portal, and static assets
backend/src/      Express routes and application logic
backend/prisma/   Prisma schema, migrations, seed, and initial content
```

## Checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

GitHub Actions runs these checks with a temporary PostgreSQL service. It applies migrations before tests so database-backed checks run, and validates the Docker Compose configuration.
