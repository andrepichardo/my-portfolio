import { prisma } from "@/lib/prisma";
import {
  SECTION_DEFAULTS,
  SECTION_KEYS,
  SETTINGS_DEFAULTS,
  SKILL_DEFAULTS,
  SOCIAL_DEFAULTS,
  type SectionContent,
  type SectionKey,
  type SiteSettingsContent,
  type SkillItem,
  type SocialLinkItem,
} from "@/lib/content-defaults";

/**
 * Reads the editable site copy. Every getter falls back to the values the
 * components used to hardcode, so an empty table — or a database that is simply
 * unreachable — renders the site exactly as it looked before the CMS existed
 * instead of blanking a section.
 */

export async function getSection(key: SectionKey): Promise<SectionContent> {
  try {
    const row = await prisma.siteSection.findUnique({ where: { key } });
    if (!row) return SECTION_DEFAULTS[key];
    return { ...row, key };
  } catch {
    return SECTION_DEFAULTS[key];
  }
}

export async function getSections(): Promise<
  Record<SectionKey, SectionContent>
> {
  const result = { ...SECTION_DEFAULTS };
  try {
    const rows = await prisma.siteSection.findMany();
    for (const row of rows) {
      const key = row.key as SectionKey;
      if (SECTION_KEYS.includes(key)) result[key] = { ...row, key };
    }
  } catch {
    // Keep the defaults.
  }
  return result;
}

export async function getSkills(): Promise<SkillItem[]> {
  try {
    const rows = await prisma.skill.findMany({
      where: { published: true },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
      select: { id: true, name: true, imageUrl: true, iconSize: true },
    });
    return rows.length > 0 ? rows : SKILL_DEFAULTS;
  } catch {
    return SKILL_DEFAULTS;
  }
}

export async function getSocialLinks(): Promise<SocialLinkItem[]> {
  try {
    const rows = await prisma.socialLink.findMany({
      where: { published: true },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
      select: { id: true, label: true, url: true, icon: true },
    });
    return rows.length > 0 ? rows : SOCIAL_DEFAULTS;
  } catch {
    return SOCIAL_DEFAULTS;
  }
}

export async function getSettings(): Promise<SiteSettingsContent> {
  try {
    const row = await prisma.siteSettings.findFirst();
    if (!row) return SETTINGS_DEFAULTS;
    return {
      metaTitle: row.metaTitle,
      metaDescription: row.metaDescription,
      resumeUrl: row.resumeUrl || SETTINGS_DEFAULTS.resumeUrl,
    };
  } catch {
    return SETTINGS_DEFAULTS;
  }
}
