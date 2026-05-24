"use client";

import { useState } from "react";
import CreativeNavbar from "@/components/creative/CreativeNavbar";
import CreativePageHero from "@/components/creative/CreativePageHero";
import CreativeFAQ from "@/components/creative/CreativeFAQ";
import CreativeFooter from "@/components/creative/CreativeFooter";

const TOPICS = ["Brand", "Web", "Packaging", "Motion", "Campaign", "Not sure yet"];
const BUDGETS = ["Under $10k", "$10k — $30k", "$30k — $100k", "$100k+", "Tell me first"];
const TIMELINES = ["This month", "Next 1–3 months", "This quarter", "Flexible"];

const LOCATIONS = [
  { city: "Lisbon",   desc: "Studio HQ. Five floors above a bakery, four cats, one resident plant called Geoff.", time: "9:00 — 18:00 WET" },
  { city: "Brooklyn", desc: "Production satellite. Shoots, edits, the occasional 4am render farm session.",       time: "9:00 — 18:00 EST" },
  { city: "Tokyo",    desc: "Type & motion partners. We jump on calls before everyone else's morning coffee.",    time: "9:00 — 18:00 JST" },
];

export default function CreativeContactPage() {
  const [activeTopics, setActiveTopics] = useState<string[]>(["Brand"]);
  const [submitted, setSubmitted] = useState(false);

  const toggleTopic = (t: string) =>
    setActiveTopics((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);

  return (
    <>
      <CreativeNavbar active="contact" />

      <CreativePageHero
        crumb="Home / Contact"
        title={<>Let&rsquo;s<br /><em>talk</em>.</>}
        sub="The form is read by an actual human (Halle), usually within a working day. If you'd rather email or call, scroll down — all of that is below."
      />

      <section className="c-contact-grid">
        {/* Left column */}
        <div className="c-contact-side">
          <h2>Tell us<br /><span className="accent">what</span><br />you&rsquo;re<br />building.</h2>
          <p>The more you tell us, the less small-talk we have to do on the first call. Bonus points for screenshots, links, scribbles on napkins.</p>
          <div className="c-contact-meta">
            <div>
              <div className="c-cmeta__label">New Business</div>
              <div className="c-cmeta__value"><a href="mailto:hello@dontforget.studio">hello@dontforget.studio</a></div>
            </div>
            <div>
              <div className="c-cmeta__label">Careers</div>
              <div className="c-cmeta__value"><a href="mailto:careers@dontforget.studio">careers@dontforget.studio</a></div>
            </div>
            <div>
              <div className="c-cmeta__label">Studio</div>
              <div className="c-cmeta__value">Rua de São Bento 142<br />Lisbon, Portugal</div>
            </div>
            <div>
              <div className="c-cmeta__label">Phone</div>
              <div className="c-cmeta__value">+351 211 234 567</div>
            </div>
          </div>
        </div>

        {/* Form */}
        {submitted ? (
          <div className="c-cform" style={{ justifyContent: "center", alignItems: "center", minHeight: 400 }}>
            <p style={{ fontFamily: "var(--c-f-body)", fontSize: 32, color: "var(--c-ink)", textAlign: "center" }}>
              Sent. Speak soon. ✱
            </p>
          </div>
        ) : (
          <form className="c-cform" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
            <div>
              <label>Your name</label>
              <input type="text" placeholder="Jane Doe" required />
            </div>
            <div>
              <label>Email</label>
              <input type="email" placeholder="jane@company.com" required />
            </div>
            <div>
              <label>Company</label>
              <input type="text" placeholder="Acme Co." />
            </div>
            <div>
              <label>What can we help with?</label>
              <div className="c-chips">
                {TOPICS.map((t) => (
                  <span
                    key={t}
                    className={`c-chip${activeTopics.includes(t) ? " active" : ""}`}
                    onClick={() => toggleTopic(t)}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="c-budget-row">
              <div>
                <label>Budget</label>
                <select>
                  {BUDGETS.map((b) => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label>Timeline</label>
                <select>
                  {TIMELINES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label>The brief</label>
              <textarea placeholder="Tell us what you're building, what's not working, and what success looks like." />
            </div>
            <div className="c-submit-row">
              <span className="c-submit-hint">We reply within one working day.</span>
              <button type="submit" className="c-btn">
                Send brief <span className="c-blink" />
              </button>
            </div>
          </form>
        )}
      </section>

      {/* Map strip */}
      <section className="c-map-strip">
        {LOCATIONS.map(({ city, desc, time }) => (
          <div key={city}>
            <h3>{city}</h3>
            <p>{desc}</p>
            <p className="c-map-time">{time}</p>
          </div>
        ))}
      </section>

      <CreativeFAQ />
      <CreativeFooter />
    </>
  );
}
