"use client";


export type AnalyticsEventName =
  | "navigation_click"
  | "subject_select"
  | "topic_view"
  | "study_mode_change"
  | "reading_layout_change"
  | "topic_complete"
  | "topic_save"
  | "search"
  | "content_scroll"
  | "content_engaged";

type AnalyticsValue = string | number | boolean;

export type AnalyticsParameters = Record<string, AnalyticsValue | undefined>;

export function trackEvent(
  eventName: AnalyticsEventName,
  parameters: AnalyticsParameters = {},
) {
  const cleanParameters = Object.fromEntries(
    Object.entries(parameters).filter(([, value]) => value !== undefined),
  );

  if (typeof window !== "undefined") {
    const analytics = window as typeof window & {
      gtag?: (...args: unknown[]) => void;
    };
    analytics.gtag?.("event", eventName, cleanParameters);
  }

  if (process.env.NODE_ENV === "development") {
    console.debug("[PrepLoom Analytics]", eventName, cleanParameters);
  }
}
