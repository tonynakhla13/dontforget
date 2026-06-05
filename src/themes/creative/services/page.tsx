import Link from "next/link";
import type { Locale } from "@/i18n/config";
import CreativeNavbar from "@/components/creative/CreativeNavbar";
import CreativePageHero from "@/components/creative/CreativePageHero";
import CreativeFAQ from "@/components/creative/CreativeFAQ";
import CreativeFooter from "@/components/creative/CreativeFooter";

const SERVICES = [
  {
    n: "01",
    slug: "web-development",
    title: "Web Development",
    body: "We build fast, scalable digital products that perform under pressure and look impossible to ignore. From marketing sites to full-stack web applications - everything is engineered to convert, load in milliseconds, and hold up at scale.",
  },
  {
    n: "02",
    slug: "ui-ux-design",
    title: "UI / UX Design",
    body: "We start with behavior before aesthetics. Every interface is grounded in how real users think - not how designers imagine they think. The result is work that feels obvious, reduces friction, and converts better than it looks.",
  },
  {
    n: "03",
    slug: "ecommerce",
    title: "E-Commerce",
    body: "Stores engineered around one goal - selling more. We handle everything from storefront design to checkout flow, payment integration, and post-purchase experience. Every decision is made with conversion rate in mind.",
  },
  {
    n: "04",
    slug: "mobile-apps",
    title: "Mobile Apps",
    body: "Native-feeling apps built for real users. Tight onboarding, frictionless flows, and retention mechanics baked in from day one - not bolted on after launch. We ship on both platforms without doubling the timeline.",
  },
  {
    n: "05",
    slug: "seo-site-health",
    title: "SEO & Site Health",
    body: "SEO that compounds. We combine technical audits, content architecture, and Core Web Vitals optimisation with AI search visibility strategies - the kind of work that keeps paying back long after the engagement ends.",
  },
  {
    n: "06",
    slug: "crm-systems",
    title: "CRM Platforms",
    body: "Custom operational systems built around how your team actually works. Booking engines, sales pipelines, client dashboards, and internal tools - designed to reduce manual work and give leadership real-time visibility.",
  },
];

const PROCESS = [
  { n: "01", t: "Intake", d: "We understand your goals, audience, timeline, and what success needs to look like." },
  { n: "02", t: "Discovery", d: "We audit your market, competitors, current brand, and digital experience." },
  { n: "03", t: "Strategy", d: "We define the direction, messaging, structure, and creative approach." },
  { n: "04", t: "Build", d: "We design and develop the system with precision, speed, and polish." },
  { n: "05", t: "Launch", d: "We refine, test, ship, and make sure everything is ready to perform." },
];

const HOW_WE_WORK = [
  { label: "No retainers, no billable hours", detail: "You pay for outcomes, not time." },
  { label: "Direct access to the makers", detail: "You talk to the people doing the work." },
  { label: "Ship in 4-8 weeks", detail: "Most projects don't need to take longer." },
  { label: "Radical honesty always", detail: "If something won't work, we say so first." },
];

function ArrowSvg() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" width={18} height={18}>
      <path d="M28 4 L4 28 M28 20 L28 4 L12 4" />
    </svg>
  );
}

export default function CreativeServicesPage({ locale }: { locale: Locale }) {
  return (
    <>
      <CreativeNavbar active="services" />

      <CreativePageHero
        crumb="Home / Services"
        title={<>Strategy to<br /><em>launch</em>.</>}
        sub="Six disciplines. One integrated team. We move from brand strategy and design to code, commerce, and growth under one roof, no handoffs, no gaps."
      />

      <section className="c-svc-list">
        <div className="c-svc-list__head">
          <span>/ what we do</span>
          <span>{SERVICES.length} services</span>
        </div>
        {SERVICES.map((service) => (
          <div key={service.slug} className="c-svc-row">
            <div className="c-svc-row__n">{service.n}</div>
            <div className="c-svc-row__t">{service.title}</div>
            <p className="c-svc-row__d">{service.body}</p>
            <Link
              href={`/${locale}/creative/services/${service.slug}`}
              className="c-iconbtn c-svc-row__arr"
              aria-label={`More about ${service.title}`}
            >
              <ArrowSvg />
            </Link>
          </div>
        ))}
      </section>

      <section className="c-service-principles">
        <div>
          <p className="c-section-kicker">/ how we work</p>
          <h2>Every project starts with the right question.</h2>
        </div>
        <div className="c-service-principles__list">
          {HOW_WE_WORK.map((item) => (
            <div key={item.label} className="c-service-principle">
              <span />
              <div>
                <h3>{item.label}</h3>
                <p>{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="c-process c-process--services">
        <div className="c-process__head">
          <div>
            <p className="c-section-kicker">/ process</p>
            <h2 className="c-process__title">Simple process,<br />sharp output.</h2>
          </div>
          <p>No bloated workshops. No endless revision loops. Just a clear path from idea to launch.</p>
        </div>
        <div className="c-process__grid c-process__grid--five">
          {PROCESS.map(({ n, t, d }) => (
            <div key={n} className="c-step">
              <div className="c-step__n">{n}</div>
              <div className="c-step__t">{t}</div>
              <p className="c-step__d">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <CreativeFAQ />
      <CreativeFooter />
    </>
  );
}
