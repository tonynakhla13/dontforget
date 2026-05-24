"use client";

import { useState } from "react";
import Link from "next/link";

export default function CreativeCTA2() {
  const [email, setEmail] = useState("");

  return (
    <section id="contact" className="c-cta2">
      <div className="c-cta2__left">
        <div className="c-cta2__title-row">
          <span className="c-cta2__icon" aria-hidden="true" />
          <span className="c-cta2__title">{"Find out how we can help you achieve\nyour goals within your budget!"}</span>
        </div>
        <div className="c-cta2__btns">
          <Link href="/creative/services" className="c-btn-ui c-btn-ui--lime">Get Started</Link>
          <Link href="/creative/contact" className="c-btn-ui c-btn-ui--ink">Enroll Now →</Link>
        </div>
      </div>
      <div className="c-cta2__right">
        <form className="c-cta2__field" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="c-btn-ui c-btn-ui--ink">Subscribe</button>
        </form>
        <p className="c-cta2__hint">Stay informed about our latest courses, special offers, and AI insights! Enter your email</p>
      </div>
    </section>
  );
}
