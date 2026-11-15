ALTER TABLE "subjects" ADD COLUMN "course" JSONB;
ALTER TABLE "quizzes" ADD COLUMN "definition" JSONB;

CREATE TABLE "dsa_sheets" (
  "id" VARCHAR(120) NOT NULL,
  "details" JSONB NOT NULL,
  "position" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "dsa_sheets_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "interview_collections" (
  "slug" VARCHAR(120) NOT NULL,
  "questions" JSONB NOT NULL,
  CONSTRAINT "interview_collections_pkey" PRIMARY KEY ("slug")
);

CREATE TABLE "public_roadmaps" (
  "id" VARCHAR(120) NOT NULL,
  "details" JSONB NOT NULL,
  "position" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "public_roadmaps_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "webdev_content" (
  "id" VARCHAR(40) NOT NULL,
  "details" JSONB NOT NULL,
  CONSTRAINT "webdev_content_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "submissions" (
  "id" TEXT NOT NULL,
  "kind" VARCHAR(20) NOT NULL,
  "name" VARCHAR(120),
  "email" VARCHAR(254),
  "category" VARCHAR(80) NOT NULL,
  "message" TEXT NOT NULL,
  "page_url" VARCHAR(1000),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "site_catalogs" (
  "id" VARCHAR(40) NOT NULL,
  "details" JSONB NOT NULL,
  CONSTRAINT "site_catalogs_pkey" PRIMARY KEY ("id")
);
