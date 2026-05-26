import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database…");

  // Services
  await prisma.service.deleteMany();
  await prisma.service.createMany({
    data: [
      {
        title: "Web Dev",
        titleAr: "تطوير الويب",
        description: "Fast, scalable, interactive websites and applications built around performance, clarity, and measurable results.",
        descriptionAr: "مواقع وتطبيقات سريعة وقابلة للتوسع مبنية حول الأداء والوضوح والنتائج القابلة للقياس.",
        icon: "01",
        order: 1,
      },
      {
        title: "UI / UX",
        titleAr: "تصميم الواجهات وتجربة المستخدم",
        description: "Research-led interfaces, product flows, prototypes, and design systems shaped around how people actually use them.",
        descriptionAr: "واجهات وتدفقات منتجات وأنظمة تصميم مبنية على فهم استخدام الناس الفعلي.",
        icon: "02",
        order: 2,
      },
      {
        title: "E-Commerce",
        titleAr: "التجارة الإلكترونية",
        description: "Conversion-focused stores with storefront design, payments, retention flows, analytics, and growth foundations.",
        descriptionAr: "متاجر تركز على التحويل مع الدفع والتحليلات وأسس النمو.",
        icon: "03",
        order: 3,
      },
      {
        title: "Mobile",
        titleAr: "تطبيقات الجوال",
        description: "iOS and Android experiences with native-feeling flows, app release support, notifications, and analytics.",
        descriptionAr: "تجارب iOS وAndroid سلسة مع دعم الإطلاق والإشعارات والتحليلات.",
        icon: "04",
        order: 4,
      },
      {
        title: "SEO",
        titleAr: "تحسين محركات البحث",
        description: "Technical audits, search architecture, content planning, Core Web Vitals, and AI-search visibility strategy.",
        descriptionAr: "تدقيق تقني وهيكلة البحث وتخطيط المحتوى واستراتيجية الظهور.",
        icon: "05",
        order: 5,
      },
      {
        title: "CRM",
        titleAr: "إدارة علاقات العملاء",
        description: "Custom operational platforms for bookings, teams, pipelines, reports, integrations, and business workflows.",
        descriptionAr: "منصات تشغيل مخصصة للحجوزات والفرق والتقارير وسير العمل.",
        icon: "06",
        order: 6,
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
        titleAr: "عيادة إيليا",
        description: "A calm, conversion-led medical site with a modular content system and refined motion.",
        descriptionAr: "موقع طبي هادئ يركز على التحويل مع نظام محتوى مرن وحركة دقيقة.",
        client: "Elia Medical Group",
        clientAr: "مجموعة إيليا الطبية",
        year: "2025",
        category: "Healthcare",
        categoryAr: "الرعاية الصحية",
        tags: ["Web Design", "Motion", "CMS"],
        tagsAr: ["تصميم الويب", "الحركة", "إدارة المحتوى"],
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
        titleAr: "مونتغاب",
        description: "A tactile storefront balancing product storytelling, speed, and editorial whitespace.",
        descriptionAr: "متجر يجمع بين سرد المنتج والسرعة والمساحات التحريرية.",
        client: "Montgab Collective",
        clientAr: "مجموعة مونتغاب",
        year: "2025",
        category: "E-Commerce",
        categoryAr: "التجارة الإلكترونية",
        tags: ["E-Commerce", "UI/UX", "Shopify"],
        tagsAr: ["التجارة الإلكترونية", "تجربة المستخدم", "Shopify"],
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
        titleAr: "180 درجة",
        description: "A flexible studio identity translated into web, motion, and campaign surfaces.",
        descriptionAr: "هوية استوديو مرنة مترجمة إلى الويب والحركة والحملات.",
        client: "180 Degrees Studio",
        clientAr: "استوديو 180 درجة",
        year: "2026",
        category: "Agency / Brand",
        categoryAr: "وكالة / علامة تجارية",
        tags: ["Branding", "Motion", "Web"],
        tagsAr: ["العلامة التجارية", "الحركة", "الويب"],
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
        titleAr: "لانشباد",
        description: "A developer-focused SaaS dashboard built for speed, clarity, and team collaboration.",
        descriptionAr: "لوحة منصة برمجية للمطورين مبنية للسرعة والوضوح والتعاون.",
        client: "Launchpad Inc.",
        clientAr: "لانشباد",
        year: "2026",
        category: "SaaS Platform",
        categoryAr: "منصة برمجية",
        tags: ["SaaS", "Dashboard", "Next.js"],
        tagsAr: ["SaaS", "لوحة تحكم", "Next.js"],
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
