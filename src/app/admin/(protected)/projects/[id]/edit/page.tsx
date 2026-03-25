import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProjectForm from "@/components/admin/ProjectForm";
import Link from "next/link";

export const metadata = {
  title: "Edit Project | Admin",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });

  if (!project) notFound();

  const initialData = {
    id: project.id,
    title: project.title,
    slug: project.slug,
    description: project.description,
    technologies: project.technologies,
    techList: project.techList.join(", "),
    imageUrl: project.imageUrl,
    demoUrl: project.demoUrl ?? "",
    codeUrl: project.codeUrl ?? "",
    note: project.note ?? "",
    displayOrder: project.displayOrder,
    published: project.published,
  };

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin"
          className="text-sm text-gray-500 hover:text-[#5651e5] transition-colors"
        >
          ← Back to projects
        </Link>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mt-3">
          Edit: {project.title}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Update your project information.
        </p>
      </div>

      <div className="bg-white dark:bg-[#1f2937] rounded-xl shadow p-6 md:p-8">
        <ProjectForm mode="edit" initialData={initialData} />
      </div>
    </div>
  );
}
