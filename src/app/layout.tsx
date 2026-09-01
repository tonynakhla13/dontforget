import type { Metadata } from "next";
import { Inter, Bebas_Neue, Caveat, Space_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body-next",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-display-next",
  weight: "400",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-script-next",
  weight: ["400", "600", "700"],
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono-next",
});

export const metadata: Metadata = {
  title: "DON'T FORGET — Web Development Agency",
  description:
    "DON'T FORGET builds fast, scalable, and secure web experiences that help brands grow in the digital world.",
  keywords: [
    "web development agency",
    "web design",
    "brand systems",
    "GSAP",
    "Three.js",
    "digital agency",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${bebasNeue.variable} ${caveat.variable} ${spaceMono.variable} scroll-smooth`}
    >
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
