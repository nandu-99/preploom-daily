"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const groups = [
  {
    title: "Searching",
    lessons: [
      { title: "Binary search", href: "/dsa/visualizations/binary-search" },
    ],
  },
  {
    title: "Sorting",
    lessons: [
      { title: "Bubble sort", href: "/dsa/visualizations/bubble-sort" },
    ],
  },
];

export function VisualizationNav() {
  const pathname = usePathname();

  return (
    <nav className="mt-5 space-y-5" aria-label="Algorithms">
      {groups.map((group) => (
        <div key={group.title}>
          <p className="px-3 text-xs text-neutral-500 dark:text-neutral-400">
            {group.title}
          </p>
          {group.lessons.map((lesson) => {
            const active = pathname === lesson.href;
            return (
              <Link
                key={lesson.href}
                href={lesson.href}
                aria-current={active ? "page" : undefined}
                className={`mt-2 block rounded-lg px-3 py-3 text-sm ${active ? "bg-neutral-200/70 font-medium dark:bg-neutral-800" : "text-neutral-600 hover:bg-black/5 dark:text-neutral-400 dark:hover:bg-white/5"}`}
              >
                {lesson.title}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
