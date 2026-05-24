import Link from "next/link";
import CreativeNavbar from "./CreativeNavbar";
import BustCard from "./BustCard";

function GlobeIcon() {
  return (
    <svg viewBox="0 0 64 41" fill="none" stroke="currentColor" strokeWidth=".9">
      <ellipse cx="32" cy="20.5" rx="20" ry="19" />
      <ellipse cx="32" cy="20.5" rx="9" ry="19" />
      <ellipse cx="32" cy="20.5" rx="20" ry="7" />
      <path d="M12 20.5 H52 M32 1.5 V39.5" />
    </svg>
  );
}

function TypeWord({ children }: { children: string }) {
  return (
    <span className="c-hero__word" aria-label={children}>
      {children.split("").map((char, index) => (
        <span key={`${char}-${index}`} className="c-hero__char" aria-hidden="true">
          {char}
        </span>
      ))}
    </span>
  );
}

export default function CreativeHero() {
  return (
    <section className="c-hero">
      <div className="c-hero__brush" aria-hidden="true" />
      <div className="c-hero__earth" aria-hidden="true" />

      {/* Navbar sits on top, absolute */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10 }}>
        <CreativeNavbar transparent />
      </div>

      {/* Headline */}
      <div className="c-hero__head">
        <div className="c-hero__row">
          <TypeWord>CREA</TypeWord>
          <button className="c-hero__arrow-btn" aria-label="Explore">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/creative/arrow.svg" alt="" width={128} height={128} />
          </button>
          <TypeWord>TIVE</TypeWord>
        </div>
        <div className="c-hero__row">
          <TypeWord>AGENCY</TypeWord>
          <span className="c-hero__star" aria-hidden="true" />
        </div>
        <BustCard />
        <div className="c-hero__sub">
          <p>Crafting unique and compelling{"\n"}creative solutions that captivate and inspire.</p>
          <Link href="/creative/work" className="c-btn">
            Explore Our Work
            <span className="c-blink" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Scroll-down button */}
      <button className="c-hero__down" aria-label="Scroll down">
        <span className="c-hero__down-inner">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width={22} height={22}>
            <path d="M12 4 L12 20 M5 13 L12 20 L19 13" />
          </svg>
        </span>
      </button>

      {/* Stats strip */}
      <div className="c-hero__stats">
        <div className="c-hero__stats-left">
          <div className="c-stat">
            <span className="c-stat__n">200+</span>
            <span className="c-stat__d">{"Project\nCompleted"}</span>
          </div>
          <div className="c-stat">
            <span className="c-stat__n">80%</span>
            <span className="c-stat__d">{"Repeat\nBusiness"}</span>
          </div>
        </div>
        <div className="c-hero__globes">
          <GlobeIcon />
          <GlobeIcon />
        </div>
      </div>

      {/* Clients strip */}
      <div className="c-hero__clients">
        <span className="c-client c-client--script">Gamma</span>
        <span className="c-client">DELTA</span>
        <span className="c-client c-client--bold">Omega</span>
        <span className="c-client c-client--dm">Alpha</span>
        <span className="c-client c-client--bold">BETA</span>
        <span className="c-client c-client--script">Gamma</span>
        <span className="c-client">DELTA</span>
      </div>
    </section>
  );
}
