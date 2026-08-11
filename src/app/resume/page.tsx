import type { Metadata } from "next";
import { FaDownload } from "react-icons/fa";
import { getSettings, getSocialLinks } from "@/lib/content";
import SocialIcon from "@/components/SocialIcon";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: `${settings.metaTitle.split("|")[0].trim()} | Resume`,
    description: settings.metaDescription,
  };
}

const SUMMARY = [
  "Frontend Developer with 4+ years of experience building scalable web applications across different sectors (government, telecommunications, marketing and more).",
  "Specialist in React, Next.js, TypeScript and TailwindCSS; focus on performance (Core Web Vitals), accessibility (WCAG 2.1), and responsive UX.",
  "Former QA Tester with a strong quality-first mindset, experienced in designing automated test cases and ensuring stable, reliable releases.",
  "Proven track record building citizen-facing digital services impacting 150,000+ users, with expertise in REST API integrations and Agile collaboration.",
];

const SKILLS: { group: string; items: string }[] = [
  {
    group: "Frontend",
    items:
      "React | Next.js | TypeScript | TailwindCSS | HTML5 | CSS3 | React Query/TanStack | Zod | shadcn/ui | Radix UI",
  },
  {
    group: "Backend & Databases",
    items: "Node.js | MongoDB | PostgreSQL | Firebase | REST APIs",
  },
  {
    group: "CMS & Builders",
    items: "WordPress | Elementor | ACF | WooCommerce",
  },
  { group: "DevOps & QA", items: "Git | CI/CD | Docker | Jest | Cypress" },
  {
    group: "SEO & Performance",
    items:
      "Technical SEO | Core Web Vitals | Accessibility (WCAG) | Responsive Design",
  },
  {
    group: "Hosting & Analytics",
    items: "AWS/cPanel | Google Analytics | Search Console",
  },
  { group: "Languages", items: "Spanish (Native) | English (Professional)" },
];

const OGTIC_BULLETS = [
  "Developed and maintained large-scale government platforms using React, Next.js, and TailwindCSS, delivering modern, responsive, and scalable user interfaces.",
  "Implemented SEO, accessibility (WCAG 2.1), and performance optimizations, improving user engagement and Core Web Vitals scores.",
  "Engineered multi-step form flows with robust validations, state management, and seamless API integrations, streamlining online service applications.",
  "Partnered with designers, backend developers, and QA teams in Agile sprints to ship production-ready features on time.",
];

const GOV_PROJECTS = [
  {
    name: "International Scholarships Portal (becas.gob.do)",
    detail:
      "Responsive layout and backend API integration for online applications, benefitting more than 157,000 users and nearly 10,000 scholarship recipients.",
  },
  {
    name: "Gob.do",
    detail:
      "Contributed to the central government services portal; mobile-first UI and multi-step form logic, enabling digital access to 300+ services for thousands of citizens and families.",
  },
  {
    name: "SAIP Portal (Public Information Access)",
    detail:
      "Sole frontend developer; integrated endpoints into the new design, strengthening transparency and streamlining requests across hundreds of institutions.",
  },
  {
    name: "311 Portal & CRM",
    detail:
      "UI, data fetching and endpoint integrations for citizen reports and case management, improving national handling of complaints, claims and suggestions.",
  },
];

const ALTICE_BULLETS = [
  "Designed and executed comprehensive manual and automated test cases for web and mobile applications, ensuring high-quality releases.",
  "Identified, documented, and tracked critical defects, collaborating closely with developers to accelerate resolution and improve system stability.",
  "Contributed to the standardization of test plans and regression suites, reducing release cycles and increasing overall testing efficiency.",
];

const EDUCATION = [
  {
    school: "Instituto Tecnológico de Santo Domingo (INTEC)",
    detail: "B.S. in Electronics & Communications Engineering (2015–2019)",
  },
  {
    school: "Colegio APEC Fernando Arturo de Meriño (CAFAM)",
    detail:
      "Technical High School Diploma in Electronics & Microcomputing (2015)",
  },
];

const CERTIFICATIONS = [
  "React.js (Hooks & MERN) — Udemy — 2021",
  "Professional Web Development (HTML/CSS/JavaScript) — Udemy — 2020",
];

const bullet =
  "p-2 cursor-pointer hover:shadow-md hover:rounded-lg transition-all";
const list =
  "py-1 leading-relaxed text-justify list-disc list-outside px-7";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h5 className="text-center underline text-[18px] py-4">{children}</h5>
  );
}

export default async function ResumePage() {
  // The rendered CV stays in code; only the downloadable PDF and the social
  // links come from the CMS.
  const [{ resumeUrl }, links] = await Promise.all([
    getSettings(),
    getSocialLinks(),
  ]);
  // Only the outbound profiles belong up here — the mail and resume shortcuts
  // point back into the site.
  const profiles = links.filter((link) => !link.url.startsWith("/"));

  return (
    <div className="max-w-235 mx-auto px-5 xs:px-10 xl:px-0 pt-30 pb-16">
      <h2 className="text-center">Resume</h2>

      <div className="bg-[#d0d4d6] dark:bg-[#2a374a] transition-all my-4 p-4 w-full flex justify-between flex-wrap gap-2 items-center">
        <h2 className="text-xl xs:text-3xl md:text-4xl">André Pichardo</h2>
        <div className="flex items-center gap-2">
          <a
            href={resumeUrl}
            download
            className="p-0.5 xs:p-1"
            aria-label="Download resume as PDF"
          >
            <FaDownload className="w-3.5 h-3.5 xs:w-4 xs:h-4 md:w-5 md:h-5" />
          </a>
          {profiles.map((profile) => (
            <a
              key={profile.id}
              href={profile.url}
              target="_blank"
              rel="noreferrer"
              className="p-0.5 xs:p-1"
              aria-label={profile.label}
            >
              <SocialIcon
                icon={profile.icon}
                className="w-4 h-4 xs:w-5 xs:h-5 md:w-6 md:h-6"
              />
            </a>
          ))}
        </div>
      </div>

      <div className="py-4 text-center">
        <p className="text-lg font-bold tracking-wider uppercase">
          Software Developer
        </p>
        <p className="pt-2 text-sm tracking-wider uppercase text-gray-600 dark:text-[#abb8c2]">
          React <span className="px-1">•</span> Next.js
          <span className="px-1">•</span> TypeScript
          <span className="px-1">•</span> Node.js
        </p>
        <p className="pt-3 text-sm text-gray-600 dark:text-[#abb8c2]">
          Santo Domingo, Dominican Republic
        </p>
      </div>

      <SectionTitle>Summary</SectionTitle>
      <ul className={list}>
        {SUMMARY.map((line) => (
          <li key={line} className={bullet}>
            {line}
          </li>
        ))}
      </ul>

      <SectionTitle>Technical Skills</SectionTitle>
      <div className="flex flex-col gap-1">
        {SKILLS.map((skill) => (
          <p key={skill.group} className="py-2">
            <span className="font-bold">{skill.group}</span>
            <span className="px-2">|</span>
            {skill.items}
          </p>
        ))}
      </div>

      <SectionTitle>Professional Experience</SectionTitle>

      <div className="py-6">
        <p className="italic">
          <span className="italic font-bold">
            Government Office of Information and Communication Technologies of
            the Dominican Republic (OGTIC)
          </span>
          <span className="px-2">|</span>Santo Domingo, DO
        </p>
        <p className="py-1 italic">Frontend Developer (Aug 2021 – Present)</p>
        <ul className={list}>
          {OGTIC_BULLETS.map((line) => (
            <li key={line} className={bullet}>
              {line}
            </li>
          ))}
        </ul>

        <p className="pt-4 pb-1 font-bold uppercase text-sm tracking-wider">
          Highlighted Government Projects
        </p>
        <ul className={list}>
          {GOV_PROJECTS.map((project) => (
            <li key={project.name} className={bullet}>
              <span className="font-bold">{project.name}</span>: {project.detail}
            </li>
          ))}
        </ul>
      </div>

      <div className="py-6">
        <p className="italic">
          <span className="italic font-bold">Altice Dominicana</span>
          <span className="px-2">|</span>Santo Domingo, DO
        </p>
        <p className="py-1 italic">
          Software Quality Assurance Tester (Nov 2019 – Aug 2021)
        </p>
        <ul className={list}>
          {ALTICE_BULLETS.map((line) => (
            <li key={line} className={bullet}>
              {line}
            </li>
          ))}
        </ul>
      </div>

      <SectionTitle>Education</SectionTitle>
      <div className="flex flex-col gap-4 py-2">
        {EDUCATION.map((entry) => (
          <div key={entry.school}>
            <p className="font-bold">{entry.school}</p>
            <p className="italic text-gray-600 dark:text-[#abb8c2]">
              {entry.detail}
            </p>
          </div>
        ))}
      </div>

      <SectionTitle>Certifications</SectionTitle>
      <ul className={list}>
        {CERTIFICATIONS.map((cert) => (
          <li key={cert} className={bullet}>
            {cert}
          </li>
        ))}
      </ul>
    </div>
  );
}
