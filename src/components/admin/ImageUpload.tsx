"use client";

import Image from "next/image";
import { useRef, useState } from "react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [showUrlField, setShowUrlField] = useState(false);

  const upload = async (file: File) => {
    setError("");
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/images", { method: "POST", body });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload failed.");
        return;
      }
      onChange(data.url);
    } catch {
      setError("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) upload(file);
  };

  return (
    <div>
      <input
        title="Input para subir imágenes"
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/avif,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
          e.target.value = "";
        }}
      />

      {value ? (
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <div className="relative w-full sm:w-56 aspect-video rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#111827] shrink-0">
            {/* unoptimized: the src may be an arbitrary URL the admin pasted,
                which would otherwise need an images.remotePatterns entry. */}
            <Image
              src={value}
              alt="Project preview"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="flex flex-col gap-2 min-w-0">
            <p className="text-xs text-gray-500 dark:text-gray-400 break-all font-mono">
              {value}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className="bg-[#5651e5] hover:bg-[#726ee7] text-white text-[13px] rounded-md px-3 py-1.5 cursor-pointer transition-colors disabled:opacity-60"
              >
                {uploading ? "Uploading..." : "Replace"}
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                className="bg-gray-500 hover:bg-gray-600 text-white text-[13px] rounded-md px-3 py-1.5 cursor-pointer transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          disabled={uploading}
          className={`w-full rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors cursor-pointer ${
            dragging
              ? "border-[#5651e5] bg-[#5651e5]/5"
              : "border-gray-300 dark:border-gray-600 hover:border-[#5651e5]"
          }`}
        >
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {uploading ? "Uploading..." : "Click to upload or drop an image"}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            PNG, JPEG, WebP, AVIF or GIF — up to 10 MB. Resized and converted to
            WebP automatically.
          </p>
        </button>
      )}

      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

      <div className="mt-2">
        <button
          type="button"
          onClick={() => setShowUrlField((prev) => !prev)}
          className="text-xs text-gray-500 hover:text-[#5651e5] cursor-pointer transition-colors"
        >
          {showUrlField ? "Hide URL field" : "Or enter a path/URL manually"}
        </button>
        {showUrlField && (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            title="Image path or URL"
            placeholder="/projects/thoughthub.png"
            className="w-full mt-2 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#5651e5] bg-white dark:bg-[#111827] dark:border-gray-600 dark:text-white transition-colors"
          />
        )}
      </div>
    </div>
  );
}
