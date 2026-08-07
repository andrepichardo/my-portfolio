"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import SortableList from "./SortableList";
import SocialIcon from "../SocialIcon";
import { SOCIAL_ICONS } from "@/lib/content-defaults";

export interface SocialRow {
  id: string;
  label: string;
  url: string;
  icon: string;
  published: boolean;
}

const input =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#5651e5] bg-white dark:bg-[#111827] dark:border-gray-600 dark:text-white transition-colors";
const label = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

const EMPTY = { label: "", url: "", icon: "website", published: true };

export default function SocialManager({ links }: { links: SocialRow[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<SocialRow | null>(null);
  const [draft, setDraft] = useState(EMPTY);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const startEdit = (link: SocialRow) => {
    setEditing(link);
    setDraft({
      label: link.label,
      url: link.url,
      icon: link.icon,
      published: link.published,
    });
    setOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(
        editing ? `/api/social/${editing.id}` : "/api/social",
        {
          method: editing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draft),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success(editing ? "Link updated." : "Link added.");
      setOpen(false);
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof Error && err.message ? err.message : "Could not save."
      );
    } finally {
      setSaving(false);
    }
  };

  const remove = async (link: SocialRow) => {
    if (!confirm(`Delete “${link.label}”?`)) return;
    try {
      const res = await fetch(`/api/social/${link.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Link deleted.");
      router.refresh();
    } catch {
      toast.error("Could not delete that link.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          These render in the hero, the mobile menu and the contact card.
        </p>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setDraft(EMPTY);
            setOpen(true);
          }}
          className="btn shrink-0 px-4 py-2 text-sm"
        >
          + Add link
        </button>
      </div>

      {open && (
        <form
          onSubmit={save}
          className="bg-white dark:bg-[#1f2937] rounded-xl shadow p-5 mb-6 flex flex-col gap-4"
        >
          <p className="font-medium text-gray-800 dark:text-white">
            {editing ? `Edit ${editing.label}` : "New link"}
          </p>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="link-label" className={label}>
                Label
              </label>
              <input
                id="link-label"
                className={input}
                placeholder="LinkedIn"
                value={draft.label}
                onChange={(e) => setDraft({ ...draft, label: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="link-url" className={label}>
                URL
              </label>
              <input
                id="link-url"
                className={input}
                placeholder="https://…  or  /#contact"
                value={draft.url}
                onChange={(e) => setDraft({ ...draft, url: e.target.value })}
              />
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Anything starting with / stays in the site; the rest opens in a
                new tab.
              </p>
            </div>
            <div>
              <label htmlFor="link-icon" className={label}>
                Icon
              </label>
              <select
                id="link-icon"
                className={input}
                value={draft.icon}
                onChange={(e) => setDraft({ ...draft, icon: e.target.value })}
              >
                {SOCIAL_ICONS.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                Preview
                <SocialIcon
                  icon={draft.icon}
                  className="w-4 h-4 text-blue-800 dark:text-[#709dff]"
                />
              </div>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer w-fit">
            <input
              type="checkbox"
              checked={draft.published}
              onChange={(e) =>
                setDraft({ ...draft, published: e.target.checked })
              }
            />
            Visible on the site
          </label>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="btn px-6 py-2 text-sm disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-6 py-2 text-sm rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white dark:bg-[#1f2937] rounded-xl shadow overflow-hidden">
        <SortableList
          items={links}
          endpoint="/api/social/reorder"
          dndId="admin-social"
          onSaved={() => router.refresh()}
          renderItem={(link) => (
            <>
              <div className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-gray-100 dark:bg-[#111827]">
                <SocialIcon
                  icon={link.icon}
                  className="w-4 h-4 text-blue-800 dark:text-[#709dff]"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-800 dark:text-white truncate">
                  {link.label}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 truncate font-mono">
                  {link.url}
                </p>
              </div>
              {!link.published && (
                <span className="shrink-0 px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                  Hidden
                </span>
              )}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => startEdit(link)}
                  className="bg-[#5651e5] hover:bg-[#726ee7] text-white text-[13px] rounded-md px-3 py-1 cursor-pointer transition-colors"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => remove(link)}
                  className="bg-red-500 hover:bg-red-600 text-white text-[13px] rounded-md px-3 py-1 cursor-pointer transition-colors"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        />
        {links.length === 0 && (
          <p className="p-8 text-center text-gray-400 dark:text-gray-500">
            No links yet.
          </p>
        )}
      </div>
    </div>
  );
}
