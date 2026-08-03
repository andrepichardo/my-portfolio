import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { displayOrder: "asc" },
    });
    return NextResponse.json(projects);
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
