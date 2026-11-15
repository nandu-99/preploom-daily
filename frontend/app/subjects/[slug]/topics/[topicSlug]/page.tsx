import { redirect } from "next/navigation";

export default async function TopicPage({ params }: { params: Promise<{ slug: string; topicSlug: string }> }) {
  const { slug, topicSlug } = await params;
  redirect(`/subjects/${encodeURIComponent(slug)}?topic=${encodeURIComponent(topicSlug)}`);
}
