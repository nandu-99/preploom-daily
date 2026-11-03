"use client";

import { AdminHeader } from "@/components/admin/admin-header";
import { clearAdminToken, getAdminToken } from "@/lib/admin-session";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Map,
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
type Step = { title: string; description: string };
type Roadmap = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  position: number;
};
type RoadmapDetail = Roadmap & { steps: Step[] };
type ApiResponse = {
  data?: {
    subject?: Subject;
    roadmaps?: Roadmap[];
    roadmap?: RoadmapDetail;
  };
  error?: { message: string };
};
type FormStep = Step & { key: number };
type RoadmapForm = {
  title: string;
  slug: string;
  summary: string;
  position: string;
  steps: FormStep[];
};

function emptyForm(): RoadmapForm {
  return {
    title: "",
    slug: "",
    summary: "",
    position: "0",
    steps: [{ key: 0, title: "", description: "" }],
  };
}

function sortRoadmaps(roadmaps: Roadmap[]) {
  return [...roadmaps].sort(
    (first, second) =>
      first.position - second.position ||
      first.title.localeCompare(second.title),
  );
}

export default function AdminRoadmapsPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const titleInput = useRef<HTMLInputElement>(null);
  const nextStepKey = useRef(1);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [form, setForm] = useState<RoadmapForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingRoadmapId, setLoadingRoadmapId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pageError, setPageError] = useState("");
  const [formError, setFormError] = useState("");
  const [status, setStatus] = useState("");

  const subjectUrl = `${backendUrl}/subjects/${encodeURIComponent(slug)}`;
  const roadmapsUrl = `${subjectUrl}/roadmaps`;

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      router.replace("/admin");
      return;
    }

    async function loadPage() {
      try {
        const [adminResponse, subjectResponse, roadmapsResponse] =
          await Promise.all([
            fetch(`${backendUrl}/admin/me`, {
              headers: { authorization: `Bearer ${token}` },
            }),
            fetch(subjectUrl),
            fetch(roadmapsUrl),
          ]);

        if (!adminResponse.ok) {
          clearAdminToken();
          router.replace("/admin");
          return;
        }

        if (!subjectResponse.ok || !roadmapsResponse.ok) {
          setPageError(
            subjectResponse.status === 404
              ? "Subject not found. Return to the dashboard and choose another subject."
              : "Unable to load roadmaps. Check that the backend is running.",
          );
          return;
        }

        const subjectBody = (await subjectResponse.json()) as ApiResponse;
        const roadmapsBody = (await roadmapsResponse.json()) as ApiResponse;
        if (!subjectBody.data?.subject || !roadmapsBody.data?.roadmaps) {
          setPageError("Unable to load roadmaps. Please try again.");
          return;
        }

        setSubject(subjectBody.data.subject);
        setRoadmaps(sortRoadmaps(roadmapsBody.data.roadmaps));
      } catch {
        setPageError("The backend is unavailable. Check that it is running.");
      } finally {
        setLoading(false);
      }
    }

    void loadPage();
  }, [router, subjectUrl, roadmapsUrl]);

  function logout() {
    clearAdminToken();
    router.replace("/admin");
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm());
    nextStepKey.current = 1;
    setFormError("");
  }

  function startNewRoadmap() {
    resetForm();
    setStatus("");
    titleInput.current?.focus();
  }

  async function editRoadmap(roadmap: Roadmap) {
    setLoadingRoadmapId(roadmap.id);
    setPageError("");
    setStatus("");

    try {
      const response = await fetch(
        `${roadmapsUrl}/${encodeURIComponent(roadmap.slug)}`,
      );
      const body = (await response.json()) as ApiResponse;
      if (!response.ok || !body.data?.roadmap) {
        setPageError(body.error?.message ?? "Unable to load the roadmap.");
        return;
      }

      const detail = body.data.roadmap;
      nextStepKey.current = detail.steps.length;
      setEditingId(detail.id);
      setForm({
        title: detail.title,
        slug: detail.slug,
        summary: detail.summary ?? "",
        position: String(detail.position),
        steps: detail.steps.map((step, index) => ({ ...step, key: index })),
      });
      setFormError("");
      titleInput.current?.focus();
    } catch {
      setPageError("The backend is unavailable. Check that it is running.");
    } finally {
      setLoadingRoadmapId(null);
    }
  }

  function addStep() {
    const key = nextStepKey.current++;
    setForm((current) => ({
      ...current,
      steps: [...current.steps, { key, title: "", description: "" }],
    }));
  }

  function updateStep(key: number, field: keyof Step, value: string) {
    setForm((current) => ({
      ...current,
      steps: current.steps.map((step) =>
        step.key === key ? { ...step, [field]: value } : step,
      ),
    }));
  }

  function removeStep(key: number) {
    setForm((current) => ({
      ...current,
      steps:
        current.steps.length > 1
          ? current.steps.filter((step) => step.key !== key)
          : current.steps,
    }));
  }

  function moveStep(index: number, direction: -1 | 1) {
    setForm((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.steps.length) return current;
      const steps = [...current.steps];
      [steps[index], steps[target]] = [steps[target], steps[index]];
      return { ...current, steps };
    });
  }

  async function saveRoadmap(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const token = getAdminToken();
    if (!token) return logout();

    const title = form.title.trim();
    const roadmapSlug = form.slug.trim().toLowerCase();
    const summary = form.summary.trim();
    const position = Number(form.position);
    const steps = form.steps.map((step) => ({
      title: step.title.trim(),
      description: step.description.trim(),
    }));

    if (title.length < 2 || title.length > 160) {
      setFormError("Title must be between 2 and 160 characters.");
      return;
    }
    if (
      roadmapSlug.length < 2 ||
      roadmapSlug.length > 160 ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(roadmapSlug)
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
      steps.length === 0 ||
      steps.some(
        (step) =>
          step.title.length < 2 ||
          step.title.length > 160 ||
          step.description.length < 10,
      )
    ) {
      setFormError(
        "Each step needs a title of 2 to 160 characters and a description of at least 10 characters.",
      );
      return;
    }

    setSaving(true);
    setFormError("");
    setStatus("");

    try {
      const response = await fetch(
        editingId
          ? `${roadmapsUrl}/${encodeURIComponent(editingId)}`
          : roadmapsUrl,
        {
          method: editingId ? "PATCH" : "POST",
          headers: {
            authorization: `Bearer ${token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            title,
            slug: roadmapSlug,
            summary: summary || null,
            position,
            steps,
          }),
        },
      );
      const body = (await response.json()) as ApiResponse;

      if (response.status === 401) return logout();
      if (!response.ok || !body.data?.roadmap) {
        setFormError(body.error?.message ?? "Unable to save the roadmap.");
        return;
      }

      const savedRoadmap = body.data.roadmap;
      setRoadmaps((current) =>
        sortRoadmaps(
          editingId
            ? current.map((roadmap) =>
                roadmap.id === savedRoadmap.id ? savedRoadmap : roadmap,
              )
            : [...current, savedRoadmap],
        ),
      );
      setStatus(editingId ? "Roadmap updated." : "Roadmap created.");
      resetForm();
    } catch {
      setFormError("The backend is unavailable. Check that it is running.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteRoadmap(roadmap: Roadmap) {
    if (!window.confirm(`Delete ${roadmap.title}? This cannot be undone.`))
      return;

    const token = getAdminToken();
    if (!token) return logout();

    setDeletingId(roadmap.id);
    setPageError("");
    setStatus("");

    try {
      const response = await fetch(
        `${roadmapsUrl}/${encodeURIComponent(roadmap.id)}`,
        {
          method: "DELETE",
          headers: { authorization: `Bearer ${token}` },
        },
      );
      if (response.status === 401) return logout();
      if (!response.ok) {
        const body = (await response.json()) as ApiResponse;
        setPageError(body.error?.message ?? "Unable to delete the roadmap.");
        return;
      }

      setRoadmaps((current) =>
        current.filter((item) => item.id !== roadmap.id),
      );
      if (editingId === roadmap.id) resetForm();
      setStatus("Roadmap deleted.");
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
                  Roadmap management
                </p>
                <h1 className="mt-4 text-[clamp(2.3rem,5vw,4.4rem)] font-semibold leading-[0.96] tracking-[-0.055em]">
                  {subject?.name ?? "Roadmaps"}
                </h1>
                <p className="mt-4 max-w-[52ch] text-[14px] leading-6 text-[#606060] dark:text-[#a8a8a8]">
                  Build learning paths with steps in the order learners should
                  follow.
                </p>
              </div>
              <button
                type="button"
                onClick={startNewRoadmap}
                disabled={!subject || loadingRoadmapId !== null}
                className="inline-flex h-11 w-fit items-center gap-2 rounded-[10px] bg-[#151515] px-4 text-[13px] font-medium text-white transition-[opacity,transform] hover:opacity-85 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:border dark:border-white/[0.14] dark:bg-[#f3f3f1] dark:text-[#151515]"
              >
                <Plus className="size-4" aria-hidden="true" />
                New roadmap
              </button>
            </div>
          </div>
        </section>

        <section className="px-5 py-10 sm:px-6 sm:py-12 lg:px-8">
          <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[minmax(320px,0.8fr)_minmax(0,1.2fr)] lg:items-start lg:gap-16">
            <form
              onSubmit={saveRoadmap}
              className="rounded-[16px] border border-black/[0.1] bg-black/[0.018] p-5 dark:border-white/[0.11] dark:bg-white/[0.025] sm:p-6"
              noValidate
            >
              <h2 className="text-[20px] font-semibold tracking-[-0.03em]">
                {editingId ? "Edit roadmap" : "Add roadmap"}
              </h2>
              <p className="mt-2 text-[12px] leading-5 text-[#606060] dark:text-[#a8a8a8]">
                Roadmap details and steps are available through the public API.
              </p>

              <div className="mt-6 grid gap-5">
                <label
                  className="grid gap-2 text-[13px] font-medium"
                  htmlFor="roadmap-title"
                >
                  Title
                  <input
                    id="roadmap-title"
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
                    placeholder="Operating Systems path"
                  />
                </label>
                <label
                  className="grid gap-2 text-[13px] font-medium"
                  htmlFor="roadmap-slug"
                >
                  Slug
                  <input
                    id="roadmap-slug"
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
                    placeholder="operating-systems-path"
                  />
                  <span className="text-[11px] font-normal leading-5 text-[#777] dark:text-[#8f8f8f]">
                    Use lowercase letters, numbers, and hyphens.
                  </span>
                </label>
                <label
                  className="grid gap-2 text-[13px] font-medium"
                  htmlFor="roadmap-summary"
                >
                  Summary
                  <textarea
                    id="roadmap-summary"
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
                    placeholder="A short overview of this path."
                  />
                </label>
                <label
                  className="grid gap-2 text-[13px] font-medium"
                  htmlFor="roadmap-position"
                >
                  Order
                  <input
                    id="roadmap-position"
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
                      Steps
                    </h3>
                    <p className="mt-1 text-[12px] leading-5 text-[#606060] dark:text-[#a8a8a8]">
                      The order here is the order shown to learners.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addStep}
                    className="inline-flex h-9 shrink-0 items-center gap-1 rounded-[9px] border border-black/[0.12] px-3 text-[12px] font-medium hover:bg-black/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:border-white/[0.13] dark:hover:bg-white/[0.05] dark:focus-visible:ring-white/50"
                  >
                    <Plus className="size-4" aria-hidden="true" />
                    Add step
                  </button>
                </div>

                <div className="mt-5 grid gap-4">
                  {form.steps.map((step, index) => (
                    <div
                      key={step.key}
                      className="rounded-[12px] border border-black/[0.1] p-4 dark:border-white/[0.11]"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="font-[family-name:var(--font-geist-mono)] text-[12px] font-medium text-[#606060] dark:text-[#a8a8a8]">
                          Step {String(index + 1).padStart(2, "0")}
                        </h4>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => moveStep(index, -1)}
                            disabled={index === 0}
                            aria-label={`Move step ${index + 1} up`}
                            className="grid size-8 place-items-center rounded-[8px] border border-black/[0.1] text-[#606060] hover:text-[#151515] disabled:cursor-not-allowed disabled:opacity-35 dark:border-white/[0.11] dark:text-[#a8a8a8] dark:hover:text-white"
                          >
                            <ArrowUp className="size-4" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveStep(index, 1)}
                            disabled={index === form.steps.length - 1}
                            aria-label={`Move step ${index + 1} down`}
                            className="grid size-8 place-items-center rounded-[8px] border border-black/[0.1] text-[#606060] hover:text-[#151515] disabled:cursor-not-allowed disabled:opacity-35 dark:border-white/[0.11] dark:text-[#a8a8a8] dark:hover:text-white"
                          >
                            <ArrowDown className="size-4" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeStep(step.key)}
                            disabled={form.steps.length === 1}
                            aria-label={`Remove step ${index + 1}`}
                            className="grid size-8 place-items-center rounded-[8px] border border-black/[0.1] text-[#606060] hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-35 dark:border-white/[0.11] dark:text-[#a8a8a8] dark:hover:text-red-300"
                          >
                            <Trash2 className="size-4" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-4 grid gap-4">
                        <label
                          className="grid gap-2 text-[13px] font-medium"
                          htmlFor={`roadmap-step-title-${step.key}`}
                        >
                          Step title
                          <input
                            id={`roadmap-step-title-${step.key}`}
                            required
                            maxLength={160}
                            value={step.title}
                            onChange={(event) =>
                              updateStep(step.key, "title", event.target.value)
                            }
                            className="h-11 rounded-[10px] border border-black/[0.13] bg-white/70 px-3.5 text-[14px] font-normal outline-none focus:border-black/35 focus:ring-2 focus:ring-black/10 dark:border-white/[0.14] dark:bg-white/[0.04] dark:focus:border-white/35"
                            placeholder="Learn how processes work"
                          />
                        </label>
                        <label
                          className="grid gap-2 text-[13px] font-medium"
                          htmlFor={`roadmap-step-description-${step.key}`}
                        >
                          Description
                          <textarea
                            id={`roadmap-step-description-${step.key}`}
                            rows={3}
                            required
                            value={step.description}
                            onChange={(event) =>
                              updateStep(
                                step.key,
                                "description",
                                event.target.value,
                              )
                            }
                            className="resize-y rounded-[10px] border border-black/[0.13] bg-white/70 px-3.5 py-3 text-[14px] font-normal leading-6 outline-none focus:border-black/35 focus:ring-2 focus:ring-black/10 dark:border-white/[0.14] dark:bg-white/[0.04] dark:focus:border-white/35"
                            placeholder="Explain what to study in this step."
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
                  disabled={!subject || saving || loadingRoadmapId !== null}
                  className="inline-flex h-11 items-center justify-center rounded-[10px] bg-[#151515] px-4 text-[13px] font-medium text-white transition-[opacity,transform] hover:opacity-85 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-55 dark:border dark:border-white/[0.14] dark:bg-[#f3f3f1] dark:text-[#151515]"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Save changes"
                      : "Create roadmap"}
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
                  All roadmaps
                </h2>
                <span className="font-[family-name:var(--font-geist-mono)] text-[11px] text-[#777] dark:text-[#8f8f8f]">
                  {roadmaps.length} total
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
                <div className="grid gap-3 py-5" aria-label="Loading roadmaps">
                  {[0, 1, 2].map((item) => (
                    <div
                      key={item}
                      className="h-24 animate-pulse rounded-[12px] bg-black/[0.045] dark:bg-white/[0.06]"
                    />
                  ))}
                </div>
              ) : subject && roadmaps.length === 0 ? (
                <div className="py-16 text-center">
                  <Map
                    className="mx-auto size-7 text-[#777]"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <h3 className="mt-5 text-[18px] font-medium tracking-[-0.02em]">
                    No roadmaps yet
                  </h3>
                  <p className="mx-auto mt-2 max-w-sm text-[13px] leading-6 text-[#606060] dark:text-[#a8a8a8]">
                    Use the form to add the first roadmap to this subject.
                  </p>
                </div>
              ) : (
                <div className="grid">
                  {roadmaps.map((roadmap) => (
                    <article
                      key={roadmap.id}
                      className="grid gap-4 border-b border-black/[0.09] py-6 dark:border-white/[0.1] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start"
                    >
                      <div className="min-w-0">
                        <h3 className="text-[17px] font-medium tracking-[-0.025em]">
                          {roadmap.title}
                        </h3>
                        <p className="mt-1 font-[family-name:var(--font-geist-mono)] text-[11px] text-[#777] dark:text-[#8f8f8f]">
                          /{roadmap.slug} | Order {roadmap.position}
                        </p>
                        {roadmap.summary ? (
                          <p className="mt-3 max-w-[62ch] text-[13px] leading-6 text-[#606060] dark:text-[#a8a8a8]">
                            {roadmap.summary}
                          </p>
                        ) : null}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => void editRoadmap(roadmap)}
                          disabled={loadingRoadmapId !== null}
                          title={`Edit ${roadmap.title}`}
                          className="grid size-9 place-items-center rounded-[9px] border border-black/[0.1] text-[#606060] transition-colors hover:border-black/25 hover:text-[#151515] active:scale-[0.96] disabled:opacity-45 dark:border-white/[0.11] dark:text-[#a8a8a8] dark:hover:border-white/25 dark:hover:text-white"
                        >
                          <SquarePen
                            className="size-4"
                            strokeWidth={1.7}
                            aria-hidden="true"
                          />
                          <span className="sr-only">Edit {roadmap.title}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => void deleteRoadmap(roadmap)}
                          disabled={deletingId === roadmap.id}
                          title={`Delete ${roadmap.title}`}
                          className="grid size-9 place-items-center rounded-[9px] border border-black/[0.1] text-[#606060] transition-colors hover:border-red-700/30 hover:text-red-700 active:scale-[0.96] disabled:opacity-45 dark:border-white/[0.11] dark:text-[#a8a8a8] dark:hover:border-red-300/30 dark:hover:text-red-300"
                        >
                          <Trash2
                            className="size-4"
                            strokeWidth={1.7}
                            aria-hidden="true"
                          />
                          <span className="sr-only">
                            Delete {roadmap.title}
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
