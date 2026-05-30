import Link from "next/link";
import { getServices } from "@/lib/public-content";
import type { Locale } from "@/i18n/config";
import CreativeNavbar from "@/components/creative/CreativeNavbar";
import CreativePageHero from "@/components/creative/CreativePageHero";
import CreativeFAQ from "@/components/creative/CreativeFAQ";
import CreativeFooter from "@/components/creative/CreativeFooter";

const PROCESS = [
  { n: "01", t: "Listen.", d: "A 60-minute call. You talk, we take a lot of notes and ask the questions you weren't expecting." },
  { n: "02", t: "Shape.", d: "A written direction — territory, tone, references and what we'd cut. No mood boards from Pinterest. Promise." },
  { n: "03", t: "Make.", d: "We design in public — Figma open, shared link, working sessions on Wednesdays. You see it as it happens." },
  { n: "04", t: "Ship.", d: "A delivery week. Files, guidelines, walk-throughs and a half-day with whoever inherits the work." },
];

const PRICING = [
  { label: "Sprint", price: "$8k", period: "two-week burst", desc: "For when you need shape — a wordmark, a one-pager, a campaign concept. Fast, focused, finished.", cta: "Book a sprint →", highlight: false },
  { label: "Project", price: "$24k+", period: "six to ten weeks", desc: "A full identity system, a marketing site or a campaign with deliverables across surfaces. Most clients land here.", cta: "Scope a project →", highlight: true },
  { label: "Retainer", price: "$12k/mo", period: "ongoing partner", desc: "An embedded design team for in-house brands and product orgs. Monthly cadence, shared boards, slack channel.", cta: "Talk retainer →", highlight: false },
];

function ArrowSvg() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" width={18} height={18}>
      <path d="M28 4 L4 28 M28 20 L28 4 L12 4" />
    </svg>
  );
}

export default async function CreativeServicesPage({ locale }: { locale: Locale }) {
  const services = await getServices(locale);

  return (
    <>
      <CreativeNavbar active="services" />

      <CreativePageHero
        crumb="Home / Services"
        title={<>Six things<br />we do<br /><em>obsessively</em>.</>}
        sub="No fifty-line capabilities deck. We do six things, and we do them properly. Pick one, or chain them together as a full system."
      />

      {/* Service list rows */}
      <section className="c-svc-list">
        {services.map((service, i) => (
          <div key={service.id} className="c-svc-row">
            <div className="c-svc-row__n">{String(i + 1).padStart(2, "0")}</div>
            <div className="c-svc-row__t">{service.title}</div>
            <p className="c-svc-row__d" style={{
              display: "-webkit-box",
              WebkitLineClamp: 4,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}>{(service.shortDescription ?? service.description ?? "").replace(/<[^>]*>/g, " ").replace(/\s{2,}/g, " ").trim()}</p>
            <Link
              href={`/${locale}/creative/services/${service.slug ?? service.id}`}
              className="c-iconbtn c-svc-row__arr"
              aria-label={`More about ${service.title}`}
            >
              <ArrowSvg />
            </Link>
          </div>
        ))}
      </section>

      {/* Pricing panel */}
      <section className="c-pricing-panel">
        <div className="c-pricing-card">
          <h2 className="c-pricing-title">How we<br />work together.</h2>
          <div className="c-pricing-grid">
            {PRICING.map(({ label, price, period, desc, cta, highlight }) => (
              <div key={label} className={`c-pricing-tier${highlight ? " c-pricing-tier--highlight" : ""}`}>
                <div>
                  <div className="c-tier__label">{label}</div>
                  <div className="c-tier__price">{price}</div>
                  <p className="c-tier__period">{period}</p>
                </div>
                <p className="c-tier__desc">{desc}</p>
                <Link href={`/${locale}/creative/contact`} className="c-btn" style={{ marginTop: 20 }}>{cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="c-process">
        <h2 className="c-process__title">The<br />process.</h2>
        <div className="c-process__grid">
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
