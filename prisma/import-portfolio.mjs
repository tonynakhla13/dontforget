import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import portfolioProjects from "../src/data/portfolio-projects.json" with { type: "json" };

config({ path: ".env.local" });
config({ path: ".env" });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required to import the portfolio.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

try {
  for (const project of portfolioProjects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      create: {
        slug: project.slug,
        title: project.title,
        description: null,
        year: project.year,
        category: project.category,
        tags: project.tags,
        coverImage: null,
        images: [],
        liveUrl: project.liveUrl,
        featured: project.featured,
        order: project.order,
        status: "PUBLISHED",
        projectType: project.projectType,
      },
      update: {
        title: project.title,
        year: project.year,
        category: project.category,
        tags: project.tags,
        liveUrl: project.liveUrl,
        featured: project.featured,
        order: project.order,
        status: "PUBLISHED",
        projectType: project.projectType,
      },
    });
  }

  console.log(`Upserted ${portfolioProjects.length} portfolio projects.`);
} finally {
  await prisma.$disconnect();
}
