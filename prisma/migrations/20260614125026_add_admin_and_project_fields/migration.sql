-- AlterTable
-- Phased: add nullable, backfill unique slugs for any pre-existing rows, then
-- enforce NOT NULL. Adding NOT NULL directly would fail on databases that
-- already have `project` rows (e.g. a dev DB seeded before this migration).
ALTER TABLE "project" ADD COLUMN     "archived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "slug" TEXT;

-- Backfill: slugify the project name and append the unique project id so the
-- result is deterministic and guaranteed unique even when names collide or
-- contain no alphanumeric characters.
UPDATE "project"
SET "slug" =
  COALESCE(
    NULLIF(
      LOWER(
        regexp_replace(
          regexp_replace("name", '[^a-zA-Z0-9]+', '-', 'g'),
          '^-+|-+$',
          '',
          'g'
        )
      ),
      ''
    ),
    'project'
  ) || '-' || "id"
WHERE "slug" IS NULL;

ALTER TABLE "project" ALTER COLUMN "slug" SET NOT NULL;

-- AlterTable
ALTER TABLE "session" ADD COLUMN     "impersonatedBy" TEXT;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "banExpires" TIMESTAMPTZ(6),
ADD COLUMN     "banReason" TEXT,
ADD COLUMN     "banned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user';

-- CreateTable
CREATE TABLE "project_manager" (
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "terminatedAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_manager_pkey" PRIMARY KEY ("projectId","userId")
);

-- CreateIndex
CREATE INDEX "project_manager_userId_idx" ON "project_manager"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "project_slug_key" ON "project"("slug");

-- AddForeignKey
ALTER TABLE "project_manager" ADD CONSTRAINT "project_manager_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_manager" ADD CONSTRAINT "project_manager_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
