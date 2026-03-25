import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Use only the lightweight config in middleware (Edge Runtime compatible)
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: ["/admin/((?!login).*)"],
};
