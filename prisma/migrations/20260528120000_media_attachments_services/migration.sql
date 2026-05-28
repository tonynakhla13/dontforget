-- Normalized media library, project/service attachments, and service-project links.

ALTER TABLE "Project"
  ALTER COLUMN "projectType" SET DEFAULT 'website',
  ADD COLUMN IF NOT EXISTS "heroImage" TEXT,
  ADD COLUMN IF NOT EXISTS "tallImage" TEXT,
  ADD COLUMN IF NOT EXISTS "useTallImage" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "clientGoals" JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS "challenges" JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS "results" JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS "testimonialAuthor" TEXT,
  ADD COLUMN IF NOT EXISTS "testimonialRole" TEXT,
  ADD COLUMN IF NOT EXISTS "testimonialCompany" TEXT,
  ADD COLUMN IF NOT EXISTS "extraMilePlanned" TEXT;

UPDATE "Project"
SET "projectType" = 'website'
WHERE "projectType" IS NULL OR "projectType" = 'web_development';

ALTER TABLE "Service"
  ADD COLUMN IF NOT EXISTS "slug" TEXT,
  ADD COLUMN IF NOT EXISTS "shortDescription" TEXT,
  ADD COLUMN IF NOT EXISTS "tagline" TEXT,
  ADD COLUMN IF NOT EXISTS "benefits" JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS "deliverables" JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS "process" JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS "featured" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "seoTitle" TEXT,
  ADD COLUMN IF NOT EXISTS "seoDescription" TEXT;

UPDATE "Service"
SET "slug" = lower(regexp_replace(regexp_replace("title", '[^a-zA-Z0-9]+', '-', 'g'), '(^-|-$)', '', 'g'))
WHERE "slug" IS NULL OR "slug" = '';

WITH duplicates AS (
  SELECT "id", "slug", row_number() OVER (PARTITION BY "slug" ORDER BY "createdAt", "id") AS rn
  FROM "Service"
)
UPDATE "Service" s
SET "slug" = s."slug" || '-' || duplicates.rn
FROM duplicates
WHERE s."id" = duplicates."id" AND duplicates.rn > 1;

ALTER TABLE "Service" ALTER COLUMN "slug" SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "Service_slug_key" ON "Service"("slug");

CREATE TABLE IF NOT EXISTS "MediaAsset" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "url" TEXT NOT NULL,
  "filename" TEXT,
  "originalName" TEXT,
  "mimeType" TEXT NOT NULL DEFAULT 'application/octet-stream',
  "size" INTEGER NOT NULL DEFAULT 0,
  "width" INTEGER,
  "height" INTEGER,
  "alt" TEXT,
  "caption" TEXT,
  "folder" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS "MediaAsset_url_key" ON "MediaAsset"("url");

CREATE TABLE IF NOT EXISTS "Attachment" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "mediaId" TEXT NOT NULL,
  "projectId" TEXT,
  "serviceId" TEXT,
  "theme" TEXT,
  "role" TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Attachment_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "MediaAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Attachment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Attachment_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "Attachment_projectId_role_theme_idx" ON "Attachment"("projectId", "role", "theme");
CREATE INDEX IF NOT EXISTS "Attachment_serviceId_role_theme_idx" ON "Attachment"("serviceId", "role", "theme");
CREATE INDEX IF NOT EXISTS "Attachment_mediaId_idx" ON "Attachment"("mediaId");

CREATE TABLE IF NOT EXISTS "ProjectService" (
  "projectId" TEXT NOT NULL,
  "serviceId" TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "ProjectService_pkey" PRIMARY KEY ("projectId", "serviceId"),
  CONSTRAINT "ProjectService_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "ProjectService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "ProjectService_serviceId_idx" ON "ProjectService"("serviceId");

-- Backfill legacy project URLs into reusable media assets and attachment rows.
WITH urls AS (
  SELECT "id" AS "projectId", 'project_cover' AS role, 0 AS ord, "coverImage" AS url FROM "Project" WHERE "coverImage" IS NOT NULL AND "coverImage" <> ''
  UNION ALL
  SELECT "id", 'project_hero', 0, "heroImage" FROM "Project" WHERE "heroImage" IS NOT NULL AND "heroImage" <> ''
  UNION ALL
  SELECT "id", 'project_tall_screenshot', 0, "tallImage" FROM "Project" WHERE "tallImage" IS NOT NULL AND "tallImage" <> ''
  UNION ALL
  SELECT p."id", 'project_gallery', ord::int, value->>'url'
  FROM "Project" p, jsonb_array_elements(CASE WHEN jsonb_typeof(p."gallery") = 'array' THEN p."gallery" ELSE '[]'::jsonb END) WITH ORDINALITY AS g(value, ord)
  WHERE value->>'url' IS NOT NULL AND value->>'url' <> ''
  UNION ALL
  SELECT p."id", 'project_result', ord::int, value->>'media'
  FROM "Project" p, jsonb_array_elements(CASE WHEN jsonb_typeof(p."resultSlides") = 'array' THEN p."resultSlides" ELSE '[]'::jsonb END) WITH ORDINALITY AS r(value, ord)
  WHERE value->>'media' IS NOT NULL AND value->>'media' <> ''
)
INSERT INTO "MediaAsset" ("id", "url", "filename", "originalName", "mimeType", "size", "folder")
SELECT 'media_' || md5(url), url, regexp_replace(url, '^.*/', ''), regexp_replace(url, '^.*/', ''), 'application/octet-stream', 0, NULL
FROM (SELECT DISTINCT url FROM urls) distinct_urls
ON CONFLICT ("url") DO NOTHING;

WITH urls AS (
  SELECT "id" AS "projectId", 'project_cover' AS role, 0 AS ord, "coverImage" AS url FROM "Project" WHERE "coverImage" IS NOT NULL AND "coverImage" <> ''
  UNION ALL
  SELECT p."id", 'project_gallery', ord::int, value->>'url'
  FROM "Project" p, jsonb_array_elements(CASE WHEN jsonb_typeof(p."gallery") = 'array' THEN p."gallery" ELSE '[]'::jsonb END) WITH ORDINALITY AS g(value, ord)
  WHERE value->>'url' IS NOT NULL AND value->>'url' <> ''
  UNION ALL
  SELECT p."id", 'project_result', ord::int, value->>'media'
  FROM "Project" p, jsonb_array_elements(CASE WHEN jsonb_typeof(p."resultSlides") = 'array' THEN p."resultSlides" ELSE '[]'::jsonb END) WITH ORDINALITY AS r(value, ord)
  WHERE value->>'media' IS NOT NULL AND value->>'media' <> ''
)
INSERT INTO "Attachment" ("id", "mediaId", "projectId", "role", "order")
SELECT 'att_' || md5(u."projectId" || u.role || u.ord || u.url), m."id", u."projectId", u.role, u.ord
FROM urls u
JOIN "MediaAsset" m ON m."url" = u.url
ON CONFLICT ("id") DO NOTHING;
