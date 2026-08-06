import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// The admin list is paginated, so the client sends the ids of the page it
// reordered plus that page's offset. displayOrder stays globally consistent.
const reorderSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
  startOrder: z.coerce.number().int().min(0).default(0),
});

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { ids, startOrder } = reorderSchema.parse(await req.json());

    // Splice the page's new order into the full list and rewrite every row, so
    // displayOrder stays a gapless 0..n-1 sequence. Writing only the page's
    // rows would let its values collide with another page's whenever the
    // existing numbers have gaps, making the order across pages unstable.
    const all = await prisma.project.findMany({
      orderBy: { displayOrder: "asc" },
      select: { id: true },
    });
    const orderedIds = all.map((project) => project.id);

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
