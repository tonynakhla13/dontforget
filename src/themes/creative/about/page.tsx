import type { Metadata } from "next";
import Link from "next/link";
import CreativeNavbar from "@/components/creative/CreativeNavbar";
import CreativePageHero from "@/components/creative/CreativePageHero";
import CreativeCTA2 from "@/components/creative/CreativeCTA2";
import CreativeFooter from "@/components/creative/CreativeFooter";

export const metadata: Metadata = {
  title: "About — DON'T FORGET",
  description: "A small studio of designers, strategists and makers building brands that punch above their weight.",
};

const VALUES = [
  { n: "01", t: "Craft over volume.", d: "We'd rather ship one beautiful thing than four mediocre ones. Always have. Always will." },
  { n: "02", t: "Story first, then shape.", d: "If the brief doesn't have a story, we'll find one. If it does, we'll fight to keep it intact." },
  { n: "03", t: "Show, don't email.", d: "We move at the speed of conversation. No 14-tab decks. No 47-step approval matrices." },
  { n: "04", t: "Stay weird.", d: "Strange is the most defensible thing in the world. We protect it like it's our last dollar." },
  { n: "05", t: "Work in public.", d: "Our process is visible. Our prices are visible. Our mistakes are visible. It keeps us honest." },
  { n: "06", t: "Make it remembered.", d: "It's in the name. If a person can't recall your brand a week later, we haven't done our job." },
];

const TEAM = [
  { name: "Mara Vella",    role: "Founder / Creative Director" },
  { name: "Idris Okafor",  role: "Design Lead" },
  { name: "Jules Henrick", role: "Brand Strategist" },
  { name: "Sana Reyes",    role: "Motion + 3D" },
  { name: "Theo Park",     role: "Senior Engineer" },
  { name: "Halle Brun",    role: "Producer" },
  { name: "Kit Donovan",   role: "Copy & Voice" },
  { name: "Asha Patel",    role: "Studio Manager" },
];

const MARQUEE_TEXT = ["EST. 2018", "Independent Studio", "Made with Passion", "12 People", "4 Continents"];

export default function CreativeAboutPage() {
  return (
    <>
      <CreativeNavbar active="about" />

      <CreativePageHero
        crumb="Home / About"
        title={<>We are<br /><em>storytellers</em><br />at heart.</>}
        sub="A small studio of designers, strategists and makers building brands that punch above their weight. We exist for the people who refuse to be forgotten."
      >
        <Link href="/creative/work" className="c-btn">See our work <span className="c-blink" /></Link>
        <Link href="/creative/contact" className="c-btn c-btn--ink">Start a project →</Link>
      </CreativePageHero>

      {/* Marquee */}
      <div className="c-marquee" aria-hidden="true">
        <div className="c-marquee__track">
          {[0, 1].map((rep) => (
            <span key={rep}>
              {MARQUEE_TEXT.map((w) => (
                <span key={w}>
                  {w}
                  <span className="c-marquee__aster" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* Story */}
      <section className="c-story">
        <div className="c-story__grid">
          <div>
            <h2 className="c-story__title">Our<br />story.</h2>
            <p>Don&rsquo;t Forget. started in a one-room studio above a bakery. Seven years in, the smell of bread is still the same — and we still make work the same way: hands-on, opinionated and impossibly proud of every single thing that leaves the door.</p>
            <p>We&rsquo;ve helped 300+ founders, challenger brands and Fortune 500 teams say the thing they actually meant to say — with shape, type and rhythm that people remember.</p>
          </div>
          <div className="c-story__img" />
        </div>
      </section>

      {/* Values */}
      <section className="c-values">
        <h2 className="c-values__title">What we<br />believe.</h2>
        <div className="c-values__grid">
          {VALUES.map(({ n, t, d }) => (
            <div key={n} className="c-value">
              <div className="c-value__n">{n}</div>
              <div>
                <div className="c-value__t">{t}</div>
                <p className="c-value__d">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats pills */}
      <section className="c-about" style={{ background: "var(--c-white)" }}>
        <div className="c-about__pills" style={{ maxWidth: 1300, margin: "0 auto", width: "100%" }}>
          {[
            { n: "7yr",  d: "Years\nIn Studio" },
            { n: "300+", d: "Brands\nShipped" },
            { n: "12",   d: "Humans\nOn Staff" },
            { n: "42",   d: "Awards\n& Counting" },
          ].map(({ n, d }) => (
            <div key={n} className="c-pill">
              <div className="c-pill__n">{n}</div>
              <div className="c-pill__d">{d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="c-team">
        <h2 className="c-team__title">The<br />people.</h2>
        <div className="c-team__grid">
          {TEAM.map(({ name, role }) => (
            <div key={name} className="c-member">
              <div className="c-member__img" />
              <div className="c-member__body">
                <div className="c-member__name">{name}</div>
                <div className="c-member__role">{role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <CreativeCTA2 />
      <CreativeFooter />
    </>
  );
}
