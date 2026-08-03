import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Images live in Postgres, so they get resized and re-encoded to WebP before
// being stored. A 2 MB screenshot typically lands under 200 KB this way.
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const MAX_WIDTH = 1600;
const ACCEPTED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/avif",
  "image/gif",
];

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let file: FormDataEntryValue | null;
  try {
    const formData = await req.formData();
    file = formData.get("file");
  } catch {
    return NextResponse.json(
      { error: "Expected multipart form data." },
      { status: 400 }
    );
  }

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  if (!ACCEPTED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Use a PNG, JPEG, WebP, AVIF or GIF image." },
      { status: 400 }
    );
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { error: "That image is over 10 MB. Try a smaller one." },
      { status: 400 }
    );
  }

  try {
    const input = Buffer.from(await file.arrayBuffer());
    const data = await sharp(input)
      .rotate() // honour EXIF orientation before we strip metadata
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    const { width = 0, height = 0 } = await sharp(data).metadata();

    const image = await prisma.image.create({
      data: {
        // Copy into a plain Uint8Array: Prisma's Bytes field does not accept
        // Buffer's wider ArrayBufferLike backing type.
        data: new Uint8Array(data),
        mimeType: "image/webp",
        width,
        height,
        size: data.length,
      },
      select: { id: true, width: true, height: true, size: true },
    });

    return NextResponse.json(
      { ...image, url: `/api/images/${image.id}` },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Could not process that image." },
      { status: 500 }
    );
  }
}
