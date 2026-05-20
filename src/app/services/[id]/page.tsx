import { notFound } from "next/navigation";
import type { Metadata } from "next";
import dynamic from "next/dynamic";

import Loader         from "@/components/Loader";
import SmoothScroll   from "@/components/SmoothScroll";
import AltParticleLayer from "@/components/AltParticleLayer";
import Navbar         from "@/components/Navbar";
import AmbientGlow    from "@/components/AmbientGlow";
import ServiceContent from "./ServiceContent";

// ─────────────────────────────────────────────────────────────────────
// Static service data (matches Services.tsx ids)
// ─────────────────────────────────────────────────────────────────────
export const SERVICES_DETAIL = {
  webdev: {
    id: "webdev",
    num: "01",
    title: "Web Dev",
    tagline: "Fast. Scalable. Precise.",
    body: "From high-converting landing pages to complex web applications, we build fast, scalable, and interactive digital experiences. Every decision is made with performance, clarity, and real results in mind.",
    features: [
      "Performance-first architecture",
      "SEO-ready from day one",
      "Custom CMS integration",
      "Conversion-optimised flows",
      "Cross-browser compatibility",
      "Accessibility (WCAG 2.1)",
    ],
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "GSAP"],
  },
  uiux: {
    id: "uiux",
    num: "02",
    title: "UI / UX",
    tagline: "Research. Refine. Delight.",
    body: "We start with research, not assumptions. Through competitive analysis, user testing, and relentless iteration, we shape interfaces that feel effortless — and perform even better than they look.",
    features: [
      "User research & testing",
      "Competitive analysis",
      "Wireframes & prototypes",
      "Design system creation",
      "Interaction design",
      "Usability audits",
    ],
    tech: ["Figma", "FigJam", "Maze", "Hotjar", "Principle"],
  },
  ecomm: {
    id: "ecomm",
    num: "03",
    title: "E-Commerce",
    tagline: "Built to sell. Built to scale.",
    body: "Shopify, WooCommerce, Salla, or fully custom-built — we design and develop stores that actually sell. SEO and organic growth strategy are engineered in from day one, not added as an afterthought.",
    features: [
      "Custom storefront design",
      "Payment gateway integration",
      "Inventory management",
      "SEO-optimised structure",
      "Email & retention flows",
      "Analytics & reporting",
    ],
    tech: ["Shopify", "WooCommerce", "Salla", "Stripe", "Klaviyo"],
  },
  mobile: {
    id: "mobile",
    num: "04",
    title: "Mobile",
    tagline: "Native feel. Cross-platform speed.",
    body: "iOS and Android. React Native or fully native — whichever fits your product best. We don't just ship apps; we define the feel, the flow, and the personality that keeps users coming back every day.",
    features: [
      "iOS & Android support",
      "Push notifications",
      "Offline-first capability",
      "App Store submission",
      "Deep linking",
      "Analytics integration",
    ],
    tech: ["React Native", "Swift", "Kotlin", "Expo", "Firebase"],
  },
  seo: {
    id: "seo",
    num: "05",
    title: "SEO",
    tagline: "Rank. Retain. Revenue.",
    body: "From technical on-page SEO to fully integrated AI-powered search strategies, we move the needle in ways most agencies simply can't. We also handle full marketing — plans, visual design, branding, and everything in between.",
    features: [
      "Technical SEO audit",
      "Keyword strategy",
      "Content planning",
      "Link building",
      "Core Web Vitals",
      "AI-powered search",
    ],
    tech: ["Ahrefs", "Screaming Frog", "GSC", "Semrush", "Perplexity"],
  },
  crm: {
    id: "crm",
    num: "06",
    title: "CRM",
    tagline: "Your workflow. Engineered.",
    body: "We build custom CRMs for booking systems, travel platforms, medical practices, and complex business workflows. Engineer-minded and precision-built — systems that understand exactly how your operations work.",
    features: [
      "Custom workflow design",
      "Role-based access control",
      "Reporting & dashboards",
      "Third-party integrations",
      "Automated pipelines",
      "Data migration",
    ],
    tech: ["Next.js", "PostgreSQL", "Prisma", "Redis", "Zapier"],
  },
} as const;

export type ServiceData = (typeof SERVICES_DETAIL)[keyof typeof SERVICES_DETAIL];

// ─────────────────────────────────────────────────────────────────────
// Static params
// ─────────────────────────────────────────────────────────────────────
export function generateStaticParams() {
  return Object.keys(SERVICES_DETAIL).map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const svc = SERVICES_DETAIL[id as keyof typeof SERVICES_DETAIL];
  if (!svc) return { title: "Service — DON'T FORGET" };
  return {
    title: `${svc.title} — DON'T FORGET`,
    description: svc.body,
  };
}

// ─────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────
export default async function ServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const svc = SERVICES_DETAIL[id as keyof typeof SERVICES_DETAIL];
  if (!svc) notFound();

  return (
    <>
      <Loader />
      <SmoothScroll />
      <AltParticleLayer mode="helix" />
      <main className="relative z-[1] overflow-x-clip">
        <div className="noise" />
        <AmbientGlow />
        <Navbar inner />
        <ServiceContent svc={svc} />
      </main>
    </>
  );
}
