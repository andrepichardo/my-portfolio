// prisma.config.ts - Prisma 7 configuration
// This file is excluded from Next.js TypeScript checks (see tsconfig.json)
import path from "node:path";
import { defineConfig } from "prisma/config";
import { config } from "dotenv";

config({ path: path.resolve(process.cwd(), ".env") });

export default defineConfig({
  schema: "./prisma/schema.prisma",
  migrations: {
    seed: "npx tsx ./prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
} as Parameters<typeof defineConfig>[0]);
