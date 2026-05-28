import type { Prisma } from "@prisma/client";

type AttachmentInput = {
  mediaId?: string;
  role?: string;
  theme?: string | null;
  order?: number;
  metadata?: Prisma.InputJsonValue;
};

const projectFields = [
  "title", "titleAr", "slug", "description", "descriptionAr", "client", "clientAr", "clientId",
  "year", "category", "categoryAr", "tags", "tagsAr", "coverImage", "images", "videoUrl", "gifUrl",
  "liveUrl", "githubUrl", "caseStudyUrl", "featured", "order", "status", "projectType", "tagline",
  "shortDescription", "fullDescription", "location", "clientLogo", "techStack", "challengePoints",
  "obstacles", "challengeTagline", "challengeResponses", "solutionOptions", "clientChoice",
  "resultSlides", "testimonialText", "gallery", "extraMile", "heroImage", "tallImage", "useTallImage",
  "clientGoals", "challenges", "results", "testimonialAuthor", "testimonialRole", "testimonialCompany",
  "extraMilePlanned",
] as const;

const serviceFields = [
  "title", "titleAr", "slug", "description", "descriptionAr", "shortDescription", "tagline",
  "benefits", "deliverables", "process", "techStack", "featured", "seoTitle", "seoDescription", "icon", "order", "active",
] as const;

export function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function pick<T extends readonly string[]>(body: Record<string, unknown>, fields: T) {
  const data: Record<string, unknown> = {};
  for (const field of fields) {
    if (Object.prototype.hasOwnProperty.call(body, field)) data[field] = body[field];
  }
  return data;
}

function attachmentRows(attachments: unknown) {
  if (!Array.isArray(attachments)) return undefined;
  const rows = attachments
    .filter((item): item is AttachmentInput => !!item && typeof item === "object")
    .filter((item) => typeof item.mediaId === "string" && item.mediaId.length > 0 && typeof item.role === "string" && item.role.length > 0)
    .map((item, index) => ({
      media: { connect: { id: item.mediaId! } },
      role: item.role!,
      theme: item.theme ?? null,
      order: Number.isFinite(item.order) ? Number(item.order) : index,
      metadata: item.metadata ?? {},
    }));

  return rows;
}

export function projectData(body: Record<string, unknown>): Prisma.ProjectCreateInput {
  const data = pick(body, projectFields) as Prisma.ProjectCreateInput;
  const serviceIds = Array.isArray(body.serviceIds) ? body.serviceIds.filter((id): id is string => typeof id === "string") : [];
  const attachments = attachmentRows(body.attachments);
  if (attachments) data.attachments = { create: attachments };
  if (serviceIds.length) {
    data.services = { create: serviceIds.map((serviceId, order) => ({ order, service: { connect: { id: serviceId } } })) };
  }
  return data;
}

export function projectUpdateData(body: Record<string, unknown>): Prisma.ProjectUpdateInput {
  const data = pick(body, projectFields) as Prisma.ProjectUpdateInput;
  if (Array.isArray(body.attachments)) data.attachments = { deleteMany: {}, create: attachmentRows(body.attachments) ?? [] };
  if (Array.isArray(body.serviceIds)) {
    const serviceIds = body.serviceIds.filter((id): id is string => typeof id === "string");
    data.services = { deleteMany: {}, create: serviceIds.map((serviceId, order) => ({ order, service: { connect: { id: serviceId } } })) };
  }
  return data;
}

export function serviceData(body: Record<string, unknown>): Prisma.ServiceCreateInput {
  const data = pick(body, serviceFields) as Prisma.ServiceCreateInput;
  if (!data.slug && typeof data.title === "string") data.slug = slugify(data.title);
  const attachments = attachmentRows(body.attachments);
  if (attachments) data.attachments = { create: attachments };
  return data;
}

export function serviceUpdateData(body: Record<string, unknown>): Prisma.ServiceUpdateInput {
  const data = pick(body, serviceFields) as Prisma.ServiceUpdateInput;
  if (Array.isArray(body.attachments)) data.attachments = { deleteMany: {}, create: attachmentRows(body.attachments) ?? [] };
  return data;
}
