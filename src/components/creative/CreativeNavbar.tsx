type CreativeNavbarProps = {
  transparent?: boolean;
  active?: "about" | "services" | "work" | "contact";
};

export default function CreativeNavbar({ transparent, active }: CreativeNavbarProps) {
  return (
    <nav className={`c-nav${transparent ? "" : " c-nav--paper"}`}>
      <div className="c-nav__group">
        <a href="/creative/about" className={`c-nav__link${active === "about" ? " active" : ""}`}>About Us</a>
        <a href="/creative/services" className={`c-nav__link${active === "services" ? " active" : ""}`}>Services</a>
      </div>
      <a href="/creative" className="c-nav__brand">Don&rsquo;t Forget.</a>
      <div className="c-nav__group">
        <a href="/creative/work" className={`c-nav__link${active === "work" ? " active" : ""}`}>Portfolio</a>
        <a href="/creative/contact" className={`c-nav__link${active === "contact" ? " active" : ""}`}>Contact</a>
      </div>
    </nav>
  );
}
