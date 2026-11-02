CREATE TABLE "roadmaps" (
    "id" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,
    "title" VARCHAR(160) NOT NULL,
    "slug" VARCHAR(160) NOT NULL,
    "summary" TEXT,
    "steps" JSONB NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roadmaps_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "roadmaps_subject_id_position_idx" ON "roadmaps"("subject_id", "position");

CREATE UNIQUE INDEX "roadmaps_subject_id_slug_key" ON "roadmaps"("subject_id", "slug");

ALTER TABLE "roadmaps" ADD CONSTRAINT "roadmaps_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
