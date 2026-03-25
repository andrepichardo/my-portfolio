import { prisma } from '@/lib/prisma';
import ProjectItem from './ProjectItem';

const Projects = async () => {
  let projects: {
    id: string;
    title: string;
    slug: string;
    technologies: string;
    imageUrl: string;
  }[] = [];

  try {
    projects = await prisma.project.findMany({
      where: { published: true },
      orderBy: { displayOrder: 'asc' },
      select: {
        id: true,
        title: true,
        slug: true,
        technologies: true,
        imageUrl: true,
      },
    });
  } catch {
    // Database not available - use empty array
    projects = [];
  }

  return (
    <div
      id="projects"
      className="w-full md:min-h-screen h-full flex items-center border-b-2 dark:border-[#2a374a]"
    >
      <div className="max-w-310 px-5 xs:px-10 xl:px-0 w-full mx-auto py-24">
        <p className="uppercase text-xl tracking-widest text-[#5651e5]">
          Projects
        </p>
        <h2 className="py-4">What I&apos;ve Built</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectItem
              key={project.id}
              title={project.title}
              imageUrl={project.imageUrl}
              projectUrl={`/projects/${project.slug}`}
              technologies={project.technologies}
            />
          ))}
          {projects.length === 0 && (
            <p className="text-gray-500 col-span-2 text-center py-8">
              No projects yet. Add some from the admin panel.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;
