import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, revalidateSite, zodError } from "@/lib/cms";
import { socialLinkSchema } from "@/lib/cms-schemas";

export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const data = socialLinkSchema.parse(await req.json());

    const last = await prisma.socialLink.findFirst({
      orderBy: { displayOrder: "desc" },
      select: { displayOrder: true },
    });

    const link = await prisma.socialLink.create({
      data: { ...data, displayOrder: (last?.displayOrder ?? -1) + 1 },
    });

    revalidateSite();
    return NextResponse.json(link, { status: 201 });
  } catch (error) {
    return (
      zodError(error) ??
      NextResponse.json({ error: "Failed to create link" }, { status: 500 })
    );
  }
}
