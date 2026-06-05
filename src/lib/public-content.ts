import "server-only";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/i18n/config";

export type PublicProject = {
  id: string; slug: string; title: string; description: string | null; client: string | null;
  category: string | null; tags: string[]; year: string | null; coverImage: string | null; gifUrl?: string | null; liveUrl: string | null;
  services?: PublicService[]; attachments?: Record<string, string[]>;
};
export type PublicService = {
  id: string; slug?: string; title: string; description: string | null; icon: string | null;
  shortDescription?: string | null; tagline?: string | null;
  benefits?: unknown; deliverables?: unknown; process?: unknown; techStack?: unknown;
  techStackItems?: { id: string; name: string; icon: string | null; iconUrl: string | null }[];
  attachments?: Record<string, Record<string, string[]>>;
  faq?: unknown;
  ctaHeadline?: string | null;
  ctaSubtext?: string | null;
  ctaButtonLabel?: string | null;
  ctaButtonLink?: string | null;
  relatedProjects?: { id: string; slug: string; title: string; description: string | null; coverImage: string | null; category: string | null }[];
};
export type PublicPost = { id: string; slug: string; title: string; excerpt: string | null; content: string; tags: string[]; coverImage: string | null; heroImage: string | null; publishedAt: Date | null };
export type PublicTeamMember = { id: string; name: string; role: string; bio: string | null; photo: string | null };
export type PublicContact = { headline: string | null; subheadline: string | null; address: string | null; email: string | null; phone: string | null };

const fallbackProjects: PublicProject[] = [
  { id: "elia-clinic", slug: "elia-clinic", title: "Elia Clinic", description: "A calm medical platform built around trust and effortless booking.", client: "Elia Medical Group", category: "Healthcare", tags: ["Web Design", "CMS"], year: "2025", coverImage: null, liveUrl: null },
  { id: "montgab", slug: "montgab", title: "Montgab", description: "An editorial storefront designed for discovery and conversion.", client: "Montgab Collective", category: "E-Commerce", tags: ["Commerce", "UI/UX"], year: "2025", coverImage: null, liveUrl: null },
  { id: "launchpad", slug: "launchpad", title: "Launchpad", description: "A focused SaaS workspace for fast-moving teams.", client: "Launchpad Inc.", category: "SaaS Platform", tags: ["React", "Dashboard"], year: "2026", coverImage: null, liveUrl: null },
];
const fallbackProjectsAr = [
  { title: "عيادة إيليا", description: "منصة طبية هادئة مبنية حول الثقة وسهولة الحجز.", client: "مجموعة إيليا الطبية", category: "الرعاية الصحية", tags: ["تصميم الويب", "إدارة المحتوى"] },
  { title: "مونتغاب", description: "متجر تحريري مصمم للاكتشاف والتحويل.", client: "مجموعة مونتغاب", category: "التجارة الإلكترونية", tags: ["التجارة", "تجربة المستخدم"] },
  { title: "لانشباد", description: "مساحة عمل مركزة لفرق البرمجيات سريعة الحركة.", client: "لانشباد", category: "منصة برمجية", tags: ["React", "لوحة تحكم"] },
];
const fallbackServices: PublicService[] = [
  { id: "web-development", title: "Web Development", description: "Custom websites, WordPress solutions, landing pages, and web experiences that look sharp and actually work.", icon: "01" },
  { id: "ui-ux-design", title: "UI/UX Design", description: "Interfaces that look sharp, feel clear, and do not make users question their life choices.", icon: "02" },
  { id: "mobile-apps", title: "Mobile Apps", description: "Mobile app experiences that feel clean, useful, and ready for real users.", icon: "03" },
  { id: "seo-site-health", title: "SEO & Site Health", description: "Technical, structural, and content problems that quietly weaken your website — fixed.", icon: "04" },
  { id: "crm-systems", title: "CRM Systems", description: "CRM systems, dashboards, and workflows that help teams track leads, clients, and bookings.", icon: "05" },
  { id: "ecommerce", title: "E-commerce", description: "Stores that make products easier to browse, trust, and buy.", icon: "06" },
];
const fallbackServicesAr = ["تطوير الويب", "تصميم الواجهات وتجربة المستخدم", "التجارة الإلكترونية", "تطبيقات الجوال", "استراتيجية البحث", "منصات إدارة العملاء"];
const fallbackPosts: PublicPost[] = [
  {
    id: "web-performance",
    slug: "web-performance",
    title: "Why website speed shapes trust",
    excerpt: "A practical view of performance budgets and better product decisions.",
    content: "## Speed is part of the brand\n\nA quick interface makes each interaction feel deliberate. We measure loading, responsiveness, and visual stability before launch.\n\n- Compress media early\n- Ship less JavaScript\n- Test real journeys",
    tags: ["Performance"],
    coverImage: null,
    heroImage: null,
    publishedAt: null,
  },
  {
    id: "design-systems",
    slug: "design-systems",
    title: "Design systems that stay useful",
    excerpt: "The smallest system that keeps a growing product consistent.",
    content: "## A system supports decisions\n\nReusable tokens and components help a team move quickly while leaving space for expression.",
    tags: ["Design"],
    coverImage: null,
    heroImage: null,
    publishedAt: null,
  },
];
const fallbackPostsAr = [
  {
    title: "كيف تبني سرعة الموقع الثقة",
    excerpt: "نظرة عملية إلى ميزانيات الأداء وقرارات المنتج الأفضل.",
    content: "## السرعة جزء من العلامة\n\nتجعل الواجهة السريعة كل تفاعل مقصوداً. نقيس التحميل والاستجابة والثبات البصري قبل الإطلاق.\n\n- ضغط الوسائط مبكراً\n- تقليل JavaScript\n- اختبار رحلات الاستخدام الفعلية",
    tags: ["الأداء"],
  },
  {
    title: "أنظمة تصميم تبقى مفيدة",
    excerpt: "أصغر نظام يحافظ على اتساق المنتج أثناء نموه.",
    content: "## النظام يدعم القرارات\n\nتساعد الرموز والمكونات القابلة لإعادة الاستخدام الفريق على التحرك بسرعة مع الحفاظ على مساحة للتعبير.",
    tags: ["التصميم"],
  },
];

function localized(locale: Locale, english: string | null, arabic: string | null | undefined) {
  return locale === "ar" && arabic?.trim() ? arabic : english;
}

function projectAttachmentMap(record: { attachments?: { role: string; media: { url: string } }[] }) {
  return (record.attachments ?? []).reduce<Record<string, string[]>>((acc, item) => {
    acc[item.role] = [...(acc[item.role] ?? []), item.media.url];
    return acc;
  }, {});
}

function serviceAttachmentMap(record: { attachments?: { role: string; theme: string | null; media: { url: string } }[] }) {
  return (record.attachments ?? []).reduce<Record<string, Record<string, string[]>>>((acc, item) => {
    const theme = item.theme ?? "shared";
    acc[theme] = acc[theme] ?? {};
    acc[theme][item.role] = [...(acc[theme][item.role] ?? []), item.media.url];
    return acc;
  }, {});
}

function techIds(techStack: unknown) {
  return Array.isArray(techStack) ? techStack.filter((id): id is string => typeof id === "string") : [];
}

export async function getProjects(locale: Locale): Promise<PublicProject[]> {
  try {
    const records = await prisma.project.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      include: {
        attachments: { include: { media: true }, orderBy: { order: "asc" } },
        services: { include: { service: { include: { attachments: { include: { media: true }, orderBy: { order: "asc" } } } } }, orderBy: { order: "asc" } },
      },
    });
    if (records.length) return records.map((record) => ({
      ...record,
      coverImage: projectAttachmentMap(record).project_cover?.[0] ?? record.coverImage,
      title: localized(locale, record.title, record.titleAr)!,
      description: localized(locale, record.description, record.descriptionAr),
      client: localized(locale, record.client, record.clientAr),
      category: localized(locale, record.category, record.categoryAr),
      tags: locale === "ar" && record.tagsAr.length ? record.tagsAr : record.tags,
      attachments: projectAttachmentMap(record),
      services: record.services.map(({ service }) => ({
        id: service.slug || service.id,
        slug: service.slug,
        title: localized(locale, service.title, service.titleAr)!,
        description: localized(locale, service.description, service.descriptionAr),
        icon: service.icon,
        shortDescription: service.shortDescription,
        tagline: service.tagline,
        benefits: service.benefits,
        deliverables: service.deliverables,
        process: service.process,
        techStack: service.techStack,
        attachments: serviceAttachmentMap(service),
      })),
    }));
  } catch {}
  return fallbackProjects.map((project, index) => locale === "ar" ? { ...project, ...fallbackProjectsAr[index] } : project);
}

export async function getProject(locale: Locale, slug: string) {
  return (await getProjects(locale)).find((project) => project.slug === slug) ?? null;
}

export async function getServices(locale: Locale): Promise<PublicService[]> {
  try {
    const records = await prisma.service.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
      include: {
        attachments: { include: { media: true }, orderBy: { order: "asc" } },
        projects: { include: { project: { include: { attachments: { include: { media: true }, orderBy: { order: "asc" } } } } }, orderBy: { order: "asc" } },
      },
    });
    const techItemIds = Array.from(new Set(records.flatMap((record) => techIds(record.techStack))));
    const techItems = techItemIds.length
      ? await prisma.techItem.findMany({ where: { id: { in: techItemIds } }, select: { id: true, name: true, icon: true, iconUrl: true } })
      : [];
    const techById = new Map(techItems.map((item) => [item.id, item]));
    if (records.length) return records.map((record, index) => ({
      id: record.slug || (fallbackServices[index]?.id ?? record.id),
      slug: record.slug,
      title: localized(locale, record.title, record.titleAr)!,
      description: localized(locale, record.description, record.descriptionAr),
      shortDescription: record.shortDescription,
      tagline: record.tagline,
      benefits: record.benefits,
      deliverables: record.deliverables,
      process: record.process,
      techStack: record.techStack,
      techStackItems: techIds(record.techStack).map((id) => techById.get(id)).filter((item): item is NonNullable<typeof item> => Boolean(item)),
      icon: record.icon,
      attachments: serviceAttachmentMap(record),
      faq: record.faq,
      ctaHeadline: record.ctaHeadline,
      ctaSubtext: record.ctaSubtext,
      ctaButtonLabel: record.ctaButtonLabel,
      ctaButtonLink: record.ctaButtonLink,
      relatedProjects: record.projects.map(({ project }) => ({
        id: project.slug || project.id,
        slug: project.slug || project.id,
        title: localized(locale, project.title, project.titleAr)!,
        description: localized(locale, project.description, project.descriptionAr),
        category: localized(locale, project.category, project.categoryAr),
        coverImage: projectAttachmentMap(project).project_cover?.[0] ?? project.coverImage,
      })),
    }));
  } catch {}
  return fallbackServices.map((service, index) => locale === "ar" ? { ...service, title: fallbackServicesAr[index] } : service);
}

export async function getService(locale: Locale, id: string) {
  return (await getServices(locale)).find((service) => service.id === id) ?? null;
}

export async function getPosts(locale: Locale): Promise<PublicPost[]> {
  try {
    const records = await prisma.post.findMany({ where: { status: "PUBLISHED" }, orderBy: [{ order: "asc" }, { publishedAt: "desc" }] });
    if (records.length) return records.map((record) => ({
      ...record,
      title: localized(locale, record.title, record.titleAr)!,
      excerpt: localized(locale, record.excerpt, record.excerptAr),
      content: localized(locale, record.content, record.contentAr) ?? "",
      tags: locale === "ar" && record.tagsAr.length ? record.tagsAr : record.tags,
      heroImage: record.heroImage ?? null,
    }));
  } catch {}
  return fallbackPosts.map((post, index) => locale === "ar" ? { ...post, ...fallbackPostsAr[index] } : post);
}

export async function getPost(locale: Locale, slug: string) {
  return (await getPosts(locale)).find((post) => post.slug === slug) ?? null;
}

export async function getTeam(locale: Locale): Promise<PublicTeamMember[]> {
  try {
    const records = await prisma.teamMember.findMany({ where: { active: true }, orderBy: { order: "asc" } });
    return records.map((record) => ({
      ...record,
      name: localized(locale, record.name, record.nameAr)!,
      role: localized(locale, record.role, record.roleAr)!,
      bio: localized(locale, record.bio, record.bioAr),
    }));
  } catch { return []; }
}

export type PublicClient = { id: string; name: string; company: string | null; logo: string | null; website: string | null };

export async function getClients(): Promise<PublicClient[]> {
  try {
    const records = await prisma.clientItem.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }] });
    return records.map((r) => ({ id: r.id, name: r.name, company: r.company, logo: r.logo, website: r.website }));
  } catch { return []; }
}

export async function getContact(locale: Locale): Promise<PublicContact | null> {
  try {
    const page = await prisma.contactPage.findUnique({ where: { id: 1 } });
    if (!page) return null;
    return {
      headline: localized(locale, page.headline, page.headlineAr),
      subheadline: localized(locale, page.subheadline, page.subheadlineAr),
      address: localized(locale, page.address, page.addressAr),
      email: page.email,
      phone: page.phone,
    };
  } catch { return null; }
}
