"use client";

import { ContentEngagementTracker } from "@/components/analytics/content-engagement-tracker";
import { ContentScrollTracker } from "@/components/analytics/content-scroll-tracker";
import {
  LearnContent,
  RecallContent,
  ReviewContent,
} from "@/components/subjects/subject-workspace";
import { trackEvent } from "@/lib/analytics";
import type {
  SubjectContent,
  SubjectStudyMode,
  SubjectTopic,
} from "@/lib/subject-content";
import {
  Bookmark,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ListTree,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useSearchParams } from "next/navigation";
import {
  Suspense,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

type ReadingLayout = "topic" | "all";

type TopicViewSource =
  | "initial_load"
  | "restored_state"
  | "url_query"
  | "contents_desktop"
  | "contents_mobile"
  | "previous_button"
  | "next_button"
  | "all_notes_scroll";

type SavedReadingState = {
  layout: ReadingLayout;
  mode: SubjectStudyMode;
  selectedSlug: string;
  completed: string[];
  saved: string[];
  leftSidebarOpen?: boolean;
  rightSidebarOpen?: boolean;
};

const layoutOptions: { value: ReadingLayout; label: string }[] = [
  { value: "topic", label: "Topic by topic" },
  { value: "all", label: "All notes" },
];

const modeOptions: { value: SubjectStudyMode; label: string }[] = [
  { value: "learn", label: "Learn" },
  { value: "revise", label: "Revise" },
  { value: "last-minute", label: "Recall" },
];

function clean(text: string) {
  return text.replace(/[\u2014\u2013]/g, "-");
}

function TopicContent({
  topic,
  mode,
}: {
  topic: SubjectTopic;
  mode: SubjectStudyMode;
}) {
  if (mode === "learn") return <LearnContent topic={topic} />;
  if (mode === "revise") return <ReviewContent topic={topic} />;
  return <RecallContent topic={topic} />;
}

function TopicActions({
  topic,
  completed,
  saved,
  onToggleComplete,
  onToggleSaved,
  placement = "footer",
}: {
  topic: SubjectTopic;
  completed: boolean;
  saved: boolean;
  onToggleComplete: () => void;
  onToggleSaved: () => void;
  placement?: "footer" | "sidebar";
}) {
  const sidebar = placement === "sidebar";

  return (
    <div
      className={
        sidebar
          ? "space-y-2"
          : "flex flex-wrap items-center gap-3 border-t border-black/[0.1] pt-5 dark:border-white/[0.11]"
      }
    >
      <button
        type="button"
        onClick={onToggleComplete}
        aria-pressed={completed}
        className={`${sidebar ? "flex min-h-11 w-full px-3" : "inline-flex min-h-10 px-4"} items-center gap-2 rounded-[10px] text-[12px] font-medium transition-[background-color,color,border-color,transform] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:focus-visible:ring-white/50 ${
          completed
            ? "border border-black/[0.1] bg-black/[0.06] text-[#151515] dark:border-white/[0.12] dark:bg-white/[0.08] dark:text-[#f3f3f1]"
            : "bg-[#151515] text-white dark:border dark:border-white/[0.14] dark:bg-[#242424] dark:text-[#f3f3f1]"
        }`}
      >
        <Check className="size-4" strokeWidth={1.8} aria-hidden="true" />
        {completed ? "Completed" : "Mark complete"}
      </button>
      <button
        type="button"
        onClick={onToggleSaved}
        aria-pressed={saved}
        className={`${sidebar ? "flex min-h-11 w-full px-3" : "inline-flex min-h-10 px-4"} items-center gap-2 rounded-[10px] border border-black/[0.1] text-[12px] font-medium transition-[background-color,color,border-color,transform] hover:bg-black/[0.04] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:border-white/[0.11] dark:hover:bg-white/[0.06] dark:focus-visible:ring-white/50`}
      >
        <Bookmark
          className={`size-4 ${saved ? "fill-current" : ""}`}
          strokeWidth={1.7}
          aria-hidden="true"
        />
        {saved ? "Saved" : "Save topic"}
      </button>
      <span className="sr-only">Actions for {clean(topic.title)}</span>
    </div>
  );
}

function SubjectTopicUrlSync({
  topics,
  onSelect,
  reduceMotion,
}: {
  topics: SubjectTopic[];
  onSelect: (slug: string) => void;
  reduceMotion: boolean | null;
}) {
  const searchParams = useSearchParams();
  const requestedTopicSlug = searchParams.get("topic");

  useEffect(() => {
    if (
      !requestedTopicSlug ||
      !topics.some((topic) => topic.slug === requestedTopicSlug)
    ) {
      return;
    }

    let scrollFrame = 0;
    const selectionFrame = window.requestAnimationFrame(() => {
      onSelect(requestedTopicSlug);
      scrollFrame = window.requestAnimationFrame(() => {
        document.getElementById("reading-preview-note")?.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "start",
        });
      });
    });

    return () => {
      window.cancelAnimationFrame(selectionFrame);
      window.cancelAnimationFrame(scrollFrame);
    };
  }, [onSelect, reduceMotion, requestedTopicSlug, topics]);

  return null;
}

export function SubjectReader({ subject }: { subject: SubjectContent }) {
  const topics = useMemo(
    () => subject.modules.flatMap((module) => module.topics),
    [subject.modules],
  );
  const storageKey = `preploom-reading-preview-${subject.slug}`;
  const [layout, setLayout] = useState<ReadingLayout>("topic");
  const [mode, setMode] = useState<SubjectStudyMode>("learn");
  const [selectedSlug, setSelectedSlug] = useState(topics[0].slug);
  const [completed, setCompleted] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [focusMode, setFocusMode] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const focusModeButtonRef = useRef<HTMLButtonElement>(null);
  const exitFocusButtonRef = useRef<HTMLButtonElement>(null);
  const focusModeContainerRef = useRef<HTMLElement>(null);
  const pendingScrollSlug = useRef<string | null>(null);
  const pendingProgrammaticScrollSlug = useRef<string | null>(null);
  const pendingProgrammaticScrollTimeout = useRef<number | null>(null);
  const pendingTopicView = useRef<{
    slug: string;
    source: TopicViewSource;
  } | null>(null);
  const lastTrackedTopicKey = useRef<string | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!focusMode) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusFrame = window.requestAnimationFrame(() => {
      exitFocusButtonRef.current?.focus();
    });

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setFocusMode(false);
        window.requestAnimationFrame(() => focusModeButtonRef.current?.focus());
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = Array.from(
        focusModeContainerRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);
      if (!firstElement || !lastElement) return;

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [focusMode]);

  const completeProgrammaticScroll = useCallback((slug: string) => {
    if (pendingProgrammaticScrollSlug.current !== slug) return;

    pendingProgrammaticScrollSlug.current = null;
    if (pendingProgrammaticScrollTimeout.current !== null) {
      window.clearTimeout(pendingProgrammaticScrollTimeout.current);
      pendingProgrammaticScrollTimeout.current = null;
    }
  }, []);

  const beginProgrammaticScroll = useCallback(
    (slug: string) => {
      if (pendingProgrammaticScrollTimeout.current !== null) {
        window.clearTimeout(pendingProgrammaticScrollTimeout.current);
      }

      pendingProgrammaticScrollSlug.current = slug;
      pendingProgrammaticScrollTimeout.current = window.setTimeout(() => {
        completeProgrammaticScroll(slug);
      }, 1500);
    },
    [completeProgrammaticScroll],
  );

  const selectUrlTopic = useCallback((slug: string) => {
    pendingTopicView.current = { slug, source: "url_query" };
    setSelectedSlug(slug);
  }, []);

  const selectedIndex = topics.findIndex(
    (topic) => topic.slug === selectedSlug,
  );
  const selectedTopic = topics[selectedIndex] ?? topics[0];
  const selectedModuleTitle =
    subject.modules.find((module) =>
      module.topics.some((topic) => topic.slug === selectedTopic.slug),
    )?.title ?? "";

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const raw = window.localStorage.getItem(storageKey);
        if (raw) {
          const state = JSON.parse(raw) as SavedReadingState;
          if (state.layout === "topic" || state.layout === "all") {
            setLayout(state.layout);
          }
          if (["learn", "revise", "last-minute"].includes(state.mode)) {
            setMode(state.mode);
          }
          const urlTopicSlug = new URLSearchParams(window.location.search).get(
            "topic",
          );
          if (
            !urlTopicSlug &&
            topics.some((topic) => topic.slug === state.selectedSlug)
          ) {
            pendingTopicView.current = {
              slug: state.selectedSlug,
              source: "restored_state",
            };
            setSelectedSlug(state.selectedSlug);
          }
          setCompleted(state.completed ?? []);
          setSaved(state.saved ?? []);
          setLeftSidebarOpen(state.leftSidebarOpen !== false);
          setRightSidebarOpen(state.rightSidebarOpen !== false);
        }
      } catch {
        window.localStorage.removeItem(storageKey);
      }
      setHydrated(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [storageKey, topics]);

  useEffect(() => {
    if (!hydrated) return;
    const state: SavedReadingState = {
      layout,
      mode,
      selectedSlug,
      completed,
      saved,
      leftSidebarOpen,
      rightSidebarOpen,
    };
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [
    completed,
    hydrated,
    layout,
    leftSidebarOpen,
    mode,
    rightSidebarOpen,
    saved,
    selectedSlug,
    storageKey,
  ]);

  useEffect(() => {
    if (!hydrated) return;

    const requestedTopicSlug = new URLSearchParams(window.location.search).get(
      "topic",
    );
    const hasValidRequestedTopic = topics.some(
      (topic) => topic.slug === requestedTopicSlug,
    );

    if (hasValidRequestedTopic && requestedTopicSlug !== selectedSlug) return;

    const topicKey = `${subject.slug}:${selectedSlug}`;
    if (lastTrackedTopicKey.current === topicKey) return;

    const pendingView = pendingTopicView.current;
    const viewSource =
      pendingView?.slug === selectedSlug ? pendingView.source : "initial_load";

    trackEvent("topic_view", {
      subject_slug: subject.slug,
      subject_name: subject.title,
      topic_slug: selectedTopic.slug,
      topic_name: selectedTopic.title,
      module_name: selectedModuleTitle,
      study_mode: mode,
      reading_layout: layout,
      view_source: viewSource,
    });

    lastTrackedTopicKey.current = topicKey;
    pendingTopicView.current = null;
  }, [
    hydrated,
    layout,
    mode,
    selectedModuleTitle,
    selectedSlug,
    selectedTopic.slug,
    selectedTopic.title,
    subject.slug,
    subject.title,
    topics,
  ]);

  useEffect(() => {
    if (layout !== "all") return;
    const elements = topics
      .map((topic) => document.getElementById(`all-note-${topic.slug}`))
      .filter((element): element is HTMLElement => Boolean(element));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const slug = visible.target.id.replace("all-note-", "");
          const programmaticScrollSlug = pendingProgrammaticScrollSlug.current;

          if (programmaticScrollSlug && slug !== programmaticScrollSlug) return;
          if (slug === programmaticScrollSlug) {
            completeProgrammaticScroll(slug);
          }

          setSelectedSlug((currentSlug) => {
            if (slug === currentSlug) return currentSlug;

            pendingTopicView.current = {
              slug,
              source: "all_notes_scroll",
            };
            return slug;
          });
        }
      },
      { rootMargin: "-24% 0px -58% 0px", threshold: [0, 0.2, 0.5] },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [completeProgrammaticScroll, layout, topics]);

  useEffect(() => {
    if (!pendingScrollSlug.current) return;
    const slug = pendingScrollSlug.current;
    const frame = window.requestAnimationFrame(() => {
      const id = layout === "all" ? `all-note-${slug}` : "reading-preview-note";
      if (layout === "all") beginProgrammaticScroll(slug);
      document.getElementById(id)?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
      pendingScrollSlug.current = null;
    });
    return () => window.cancelAnimationFrame(frame);
  }, [beginProgrammaticScroll, layout, mode, reduceMotion]);

  function getTopicAnalyticsContext(slug: string) {
    const topic = topics.find((item) => item.slug === slug);
    const moduleName = subject.modules.find((module) =>
      module.topics.some((item) => item.slug === slug),
    )?.title;

    return {
      topic_name: topic?.title,
      module_name: moduleName,
    };
  }

  function toggleCompleted(slug: string) {
    const wasCompleted = completed.includes(slug);

    if (!wasCompleted) {
      trackEvent("topic_complete", {
        subject_slug: subject.slug,
        topic_slug: slug,
        ...getTopicAnalyticsContext(slug),
        study_mode: mode,
        reading_layout: layout,
      });
    }

    setCompleted((current) =>
      wasCompleted
        ? current.filter((item) => item !== slug)
        : [...current, slug],
    );
  }

  function toggleSaved(slug: string) {
    const wasSaved = saved.includes(slug);

    if (!wasSaved) {
      trackEvent("topic_save", {
        subject_slug: subject.slug,
        topic_slug: slug,
        ...getTopicAnalyticsContext(slug),
        study_mode: mode,
        reading_layout: layout,
      });
    }

    setSaved((current) =>
      wasSaved ? current.filter((item) => item !== slug) : [...current, slug],
    );
  }

  function changeLayout(nextLayout: ReadingLayout) {
    if (nextLayout === layout) return;

    trackEvent("reading_layout_change", {
      subject_slug: subject.slug,
      topic_slug: selectedSlug,
      previous_layout: layout,
      reading_layout: nextLayout,
      study_mode: mode,
    });

    pendingScrollSlug.current = selectedSlug;
    if (nextLayout === "topic" && pendingProgrammaticScrollSlug.current) {
      completeProgrammaticScroll(pendingProgrammaticScrollSlug.current);
    }
    setLayout(nextLayout);
  }

  function changeMode(nextMode: SubjectStudyMode) {
    if (nextMode === mode) return;

    trackEvent("study_mode_change", {
      subject_slug: subject.slug,
      topic_slug: selectedSlug,
      previous_mode: mode,
      study_mode: nextMode,
      reading_layout: layout,
    });

    pendingScrollSlug.current = selectedSlug;
    setMode(nextMode);
  }

  function selectTopic(slug: string, source: TopicViewSource) {
    pendingTopicView.current = { slug, source };
    setSelectedSlug(slug);
    if (layout === "all") {
      beginProgrammaticScroll(slug);
      document.getElementById(`all-note-${slug}`)?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
      return;
    }
    document.getElementById("reading-preview-note")?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  }

  const readerGridClass = leftSidebarOpen
    ? rightSidebarOpen
      ? "lg:grid-cols-[250px_minmax(0,1fr)] xl:grid-cols-[270px_minmax(0,1fr)_170px]"
      : "lg:grid-cols-[250px_minmax(0,1fr)] xl:grid-cols-[270px_minmax(0,1fr)_44px]"
    : rightSidebarOpen
      ? "lg:grid-cols-[44px_minmax(0,1fr)] xl:grid-cols-[44px_minmax(0,1fr)_170px]"
      : "lg:grid-cols-[44px_minmax(0,1fr)] xl:grid-cols-[44px_minmax(0,1fr)_44px]";

  function exitFocusMode() {
    setFocusMode(false);
    window.requestAnimationFrame(() => focusModeButtonRef.current?.focus());
  }

  return (
    <section
      ref={focusModeContainerRef}
      role={focusMode ? "dialog" : undefined}
      aria-modal={focusMode ? true : undefined}
      aria-label={focusMode ? "Focused notes reader" : undefined}
      className={
        focusMode
          ? "fixed inset-0 z-[90] overflow-y-auto bg-[#f7f7f5] text-[#151515] dark:bg-[#0a0a0a] dark:text-[#f3f3f1]"
          : "border-b border-black/[0.08] dark:border-white/[0.09]"
      }
    >
      <Suspense fallback={null}>
        <SubjectTopicUrlSync
          topics={topics}
          onSelect={selectUrlTopic}
          reduceMotion={reduceMotion}
        />
      </Suspense>
      {focusMode ? (
        <button
          ref={exitFocusButtonRef}
          type="button"
          onClick={exitFocusMode}
          aria-label="Exit focus mode"
          title="Exit focus mode (Esc)"
          className="fixed right-4 top-4 z-[91] inline-flex min-h-9 items-center gap-2 rounded-[9px] border border-black/[0.08] bg-[#f7f7f5]/95 px-3 text-[12px] font-medium text-[#505050] shadow-[0_2px_8px_rgba(20,20,20,0.06)] backdrop-blur-md transition-[background-color,color,transform] hover:bg-[#ececea] hover:text-[#151515] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/50 dark:border-white/[0.1] dark:bg-[#181818]/95 dark:text-[#c8c8c8] dark:shadow-[0_2px_9px_rgba(0,0,0,0.22)] dark:hover:bg-[#242424] dark:hover:text-white dark:focus-visible:ring-white/60"
        >
          <Minimize2 className="size-4" strokeWidth={1.8} aria-hidden="true" />
          Exit focus
        </button>
      ) : (
        <div className="sticky top-[68px] z-30 border-b border-black/[0.08] bg-[#f7f7f5]/95 px-5 py-3 backdrop-blur-xl dark:border-white/[0.09] dark:bg-[#0a0a0a]/95 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-[1320px] gap-3 lg:grid-cols-[1fr_auto_auto_auto] lg:items-center lg:gap-5">
            <p className="text-[13px] font-medium">
              {completed.length} of {topics.length} complete
            </p>

            <div className="flex items-center justify-between gap-3">
              <span className="hidden text-[11px] text-[#777] dark:text-[#999] sm:inline">
                Reading layout
              </span>
              <div
                className="grid grid-cols-2 rounded-[12px] bg-black/[0.045] p-1 dark:bg-white/[0.055]"
                aria-label="Reading layout"
              >
                {layoutOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => changeLayout(option.value)}
                    aria-pressed={layout === option.value}
                    className={`min-h-9 rounded-[9px] px-3 text-[12px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:focus-visible:ring-white/50 ${layout === option.value ? "bg-[#151515] text-white dark:bg-[#242424] dark:text-[#f3f3f1] dark:ring-1 dark:ring-inset dark:ring-white/[0.12]" : "text-[#606060] hover:text-[#151515] dark:text-[#a8a8a8] dark:hover:text-white"}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="hidden text-[11px] text-[#777] dark:text-[#999] sm:inline">
                Study mode
              </span>
              <div
                className="grid flex-1 grid-cols-3 rounded-[12px] bg-black/[0.045] p-1 dark:bg-white/[0.055] sm:flex-none"
                aria-label="Study mode"
              >
                {modeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => changeMode(option.value)}
                    aria-pressed={mode === option.value}
                    className={`min-h-9 rounded-[9px] px-2.5 text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:focus-visible:ring-white/50 sm:px-3 sm:text-[12px] ${mode === option.value ? "bg-[#151515] text-white dark:bg-[#242424] dark:text-[#f3f3f1] dark:ring-1 dark:ring-inset dark:ring-white/[0.12]" : "text-[#606060] hover:text-[#151515] dark:text-[#a8a8a8] dark:hover:text-white"}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              ref={focusModeButtonRef}
              type="button"
              onClick={() => setFocusMode(true)}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[9px] border border-black/[0.08] px-3 text-[12px] font-medium text-[#505050] transition-[background-color,color,transform] hover:bg-black/[0.04] hover:text-[#151515] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:border-white/[0.1] dark:text-[#b8b8b8] dark:hover:bg-white/[0.06] dark:hover:text-white dark:focus-visible:ring-white/50"
            >
              <Maximize2
                className="size-4"
                strokeWidth={1.8}
                aria-hidden="true"
              />
              Focus
            </button>
          </div>
        </div>
      )}

      <div
        className={
          focusMode
            ? "mx-auto min-h-[100dvh] max-w-[1040px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12"
            : "mx-auto max-w-[1320px] px-5 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16"
        }
      >
        {hydrated ? (
          <>
            <ContentScrollTracker
              targetId="reading-preview-note"
              subjectSlug={subject.slug}
              topicSlug={layout === "topic" ? selectedTopic.slug : undefined}
              topicName={layout === "topic" ? selectedTopic.title : undefined}
              moduleName={layout === "topic" ? selectedModuleTitle : undefined}
              studyMode={mode}
              readingLayout={layout}
            />
            <ContentEngagementTracker
              targetId={
                layout === "topic"
                  ? "reading-preview-note"
                  : `all-note-${selectedTopic.slug}`
              }
              subjectSlug={subject.slug}
              topicSlug={selectedTopic.slug}
              topicName={selectedTopic.title}
              moduleName={selectedModuleTitle}
              studyMode={mode}
              readingLayout={layout}
            />
          </>
        ) : null}
        {!focusMode ? (
          <details className="group mb-8 rounded-[14px] border border-black/[0.1] dark:border-white/[0.11] lg:hidden">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 px-4 text-[13px] font-medium">
              <span className="inline-flex items-center gap-2">
                <ListTree
                  className="size-4"
                  strokeWidth={1.7}
                  aria-hidden="true"
                />
                Contents
              </span>
              <ChevronDown
                className="size-4 transition-transform group-open:rotate-180"
                strokeWidth={1.7}
                aria-hidden="true"
              />
            </summary>
            <TopicList
              key={`mobile-${selectedModuleTitle}`}
              subject={subject}
              selectedSlug={selectedSlug}
              completed={completed}
              onSelect={(slug) => selectTopic(slug, "contents_mobile")}
            />
          </details>
        ) : null}

        <div
          className={
            focusMode
              ? "grid items-start"
              : `grid items-start gap-12 lg:justify-between ${readerGridClass}`
          }
        >
          {!focusMode ? (
            <aside
              id="subject-reader-contents"
              className="relative sticky top-[178px] hidden h-[calc(100dvh-205px)] lg:block"
            >
              <div
                className="absolute inset-y-0 right-0 w-px bg-black/[0.06] dark:bg-white/[0.07]"
                aria-hidden="true"
              />
              <button
                type="button"
                onClick={() => setLeftSidebarOpen((current) => !current)}
                aria-expanded={leftSidebarOpen}
                aria-controls="subject-reader-contents-panel"
                aria-label={
                  leftSidebarOpen
                    ? "Collapse contents sidebar"
                    : "Expand contents sidebar"
                }
                title={
                  leftSidebarOpen
                    ? "Collapse contents sidebar"
                    : "Expand contents sidebar"
                }
                className="absolute right-0 top-1/2 inline-flex size-8 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[9px] border border-black/[0.08] bg-[#f7f7f5] text-[#505050] shadow-[0_2px_8px_rgba(20,20,20,0.06)] transition-[background-color,color,border-color,transform] hover:bg-[#ececea] hover:text-[#151515] active:scale-[0.94] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f7f5] dark:border-white/[0.1] dark:bg-[#181818] dark:text-[#c8c8c8] dark:shadow-[0_2px_9px_rgba(0,0,0,0.22)] dark:hover:bg-[#242424] dark:hover:text-white dark:focus-visible:ring-white/60 dark:focus-visible:ring-offset-[#0a0a0a]"
              >
                {leftSidebarOpen ? (
                  <ChevronLeft
                    className="size-4"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                ) : (
                  <ChevronRight
                    className="size-4"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                )}
              </button>
              <div
                id="subject-reader-contents-panel"
                className={
                  leftSidebarOpen ? "h-full overflow-y-auto pr-6" : "hidden"
                }
              >
                <p className="text-[12px] font-medium text-[#616161] dark:text-[#a8a8a8]">
                  Contents
                </p>
                <TopicList
                  key={`desktop-${selectedModuleTitle}`}
                  subject={subject}
                  selectedSlug={selectedSlug}
                  completed={completed}
                  onSelect={(slug) => selectTopic(slug, "contents_desktop")}
                  desktop
                />
              </div>
            </aside>
          ) : null}

          <div
            id="reading-preview-note"
            className={`min-w-0 ${focusMode ? "scroll-mt-6" : "scroll-mt-52"}`}
          >
            {layout === "topic" ? (
              <TopicByTopic
                topic={selectedTopic}
                mode={mode}
                selectedIndex={selectedIndex}
                topics={topics}
                completed={completed}
                saved={saved}
                onSelect={selectTopic}
                onToggleComplete={toggleCompleted}
                onToggleSaved={toggleSaved}
                reduceMotion={Boolean(reduceMotion)}
              />
            ) : (
              <AllNotes
                subject={subject}
                mode={mode}
                completed={completed}
                saved={saved}
                onToggleComplete={toggleCompleted}
                onToggleSaved={toggleSaved}
              />
            )}
          </div>

          {!focusMode ? (
            <aside
              id="subject-reader-actions"
              className="relative sticky top-[178px] hidden h-[calc(100dvh-205px)] xl:block"
            >
              <div
                className="absolute inset-y-0 left-0 w-px bg-black/[0.06] dark:bg-white/[0.07]"
                aria-hidden="true"
              />
              <button
                type="button"
                onClick={() => setRightSidebarOpen((current) => !current)}
                aria-expanded={rightSidebarOpen}
                aria-controls="subject-reader-actions-panel"
                aria-label={
                  rightSidebarOpen
                    ? "Collapse actions sidebar"
                    : "Expand actions sidebar"
                }
                title={
                  rightSidebarOpen
                    ? "Collapse actions sidebar"
                    : "Expand actions sidebar"
                }
                className="absolute left-0 top-1/2 inline-flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[9px] border border-black/[0.08] bg-[#f7f7f5] text-[#505050] shadow-[0_2px_8px_rgba(20,20,20,0.06)] transition-[background-color,color,border-color,transform] hover:bg-[#ececea] hover:text-[#151515] active:scale-[0.94] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f7f5] dark:border-white/[0.1] dark:bg-[#181818] dark:text-[#c8c8c8] dark:shadow-[0_2px_9px_rgba(0,0,0,0.22)] dark:hover:bg-[#242424] dark:hover:text-white dark:focus-visible:ring-white/60 dark:focus-visible:ring-offset-[#0a0a0a]"
              >
                {rightSidebarOpen ? (
                  <ChevronRight
                    className="size-4"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                ) : (
                  <ChevronLeft
                    className="size-4"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                )}
              </button>
              <div
                id="subject-reader-actions-panel"
                className={
                  rightSidebarOpen ? "h-full overflow-y-auto pl-6" : "hidden"
                }
              >
                <p className="text-[12px] leading-5 text-[#777] dark:text-[#999]">
                  {layout === "topic"
                    ? "Move one topic at a time."
                    : "Every topic is shown in one continuous document."}
                </p>
                <div className="mt-5 border-t border-black/[0.1] pt-5 dark:border-white/[0.11]">
                  <TopicActions
                    topic={selectedTopic}
                    completed={completed.includes(selectedTopic.slug)}
                    saved={saved.includes(selectedTopic.slug)}
                    onToggleComplete={() => toggleCompleted(selectedTopic.slug)}
                    onToggleSaved={() => toggleSaved(selectedTopic.slug)}
                    placement="sidebar"
                  />
                </div>
              </div>
            </aside>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function TopicList({
  subject,
  selectedSlug,
  completed,
  onSelect,
  desktop = false,
}: {
  subject: SubjectContent;
  selectedSlug: string;
  completed: string[];
  onSelect: (slug: string) => void;
  desktop?: boolean;
}) {
  const listId = useId().replace(/:/g, "");
  const activeModuleTitle = subject.modules.find((module) =>
    module.topics.some((topic) => topic.slug === selectedSlug),
  )?.title;
  const [openModules, setOpenModules] = useState<string[]>(() =>
    activeModuleTitle ? [activeModuleTitle] : [],
  );

  function toggleModule(title: string) {
    setOpenModules((current) =>
      current.includes(title)
        ? current.filter((moduleTitle) => moduleTitle !== title)
        : [...current, title],
    );
  }

  return (
    <div
      className={
        desktop
          ? "mt-4 space-y-1"
          : "max-h-[55vh] overflow-y-auto border-t border-black/[0.09] p-2 dark:border-white/[0.1]"
      }
    >
      {subject.modules.map((module, moduleIndex) => {
        const isOpen = openModules.includes(module.title);
        const panelId = `${listId}-module-${moduleIndex}`;

        return (
          <section key={module.title}>
            <h2>
              <button
                type="button"
                onClick={() => toggleModule(module.title)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className={`flex min-h-10 w-full items-center justify-between gap-3 rounded-[9px] px-2 py-2 text-left font-medium transition-colors hover:bg-black/[0.035] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:hover:bg-white/[0.05] dark:focus-visible:ring-white/50 ${
                  desktop ? "text-[11px]" : "text-[12px]"
                }`}
              >
                <span className="min-w-0 break-words leading-4">
                  {clean(module.title)}
                </span>
                <span className="flex shrink-0 items-center gap-1.5 text-[10px] font-normal text-[#777] dark:text-[#999]">
                  {module.topics.length}
                  <ChevronDown
                    className={`size-3.5 transition-transform motion-reduce:transition-none ${isOpen ? "rotate-180" : ""}`}
                    strokeWidth={1.7}
                    aria-hidden="true"
                  />
                </span>
              </button>
            </h2>
            <div
              id={panelId}
              className={
                isOpen
                  ? "ml-2 mt-1 space-y-1 border-l border-black/[0.09] pl-1.5 dark:border-white/[0.1]"
                  : "hidden"
              }
            >
              {module.topics.map((topic) => {
                const selected = topic.slug === selectedSlug;
                return (
                  <button
                    key={topic.slug}
                    type="button"
                    onClick={() => onSelect(topic.slug)}
                    className={`flex min-h-10 w-full items-center justify-between gap-3 rounded-[9px] px-2.5 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:focus-visible:ring-white/50 ${
                      desktop ? "text-[11px]" : "text-[12px]"
                    } ${
                      selected
                        ? "bg-black/[0.06] font-medium text-[#151515] dark:bg-white/[0.08] dark:text-white"
                        : "text-[#606060] hover:bg-black/[0.035] hover:text-[#151515] dark:text-[#a8a8a8] dark:hover:bg-white/[0.05] dark:hover:text-white"
                    }`}
                  >
                    <span className="min-w-0 break-words leading-4">
                      {clean(topic.title)}
                    </span>
                    {completed.includes(topic.slug) && (
                      <Check
                        className="size-3.5 shrink-0"
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function TopicByTopic({
  topic,
  mode,
  selectedIndex,
  topics,
  completed,
  saved,
  onSelect,
  onToggleComplete,
  onToggleSaved,
  reduceMotion,
}: {
  topic: SubjectTopic;
  mode: SubjectStudyMode;
  selectedIndex: number;
  topics: SubjectTopic[];
  completed: string[];
  saved: string[];
  onSelect: (slug: string, source: TopicViewSource) => void;
  onToggleComplete: (slug: string) => void;
  onToggleSaved: (slug: string) => void;
  reduceMotion: boolean;
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.article
        key={`${topic.slug}:${mode}`}
        initial={reduceMotion ? false : { opacity: 0, y: 7 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduceMotion ? undefined : { opacity: 0, y: -5 }}
        transition={{ duration: reduceMotion ? 0 : 0.18 }}
      >
        <TopicHeader topic={topic} mode={mode} />
        <div className="py-12">
          <TopicContent topic={topic} mode={mode} />
        </div>
        <TopicActions
          topic={topic}
          completed={completed.includes(topic.slug)}
          saved={saved.includes(topic.slug)}
          onToggleComplete={() => onToggleComplete(topic.slug)}
          onToggleSaved={() => onToggleSaved(topic.slug)}
        />
        <footer className="mt-7 grid gap-3 border-t border-black/[0.12] pt-6 dark:border-white/[0.13] sm:grid-cols-2">
          <button
            type="button"
            disabled={selectedIndex === 0}
            onClick={() =>
              onSelect(
                topics[Math.max(0, selectedIndex - 1)].slug,
                "previous_button",
              )
            }
            className="flex min-h-16 items-center gap-3 rounded-[12px] px-3 text-left text-[13px] transition-colors hover:bg-black/[0.035] disabled:cursor-not-allowed disabled:opacity-35 dark:hover:bg-white/[0.05]"
          >
            <ChevronLeft
              className="size-4"
              strokeWidth={1.7}
              aria-hidden="true"
            />
            <span>
              <span className="block text-[11px] text-[#616161] dark:text-[#a8a8a8]">
                Previous
              </span>
              <span className="mt-1 block font-medium">
                {clean(topics[Math.max(0, selectedIndex - 1)].title)}
              </span>
            </span>
          </button>
          <button
            type="button"
            disabled={selectedIndex === topics.length - 1}
            onClick={() =>
              onSelect(
                topics[Math.min(topics.length - 1, selectedIndex + 1)].slug,
                "next_button",
              )
            }
            className="flex min-h-16 items-center justify-end gap-3 rounded-[12px] px-3 text-right text-[13px] transition-colors hover:bg-black/[0.035] disabled:cursor-not-allowed disabled:opacity-35 dark:hover:bg-white/[0.05]"
          >
            <span>
              <span className="block text-[11px] text-[#616161] dark:text-[#a8a8a8]">
                Next
              </span>
              <span className="mt-1 block font-medium">
                {clean(
                  topics[Math.min(topics.length - 1, selectedIndex + 1)].title,
                )}
              </span>
            </span>
            <ChevronRight
              className="size-4"
              strokeWidth={1.7}
              aria-hidden="true"
            />
          </button>
        </footer>
      </motion.article>
    </AnimatePresence>
  );
}

function AllNotes({
  subject,
  mode,
  completed,
  saved,
  onToggleComplete,
  onToggleSaved,
}: {
  subject: SubjectContent;
  mode: SubjectStudyMode;
  completed: string[];
  saved: string[];
  onToggleComplete: (slug: string) => void;
  onToggleSaved: (slug: string) => void;
}) {
  return (
    <div>
      <div className="space-y-24 pb-14 sm:space-y-28">
        {subject.modules.map((module) => (
          <section key={module.title}>
            <header className="mb-12 border-b border-black/[0.12] pb-6 dark:border-white/[0.13]">
              <h2 className="text-[28px] font-semibold tracking-[-0.045em] sm:text-[34px]">
                {clean(module.title)}
              </h2>
              <p className="mt-3 text-[14px] leading-6 text-[#606060] dark:text-[#a8a8a8]">
                {clean(module.description)}
              </p>
            </header>
            <div className="space-y-14 sm:space-y-16">
              {module.topics.map((topic) => (
                <article
                  id={`all-note-${topic.slug}`}
                  key={topic.slug}
                  className="scroll-mt-52 border-b border-black/[0.1] pb-14 last:border-b-0 last:pb-0 dark:border-white/[0.11] sm:pb-16"
                >
                  <TopicHeader topic={topic} mode={mode} compact />
                  <div className="py-10">
                    <TopicContent topic={topic} mode={mode} />
                  </div>
                  <TopicActions
                    topic={topic}
                    completed={completed.includes(topic.slug)}
                    saved={saved.includes(topic.slug)}
                    onToggleComplete={() => onToggleComplete(topic.slug)}
                    onToggleSaved={() => onToggleSaved(topic.slug)}
                  />
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function TopicHeader({
  topic,
  mode,
  compact = false,
}: {
  topic: SubjectTopic;
  mode: SubjectStudyMode;
  compact?: boolean;
}) {
  return (
    <header className="border-b border-black/[0.12] pb-8 dark:border-white/[0.13]">
      <h2
        className={`text-balance font-semibold leading-[0.96] tracking-[-0.06em] ${compact ? "text-[clamp(2.25rem,4vw,3.8rem)]" : "text-[clamp(2.7rem,5vw,4.8rem)]"}`}
      >
        {clean(topic.title)}
      </h2>
      <p className="mt-5 max-w-[64ch] text-[16px] leading-8 text-[#505050] dark:text-[#b8b8b8]">
        {clean(mode === "learn" ? topic.learn.opening : topic.description)}
      </p>
    </header>
  );
}
