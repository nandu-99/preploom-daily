import { redirect } from "next/navigation";

export default async function QuestionPage({ params }: { params: Promise<{ slug: string; questionSlug: string }> }) {
  const { slug, questionSlug } = await params;
  redirect(`/interview-questions/${encodeURIComponent(slug)}#${encodeURIComponent(questionSlug)}`);
}
