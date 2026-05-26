import type { Metadata } from "next";
import { fontVariables } from "../fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: "DON'T FORGET - Admin",
  description: "DON'T FORGET administration",
};

export default function SystemLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr" className={fontVariables}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
