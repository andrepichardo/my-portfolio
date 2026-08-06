/** Cards per page in the homepage projects grid. */
export const PROJECTS_PAGE_SIZE = 4;

/** Upper bound for the `limit` query param on the public projects endpoint. */
export const PROJECTS_MAX_PAGE_SIZE = 24;

/** Fields a project card needs — keeps the payload small on every page change. */
export const projectCardSelect = {
  id: true,
  title: true,
  slug: true,
  technologies: true,
  imageUrl: true,
} as const;
