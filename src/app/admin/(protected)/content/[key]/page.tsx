import Link from "next/link";
import { notFound } from "next/navigation";
import { getSection } from "@/lib/content";
import {
  SECTION_HINTS,
  SECTION_KEYS,
  SECTION_LABELS,
  type SectionKey,
} from "@/lib/content-defaults";
import SectionForm from "@/components/admin/SectionForm";

interface Props {
  params: Promise<{ key: string }>;
}

export default async function EditSectionPage({ params }: Props) {
  const { key } = await params;
  if (!SECTION_KEYS.includes(key as SectionKey)) notFound();

  const sectionKey = key as SectionKey;
  const section = await getSection(sectionKey);

  return (
    <div>
      <Link
        href="/admin/content"
        className="text-sm text-gray-500 hover:text-[#5651e5] transition-colors"
      >
        ← Content
      </Link>

      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mt-3">
        {SECTION_LABELS[sectionKey]}
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-6">
        {SECTION_HINTS[sectionKey]}
      </p>

      <div className="bg-white dark:bg-[#1f2937] rounded-xl shadow p-5 sm:p-6">
        <SectionForm section={section} />
      </div>
    </div>
  );
}
