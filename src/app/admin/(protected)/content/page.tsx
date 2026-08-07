import Link from "next/link";
import { getSections } from "@/lib/content";
import {
  SECTION_HINTS,
  SECTION_KEYS,
  SECTION_LABELS,
} from "@/lib/content-defaults";

export default async function ContentPage() {
  const sections = await getSections();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
        Content
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-6">
        The copy for every block of the homepage.
      </p>

      <ul className="bg-white dark:bg-[#1f2937] rounded-xl shadow overflow-hidden divide-y divide-gray-100 dark:divide-gray-700">
        {SECTION_KEYS.map((key) => (
          <li key={key}>
            <Link
              href={`/admin/content/${key}`}
              className="flex items-center justify-between gap-4 px-4 py-4 hover:bg-gray-50 dark:hover:bg-[#111827] transition-colors"
            >
              <div className="min-w-0">
                <p className="font-medium text-gray-800 dark:text-white">
                  {SECTION_LABELS[key]}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {SECTION_HINTS[key]}
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 truncate mt-1">
                  {sections[key].heading || "—"}
                </p>
              </div>
              <span className="shrink-0 text-[#5651e5] text-sm">Edit →</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
