"use client";

import type { LucideIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export type QuestionModeOption<TMode extends string> = {
  id: TMode;
  label: string;
  icon: LucideIcon;
};

function QuestionModeSwitch<TMode extends string>({
  mode,
  options,
  onModeChange,
}: {
  mode: TMode;
  options: readonly QuestionModeOption<TMode>[];
  onModeChange: (mode: TMode) => void;
}) {
  return (
    <div
      className="grid w-full grid-cols-2 rounded-[10px] border border-black/[0.11] bg-black/[0.025] p-1 dark:border-white/[0.12] dark:bg-white/[0.04] sm:w-auto"
      aria-label="Answer mode"
    >
      {options.map((item) => {
        const Icon = item.icon;
        const active = mode === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onModeChange(item.id)}
            aria-pressed={active}
            className={`inline-flex h-9 min-w-0 items-center justify-center gap-2 rounded-[8px] px-4 text-[11px] font-medium transition-[background-color,color,transform] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:focus-visible:ring-white/50 ${
              active
                ? "bg-[#151515] text-white dark:bg-[#ededed] dark:text-[#151515]"
                : "text-[#606060] hover:text-[#151515] dark:text-[#a8a8a8] dark:hover:text-white"
            }`}
          >
            <Icon
              className="size-3.5 shrink-0"
              strokeWidth={1.7}
              aria-hidden="true"
            />
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export function QuestionToolbar<
  TMode extends string,
  TCategory extends string = string,
>({
  filteredCount,
  totalCount,
  mode,
  modeOptions,
  onModeChange,
  categories,
  selectedCategory,
  onCategoryChange,
  categoryLabel,
}: {
  filteredCount: number;
  totalCount: number;
  mode: TMode;
  modeOptions: readonly QuestionModeOption<TMode>[];
  onModeChange: (mode: TMode) => void;
  categories?: readonly TCategory[];
  selectedCategory?: TCategory;
  onCategoryChange?: (category: TCategory) => void;
  categoryLabel?: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);
  const hasCategories = Boolean(
    categories?.length && selectedCategory && onCategoryChange,
  );

  const updateOverflowFades = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const overflowRemaining =
      scroller.scrollWidth - scroller.clientWidth - scroller.scrollLeft;
    setShowLeftFade(scroller.scrollLeft > 2);
    setShowRightFade(overflowRemaining > 2);
  }, []);

  useEffect(() => {
    if (!hasCategories) return;

    const scroller = scrollerRef.current;
    if (!scroller) return;

    updateOverflowFades();
    const observer = new ResizeObserver(updateOverflowFades);
    observer.observe(scroller);

    return () => observer.disconnect();
  }, [hasCategories, updateOverflowFades]);

  return (
    <div className="sticky top-[68px] z-30 mb-5 border-b border-black/[0.1] bg-[#f7f7f5]/95 py-3 backdrop-blur-xl dark:border-white/[0.11] dark:bg-[#0a0a0a]/95 sm:py-4">
      <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:gap-6">
        <div className="min-w-0">
          <p className="text-[10px] font-medium text-[#606060] dark:text-[#a8a8a8]">
            {hasCategories ? "Categories" : "Questions"}
          </p>
          <p
            className="mt-1 text-[11px] text-[#777] dark:text-[#858585]"
            aria-live="polite"
          >
            Showing {filteredCount} of {totalCount}
          </p>
        </div>

        <div className="min-w-0 sm:text-right">
          <p className="mb-2 text-[10px] font-medium text-[#606060] dark:text-[#a8a8a8]">
            Mode
          </p>
          <QuestionModeSwitch
            mode={mode}
            options={modeOptions}
            onModeChange={onModeChange}
          />
        </div>
      </div>

      {hasCategories && categories && onCategoryChange && (
        <div className="relative mt-3 min-w-0">
          <div
            ref={scrollerRef}
            onScroll={updateOverflowFades}
            className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0"
          >
            <div
              className="flex w-max gap-1.5"
              aria-label={categoryLabel ?? "Question categories"}
            >
              {categories.map((option) => {
                const active = selectedCategory === option;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={(event) => {
                      onCategoryChange(option);
                      event.currentTarget.scrollIntoView({
                        block: "nearest",
                        inline: "center",
                      });
                    }}
                    aria-pressed={active}
                    className={`h-9 shrink-0 rounded-[8px] border px-3 text-[11px] font-medium transition-[border-color,background-color,color,transform] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:focus-visible:ring-white/50 ${
                      active
                        ? "border-[#151515] bg-[#151515] text-white dark:border-[#ededed] dark:bg-[#ededed] dark:text-[#151515]"
                        : "border-black/[0.1] text-[#606060] hover:border-black/25 hover:text-[#151515] dark:border-white/[0.12] dark:text-[#a8a8a8] dark:hover:border-white/25 dark:hover:text-white"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          {showLeftFade && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 -left-5 w-10 bg-gradient-to-r from-[#f7f7f5] to-transparent dark:from-[#0a0a0a] sm:left-0"
            />
          )}
          {showRightFade && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 -right-5 w-10 bg-gradient-to-l from-[#f7f7f5] to-transparent dark:from-[#0a0a0a] sm:right-0"
            />
          )}
        </div>
      )}
    </div>
  );
}
