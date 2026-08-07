import { getSettings } from "@/lib/content";
import SettingsForm from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
        Settings
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-6">
        Site-wide metadata and the downloadable resume.
      </p>

      <div className="bg-white dark:bg-[#1f2937] rounded-xl shadow p-5 sm:p-6 max-w-2xl">
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}
