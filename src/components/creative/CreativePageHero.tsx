import type { ReactNode } from "react";

interface Props {
  crumb: string;
  title: ReactNode;
  sub: string;
  children?: ReactNode;
}

export default function CreativePageHero({ crumb, title, sub, children }: Props) {
  return (
    <section className="c-page-hero">
      <div className="c-page-hero__art" aria-hidden="true" />
      <div className="c-page-hero__crumb">{crumb}</div>
      <h1 className="c-page-hero__title">{title}</h1>
      <p className="c-page-hero__sub">{sub}</p>
      {children && <div className="c-page-hero__btns">{children}</div>}
    </section>
  );
}
