import "server-only";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/i18n/config";
import { PORTFOLIO_PROJECTS, PORTFOLIO_PROJECT_SLUGS, toPortfolioProject } from "@/data/portfolio-projects";

export type PublicProject = {
  id: string; slug: string; title: string; description: string | null; client: string | null;
  category: string | null; tags: string[]; year: string | null; coverImage: string | null; gifUrl?: string | null; liveUrl: string | null;
  featured?: boolean; order?: number;
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

const fallbackProjects: PublicProject[] = PORTFOLIO_PROJECTS.map(toPortfolioProject);
const LEGACY_PLACEHOLDER_PROJECT_SLUGS = new Set(["elia-clinic", "montgab", "180-degrees", "launchpad"]);

function fallbackTechStack(names: string[]) {
  return names.map((name) => ({
    id: `fallback-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    name,
    icon: null,
    iconUrl: null,
  }));
}

const fallbackServices: PublicService[] = [
  {
    id: "web-development",
    title: "Web Development",
    icon: "01",
    tagline: "Websites with actual backbone.",
    shortDescription: "We build custom websites, WordPress solutions, landing pages, portfolios, and web experiences that look sharp and actually work.",
    description: "<p>Your website should explain, impress, guide, and make your business feel more considered from the first visit.</p><p>We combine structure, visual direction, development, and content systems to create <strong>custom websites, landing pages, portfolios, and web platforms</strong> that feel fast, clear, and built for the next stage.</p>",
    benefits: [
      "A website that feels custom, not copied",
      "Clearer pages that explain your business",
      "Better mobile and desktop experience",
      "Easy content control when you need it",
      "Room to grow without rebuilding everything",
    ],
    deliverables: [
      { title: "Custom Websites", tagline: "A digital home shaped around the real business.", description: "<p>We build a complete website around your brand, content, services, and goals. No generic template with your logo taped on top.</p>", icon: "", image: "", highlight: true },
      { title: "Landing Pages", tagline: "One clear message. One useful next step.", description: "<p>Focused pages for campaigns, launches, offers, ads, and lead generation, with every section doing a specific job.</p>", icon: "", image: "", highlight: true },
      { title: "WordPress Solutions", tagline: "Power without the plugin jungle.", description: "<p>Editable pages, services, projects, blogs, forms, and custom content areas your team can manage without calling for every comma.</p>", icon: "", image: "", highlight: false },
      { title: "Web Apps & Portals", tagline: "When the website needs to do real work.", description: "<p>Browser-based dashboards, client portals, and lightweight applications for users who need to log in, submit requests, or manage information.</p>", icon: "", image: "", highlight: false },
      { title: "Website Redesigns", tagline: "Keep what works. Remove what gets in the way.", description: "<p>We improve outdated, confusing, slow, or visually tired websites with clearer structure and a stronger experience.</p>", icon: "", image: "", highlight: false },
    ],
    process: [
      { title: "Decode", description: "We understand the business, audience, content, and the real problem behind the request." },
      { title: "Structure", description: "We plan the pages, hierarchy, user journey, and content flow before the pixels take over." },
      { title: "Design", description: "We create a memorable visual direction that stays useful and easy to navigate." },
      { title: "Build", description: "We develop, connect the content system, test the details, and prepare the launch." },
    ],
    techStack: ["Next.js", "React", "TypeScript", "WordPress", "Node.js", "PostgreSQL"],
    techStackItems: fallbackTechStack(["Next.js", "React", "TypeScript", "WordPress", "Node.js", "PostgreSQL"]),
    faq: [
      { question: "Do you build WordPress websites?", answer: "<p>Yes. We build editable WordPress sites as well as more custom content-managed platforms.</p>" },
      { question: "Do you build custom websites or use templates?", answer: "<p>We focus on custom structure and a custom experience. Helpful tools are fine; a generic result is not.</p>" },
      { question: "Can you redesign our existing website?", answer: "<p>Yes. We can keep what works, improve the structure, and rebuild the experience around clearer goals.</p>" },
    ],
    ctaHeadline: "Need a sharper website?",
    ctaSubtext: "Bring the idea, the rough notes, or the folder named final-final-real. We will turn it into a website that feels built, not assembled.",
    ctaButtonLabel: "Start a project",
  },
  {
    id: "ui-ux-design",
    title: "UI/UX Design",
    icon: "02",
    tagline: "Interfaces people can survive.",
    shortDescription: "We design interfaces that look sharp, feel clear, and help users move without having to decode the screen first.",
    description: "<p>Good UI is not just beautiful screens floating in space. It is structure, rhythm, clarity, behavior, and knowing when to stop adding things.</p><p>We design <strong>websites, apps, dashboards, landing pages, product interfaces, and design systems</strong> that feel polished and usable from the first interaction.</p>",
    benefits: [
      "Clearer user journeys",
      "Sharper visual direction",
      "More polished screens",
      "Less confusion for users",
      "Designs that are easier to build",
    ],
    deliverables: [
      { title: "Website UI Design", tagline: "A visual system with a clear path through it.", description: "<p>Homepages, service pages, portfolios, blogs, contact flows, and landing pages designed around hierarchy and action.</p>", icon: "", image: "", highlight: true },
      { title: "Mobile App UI", tagline: "Small screen. Big responsibility.", description: "<p>Onboarding, navigation, forms, cards, profiles, lists, and empty states that feel natural on a phone.</p>", icon: "", image: "", highlight: true },
      { title: "Wireframes", tagline: "Solve the flow before polishing the surface.", description: "<p>We plan structure and user journeys before color, motion, and drama enter the room.</p>", icon: "", image: "", highlight: false },
      { title: "Clickable Prototypes", tagline: "Feel the product before it is built.", description: "<p>Interactive flows for apps, dashboards, checkout, onboarding, and complex websites, ready for review and testing.</p>", icon: "", image: "", highlight: false },
      { title: "Design Systems", tagline: "Consistency that leaves room for expression.", description: "<p>Reusable components, tokens, typography, spacing, states, and interaction rules for products that need to grow.</p>", icon: "", image: "", highlight: false },
    ],
    process: [
      { title: "Understand", description: "We study the product, audience, goals, current problems, and the work users need to do." },
      { title: "Map", description: "We plan user journeys, screen structure, content hierarchy, and important actions." },
      { title: "Design", description: "We create the interface with type, spacing, color, components, and interaction states." },
      { title: "Handoff", description: "We organize the design so development can move forward without guesswork." },
    ],
    techStack: ["Figma", "FigJam", "Framer", "Maze", "Storybook", "Lottie"],
    techStackItems: fallbackTechStack(["Figma", "FigJam", "Framer", "Maze", "Storybook", "Lottie"]),
    faq: [
      { question: "Do you design only, or also develop?", answer: "<p>We can do either. Design can continue into web, app, e-commerce, or CRM development when the project needs it.</p>" },
      { question: "Can you redesign an existing product?", answer: "<p>Yes. We review what works, find the friction, and redesign the screens with clearer structure and stronger direction.</p>" },
      { question: "Do you create design systems?", answer: "<p>Yes. We create reusable components and visual rules when a website or product needs to stay consistent as it grows.</p>" },
    ],
    ctaHeadline: "Need cleaner screens?",
    ctaSubtext: "Send the current design, sketch, or messy idea. We will make it clearer, sharper, and easier to use.",
    ctaButtonLabel: "Design with us",
  },
  {
    id: "mobile-apps",
    title: "Mobile Apps",
    icon: "03",
    tagline: "Apps that feel intentional.",
    shortDescription: "We design and build mobile app experiences that feel clean, useful, and ready for real users without turning the first version into a feature monster.",
    description: "<p>A mobile app needs more than a stack of screens. It needs a reason to exist, a clear journey, useful features, and enough polish to earn a place on someone's phone.</p><p>We shape <strong>MVPs, service apps, booking apps, customer portals, and internal team apps</strong> from idea to usable product.</p>",
    benefits: [
      "A clearer app idea and feature direction",
      "Better mobile user experience",
      "A focused MVP instead of feature chaos",
      "Clean flows for real users",
      "Room to improve after launch",
    ],
    deliverables: [
      { title: "MVP App Builds", tagline: "Launch the useful first version.", description: "<p>We turn an app idea into a focused first release with the core features users actually need, without setting the budget on fire.</p>", icon: "", image: "", highlight: true },
      { title: "Booking Apps", tagline: "Make the next action easy from a phone.", description: "<p>Service, appointment, and request flows that let users choose, submit, track, and complete the important steps.</p>", icon: "", image: "", highlight: true },
      { title: "Customer Portals", tagline: "Useful account experiences, not account clutter.", description: "<p>Logged-in experiences for profiles, requests, status updates, files, and ongoing customer relationships.</p>", icon: "", image: "", highlight: false },
      { title: "App UI/UX Design", tagline: "Every tap should have a reason.", description: "<p>We design onboarding, navigation, forms, states, and interactions before development turns them into expensive decisions.</p>", icon: "", image: "", highlight: false },
      { title: "Launch Support", tagline: "Ready for the store and the real world.", description: "<p>Testing, analytics basics, notifications, store preparation, and the final checks needed before users arrive.</p>", icon: "", image: "", highlight: false },
    ],
    process: [
      { title: "Focus", description: "We define the real user, the useful outcome, and what the first version should leave out." },
      { title: "Flow", description: "We map the core journey so the app feels obvious from the first tap." },
      { title: "Prototype", description: "We test the important screens and interactions before committing to the build." },
      { title: "Ship", description: "We build, test on real devices, prepare the release, and learn from the first version." },
    ],
    techStack: ["React Native", "Expo", "Swift", "Kotlin", "Firebase", "RevenueCat"],
    techStackItems: fallbackTechStack(["React Native", "Expo", "Swift", "Kotlin", "Firebase", "RevenueCat"]),
    faq: [
      { question: "Can you build an MVP?", answer: "<p>Yes. We help focus the first release around the smallest useful product instead of trying to ship every possible feature at once.</p>" },
      { question: "Do you design the app too?", answer: "<p>Yes. We can handle app UI/UX, prototypes, and the visual direction before or during the build.</p>" },
      { question: "Can the app work on iOS and Android?", answer: "<p>Yes. We can use a shared mobile stack where it makes sense, while keeping the experience natural on both platforms.</p>" },
    ],
    ctaHeadline: "Have an app idea?",
    ctaSubtext: "Bring the big idea. We will find the focused first version that is useful enough to launch and clear enough to improve.",
    ctaButtonLabel: "Plan my app",
  },
  {
    id: "seo-site-health",
    title: "SEO & Site Health",
    icon: "04",
    tagline: "Fix the invisible damage.",
    shortDescription: "We clean the technical, structural, and content problems that quietly weaken your website and its ability to be found.",
    description: "<p>SEO is not only keywords and blog titles. Your site needs clean structure, healthy pages, proper metadata, fast loading, clear content, and fewer hidden problems.</p><p>We improve <strong>technical SEO, site health, page structure, WordPress SEO, speed basics, analytics, and search visibility foundations</strong>.</p>",
    benefits: [
      "Clearer SEO priorities",
      "Healthier technical foundations",
      "Faster, cleaner pages",
      "Stronger content structure",
      "Better visibility into performance",
    ],
    deliverables: [
      { title: "SEO Audits", tagline: "Find the problems before guessing at solutions.", description: "<p>We review structure, metadata, links, performance, content, and search setup, then turn the findings into practical priorities.</p>", icon: "", image: "", highlight: true },
      { title: "Technical SEO", tagline: "Give search engines a cleaner site to understand.", description: "<p>Indexing, sitemaps, schema basics, page health, redirects, metadata, and the technical details that support discoverability.</p>", icon: "", image: "", highlight: true },
      { title: "On-Page SEO", tagline: "Make every page explain itself better.", description: "<p>Titles, headings, internal links, image text, content structure, and clearer page intent for both people and search engines.</p>", icon: "", image: "", highlight: false },
      { title: "Speed Cleanup", tagline: "Less waiting. More confidence.", description: "<p>We review heavy images, scripts, plugins, loading behavior, and common performance issues that make a site feel slower than it should.</p>", icon: "", image: "", highlight: false },
      { title: "Analytics Setup", tagline: "Know what is happening, not just what you hope happened.", description: "<p>Analytics, Search Console, and useful performance signals set up or reviewed so decisions are based on evidence.</p>", icon: "", image: "", highlight: false },
    ],
    process: [
      { title: "Audit", description: "We inspect structure, pages, metadata, speed, links, content, and search setup." },
      { title: "Prioritize", description: "We separate urgent issues from nice-to-have fixes so the work stays useful." },
      { title: "Clean", description: "We fix the important problems and remove avoidable obstacles." },
      { title: "Track", description: "We set up the signals needed to measure improvement over time." },
    ],
    techStack: ["Ahrefs", "Semrush", "Search Console", "Screaming Frog", "PageSpeed", "Clearscope"],
    techStackItems: fallbackTechStack(["Ahrefs", "Semrush", "Search Console", "Screaming Frog", "PageSpeed", "Clearscope"]),
    faq: [
      { question: "Can you guarantee first-page rankings?", answer: "<p>No serious team should promise that casually. We improve the technical and content foundations that support better search performance.</p>" },
      { question: "Do you work on WordPress SEO?", answer: "<p>Yes. We can work with WordPress, Elementor, Rank Math, Yoast, WooCommerce, blogs, and service pages.</p>" },
      { question: "Can you improve website speed?", answer: "<p>Yes. We review images, scripts, plugins, loading behavior, and common performance issues to make the site feel cleaner and faster.</p>" },
    ],
    ctaHeadline: "Is your site healthy?",
    ctaSubtext: "Let us inspect what is hiding behind the pretty homepage. We will tell you what matters, what is broken, and what is just noise.",
    ctaButtonLabel: "Check my site",
  },
  {
    id: "crm-systems",
    title: "CRM Systems",
    icon: "05",
    tagline: "Stop managing chaos manually.",
    shortDescription: "We build CRM systems, dashboards, and workflows that help teams track leads, clients, bookings, tasks, and follow-ups in one clear place.",
    description: "<p>If your process lives across chats, spreadsheets, sticky notes, memory, and one person who knows everything, you do not have a system yet.</p><p>We build <strong>custom CRMs, lead dashboards, booking workflows, client portals, internal tools, and reports</strong> around how your team actually works.</p>",
    benefits: [
      "Better lead tracking",
      "Cleaner customer management",
      "Less manual follow-up chaos",
      "Clearer team workflows",
      "Centralized business information",
    ],
    deliverables: [
      { title: "Custom CRM Systems", tagline: "A system shaped around your actual workflow.", description: "<p>Track leads, clients, requests, statuses, notes, and team actions in one organized place instead of rebuilding the story from scattered messages.</p>", icon: "", image: "", highlight: true },
      { title: "Lead Dashboards", tagline: "Know who needs attention next.", description: "<p>See new leads, sources, owners, statuses, follow-ups, and next actions before good opportunities disappear into chat history.</p>", icon: "", image: "", highlight: true },
      { title: "Booking Workflows", tagline: "From new request to final status.", description: "<p>Manage appointments, consultations, service bookings, and requests through clear stages that match the business.</p>", icon: "", image: "", highlight: false },
      { title: "Client Portals", tagline: "Give customers a cleaner place to go.", description: "<p>Logged-in views for information, requests, files, status updates, and the parts of the relationship clients need to manage.</p>", icon: "", image: "", highlight: false },
      { title: "Automations & Reports", tagline: "Make the useful signal arrive on time.", description: "<p>Notifications, assignments, activity views, and simple reports that help the team act without turning the system into a robot that screams all day.</p>", icon: "", image: "", highlight: false },
    ],
    process: [
      { title: "Map", description: "We study how the team receives, handles, follows up, and closes requests." },
      { title: "Organize", description: "We define fields, statuses, roles, actions, views, and workflow rules." },
      { title: "Design", description: "We shape a dashboard clear enough to use daily without emotional preparation." },
      { title: "Build", description: "We build, test, and improve the system around the real workflow." },
    ],
    techStack: ["HubSpot", "Airtable", "Notion", "Zapier", "Make", "Supabase"],
    techStackItems: fallbackTechStack(["HubSpot", "Airtable", "Notion", "Zapier", "Make", "Supabase"]),
    faq: [
      { question: "Do we need a custom CRM?", answer: "<p>If the process is simple, an existing CRM may be enough. If the workflow is specific, messy, or tied to the website, custom can make more sense.</p>" },
      { question: "Can it connect to our website forms?", answer: "<p>Yes. Leads, bookings, applications, and requests can flow into the CRM with statuses and notifications.</p>" },
      { question: "Can different team members have different access?", answer: "<p>Yes. Role-based access can keep each team member focused on the parts they need.</p>" },
    ],
    ctaHeadline: "Need a real system?",
    ctaSubtext: "Show us the current workflow, even if it is ugly. That is where useful systems usually begin.",
    ctaButtonLabel: "Build my CRM",
  },
  {
    id: "ecommerce",
    title: "E-commerce",
    icon: "06",
    tagline: "Stores that sell without begging.",
    shortDescription: "We build e-commerce websites that make products easier to browse, trust, and buy, with fewer checkout moments that feel like paperwork.",
    description: "<p>An online store is product discovery, trust, browsing, cart behavior, checkout flow, mobile experience, and the delicate art of asking for money without annoying everyone.</p><p>We build <strong>online stores, product catalogs, product pages, cart experiences, checkout flows, and store redesigns</strong> that feel clear and intentional.</p>",
    benefits: [
      "Cleaner product browsing",
      "Better product presentation",
      "Smoother cart and checkout flow",
      "Mobile-friendly shopping experience",
      "Easier store management",
    ],
    deliverables: [
      { title: "Custom Online Stores", tagline: "A storefront with a point of view.", description: "<p>We build shopping experiences that match the brand, products, and customer journey instead of feeling like a default theme.</p>", icon: "", image: "", highlight: true },
      { title: "Product Pages", tagline: "Help people decide with confidence.", description: "<p>Clear images, descriptions, pricing, options, trust details, and calls-to-action that answer questions before the customer leaves.</p>", icon: "", image: "", highlight: true },
      { title: "Catalog & Collections", tagline: "Make the right product easier to find.", description: "<p>Categories, collections, filters, sorting, and browsing structure for stores that need to showcase or sell a growing catalog.</p>", icon: "", image: "", highlight: false },
      { title: "Cart & Checkout", tagline: "Less friction at the important moment.", description: "<p>We improve cart updates, checkout layout, payment clarity, order summaries, coupons, and mobile usability.</p>", icon: "", image: "", highlight: false },
      { title: "Store Management", tagline: "The backend should not feel like a submarine.", description: "<p>Products, orders, categories, images, stock, coupons, and basic store content organized for the people running the business.</p>", icon: "", image: "", highlight: false },
    ],
    process: [
      { title: "Study", description: "We understand the products, customers, buying behavior, and moments where people hesitate." },
      { title: "Structure", description: "We plan categories, product pages, browsing flow, cart behavior, and checkout needs." },
      { title: "Design", description: "We create a store experience that feels clear, trustworthy, and easy to explore." },
      { title: "Launch", description: "We build, test the shopping journey, and check the first real purchase experience." },
    ],
    techStack: ["WooCommerce", "Shopify", "Stripe", "Salla", "Klaviyo", "Recharge"],
    techStackItems: fallbackTechStack(["WooCommerce", "Shopify", "Stripe", "Salla", "Klaviyo", "Recharge"]),
    faq: [
      { question: "Do you build WooCommerce stores?", answer: "<p>Yes. We build WooCommerce stores with products, categories, variations, cart, checkout, payments, shipping, and custom layouts.</p>" },
      { question: "Can you redesign an existing store?", answer: "<p>Yes. We can improve the look, product pages, browsing flow, cart, checkout, and mobile shopping experience.</p>" },
      { question: "Can you set up payments?", answer: "<p>Yes, depending on the provider and region. We can connect the gateway and test the checkout process.</p>" },
    ],
    ctaHeadline: "Ready to sell better?",
    ctaSubtext: "Let us build a store that makes products easier to trust and buy. No sad carts. No confusing checkout caves.",
    ctaButtonLabel: "Build my store",
  },
];
const fallbackServicesAr = ["تطوير الويب", "تصميم الواجهات وتجربة المستخدم", "تطبيقات الجوال", "تحسين الظهور وصحة الموقع", "أنظمة إدارة علاقات العملاء", "التجارة الإلكترونية"];
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
    const normalizedRecords: PublicProject[] = records.map((record) => ({
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
    if (normalizedRecords.length) {
      const portfolioRecords = fallbackProjects.map((fallback) =>
        normalizedRecords.find((record) => record.slug === fallback.slug) ?? fallback
      );
      const additionalRecords = normalizedRecords.filter((record) =>
        !PORTFOLIO_PROJECT_SLUGS.has(record.slug) && !LEGACY_PLACEHOLDER_PROJECT_SLUGS.has(record.slug)
      );
      return [...portfolioRecords, ...additionalRecords];
    }
  } catch {}
  return fallbackProjects;
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
