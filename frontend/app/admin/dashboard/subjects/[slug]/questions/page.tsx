"use client";

import { AdminHeader } from "@/components/admin/admin-header";
import { clearAdminToken, getAdminToken } from "@/lib/admin-session";
import { ArrowLeft, CircleHelp, Plus, SquarePen, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { type FormEvent, useEffect, useRef, useState } from "react";

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";

type Subject = { id: string; name: string; slug: string };
type Question = { id: string; prompt: string; slug: string; position: number };
type QuestionDetail = Question & { answer: string };
type ApiResponse = {
  data?: {
    subject?: Subject;
    questions?: Question[];
    question?: QuestionDetail;
  };
  error?: { message: string };
};

const emptyForm = { prompt: "", slug: "", answer: "", position: "0" };

function sortQuestions(questions: Question[]) {
  return [...questions].sort(
    (first, second) =>
      first.position - second.position ||
      first.prompt.localeCompare(second.prompt),
  );
}

export default function AdminQuestionsPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const promptInput = useRef<HTMLTextAreaElement>(null);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingQuestionId, setLoadingQuestionId] = useState<string | null>(
    null,
  );
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pageError, setPageError] = useState("");
  const [formError, setFormError] = useState("");
  const [status, setStatus] = useState("");

  const subjectUrl = `${backendUrl}/subjects/${encodeURIComponent(slug)}`;
  const questionsUrl = `${subjectUrl}/questions`;

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      router.replace("/admin");
      return;
    }

    async function loadPage() {
      try {
        const [adminResponse, subjectResponse, questionsResponse] =
          await Promise.all([
            fetch(`${backendUrl}/admin/me`, {
              headers: { authorization: `Bearer ${token}` },
            }),
            fetch(subjectUrl),
            fetch(questionsUrl),
          ]);

        if (!adminResponse.ok) {
          clearAdminToken();
          router.replace("/admin");
          return;
        }

        if (!subjectResponse.ok || !questionsResponse.ok) {
          setPageError(
            subjectResponse.status === 404
              ? "Subject not found. Return to the dashboard and choose another subject."
              : "Unable to load questions. Check that the backend is running.",
          );
          return;
        }

        const subjectBody = (await subjectResponse.json()) as ApiResponse;
        const questionsBody = (await questionsResponse.json()) as ApiResponse;

        if (!subjectBody.data?.subject || !questionsBody.data?.questions) {
          setPageError("Unable to load questions. Please try again.");
          return;
        }

        setSubject(subjectBody.data.subject);
        setQuestions(sortQuestions(questionsBody.data.questions));
      } catch {
        setPageError("The backend is unavailable. Check that it is running.");
      } finally {
        setLoading(false);
      }
    }

    void loadPage();
  }, [router, subjectUrl, questionsUrl]);

  function logout() {
    clearAdminToken();
    router.replace("/admin");
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
  }

  function startNewQuestion() {
    resetForm();
    setStatus("");
    promptInput.current?.focus();
  }

  async function editQuestion(question: Question) {
    setLoadingQuestionId(question.id);
    setPageError("");
    setStatus("");

    try {
      const response = await fetch(
        `${questionsUrl}/${encodeURIComponent(question.slug)}`,
      );
      const body = (await response.json()) as ApiResponse;

      if (!response.ok || !body.data?.question) {
        setPageError(body.error?.message ?? "Unable to load the question.");
        return;
      }

      const detail = body.data.question;
      setEditingId(detail.id);
      setForm({
        prompt: detail.prompt,
        slug: detail.slug,
        answer: detail.answer,
        position: String(detail.position),
      });
      setFormError("");
      promptInput.current?.focus();
    } catch {
      setPageError("The backend is unavailable. Check that it is running.");
    } finally {
      setLoadingQuestionId(null);
    }
  }

  async function saveQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const token = getAdminToken();
    if (!token) return logout();

    const prompt = form.prompt.trim();
    const questionSlug = form.slug.trim().toLowerCase();
    const answer = form.answer.trim();
    const position = Number(form.position);

    if (prompt.length < 10) {
      setFormError("Prompt must be at least 10 characters.");
      return;
    }
    if (
      questionSlug.length < 2 ||
      questionSlug.length > 160 ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(questionSlug)
    ) {
      setFormError("Use lowercase letters, numbers, and hyphens for the slug.");
      return;
    }
    if (answer.length < 20) {
      setFormError("Answer must be at least 20 characters.");
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
        editingId
          ? `${questionsUrl}/${encodeURIComponent(editingId)}`
          : questionsUrl,
        {
          method: editingId ? "PATCH" : "POST",
          headers: {
            authorization: `Bearer ${token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            prompt,
            slug: questionSlug,
            answer,
            position,
          }),
        },
      );
      const body = (await response.json()) as ApiResponse;

      if (response.status === 401) return logout();
      if (!response.ok || !body.data?.question) {
        setFormError(body.error?.message ?? "Unable to save the question.");
        return;
      }

      const savedQuestion = body.data.question;
      setQuestions((current) =>
        sortQuestions(
          editingId
            ? current.map((question) =>
                question.id === savedQuestion.id ? savedQuestion : question,
              )
            : [...current, savedQuestion],
        ),
      );
      setStatus(editingId ? "Question updated." : "Question created.");
      resetForm();
    } catch {
      setFormError("The backend is unavailable. Check that it is running.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteQuestion(question: Question) {
    if (!window.confirm(`Delete ${question.prompt}? This cannot be undone.`))
      return;

    const token = getAdminToken();
    if (!token) return logout();

    setDeletingId(question.id);
    setPageError("");
    setStatus("");

    try {
      const response = await fetch(
        `${questionsUrl}/${encodeURIComponent(question.id)}`,
        {
          method: "DELETE",
          headers: { authorization: `Bearer ${token}` },
        },
      );

      if (response.status === 401) return logout();
      if (!response.ok) {
        const body = (await response.json()) as ApiResponse;
        setPageError(body.error?.message ?? "Unable to delete the question.");
        return;
      }

      setQuestions((current) =>
        current.filter((item) => item.id !== question.id),
      );
      if (editingId === question.id) resetForm();
      setStatus("Question deleted.");
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
                  Question management
                </p>
                <h1 className="mt-4 text-[clamp(2.3rem,5vw,4.4rem)] font-semibold leading-[0.96] tracking-[-0.055em]">
                  {subject?.name ?? "Questions"}
                </h1>
                <p className="mt-4 max-w-[52ch] text-[14px] leading-6 text-[#606060] dark:text-[#a8a8a8]">
                  Add interview questions and set the order they appear in.
                </p>
              </div>
              <button
                type="button"
                onClick={startNewQuestion}
                disabled={!subject || loadingQuestionId !== null}
                className="inline-flex h-11 w-fit items-center gap-2 rounded-[10px] bg-[#151515] px-4 text-[13px] font-medium text-white transition-[opacity,transform] hover:opacity-85 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:border dark:border-white/[0.14] dark:bg-[#f3f3f1] dark:text-[#151515]"
              >
                <Plus className="size-4" aria-hidden="true" />
                New question
              </button>
            </div>
          </div>
        </section>

        <section className="px-5 py-10 sm:px-6 sm:py-12 lg:px-8">
          <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[minmax(320px,0.8fr)_minmax(0,1.2fr)] lg:items-start lg:gap-16">
            <form
              onSubmit={saveQuestion}
              className="rounded-[16px] border border-black/[0.1] bg-black/[0.018] p-5 dark:border-white/[0.11] dark:bg-white/[0.025] sm:p-6"
              noValidate
            >
              <h2 className="text-[20px] font-semibold tracking-[-0.03em]">
                {editingId ? "Edit question" : "Add question"}
              </h2>
              <p className="mt-2 text-[12px] leading-5 text-[#606060] dark:text-[#a8a8a8]">
                The prompt and answer are available through the public question
                API.
              </p>

              <div className="mt-6 grid gap-5">
                <label
                  className="grid gap-2 text-[13px] font-medium"
                  htmlFor="question-prompt"
                >
                  Prompt
                  <textarea
                    id="question-prompt"
                    ref={promptInput}
                    rows={3}
                    required
                    value={form.prompt}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        prompt: event.target.value,
                      }))
                    }
                    className="resize-y rounded-[10px] border border-black/[0.13] bg-white/70 px-3.5 py-3 text-[14px] font-normal leading-6 outline-none focus:border-black/35 focus:ring-2 focus:ring-black/10 dark:border-white/[0.14] dark:bg-white/[0.04] dark:focus:border-white/35"
                    placeholder="What is process scheduling?"
                  />
                </label>
                <label
                  className="grid gap-2 text-[13px] font-medium"
                  htmlFor="question-slug"
                >
                  Slug
                  <input
                    id="question-slug"
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
                  htmlFor="question-answer"
                >
                  Answer
                  <textarea
                    id="question-answer"
                    rows={12}
                    required
                    value={form.answer}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        answer: event.target.value,
                      }))
                    }
                    className="resize-y rounded-[10px] border border-black/[0.13] bg-white/70 px-3.5 py-3 font-[family-name:var(--font-geist-mono)] text-[13px] font-normal leading-6 outline-none focus:border-black/35 focus:ring-2 focus:ring-black/10 dark:border-white/[0.14] dark:bg-white/[0.04] dark:focus:border-white/35"
                    placeholder="Write a clear answer for learners."
                  />
                  <span className="text-[11px] font-normal leading-5 text-[#777] dark:text-[#8f8f8f]">
                    Write at least 20 characters. Plain text is supported.
                  </span>
                </label>
                <label
                  className="grid gap-2 text-[13px] font-medium"
                  htmlFor="question-position"
                >
                  Order
                  <input
                    id="question-position"
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
                  disabled={!subject || saving || loadingQuestionId !== null}
                  className="inline-flex h-11 items-center justify-center rounded-[10px] bg-[#151515] px-4 text-[13px] font-medium text-white transition-[opacity,transform] hover:opacity-85 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-55 dark:border dark:border-white/[0.14] dark:bg-[#f3f3f1] dark:text-[#151515]"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Save changes"
                      : "Create question"}
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
                  All questions
                </h2>
                <span className="font-[family-name:var(--font-geist-mono)] text-[11px] text-[#777] dark:text-[#8f8f8f]">
                  {questions.length} total
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
                <div className="grid gap-3 py-5" aria-label="Loading questions">
                  {[0, 1, 2].map((item) => (
                    <div
                      key={item}
                      className="h-24 animate-pulse rounded-[12px] bg-black/[0.045] dark:bg-white/[0.06]"
                    />
                  ))}
                </div>
              ) : subject && questions.length === 0 ? (
                <div className="py-16 text-center">
                  <CircleHelp
                    className="mx-auto size-7 text-[#777]"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <h3 className="mt-5 text-[18px] font-medium tracking-[-0.02em]">
                    No questions yet
                  </h3>
                  <p className="mx-auto mt-2 max-w-sm text-[13px] leading-6 text-[#606060] dark:text-[#a8a8a8]">
                    Use the form to add the first question to this subject.
                  </p>
                </div>
              ) : (
                <div className="grid">
                  {questions.map((question) => (
                    <article
                      key={question.id}
                      className="grid gap-4 border-b border-black/[0.09] py-6 dark:border-white/[0.1] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start"
                    >
                      <div className="min-w-0">
                        <h3 className="text-[17px] font-medium tracking-[-0.025em]">
                          {question.prompt}
                        </h3>
                        <p className="mt-1 font-[family-name:var(--font-geist-mono)] text-[11px] text-[#777] dark:text-[#8f8f8f]">
                          /{question.slug} | Order {question.position}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => void editQuestion(question)}
                          disabled={loadingQuestionId !== null}
                          title={`Edit ${question.prompt}`}
                          className="grid size-9 place-items-center rounded-[9px] border border-black/[0.1] text-[#606060] transition-colors hover:border-black/25 hover:text-[#151515] active:scale-[0.96] disabled:opacity-45 dark:border-white/[0.11] dark:text-[#a8a8a8] dark:hover:border-white/25 dark:hover:text-white"
                        >
                          <SquarePen
                            className="size-4"
                            strokeWidth={1.7}
                            aria-hidden="true"
                          />
                          <span className="sr-only">
                            Edit {question.prompt}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => void deleteQuestion(question)}
                          disabled={deletingId === question.id}
                          title={`Delete ${question.prompt}`}
                          className="grid size-9 place-items-center rounded-[9px] border border-black/[0.1] text-[#606060] transition-colors hover:border-red-700/30 hover:text-red-700 active:scale-[0.96] disabled:opacity-45 dark:border-white/[0.11] dark:text-[#a8a8a8] dark:hover:border-red-300/30 dark:hover:text-red-300"
                        >
                          <Trash2
                            className="size-4"
                            strokeWidth={1.7}
                            aria-hidden="true"
                          />
                          <span className="sr-only">
                            Delete {question.prompt}
                          </span>
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
