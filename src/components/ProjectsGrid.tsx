'use client';

import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';
import ProjectItem, { projectCardSize } from './ProjectItem';
import Pagination from './Pagination';

export interface ProjectCard {
  id: string;
  title: string;
  slug: string;
  technologies: string;
  imageUrl: string;
}

interface ProjectsGridProps {
  initialProjects: ProjectCard[];
  totalPages: number;
  pageSize: number;
}

const ProjectsGrid = ({
  initialProjects,
  totalPages,
  pageSize,
}: ProjectsGridProps) => {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  // Pages already downloaded, so going back and forth costs nothing.
  const [cache, setCache] = useState<Record<number, ProjectCard[]>>({
    1: initialProjects,
  });
  const gridRef = useRef<HTMLDivElement>(null);
  const inFlight = useRef(new Set<number>());

  const fetchPage = useCallback(
    async (target: number): Promise<ProjectCard[] | null> => {
      const res = await fetch(
        `/api/projects?page=${target}&limit=${pageSize}`,
        { headers: { Accept: 'application/json' } }
      );
      if (!res.ok) throw new Error('Request failed');

      const data: { projects: ProjectCard[] } = await res.json();
      setCache((prev) => ({ ...prev, [target]: data.projects }));
      return data.projects;
    },
    [pageSize]
  );

  const prefetch = useCallback(
    (target: number) => {
      if (cache[target] || inFlight.current.has(target)) return;
      inFlight.current.add(target);
      fetchPage(target)
        .catch(() => {
          // A failed prefetch is silent; the click retries it.
        })
        .finally(() => inFlight.current.delete(target));
    },
    [cache, fetchPage]
  );

  const goToPage = useCallback(
    async (target: number) => {
      if (target < 1 || target > totalPages || target === page) return;

      // Keep the section header in view when the grid swaps under the user.
      const top = gridRef.current?.getBoundingClientRect().top ?? 0;
      if (top < 0) {
        document
          .getElementById('projects')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      if (cache[target]) {
        setPage(target);
        return;
      }

      setLoading(true);
      try {
        await fetchPage(target);
        setPage(target);
      } catch {
        toast.error('Could not load that page. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [cache, fetchPage, page, totalPages]
  );

  const projects = cache[page] ?? [];

  return (
    <div ref={gridRef}>
      <div
        key={loading ? 'loading' : page}
        className={`grid grid-cols-1 gap-8 md:grid-cols-2 ${
          loading ? '' : 'animate-fade-in-up'
        }`}
        aria-busy={loading}
        aria-live="polite"
      >
        {loading
          ? Array.from({ length: pageSize }, (_, i) => (
              <div
                key={`skeleton-${i}`}
                className={`${projectCardSize} rounded-xl shadow-xl shadow-gray-400 dark:shadow-gray-900/80 bg-gray-300 dark:bg-[#2a374a] animate-pulse`}
              />
            ))
          : projects.map((project) => (
              <ProjectItem
                key={project.id}
                title={project.title}
                imageUrl={project.imageUrl}
                projectUrl={`/projects/${project.slug}`}
                technologies={project.technologies}
              />
            ))}
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        onChange={goToPage}
        onPrefetch={prefetch}
        disabled={loading}
      />
    </div>
  );
};

export default ProjectsGrid;
