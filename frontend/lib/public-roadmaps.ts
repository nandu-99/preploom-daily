import type { Roadmap } from "@/components/roadmaps/roadmap-explorer";

const backendUrl =
  process.env.BACKEND_URL ??
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  "http://localhost:4000";

export async function getPublicRoadmaps(): Promise<Roadmap[]> {
  try {
    const response = await fetch(`${backendUrl}/roadmaps`, {
      cache: "no-store",
    });
    if (!response.ok) return [];
    const body = (await response.json()) as { data?: { roadmaps?: Roadmap[] } };
    return Array.isArray(body.data?.roadmaps) ? body.data.roadmaps : [];
  } catch {
    return [];
  }
}
