"use client";

import { trackEvent } from "@/lib/analytics";
import type { SubjectStudyMode } from "@/lib/subject-content";
import { useEffect } from "react";

const scrollThresholds = [25, 50, 75, 90] as const;

type ContentScrollTrackerProps = {
  targetId: string;
  subjectSlug: string;
  topicSlug?: string;
  topicName?: string;
  moduleName?: string;
  studyMode: SubjectStudyMode;
  readingLayout: "topic" | "all";
};

export function ContentScrollTracker({
  targetId,
  subjectSlug,
  topicSlug,
  topicName,
  moduleName,
  studyMode,
  readingLayout,
}: ContentScrollTrackerProps) {
  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;

    const reachedThresholds = new Set<number>();
    let animationFrame = 0;
    let ready = false;

    const measure = () => {
      animationFrame = 0;

      const rect = target.getBoundingClientRect();
      if (rect.height <= 0) return;

      const visibleDepth = window.innerHeight - rect.top;
      const percentage = Math.min(
        100,
        Math.max(0, (visibleDepth / rect.height) * 100),
      );

      for (const threshold of scrollThresholds) {
        if (percentage >= threshold && !reachedThresholds.has(threshold)) {
          reachedThresholds.add(threshold);
          trackEvent("content_scroll", {
            subject_slug: subjectSlug,
            topic_slug: topicSlug,
            topic_name: topicName,
            module_name: moduleName,
            study_mode: studyMode,
            reading_layout: readingLayout,
            content_type: readingLayout === "topic" ? "topic" : "all_notes",
            scroll_threshold: threshold,
          });
        }
      }
    };

    const scheduleMeasurement = () => {
      if (!ready) return;
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(measure);
    };

    const resizeObserver = new ResizeObserver(scheduleMeasurement);
    resizeObserver.observe(target);
    window.addEventListener("scroll", scheduleMeasurement, { passive: true });
    window.addEventListener("resize", scheduleMeasurement);
    const readyTimer = window.setTimeout(() => {
      ready = true;
      scheduleMeasurement();
    }, 600);

    return () => {
      window.clearTimeout(readyTimer);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", scheduleMeasurement);
      window.removeEventListener("resize", scheduleMeasurement);
    };
  }, [
    moduleName,
    readingLayout,
    studyMode,
    subjectSlug,
    targetId,
    topicName,
    topicSlug,
  ]);

  return null;
}
