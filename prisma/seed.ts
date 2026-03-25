import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import { config } from "dotenv";

config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const adapter = new PrismaPg(pool as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error(
      "❌  ADMIN_EMAIL and ADMIN_PASSWORD must be set in your .env file"
    );
    process.exit(1);
  }

  // Create/update admin user
  const hashed = await bcrypt.hash(adminPassword, 12);
  const user = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: hashed },
    create: { email: adminEmail, password: hashed, name: "André Pichardo" },
  });
  console.log(`✅  Admin user: ${user.email}`);

  // Seed projects
  const projects = [
    {
      slug: "thoughthub",
      title: "ThoughtHub",
      description:
        "A fullstack thoughts sharing app built in React with Next.js, TailwindCSS, PostgreSQL, Prisma & Next Auth. Users are able to add posts into the timeline with a max of 300 characters per post, access to their own profile page to manage all your posts, edit/delete options for any of your posts, and the ability to add comments to any post you want.",
      technologies: "NextJS | PostgreSQL | Prisma",
      techList: [
        "NextJS",
        "Tailwind",
        "HeadlessUI",
        "PostgreSQL",
        "React Query",
        "TypeScript",
        "Prisma",
      ],
      imageUrl: "/projects/thoughthub.png",
      demoUrl: "https://thought-hub.vercel.app/",
      codeUrl: "https://github.com/andrepichardo/thoughthub",
      note: null,
      displayOrder: 1,
      published: true,
    },
    {
      slug: "thatseries",
      title: "ThatSeriesApp",
      description:
        "A simple and friendly application built with Next.js that connects to the EpisoDate API, allowing users to search for and navigate through many TV shows. Users can also view detailed information about a specific TV show, including the release date, genre, episodes, and more. This app has nice pagination, showing 20 results per query and keeping the information of already visited pages cached, thanks to React Query.",
      technologies: "NextJS | Tailwind | React Query",
      techList: ["NextJS", "Tailwind", "DaisyUI", "React Query", "TypeScript"],
      imageUrl: "/projects/thatseries.png",
      demoUrl: "https://thatseries-app.vercel.app/",
      codeUrl: "https://github.com/andrepichardo/thatseries-app",
      note: null,
      displayOrder: 2,
      published: true,
    },
    {
      slug: "linkspace",
      title: "LinkSpaceApp",
      description:
        "A nice Link-management app inspired by Linktree. This app was built using NextJS and TailwindCSS for the frontend, and Supabase as backend technology. Users are able to create an account with a unique username. As soon as you sign in, you will be able to create your personal links by entering the Link Name & URL, and of course, upload your own Profile Picture. Share your profile's URL to anyone so they can access all your important links.",
      technologies: "NextJS | Tailwind | Supabase",
      techList: ["NextJS", "Tailwind", "Supabase", "TypeScript"],
      imageUrl: "/projects/linkspaceapp.png",
      demoUrl: "https://link-space.vercel.app/",
      codeUrl: "https://github.com/andrepichardo/linktree-clone",
      note: null,
      displayOrder: 3,
      published: true,
    },
    {
      slug: "gobdo",
      title: "Gob.do Portal",
      description:
        "The official Portal of Services of the Dominican Government, a platform that brings together all the available services of the State in a digital way, to facilitate the citizen all the bureaucratic processes that correspond to each service. As expected, I worked on this project together with other great frontend and backend developers, which made this experience a lot more enjoyable.",
      technologies: "NextJS | Tailwind | React Query",
      techList: [
        "NextJS",
        "JavaScript",
        "Tailwind",
        "Headless UI",
        "React Query",
        "Docker",
      ],
      imageUrl: "/projects/gobdo.png",
      demoUrl: "https://www.gob.do/",
      codeUrl: null,
      note: "The repository of this project is private, since it belongs to the government of the Dominican Republic.",
      displayOrder: 4,
      published: true,
    },
    {
      slug: "gifexpert",
      title: "GifExpertApp",
      description:
        "A simple and friendly GIF Search Engine app. This project was built using ReactJS, TailwindCSS, with the help of GIPHY API. Users are able to search for GIFs of any subject given. Also will be able to view a maximum of 20 results per search.",
      technologies: "ReactJS | Tailwind | GIPHY API",
      techList: ["React", "Tailwind", "Vite", "JavaScript", "GIPHY API"],
      imageUrl: "/projects/gifexpertapp.png",
      demoUrl: "https://gif-expert-dre.netlify.app",
      codeUrl: "https://github.com/andrepichardo/gif-expert-app",
      note: null,
      displayOrder: 5,
      published: true,
    },
    {
      slug: "becas",
      title: "Beca tu Futuro",
      description:
        "A web application created with the purpose of providing thousands of students from the Dominican Republic the opportunity to apply for both national and international scholarships. Also, after applying for a scholarship, you can follow up on it, knowing the status of your application at all times. I worked on this portal together with other excellent frontend and backend developers, from whom I learned a lot throughout it.",
      technologies: "ReactJS | Tailwind | Redux",
      techList: [
        "ReactJS",
        "JavaScript",
        "Tailwind",
        "Headless UI",
        "Redux",
        "Docker",
      ],
      imageUrl: "/projects/becatufuturo.png",
      demoUrl: "https://becas.gob.do/",
      codeUrl: null,
      note: "The repository of this project is private, since it belongs to the government of the Dominican Republic.",
      displayOrder: 6,
      published: true,
    },
  ];

  for (const p of projects) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }

  console.log(`✅  Seeded ${projects.length} projects`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
