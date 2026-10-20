"use client";

import { useCommandSearch } from "@/components/command-search-provider";
import { PrepLoomLogo } from "@/components/preploom-logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  BookOpen,
  Braces,
  Code2,
  Menu,
  MessageSquareText,
  Route,
  Search,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigation = [
  { label: "Subjects", href: "/subjects", icon: BookOpen },
  {
    label: "Interview Questions",
    href: "/interview-questions",
    icon: MessageSquareText,
  },
  { label: "Roadmaps", href: "/roadmaps", icon: Route },
  { label: "WebDev", href: "/webdev", icon: Code2 },
  { label: "DSA", href: "/dsa", icon: Braces },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { openSearch, searchOpen } = useCommandSearch();

  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.08] bg-[#f7f7f5]/92 font-[family-name:var(--font-geist-sans)] backdrop-blur-xl dark:border-white/[0.09] dark:bg-[#0a0a0a]/92">
      <div className="mx-auto flex h-[68px] max-w-[1440px] items-center gap-5 px-5 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="PrepLoom home"
          className="shrink-0 rounded-[10px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:focus-visible:ring-white/50"
        >
          <PrepLoomLogo preload className="h-8 w-[112px]" />
        </Link>

        <nav
          aria-label="Primary navigation"
          className="ml-5 hidden items-center gap-1 xl:flex"
        >
          {navigation.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`rounded-[8px] px-3 py-2 text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:focus-visible:ring-white/50 ${active ? "bg-black/[0.06] font-medium text-[#151515] dark:bg-white/[0.08] dark:text-white" : "text-[#606060] hover:bg-black/[0.035] hover:text-[#151515] dark:text-[#a8a8a8] dark:hover:bg-white/[0.05] dark:hover:text-white"}`}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={openSearch}
            aria-label="Search PrepLoom"
            aria-expanded={searchOpen}
            className="grid size-10 place-items-center rounded-[10px] border border-black/[0.11] text-[#555] hover:border-black/25 dark:border-white/[0.12] dark:text-[#b3b3b3] sm:hidden"
          >
            <Search
              className="size-[18px]"
              strokeWidth={1.7}
              aria-hidden="true"
            />
          </button>
          <button
            type="button"
            onClick={openSearch}
            aria-expanded={searchOpen}
            className="group hidden h-10 w-[clamp(220px,22vw,340px)] items-center gap-2.5 rounded-[10px] border border-black/[0.11] bg-black/[0.025] px-3 text-[13px] text-[#606060] transition-colors hover:border-black/25 hover:bg-white hover:text-[#151515] dark:border-white/[0.12] dark:bg-white/[0.04] dark:text-[#a8a8a8] dark:hover:border-white/25 dark:hover:bg-[#141414] dark:hover:text-white sm:flex"
          >
            <Search
              className="size-4 shrink-0"
              strokeWidth={1.7}
              aria-hidden="true"
            />
            <span className="min-w-0 flex-1 truncate text-left">
              Search topics and subjects
            </span>
            <kbd className="shrink-0 rounded-[6px] border border-black/[0.1] bg-black/[0.035] px-1.5 py-0.5 text-[10px] font-medium dark:border-white/[0.11] dark:bg-white/[0.06]">
              ⌘ K
            </kbd>
          </button>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="grid size-10 place-items-center rounded-[10px] border border-black/[0.11] text-[#555] hover:border-black/25 dark:border-white/[0.12] dark:text-[#b3b3b3] xl:hidden"
          >
            {menuOpen ? (
              <X className="size-[18px]" aria-hidden="true" />
            ) : (
              <Menu className="size-[18px]" aria-hidden="true" />
            )}
            <span className="sr-only">
              {menuOpen ? "Close navigation" : "Open navigation"}
            </span>
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        aria-hidden={!menuOpen}
        className={`absolute inset-x-3 top-[calc(100%+0.5rem)] rounded-[16px] border border-black/[0.11] bg-[#f7f7f5] p-2 shadow-[0_24px_70px_rgba(0,0,0,0.16)] transition-[opacity,transform,visibility] dark:border-white/[0.12] dark:bg-[#111] xl:hidden ${menuOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"}`}
      >
        <button
          type="button"
          onClick={() => {
            setMenuOpen(false);
            openSearch();
          }}
          tabIndex={menuOpen ? 0 : -1}
          className="flex min-h-11 w-full items-center gap-3 rounded-[10px] px-3 text-[14px] text-[#555] hover:bg-black/[0.05] dark:text-[#b3b3b3] dark:hover:bg-white/[0.07]"
        >
          <Search className="size-4" aria-hidden="true" /> Search PrepLoom{" "}
          <kbd className="ml-auto text-[10px]">⌘ K</kbd>
        </button>
        <nav className="mt-1 grid gap-1" aria-label="Primary mobile navigation">
          {navigation.map(({ label, href, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              tabIndex={menuOpen ? 0 : -1}
              className="flex min-h-11 items-center gap-3 rounded-[10px] px-3 text-[14px] text-[#555] hover:bg-black/[0.05] hover:text-[#151515] dark:text-[#b3b3b3] dark:hover:bg-white/[0.07] dark:hover:text-white"
            >
              <Icon className="size-4" strokeWidth={1.7} aria-hidden="true" />{" "}
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
