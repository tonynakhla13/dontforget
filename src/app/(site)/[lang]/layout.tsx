import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { direction, isLocale } from "@/i18n/config";
import { fontVariables } from "../../fonts";
import "../../globals.css";
import "./site.css";
import "../../_legacy/creative/creative.css";

export const metadata: Metadata = { title: "DON'T FORGET" };

export default async function LocalizedLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ lang: string }> }>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html lang={lang} dir={direction(lang)} className={fontVariables}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
