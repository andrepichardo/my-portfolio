import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, revalidateSite, zodError } from "@/lib/cms";
import { reorderSchema } from "@/lib/cms-schemas";

/** Same contract as the skills reorder: the full list, rewritten 0..n-1. */
export async function PATCH(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { ids } = reorderSchema.parse(await req.json());

    const count = await prisma.socialLink.count();
    if (count !== ids.length) {
      return NextResponse.json(
        { error: "The list changed. Refresh and try again." },
        { status: 409 }
      );
    }

    await prisma.$transaction(
      ids.map((id, index) =>
        prisma.socialLink.update({
          where: { id },
          data: { displayOrder: index },
        })
      )
    );

    revalidateSite();
    return NextResponse.json({ success: true });
  } catch (error) {
    return (
      zodError(error) ??
      NextResponse.json({ error: "Failed to reorder links" }, { status: 500 })
    );
  }
}
