"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import type { SiteSettingsContent } from "@/lib/content-defaults";

const input =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#5651e5] bg-white dark:bg-[#111827] dark:border-gray-600 dark:text-white transition-colors";
const label = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

export default function SettingsForm({
  settings,
}: {
  settings: SiteSettingsContent;
}) {
  const router = useRouter();
  const [form, setForm] = useState(settings);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("Settings saved.");
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof Error && err.message ? err.message : "Could not save."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label htmlFor="metaTitle" className={label}>
          Browser title
        </label>
        <input
          id="metaTitle"
          className={input}
          value={form.metaTitle}
          onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
        />
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Shown in the tab and in search results. The resume page reuses the
          part before the “|”.
        </p>
      </div>

      <div>
        <label htmlFor="metaDescription" className={label}>
          Meta description
        </label>
        <textarea
          id="metaDescription"
          rows={3}
          className={`${input} resize-y`}
          value={form.metaDescription}
          onChange={(e) =>
            setForm({ ...form, metaDescription: e.target.value })
          }
        />
      </div>

      <div>
        <label htmlFor="resumeUrl" className={label}>
          Resume PDF
        </label>
        <input
          id="resumeUrl"
          className={input}
          placeholder="/Resume-André-Pichardo.pdf"
          value={form.resumeUrl}
          onChange={(e) => setForm({ ...form, resumeUrl: e.target.value })}
        />
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Path or URL behind the download button on /resume. Files in{" "}
          <code>public/</code> are served from the site root.
        </p>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={saving}
          className="btn px-8 py-2.5 text-sm disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
