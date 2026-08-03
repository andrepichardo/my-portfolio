"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteProjectButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete project.");
      }
    } catch {
      alert("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className={`text-white text-[13px] rounded-md px-3 py-1 transition-colors ${
        loading
          ? "bg-red-300 opacity-70 cursor-not-allowed"
          : "bg-red-500 hover:bg-red-600 cursor-pointer"
      }`}
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}
