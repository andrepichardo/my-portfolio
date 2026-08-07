import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, revalidateSite, zodError } from "@/lib/cms";
import { SECTION_KEYS, type SectionKey } from "@/lib/content-defaults";
import { sectionSchema } from "@/lib/cms-schemas";

interface RouteParams {
  params: Promise<{ key: string }>;
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { key } = await params;
  if (!SECTION_KEYS.includes(key as SectionKey)) {
    return NextResponse.json({ error: "Unknown section" }, { status: 404 });
  }

  try {
    const data = sectionSchema.parse(await req.json());
    const body = data.body.map((p) => p.trim()).filter(Boolean);

    const section = await prisma.siteSection.upsert({
      where: { key },
      update: { ...data, body },
      create: { key, ...data, body },
    });

    revalidateSite();
    return NextResponse.json(section);
  } catch (error) {
    return (
      zodError(error) ??
      NextResponse.json({ error: "Failed to save section" }, { status: 500 })
    );
  }
}
