"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

export function ThemeToggle() {
  const dark = useSyncExternalStore(
    (onThemeChange) => {
      const observer = new MutationObserver(onThemeChange);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });
      return () => observer.disconnect();
    },
    () => document.documentElement.classList.contains("dark"),
    () => false,
  );

  const toggle = () => {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    document.documentElement.style.colorScheme = next ? "dark" : "light";
    localStorage.setItem("preploom-theme", next ? "dark" : "light");
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="grid size-10 place-items-center rounded-[10px] border border-black/[0.11] text-[#555] transition-colors hover:border-black/25 hover:bg-black/[0.04] hover:text-[#151515] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:border-white/[0.12] dark:text-[#b3b3b3] dark:hover:border-white/25 dark:hover:bg-white/[0.06] dark:hover:text-white dark:focus-visible:ring-white/50"
      aria-label={`Switch to ${dark ? "light" : "dark"} theme`}
    >
      {dark ? (
        <Sun className="size-[17px]" aria-hidden="true" />
      ) : (
        <Moon className="size-[17px]" aria-hidden="true" />
      )}
    </button>
  );
}
