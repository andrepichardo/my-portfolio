import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, revalidateSite, zodError } from "@/lib/cms";
import { skillSchema } from "@/lib/cms-schemas";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;

  try {
    const data = skillSchema.parse(await req.json());
    const skill = await prisma.skill.update({ where: { id }, data });

    revalidateSite();
    return NextResponse.json(skill);
  } catch (error) {
    return (
      zodError(error) ??
      NextResponse.json({ error: "Failed to update skill" }, { status: 500 })
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;

  try {
    await prisma.skill.delete({ where: { id } });
    revalidateSite();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete skill" },
      { status: 500 }
    );
  }
}
