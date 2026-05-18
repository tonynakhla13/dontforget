import type { Metadata } from "next";
import { Bodoni_Moda, Inter, Space_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body-next",
});

const bodoniModa = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-display-next",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono-next",
});

export const metadata: Metadata = {
  title: "dontforget — Digital studio",
  description:
    "dontforget builds brand systems, digital products, immersive web experiences, and motion identities.",
  keywords: [
    "creative agency",
    "web design",
    "web development",
    "GSAP",
    "Three.js",
    "digital studio",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${bodoniModa.variable} ${spaceMono.variable}`}>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
