'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import type { PlatformFilter } from '@/lib/projects';
import ProjectItem, { projectCardSize } from './ProjectItem';
import Pagination from './Pagination';
import PlatformFilters from './PlatformFilters';

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
  filters: PlatformFilter[];
  /** Published projects with no filter applied — the count on the "All" chip. */
  total: number;
}

/** Cache key for one page of one filter. `null` is the unfiltered grid. */
const keyFor = (platform: string | null, page: number) =>
  `${platform ?? 'all'}:${page}`;

/**
 * Reflects the active filter in the address bar so the grid survives a refresh
 * and can be linked to. `replaceState` rather than `pushState`: on a one-page
 * site, stacking a history entry per chip would turn Back into "undo my last
 * five clicks" instead of "leave this page". The `#projects` hash rides along
 * so a shared link opens on the section rather than at the top of the page.
 */
function syncUrl(platform: string | null) {
  const url = new URL(window.location.href);
  if (platform) {
    url.searchParams.set('platform', platform);
    url.hash = 'projects';
  } else {
    url.searchParams.delete('platform');
  }
  window.history.replaceState(null, '', url);
}

const ProjectsGrid = ({
  initialProjects,
  totalPages,
  pageSize,
  filters,
  total,
}: ProjectsGridProps) => {
  const [platform, setPlatform] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  // Pages already downloaded, so going back and forth costs nothing.
  const [cache, setCache] = useState<Record<string, ProjectCard[]>>({
    [keyFor(null, 1)]: initialProjects,
  });
  // Each filter narrows the grid to a different number of pages.
  const [pageCounts, setPageCounts] = useState<Record<string, number>>({
    all: totalPages,
  });
  const gridRef = useRef<HTMLDivElement>(null);
  const inFlight = useRef(new Set<string>());

  const fetchPage = useCallback(
    async (targetPlatform: string | null, targetPage: number) => {
      const params = new URLSearchParams({
        page: String(targetPage),
        limit: String(pageSize),
      });
      if (targetPlatform) params.set('platform', targetPlatform);

      const res = await fetch(`/api/projects?${params}`, {
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error('Request failed');

      const data: { projects: ProjectCard[]; totalPages: number } =
        await res.json();

      setCache((prev) => ({
        ...prev,
        [keyFor(targetPlatform, targetPage)]: data.projects,
      }));
      setPageCounts((prev) => ({
        ...prev,
        [targetPlatform ?? 'all']: data.totalPages,
      }));
    },
    [pageSize]
  );

  const prefetch = useCallback(
    (targetPlatform: string | null, targetPage: number) => {
      const key = keyFor(targetPlatform, targetPage);
      if (cache[key] || inFlight.current.has(key)) return;
      inFlight.current.add(key);
      fetchPage(targetPlatform, targetPage)
        .catch(() => {
          // A failed prefetch is silent; the click retries it.
        })
        .finally(() => inFlight.current.delete(key));
    },
    [cache, fetchPage]
  );

  // Keep the section header in view when the grid swaps under the user.
  const keepHeaderInView = useCallback(() => {
    const top = gridRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) {
      document
        .getElementById('projects')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const show = useCallback(
    async (
      targetPlatform: string | null,
      targetPage: number,
      // The mount-time restore skips the scroll: the browser is already
      // handling the `#projects` hash, and a second scroll fights it.
      { scroll = true }: { scroll?: boolean } = {}
    ) => {
      if (scroll) keepHeaderInView();

      if (cache[keyFor(targetPlatform, targetPage)]) {
        setPlatform(targetPlatform);
        setPage(targetPage);
        syncUrl(targetPlatform);
        return;
      }

      setLoading(true);
      try {
        await fetchPage(targetPlatform, targetPage);
        setPlatform(targetPlatform);
        setPage(targetPage);
        syncUrl(targetPlatform);
      } catch {
        toast.error('Could not load those projects. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [cache, fetchPage, keepHeaderInView]
  );

  // Adopt the filter from the URL once, after hydration. It cannot be read
  // during render: the homepage is prerendered without a filter, so the first
  // paint has to match that HTML or React reports a hydration mismatch.
  const restored = useRef(false);
  useEffect(() => {
    if (restored.current) return;
    restored.current = true;

    const slug = new URLSearchParams(window.location.search).get('platform');
    // An unknown slug falls through to the full grid, matching what the API
    // does with the same value.
    if (slug && filters.some((f) => f.slug === slug)) {
      show(slug, 1, { scroll: false });
    }
  }, [filters, show]);

  const currentPages = pageCounts[platform ?? 'all'] ?? 1;

  const goToPage = useCallback(
    (target: number) => {
      if (target < 1 || target > currentPages || target === page) return;
      show(platform, target);
    },
    [currentPages, page, platform, show]
  );

  // A filter change always lands on page 1: page 3 of "All" rarely exists
  // once the grid is narrowed to three projects.
  const selectPlatform = useCallback(
    (target: string | null) => {
      if (target === platform) return;
      show(target, 1);
    },
    [platform, show]
  );

  const projects = cache[keyFor(platform, page)] ?? [];
  const skeletonCount = Math.min(pageSize, projects.length || pageSize);

  return (
    <div ref={gridRef}>
      <PlatformFilters
        filters={filters}
        active={platform}
        total={total}
        onChange={selectPlatform}
        onPrefetch={(slug) => prefetch(slug, 1)}
        disabled={loading}
      />

      <div
        key={loading ? 'loading' : keyFor(platform, page)}
        className={`grid grid-cols-1 gap-8 md:grid-cols-2 ${
          loading ? '' : 'animate-fade-in-up'
        }`}
        aria-busy={loading}
        aria-live="polite"
      >
        {loading
          ? Array.from({ length: skeletonCount }, (_, i) => (
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
        totalPages={currentPages}
        onChange={goToPage}
        onPrefetch={(target) => prefetch(platform, target)}
        disabled={loading}
      />
    </div>
  );
};

export default ProjectsGrid;
