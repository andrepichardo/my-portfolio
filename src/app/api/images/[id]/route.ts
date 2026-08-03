import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  const image = await prisma.image.findUnique({
    where: { id },
    select: { data: true, mimeType: true },
  });

  if (!image) {
    return new NextResponse("Not found", { status: 404 });
  }

  const body = new Uint8Array(image.data);

  // Ids are content-unique and rows are never mutated, so this is safe to cache
  // forever. It is what keeps images off the database on repeat views.
  return new NextResponse(body, {
    headers: {
      "Content-Type": image.mimeType,
      "Content-Length": String(body.byteLength),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
