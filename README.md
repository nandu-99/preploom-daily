# PrepLoom Daily

PrepLoom Daily is a full-stack technical interview preparation platform. The repository contains a Next.js frontend and a separate Node.js and Express backend.

## Requirements

- Node.js 22
- npm 10 or newer
- PostgreSQL

## Workspace structure

```text
frontend/    Next.js learner interface and admin portal
backend/     Express API and business logic
```

## Setup

Install all workspace dependencies from the repository root:

```bash
npm install
```

Create local environment files:

```bash
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
```

Update `DATABASE_URL` in `backend/.env`, then generate the Prisma client:

```bash
npm run prisma:generate --workspace backend
```

Apply the existing migrations with:

```bash
npm run prisma:deploy --workspace @preploom/backend
```

`GET /health` returns `200` when PostgreSQL is reachable and `503` when it is unavailable.

Create or update the initial admin account using the credentials in
`backend/.env`:

```bash
npm run prisma:seed --workspace backend
```

Topics can be read at `/subjects/:subjectSlug/topics` and
`/subjects/:subjectSlug/topics/:topicSlug`. Admins can create topics with
`POST /subjects/:subjectSlug/topics` and edit or delete them by topic ID.

Interview questions can be read at `/subjects/:subjectSlug/questions` and
`/subjects/:subjectSlug/questions/:questionSlug`. Admins can create questions
with `POST /subjects/:subjectSlug/questions` and edit or delete them by question
ID. Each question has a prompt, answer, slug, and display position.

Roadmaps can be read at `/subjects/:subjectSlug/roadmaps` and
`/subjects/:subjectSlug/roadmaps/:roadmapSlug`. Admins can create roadmaps with
`POST /subjects/:subjectSlug/roadmaps` and edit or delete them by roadmap ID.
Each roadmap has a title, slug, optional summary, display position, and an
ordered `steps` array. Each step has a `title` and `description`. The order of
the array is the order shown to learners.

Start both applications:

```bash
npm run dev
```

The frontend runs at `http://localhost:3000` and the backend runs at `http://localhost:4000`.

They can also be started separately:

```bash
npm run dev:frontend
npm run dev:backend
```

## Quality checks

```bash
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
```
