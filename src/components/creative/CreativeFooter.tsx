const SOCIALS = [
  { label: 'Dribbble',    href: '#' },
  { label: 'Behance',     href: '#' },
  { label: 'LinkedIn',    href: '#' },
  { label: 'X (Twitter)', href: '#' },
  { label: 'Instagram',   href: '#' },
  { label: 'Facebook',    href: '#' },
];

const NAV_PRIMARY  = ['Work', 'Services', 'About', 'Contact'];
const NAV_SECONDARY = ['Careers', 'Blog'];

export default function CreativeFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="c-footer">
      {/* top bar — logo left, socials right */}
      <div className="c-footer__topbar">
        <div className="c-footer__brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="c-footer__logo"
            src="/creative/nokx-studio-logo.svg"
            alt="NOX Studio"
          />
          <a href="/contact" className="c-footer__cta-link">Schedule a call</a>
        </div>
        <nav className="c-footer__socials" aria-label="Social links">
          {SOCIALS.map(({ label, href }) => (
            <a key={label} href={href} className="c-footer__social">{label}</a>
          ))}
        </nav>
      </div>

      {/* giant email link */}
      <div className="c-footer__email-wrap">
        <a href="mailto:hello@noxstudio.dev" className="c-footer__email">
          hello@noxstudio.dev
          <span className="c-footer__email-arrow" aria-hidden="true"> ↗</span>
        </a>
      </div>

      <hr className="c-footer__divider" />

      {/* info grid */}
      <div className="c-footer__info">
        <div className="c-footer__info-col">
          <p>+963 935 154 501</p>
          <address>Yabroud, Damascus Suburbs<br />Syria</address>
        </div>
        <nav className="c-footer__info-col" aria-label="Site navigation">
          {NAV_PRIMARY.map(label => (
            <a key={label} href={`/${label.toLowerCase()}`} className="c-footer__nav-link">{label}</a>
          ))}
        </nav>
        <nav className="c-footer__info-col" aria-label="More">
          {NAV_SECONDARY.map(label => (
            <a key={label} href={`/${label.toLowerCase()}`} className="c-footer__nav-link">{label}</a>
          ))}
        </nav>
      </div>

      {/* copyright */}
      <div className="c-footer__copyright">
        <span>© All rights reserved, NOX Studio {year}</span>
        <span>Let&rsquo;s make it hard to forget ♥</span>
      </div>

      {/* lime wordmark strip */}
      <div className="c-footer__wordmark-strip" aria-hidden="true">
        <span className="c-footer__wordmark">NOX Studio</span>
      </div>
    </footer>
  );
}
