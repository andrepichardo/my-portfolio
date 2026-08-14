import type { Prisma } from "@prisma/client";

/** Cards per page in the homepage projects grid. */
export const PROJECTS_PAGE_SIZE = 4;

/** Upper bound for the `limit` query param on the public projects endpoint. */
export const PROJECTS_MAX_PAGE_SIZE = 24;

/**
 * Ordering for the public grid. `createdAt` breaks ties: without it, two rows
 * sharing a displayOrder could land on two different pages — or on none — since
 * Postgres is free to return tied rows in any order per query. Page 1 is
 * rendered by the server component and the rest by the API, so both must sort
 * identically or the pages would not line up.
 */
export const projectCardOrderBy: Prisma.ProjectOrderByWithRelationInput[] = [
  { displayOrder: "asc" },
  { createdAt: "asc" },
];

/** Fields a project card needs — keeps the payload small on every page change. */
export const projectCardSelect = {
  id: true,
  title: true,
  slug: true,
  technologies: true,
  imageUrl: true,
} as const;

/* -------------------------------------------------------------------------- */
/*  Platform filters                                                          */
/* -------------------------------------------------------------------------- */

/**
 * The chips answer "what is this project built on", not "which libraries does
 * it list". Counting library frequency instead produced nested chips — every
 * `TypeScript` project was already a `React` project, and `PHP` differed from
 * `WordPress` by a single card — and left PrestaShop with no chip at all.
 *
 * Order is priority: a project takes the first platform whose `match` appears
 * in its `techList`, so it lands in exactly one chip. The CMS platforms come
 * first because they define the work; `React / Next.js` is the fallback for
 * apps built from scratch. That is also what keeps a future WooCommerce store
 * under `WordPress` instead of forcing a judgement call.
 *
 * Adding a platform is one entry here — no schema change, no admin field.
 */
const PLATFORMS: { label: string; match: string[] }[] = [
  { label: "WordPress", match: ["WordPress"] },
  { label: "PrestaShop", match: ["PrestaShop"] },
  { label: "React / Next.js", match: ["NextJS", "React", "ReactJS"] },
];

export interface PlatformFilter {
  /** URL-safe id, used as the `platform` query param. */
  slug: string;
  /** Chip label. */
  label: string;
  /** How many published projects belong to this platform. */
  count: number;
  /** `techList` values that put a project on this platform. */
  match: string[];
  /**
   * `techList` values of the higher-priority platforms. The API has to exclude
   * these or a chip would return more projects than its own count claims — a
   * headless WordPress build listing NextJS would show up under both.
   */
  exclude: string[];
}

/** `React / Next.js` -> `react-next-js` */
export function slugifyPlatform(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Index of the platform a project belongs to, or -1 for none. */
function platformIndexFor(techList: string[]): number {
  const tech = techList.map((t) => t.trim());
  return PLATFORMS.findIndex((p) => p.match.some((m) => tech.includes(m)));
}

/**
 * Builds the chips from the projects themselves, so the counts always describe
 * the real catalogue. A project on no known platform simply gets no chip and
 * stays reachable through "All".
 *
 * Both the server component and the API build the list from the same input, for
 * the same reason `projectCardOrderBy` is shared: a chip the API cannot resolve
 * would silently return the unfiltered grid.
 */
export function buildPlatformFilters(techLists: string[][]): PlatformFilter[] {
  const counts = new Map<number, number>();

  for (const techList of techLists) {
    const index = platformIndexFor(techList);
    if (index === -1) continue;
    counts.set(index, (counts.get(index) ?? 0) + 1);
  }

  return [...counts.entries()]
    // Biggest first; ties keep the declared order, which is stable across
    // deploys in a way an alphabetical tiebreak is not.
    .sort((a, b) => b[1] - a[1] || a[0] - b[0])
    .map(([index, count]) => ({
      slug: slugifyPlatform(PLATFORMS[index].label),
      label: PLATFORMS[index].label,
      count,
      match: PLATFORMS[index].match,
      exclude: PLATFORMS.slice(0, index).flatMap((p) => p.match),
    }));
}
