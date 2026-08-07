"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import ImageUpload from "./ImageUpload";
import {
  SECTION_FIELDS,
  SECTION_LABELS,
  type SectionContent,
} from "@/lib/content-defaults";

const input =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#5651e5] bg-white dark:bg-[#111827] dark:border-gray-600 dark:text-white transition-colors";
const label = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

function Field({
  id,
  title,
  hint,
  children,
}: {
  id: string;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className={label}>
        {title}
      </label>
      {children}
      {hint && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{hint}</p>
      )}
    </div>
  );
}

export default function SectionForm({ section }: { section: SectionContent }) {
  const router = useRouter();
  const config = SECTION_FIELDS[section.key];

  const [form, setForm] = useState({
    eyebrow: section.eyebrow,
    heading: section.heading,
    highlight: section.highlight,
    subheading: section.subheading,
    imageUrl: section.imageUrl,
    ctaLabel: section.ctaLabel,
    ctaHref: section.ctaHref,
  });
  // Paragraphs are edited one textarea each; an empty one is dropped on save.
  const [body, setBody] = useState<string[]>(
    section.body.length > 0 ? section.body : [""]
  );
  const [saving, setSaving] = useState(false);

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/content/${section.key}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success(`${SECTION_LABELS[section.key]} saved.`);
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
      <Field id="eyebrow" title="Eyebrow" hint="Small label above the heading.">
        <input
          id="eyebrow"
          title="Eyebrow"
          className={input}
          value={form.eyebrow}
          onChange={(e) => set("eyebrow")(e.target.value)}
        />
      </Field>

      <Field id="heading" title="Heading">
        <input
          id="heading"
          title="Heading"
          className={input}
          value={form.heading}
          onChange={(e) => set("heading")(e.target.value)}
        />
      </Field>

      {config.highlight && (
        <Field
          id="highlight"
          title="Highlighted words"
          hint="A piece of the heading painted in the brand colour. Must appear in the heading exactly; leave empty for none."
        >
          <input
            id="highlight"
            title="Highlighted words"
            className={input}
            value={form.highlight}
            onChange={(e) => set("highlight")(e.target.value)}
          />
        </Field>
      )}

      {config.subheading && (
        <Field
          id="subheading"
          title={section.key === "contact" ? "Name on the card" : "Second line"}
        >
          <input
            id="subheading"
            title={
              section.key === "contact" ? "Name on the card" : "Second line"
            }
            className={input}
            value={form.subheading}
            onChange={(e) => set("subheading")(e.target.value)}
          />
        </Field>
      )}

      {config.body === "single" && (
        <Field id="body-0" title="Text">
          <textarea
            id="body-0"
            title="Text"
            rows={4}
            className={`${input} resize-y`}
            value={body[0] ?? ""}
            onChange={(e) => setBody([e.target.value])}
          />
        </Field>
      )}

      {config.body === "paragraphs" && (
        <div>
          <span className={label}>Paragraphs</span>
          <div className="flex flex-col gap-3">
            {body.map((paragraph, index) => (
              <div key={index} className="flex gap-2 items-start">
                <textarea
                  rows={5}
                  aria-label={`Paragraph ${index + 1}`}
                  title={`Paragraph ${index + 1}`}
                  className={`${input} resize-y`}
                  value={paragraph}
                  onChange={(e) =>
                    setBody(
                      body.map((p, i) => (i === index ? e.target.value : p))
                    )
                  }
                />
                <button
                  type="button"
                  onClick={() => setBody(body.filter((_, i) => i !== index))}
                  disabled={body.length === 1}
                  aria-label={`Remove paragraph ${index + 1}`}
                  className="shrink-0 mt-1 px-2 py-1 text-xs rounded-md bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/40 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setBody([...body, ""])}
            className="mt-2 text-xs text-[#5651e5] hover:underline cursor-pointer"
          >
            + Add paragraph
          </button>
          {section.key === "contact" && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              The first paragraph renders as the role under your name; the rest
              follow as body text.
            </p>
          )}
        </div>
      )}

      {config.image && (
        <div>
          <span className={label}>Image</span>
          <ImageUpload
            value={form.imageUrl}
            onChange={(url) => set("imageUrl")(url)}
          />
        </div>
      )}

      {config.cta && (
        <div className="grid sm:grid-cols-2 gap-4">
          <Field id="ctaLabel" title="Link text" hint="Leave empty to hide it.">
            <input
              id="ctaLabel"
              title="Link text"
              className={input}
              value={form.ctaLabel}
              onChange={(e) => set("ctaLabel")(e.target.value)}
            />
          </Field>
          <Field id="ctaHref" title="Link target">
            <input
              id="ctaHref"
              title="Link target"
              className={input}
              placeholder="/#projects"
              value={form.ctaHref}
              onChange={(e) => set("ctaHref")(e.target.value)}
            />
          </Field>
        </div>
      )}

      <div className="flex gap-3 pt-2">
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
