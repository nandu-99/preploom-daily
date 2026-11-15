"use client";

import { trackEvent } from "@/lib/analytics";
import type { SubjectStudyMode } from "@/lib/subject-content";
import { useEffect } from "react";

const engagementMilestones = [30, 60, 180] as const;

type ContentEngagementTrackerProps = {
  targetId: string;
  subjectSlug: string;
  topicSlug: string;
  topicName: string;
  moduleName: string;
  studyMode: SubjectStudyMode;
  readingLayout: "topic" | "all";
};

export function ContentEngagementTracker({
  targetId,
  subjectSlug,
  topicSlug,
  topicName,
  moduleName,
  studyMode,
  readingLayout,
}: ContentEngagementTrackerProps) {
  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;

    let contentVisible = false;
    let activeSeconds = 0;
    const reportedMilestones = new Set<number>();

    const observer = new IntersectionObserver(
      ([entry]) => {
        contentVisible = entry?.isIntersecting ?? false;
      },
      {
        rootMargin: "-20% 0px -20% 0px",
        threshold: 0,
      },
    );

    observer.observe(target);

    const interval = window.setInterval(() => {
      if (
        !contentVisible ||
        document.visibilityState !== "visible" ||
        !document.hasFocus()
      ) {
        return;
      }

      activeSeconds += 1;

      for (const milestone of engagementMilestones) {
        if (activeSeconds >= milestone && !reportedMilestones.has(milestone)) {
          reportedMilestones.add(milestone);
          trackEvent("content_engaged", {
            subject_slug: subjectSlug,
            topic_slug: topicSlug,
            topic_name: topicName,
            module_name: moduleName,
            study_mode: studyMode,
            reading_layout: readingLayout,
            engagement_seconds: milestone,
          });
        }
      }
    }, 1000);

    return () => {
      observer.disconnect();
      window.clearInterval(interval);
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
