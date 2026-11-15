import { redirect } from "next/navigation";

export default async function QuizPage({ params }: { params: Promise<{ slug: string; quizSlug: string }> }) {
  const { quizSlug } = await params;
  redirect(`/quizzes/${encodeURIComponent(quizSlug)}`);
}
