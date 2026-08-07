import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, revalidateSite, zodError } from "@/lib/cms";
import { skillSchema } from "@/lib/cms-schemas";

export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const data = skillSchema.parse(await req.json());

    // Ordering is drag-managed, so new skills land at the end.
    const last = await prisma.skill.findFirst({
      orderBy: { displayOrder: "desc" },
      select: { displayOrder: true },
    });

    const skill = await prisma.skill.create({
      data: { ...data, displayOrder: (last?.displayOrder ?? -1) + 1 },
    });

    revalidateSite();
    return NextResponse.json(skill, { status: 201 });
  } catch (error) {
    return (
      zodError(error) ??
      NextResponse.json({ error: "Failed to create skill" }, { status: 500 })
    );
  }
}
