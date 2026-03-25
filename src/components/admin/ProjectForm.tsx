"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ProjectData {
  id?: string;
  title: string;
  slug: string;
  description: string;
  technologies: string;
  techList: string;
  imageUrl: string;
  demoUrl: string;
  codeUrl: string;
  note: string;
  displayOrder: number;
  published: boolean;
}

interface ProjectFormProps {
  initialData?: ProjectData;
  mode: "create" | "edit";
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ProjectForm({ initialData, mode }: ProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<ProjectData>({
    title: initialData?.title ?? "",
    slug: initialData?.slug ?? "",
    description: initialData?.description ?? "",
    technologies: initialData?.technologies ?? "",
    techList: initialData?.techList ?? "",
    imageUrl: initialData?.imageUrl ?? "",
    demoUrl: initialData?.demoUrl ?? "",
    codeUrl: initialData?.codeUrl ?? "",
    note: initialData?.note ?? "",
    displayOrder: initialData?.displayOrder ?? 0,
    published: initialData?.published ?? true,
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: mode === "create" ? generateSlug(title) : prev.slug,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const url =
        mode === "edit"
          ? `/api/projects/${initialData?.id}`
          : "/api/projects";
      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#5651e5] bg-white dark:bg-[#111827] dark:border-gray-600 dark:text-white transition-colors";

  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Title *</label>
          <input
            name="title"
            type="text"
            required
            value={formData.title}
            onChange={handleTitleChange}
            className={inputClass}
            placeholder="ThoughtHub"
          />
        </div>
        <div>
          <label className={labelClass}>Slug *</label>
          <input
            name="slug"
            type="text"
            required
            value={formData.slug}
            onChange={handleChange}
            className={inputClass}
            placeholder="thoughthub"
          />
          <p className="text-xs text-gray-500 mt-1">
            URL: /projects/{formData.slug || "..."}
          </p>
        </div>
      </div>

      <div>
        <label className={labelClass}>Description *</label>
        <textarea
          name="description"
          required
          rows={4}
          value={formData.description}
          onChange={handleChange}
          className={`${inputClass} resize-none`}
          placeholder="A fullstack app built with..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Technologies (for card display) *</label>
          <input
            name="technologies"
            type="text"
            required
            value={formData.technologies}
            onChange={handleChange}
            className={inputClass}
            placeholder="NextJS | PostgreSQL | Prisma"
          />
          <p className="text-xs text-gray-500 mt-1">
            Shown on the project card. Use | as separator.
          </p>
        </div>
        <div>
          <label className={labelClass}>Tech List (for detail page) *</label>
          <input
            name="techList"
            type="text"
            required
            value={formData.techList}
            onChange={handleChange}
            className={inputClass}
            placeholder="NextJS, Tailwind, PostgreSQL, Prisma"
          />
          <p className="text-xs text-gray-500 mt-1">
            Full list. Comma separated.
          </p>
        </div>
      </div>

      <div>
        <label className={labelClass}>Image URL *</label>
        <input
          name="imageUrl"
          type="text"
          required
          value={formData.imageUrl}
          onChange={handleChange}
          className={inputClass}
          placeholder="/projects/thoughthub.png"
        />
        <p className="text-xs text-gray-500 mt-1">
          Path from /public (e.g. /projects/image.png) or full URL.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Demo URL</label>
          <input
            name="demoUrl"
            type="text"
            value={formData.demoUrl}
            onChange={handleChange}
            className={inputClass}
            placeholder="https://my-app.vercel.app"
          />
        </div>
        <div>
          <label className={labelClass}>Code URL</label>
          <input
            name="codeUrl"
            type="text"
            value={formData.codeUrl}
            onChange={handleChange}
            className={inputClass}
            placeholder="https://github.com/andrepichardo/..."
          />
          <p className="text-xs text-gray-500 mt-1">
            Leave empty if private/no repo.
          </p>
        </div>
      </div>

      <div>
        <label className={labelClass}>Note (optional)</label>
        <textarea
          name="note"
          rows={2}
          value={formData.note}
          onChange={handleChange}
          className={`${inputClass} resize-none`}
          placeholder="The repository is private, since it belongs to..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-end">
        <div>
          <label className={labelClass}>Display Order</label>
          <input
            name="displayOrder"
            type="number"
            min={0}
            value={formData.displayOrder}
            onChange={handleChange}
            className={inputClass}
          />
          <p className="text-xs text-gray-500 mt-1">
            Lower = shows first on homepage.
          </p>
        </div>
        <div className="flex items-center gap-3 pb-1">
          <input
            id="published"
            name="published"
            type="checkbox"
            checked={formData.published}
            onChange={handleChange}
            className="w-4 h-4 accent-[#5651e5]"
          />
          <label
            htmlFor="published"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
          >
            Published (visible on homepage)
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 transition-all disabled:opacity-60"
        >
          {loading
            ? "Saving..."
            : mode === "create"
            ? "Create Project"
            : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin")}
          style={{
            background: "none",
            backgroundImage: "none",
            backgroundColor: "#6b7280",
            boxShadow: "none",
            borderRadius: "12px",
            padding: "12px 24px",
            color: "white",
            textTransform: "uppercase",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
