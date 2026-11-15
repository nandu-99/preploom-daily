import type { QuizDefinition } from "@/content/quizzes";

const backendUrl =
  process.env.BACKEND_URL ??
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  "http://localhost:4000";

export async function getPublicQuiz(
  slug: string,
): Promise<QuizDefinition | null> {
  try {
    const response = await fetch(
      `${backendUrl}/quizzes/${encodeURIComponent(slug)}`,
      {
        cache: "no-store",
      },
    );
    if (!response.ok) return null;
    const body = (await response.json()) as {
      data?: { quiz?: QuizDefinition };
    };
    return body.data?.quiz ?? null;
  } catch {
    return null;
  }
}
