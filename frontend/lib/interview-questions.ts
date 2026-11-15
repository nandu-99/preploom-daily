const backendUrl =
  process.env.BACKEND_URL ??
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  "http://localhost:4000";

export async function getInterviewQuestions<T>(slug: string): Promise<T[]> {
  try {
    const response = await fetch(
      `${backendUrl}/interview-questions/${encodeURIComponent(slug)}`,
      { cache: "no-store" },
    );
    if (!response.ok) return [];
    const body = (await response.json()) as {
      data?: { collection?: { questions?: T[] } };
    };
    return Array.isArray(body.data?.collection?.questions)
      ? body.data.collection.questions
      : [];
  } catch {
    return [];
  }
}

export async function getInterviewCounts(): Promise<Record<string, number>> {
  try {
    const response = await fetch(`${backendUrl}/interview-questions`, {
      cache: "no-store",
    });
    if (!response.ok) return {};
    const body = (await response.json()) as {
      data?: { collections?: { slug: string; count: number }[] };
    };
    return Object.fromEntries(
      (body.data?.collections ?? []).map((item) => [item.slug, item.count]),
    );
  } catch {
    return {};
  }
}
