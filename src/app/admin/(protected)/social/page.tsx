import { prisma } from "@/lib/prisma";
import SocialManager, {
  type SocialRow,
} from "@/components/admin/SocialManager";

export default async function AdminSocialPage() {
  let links: SocialRow[] = [];
  try {
    links = await prisma.socialLink.findMany({
      orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
      select: {
        id: true,
        label: true,
        url: true,
        icon: true,
        published: true,
      },
    });
  } catch {
    links = [];
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
        Social links
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-6">
        One list, rendered in three places across the site.
      </p>
      <SocialManager links={links} />
    </div>
  );
}
