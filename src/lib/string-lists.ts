/** Keep the public/admin contract as string arrays when Prisma stores lists as JSON. */
export function stringList(value: unknown): string[] {
  if (value == null) return [];
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new TypeError("Expected an array of strings.");
  }
  return value;
}
