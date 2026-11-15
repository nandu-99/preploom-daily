"use client";

import { CommandSearch } from "@/components/command-search";
import type { SearchCatalog } from "@/lib/search-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type CommandSearchContextValue = {
  searchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
};

const CommandSearchContext = createContext<CommandSearchContextValue | null>(
  null,
);

const emptyCatalog: SearchCatalog = { initialGroups: [], searchGroups: [] };

export function CommandSearchProvider({ children }: { children: React.ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [catalog, setCatalog] = useState<SearchCatalog>(emptyCatalog);
  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000"}/search/catalog`)
      .then(async (response) => {
        if (!response.ok) return;
        const body = (await response.json()) as { data?: { catalog?: SearchCatalog } };
        if (body.data?.catalog) setCatalog(body.data.catalog);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (searchOpen) {
          closeSearch();
        } else {
          openSearch();
        }
      }
    };

    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, [closeSearch, openSearch, searchOpen]);

  const value = useMemo(
    () => ({ searchOpen, openSearch, closeSearch }),
    [searchOpen, openSearch, closeSearch],
  );

  return (
    <CommandSearchContext.Provider value={value}>
      {children}
      <CommandSearch
        catalog={catalog}
        open={searchOpen}
        onOpenChange={setSearchOpen}
      />
    </CommandSearchContext.Provider>
  );
}

export function useCommandSearch() {
  const context = useContext(CommandSearchContext);

  if (!context) {
    throw new Error(
      "useCommandSearch must be used inside CommandSearchProvider",
    );
  }

  return context;
}
