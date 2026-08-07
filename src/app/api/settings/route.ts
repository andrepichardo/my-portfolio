import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, revalidateSite, zodError } from "@/lib/cms";
import { settingsSchema } from "@/lib/cms-schemas";

export async function PUT(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const data = settingsSchema.parse(await req.json());

    const settings = await prisma.siteSettings.upsert({
      where: { id: "singleton" },
      update: data,
      create: { id: "singleton", ...data },
    });

    revalidateSite();
    return NextResponse.json(settings);
  } catch (error) {
    return (
      zodError(error) ??
      NextResponse.json({ error: "Failed to save settings" }, { status: 500 })
    );
  }
}
