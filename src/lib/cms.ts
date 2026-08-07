import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { z } from "zod";

/**
 * Shared plumbing for the CMS route handlers.
 *
 * Everything editable here feeds the homepage, which is statically prerendered
 * — so every mutation has to revalidate it or the change only shows up on the
 * next deploy. Keeping that in one place is what stops a new endpoint from
 * quietly forgetting it.
 */

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

/** Paths that render CMS-managed content. */
export function revalidateSite() {
  revalidatePath("/");
  revalidatePath("/resume");
}

export function zodError(error: unknown) {
  if (error instanceof z.ZodError) {
    const first = error.errors[0];
    const where = first.path.length ? `${first.path.join(".")}: ` : "";
    return NextResponse.json(
      { error: `${where}${first.message}` },
      { status: 400 }
    );
  }
  return null;
}
