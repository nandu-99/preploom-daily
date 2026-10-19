# PrepLoom Daily: Project Scope

## Purpose

PrepLoom Daily will be a full-stack technical interview-preparation platform and a backend-course project. It will reuse selected, relevant parts of the existing PrepLoom product while adding the backend capabilities that the original project does not currently have.

The goal is not to create artificial activity or copy the whole source repository in small pieces. The goal is to deliver one genuine, reviewable increment per working day, with each increment leaving the application in a working state and demonstrating a clear engineering concept.

## Repository roles

- `PrepLoom` is the reference product and the source of existing UI, content, and client-side learning experiences.
- `preploom-daily` is the new full-stack course project and the only repository changed by this plan.
- Existing work will be ported selectively, adapted to the new data model, and credited through commit messages when appropriate.
- New backend work will be implemented directly in `preploom-daily`.

## What exists in PrepLoom today

The source repository is a polished Next.js 16 and React 19 application with:

- 28 page routes and 55 React components.
- Structured notes for Operating Systems, Computer Architecture, OOP, DBMS, Computer Networks, Machine Learning, and Deep Learning.
- About 245 structured subject-topic records and 445 interview-question records.
- Interview-practice pages for behavioral questions and several technical subjects.
- One Operating Systems quiz, a searchable learning catalog, roadmaps, DSA sheets, and five algorithm visualizations.
- Contact and feedback forms, analytics helpers, feature flags, dark mode, responsive layouts, and deployment documentation.

Its current backend surface is deliberately small:

- One Next.js route handler validates contact/feedback input and forwards it to an external email service.
- Learning content is stored in TypeScript files rather than a database.
- There is no user account system, persisted progress, bookmark storage, quiz-attempt history, admin content management, or first-party feedback storage.

This makes the existing repository a useful product reference, but `preploom-daily` needs a genuine data and service layer to satisfy the backend-course objective.

## Product outcome

At the end of the planned work, a learner should be able to:

1. Register, sign in, and securely manage a session.
2. Browse subjects, topics, interview questions, roadmaps, and DSA resources served through backend APIs.
3. Search the catalog using server-side filtering and pagination.
4. Bookmark useful material and record topic-reading progress.
5. Take quizzes and review persisted attempt history and scores.
6. Maintain a study plan, activity streak, and simple progress dashboard.
7. Submit feedback that is validated, rate-limited, stored, and optionally emailed.

An administrator should be able to manage the complete content lifecycle through a protected admin portal. Subjects, topics, interview questions, quizzes, roadmaps, DSA resources, and their publication state must be entered and maintained there instead of being hard-coded into frontend files.

## Proposed architecture

The repository will contain two applications: a Next.js frontend and a separate Node.js + Express backend. They can be developed together but will have independent entry points, environment configuration, tests, and deployment targets.

| Layer           | Choice                                                                                     | Responsibility                                                                            |
| --------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| Web application | Next.js App Router + React + TypeScript                                                    | Public learner experience and protected admin portal                                      |
| Backend         | Node.js + Express + TypeScript                                                             | HTTP routes, middleware, business services, validation, authentication, and authorization |
| API paths       | Direct resource routes such as `/health` and `/subjects`                                   | Clear endpoints without an `/api` or `/api/v1` prefix                                     |
| Database        | PostgreSQL                                                                                 | Users, content metadata, progress, bookmarks, quiz attempts, study plans, and feedback    |
| Data access     | Prisma ORM                                                                                 | Schema, migrations, constraints, seed data, and typed queries                             |
| Authentication  | Express authentication with short-lived access tokens and secure HTTP-only refresh cookies | Registration, sign-in, token renewal, sign-out, and role checks                           |
| Validation      | Zod                                                                                        | Shared request, environment, and response-boundary validation                             |
| Testing         | Vitest/Supertest plus focused integration tests                                            | Business rules, authenticated Express routes, validation, and data-access behavior        |
| Deployment      | Separately deployed web client, Express service, and managed PostgreSQL                    | Production delivery with environment variables, CORS policy, and migrations               |

The exact hosting provider may change if course rules require a particular platform, but Node.js + Express, direct unversioned route paths, PostgreSQL, and a database-backed admin workflow are fixed project decisions.

## Repository shape

```text
frontend/    Next.js learner application and admin portal
backend/     Express server, routes, controllers, services, middleware, and tests
docs/        Architecture, ER diagram, API reference, and operational guides
```

The browser must call the Express backend through a configured base URL. Next.js route handlers will not be used as a substitute backend. Development configuration must allow only the intended frontend origin, and production CORS and cookie settings must match the deployed domains.

## Initial domain model

The first schema should cover these entities:

- `User`: identity, email, password/provider information, role, and timestamps.
- `Subject`: public catalog metadata and publication state.
- `Topic`: subject relationship, slug, structured body, difficulty, order, and publication state.
- `InterviewQuestion`: category, difficulty, prompt, answer, tags, and publication state.
- `Quiz`, `QuizQuestion`, and `QuizOption`: reusable quiz definitions without exposing correct answers in public list responses.
- `QuizAttempt` and `QuizAnswer`: score, submitted answers, timing, and completion state.
- `Bookmark`: unique user-to-resource relationship.
- `TopicProgress`: per-user reading state and completion timestamps.
- `StudyPlan` and `StudyPlanItem`: a learner's ordered preparation tasks.
- `ActivityEvent`: meaningful learner activity used to calculate streaks.
- `Feedback`: validated contact or product feedback with moderation status.

Content bodies may initially use JSON columns because PrepLoom already represents rich, structured lesson sections. Catalog fields, relationships, status, ownership, and timestamps should remain relational and queryable.

## API surface

The intended first version uses direct resource paths with no `/api` or `/api/v1` prefix:

- `/health`
- `/auth/register`, `/auth/login`, `/auth/refresh`, and `/auth/logout`
- `/subjects` and `/subjects/:slug`
- `/topics/:id/progress`
- `/interview-questions`
- `/search`
- `/bookmarks`
- `/quizzes` and `/quizzes/:slug`
- `/quiz-attempts`
- `/roadmaps`
- `/dsa-resources`
- `/study-plans`
- `/activity/summary`
- `/feedback`
- Protected admin endpoints such as `/admin/dashboard`, `/admin/subjects`, `/admin/topics`, `/admin/interview-questions`, `/admin/quizzes`, `/admin/roadmaps`, `/admin/dsa-resources`, and `/admin/feedback`

All collection endpoints should use consistent pagination metadata. Errors should use a shared shape with a stable code and readable message. Private endpoints must derive the user from the validated access token rather than accepting a user ID from the browser.

## Admin portal requirements

The admin portal is a core product feature, not an optional final-day dashboard. It must provide:

- A protected `/admin` frontend area available only to `ADMIN` users.
- Dashboard counts and quick links for each manageable content type.
- List, search, filter, create, edit, preview, publish/unpublish, archive, and delete workflows.
- Structured editors for subjects, topics, interview questions, quiz questions/options, roadmaps, and DSA resources.
- Server-side validation with clear field-level errors and slug/relationship checks.
- Draft previews so incomplete content never has to be published for review.
- Confirmation for destructive actions and safe handling of referenced records.
- Feedback inbox controls for viewing and updating moderation status.
- Audit fields showing who created or last updated a record and when.

Initial seed data should be limited to system necessities such as roles, an optional development administrator, and controlled import fixtures. After setup, normal content entry and editing must happen through the admin portal and Express admin endpoints, not by changing frontend source files.

## Scope boundaries

### Included

- A representative subset of PrepLoom's interface and content, migrated in coherent vertical slices through controlled import scripts or the admin workflow.
- A production-shaped relational schema with migrations and reproducible seed data.
- Authentication, authorization, validation, rate limiting for abuse-prone endpoints, and safe error handling.
- Persisted learning features that clearly exercise backend concepts.
- A database-backed admin portal covering every content type delivered during the 20-day plan.
- Automated checks, API documentation, setup instructions, and a deployable final build.

### Not included in the first 20 days

- Migrating every PrepLoom lesson and every visualizer.
- Reproducing the source repository's Git history or backdating commits.
- Social networking, payments, live chat, or real-time collaborative editing.
- Advanced CMS capabilities such as real-time collaborative editing, media transformation pipelines, or arbitrary page-layout building.
- Microservices. One modular Express backend is more appropriate for this project size and schedule.
- Claims that ported frontend work is newly invented; commits and project documentation should distinguish migrated work from new work.

## Security and data rules

- Hash credentials with a suitable password-hashing function when credentials authentication is used; never store plaintext passwords.
- Store secrets only in ignored environment files and deployment settings.
- Validate and normalize all external input on the server.
- Enforce role and ownership checks in the backend, not only by hiding UI controls.
- Rate-limit authentication and feedback endpoints and avoid exposing internal error details.
- Use database uniqueness and foreign-key constraints to enforce invariants such as one bookmark per user and resource.
- Do not expose quiz answer keys before an attempt is submitted.
- Avoid logging passwords, session tokens, or unnecessary personal information.

## Daily delivery workflow

Each day should produce one coherent feature or engineering improvement:

1. Start from the latest valid state of `main` and define that day's acceptance criteria.
2. Port only the source files needed for the selected slice, or implement the planned backend capability.
3. Adapt migrated code to the new API and schema instead of leaving duplicate static and database data paths indefinitely.
4. Add or update tests and documentation that belong to the change.
5. Run the available formatting, linting, type-checking, tests, and production build checks.
6. Review the diff for secrets, generated files, and unrelated changes.
7. Make a descriptive commit that states the actual work performed, then push it on the day the work was completed.

Example commit styles:

- `feat: add subject catalog and admin management`
- `feat: persist learner bookmarks`
- `test: cover quiz submission and scoring rules`
- `docs: publish API usage and deployment guide`

Commit count is not the success metric. Working, explainable increments and a defensible backend design are.

## Definition of done

A daily task is complete only when:

- Its acceptance criteria work locally.
- Input validation, authorization, loading, empty, and failure states are handled where relevant.
- Database changes include a migration and any necessary seed update.
- Important business logic or endpoints have appropriate automated coverage.
- Lint, type-check, tests, and build pass, or a documented external blocker explains why one cannot run.
- No credentials, local environment files, build output, or accidental source-repository files are included.
- The commit accurately describes whether the work was migrated, adapted, or newly implemented.

## Final course-project evidence

The finished repository should contain:

- A useful README with setup, environment variables, scripts, architecture, and deployment instructions.
- An entity-relationship diagram and migration history.
- API documentation with authentication rules, example requests, responses, and errors.
- Automated test results and continuous-integration checks.
- Seed credentials or a documented registration flow suitable for evaluator testing.
- A short demo path showing registration, content browsing, bookmarking, progress, quiz submission, history, and creating and publishing content from the admin portal.
- Twenty real daily increments whose commits correspond to the work described in the implementation plan.
