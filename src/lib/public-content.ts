import "server-only";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/i18n/config";

export type PublicProject = {
  id: string; slug: string; title: string; description: string | null; client: string | null;
  category: string | null; tags: string[]; year: string | null; coverImage: string | null; liveUrl: string | null;
};
export type PublicService = { id: string; title: string; description: string | null; icon: string | null };
export type PublicPost = { id: string; slug: string; title: string; excerpt: string | null; content: string; tags: string[]; coverImage: string | null; publishedAt: Date | null };
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
  { id: "webdev", title: "Web Development", description: "Fast, scalable websites and applications with measurable outcomes.", icon: "01" },
  { id: "uiux", title: "UI / UX Design", description: "Interfaces and product flows built around real behavior.", icon: "02" },
  { id: "ecommerce", title: "E-Commerce", description: "Conversion-led storefronts and retention journeys.", icon: "03" },
  { id: "mobile", title: "Mobile Products", description: "Native-feeling applications ready for launch.", icon: "04" },
  { id: "seo", title: "Search Strategy", description: "Technical visibility and sustainable growth systems.", icon: "05" },
  { id: "crm", title: "CRM Platforms", description: "Operational systems for teams, pipelines, and reports.", icon: "06" },
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

export async function getProjects(locale: Locale): Promise<PublicProject[]> {
  try {
    const records = await prisma.project.findMany({ where: { status: "PUBLISHED" }, orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
    if (records.length) return records.map((record) => ({
      ...record,
      title: localized(locale, record.title, record.titleAr)!,
      description: localized(locale, record.description, record.descriptionAr),
      client: localized(locale, record.client, record.clientAr),
      category: localized(locale, record.category, record.categoryAr),
      tags: locale === "ar" && record.tagsAr.length ? record.tagsAr : record.tags,
    }));
  } catch {}
  return fallbackProjects.map((project, index) => locale === "ar" ? { ...project, ...fallbackProjectsAr[index] } : project);
}

export async function getProject(locale: Locale, slug: string) {
  return (await getProjects(locale)).find((project) => project.slug === slug) ?? null;
}

export async function getServices(locale: Locale): Promise<PublicService[]> {
  try {
    const records = await prisma.service.findMany({ where: { active: true }, orderBy: { order: "asc" } });
    if (records.length) return records.map((record, index) => ({
      id: fallbackServices[index]?.id ?? record.id,
      title: localized(locale, record.title, record.titleAr)!,
      description: localized(locale, record.description, record.descriptionAr),
      icon: record.icon,
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
