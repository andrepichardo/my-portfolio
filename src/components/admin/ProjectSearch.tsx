"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProjectSearch({
  initialQuery,
}: {
  initialQuery: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);

  useEffect(() => {
    // Skip the initial render, and reset to page 1 on every new search.
    if (value === initialQuery) return;

    const timeout = setTimeout(() => {
      const query = value.trim();
      router.replace(query ? `/admin?q=${encodeURIComponent(query)}` : "/admin");
    }, 300);

    return () => clearTimeout(timeout);
  }, [value, initialQuery, router]);

  return (
    <div className="relative">
      <label htmlFor="project-search" className="sr-only">
        Search projects
      </label>
      <input
        id="project-search"
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search by title, slug or technology..."
        className="w-full sm:w-80 border border-gray-300 dark:border-gray-600 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-[#5651e5] bg-white dark:bg-[#1f2937] dark:text-white transition-colors"
      />
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        width="15"
        height="15"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M11 11L14 14"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
