"use client";

import { HeaderLocaleControl } from "@/components/site/SiteControls";
import ContactFormPopup, { openContactFormPopup } from "@/components/site/ContactFormPopup";

type CreativeNavbarProps = {
  transparent?: boolean;
  active?: "about" | "services" | "work" | "blog" | "contact";
};

export default function CreativeNavbar({ transparent, active }: CreativeNavbarProps) {
  return (
    <nav className={`c-nav${transparent ? "" : " c-nav--paper"}`}>
      <div className="c-nav__group">
        <a href="/creative/services" className={`c-nav__link${active === "services" ? " active" : ""}`}>Services</a>
        <a href="/creative/work" className={`c-nav__link${active === "work" ? " active" : ""}`}>Portfolio</a>
        <a href="/creative/contact" className={`c-nav__link${active === "contact" ? " active" : ""}`}>Contact</a>
      </div>
      <a href="/creative" className="c-nav__brand" aria-label="NOX Studio home">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="c-nav__logo" src="/creative/nokx-studio-logo.svg" alt="NOX Studio" />
      </a>
      <div className="c-nav__group">
        <a href="/creative/about" className={`c-nav__link${active === "about" ? " active" : ""}`}>About</a>
        <a href="/creative/blog" className={`c-nav__link${active === "blog" ? " active" : ""}`}>Blog</a>
        <button type="button" className="c-nav__talk" onClick={() => openContactFormPopup()}>Let&apos;s talk</button>
        <HeaderLocaleControl theme="creative" className="c-nav__locale" />
      </div>
      <ContactFormPopup theme="creative" />
    </nav>
  );
}
