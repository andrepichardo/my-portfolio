import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, revalidateSite, zodError } from "@/lib/cms";
import { socialLinkSchema } from "@/lib/cms-schemas";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;

  try {
    const data = socialLinkSchema.parse(await req.json());
    const link = await prisma.socialLink.update({ where: { id }, data });

    revalidateSite();
    return NextResponse.json(link);
  } catch (error) {
    return (
      zodError(error) ??
      NextResponse.json({ error: "Failed to update link" }, { status: 500 })
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;

  try {
    await prisma.socialLink.delete({ where: { id } });
    revalidateSite();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete link" },
      { status: 500 }
    );
  }
}
