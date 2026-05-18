import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database…");

  // Services
  await prisma.service.deleteMany();
  await prisma.service.createMany({
    data: [
      {
        title: "Brand Systems",
        description: "Names, identities, rules, and visual logic that keep every touchpoint coherent across every surface.",
        icon: "01",
        order: 1,
      },
      {
        title: "Digital Products",
        description: "Interfaces and flows built to feel fast, clear, and unmistakably yours — from wireframe to launch.",
        icon: "02",
        order: 2,
      },
      {
        title: "Immersive Web",
        description: "Three.js, GSAP, and tactile interactions that make the browser feel spatial and alive.",
        icon: "03",
        order: 3,
      },
      {
        title: "Motion Identities",
        description: "Systems that move with intent — from logo behaviour to full campaign launch films.",
        icon: "04",
        order: 4,
      },
    ],
  });

  // Projects
  await prisma.project.deleteMany();
  await prisma.project.createMany({
    data: [
      {
        slug: "elia-clinic",
        title: "Elia Clinic",
        description: "A calm, conversion-led medical site with a modular content system and refined motion.",
        client: "Elia Medical Group",
        year: "2025",
        category: "Healthcare",
        tags: ["Web Design", "Motion", "CMS"],
        coverImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80&auto=format&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80",
          "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=80",
        ],
        featured: true,
        order: 1,
        status: "PUBLISHED",
      },
      {
        slug: "montgab",
        title: "Montgab",
        description: "A tactile storefront balancing product storytelling, speed, and editorial whitespace.",
        client: "Montgab Collective",
        year: "2025",
        category: "E-Commerce",
        tags: ["E-Commerce", "UI/UX", "Shopify"],
        coverImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80&auto=format&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80",
          "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1200&q=80",
        ],
        featured: true,
        order: 2,
        status: "PUBLISHED",
      },
      {
        slug: "180-degrees",
        title: "180 Degrees",
        description: "A flexible studio identity translated into web, motion, and campaign surfaces.",
        client: "180 Degrees Studio",
        year: "2026",
        category: "Agency / Brand",
        tags: ["Branding", "Motion", "Web"],
        coverImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80&auto=format&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80",
        ],
        featured: false,
        order: 3,
        status: "PUBLISHED",
      },
      {
        slug: "launchpad",
        title: "Launchpad",
        description: "A developer-focused SaaS dashboard built for speed, clarity, and team collaboration.",
        client: "Launchpad Inc.",
        year: "2026",
        category: "SaaS Platform",
        tags: ["SaaS", "Dashboard", "Next.js"],
        coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80&auto=format&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
        ],
        featured: false,
        order: 4,
        status: "PUBLISHED",
      },
    ],
  });

  console.log("✓ Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
