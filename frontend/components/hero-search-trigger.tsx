"use client";

import { useCommandSearch } from "@/components/command-search-provider";
import { Search } from "lucide-react";

export function HeroSearchTrigger() {
  const { openSearch, searchOpen } = useCommandSearch();

  return (
    <button
      type="button"
      onClick={openSearch}
      className="group flex h-12 w-full items-center gap-3 rounded-[10px] border border-black/10 bg-background/85 px-3.5 text-left font-[family-name:var(--font-inter)] shadow-[0_8px_24px_rgba(0,0,0,0.05)] backdrop-blur-sm transition-[border-color,box-shadow] hover:border-black/20 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:border-white/[0.12] dark:shadow-[0_8px_28px_rgba(0,0,0,0.28)] dark:hover:border-white/20 dark:focus-visible:ring-white/50 sm:h-14 sm:rounded-xl sm:px-4"
      aria-label="Search PrepLoom"
      aria-expanded={searchOpen}
      aria-controls="preploom-command-search"
    >
      <Search
        aria-hidden="true"
        className="size-[18px] shrink-0 text-[#7C7C7C] transition-colors group-hover:text-foreground"
      />
      <span className="min-w-0 flex-1 truncate text-[13px] font-normal text-[#7C7C7C] sm:text-[15px]">
        <span className="sm:hidden">Search PrepLoom</span>
        <span className="hidden sm:inline">
          Search subjects, topics, or questions
        </span>
      </span>
      <kbd className="hidden shrink-0 rounded-md border border-black/10 bg-black/[0.035] px-1.5 py-0.5 text-[10px] font-medium text-[#7C7C7C] dark:border-white/10 dark:bg-white/[0.06] sm:block">
        ⌘ K
      </kbd>
    </button>
  );
}
