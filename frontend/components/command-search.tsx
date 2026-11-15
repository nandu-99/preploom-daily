"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Command } from "cmdk";
import {
  ArrowRight,
  BookOpen,
  Braces,
  Code2,
  Route,
  Search,
  X,
} from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import {
  rankSearchGroups,
  type RankedSearchResult,
} from "@/lib/search-ranking";
import type {
  SearchCatalog,
  SearchIcon,
  SearchItem,
  SearchResultType,
} from "@/lib/search-types";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

const searchIcons: Record<SearchIcon, typeof BookOpen> = {
  book: BookOpen,
  braces: Braces,
  code: Code2,
  route: Route,
};

const resultTypeLabels: Record<SearchResultType, string> = {
  subject: "Subject",
  module: "Module",
  topic: "Topic",
  "interview-question": "Question",
  resource: "Resource",
  roadmap: "Roadmap",
};

type VisibleSearchResult = {
  item: SearchItem;
  matchReason: RankedSearchResult["matchReason"] | "suggested";
  rank: number;
};

type VisibleSearchGroup = {
  label: string;
  results: VisibleSearchResult[];
};

function sanitizeSearchTerm(value: string) {
  const normalized = value.trim().toLowerCase().slice(0, 80);
  const containsEmail = /\S+@\S+\.\S+/.test(normalized);
  const containsPhone = /\d{8,}/.test(normalized);
  const containsUrl = /https?:\/\/|www\./.test(normalized);

  if (containsEmail || containsPhone || containsUrl) return "[redacted]";
  return normalized;
}

export function CommandSearch({
  catalog,
  open,
  onOpenChange,
}: {
  catalog: SearchCatalog;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const previousOpen = useRef(open);
  const normalizedQuery = query.trim();
  const visibleGroups = useMemo<VisibleSearchGroup[]>(() => {
    if (!normalizedQuery) {
      return catalog.initialGroups.map((group) => ({
        label: group.label,
        results: group.items.map((item, index) => ({
          item,
          matchReason: "suggested",
          rank: index + 1,
        })),
      }));
    }

    const rankedResults = rankSearchGroups(catalog.searchGroups, query);
    if (!rankedResults.length) return [];

    return [
      {
        label: "Best match",
        results: [rankedResults[0]],
      },
      ...(rankedResults.length > 1
        ? [
            {
              label: "More results",
              results: rankedResults.slice(1),
            },
          ]
        : []),
    ];
  }, [catalog.initialGroups, catalog.searchGroups, normalizedQuery, query]);

  useEffect(() => {
    if (previousOpen.current && !open) {
      const sanitizedQuery = sanitizeSearchTerm(query);

      if (sanitizedQuery) {
        trackEvent("search", {
          search_term: sanitizedQuery,
          search_location: "command_search",
          search_outcome: "abandoned",
          query_length: query.trim().length,
        });
      }

      setQuery("");
    }

    previousOpen.current = open;
  }, [open, query]);

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
  };

  const openResult = (result: VisibleSearchResult) => {
    const { item, matchReason, rank } = result;
    const sanitizedQuery = sanitizeSearchTerm(query);

    trackEvent("search", {
      search_term: sanitizedQuery || undefined,
      search_location: "command_search",
      search_outcome: sanitizedQuery
        ? "result_selected"
        : "suggested_result_selected",
      query_length: query.trim().length,
      result_title: item.title,
      result_type: item.type,
      result_position: rank,
      match_reason: matchReason,
      destination: item.href,
    });

    setQuery("");
    onOpenChange(false);
    router.push(item.href);
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[100] min-h-dvh bg-black/55 backdrop-blur-[3px] transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-[-webkit-touch-callout:none]:absolute" />
        <Dialog.Viewport className="fixed inset-0 z-[101] flex items-start justify-center overflow-y-auto px-3 pb-8 pt-[10vh] sm:px-6 sm:pt-[16vh]">
          <Dialog.Popup
            id="preploom-command-search"
            className="w-full max-w-[600px] overflow-hidden rounded-2xl border border-black/10 bg-white font-[family-name:var(--font-inter)] text-black shadow-[0_30px_100px_rgba(0,0,0,0.3)] transition-[scale,opacity] duration-150 ease-out data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.98] data-starting-style:opacity-0 dark:border-white/[0.12] dark:bg-[#080808] dark:text-white"
          >
            <Dialog.Title className="sr-only">Search PrepLoom</Dialog.Title>
            <Dialog.Description className="sr-only">
              Search subjects, topics, interview questions, roadmaps and
              development resources.
            </Dialog.Description>

            <Command
              label="PrepLoom search"
              shouldFilter={false}
              className="flex min-h-0 flex-col"
            >
              <div className="flex h-14 items-center gap-3 border-b border-black/10 px-4 dark:border-white/10 sm:h-16 sm:px-5">
                <Search
                  aria-hidden="true"
                  className="size-5 shrink-0 text-[#7C7C7C]"
                />
                <Command.Input
                  autoFocus
                  value={query}
                  onValueChange={setQuery}
                  placeholder="Search subjects, topics, questions..."
                  className="h-full min-w-0 flex-1 bg-transparent text-[15px] font-normal outline-none placeholder:text-[#7C7C7C] sm:text-base"
                />
                <Dialog.Close
                  className="grid size-8 shrink-0 place-items-center rounded-lg text-[#7C7C7C] transition-colors hover:bg-black/[0.06] hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/50 dark:hover:bg-white/[0.07] dark:hover:text-white dark:focus-visible:ring-white/60"
                  aria-label="Close search"
                >
                  <X aria-hidden="true" className="size-[18px]" />
                </Dialog.Close>
              </div>

              <Command.List className="max-h-[min(55vh,400px)] overflow-y-auto overscroll-contain p-2 sm:p-3">
                <Command.Empty className="px-5 py-14 text-center">
                  <Search
                    aria-hidden="true"
                    className="mx-auto mb-3 size-6 text-[#7C7C7C]"
                  />
                  <p className="text-sm font-medium">No results found</p>
                  <p className="mt-1 text-xs text-[#7C7C7C]">
                    Try a subject, topic, question, or roadmap.
                  </p>
                </Command.Empty>

                {visibleGroups.map((group) => (
                  <Command.Group
                    key={group.label}
                    heading={group.label}
                    className="mb-2 overflow-hidden text-black last:mb-0 dark:text-white [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.14em] [&_[cmdk-group-heading]]:text-[#7C7C7C]"
                  >
                    {group.results.map((result) => {
                      const { item } = result;
                      const Icon = searchIcons[item.icon];
                      return (
                        <Command.Item
                          key={`${group.label}:${item.href}:${item.title}`}
                          value={`${item.title} ${item.description}`}
                          keywords={item.keywords}
                          onSelect={() => openResult(result)}
                          className="group flex cursor-default select-none items-center gap-3 rounded-xl px-3 py-2.5 outline-none data-[selected=true]:bg-black/[0.07] data-[selected=true]:text-black dark:data-[selected=true]:bg-white/[0.1] dark:data-[selected=true]:text-white"
                        >
                          <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-black/10 bg-black/[0.03] text-[#7C7C7C] group-data-[selected=true]:bg-black/[0.05] group-data-[selected=true]:text-black dark:border-white/10 dark:bg-white/[0.04] dark:group-data-[selected=true]:bg-white/[0.08] dark:group-data-[selected=true]:text-white">
                            <Icon aria-hidden="true" className="size-[17px]" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex min-w-0 items-center gap-2">
                              <span className="min-w-0 flex-1 truncate text-sm font-medium">
                                {item.title}
                              </span>
                              <span className="shrink-0 text-[10px] font-medium text-[#7C7C7C] group-data-[selected=true]:text-black/55 dark:group-data-[selected=true]:text-white/55">
                                {resultTypeLabels[item.type]}
                              </span>
                            </span>
                            <span className="mt-0.5 block truncate text-xs text-[#7C7C7C] group-data-[selected=true]:text-black/60 dark:group-data-[selected=true]:text-white/60">
                              {item.description}
                            </span>
                          </span>
                          <ArrowRight
                            aria-hidden="true"
                            className="size-4 shrink-0 -translate-x-1 text-[#7C7C7C] opacity-0 transition-[opacity,transform] group-data-[selected=true]:translate-x-0 group-data-[selected=true]:text-current group-data-[selected=true]:opacity-100"
                          />
                        </Command.Item>
                      );
                    })}
                  </Command.Group>
                ))}
              </Command.List>

              <div className="hidden h-10 items-center justify-between border-t border-black/10 px-5 text-[11px] text-[#7C7C7C] dark:border-white/10 sm:flex">
                <span>Search across all PrepLoom resources</span>
                <span className="flex items-center gap-3">
                  <span>↑↓ Navigate</span>
                  <span>↵ Open</span>
                  <span>Esc Close</span>
                </span>
              </div>
            </Command>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
