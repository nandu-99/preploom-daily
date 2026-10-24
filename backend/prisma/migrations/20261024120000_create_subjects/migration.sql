CREATE TABLE "subjects" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "subjects_slug_key" ON "subjects"("slug");
