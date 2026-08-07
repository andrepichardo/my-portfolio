import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Two ways to reorder, both ending in the same rewrite so displayOrder stays a
// gapless 0..n-1 sequence:
//
//   { ids, startOrder }  drag-and-drop, sends the ids of one admin page plus
//                        that page's offset into the full list;
//   { id, position }     "move to position", used to send a project to a slot
//                        that may live on a different page than the one shown.
const pageReorderSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
  startOrder: z.coerce.number().int().min(0).default(0),
});

const moveSchema = z.object({
  id: z.string().min(1),
  position: z.coerce.number().int().min(1),
});

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    // The whole ordered list, because both operations rewrite every row.
    // Writing only some rows would let values collide across pages.
    const all = await prisma.project.findMany({
      orderBy: { displayOrder: "asc" },
      select: { id: true },
    });
    const orderedIds = all.map((project) => project.id);

    if (Array.isArray((body as { ids?: unknown }).ids)) {
      const { ids, startOrder } = pageReorderSchema.parse(body);

      const slice = orderedIds.slice(startOrder, startOrder + ids.length);
      const sameSet =
        slice.length === ids.length && ids.every((id) => slice.includes(id));

      if (!sameSet) {
        return NextResponse.json(
          { error: "The project list changed. Refresh and try again." },
          { status: 409 }
        );
      }

      orderedIds.splice(startOrder, ids.length, ...ids);
    } else {
      const { id, position } = moveSchema.parse(body);

      const from = orderedIds.indexOf(id);
      if (from === -1) {
        return NextResponse.json(
          { error: "That project no longer exists. Refresh and try again." },
          { status: 404 }
        );
      }

      // Positions are 1-based in the UI and clamped here, so a stale list in
      // the browser can't push a project past either end.
      const to = Math.min(Math.max(0, position - 1), orderedIds.length - 1);
      if (to !== from) {
        orderedIds.splice(from, 1);
        orderedIds.splice(to, 0, id);
      }
    }

    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.project.update({
          where: { id },
          data: { displayOrder: index },
        })
      )
    );

    // Reordering only changes the homepage grid, but that page is static.
    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to reorder projects" },
      { status: 500 }
    );
  }
}
