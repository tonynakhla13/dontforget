import type { Metadata } from "next";
import Link from "next/link";
import { getClients, type PublicClient } from "@/lib/public-content";
import CreativeNavbar from "@/components/creative/CreativeNavbar";
import CreativePageHero from "@/components/creative/CreativePageHero";
import CreativeCTA2 from "@/components/creative/CreativeCTA2";
import CreativeFooter from "@/components/creative/CreativeFooter";
import CreativeTeamCarousel from "@/components/creative/CreativeTeamCarousel";

export const metadata: Metadata = {
  title: "About Us - NOX Studio",
  description:
    "Meet the team behind NOX Studio - a small, mighty creative agency building fast, memorable digital experiences driven by craft and radical honesty.",
};

export const dynamic = "force-dynamic";

const STATS = [
  { n: "14+", d: "Projects\nShipped" },
  { n: "6", d: "Countries\nServed" },
  { n: "3yr", d: "Since\n'22" },
  { n: "100%", d: "On-time\nDelivery" },
];

const STORY = [
  "2022 / Founded - Born out of frustration with forgettable work. We set out to build a studio with an unreasonably high bar - and actually keep it.",
  "2023 / First wins - First client tripled their conversion rate in month one. First mobile app featured by Apple week one. The bar was set early.",
  "2024 / 10 projects live - Ten live projects across three countries. E-commerce, custom CRMs, full-stack platforms. No templates. No shortcuts. Ever.",
  "2025 / 6 countries - Shipping across six countries, 14+ clients, AI-powered search. Still small on purpose - every project gets the A-team.",
];

const PROCESS = [
  { n: "01", t: "Intake", d: "We understand your goals, audience, timeline, and what success needs to look like." },
  { n: "02", t: "Discovery", d: "We audit your market, competitors, current brand, and digital experience." },
  { n: "03", t: "Strategy", d: "We define the direction, messaging, structure, and creative approach." },
  { n: "04", t: "Build", d: "We design and develop the system with precision, speed, and polish." },
  { n: "05", t: "Launch", d: "We refine, test, ship, and make sure everything is ready to perform." },
];

function ClientsStrip({ clients }: { clients: PublicClient[] }) {
  if (!clients.length) return null;

  return (
    <section className="c-about-clients">
      <div className="c-about-clients__label">Trusted by founders & growing teams</div>
      <div className="c-about-clients__track">
        {[0, 1].map((rep) => (
          <div key={rep} className="c-about-clients__set">
            {clients.map((client) => (
              <span key={`${rep}-${client.id}`} className="c-about-client">
                {client.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={client.logo} alt={client.name} />
                ) : (
                  client.company ?? client.name
                )}
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

export default async function CreativeAboutPage() {
  const clients = await getClients();

  return (
    <>
      <CreativeNavbar active="about" />

      <CreativePageHero
        crumb="Home / About"
        title={<>We build<br />things<br /><em>unforgettable.</em></>}
        sub="Got something worth remembering?"
      >
        <Link href="/creative/work" className="c-btn">See our work <span className="c-blink" /></Link>
        <Link href="/creative/contact" className="c-btn c-btn--ink">Start a project</Link>
      </CreativePageHero>

      <section className="c-about" style={{ background: "var(--c-paper)" }}>
        <div className="c-about__pills" style={{ maxWidth: 1300, margin: "0 auto", width: "100%" }}>
          {STATS.map(({ n, d }) => (
            <div key={n} className="c-pill">
              <div className="c-pill__n">{n}</div>
              <div className="c-pill__d">{d}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="c-story">
        <div className="c-story__grid">
          <div>
            <p className="c-section-kicker">/ our story</p>
            <h2 className="c-story__title"><span>Built</span><br />for brands that refuse to blend in.</h2>
          </div>
          <div>
            {STORY.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <ClientsStrip clients={clients} />

      <section className="c-team">
        <div className="c-team__head">
          <div>
            <p className="c-section-kicker">/ team</p>
            <h2 className="c-team__title">Small team,<br />serious taste.</h2>
          </div>
          <p>A focused studio model built around senior thinking, lean execution, and carefully chosen collaborators.</p>
        </div>
        <CreativeTeamCarousel />
      </section>

      <section className="c-mission">
        <div className="c-mission__panel c-mission__panel--lime">
          <p className="c-section-kicker">/ mission</p>
          <h2>Build things people remember.</h2>
          <p>We exist to create digital experiences that leave a mark - websites, apps, and systems that are fast, beautiful, and built to last. Not just functional. Genuinely unforgettable.</p>
        </div>
        <div className="c-mission__panel">
          <p className="c-section-kicker">/ vision</p>
          <h3>World-class craft for every brand.</h3>
          <p>A world where every business, regardless of size, has access to the kind of digital craftsmanship that used to belong only to the biggest companies in the world.</p>
        </div>
      </section>

      <section className="c-process c-process--about">
        <div className="c-process__head">
          <div>
            <p className="c-section-kicker">/ how we work</p>
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

      <CreativeCTA2 />
      <CreativeFooter />
    </>
  );
}
