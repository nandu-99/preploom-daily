"use client";

import { useCommandSearch } from "@/components/command-search-provider";
import { PrepLoomLogo } from "@/components/preploom-logo";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { trackEvent } from "@/lib/analytics";
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
import { useState, useSyncExternalStore } from "react";

const navigation = [
  { label: "Subjects", href: "/subjects" },
  { label: "Interview Questions", href: "/interview-questions" },
  { label: "Roadmaps", href: "/roadmaps" },
  { label: "WebDev", href: "/webdev" },
  { label: "DSA", href: "/dsa" },
];

const mobileIcons = [BookOpen, MessageSquareText, Route, Code2, Braces];

function SiteThemeToggle() {
  const isDark = useSyncExternalStore(
    (onThemeChange) => {
      const observer = new MutationObserver(onThemeChange);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });
      window.addEventListener("storage", onThemeChange);
      return () => {
        observer.disconnect();
        window.removeEventListener("storage", onThemeChange);
      };
    },
    () => document.documentElement.classList.contains("dark"),
    () => false,
  );

  const handleThemeChange = (theme: "light" | "dark") => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    localStorage.setItem("preploom-theme", theme);
  };

  return (
    <AnimatedThemeToggler
      theme={isDark ? "dark" : "light"}
      onThemeChange={handleThemeChange}
      variant="circle"
      duration={350}
      className="grid size-10 place-items-center rounded-[10px] border border-black/[0.11] text-[#555] transition-colors hover:border-black/25 hover:bg-black/[0.04] hover:text-[#151515] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:border-white/[0.12] dark:text-[#b3b3b3] dark:hover:border-white/25 dark:hover:bg-white/[0.06] dark:hover:text-white dark:focus-visible:ring-white/50 [&_svg]:size-[17px]"
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
    />
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { openSearch, searchOpen } = useCommandSearch();

  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.08] bg-[#f7f7f5]/92 font-[family-name:var(--font-geist-sans)] backdrop-blur-xl dark:border-white/[0.09] dark:bg-[#0a0a0a]/92">
      <div className="mx-auto flex h-[68px] max-w-[1440px] items-center gap-5 px-5 sm:px-6 lg:px-8">
        <Link
          href="/"
          onClick={() =>
            trackEvent("navigation_click", {
              link_text: "PrepLoom home",
              destination: "/",
              ui_location: "header_logo",
            })
          }
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
                onClick={() =>
                  trackEvent("navigation_click", {
                    link_text: item.label,
                    destination: item.href,
                    ui_location: "header_desktop",
                  })
                }
                className={`rounded-[8px] px-3 py-2 text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:focus-visible:ring-white/50 ${
                  active
                    ? "bg-black/[0.06] font-medium text-[#151515] dark:bg-white/[0.08] dark:text-white"
                    : "text-[#606060] hover:bg-black/[0.035] hover:text-[#151515] dark:text-[#a8a8a8] dark:hover:bg-white/[0.05] dark:hover:text-white"
                }`}
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
            aria-controls="preploom-command-search"
            className="grid size-10 place-items-center rounded-[10px] border border-black/[0.11] text-[#555] transition-colors hover:border-black/25 hover:text-[#151515] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:border-white/[0.12] dark:text-[#b3b3b3] dark:hover:border-white/25 dark:hover:text-white dark:focus-visible:ring-white/50 sm:hidden"
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
            aria-controls="preploom-command-search"
            className="group hidden h-10 w-[clamp(220px,22vw,340px)] items-center gap-2.5 rounded-[10px] border border-black/[0.11] bg-black/[0.025] px-3 text-[13px] text-[#606060] transition-colors hover:border-black/25 hover:bg-white hover:text-[#151515] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:border-white/[0.12] dark:bg-white/[0.04] dark:text-[#a8a8a8] dark:hover:border-white/25 dark:hover:bg-[#141414] dark:hover:text-white dark:focus-visible:ring-white/50 sm:flex"
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
          <SiteThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            aria-expanded={menuOpen}
            aria-controls="hybrid-mobile-menu"
            className="grid size-10 place-items-center rounded-[10px] border border-black/[0.11] text-[#555] transition-colors hover:border-black/25 hover:text-[#151515] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:border-white/[0.12] dark:text-[#b3b3b3] dark:hover:border-white/25 dark:hover:text-white dark:focus-visible:ring-white/50 xl:hidden"
          >
            {menuOpen ? (
              <X className="size-[18px]" strokeWidth={1.7} aria-hidden="true" />
            ) : (
              <Menu
                className="size-[18px]"
                strokeWidth={1.7}
                aria-hidden="true"
              />
            )}
            <span className="sr-only">
              {menuOpen ? "Close navigation" : "Open navigation"}
            </span>
          </button>
        </div>
      </div>

      <div
        id="hybrid-mobile-menu"
        aria-hidden={!menuOpen}
        className={`absolute inset-x-3 top-[calc(100%+0.5rem)] rounded-[16px] border border-black/[0.11] bg-[#f7f7f5] p-2 shadow-[0_24px_70px_rgba(0,0,0,0.16)] transition-[opacity,transform,visibility] dark:border-white/[0.12] dark:bg-[#111] dark:shadow-[0_28px_80px_rgba(0,0,0,0.5)] xl:hidden ${
          menuOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1 opacity-0"
        }`}
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
          <Search className="size-4" strokeWidth={1.7} aria-hidden="true" />
          Search PrepLoom
          <kbd className="ml-auto text-[10px]">⌘ K</kbd>
        </button>
        <nav className="mt-1 grid gap-1" aria-label="Primary mobile navigation">
          {navigation.map((item, index) => {
            const Icon = mobileIcons[index];
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => {
                  trackEvent("navigation_click", {
                    link_text: item.label,
                    destination: item.href,
                    ui_location: "header_mobile",
                  });
                  setMenuOpen(false);
                }}
                tabIndex={menuOpen ? 0 : -1}
                className="flex min-h-11 items-center gap-3 rounded-[10px] px-3 text-[14px] text-[#555] hover:bg-black/[0.05] hover:text-[#151515] dark:text-[#b3b3b3] dark:hover:bg-white/[0.07] dark:hover:text-white"
              >
                <Icon className="size-4" strokeWidth={1.7} aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
