# PrepLoom Daily

PrepLoom Daily is a full-stack technical interview preparation project with a Next.js frontend, a Node.js and Express backend, Prisma, and PostgreSQL. Its learning content is editable through the admin portal and served by the backend.

**Live app:** [preploom-daily.vercel.app](https://preploom-daily.vercel.app/)  
**Technical blog:** [Architecture and implementation](https://preploom-daily.vercel.app/blog)

## What is included

- Subject notes with Learn, Revise, and Recall modes
- Interview questions, roadmaps, quizzes, and WebDev resources
- DSA sheets and seven algorithm visualizations: binary search, linear search, bubble sort, selection sort, insertion sort, merge sort, and quick sort
- An admin portal for editing public content
- Contact and feedback forms that save submissions in PostgreSQL

The frontend contains the page layouts, animations, and image assets. PostgreSQL holds the editable learning content, admin account, and form submissions. Initial content lives in `backend/prisma/*.json` and is loaded with the seed command.

## Requirements

- For a local run: Node.js 22 or newer, npm 10 or newer, and PostgreSQL
- For the container setup: Docker with Docker Compose

## Run locally

From the repository root, install dependencies and create the environment files:

```bash
npm install
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
```

Set `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` in `backend/.env`. Replace `[YOUR-PASSWORD]` in both database URLs with the URL-encoded Supabase database password. `DATABASE_URL` uses the transaction pooler for the running backend. `DIRECT_URL` uses the session pooler for Prisma migrations. Keep `backend/.env` private. Set `NEXT_PUBLIC_BACKEND_URL` in `frontend/.env.local` if the backend is not running at `http://localhost:4000`.

Apply the Prisma migrations and load the initial content and admin account:

```bash
npm run prisma:seed --workspace backend
```

This command applies pending migrations through `DIRECT_URL`, then loads the included learning content and creates the admin account. Running it again adds missing seed records while preserving content edits made in the admin portal, but it resets the admin password to `ADMIN_PASSWORD` from `backend/.env`. If you only need to apply migrations, run `npm run prisma:deploy --workspace backend`.

Start the frontend and backend together:

```bash
npm run dev
```

| Application | Local address                 |
| ----------- | ----------------------------- |
| Frontend    | `http://localhost:3000`       |
| Backend     | `http://localhost:4000`       |
| Admin login | `http://localhost:3000/admin` |

You can start them separately with `npm run dev:frontend` and `npm run dev:backend`.

## Run with Docker

Docker Compose runs the Next.js frontend, Express backend, and a local PostgreSQL database. It applies migrations and seeds the database before starting the API. This setup uses local credentials from the repository root `.env`; it does not use the Supabase URLs in `backend/.env`.

```bash
cp compose.env.example .env
docker compose up --build
```

Open `http://localhost:3000` for the app, `http://localhost:3000/admin` for admin sign-in, and `http://localhost:4000/health` for the API health check. Use `ADMIN_EMAIL` and `ADMIN_PASSWORD` from the root `.env` to sign in. Run `docker compose down` to stop the stack. The database is stored in a named Docker volume, so this command does not delete its content. If the seed service runs again, it preserves edited content but updates the admin password to the root `.env` value.

## Content and admin portal

The seed loads seven subject courses with 228 structured lessons, the subject catalog, nine interview question collections, six DSA sheets, three public roadmaps, WebDev resources, and a quiz. Images, logos, and other static assets are served from `frontend/public`.

Sign in at `/admin` with the `ADMIN_EMAIL` and `ADMIN_PASSWORD` values in `backend/.env` for a local run, or the root `.env` for Docker. The password is stored as a hash in PostgreSQL. After signing in, open **Public content** in the admin header or visit `/admin/dashboard/content`.

The Public content editor uses labeled fields instead of raw JSON. You can edit sections, add or reorder items, review changes, and save. It updates the content used by the public pages. The older topic, question, roadmap, and quiz admin forms manage separate records, so use **Public content** when changing the restored PrepLoom pages.

The seed files provide initial content. Subsequent admin edits live in PostgreSQL. Quiz progress, note reader progress, and the theme preference stay in the visitor's browser.

## Main routes

| Frontend                           | Backend                                  |
| ---------------------------------- | ---------------------------------------- |
| `/subjects` and `/subjects/[slug]` | `/subjects`, `/catalog/subjects`         |
| `/interview-questions`             | `/interview-questions`                   |
| `/roadmaps`                        | `/roadmaps`                              |
| `/quizzes/[quizSlug]`              | `/quizzes/:slug`, `/quizzes/:slug/grade` |
| `/webdev`                          | `/webdev`                                |
| `/dsa`                             | `/dsa/sheets`                            |
| `/dsa/visualizations`              | Visualizations run in the frontend       |
| `/contact` and `/feedback`         | `/messages`                              |

The backend uses direct paths with no `/api/v1` prefix. `GET /health` returns `200` when PostgreSQL is reachable and `503` when it is unavailable. Reading submitted messages and editing content require an admin token.

## Project structure

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

GitHub Actions runs these checks with a temporary PostgreSQL service. It applies the Prisma migrations first so database-backed tests run instead of being skipped. A separate container check builds the complete Docker stack and checks the API and frontend.
