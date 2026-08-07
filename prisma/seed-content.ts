import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { config } from "dotenv";
import {
  SECTION_DEFAULTS,
  SECTION_KEYS,
  SETTINGS_DEFAULTS,
  SKILL_DEFAULTS,
  SOCIAL_DEFAULTS,
} from "../src/lib/content-defaults";

config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const adapter = new PrismaPg(pool as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = new PrismaClient({ adapter } as any);

/**
 * Fills the CMS tables with the copy the components used to hardcode, so the
 * site looks byte-identical the moment it starts reading from the database.
 *
 * Safe to re-run: sections upsert by key and settings by id, and the two
 * collections are only populated when empty, so it never duplicates or
 * overwrites skills and links you have edited in the admin.
 */
async function main() {
  // SEED_FORCE=1 realigns existing sections and settings back to the defaults.
  // Without it the seed never overwrites copy you have edited in the admin.
  const force = process.env.SEED_FORCE === "1";

  for (const key of SECTION_KEYS) {
    const { key: _key, ...data } = SECTION_DEFAULTS[key];
    await prisma.siteSection.upsert({
      where: { key },
      update: force ? data : {},
      create: { key, ...data },
    });
  }
  console.log(
    `✅  Sections ready (${SECTION_KEYS.length})${force ? " — forced" : ""}`
  );

  const skillCount = await prisma.skill.count();
  if (skillCount === 0) {
    await prisma.skill.createMany({
      data: SKILL_DEFAULTS.map((skill, index) => ({
        name: skill.name,
        imageUrl: skill.imageUrl,
        iconSize: skill.iconSize,
        displayOrder: index,
      })),
    });
    console.log(`✅  Seeded ${SKILL_DEFAULTS.length} skills`);
  } else {
    console.log(`↩️   Skills already present (${skillCount}), left untouched`);
  }

  const socialCount = await prisma.socialLink.count();
  if (socialCount === 0) {
    await prisma.socialLink.createMany({
      data: SOCIAL_DEFAULTS.map((link, index) => ({
        label: link.label,
        url: link.url,
        icon: link.icon,
        displayOrder: index,
      })),
    });
    console.log(`✅  Seeded ${SOCIAL_DEFAULTS.length} social links`);
  } else {
    console.log(`↩️   Social links already present (${socialCount})`);
  }

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: force ? SETTINGS_DEFAULTS : {},
    create: { id: "singleton", ...SETTINGS_DEFAULTS },
  });
  console.log("✅  Settings ready");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
