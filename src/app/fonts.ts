import { Caveat, DM_Sans, Funnel_Display, Noto_Sans_Arabic, Source_Code_Pro, Space_Grotesk, Space_Mono, Teko, Turret_Road } from "next/font/google";
import localFont from "next/font/local";

const display = localFont({
  src: [
    { path: "../../public/CSRobust-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/CSRobust-Italic.woff2", weight: "400", style: "italic" },
    { path: "../../public/CSRobust-ReverseItalic.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-display-next",
});
const sans = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const mono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-mono-next" });
const creative = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });
const arabic = Noto_Sans_Arabic({ subsets: ["arabic"], variable: "--font-arabic", weight: ["400", "500", "700"] });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-script-next", weight: ["400", "500", "600", "700"] });
const teko = Teko({ subsets: ["latin"], variable: "--font-teko", weight: ["400", "500", "600", "700"] });
const code = Source_Code_Pro({ subsets: ["latin"], variable: "--font-source-code-pro", weight: ["400", "500"] });
const turret = Turret_Road({ subsets: ["latin"], variable: "--font-turret", weight: ["400", "500", "700", "800"] });
const funnel = Funnel_Display({ subsets: ["latin"], variable: "--font-funnel", weight: ["300", "400", "500", "600", "700", "800"] });

export const fontVariables = `${display.variable} ${sans.variable} ${mono.variable} ${creative.variable} ${arabic.variable} ${caveat.variable} ${teko.variable} ${code.variable} ${turret.variable} ${funnel.variable}`;
