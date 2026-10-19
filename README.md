# PrepLoom Daily

PrepLoom Daily is a full-stack technical interview preparation platform. The repository contains a Next.js frontend and a separate Node.js and Express backend.

## Requirements

- Node.js 22
- npm 10 or newer

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

See [PROJECT_SCOPE.md](PROJECT_SCOPE.md) and [20_DAY_IMPLEMENTATION_PLAN.md](20_DAY_IMPLEMENTATION_PLAN.md) for the approved scope and delivery sequence.
