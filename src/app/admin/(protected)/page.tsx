import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProjectList, { type ProjectRow } from "@/components/admin/ProjectList";
import ProjectSearch from "@/components/admin/ProjectSearch";

const PAGE_SIZE = 10;

interface Props {
  searchParams: Promise<{ page?: string; q?: string }>;
}

export default async function AdminPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = (params.q ?? "").trim();

  const where = query
    ? {
        OR: [
          { title: { contains: query, mode: "insensitive" as const } },
          { slug: { contains: query, mode: "insensitive" as const } },
          { technologies: { contains: query, mode: "insensitive" as const } },
        ],
      }
    : {};

  const total = await prisma.project.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(params.page) || 1), totalPages);

  const projects: ProjectRow[] = await prisma.project.findMany({
    where,
    orderBy: { displayOrder: "asc" },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    select: {
      id: true,
      title: true,
      slug: true,
      technologies: true,
      imageUrl: true,
      published: true,
    },
  });

  const pageHref = (n: number) => {
    const sp = new URLSearchParams();
    if (query) sp.set("q", query);
    if (n > 1) sp.set("page", String(n));
    const qs = sp.toString();
    return qs ? `/admin?${qs}` : "/admin";
  };

  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, total);

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Projects
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {total === 0
              ? "Nothing here yet"
              : `Showing ${rangeStart}–${rangeEnd} of ${total}`}
            {query && " matching your search"}
          </p>
        </div>
        <Link href="/admin/projects/new" className="shrink-0">
          <button type="button" className="btn px-4 sm:px-6 py-2.5 text-sm">
            + New Project
          </button>
        </Link>
      </div>

      <div className="mb-4">
        <ProjectSearch initialQuery={query} />
      </div>

      {projects.length === 0 ? (
        <div className="bg-white dark:bg-[#1f2937] rounded-xl shadow p-12 text-center">
          <p className="text-gray-400 dark:text-gray-500 text-lg">
            {query ? `No projects match “${query}”.` : "No projects yet."}
          </p>
          {!query && (
            <Link href="/admin/projects/new">
              <button type="button" className="btn mt-6 px-8 py-3 text-sm">
                Add your first project
              </button>
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-[#1f2937] rounded-xl shadow overflow-hidden">
            <ProjectList
              projects={projects}
              startOrder={(page - 1) * PAGE_SIZE}
              sortable={!query}
            />
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
            {query
              ? "Clear the search to reorder projects."
              : "Drag the handle to reorder. The order here is the order on your homepage."}
          </p>

          {totalPages > 1 && (
            <nav
              className="flex items-center justify-center gap-1 mt-6"
              aria-label="Pagination"
            >
              <PageLink
                href={pageHref(page - 1)}
                disabled={page === 1}
                label="Previous page"
              >
                ←
              </PageLink>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <Link
                  key={n}
                  href={pageHref(n)}
                  aria-current={n === page ? "page" : undefined}
                  className={`min-w-9 text-center px-3 py-1.5 rounded-md text-sm transition-colors ${
                    n === page
                      ? "bg-[#5651e5] text-white"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1f2937]"
                  }`}
                >
                  {n}
                </Link>
              ))}

              <PageLink
                href={pageHref(page + 1)}
                disabled={page === totalPages}
                label="Next page"
              >
                →
              </PageLink>
            </nav>
          )}
        </>
      )}

      <div className="mt-8 text-center">
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-[#5651e5] transition-colors"
        >
          ← Back to portfolio
        </Link>
      </div>
    </div>
  );
}

function PageLink({
  href,
  disabled,
  label,
  children,
}: {
  href: string;
  disabled: boolean;
  label: string;
  children: React.ReactNode;
}) {
  if (disabled) {
    return (
      <span
        aria-hidden="true"
        className="min-w-9 text-center px-3 py-1.5 rounded-md text-sm text-gray-300 dark:text-gray-600"
      >
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      aria-label={label}
      className="min-w-9 text-center px-3 py-1.5 rounded-md text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1f2937] transition-colors"
    >
      {children}
    </Link>
  );
}
