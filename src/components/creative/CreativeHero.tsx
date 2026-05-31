import Link from "next/link";
import CreativeNavbar from "./CreativeNavbar";
import BustCard from "./BustCard";
import { prisma } from "@/lib/prisma";

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

const VARIANTS = ["", "c-client--script", "c-client--bold", "c-client--dm"] as const;

const FALLBACK_CLIENTS = [
  { name: "Atelier",  variant: "c-client--script", logo: null },
  { name: "MERIDIAN", variant: "", logo: null },
  { name: "Solaris",  variant: "c-client--dm", logo: null },
  { name: "PARCEL",   variant: "c-client--bold", logo: null },
  { name: "Nexus",    variant: "c-client--script", logo: null },
  { name: "FORMA",    variant: "", logo: null },
  { name: "Tessera",  variant: "c-client--dm", logo: null },
];

export default async function CreativeHero() {
  let dbClients: { name: string; company: string | null; logo: string | null }[] = [];
  try {
    dbClients = await prisma.clientItem.findMany({
      orderBy: [{ order: "asc" }, { name: "asc" }],
      select: { name: true, company: true, logo: true },
    });
  } catch {}

  const strip = dbClients.length >= 1
    ? (() => {
        const base = dbClients.map((c, i) => ({
          name: c.company || c.name,
          logo: c.logo ?? null,
          variant: VARIANTS[i % VARIANTS.length],
        }));
        while (base.length < 7) base.push(...base.slice(0, Math.max(1, 7 - base.length)));
        return base.slice(0, Math.max(7, dbClients.length));
      })()
    : FALLBACK_CLIENTS;

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
          <TypeWord>STUDIO</TypeWord>
          <span className="c-hero__star" aria-hidden="true" />
        </div>
        <BustCard />
        <div className="c-hero__sub">
          <p>We shape websites, brands, and digital systems{"\n"}that people notice, understand, and remember.</p>
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
            <span className="c-stat__d">{"Projects\nShaped"}</span>
          </div>
          <div className="c-stat">
            <span className="c-stat__n">80%</span>
            <span className="c-stat__d">{"Repeat\nClients"}</span>
          </div>
        </div>
        <div className="c-hero__globes">
          <LogoEye clipId="creative-eye-left" />
          <LogoEye clipId="creative-eye-right" />
        </div>
      </div>

      {/* Clients carousel */}
      <div className="c-hero__clients">
        <div className="c-clients__track">
          {[...strip, ...strip].map((c, i) => (
            <span key={i} className="c-client-wrap">
              <span className={`c-client${c.variant ? ` ${c.variant}` : ""}`}>{c.name}</span>
              {c.logo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="c-client__logo" src={c.logo} alt={c.name} draggable={false} />
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
