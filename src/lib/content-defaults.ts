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
    eyebrow: "5+ years of experience · Santo Domingo, Dominican Republic",
    heading: "Hi, I'm André",
    highlight: "André",
    subheading: "Full-Stack Software Developer",
    body: [
      "I build web applications with React, Next.js and TypeScript — from government platforms serving 150,000+ citizens to SaaS products, online stores and WordPress sites.",
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
      "I graduated as an Electronics and Communications engineer from INTEC in 2019, but I got into software through the back door: two years as a QA tester at Altice Dominicana, breaking other people's code for a living. It was the best training I could have asked for. I learned what fragile software looks like from the outside, and I still write code expecting someone to try to break it.",
      "In 2021 I moved into development at OGTIC, the Dominican government's technology office, and I have been building public services there ever since. My work runs on platforms most Dominicans have used at least once: the national scholarships portal, with more than 157,000 users; gob.do, the single entry point to 300+ state services; the 311 system for citizen complaints and the internal CRM that institutions use to resolve them; and the public information access portal, where I was the only frontend developer.",
      "That audience shapes how I build. These platforms get opened on old phones and slow connections, by people who need something from the State and cannot afford a form that loses their data on step four — so performance, accessibility and solid validation are not polish, they are the job. Day to day that means React, Next.js and TypeScript, TanStack Query for server state and Zod for validation. I work in Agile sprints alongside designers, backend developers and QA teams, and I have owned architecture and performance decisions on the frontend of systems used by institutions across the country.",
      "Outside the office I build for clients and for myself: WordPress and e-commerce sites for local businesses, and Propio, my own SaaS for independent landlords, where I own the whole stack from Postgres to the interface. I work in Spanish and English. Away from the keyboard you will find me gaming, at the gym, or catching a movie with friends.",
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
