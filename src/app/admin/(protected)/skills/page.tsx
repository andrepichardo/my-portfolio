import { prisma } from "@/lib/prisma";
import SkillsManager, {
  type SkillRow,
} from "@/components/admin/SkillsManager";

export default async function AdminSkillsPage() {
  let skills: SkillRow[] = [];
  try {
    skills = await prisma.skill.findMany({
      orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
      select: {
        id: true,
        name: true,
        imageUrl: true,
        iconSize: true,
        published: true,
      },
    });
  } catch {
    skills = [];
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
        Skills
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-6">
        The logo grid in the Skills section.
      </p>
      <SkillsManager skills={skills} />
    </div>
  );
}
