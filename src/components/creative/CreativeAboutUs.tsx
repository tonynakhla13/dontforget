function EarthSmall() {
  return (
    <svg viewBox="0 0 76 48" fill="none" stroke="currentColor" strokeWidth=".9" width={76} height={48}>
      <ellipse cx="38" cy="24" rx="24" ry="22" />
      <ellipse cx="38" cy="24" rx="10" ry="22" />
      <ellipse cx="38" cy="24" rx="24" ry="8" />
      <path d="M14 24 H62 M38 2 V46" />
    </svg>
  );
}

export default function CreativeAboutUs() {
  return (
    <section id="about" className="c-about">
      <div className="c-about__top">
        <div className="c-about__left">
          <div style={{ color: "var(--c-ink)" }}>
            <EarthSmall />
          </div>
          <h2 className="c-about__title">
            <span className="c-about__title-line">Who</span>
            <span className="c-about__title-line">
              <span>WE</span>
              <span className="c-about__circle" aria-hidden="true" />
              <span>ARE</span>
            </span>
          </h2>
        </div>
        <div className="c-about__right">
          <p className="c-about__body">
            At Don&rsquo;t Forget Agency, we are passionate about bringing your brand&rsquo;s vision to life.<br /><br />
            Our team of talented creatives is dedicated to delivering innovative solutions that resonate with your audience and elevate your brand.
          </p>
          <div className="c-about__tags">
            {["Creativity", "Passionate", "Branding", "Talented", "Visionary", "Dedicated"].map((tag) => (
              <span key={tag} className="c-tag">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="c-about__pills">
        {[
          { n: "50+",   d: "Awards\nWon" },
          { n: "300+",  d: "Happy\nClients" },
          { n: "80%",   d: "Repeat\nBusiness" },
          { n: "500K+", d: "Social Media\nImpressions" },
        ].map(({ n, d }) => (
          <div key={n} className="c-pill">
            <div className="c-pill__n">{n}</div>
            <div className="c-pill__d">{d}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
