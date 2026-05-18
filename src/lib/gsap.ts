import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";

// Safe to call directly — GSAP handles SSR gracefully,
// plugins simply won't activate server-side.
gsap.registerPlugin(ScrollTrigger, TextPlugin);

export { gsap, ScrollTrigger, TextPlugin };
