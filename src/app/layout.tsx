import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "dontforget — Creative Web Agency",
  description:
    "A creative web agency that crafts fast, beautiful, and memorable digital experiences. Web design, development, 3D & motion.",
  keywords: ["web agency", "web design", "web development", "GSAP", "Three.js", "Next.js"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body className="font-sans bg-black antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
