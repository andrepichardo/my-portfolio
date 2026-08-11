/**
 * Types and fallback copy for the editable site content.
 *
 * Deliberately free of imports: the seed script loads it outside Next, and the
 * admin client components need the labels and field config without dragging
 * Prisma into the browser bundle. The database access lives in ./content.ts.
 */

export type SectionKey = "hero" | "about" | "skills" | "projects" | "contact";

export interface SectionContent {
  key: SectionKey;
  eyebrow: string;
  heading: string;
  highlight: string;
  subheading: string;
  body: string[];
  imageUrl: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface SkillItem {
  id: string;
  name: string;
  imageUrl: string;
  iconSize: number;
}

export interface SocialLinkItem {
  id: string;
  label: string;
  url: string;
  icon: string;
}

export interface SiteSettingsContent {
  metaTitle: string;
  metaDescription: string;
  resumeUrl: string;
}

/** Order the CMS lists the sections in. */
export const SECTION_KEYS: SectionKey[] = [
  "hero",
  "about",
  "skills",
  "projects",
  "contact",
];

export const SECTION_LABELS: Record<SectionKey, string> = {
  hero: "Hero",
  about: "About",
  skills: "Skills",
  projects: "Projects",
  contact: "Contact",
};

export const SECTION_HINTS: Record<SectionKey, string> = {
  hero: "The first screen visitors land on.",
  about: "Your bio and portrait.",
  skills: "Headings only — the logos are managed under Skills.",
  projects: "Headings only — the cards come from Projects.",
  contact: "Headings and the photo beside the form.",
};

/** Which fields the editor shows per section, so unused ones stay hidden. */
export interface SectionFieldConfig {
  highlight?: boolean;
  subheading?: boolean;
  body?: "paragraphs" | "single" | false;
  image?: boolean;
  cta?: boolean;
}

export const SECTION_FIELDS: Record<SectionKey, SectionFieldConfig> = {
  hero: { highlight: true, subheading: true, body: "single" },
  about: { body: "paragraphs", image: true, cta: true },
  skills: { body: false },
  projects: { body: false },
  contact: { subheading: true, body: "paragraphs", image: true },
};

/** Icons the social link editor can pick from. */
export const SOCIAL_ICONS = [
  "linkedin",
  "github",
  "mail",
  "resume",
  "twitter",
  "instagram",
  "whatsapp",
  "website",
] as const;

export const SECTION_DEFAULTS: Record<SectionKey, SectionContent> = {
  hero: {
    key: "hero",
    eyebrow: "Let's build something worth using",
    heading: "Hi, I'm André",
    highlight: "André",
    subheading: "A Full-Stack Software Developer",
    body: [
      "From government platforms serving 150,000+ citizens to SaaS products, e-commerce stores, blogs and landing pages. I build them with React, Next.js and TypeScript — or WordPress, when that is the right tool for the job.",
    ],
    imageUrl: "",
    ctaLabel: "",
    ctaHref: "",
  },
  about: {
    key: "about",
    eyebrow: "About",
    heading: "Who I Am",
    highlight: "",
    subheading: "",
    body: [
      "I studied Electronics and Communications engineering at INTEC and graduated in 2019, but I got into software through the back door: two years as a QA tester at Altice Dominicana, breaking other people's code for a living. It turned out to be the best training I could have asked for — I learned what fragile software looks like from the outside, and I still write code like someone is about to try to break it.",
      "In 2021 I joined OGTIC, the Dominican government's technology office, as a frontend developer, and I have been there five years. Most of what I build is public: portals where people apply for a scholarship, file a complaint, or reach any of the 300+ services the State offers online. That audience is the whole point — these platforms get opened on old phones and slow connections, so performance, accessibility and multi-step forms that never lose your data are the problems I actually care about. Day to day that means React, Next.js, TypeScript and TailwindCSS against a REST API.",
      "Alongside that I take on client work — WordPress and e-commerce builds for businesses that need a site that actually sells — and I am building Propio, my own SaaS for independent landlords. Away from the keyboard you will find me gaming, at the gym, or catching a movie with friends.",
    ],
    imageUrl: "/assets/PortfolioPicture.jpg",
    ctaLabel: "Check out some of my latest projects.",
    ctaHref: "/#projects",
  },
  skills: {
    key: "skills",
    eyebrow: "Skills",
    heading: "What I Can Do",
    highlight: "",
    subheading: "",
    body: [],
    imageUrl: "",
    ctaLabel: "",
    ctaHref: "",
  },
  projects: {
    key: "projects",
    eyebrow: "Projects",
    heading: "What I've Built",
    highlight: "",
    subheading: "",
    body: [],
    imageUrl: "",
    ctaLabel: "",
    ctaHref: "",
  },
  contact: {
    key: "contact",
    eyebrow: "Contact",
    heading: "Get In Touch",
    highlight: "",
    // The card beside the form: name, then role and availability as paragraphs.
    subheading: "André Pichardo",
    body: [
      "Front-End Developer",
      "I am available for freelance & full-time positions. Feel free to contact me and let's talk.",
    ],
    imageUrl: "/assets/contact.jpg",
    ctaLabel: "",
    ctaHref: "",
  },
};

export const SKILL_DEFAULTS: SkillItem[] = [
  { id: "d-html", name: "HTML", imageUrl: "/assets/skills/html.png", iconSize: 64 },
  { id: "d-css", name: "CSS", imageUrl: "/assets/skills/css.png", iconSize: 64 },
  { id: "d-js", name: "Javascript", imageUrl: "/assets/skills/javascript.png", iconSize: 64 },
  { id: "d-react", name: "React", imageUrl: "/assets/skills/react.png", iconSize: 64 },
  { id: "d-next", name: "Next.js", imageUrl: "/assets/skills/nextjs.png", iconSize: 64 },
  { id: "d-tw", name: "Tailwind", imageUrl: "/assets/skills/tailwind.png", iconSize: 64 },
  { id: "d-mui", name: "Material UI", imageUrl: "/assets/skills/material-ui.svg", iconSize: 64 },
  { id: "d-node", name: "Node.js", imageUrl: "/assets/skills/node.png", iconSize: 64 },
  { id: "d-supa", name: "Supabase", imageUrl: "/assets/skills/supabase.svg", iconSize: 64 },
  { id: "d-pg", name: "PostgreSQL", imageUrl: "/assets/skills/PostgreSQL.svg", iconSize: 64 },
  { id: "d-mongo", name: "MongoDB", imageUrl: "/assets/skills/MongoDB.svg", iconSize: 32 },
  { id: "d-prisma", name: "Prisma", imageUrl: "/assets/skills/Prisma.svg", iconSize: 40 },
];

export const SOCIAL_DEFAULTS: SocialLinkItem[] = [
  {
    id: "d-linkedin",
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/andre-pichardo/",
    icon: "linkedin",
  },
  {
    id: "d-github",
    label: "GitHub",
    url: "https://github.com/andrepichardo",
    icon: "github",
  },
  { id: "d-mail", label: "Email", url: "/#contact", icon: "mail" },
  { id: "d-resume", label: "Resume", url: "/resume", icon: "resume" },
];

export const SETTINGS_DEFAULTS: SiteSettingsContent = {
  metaTitle: "André Pichardo | Front-End Developer",
  metaDescription:
    "Dominican front-end web developer, specializing in building great digital experiences.",
  resumeUrl: "/Resume-André-Pichardo.pdf",
};
