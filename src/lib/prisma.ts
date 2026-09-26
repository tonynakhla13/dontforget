import { PrismaClient } from "@prisma/client";
import { createDatabaseAdapter } from "./database-adapter.mjs";
import { stringList } from "./string-lists";

const globalForPrisma = globalThis as unknown as { prismaMysql?: ReturnType<typeof createPrismaClient> };

function createPrismaClient() {
  return new PrismaClient({
    adapter: createDatabaseAdapter(),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  }).$extends({
    name: "nox-string-lists",
    result: {
      project: {
        tags: { needs: { tags: true }, compute: (row) => stringList(row.tags) },
        tagsAr: { needs: { tagsAr: true }, compute: (row) => stringList(row.tagsAr) },
        images: { needs: { images: true }, compute: (row) => stringList(row.images) },
      },
      post: {
        tags: { needs: { tags: true }, compute: (row) => stringList(row.tags) },
        tagsAr: { needs: { tagsAr: true }, compute: (row) => stringList(row.tagsAr) },
      },
      inquiry: {
        audioUrls: { needs: { audioUrls: true }, compute: (row) => stringList(row.audioUrls) },
        assetNames: { needs: { assetNames: true }, compute: (row) => stringList(row.assetNames) },
      },
    },
  });
}

export const prisma = globalForPrisma.prismaMysql ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prismaMysql = prisma;
