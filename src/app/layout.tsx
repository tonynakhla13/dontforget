import type { Metadata } from "next";
import { Inter, Caveat, Space_Mono, Teko, Source_Code_Pro, Turret_Road, Funnel_Display, DM_Sans, Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";
import { ThemeProvider } from "@/lib/themeContext";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";
import PageTransitionOverlay from "@/components/ui/PageTransitionOverlay";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body-next",
});

const csRobust = localFont({
  src: [
    { path: "../../public/CSRobust-Regular.woff2",       weight: "400", style: "normal" },
    { path: "../../public/CSRobust-Italic.woff2",        weight: "400", style: "italic" },
    { path: "../../public/CSRobust-ReverseItalic.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-display-next",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-script-next",
  weight: ["400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono-next",
});

const teko = Teko({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-teko",
});

const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-source-code-pro",
});

const turretRoad = Turret_Road({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-turret",
});

const funnelDisplay = Funnel_Display({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-funnel",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "DON'T FORGET — Web Development Agency",
  description:
    "DON'T FORGET builds fast, scalable, and memorable web experiences that help brands grow in the digital world.",
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
      className={`${inter.variable} ${csRobust.variable} ${caveat.variable} ${spaceMono.variable} ${teko.variable} ${sourceCodePro.variable} ${turretRoad.variable} ${funnelDisplay.variable} ${dmSans.variable} ${spaceGrotesk.variable}`}
    >
      <body className="antialiased" suppressHydrationWarning>
        <ThemeProvider>
          {/* Theme Switcher will be added as a client component */}
          <ThemeUIWrapper />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

function ThemeUIWrapper() {
  return (
    <>
      <ThemeSwitcher />
      <PageTransitionOverlay />
    </>
  );
}
