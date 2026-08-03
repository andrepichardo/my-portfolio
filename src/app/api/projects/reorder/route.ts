import { NextRequest, NextResponse } from "next/server";
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

    await prisma.$transaction(
      ids.map((id, index) =>
        prisma.project.update({
          where: { id },
          data: { displayOrder: startOrder + index },
        })
      )
    );

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
