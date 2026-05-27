function GlobeNav() {
  return (
    <svg viewBox="0 0 76 48" fill="none" stroke="currentColor" strokeWidth=".9" width={76} height={48} style={{ opacity: .85 }}>
      <ellipse cx="38" cy="24" rx="24" ry="22" />
      <ellipse cx="38" cy="24" rx="10" ry="22" />
      <ellipse cx="38" cy="24" rx="24" ry="8" />
      <path d="M14 24 H62 M38 2 V46" />
    </svg>
  );
}

export default function CreativeTestimonials() {
  return (
    <div style={{ background: "var(--c-white)", overflow: "hidden" }}>
      <div className="c-testi">
        <div className="c-testi__left">
          <h2 className="c-testi__title">
            <span className="c-testi__row">
              <span>Testi</span>
              <button className="c-testi__btn" aria-label="Next testimonial">
                <svg viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg" width={88} height={88}>
                  <circle cx="44" cy="44" r="43.5" fill="#46D12A" stroke="#231F20" />
                  <path d="M58 30C46.1 41.9 26.8 41.9 14.9 30C26.8 41.9 26.8 61.2 14.9 73.1" stroke="#231F20" strokeWidth="5.83" strokeMiterlimit="10" transform="rotate(-90 44 44)" />
                  <path d="M14.9 30L58 73.1" stroke="#231F20" strokeWidth="5.83" strokeMiterlimit="10" transform="rotate(-90 44 44)" />
                </svg>
              </button>
              <span>-</span>
            </span>
            <span className="c-testi__row c-testi__row--solo">monials</span>
          </h2>
          <div className="c-testi__photos">
            <div className="c-testi__photo" />
            <div className="c-testi__photo" />
          </div>
        </div>

        <div className="c-testi__right">
          <div className="c-testi__big-img" />
          <div className="c-testi__content">
            <p className="c-testi__name">{"Jane Doe\nEntrepreneur"}</p>
            <p className="c-testi__quote">&ldquo;Working with Don&rsquo;t Forget Agency was a transformative experience. Their creativity and attention to detail brought our vision to life!&rdquo;</p>
            <div className="c-testi__navs" style={{ color: "var(--c-ink)" }}>
              <GlobeNav />
              <GlobeNav />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
