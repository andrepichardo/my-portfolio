import ProjectForm from "@/components/admin/ProjectForm";
import Link from "next/link";

export const metadata = {
  title: "New Project | Admin",
};

export default function NewProjectPage() {
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
          New Project
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Add a new project to your portfolio.
        </p>
      </div>

      <div className="bg-white dark:bg-[#1f2937] rounded-xl shadow p-6 md:p-8">
        <ProjectForm mode="create" />
      </div>
    </div>
  );
}
