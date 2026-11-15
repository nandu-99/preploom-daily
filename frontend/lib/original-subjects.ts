import type { ReleaseAvailability } from "@/lib/release-status";

export type Subject = {
  order: string;
  slug: string;
  name: string;
  description: string;
  topics: string[];
  availability: ReleaseAvailability;
};
