const en = {
  brand: "DON'T FORGET",
  nav: { home: "Home", about: "About", work: "Work", services: "Services", blog: "Blog", contact: "Contact", request: "Start a project" },
  controls: { theme: "Switch theme", language: "Switch language", current: "Current" },
  onboarding: {
    title: "Choose your experience",
    intro: "Select how you would like to explore Don't Forget.",
    note: "You can change this anytime with the theme switcher.",
    themes: {
      focused: ["Focused", "Minimal, clean, and distraction-free."],
      creative: ["Creative", "Bold, expressive, and editorial."],
      immersive: ["Immersive", "Atmospheric digital experiences."],
    },
  },
  home: {
    eyebrow: "Independent digital studio",
    title: "Digital experiences people remember.",
    body: "We design and build fast, expressive websites and products for ambitious brands.",
    work: "View selected work",
    contact: "Discuss a project",
    services: "Capabilities",
    projects: "Selected work",
  },
  pages: {
    about: ["About us", "A small studio building clear, memorable digital products with strategy, design, and engineering."],
    work: ["Selected work", "Projects shaped for performance, clarity, and character."],
    services: ["Services", "From strategy through launch, the work is designed to move your business."],
    blog: ["Latest thinking", "Notes on design, engineering, branding, and growth."],
    contact: ["Let's work together", "Tell us what you are building and where you need help."],
    request: ["Start a project", "Share your scope and we will reply with useful next steps."],
  },
  labels: { viewProject: "View project", viewService: "Explore service", readMore: "Read more", client: "Client", year: "Year", category: "Category", back: "Back", related: "Explore more" },
  form: { name: "Name", email: "Email", projectType: "Project type", message: "Project details", submit: "Send inquiry", success: "Your inquiry has been sent.", error: "Something went wrong. Please try again." },
  footer: { title: "Build something worth remembering.", rights: "All rights reserved." },
  meta: { title: "DON'T FORGET - Digital Agency", description: "Websites, products, and brands built to be remembered." },
} as const;

export type Dictionary = typeof en;
export default en;
