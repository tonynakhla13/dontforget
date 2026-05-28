import type { Prisma } from "@prisma/client";

type ClientItemPayload = {
  name?: unknown;
  company?: unknown;
  country?: unknown;
  logo?: unknown;
  website?: unknown;
  order?: unknown;
};

function nullableString(value: unknown) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}

export function parseClientItemCreatePayload(
  body: ClientItemPayload
): Prisma.ClientItemCreateInput | { error: string } {
  const name = nullableString(body.name);
  if (!name) return { error: "Contact name is required" };

  return {
    name,
    company: nullableString(body.company),
    country: nullableString(body.country),
    logo: nullableString(body.logo),
    website: nullableString(body.website),
    order: typeof body.order === "number" && Number.isFinite(body.order) ? body.order : 0,
  };
}

export function parseClientItemUpdatePayload(
  body: ClientItemPayload
): Prisma.ClientItemUpdateInput | { error: string } {
  const name = nullableString(body.name);
  if (!name) return { error: "Contact name is required" };

  return {
    name,
    company: nullableString(body.company),
    country: nullableString(body.country),
    logo: nullableString(body.logo),
    website: nullableString(body.website),
  };
}
