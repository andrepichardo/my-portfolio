"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import ImageUpload from "./ImageUpload";
import SortableList from "./SortableList";

export interface SkillRow {
  id: string;
  name: string;
  imageUrl: string;
  iconSize: number;
  published: boolean;
}

const input =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#5651e5] bg-white dark:bg-[#111827] dark:border-gray-600 dark:text-white transition-colors";
const label = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

const EMPTY = { name: "", imageUrl: "", iconSize: 64, published: true };

export default function SkillsManager({ skills }: { skills: SkillRow[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<SkillRow | null>(null);
  const [draft, setDraft] = useState(EMPTY);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const startCreate = () => {
    setEditing(null);
    setDraft(EMPTY);
    setOpen(true);
  };

  const startEdit = (skill: SkillRow) => {
    setEditing(skill);
    setDraft({
      name: skill.name,
      imageUrl: skill.imageUrl,
      iconSize: skill.iconSize,
      published: skill.published,
    });
    setOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(
        editing ? `/api/skills/${editing.id}` : "/api/skills",
        {
          method: editing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draft),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success(editing ? "Skill updated." : "Skill added.");
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

  const remove = async (skill: SkillRow) => {
    if (!confirm(`Delete “${skill.name}”?`)) return;
    try {
      const res = await fetch(`/api/skills/${skill.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Skill deleted.");
      router.refresh();
    } catch {
      toast.error("Could not delete that skill.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {skills.length} skill{skills.length === 1 ? "" : "s"} — drag to
          reorder, the homepage grid follows this order.
        </p>
        <button
          type="button"
          onClick={startCreate}
          className="btn shrink-0 px-4 py-2 text-sm"
        >
          + Add skill
        </button>
      </div>

      {open && (
        <form
          onSubmit={save}
          className="bg-white dark:bg-[#1f2937] rounded-xl shadow p-5 mb-6 flex flex-col gap-4"
        >
          <p className="font-medium text-gray-800 dark:text-white">
            {editing ? `Edit ${editing.name}` : "New skill"}
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="skill-name" className={label}>
                Name
              </label>
              <input
                id="skill-name"
                className={input}
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="skill-size" className={label}>
                Logo size (px)
              </label>
              <input
                id="skill-size"
                type="number"
                min={16}
                max={160}
                className={input}
                value={draft.iconSize}
                onChange={(e) =>
                  setDraft({ ...draft, iconSize: Number(e.target.value) })
                }
              />
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Logos are not optically equal at the same box — 64 suits most,
                the wider wordmarks look better around 32–40.
              </p>
            </div>
          </div>

          <div>
            <span className={label}>Logo</span>
            <ImageUpload
              value={draft.imageUrl}
              onChange={(url) => setDraft({ ...draft, imageUrl: url })}
            />
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
          items={skills}
          endpoint="/api/skills/reorder"
          dndId="admin-skills"
          onSaved={() => router.refresh()}
          renderItem={(skill) => (
            <>
              <div className="relative w-10 h-10 shrink-0 flex items-center justify-center">
                {skill.imageUrl && (
                  <Image
                    src={skill.imageUrl}
                    alt=""
                    width={32}
                    height={32}
                    className="object-contain"
                    unoptimized
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-800 dark:text-white truncate">
                  {skill.name}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                  {skill.iconSize}px
                </p>
              </div>
              {!skill.published && (
                <span className="shrink-0 px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                  Hidden
                </span>
              )}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => startEdit(skill)}
                  className="bg-[#5651e5] hover:bg-[#726ee7] text-white text-[13px] rounded-md px-3 py-1 cursor-pointer transition-colors"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => remove(skill)}
                  className="bg-red-500 hover:bg-red-600 text-white text-[13px] rounded-md px-3 py-1 cursor-pointer transition-colors"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        />
        {skills.length === 0 && (
          <p className="p-8 text-center text-gray-400 dark:text-gray-500">
            No skills yet.
          </p>
        )}
      </div>
    </div>
  );
}
