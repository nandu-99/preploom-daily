"use client";

import { AdminHeader } from "@/components/admin/admin-header";
import { clearAdminToken, getAdminToken } from "@/lib/admin-session";
import { ArrowLeft, BookOpen, Plus, SquarePen, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { type FormEvent, useEffect, useRef, useState } from "react";

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";

type Subject = { id: string; name: string; slug: string };
type Topic = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  position: number;
};
type TopicDetail = Topic & { content: string };
type ApiResponse = {
  data?: { subject?: Subject; topics?: Topic[]; topic?: TopicDetail };
  error?: { message: string };
};

const emptyForm = {
  title: "",
  slug: "",
  summary: "",
  content: "",
  position: "0",
};

function sortTopics(topics: Topic[]) {
  return [...topics].sort(
    (first, second) =>
      first.position - second.position ||
      first.title.localeCompare(second.title),
  );
}

export default function AdminTopicsPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const titleInput = useRef<HTMLInputElement>(null);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingTopicId, setLoadingTopicId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pageError, setPageError] = useState("");
  const [formError, setFormError] = useState("");
  const [status, setStatus] = useState("");

  const subjectUrl = `${backendUrl}/subjects/${encodeURIComponent(slug)}`;
  const topicsUrl = `${subjectUrl}/topics`;

  useEffect(() => {
    const token = getAdminToken();

    if (!token) {
      router.replace("/admin");
      return;
    }

    async function loadPage() {
      try {
        const [adminResponse, subjectResponse, topicsResponse] =
          await Promise.all([
            fetch(`${backendUrl}/admin/me`, {
              headers: { authorization: `Bearer ${token}` },
            }),
            fetch(subjectUrl),
            fetch(topicsUrl),
          ]);

        if (!adminResponse.ok) {
          clearAdminToken();
          router.replace("/admin");
          return;
        }

        if (!subjectResponse.ok || !topicsResponse.ok) {
          setPageError(
            subjectResponse.status === 404
              ? "Subject not found. Return to the dashboard and choose another subject."
              : "Unable to load topics. Check that the backend is running.",
          );
          return;
        }

        const subjectBody = (await subjectResponse.json()) as ApiResponse;
        const topicsBody = (await topicsResponse.json()) as ApiResponse;

        if (!subjectBody.data?.subject || !topicsBody.data?.topics) {
          setPageError("Unable to load topics. Please try again.");
          return;
        }

        setSubject(subjectBody.data.subject);
        setTopics(sortTopics(topicsBody.data.topics));
      } catch {
        setPageError("The backend is unavailable. Check that it is running.");
      } finally {
        setLoading(false);
      }
    }

    void loadPage();
  }, [router, subjectUrl, topicsUrl]);

  function logout() {
    clearAdminToken();
    router.replace("/admin");
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
  }

  function startNewTopic() {
    resetForm();
    setStatus("");
    titleInput.current?.focus();
  }

  async function editTopic(topic: Topic) {
    setLoadingTopicId(topic.id);
    setPageError("");
    setStatus("");

    try {
      const response = await fetch(
        `${topicsUrl}/${encodeURIComponent(topic.slug)}`,
      );
      const body = (await response.json()) as ApiResponse;

      if (!response.ok || !body.data?.topic) {
        setPageError(body.error?.message ?? "Unable to load the topic.");
        return;
      }

      const detail = body.data.topic;
      setEditingId(detail.id);
      setForm({
        title: detail.title,
        slug: detail.slug,
        summary: detail.summary ?? "",
        content: detail.content,
        position: String(detail.position),
      });
      setFormError("");
      titleInput.current?.focus();
    } catch {
      setPageError("The backend is unavailable. Check that it is running.");
    } finally {
      setLoadingTopicId(null);
    }
  }

  async function saveTopic(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const token = getAdminToken();
    if (!token) return logout();

    const title = form.title.trim();
    const topicSlug = form.slug.trim().toLowerCase();
    const summary = form.summary.trim();
    const content = form.content.trim();
    const position = Number(form.position);

    if (title.length < 2 || title.length > 160) {
      setFormError("Title must be between 2 and 160 characters.");
      return;
    }
    if (
      topicSlug.length < 2 ||
      topicSlug.length > 160 ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(topicSlug)
    ) {
      setFormError("Use lowercase letters, numbers, and hyphens for the slug.");
      return;
    }
    if (summary.length > 0 && (summary.length < 10 || summary.length > 1000)) {
      setFormError("Summary must be between 10 and 1000 characters.");
      return;
    }
    if (content.length < 20) {
      setFormError("Content must be at least 20 characters.");
      return;
    }
    if (
      form.position.trim() === "" ||
      !Number.isInteger(position) ||
      position < 0
    ) {
      setFormError("Order must be a whole number of 0 or more.");
      return;
    }

    setSaving(true);
    setFormError("");
    setStatus("");

    try {
      const response = await fetch(
        editingId ? `${topicsUrl}/${encodeURIComponent(editingId)}` : topicsUrl,
        {
          method: editingId ? "PATCH" : "POST",
          headers: {
            authorization: `Bearer ${token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            title,
            slug: topicSlug,
            summary: summary || null,
            content,
            position,
          }),
        },
      );
      const body = (await response.json()) as ApiResponse;

      if (response.status === 401) return logout();
      if (!response.ok || !body.data?.topic) {
        setFormError(body.error?.message ?? "Unable to save the topic.");
        return;
      }

      const savedTopic = body.data.topic;
      setTopics((current) =>
        sortTopics(
          editingId
            ? current.map((topic) =>
                topic.id === savedTopic.id ? savedTopic : topic,
              )
            : [...current, savedTopic],
        ),
      );
      setStatus(editingId ? "Topic updated." : "Topic created.");
      resetForm();
    } catch {
      setFormError("The backend is unavailable. Check that it is running.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteTopic(topic: Topic) {
    if (!window.confirm(`Delete ${topic.title}? This cannot be undone.`))
      return;

    const token = getAdminToken();
    if (!token) return logout();

    setDeletingId(topic.id);
    setPageError("");
    setStatus("");

    try {
      const response = await fetch(
        `${topicsUrl}/${encodeURIComponent(topic.id)}`,
        {
          method: "DELETE",
          headers: { authorization: `Bearer ${token}` },
        },
      );

      if (response.status === 401) return logout();
      if (!response.ok) {
        const body = (await response.json()) as ApiResponse;
        setPageError(body.error?.message ?? "Unable to delete the topic.");
        return;
      }

      setTopics((current) => current.filter((item) => item.id !== topic.id));
      if (editingId === topic.id) resetForm();
      setStatus("Topic deleted.");
    } catch {
      setPageError("The backend is unavailable. Check that it is running.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-[100dvh] bg-[#f7f7f5] text-[#151515] dark:bg-[#0a0a0a] dark:text-[#f3f3f1]">
      <AdminHeader onLogout={logout} />
      <main>
        <section className="border-b border-black/[0.08] px-5 py-10 dark:border-white/[0.09] sm:px-6 sm:py-12 lg:px-8">
          <div className="mx-auto max-w-[1240px]">
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-2 rounded-[8px] text-[13px] font-medium text-[#606060] hover:text-[#151515] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:text-[#a8a8a8] dark:hover:text-white dark:focus-visible:ring-white/50"
            >
              <ArrowLeft
                className="size-4"
                strokeWidth={1.7}
                aria-hidden="true"
              />
              All subjects
            </Link>
            <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#606060] dark:text-[#a8a8a8]">
                  Topic management
                </p>
                <h1 className="mt-4 text-[clamp(2.3rem,5vw,4.4rem)] font-semibold leading-[0.96] tracking-[-0.055em]">
                  {subject?.name ?? "Topics"}
                </h1>
                <p className="mt-4 max-w-[52ch] text-[14px] leading-6 text-[#606060] dark:text-[#a8a8a8]">
                  Add learning content and set the order topics appear in.
                </p>
              </div>
              <button
                type="button"
                onClick={startNewTopic}
                disabled={!subject || loadingTopicId !== null}
                className="inline-flex h-11 w-fit items-center gap-2 rounded-[10px] bg-[#151515] px-4 text-[13px] font-medium text-white transition-[opacity,transform] hover:opacity-85 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:border dark:border-white/[0.14] dark:bg-[#f3f3f1] dark:text-[#151515]"
              >
                <Plus className="size-4" aria-hidden="true" />
                New topic
              </button>
            </div>
          </div>
        </section>

        <section className="px-5 py-10 sm:px-6 sm:py-12 lg:px-8">
          <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[minmax(320px,0.8fr)_minmax(0,1.2fr)] lg:items-start lg:gap-16">
            <form
              onSubmit={saveTopic}
              className="rounded-[16px] border border-black/[0.1] bg-black/[0.018] p-5 dark:border-white/[0.11] dark:bg-white/[0.025] sm:p-6"
              noValidate
            >
              <h2 className="text-[20px] font-semibold tracking-[-0.03em]">
                {editingId ? "Edit topic" : "Add topic"}
              </h2>
              <p className="mt-2 text-[12px] leading-5 text-[#606060] dark:text-[#a8a8a8]">
                The title, summary, and content are available through the public
                topic API.
              </p>

              <div className="mt-6 grid gap-5">
                <label
                  className="grid gap-2 text-[13px] font-medium"
                  htmlFor="topic-title"
                >
                  Title
                  <input
                    id="topic-title"
                    ref={titleInput}
                    required
                    maxLength={160}
                    value={form.title}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                    className="h-11 rounded-[10px] border border-black/[0.13] bg-white/70 px-3.5 text-[14px] font-normal outline-none focus:border-black/35 focus:ring-2 focus:ring-black/10 dark:border-white/[0.14] dark:bg-white/[0.04] dark:focus:border-white/35"
                    placeholder="Process scheduling"
                  />
                </label>
                <label
                  className="grid gap-2 text-[13px] font-medium"
                  htmlFor="topic-slug"
                >
                  Slug
                  <input
                    id="topic-slug"
                    required
                    maxLength={160}
                    value={form.slug}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        slug: event.target.value,
                      }))
                    }
                    className="h-11 rounded-[10px] border border-black/[0.13] bg-white/70 px-3.5 font-[family-name:var(--font-geist-mono)] text-[13px] font-normal outline-none focus:border-black/35 focus:ring-2 focus:ring-black/10 dark:border-white/[0.14] dark:bg-white/[0.04] dark:focus:border-white/35"
                    placeholder="process-scheduling"
                  />
                  <span className="text-[11px] font-normal leading-5 text-[#777] dark:text-[#8f8f8f]">
                    Use lowercase letters, numbers, and hyphens.
                  </span>
                </label>
                <label
                  className="grid gap-2 text-[13px] font-medium"
                  htmlFor="topic-summary"
                >
                  Summary
                  <textarea
                    id="topic-summary"
                    rows={3}
                    maxLength={1000}
                    value={form.summary}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        summary: event.target.value,
                      }))
                    }
                    className="resize-y rounded-[10px] border border-black/[0.13] bg-white/70 px-3.5 py-3 text-[14px] font-normal leading-6 outline-none focus:border-black/35 focus:ring-2 focus:ring-black/10 dark:border-white/[0.14] dark:bg-white/[0.04] dark:focus:border-white/35"
                    placeholder="A short overview of this topic."
                  />
                </label>
                <label
                  className="grid gap-2 text-[13px] font-medium"
                  htmlFor="topic-content"
                >
                  Content
                  <textarea
                    id="topic-content"
                    rows={12}
                    required
                    value={form.content}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        content: event.target.value,
                      }))
                    }
                    className="resize-y rounded-[10px] border border-black/[0.13] bg-white/70 px-3.5 py-3 font-[family-name:var(--font-geist-mono)] text-[13px] font-normal leading-6 outline-none focus:border-black/35 focus:ring-2 focus:ring-black/10 dark:border-white/[0.14] dark:bg-white/[0.04] dark:focus:border-white/35"
                    placeholder="Write the learning notes for this topic."
                  />
                  <span className="text-[11px] font-normal leading-5 text-[#777] dark:text-[#8f8f8f]">
                    Write at least 20 characters. Plain text is supported.
                  </span>
                </label>
                <label
                  className="grid gap-2 text-[13px] font-medium"
                  htmlFor="topic-position"
                >
                  Order
                  <input
                    id="topic-position"
                    type="number"
                    min="0"
                    step="1"
                    required
                    value={form.position}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        position: event.target.value,
                      }))
                    }
                    className="h-11 w-32 rounded-[10px] border border-black/[0.13] bg-white/70 px-3.5 font-[family-name:var(--font-geist-mono)] text-[13px] font-normal outline-none focus:border-black/35 focus:ring-2 focus:ring-black/10 dark:border-white/[0.14] dark:bg-white/[0.04] dark:focus:border-white/35"
                  />
                  <span className="text-[11px] font-normal leading-5 text-[#777] dark:text-[#8f8f8f]">
                    Lower numbers appear first.
                  </span>
                </label>
              </div>

              {formError ? (
                <p
                  role="alert"
                  className="mt-4 rounded-[10px] border border-red-700/20 bg-red-700/[0.06] px-3.5 py-3 text-[13px] text-red-800 dark:border-red-300/20 dark:bg-red-300/[0.07] dark:text-red-200"
                >
                  {formError}
                </p>
              ) : null}

              <div className="mt-6 flex flex-col gap-2 min-[420px]:flex-row">
                <button
                  type="submit"
                  disabled={!subject || saving || loadingTopicId !== null}
                  className="inline-flex h-11 items-center justify-center rounded-[10px] bg-[#151515] px-4 text-[13px] font-medium text-white transition-[opacity,transform] hover:opacity-85 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-55 dark:border dark:border-white/[0.14] dark:bg-[#f3f3f1] dark:text-[#151515]"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Save changes"
                      : "Create topic"}
                </button>
                {editingId ? (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="inline-flex h-11 items-center justify-center rounded-[10px] border border-black/[0.12] px-4 text-[13px] font-medium hover:bg-black/[0.04] active:scale-[0.98] dark:border-white/[0.13] dark:hover:bg-white/[0.05]"
                  >
                    Cancel
                  </button>
                ) : null}
              </div>
            </form>

            <div className="min-w-0">
              <div className="flex items-center justify-between gap-4 border-b border-black/[0.12] pb-4 dark:border-white/[0.13]">
                <h2 className="text-[16px] font-semibold tracking-[-0.02em]">
                  All topics
                </h2>
                <span className="font-[family-name:var(--font-geist-mono)] text-[11px] text-[#777] dark:text-[#8f8f8f]">
                  {topics.length} total
                </span>
              </div>

              {status ? (
                <p
                  role="status"
                  className="mt-4 text-[13px] font-medium text-[#555] dark:text-[#b3b3b3]"
                >
                  {status}
                </p>
              ) : null}
              {pageError ? (
                <p
                  role="alert"
                  className="mt-4 rounded-[10px] border border-red-700/20 bg-red-700/[0.06] px-3.5 py-3 text-[13px] text-red-800 dark:border-red-300/20 dark:bg-red-300/[0.07] dark:text-red-200"
                >
                  {pageError}
                </p>
              ) : null}

              {loading ? (
                <div className="grid gap-3 py-5" aria-label="Loading topics">
                  {[0, 1, 2].map((item) => (
                    <div
                      key={item}
                      className="h-24 animate-pulse rounded-[12px] bg-black/[0.045] dark:bg-white/[0.06]"
                    />
                  ))}
                </div>
              ) : subject && topics.length === 0 ? (
                <div className="py-16 text-center">
                  <BookOpen
                    className="mx-auto size-7 text-[#777]"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <h3 className="mt-5 text-[18px] font-medium tracking-[-0.02em]">
                    No topics yet
                  </h3>
                  <p className="mx-auto mt-2 max-w-sm text-[13px] leading-6 text-[#606060] dark:text-[#a8a8a8]">
                    Use the form to add the first topic to this subject.
                  </p>
                </div>
              ) : (
                <div className="grid">
                  {topics.map((topic) => (
                    <article
                      key={topic.id}
                      className="grid gap-4 border-b border-black/[0.09] py-6 dark:border-white/[0.1] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start"
                    >
                      <div className="min-w-0">
                        <h3 className="text-[17px] font-medium tracking-[-0.025em]">
                          {topic.title}
                        </h3>
                        <p className="mt-1 font-[family-name:var(--font-geist-mono)] text-[11px] text-[#777] dark:text-[#8f8f8f]">
                          /{topic.slug} | Order {topic.position}
                        </p>
                        {topic.summary ? (
                          <p className="mt-3 max-w-[62ch] text-[13px] leading-6 text-[#606060] dark:text-[#a8a8a8]">
                            {topic.summary}
                          </p>
                        ) : null}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => void editTopic(topic)}
                          disabled={loadingTopicId !== null}
                          title={`Edit ${topic.title}`}
                          className="grid size-9 place-items-center rounded-[9px] border border-black/[0.1] text-[#606060] transition-colors hover:border-black/25 hover:text-[#151515] active:scale-[0.96] disabled:opacity-45 dark:border-white/[0.11] dark:text-[#a8a8a8] dark:hover:border-white/25 dark:hover:text-white"
                        >
                          <SquarePen
                            className="size-4"
                            strokeWidth={1.7}
                            aria-hidden="true"
                          />
                          <span className="sr-only">Edit {topic.title}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => void deleteTopic(topic)}
                          disabled={deletingId === topic.id}
                          title={`Delete ${topic.title}`}
                          className="grid size-9 place-items-center rounded-[9px] border border-black/[0.1] text-[#606060] transition-colors hover:border-red-700/30 hover:text-red-700 active:scale-[0.96] disabled:opacity-45 dark:border-white/[0.11] dark:text-[#a8a8a8] dark:hover:border-red-300/30 dark:hover:text-red-300"
                        >
                          <Trash2
                            className="size-4"
                            strokeWidth={1.7}
                            aria-hidden="true"
                          />
                          <span className="sr-only">Delete {topic.title}</span>
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
