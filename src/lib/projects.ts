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
