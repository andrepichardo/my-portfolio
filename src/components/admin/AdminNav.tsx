"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin", label: "Projects" },
  { href: "/admin/content", label: "Content" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/admin/social", label: "Social" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    // No scroll container on purpose. `overflow-x-auto` would also promote the
    // Y axis to `auto`, and the active tab's `-mb-px` spills a pixel past the
    // box, which is enough for a scrollbar to appear. Wrapping instead keeps
    // both axes `visible`, so narrow screens get a second row rather than a
    // sideways scroll.
    <nav
      aria-label="Admin sections"
      className="flex flex-wrap gap-1 border-b border-gray-200 dark:border-gray-700"
    >
      {TABS.map((tab) => {
        // /admin matches only itself; the rest match their subpages too.
        const active =
          tab.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(tab.href);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`shrink-0 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              active
                ? "border-[#5651e5] text-[#5651e5]"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-[#5651e5] dark:hover:text-[#709dff]"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
