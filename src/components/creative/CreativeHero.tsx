import Link from "next/link";
import CreativeNavbar from "./CreativeNavbar";
import BustCard from "./BustCard";

function LogoEye({ clipId }: { clipId: string }) {
  return (
    <svg className="c-logo-eye" viewBox="430 0 370 362" fill="none" aria-hidden="true">
      <defs>
        <clipPath id={clipId}>
          <path d="M610.48,1.55c148.49-12.15,244.49,141.46,171.28,270.23-79.21,139.33-286.71,111.03-325.72-43.43C429.83,124.54,501.53,10.47,610.48,1.55Z" />
        </clipPath>
      </defs>
      <path fill="#231F20" d="M610.48,1.55c148.49-12.15,244.49,141.46,171.28,270.23-79.21,139.33-286.71,111.03-325.72-43.43C429.83,124.54,501.53,10.47,610.48,1.55Z" />
      <g className="c-logo-eye__x" clipPath={`url(#${clipId})`}>
        <g className="c-logo-eye__y">
          <path fill="#E9E9E9" d="M746.24,265.73c77.26-70.56,54.62-197.48-39.64-239.96-118.98-53.62-229.75,70.86-181.05,186.05,36.05,85.28,149.89,118.57,220.69,53.91Z" />
        </g>
      </g>
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
          <LogoEye clipId="creative-eye-left" />
          <LogoEye clipId="creative-eye-right" />
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
