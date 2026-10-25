"use client";

import { PrepLoomLogo } from "@/components/preploom-logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LogOut } from "lucide-react";
import Link from "next/link";

export function AdminHeader({ onLogout }: { onLogout?: () => void }) {
  return (
    <header className="border-b border-black/[0.08] bg-[#f7f7f5]/92 backdrop-blur-xl dark:border-white/[0.09] dark:bg-[#0a0a0a]/92">
      <div className="mx-auto flex h-[68px] max-w-[1440px] items-center gap-4 px-5 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="PrepLoom home"
          className="rounded-[10px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:focus-visible:ring-white/50"
        >
          <PrepLoomLogo preload className="h-8 w-[112px]" />
        </Link>
        <span
          className="h-5 w-px bg-black/[0.12] dark:bg-white/[0.13]"
          aria-hidden="true"
        />
        <span className="text-[13px] font-medium text-[#606060] dark:text-[#a8a8a8]">
          Admin
        </span>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          {onLogout ? (
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-black/[0.11] px-3 text-[13px] font-medium text-[#555] transition-colors hover:border-black/25 hover:bg-black/[0.04] hover:text-[#151515] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:border-white/[0.12] dark:text-[#b3b3b3] dark:hover:border-white/25 dark:hover:bg-white/[0.06] dark:hover:text-white dark:focus-visible:ring-white/50"
            >
              <LogOut className="size-4" strokeWidth={1.7} aria-hidden="true" />
              <span className="hidden sm:inline">Log out</span>
              <span className="sr-only sm:hidden">Log out</span>
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
