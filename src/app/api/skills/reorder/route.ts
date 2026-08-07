import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, revalidateSite, zodError } from "@/lib/cms";
import { reorderSchema } from "@/lib/cms-schemas";

/**
 * Skills are never paginated in the admin, so the client always sends the whole
 * list and every row is rewritten to a gapless 0..n-1 sequence in one
 * transaction.
 */
export async function PATCH(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { ids } = reorderSchema.parse(await req.json());

    const count = await prisma.skill.count();
    if (count !== ids.length) {
      return NextResponse.json(
        { error: "The list changed. Refresh and try again." },
        { status: 409 }
      );
    }

    await prisma.$transaction(
      ids.map((id, index) =>
        prisma.skill.update({ where: { id }, data: { displayOrder: index } })
      )
    );

    revalidateSite();
    return NextResponse.json({ success: true });
  } catch (error) {
    return (
      zodError(error) ??
      NextResponse.json({ error: "Failed to reorder skills" }, { status: 500 })
    );
  }
}
