import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  PROJECTS_MAX_PAGE_SIZE,
  PROJECTS_PAGE_SIZE,
  projectCardOrderBy,
  projectCardSelect,
} from "@/lib/projects";
import { z } from "zod";

const projectSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  technologies: z.string().min(1),
  techList: z.string().min(1),
  imageUrl: z.string().min(1),
  demoUrl: z.string().optional().default(""),
  codeUrl: z.string().optional().default(""),
  note: z.string().optional().default(""),
  published: z.boolean().default(true),
});

/**
 * Public, paginated feed for the homepage grid. Only published projects and
 * only the fields a card needs, so a page change stays a small payload.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    const limit = Math.min(
      Math.max(1, Number(searchParams.get("limit")) || PROJECTS_PAGE_SIZE),
      PROJECTS_MAX_PAGE_SIZE
    );

    const where = { published: true };
    const total = await prisma.project.count({ where });
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const page = Math.min(
      Math.max(1, Number(searchParams.get("page")) || 1),
      totalPages
    );

    const projects = await prisma.project.findMany({
      where,
      orderBy: projectCardOrderBy,
      skip: (page - 1) * limit,
      take: limit,
      select: projectCardSelect,
    });

    return NextResponse.json({ projects, page, totalPages, total });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = projectSchema.parse(body);

    // Ordering is managed by drag-and-drop, so new projects go to the end.
    const last = await prisma.project.findFirst({
      orderBy: { displayOrder: "desc" },
      select: { displayOrder: true },
    });

    const project = await prisma.project.create({
      data: {
        ...data,
        displayOrder: (last?.displayOrder ?? -1) + 1,
        techList: data.techList
          .split(",")
          .map((t: string) => t.trim())
          .filter(Boolean),
        demoUrl: data.demoUrl || null,
        codeUrl: data.codeUrl || null,
        note: data.note || null,
      },
    });

    // The homepage is statically rendered, so it would keep serving the old
    // project list until the next deploy unless we revalidate it here.
    revalidatePath("/");

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
