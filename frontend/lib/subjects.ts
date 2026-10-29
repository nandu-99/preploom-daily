export type Subject = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

export type TopicSummary = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  position: number;
};

export type Topic = TopicSummary & { content: string };

const backendUrl =
  process.env.BACKEND_URL ??
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  "http://localhost:4000";

export async function getSubjects(): Promise<Subject[] | null> {
  try {
    const response = await fetch(`${backendUrl}/subjects`, {
      cache: "no-store",
    });
    if (!response.ok) return null;

    const body = (await response.json()) as { data?: { subjects?: Subject[] } };
    return Array.isArray(body.data?.subjects) ? body.data.subjects : null;
  } catch {
    return null;
  }
}

export async function getSubject(
  slug: string,
): Promise<{ subject: Subject | null; unavailable: boolean }> {
  try {
    const response = await fetch(
      `${backendUrl}/subjects/${encodeURIComponent(slug)}`,
      { cache: "no-store" },
    );

    if (response.status === 404) {
      return { subject: null, unavailable: false };
    }

    if (!response.ok) {
      return { subject: null, unavailable: true };
    }

    const body = (await response.json()) as { data?: { subject?: Subject } };
    if (!body.data?.subject) {
      return { subject: null, unavailable: true };
    }

    return { subject: body.data.subject, unavailable: false };
  } catch {
    return { subject: null, unavailable: true };
  }
}

export async function getTopics(slug: string): Promise<TopicSummary[] | null> {
  try {
    const response = await fetch(
      `${backendUrl}/subjects/${encodeURIComponent(slug)}/topics`,
      { cache: "no-store" },
    );
    if (!response.ok) return null;

    const body = (await response.json()) as {
      data?: { topics?: TopicSummary[] };
    };
    return Array.isArray(body.data?.topics) ? body.data.topics : null;
  } catch {
    return null;
  }
}

export async function getTopic(
  subjectSlug: string,
  topicSlug: string,
): Promise<{ topic: Topic | null; unavailable: boolean }> {
  try {
    const response = await fetch(
      `${backendUrl}/subjects/${encodeURIComponent(subjectSlug)}/topics/${encodeURIComponent(topicSlug)}`,
      { cache: "no-store" },
    );

    if (response.status === 404) return { topic: null, unavailable: false };
    if (!response.ok) return { topic: null, unavailable: true };

    const body = (await response.json()) as { data?: { topic?: Topic } };
    return body.data?.topic
      ? { topic: body.data.topic, unavailable: false }
      : { topic: null, unavailable: true };
  } catch {
    return { topic: null, unavailable: true };
  }
}
