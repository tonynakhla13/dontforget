import Link from "next/link";
import { fontVariables } from "./fonts";
import "./globals.css";

export default function GlobalNotFound() {
  return (
    <html lang="en" dir="ltr" className={fontVariables}>
      <body className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#090909] text-[#F0ECE3]">
        <p className="font-mono text-xs uppercase tracking-[.3em] text-[#3ABF8A]">404</p>
        <h1 className="text-4xl">Page not found</h1>
        <Link className="border border-[#3ABF8A] px-6 py-3 text-[#3ABF8A]" href="/en">Return home</Link>
      </body>
    </html>
  );
}
