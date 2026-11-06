"use client";

import { AdminHeader } from "@/components/admin/admin-header";
import { clearAdminToken, getAdminToken } from "@/lib/admin-session";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  ListChecks,
  Plus,
  SquarePen,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { type FormEvent, useEffect, useRef, useState } from "react";

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";

type Subject = { id: string; name: string; slug: string };
type Question = {
  prompt: string;
  options: string[];
  correctOption: number;
  explanation: string | null;
};
type Quiz = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  position: number;
};
type QuizDetail = Quiz & { questions: Question[] };
type ApiResponse = {
  data?: {
    subject?: Subject;
    quizzes?: Quiz[];
    quiz?: QuizDetail;
  };
  error?: { message: string };
};
type FormQuestion = Question & { key: number };
type QuizForm = {
  title: string;
  slug: string;
  summary: string;
  position: string;
  questions: FormQuestion[];
};

function emptyForm(): QuizForm {
  return {
    title: "",
    slug: "",
    summary: "",
    position: "0",
    questions: [emptyQuestion(0)],
  };
}

function emptyQuestion(key: number): FormQuestion {
  return {
    key,
    prompt: "",
    options: ["", ""],
    correctOption: 0,
    explanation: "",
  };
}

function sortQuizzes(quizzes: Quiz[]) {
  return [...quizzes].sort(
    (first, second) =>
      first.position - second.position ||
      first.title.localeCompare(second.title),
  );
}

export default function AdminQuizzesPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const titleInput = useRef<HTMLInputElement>(null);
  const nextQuestionKey = useRef(1);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [form, setForm] = useState<QuizForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingQuizId, setLoadingQuizId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pageError, setPageError] = useState("");
  const [formError, setFormError] = useState("");
  const [status, setStatus] = useState("");

  const subjectUrl = `${backendUrl}/subjects/${encodeURIComponent(slug)}`;
  const quizzesUrl = `${subjectUrl}/quizzes`;

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      router.replace("/admin");
      return;
    }

    async function loadPage() {
      try {
        const [adminResponse, subjectResponse, quizzesResponse] =
          await Promise.all([
            fetch(`${backendUrl}/admin/me`, {
              headers: { authorization: `Bearer ${token}` },
            }),
            fetch(subjectUrl),
            fetch(quizzesUrl),
          ]);

        if (!adminResponse.ok) {
          clearAdminToken();
          router.replace("/admin");
          return;
        }

        if (!subjectResponse.ok || !quizzesResponse.ok) {
          setPageError(
            subjectResponse.status === 404
              ? "Subject not found. Return to the dashboard and choose another subject."
              : "Unable to load quizzes. Check that the backend is running.",
          );
          return;
        }

        const subjectBody = (await subjectResponse.json()) as ApiResponse;
        const quizzesBody = (await quizzesResponse.json()) as ApiResponse;
        if (!subjectBody.data?.subject || !quizzesBody.data?.quizzes) {
          setPageError("Unable to load quizzes. Please try again.");
          return;
        }

        setSubject(subjectBody.data.subject);
        setQuizzes(sortQuizzes(quizzesBody.data.quizzes));
      } catch {
        setPageError("The backend is unavailable. Check that it is running.");
      } finally {
        setLoading(false);
      }
    }

    void loadPage();
  }, [router, subjectUrl, quizzesUrl]);

  function logout() {
    clearAdminToken();
    router.replace("/admin");
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm());
    nextQuestionKey.current = 1;
    setFormError("");
  }

  function startNewQuiz() {
    resetForm();
    setStatus("");
    titleInput.current?.focus();
  }

  async function editQuiz(quiz: Quiz) {
    setLoadingQuizId(quiz.id);
    setPageError("");
    setStatus("");

    try {
      const response = await fetch(
        `${quizzesUrl}/${encodeURIComponent(quiz.slug)}/answer-key`,
        { headers: { authorization: `Bearer ${getAdminToken()}` } },
      );
      if (response.status === 401) return logout();
      const body = (await response.json()) as ApiResponse;
      if (!response.ok || !body.data?.quiz) {
        setPageError(body.error?.message ?? "Unable to load the quiz.");
        return;
      }

      const detail = body.data.quiz;
      nextQuestionKey.current = detail.questions.length;
      setEditingId(detail.id);
      setForm({
        title: detail.title,
        slug: detail.slug,
        summary: detail.summary ?? "",
        position: String(detail.position),
        questions: detail.questions.map((question, index) => ({
          ...question,
          key: index,
        })),
      });
      setFormError("");
      titleInput.current?.focus();
    } catch {
      setPageError("The backend is unavailable. Check that it is running.");
    } finally {
      setLoadingQuizId(null);
    }
  }

  function addQuestion() {
    const key = nextQuestionKey.current++;
    setForm((current) => ({
      ...current,
      questions: [...current.questions, emptyQuestion(key)],
    }));
  }

  function updateQuestion(
    key: number,
    field: "prompt" | "explanation",
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      questions: current.questions.map((question) =>
        question.key === key ? { ...question, [field]: value } : question,
      ),
    }));
  }

  function updateOption(key: number, optionIndex: number, value: string) {
    setForm((current) => ({
      ...current,
      questions: current.questions.map((question) =>
        question.key === key
          ? {
              ...question,
              options: question.options.map((option, index) =>
                index === optionIndex ? value : option,
              ),
            }
          : question,
      ),
    }));
  }

  function addOption(key: number) {
    setForm((current) => ({
      ...current,
      questions: current.questions.map((question) =>
        question.key === key && question.options.length < 6
          ? { ...question, options: [...question.options, ""] }
          : question,
      ),
    }));
  }

  function removeOption(key: number, optionIndex: number) {
    setForm((current) => ({
      ...current,
      questions: current.questions.map((question) => {
        if (question.key !== key || question.options.length <= 2)
          return question;
        return {
          ...question,
          options: question.options.filter((_, index) => index !== optionIndex),
          correctOption:
            question.correctOption === optionIndex
              ? 0
              : question.correctOption > optionIndex
                ? question.correctOption - 1
                : question.correctOption,
        };
      }),
    }));
  }

  function setCorrectOption(key: number, optionIndex: number) {
    setForm((current) => ({
      ...current,
      questions: current.questions.map((question) =>
        question.key === key
          ? { ...question, correctOption: optionIndex }
          : question,
      ),
    }));
  }

  function removeQuestion(key: number) {
    setForm((current) => ({
      ...current,
      questions:
        current.questions.length > 1
          ? current.questions.filter((question) => question.key !== key)
          : current.questions,
    }));
  }

  function moveQuestion(index: number, direction: -1 | 1) {
    setForm((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.questions.length) return current;
      const questions = [...current.questions];
      [questions[index], questions[target]] = [
        questions[target],
        questions[index],
      ];
      return { ...current, questions };
    });
  }

  async function saveQuiz(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const token = getAdminToken();
    if (!token) return logout();

    const title = form.title.trim();
    const quizSlug = form.slug.trim().toLowerCase();
    const summary = form.summary.trim();
    const position = Number(form.position);
    const questions = form.questions.map((question) => ({
      prompt: question.prompt.trim(),
      options: question.options.map((option) => option.trim()),
      correctOption: question.correctOption,
      explanation: question.explanation?.trim() || null,
    }));

    if (title.length < 2 || title.length > 160) {
      setFormError("Title must be between 2 and 160 characters.");
      return;
    }
    if (
      quizSlug.length < 2 ||
      quizSlug.length > 160 ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(quizSlug)
    ) {
      setFormError("Use lowercase letters, numbers, and hyphens for the slug.");
      return;
    }
    if (summary.length > 0 && (summary.length < 10 || summary.length > 1000)) {
      setFormError("Summary must be between 10 and 1000 characters.");
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
    if (
      questions.length === 0 ||
      questions.some(
        (question) =>
          question.prompt.length < 5 ||
          question.options.length < 2 ||
          question.options.length > 6 ||
          question.options.some((option) => !option) ||
          question.correctOption < 0 ||
          question.correctOption >= question.options.length,
      )
    ) {
      setFormError(
        "Each question needs a prompt, 2 to 6 filled options, and one correct answer.",
      );
      return;
    }

    setSaving(true);
    setFormError("");
    setStatus("");

    try {
      const response = await fetch(
        editingId
          ? `${quizzesUrl}/${encodeURIComponent(editingId)}`
          : quizzesUrl,
        {
          method: editingId ? "PATCH" : "POST",
          headers: {
            authorization: `Bearer ${token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            title,
            slug: quizSlug,
            summary: summary || null,
            position,
            questions,
          }),
        },
      );
      const body = (await response.json()) as ApiResponse;

      if (response.status === 401) return logout();
      if (!response.ok || !body.data?.quiz) {
        setFormError(body.error?.message ?? "Unable to save the quiz.");
        return;
      }

      const savedQuiz = body.data.quiz;
      setQuizzes((current) =>
        sortQuizzes(
          editingId
            ? current.map((quiz) =>
                quiz.id === savedQuiz.id ? savedQuiz : quiz,
              )
            : [...current, savedQuiz],
        ),
      );
      setStatus(editingId ? "Quiz updated." : "Quiz created.");
      resetForm();
    } catch {
      setFormError("The backend is unavailable. Check that it is running.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteQuiz(quiz: Quiz) {
    if (!window.confirm(`Delete ${quiz.title}? This cannot be undone.`)) return;

    const token = getAdminToken();
    if (!token) return logout();

    setDeletingId(quiz.id);
    setPageError("");
    setStatus("");

    try {
      const response = await fetch(
        `${quizzesUrl}/${encodeURIComponent(quiz.id)}`,
        {
          method: "DELETE",
          headers: { authorization: `Bearer ${token}` },
        },
      );
      if (response.status === 401) return logout();
      if (!response.ok) {
        const body = (await response.json()) as ApiResponse;
        setPageError(body.error?.message ?? "Unable to delete the quiz.");
        return;
      }

      setQuizzes((current) => current.filter((item) => item.id !== quiz.id));
      if (editingId === quiz.id) resetForm();
      setStatus("Quiz deleted.");
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
                  Quiz management
                </p>
                <h1 className="mt-4 text-[clamp(2.3rem,5vw,4.4rem)] font-semibold leading-[0.96] tracking-[-0.055em]">
                  {subject?.name ?? "Quizzes"}
                </h1>
                <p className="mt-4 max-w-[52ch] text-[14px] leading-6 text-[#606060] dark:text-[#a8a8a8]">
                  Create multiple choice quizzes and set the correct answer for
                  each question.
                </p>
              </div>
              <button
                type="button"
                onClick={startNewQuiz}
                disabled={!subject || loadingQuizId !== null}
                className="inline-flex h-11 w-fit items-center gap-2 rounded-[10px] bg-[#151515] px-4 text-[13px] font-medium text-white transition-[opacity,transform] hover:opacity-85 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:border dark:border-white/[0.14] dark:bg-[#f3f3f1] dark:text-[#151515]"
              >
                <Plus className="size-4" aria-hidden="true" />
                New quiz
              </button>
            </div>
          </div>
        </section>

        <section className="px-5 py-10 sm:px-6 sm:py-12 lg:px-8">
          <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[minmax(320px,0.8fr)_minmax(0,1.2fr)] lg:items-start lg:gap-16">
            <form
              onSubmit={saveQuiz}
              className="rounded-[16px] border border-black/[0.1] bg-black/[0.018] p-5 dark:border-white/[0.11] dark:bg-white/[0.025] sm:p-6"
              noValidate
            >
              <h2 className="text-[20px] font-semibold tracking-[-0.03em]">
                {editingId ? "Edit quiz" : "Add quiz"}
              </h2>
              <p className="mt-2 text-[12px] leading-5 text-[#606060] dark:text-[#a8a8a8]">
                Correct answers stay available only in the admin editor.
              </p>

              <div className="mt-6 grid gap-5">
                <label
                  className="grid gap-2 text-[13px] font-medium"
                  htmlFor="quiz-title"
                >
                  Title
                  <input
                    id="quiz-title"
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
                    placeholder="Operating Systems basics"
                  />
                </label>
                <label
                  className="grid gap-2 text-[13px] font-medium"
                  htmlFor="quiz-slug"
                >
                  Slug
                  <input
                    id="quiz-slug"
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
                    placeholder="operating-systems-basics"
                  />
                  <span className="text-[11px] font-normal leading-5 text-[#777] dark:text-[#8f8f8f]">
                    Use lowercase letters, numbers, and hyphens.
                  </span>
                </label>
                <label
                  className="grid gap-2 text-[13px] font-medium"
                  htmlFor="quiz-summary"
                >
                  Summary
                  <textarea
                    id="quiz-summary"
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
                    placeholder="A short overview of this quiz."
                  />
                </label>
                <label
                  className="grid gap-2 text-[13px] font-medium"
                  htmlFor="quiz-position"
                >
                  Order
                  <input
                    id="quiz-position"
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

              <div className="mt-8 border-t border-black/[0.12] pt-6 dark:border-white/[0.13]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-[16px] font-semibold tracking-[-0.02em]">
                      Questions
                    </h3>
                    <p className="mt-1 text-[12px] leading-5 text-[#606060] dark:text-[#a8a8a8]">
                      The order here is the order shown to learners.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="inline-flex h-9 shrink-0 items-center gap-1 rounded-[9px] border border-black/[0.12] px-3 text-[12px] font-medium hover:bg-black/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:border-white/[0.13] dark:hover:bg-white/[0.05] dark:focus-visible:ring-white/50"
                  >
                    <Plus className="size-4" aria-hidden="true" />
                    Add question
                  </button>
                </div>

                <div className="mt-5 grid gap-4">
                  {form.questions.map((question, index) => (
                    <div
                      key={question.key}
                      className="rounded-[12px] border border-black/[0.1] p-4 dark:border-white/[0.11]"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="font-[family-name:var(--font-geist-mono)] text-[12px] font-medium text-[#606060] dark:text-[#a8a8a8]">
                          Question {String(index + 1).padStart(2, "0")}
                        </h4>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => moveQuestion(index, -1)}
                            disabled={index === 0}
                            aria-label={`Move question ${index + 1} up`}
                            className="grid size-8 place-items-center rounded-[8px] border border-black/[0.1] text-[#606060] hover:text-[#151515] disabled:cursor-not-allowed disabled:opacity-35 dark:border-white/[0.11] dark:text-[#a8a8a8] dark:hover:text-white"
                          >
                            <ArrowUp className="size-4" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveQuestion(index, 1)}
                            disabled={index === form.questions.length - 1}
                            aria-label={`Move question ${index + 1} down`}
                            className="grid size-8 place-items-center rounded-[8px] border border-black/[0.1] text-[#606060] hover:text-[#151515] disabled:cursor-not-allowed disabled:opacity-35 dark:border-white/[0.11] dark:text-[#a8a8a8] dark:hover:text-white"
                          >
                            <ArrowDown className="size-4" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeQuestion(question.key)}
                            disabled={form.questions.length === 1}
                            aria-label={`Remove question ${index + 1}`}
                            className="grid size-8 place-items-center rounded-[8px] border border-black/[0.1] text-[#606060] hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-35 dark:border-white/[0.11] dark:text-[#a8a8a8] dark:hover:text-red-300"
                          >
                            <Trash2 className="size-4" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-4 grid gap-4">
                        <label
                          className="grid gap-2 text-[13px] font-medium"
                          htmlFor={`quiz-prompt-${question.key}`}
                        >
                          Prompt
                          <textarea
                            id={`quiz-prompt-${question.key}`}
                            rows={2}
                            required
                            value={question.prompt}
                            onChange={(event) =>
                              updateQuestion(
                                question.key,
                                "prompt",
                                event.target.value,
                              )
                            }
                            className="resize-y rounded-[10px] border border-black/[0.13] bg-white/70 px-3.5 py-3 text-[14px] font-normal leading-6 outline-none focus:border-black/35 focus:ring-2 focus:ring-black/10 dark:border-white/[0.14] dark:bg-white/[0.04] dark:focus:border-white/35"
                            placeholder="What does a process contain?"
                          />
                        </label>
                        <fieldset className="grid gap-3">
                          <legend className="text-[13px] font-medium">
                            Answer options
                          </legend>
                          <p className="text-[12px] text-[#606060] dark:text-[#a8a8a8]">
                            Select the correct answer.
                          </p>
                          {question.options.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className="flex items-center gap-2"
                            >
                              <input
                                type="radio"
                                name={`correct-${question.key}`}
                                checked={question.correctOption === optionIndex}
                                onChange={() =>
                                  setCorrectOption(question.key, optionIndex)
                                }
                                aria-label={`Option ${optionIndex + 1} is correct`}
                                className="size-4 shrink-0 accent-[#151515] dark:accent-white"
                              />
                              <input
                                value={option}
                                onChange={(event) =>
                                  updateOption(
                                    question.key,
                                    optionIndex,
                                    event.target.value,
                                  )
                                }
                                aria-label={`Option ${optionIndex + 1} for question ${index + 1}`}
                                className="h-11 min-w-0 flex-1 rounded-[10px] border border-black/[0.13] bg-white/70 px-3.5 text-[14px] outline-none focus:border-black/35 focus:ring-2 focus:ring-black/10 dark:border-white/[0.14] dark:bg-white/[0.04] dark:focus:border-white/35"
                                placeholder={`Option ${optionIndex + 1}`}
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  removeOption(question.key, optionIndex)
                                }
                                disabled={question.options.length <= 2}
                                aria-label={`Remove option ${optionIndex + 1} from question ${index + 1}`}
                                className="grid size-9 shrink-0 place-items-center rounded-[8px] border border-black/[0.1] text-[#606060] hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-35 dark:border-white/[0.11] dark:text-[#a8a8a8] dark:hover:text-red-300"
                              >
                                <Trash2 className="size-4" aria-hidden="true" />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => addOption(question.key)}
                            disabled={question.options.length >= 6}
                            className="inline-flex h-9 w-fit items-center gap-1 rounded-[9px] border border-black/[0.12] px-3 text-[12px] font-medium hover:bg-black/[0.04] disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/[0.13] dark:hover:bg-white/[0.05]"
                          >
                            <Plus className="size-4" aria-hidden="true" />
                            Add option
                          </button>
                        </fieldset>
                        <label
                          className="grid gap-2 text-[13px] font-medium"
                          htmlFor={`quiz-explanation-${question.key}`}
                        >
                          Explanation{" "}
                          <span className="text-[12px] font-normal text-[#777]">
                            Optional
                          </span>
                          <textarea
                            id={`quiz-explanation-${question.key}`}
                            rows={2}
                            value={question.explanation ?? ""}
                            onChange={(event) =>
                              updateQuestion(
                                question.key,
                                "explanation",
                                event.target.value,
                              )
                            }
                            className="resize-y rounded-[10px] border border-black/[0.13] bg-white/70 px-3.5 py-3 text-[14px] font-normal leading-6 outline-none focus:border-black/35 focus:ring-2 focus:ring-black/10 dark:border-white/[0.14] dark:bg-white/[0.04] dark:focus:border-white/35"
                            placeholder="Why is this answer correct?"
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
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
                  disabled={!subject || saving || loadingQuizId !== null}
                  className="inline-flex h-11 items-center justify-center rounded-[10px] bg-[#151515] px-4 text-[13px] font-medium text-white transition-[opacity,transform] hover:opacity-85 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-55 dark:border dark:border-white/[0.14] dark:bg-[#f3f3f1] dark:text-[#151515]"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Save changes"
                      : "Create quiz"}
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
                  All quizzes
                </h2>
                <span className="font-[family-name:var(--font-geist-mono)] text-[11px] text-[#777] dark:text-[#8f8f8f]">
                  {quizzes.length} total
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
                <div className="grid gap-3 py-5" aria-label="Loading quizzes">
                  {[0, 1, 2].map((item) => (
                    <div
                      key={item}
                      className="h-24 animate-pulse rounded-[12px] bg-black/[0.045] dark:bg-white/[0.06]"
                    />
                  ))}
                </div>
              ) : subject && quizzes.length === 0 ? (
                <div className="py-16 text-center">
                  <ListChecks
                    className="mx-auto size-7 text-[#777]"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <h3 className="mt-5 text-[18px] font-medium tracking-[-0.02em]">
                    No quizzes yet
                  </h3>
                  <p className="mx-auto mt-2 max-w-sm text-[13px] leading-6 text-[#606060] dark:text-[#a8a8a8]">
                    Use the form to add the first quiz to this subject.
                  </p>
                </div>
              ) : (
                <div className="grid">
                  {quizzes.map((quiz) => (
                    <article
                      key={quiz.id}
                      className="grid gap-4 border-b border-black/[0.09] py-6 dark:border-white/[0.1] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start"
                    >
                      <div className="min-w-0">
                        <h3 className="text-[17px] font-medium tracking-[-0.025em]">
                          {quiz.title}
                        </h3>
                        <p className="mt-1 font-[family-name:var(--font-geist-mono)] text-[11px] text-[#777] dark:text-[#8f8f8f]">
                          /{quiz.slug} | Order {quiz.position}
                        </p>
                        {quiz.summary ? (
                          <p className="mt-3 max-w-[62ch] text-[13px] leading-6 text-[#606060] dark:text-[#a8a8a8]">
                            {quiz.summary}
                          </p>
                        ) : null}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => void editQuiz(quiz)}
                          disabled={loadingQuizId !== null}
                          title={`Edit ${quiz.title}`}
                          className="grid size-9 place-items-center rounded-[9px] border border-black/[0.1] text-[#606060] transition-colors hover:border-black/25 hover:text-[#151515] active:scale-[0.96] disabled:opacity-45 dark:border-white/[0.11] dark:text-[#a8a8a8] dark:hover:border-white/25 dark:hover:text-white"
                        >
                          <SquarePen
                            className="size-4"
                            strokeWidth={1.7}
                            aria-hidden="true"
                          />
                          <span className="sr-only">Edit {quiz.title}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => void deleteQuiz(quiz)}
                          disabled={deletingId === quiz.id}
                          title={`Delete ${quiz.title}`}
                          className="grid size-9 place-items-center rounded-[9px] border border-black/[0.1] text-[#606060] transition-colors hover:border-red-700/30 hover:text-red-700 active:scale-[0.96] disabled:opacity-45 dark:border-white/[0.11] dark:text-[#a8a8a8] dark:hover:border-red-300/30 dark:hover:text-red-300"
                        >
                          <Trash2
                            className="size-4"
                            strokeWidth={1.7}
                            aria-hidden="true"
                          />
                          <span className="sr-only">Delete {quiz.title}</span>
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
