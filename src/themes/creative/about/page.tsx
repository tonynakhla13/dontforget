import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getClients, type PublicClient } from "@/lib/public-content";
import CreativeNavbar from "@/components/creative/CreativeNavbar";
import CreativePageHero from "@/components/creative/CreativePageHero";
import CreativeCTA2 from "@/components/creative/CreativeCTA2";
import CreativeFooter from "@/components/creative/CreativeFooter";

export const metadata: Metadata = {
  title: "About Us - NOX Studio",
  description:
    "Meet the team behind NOX Studio - a small, mighty creative agency building fast, memorable digital experiences driven by craft and radical honesty.",
};

export const dynamic = "force-dynamic";

type CreativeTeamMember = {
  name: string;
  role: string;
  photo?: string | null;
  linkedinUrl?: string | null;
  twitterUrl?: string | null;
};

const TEAM_FALLBACK: CreativeTeamMember[] = [
  { name: "Tony Nakhla", role: "Founder & Lead Developer" },
  { name: "Sarah Chen", role: "Creative Director" },
  { name: "Marcus Webb", role: "UI/UX Designer" },
  { name: "Leila Hassan", role: "Brand Strategist" },
];

const STATS = [
  { n: "14+", d: "Projects\nShipped" },
  { n: "6", d: "Countries\nReached" },
  { n: "24h", d: "Avg Response\nTime" },
  { n: "0", d: "Boring Websites\nMade" },
];

const STORY = [
  "We started Nox with a simple belief: good design should not disappear into the background. It should clarify, sharpen, and move people to act.",
  "Our work sits between strategy and execution. We help brands find their voice, shape their digital presence, and launch websites that feel as considered as the businesses behind them.",
];

const PROCESS = [
  { n: "01", t: "Intake", d: "We understand your goals, audience, timeline, and what success needs to look like." },
  { n: "02", t: "Discovery", d: "We audit your market, competitors, current brand, and digital experience." },
  { n: "03", t: "Strategy", d: "We define the direction, messaging, structure, and creative approach." },
  { n: "04", t: "Build", d: "We design and develop the system with precision, speed, and polish." },
  { n: "05", t: "Launch", d: "We refine, test, ship, and make sure everything is ready to perform." },
];

async function getTeam(): Promise<CreativeTeamMember[]> {
  try {
    const members = await prisma.teamMember.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
      select: {
        name: true,
        role: true,
        photo: true,
        linkedinUrl: true,
        twitterUrl: true,
      },
    });
    return members.length ? members : TEAM_FALLBACK;
  } catch {
    return TEAM_FALLBACK;
  }
}

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
  const [team, clients] = await Promise.all([getTeam(), getClients()]);

  return (
    <>
      <CreativeNavbar active="about" />

      <CreativePageHero
        crumb="Home / About"
        title={<>We build<br />brands that get<br /><em>remembered</em>.</>}
        sub="Nox is a digital studio crafting bold websites, sharp identities, and conversion-focused experiences for brands that want to move differently."
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
        <div className="c-team__grid">
          {team.map(({ name, role, photo }) => (
            <div key={name} className="c-member">
              <div className="c-member__img">
                {photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photo} alt={name} />
                ) : null}
              </div>
              <div className="c-member__body">
                <div className="c-member__name">{name}</div>
                <div className="c-member__role">{role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="c-mission">
        <div className="c-mission__panel c-mission__panel--lime">
          <p className="c-section-kicker">/ mission</p>
          <h2>Make every digital touchpoint feel intentional.</h2>
          <p>We help ambitious brands turn ideas into clear identities, sharp websites, and memorable experiences that people understand instantly.</p>
        </div>
        <div className="c-mission__panel">
          <p className="c-section-kicker">/ vision</p>
          <h3>Digital work should feel less disposable.</h3>
          <p>We want to build a studio known for work that lasts - visually, strategically, and commercially.</p>
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
