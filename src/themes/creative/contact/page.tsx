"use client";

import CreativeNavbar from "@/components/creative/CreativeNavbar";
import CreativePageHero from "@/components/creative/CreativePageHero";
import CreativeFAQ from "@/components/creative/CreativeFAQ";
import CreativeFooter from "@/components/creative/CreativeFooter";
import CreativeContactHome from "@/components/creative/CreativeContactHome";

const CONTACT_META = [
  { label: "Project desk", value: "HELLO@NOXDEVS.COM", href: "mailto:HELLO@NOXDEVS.COM" },
  { label: "Studio base", value: "Yabroud, Syria / working worldwide" },
  { label: "Response window", value: "Within one business day" },
  { label: "Best fit", value: "Websites, apps, commerce, SEO, CRM, and brand systems" },
];

const SYNTHESIS = [
  {
    step: "01",
    title: "Synthesis",
    body: "We reduce the messy brief into goals, audience, constraints, and the shape of the build.",
  },
  {
    step: "02",
    title: "Content is created",
    body: "We map pages, assets, references, deliverables, and what needs to be written, designed, or produced.",
  },
  {
    step: "03",
    title: "Start the project",
    body: "You get the next move: scope, timeline, budget path, and the team rhythm needed to begin.",
  },
];

export default function CreativeContactPage() {
  return (
    <>
      <CreativeNavbar active="contact" />
      <CreativePageHero
        crumb="Home / Contact"
        title={
          <>
            Start the
            <br />
            <em>right</em>
            <br />
            project.
          </>
        }
        sub="NOX Studio turns scattered ideas into clear web, product, SEO, commerce, CRM, and brand work. Send the shape of the project and we will return with the synthesis, content plan, and next move."
      />

      <section className="c-contact-grid c-contact-grid--identity" aria-label="NOX Studio identity">
        <div className="c-contact-copy">
          <p className="c-contact-kicker">/ contact us</p>
          <h2>
            We are here
            <br />
            always.
          </h2>
          <p>
            Same Don&apos;t Forget team, sharper operating model. NOX Studio is built for clear decisions,
            exact deliverables, and project communication that keeps momentum visible.
          </p>
        </div>
        <div className="c-contact-proof">
          {CONTACT_META.map((item) => (
            <div className="c-contact-proof__item" key={item.label}>
              <span>{item.label}</span>
              {item.href ? <a href={item.href}>{item.value}</a> : <strong>{item.value}</strong>}
            </div>
          ))}
        </div>
      </section>

      <section className="c-contact-synthesis" aria-label="Project start process">
        <div className="c-contact-synthesis__head">
          <p className="c-contact-kicker">/ start the project</p>
          <h2>
            Synthesis,
            <br />
            content,
            <br />
            kickoff.
          </h2>
        </div>
        <div className="c-contact-synthesis__steps">
          {SYNTHESIS.map((item) => (
            <article className="c-contact-synth-card" key={item.step}>
              <span>{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <CreativeContactHome />
      <CreativeFAQ />
      <CreativeFooter />
    </>
  );
}
