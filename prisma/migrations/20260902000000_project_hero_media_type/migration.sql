-- Adds a per-project choice of what fills the pinned project-page frame.
-- Additive and non-destructive: existing rows keep the current behaviour ("image").
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "heroMediaType" TEXT NOT NULL DEFAULT 'image';
