import { prisma } from '@/lib/prisma';
import { getSection } from '@/lib/content';
import {
  PROJECTS_PAGE_SIZE,
  buildPlatformFilters,
  projectCardOrderBy,
  projectCardSelect,
  type PlatformFilter,
} from '@/lib/projects';
import ProjectsGrid, { type ProjectCard } from './ProjectsGrid';
import Reveal from './Reveal';

const Projects = async () => {
  const section = await getSection('projects');
  let projects: ProjectCard[] = [];
  let total = 0;
  let filters: PlatformFilter[] = [];

  try {
    const where = { published: true };

    // Only the first page is rendered on the server; the rest is fetched on
    // demand, so the homepage never ships every project image up front. The
    // chips do need every project's techList, but that is one small string
    // column, not the cards themselves.
    const [count, firstPage, techLists] = await Promise.all([
      prisma.project.count({ where }),
      prisma.project.findMany({
        where,
        orderBy: projectCardOrderBy,
        take: PROJECTS_PAGE_SIZE,
        select: projectCardSelect,
      }),
      prisma.project.findMany({ where, select: { techList: true } }),
    ]);

    total = count;
    projects = firstPage;
    filters = buildPlatformFilters(techLists.map((p) => p.techList));
  } catch {
    // Database not available - render the empty state.
    projects = [];
    total = 0;
    filters = [];
  }

  const totalPages = Math.max(1, Math.ceil(total / PROJECTS_PAGE_SIZE));

  return (
    <div
      id="projects"
      className="w-full md:min-h-screen h-full flex items-center border-b-2 dark:border-[#2a374a]"
    >
      <div className="max-w-310 px-5 xs:px-10 xl:px-0 w-full mx-auto py-24">
        <Reveal>
          <p className="uppercase text-xl tracking-widest text-[#5651e5]">
            {section.eyebrow}
          </p>
          <h2 className="py-4">{section.heading}</h2>
        </Reveal>

        {projects.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No projects yet. Add some from the admin panel.
          </p>
        ) : (
          <Reveal delay={120}>
            <ProjectsGrid
              initialProjects={projects}
              totalPages={totalPages}
              pageSize={PROJECTS_PAGE_SIZE}
              filters={filters}
              total={total}
            />
          </Reveal>
        )}
      </div>
    </div>
  );
};

export default Projects;
