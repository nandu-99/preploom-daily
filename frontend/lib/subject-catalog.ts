import type { Subject as CatalogSubject } from "@/lib/original-subjects";
import { getSubjects } from "@/lib/subjects";

const backendUrl =
  process.env.BACKEND_URL ??
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  "http://localhost:4000";

export async function getCatalogSubjects(): Promise<CatalogSubject[]> {
  try {
    const [catalogResponse, liveSubjects] = await Promise.all([
      fetch(`${backendUrl}/catalog/subjects`, { cache: "no-store" }),
      getSubjects(),
    ]);
    if (!catalogResponse.ok) return [];
    const body = (await catalogResponse.json()) as {
      data?: { subjects?: CatalogSubject[] };
    };
    const catalog = body.data?.subjects ?? [];
    const known = new Set(catalog.map((subject) => subject.slug));
    const additional = (liveSubjects ?? [])
      .filter((subject) => !known.has(subject.slug))
      .map((subject, index) => ({
        order: String(catalog.length + index + 1).padStart(2, "0"),
        slug: subject.slug,
        name: subject.name,
        description: subject.description ?? "",
        topics: [] as string[],
        availability: "available" as const,
      }));
    return [...catalog, ...additional];
  } catch {
    return [];
  }
}
