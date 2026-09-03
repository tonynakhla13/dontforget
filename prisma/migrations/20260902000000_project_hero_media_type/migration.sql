-- Adds a per-project choice of what fills the pinned project-page frame.
-- Existing rows keep the current image behaviour.
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "heroMediaType" TEXT NOT NULL DEFAULT 'image';
