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

When database models are added, create or apply migrations with:

```bash
npm run prisma:migrate --workspace backend
```

Create or update the initial admin account using the credentials in
`backend/.env`:

```bash
npm run prisma:seed --workspace backend
```

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
