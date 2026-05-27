-- AlterTable: Add extended fields to Project model
ALTER TABLE "Project"
  ADD COLUMN IF NOT EXISTS "projectType"        TEXT    DEFAULT 'web_development',
  ADD COLUMN IF NOT EXISTS "tagline"            TEXT,
  ADD COLUMN IF NOT EXISTS "shortDescription"   TEXT,
  ADD COLUMN IF NOT EXISTS "fullDescription"    TEXT,
  ADD COLUMN IF NOT EXISTS "location"           TEXT,
  ADD COLUMN IF NOT EXISTS "clientLogo"         TEXT,
  ADD COLUMN IF NOT EXISTS "techStack"          JSONB   DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS "challengePoints"    JSONB   DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS "obstacles"          JSONB   DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS "challengeTagline"   TEXT,
  ADD COLUMN IF NOT EXISTS "challengeResponses" JSONB   DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS "solutionOptions"    JSONB   DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS "clientChoice"       INTEGER,
  ADD COLUMN IF NOT EXISTS "resultSlides"       JSONB   DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS "testimonialText"    TEXT,
  ADD COLUMN IF NOT EXISTS "gallery"            JSONB   DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS "extraMile"          TEXT;

-- CreateTable: TechItem
CREATE TABLE IF NOT EXISTS "TechItem" (
  "id"        TEXT        NOT NULL,
  "name"      TEXT        NOT NULL,
  "icon"      TEXT,
  "order"     INTEGER     NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "TechItem_pkey" PRIMARY KEY ("id")
);
