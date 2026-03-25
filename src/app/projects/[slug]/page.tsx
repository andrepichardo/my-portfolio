import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RiArrowLeftSLine, RiRadioButtonFill } from "react-icons/ri";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });
  if (!project) return { title: "Project Not Found" };
  return {
    title: `André Pichardo | ${project.title}`,
    description:
      "Dominican front-end web developer, specializing in building great digital experiences.",
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });

  if (!project) notFound();

  return (
    <div className="w-full">
      <div className="w-full h-[40vh] lg:h-[50vh] relative">
        <div className="absolute top-0 left-0 w-full h-[40vh] lg:h-[50vh] bg-black/80 z-10"></div>
        <Image
          className="absolute object-cover w-full h-[40vh] lg:h-[50vh]"
          src={project.imageUrl}
          alt={project.title}
          width={1200}
          height={600}
          priority
        />
        <div className="absolute text-white p-2 z-10 top-[70%] px-5 xs:px-10 xl:px-0 max-w-[1240px] w-full left-[50%] right-[50%] translate-x-[-50%] translate-y-[-50%]">
          <h2 className="py-2">{project.title}</h2>
          <h3>{project.technologies.replace(/\|/g, "/")}</h3>
        </div>
      </div>

      <div className="max-w-[1240px] mb-4 mx-auto py-2 px-5 xs:px-10 xl:px-0 grid md:grid-cols-7 gap-8 pt-4">
        <div className="flex flex-col col-span-5 gap-3 text-justify">
          <h2 className="mb-2">Overview</h2>
          <p>{project.description}</p>
          {project.note && (
            <p>
              <b>Note</b>: {project.note}
            </p>
          )}
          <div className="flex flex-wrap items-center justify-center w-full gap-4 mt-4 xs:justify-start">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="w-full px-8 py-2">DEMO</button>
              </a>
            )}
            {project.codeUrl && (
              <a
                href={project.codeUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="w-full px-8 py-2">CODE</button>
              </a>
            )}
          </div>
        </div>
        <div className="col-span-5 p-4 shadow-xl md:col-span-2 h-fit rounded-xl shadow-gray-400 dark:shadow-gray-900/80">
          <div className="p-2">
            <p className="pb-2 font-bold text-center">Technologies</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-1">
              {project.techList.map((tech) => (
                <p
                  key={tech}
                  className="text-gray-600 dark:text-[#ecf0f3] transition-all py-2 flex items-center gap-1"
                >
                  <RiRadioButtonFill className="shrink-0" />
                  {tech}
                </p>
              ))}
            </div>
          </div>
        </div>
        <Link className="w-fit" href="/#projects">
          <span className="flex items-center py-1 cursor-pointer hover:underline underline-offset-4">
            <RiArrowLeftSLine />
            Back
          </span>
        </Link>
      </div>
    </div>
  );
}
