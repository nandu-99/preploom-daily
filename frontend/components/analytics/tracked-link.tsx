"use client";

import { trackEvent } from "@/lib/analytics";
import Link from "next/link";
import type { ComponentProps, MouseEventHandler } from "react";

type TrackedLinkProps = ComponentProps<typeof Link> & {
  eventParameters: Record<string, string | number | boolean | undefined>;
};

export function TrackedLink({
  eventParameters,
  onClick,
  ...props
}: TrackedLinkProps) {
  const handleClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    trackEvent("navigation_click", eventParameters);
  };

  return <Link {...props} onClick={handleClick} />;
}
