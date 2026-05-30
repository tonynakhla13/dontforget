"use client";

import Link from "next/link";

export type CreativeHomeService = {
  id?: string;
  title: string;
  description: string;
  image?: string;
  hoverImage?: string;
};

const SERVICES = [
  { id: "webdev", title: "Web Dev", desc: "Fast, scalable, interactive websites and applications built around performance, clarity, and measurable results.", image: "/creative/web-dev-service.png", hoverImage: "/creative/web-dev-service-hover.png", imgFlex: 356, bodyFlex: 275, flip: false, noborder: true },
  { id: "uiux", title: "UI / UX", desc: "Research-led interfaces, product flows, prototypes, and design systems shaped around how people actually use them.", image: "/creative/ui-ux-service.png", hoverImage: "/creative/ui-ux-service-hover.png", imgFlex: 356, bodyFlex: 275, flip: true, noborder: false },
  { id: "ecomm", title: "E-Commerce", desc: "Conversion-focused stores with storefront design, payments, retention flows, analytics, and growth foundations.", image: "/creative/ecommerce-service.png", hoverImage: "/creative/ecommerce-service-hover.png", imgFlex: 356, bodyFlex: 275, flip: false, noborder: false },
  { id: "mobile", title: "Mobile", desc: "iOS and Android experiences with native-feeling flows, app release support, notifications, and analytics.", image: "/creative/app-service.png", hoverImage: "/creative/app-service-hover.png", imgFlex: 356, bodyFlex: 275, flip: true, noborder: false },
  { id: "seo", title: "SEO", desc: "Technical audits, search architecture, content planning, Core Web Vitals, and AI-search visibility strategy.", image: "/creative/seo-service.png", hoverImage: "/creative/seo-service-hover.png", imgFlex: 356, bodyFlex: 275, flip: false, noborder: false },
  { id: "crm", title: "CRM", desc: "Custom operational platforms for bookings, teams, pipelines, reports, integrations, and business workflows.", image: "/creative/crm-service.png", hoverImage: "/creative/crm-service-hover.png", imgFlex: 356, bodyFlex: 275, flip: true, noborder: false },
].map(({ desc, ...service }) => ({ ...service, description: desc }));

const CARD_LAYOUT = [
  { imgFlex: 356, bodyFlex: 275, flip: false, noborder: true, image: "/creative/web-dev-service.png", hoverImage: "/creative/web-dev-service-hover.png" },
  { imgFlex: 356, bodyFlex: 275, flip: true,  noborder: false, image: "/creative/ui-ux-service.png", hoverImage: "/creative/ui-ux-service-hover.png" },
  { imgFlex: 356, bodyFlex: 275, flip: false, noborder: false, image: "/creative/ecommerce-service.png", hoverImage: "/creative/ecommerce-service-hover.png" },
  { imgFlex: 356, bodyFlex: 275, flip: true,  noborder: false, image: "/creative/app-service.png", hoverImage: "/creative/app-service-hover.png" },
  { imgFlex: 356, bodyFlex: 275, flip: false, noborder: false, image: "/creative/seo-service.png", hoverImage: "/creative/seo-service-hover.png" },
  { imgFlex: 356, bodyFlex: 275, flip: true, noborder: false, image: "/creative/crm-service.png", hoverImage: "/creative/crm-service-hover.png" },
];

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ").replace(/&quot;/g, '"')
    .replace(/\s{2,}/g, " ")
    .trim();
}

function formatTitle(title: string) {
  if (title.includes("/")) return title;

  const words = title.split(" ");
  if (words.length < 3) return title;
  const midpoint = Math.ceil(words.length / 2);
  return `${words.slice(0, midpoint).join(" ")}\n${words.slice(midpoint).join(" ")}`;
}

export default function CreativeServices({ services = SERVICES }: { services?: CreativeHomeService[] }) {
  const items = services.slice(0, 6).map((service, index) => ({
    ...CARD_LAYOUT[index % CARD_LAYOUT.length],
    ...service,
  }));

  return (
    <section id="services" className="c-services">
      <div className="c-services__head">
        <span className="c-services__word-sm">Our</span>
        <span className="c-services__word-sm">Creative</span>
        <Link href="/creative/services" className="c-services__arrow">
          <svg viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg" width={88} height={88}>
            <circle cx="44" cy="44" r="44" fill="transparent" />
            <path d="M58 30C46.1 41.9 26.8 41.9 14.9 30C26.8 41.9 26.8 61.2 14.9 73.1" stroke="#231F20" strokeWidth="5.83" strokeMiterlimit="10" transform="translate(44 44) scale(-1 -1) translate(-44 -44)" />
            <path d="M14.9 30L58 73.1" stroke="#231F20" strokeWidth="5.83" strokeMiterlimit="10" transform="translate(44 44) scale(-1 -1) translate(-44 -44)" />
          </svg>
        </Link>
        <span className="c-services__word-lg">Services</span>
      </div>

      <div className="c-carousel c-services-carousel">
        <div className="c-carousel__viewport">
          <div className="c-services__grid c-carousel__track">
            {items.map(({ title, description, image, hoverImage, imgFlex, bodyFlex, flip, noborder }) => (
              <article
                key={title}
                className={`c-svc${noborder ? " c-svc--noborder" : ""}${flip ? " c-svc--flip" : ""}`}
              >
                <div
                  className={`c-svc__img${image ? " c-svc__img--photo" : ""}`}
                  style={{ flex: imgFlex }}
                >
                  {image ? (
                    <>
                      <span className="c-svc__photo c-svc__photo--base" style={{ backgroundImage: `url("${image}")` }} />
                      {hoverImage ? (
                        <span className="c-svc__photo c-svc__photo--hover" style={{ backgroundImage: `url("${hoverImage}")` }} />
                      ) : null}
                    </>
                  ) : null}
                </div>
                <div className="c-svc__body" style={{ flex: bodyFlex }}>
                  <h3 className="c-svc__title" style={{ whiteSpace: "pre-line" }}>{formatTitle(title)}</h3>
                  <div className="c-svc__meta">
                    <p className="c-svc__desc" style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}>{stripHtml(description)}</p>
                    <Link href="/creative/services" className="c-svc__explore">
                      Explore
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
