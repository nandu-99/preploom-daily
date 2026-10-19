# PrepLoom Daily: 20-Day Implementation Plan

## Schedule assumptions

- Planned window: **October 20, 2026 through November 8, 2026**.
- Day 1 starts with the current `preploom-daily` repository, which contains only its initial README commit.
- `PrepLoom` is a read-only reference during this plan; its unrelated local `.DS_Store` change is not part of the work.
- Each day ends with a tested, truthful commit made after that day's work. Dates may be shifted before implementation begins, but commits should not be backdated.
- The frontend will use Next.js, while all backend functionality will live in a separate Node.js + Express application.
- Express routes use direct paths such as `/health` and `/subjects`; the project will not add `/api` or `/api/v1` prefixes.
- The admin portal is the normal content-entry path. Apart from initial development fixtures or controlled imports, content will not be maintained in frontend source files.
- The plan intentionally alternates migrated product slices and new backend work while preserving dependencies between tasks.

## Delivery sequence

| Day | Date   | Type                      | Deliverable                                                                                                                                                                                                                              | Acceptance criteria                                                                                                                                                                     | Suggested commit                                   |
| --- | ------ | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| 1   | Oct 20 | Foundation + port         | Create `frontend` and `backend` workspaces. Bootstrap the Next.js frontend and migrate the shared visual foundation: styles, fonts, metadata, logo, layout, header, footer, and theme control. Add root development and quality scripts. | Both workspaces install and start independently; the frontend shell is responsive; no source secrets or generated files are copied; lint and type-check pass.                           | `feat: bootstrap frontend and backend workspaces`  |
| 2   | Oct 21 | Existing feature          | Port and adapt the landing page, About page, not-found page, and core navigation. Keep only links that exist in this repository.                                                                                                         | Pages render on mobile and desktop; navigation has no dead internal links; metadata and accessibility basics are present; frontend production build passes.                             | `feat: add public landing and about experience`    |
| 3   | Oct 22 | New backend               | Bootstrap the TypeScript Express server with security middleware, CORS, centralized errors, validated environment configuration, Prisma/PostgreSQL, migrations, and direct `/health` route. Include an ER diagram.                       | Express starts separately from Next.js; `/health` verifies server/database status without leaking secrets; a clean database can be migrated; allowed frontend origin is configurable.   | `feat: establish Express server and database`      |
| 4   | Oct 23 | New backend               | Implement `/auth/register`, `/auth/login`, `/auth/refresh`, and `/auth/logout`, secure password hashing, token/cookie handling, and `USER`/`ADMIN` authorization middleware. Add frontend auth pages.                                    | Duplicate/invalid registration is rejected; plaintext passwords are never stored; protected routes return 401/403 correctly; refresh rotation and logout work; auth tests pass.         | `feat: add Express authentication and roles`       |
| 5   | Oct 24 | Admin foundation          | Build the protected `/admin` frontend layout, dashboard, navigation, reusable data table/form components, admin route guard, and backend audit fields.                                                                                   | Only admins can open the portal or admin endpoints; dashboard loads from Express; common editor validation/error patterns work; creator/updater and timestamps can be recorded.         | `feat: establish protected admin portal`           |
| 6   | Oct 25 | Backend + admin + port    | Implement subject CRUD and publish/archive controls at `/admin/subjects`, public `/subjects` routes, and the subject admin screens. Port the public Subjects listing UI.                                                                 | Admin can create, edit, preview, publish, and archive subjects without source-code edits; public routes show only published records; pagination and unique slugs work.                  | `feat: manage subjects through admin portal`       |
| 7   | Oct 26 | Backend + admin + port    | Implement topic/module CRUD with structured lesson sections, ordering, draft preview, and publishing. Port one Operating Systems reader slice and add per-user `/topics/:id/progress`.                                                   | Admin can build and reorder lesson content; drafts stay private; published content renders correctly; users cannot update another user's progress; refresh preserves progress.          | `feat: add admin-managed topics and progress`      |
| 8   | Oct 27 | New backend + existing UX | Adapt PrepLoom search to direct `/search` with validation, type filters, pagination, and ranked database results.                                                                                                                        | Search returns relevant published subjects, topics, and questions; blank/oversized queries are handled; response metadata is stable; UI is keyboard accessible.                         | `feat: add paginated catalog search`               |
| 9   | Oct 28 | Backend + admin + port    | Add interview-question CRUD and publishing in the admin portal, public filterable `/interview-questions`, and the ported practice interface.                                                                                             | Admin manages questions, answers, category, difficulty, and tags; public endpoint filters and paginates; draft questions stay private; empty/error states work.                         | `feat: manage interview question practice`         |
| 10  | Oct 29 | New backend               | Add polymorphic `/bookmarks` endpoints and a Saved Items page for supported resources.                                                                                                                                                   | Creation is idempotent; database prevents duplicates; ownership is enforced; results filter by type; UI remains correct after refresh.                                                  | `feat: persist learner bookmarks`                  |
| 11  | Oct 30 | Backend + admin + port    | Add quiz, question, and option editors in the admin portal; expose public `/quizzes` routes safely; port the existing quiz runner.                                                                                                       | Admin can build and publish a quiz without code changes; ordering and one-correct-answer rules are validated; public responses never expose answer keys before submission.              | `feat: add admin-managed quiz delivery`            |
| 12  | Oct 31 | New backend               | Add transactional `/quiz-attempts` submission, server-side scoring, attempt history, answer review, and score summaries.                                                                                                                 | Client scores are ignored; attempts save atomically; only owners see history; duplicate behavior is defined; scoring tests cover edge cases.                                            | `feat: record and score quiz attempts`             |
| 13  | Nov 1  | Backend + admin + port    | Add roadmap CRUD/publishing to the admin portal, port public roadmap browsing, and add personal `/study-plans` with ordered items and completion state.                                                                                  | Admin manages roadmaps without frontend edits; users manage only their own plan; invalid dates/order and unauthorized access are rejected.                                              | `feat: add managed roadmaps and study plans`       |
| 14  | Nov 2  | New backend               | Add meaningful activity events, `/activity/summary`, and a learner dashboard combining progress, quiz scores, bookmarks, and study plans.                                                                                                | Repeated reads do not inflate activity; timezone behavior is documented; dashboard queries use the authenticated user; streak logic has unit tests.                                     | `feat: add learner dashboard and streaks`          |
| 15  | Nov 3  | Backend + admin + port    | Add DSA resource CRUD/publishing to the admin portal, direct public resource routes, the ported DSA explorer, filters, and bookmarks.                                                                                                    | Admin manages all resource metadata; published resources filter by goal, experience, scope, and pace; external links are safe; bookmarks work.                                          | `feat: add admin-managed DSA resources`            |
| 16  | Nov 4  | Backend + admin + port    | Replace the source email-only flow with `/feedback`: validation, persistence, rate limiting, optional email notification, ported forms, and an admin feedback inbox/status workflow.                                                     | Records persist when optional email fails; endpoint is rate-limited; categories are allow-listed; only admins can list submissions or change their status.                              | `feat: add feedback service and admin inbox`       |
| 17  | Nov 5  | Backend hardening         | Standardize API response/error shapes, validation middleware/helpers, pagination, request IDs, security headers, and rate limits. Review indexes and remove N+1 queries on main flows.                                                   | APIs use consistent errors and status codes; auth/feedback rate limits work; common validation is not duplicated; sensitive data is absent from logs; key query indexes are documented. | `refactor: harden and standardize API behavior`    |
| 18  | Nov 6  | Quality                   | Add unit/integration coverage with Supertest for auth guards, admin CRUD, publication rules, bookmarks, progress, quiz scoring, study plans, and feedback. Publish direct-route API documentation.                                       | Tests run against an isolated database; critical success/failure paths are covered; docs match implemented Express routes and contain no `/api/v1` examples.                            | `test: cover critical backend workflows`           |
| 19  | Nov 7  | Delivery                  | Add CI for both workspaces, production environment validation, migrations, initial-admin setup, logging, separate frontend/backend deployment guides, and smoke tests. Deploy if credentials are available.                              | CI checks frontend and backend; CORS/cookies work across production origins; fresh setup creates an admin safely; `/health` and primary learner/admin journeys pass.                    | `chore: add CI and production deployment workflow` |
| 20  | Nov 8  | Final integration         | Complete responsive/accessibility polish, remove dead paths, verify the evaluator demo journey, update the main README, and add architecture, trade-off, and future-work notes.                                                          | Clean clone setup succeeds; all automated checks pass; learner and admin demo paths work end-to-end; docs clearly distinguish migrated features from newly built backend work.          | `docs: finalize project handoff and demo guide`    |

## Daily verification checklist

Run the scripts that exist by that point in the project. By the end of the schedule, the standard gate should be:

```bash
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
```

Also verify each day:

- The diff contains only that day's intended work.
- No `.env*` secrets, database dumps, dependency directories, or build artifacts are staged.
- Any schema change has a migration and reproducible seed update.
- Any new endpoint documents authentication, input, success response, and error cases.
- Ported files are adapted to current routes and APIs; unused source files are not copied preemptively.
- The commit message describes completed work rather than planned work.

## Dependency and fallback rules

- Days 3 and 4 are prerequisites for all persisted user features.
- Day 5 establishes the protected admin shell and reusable editor patterns; every later content type extends those patterns.
- Days 11 and 12 should remain separate: safe quiz creation/delivery first, authoritative submission/scoring second.
- Day 17 is a hardening pass, not the first time security is considered; every earlier endpoint must be safe when introduced.
- If managed database or deployment access is unavailable, continue with local PostgreSQL and document the external blocker. Do not replace backend work with cosmetic commits merely to preserve a streak.
- If a task takes longer than one day, commit only a coherent working slice and move the remaining acceptance criteria forward explicitly. Do not commit knowingly broken code for the sake of a date.

## Candidate work after day 20

These are intentionally outside the initial course-project window:

- Import the remaining PrepLoom subject library in reviewed batches.
- Port the algorithm visualizers and record visualization completion.
- Add password reset and verified-email flows if the chosen auth approach needs them.
- Add richer admin moderation, bulk import, and content revision history.
- Add recommendations based on weak quiz topics and incomplete study-plan items.
- Add OpenAPI generation, end-to-end browser tests, caching, and deeper performance monitoring.
