import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import DeleteProjectButton from '@/components/admin/DeleteProjectButton';

export default async function AdminPage() {
  const projects = await prisma.project.findMany({
    orderBy: { displayOrder: 'asc' },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Projects
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {projects.length} project{projects.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <Link href="/admin/projects/new">
          <button className="px-6 py-2.5 text-sm">+ New Project</button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white dark:bg-[#1f2937] rounded-xl shadow p-12 text-center">
          <p className="text-gray-400 dark:text-gray-500 text-lg">
            No projects yet.
          </p>
          <Link href="/admin/projects/new">
            <button className="mt-6 px-8 py-3 text-sm">
              Add your first project
            </button>
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#1f2937] rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-[#111827] border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="text-left px-6 py-3 text-gray-500 dark:text-gray-400 font-medium w-10">
                  #
                </th>
                <th className="text-left px-6 py-3 text-gray-500 dark:text-gray-400 font-medium">
                  Title
                </th>
                <th className="text-left px-6 py-3 text-gray-500 dark:text-gray-400 font-medium hidden md:table-cell">
                  Slug
                </th>
                <th className="text-left px-6 py-3 text-gray-500 dark:text-gray-400 font-medium hidden lg:table-cell">
                  Technologies
                </th>
                <th className="text-center px-6 py-3 text-gray-500 dark:text-gray-400 font-medium">
                  Status
                </th>
                <th className="text-right px-6 py-3 text-gray-500 dark:text-gray-400 font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {projects.map((project) => (
                <tr
                  key={project.id}
                  className="hover:bg-gray-50 dark:hover:bg-[#111827] transition-colors"
                >
                  <td className="px-6 py-4 text-gray-400 dark:text-gray-500">
                    {project.displayOrder}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-800 dark:text-white">
                      {project.title}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 hidden md:table-cell font-mono text-xs">
                    {project.slug}
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 hidden lg:table-cell max-w-50 truncate">
                    {project.technologies}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        project.published
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                      }`}
                    >
                      {project.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/projects/${project.id}/edit`}>
                        <button
                          style={{
                            background: 'none',
                            backgroundImage: 'none',
                            backgroundColor: '#5651e5',
                            boxShadow: 'none',
                            borderRadius: '6px',
                            padding: '4px 12px',
                            color: 'white',
                            fontSize: '13px',
                            textTransform: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          Edit
                        </button>
                      </Link>
                      <DeleteProjectButton id={project.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}

      <div className="mt-6 text-center">
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-[#5651e5] transition-colors"
        >
          ← Back to portfolio
        </Link>
      </div>
    </div>
  );
}
