"use client";

import { Search, X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type SearchContextValue = {
  searchOpen: boolean;
  openSearch: () => void;
};

const SearchContext = createContext<SearchContextValue | null>(null);

export function CommandSearchProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const openSearch = useCallback(() => setSearchOpen(true), []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <SearchContext.Provider value={{ searchOpen, openSearch }}>
      {children}
      {searchOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/45 px-4 pt-[12vh] backdrop-blur-sm"
          onMouseDown={() => setSearchOpen(false)}
        >
          <section
            id="preploom-command-search"
            role="dialog"
            aria-modal="true"
            aria-label="Search PrepLoom"
            className="w-full max-w-[640px] overflow-hidden rounded-[16px] border border-black/[0.12] bg-[#f7f7f5] shadow-2xl dark:border-white/[0.14] dark:bg-[#121212]"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex h-16 items-center gap-3 border-b border-black/[0.09] px-5 dark:border-white/[0.1]">
              <Search className="size-[18px] text-[#777]" aria-hidden="true" />
              <input
                autoFocus
                placeholder="Search subjects, topics, or questions"
                className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-[#777]"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="grid size-9 place-items-center rounded-[8px] hover:bg-black/[0.05] dark:hover:bg-white/[0.07]"
                aria-label="Close search"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
            <p className="px-5 py-8 text-center text-[13px] text-[#777]">
              Search content will be connected as subjects are added.
            </p>
          </section>
        </div>
      ) : null}
    </SearchContext.Provider>
  );
}

export function useCommandSearch() {
  const context = useContext(SearchContext);
  if (!context)
    throw new Error(
      "useCommandSearch must be used within CommandSearchProvider",
    );
  return context;
}
