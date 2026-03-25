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
      style={{
        background: "none",
        backgroundImage: "none",
        backgroundColor: loading ? "#fca5a5" : "#ef4444",
        boxShadow: "none",
        borderRadius: "6px",
        padding: "4px 12px",
        color: "white",
        fontSize: "13px",
        textTransform: "none",
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.7 : 1,
      }}
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}
