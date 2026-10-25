"use client";

import { AdminHeader } from "@/components/admin/admin-header";
import { clearAdminToken, getAdminToken } from "@/lib/admin-session";
import { BookOpen, Plus, SquarePen, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";

type Subject = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

type ApiResponse = {
  data?: {
    subjects?: Subject[];
    subject?: Subject;
  };
  error?: { message: string };
};

const emptyForm = { name: "", slug: "", description: "" };

export default function AdminDashboardPage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pageError, setPageError] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const token = getAdminToken();

    if (!token) {
      router.replace("/admin");
      return;
    }

    async function loadDashboard() {
      try {
        const [adminResponse, subjectsResponse] = await Promise.all([
          fetch(`${backendUrl}/admin/me`, {
            headers: { authorization: `Bearer ${token}` },
          }),
          fetch(`${backendUrl}/subjects`),
        ]);

        if (!adminResponse.ok) {
          clearAdminToken();
          router.replace("/admin");
          return;
        }

        const body = (await subjectsResponse.json()) as ApiResponse;
        if (!subjectsResponse.ok) {
          setPageError(body.error?.message ?? "Unable to load subjects.");
          return;
        }

        setSubjects(body.data?.subjects ?? []);
      } catch {
        setPageError("The backend is unavailable. Check that it is running.");
      } finally {
        setLoading(false);
      }
    }

    void loadDashboard();
  }, [router]);

  function logout() {
    clearAdminToken();
    router.replace("/admin");
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
  }

  function editSubject(subject: Subject) {
    setEditingId(subject.id);
    setForm({
      name: subject.name,
      slug: subject.slug,
      description: subject.description ?? "",
    });
    setFormError("");
  }

  async function saveSubject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const token = getAdminToken();
    if (!token) return logout();

    setSaving(true);
    setFormError("");

    try {
      const response = await fetch(
        editingId
          ? `${backendUrl}/subjects/${editingId}`
          : `${backendUrl}/subjects`,
        {
          method: editingId ? "PATCH" : "POST",
          headers: {
            authorization: `Bearer ${token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            slug: form.slug,
            description: form.description || null,
          }),
        },
      );
      const body = (await response.json()) as ApiResponse;

      if (response.status === 401) return logout();
      if (!response.ok || !body.data?.subject) {
        setFormError(body.error?.message ?? "Unable to save the subject.");
        return;
      }

      const savedSubject = body.data.subject;
      setSubjects((current) =>
        (editingId
          ? current.map((subject) =>
              subject.id === savedSubject.id ? savedSubject : subject,
            )
          : [...current, savedSubject]
        ).sort((first, second) => first.name.localeCompare(second.name)),
      );
      resetForm();
    } catch {
      setFormError("The backend is unavailable. Check that it is running.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteSubject(subject: Subject) {
    if (!window.confirm(`Delete ${subject.name}? This cannot be undone.`)) {
      return;
    }

    const token = getAdminToken();
    if (!token) return logout();

    setDeletingId(subject.id);
    setPageError("");

    try {
      const response = await fetch(`${backendUrl}/subjects/${subject.id}`, {
        method: "DELETE",
        headers: { authorization: `Bearer ${token}` },
      });

      if (response.status === 401) return logout();
      if (!response.ok) {
        const body = (await response.json()) as ApiResponse;
        setPageError(body.error?.message ?? "Unable to delete the subject.");
        return;
      }

      setSubjects((current) =>
        current.filter((item) => item.id !== subject.id),
      );
      if (editingId === subject.id) resetForm();
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
          <div className="mx-auto flex max-w-[1240px] flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#606060] dark:text-[#a8a8a8]">
                Content management
              </p>
              <h1 className="mt-4 text-[clamp(2.3rem,5vw,4.4rem)] font-semibold leading-[0.96] tracking-[-0.055em]">
                Subjects
              </h1>
              <p className="mt-4 max-w-[52ch] text-[14px] leading-6 text-[#606060] dark:text-[#a8a8a8]">
                Create and maintain the subjects shown across PrepLoom.
              </p>
            </div>
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex h-11 w-fit items-center gap-2 rounded-[10px] bg-[#151515] px-4 text-[13px] font-medium text-white transition-[opacity,transform] hover:opacity-85 active:scale-[0.98] dark:border dark:border-white/[0.14] dark:bg-[#f3f3f1] dark:text-[#151515]"
            >
              <Plus className="size-4" aria-hidden="true" />
              New subject
            </button>
          </div>
        </section>

        <section className="px-5 py-10 sm:px-6 sm:py-12 lg:px-8">
          <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[minmax(300px,0.72fr)_minmax(0,1.28fr)] lg:items-start lg:gap-16">
            <form
              onSubmit={saveSubject}
              className="rounded-[16px] border border-black/[0.1] bg-black/[0.018] p-5 dark:border-white/[0.11] dark:bg-white/[0.025] sm:p-6"
              noValidate
            >
              <h2 className="text-[20px] font-semibold tracking-[-0.03em]">
                {editingId ? "Edit subject" : "Add subject"}
              </h2>
              <p className="mt-2 text-[12px] leading-5 text-[#606060] dark:text-[#a8a8a8]">
                Subject details appear on the public learning pages.
              </p>

              <div className="mt-6 grid gap-5">
                <label
                  className="grid gap-2 text-[13px] font-medium"
                  htmlFor="subject-name"
                >
                  Name
                  <input
                    id="subject-name"
                    required
                    value={form.name}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    className="h-11 rounded-[10px] border border-black/[0.13] bg-white/70 px-3.5 text-[14px] font-normal outline-none focus:border-black/35 focus:ring-2 focus:ring-black/10 dark:border-white/[0.14] dark:bg-white/[0.04] dark:focus:border-white/35"
                    placeholder="Operating Systems"
                  />
                </label>
                <label
                  className="grid gap-2 text-[13px] font-medium"
                  htmlFor="subject-slug"
                >
                  Slug
                  <input
                    id="subject-slug"
                    required
                    value={form.slug}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        slug: event.target.value,
                      }))
                    }
                    className="h-11 rounded-[10px] border border-black/[0.13] bg-white/70 px-3.5 font-[family-name:var(--font-geist-mono)] text-[13px] font-normal outline-none focus:border-black/35 focus:ring-2 focus:ring-black/10 dark:border-white/[0.14] dark:bg-white/[0.04] dark:focus:border-white/35"
                    placeholder="operating-systems"
                  />
                  <span className="text-[11px] font-normal leading-5 text-[#777] dark:text-[#8f8f8f]">
                    Use lowercase letters, numbers, and hyphens.
                  </span>
                </label>
                <label
                  className="grid gap-2 text-[13px] font-medium"
                  htmlFor="subject-description"
                >
                  Description
                  <textarea
                    id="subject-description"
                    rows={4}
                    value={form.description}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                    className="resize-y rounded-[10px] border border-black/[0.13] bg-white/70 px-3.5 py-3 text-[14px] font-normal leading-6 outline-none focus:border-black/35 focus:ring-2 focus:ring-black/10 dark:border-white/[0.14] dark:bg-white/[0.04] dark:focus:border-white/35"
                    placeholder="A short summary of what learners will study."
                  />
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
                  disabled={saving}
                  className="inline-flex h-11 items-center justify-center rounded-[10px] bg-[#151515] px-4 text-[13px] font-medium text-white transition-[opacity,transform] hover:opacity-85 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-55 dark:border dark:border-white/[0.14] dark:bg-[#f3f3f1] dark:text-[#151515]"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Save changes"
                      : "Create subject"}
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
                  All subjects
                </h2>
                <span className="font-[family-name:var(--font-geist-mono)] text-[11px] text-[#777] dark:text-[#8f8f8f]">
                  {subjects.length} total
                </span>
              </div>

              {pageError ? (
                <p
                  role="alert"
                  className="mt-4 rounded-[10px] border border-red-700/20 bg-red-700/[0.06] px-3.5 py-3 text-[13px] text-red-800 dark:border-red-300/20 dark:bg-red-300/[0.07] dark:text-red-200"
                >
                  {pageError}
                </p>
              ) : null}

              {loading ? (
                <div className="grid gap-3 py-5" aria-label="Loading subjects">
                  {[0, 1, 2].map((item) => (
                    <div
                      key={item}
                      className="h-24 animate-pulse rounded-[12px] bg-black/[0.045] dark:bg-white/[0.06]"
                    />
                  ))}
                </div>
              ) : subjects.length === 0 ? (
                <div className="py-16 text-center">
                  <BookOpen
                    className="mx-auto size-7 text-[#777]"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <h3 className="mt-5 text-[18px] font-medium tracking-[-0.02em]">
                    No subjects yet
                  </h3>
                  <p className="mx-auto mt-2 max-w-sm text-[13px] leading-6 text-[#606060] dark:text-[#a8a8a8]">
                    Use the form to add the first subject to PrepLoom.
                  </p>
                </div>
              ) : (
                <div className="grid">
                  {subjects.map((subject) => (
                    <article
                      key={subject.id}
                      className="grid gap-4 border-b border-black/[0.09] py-6 dark:border-white/[0.1] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start"
                    >
                      <div className="min-w-0">
                        <h3 className="text-[17px] font-medium tracking-[-0.025em]">
                          {subject.name}
                        </h3>
                        <p className="mt-1 font-[family-name:var(--font-geist-mono)] text-[11px] text-[#777] dark:text-[#8f8f8f]">
                          /{subject.slug}
                        </p>
                        {subject.description ? (
                          <p className="mt-3 max-w-[62ch] text-[13px] leading-6 text-[#606060] dark:text-[#a8a8a8]">
                            {subject.description}
                          </p>
                        ) : null}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => editSubject(subject)}
                          title={`Edit ${subject.name}`}
                          className="grid size-9 place-items-center rounded-[9px] border border-black/[0.1] text-[#606060] transition-colors hover:border-black/25 hover:text-[#151515] active:scale-[0.96] dark:border-white/[0.11] dark:text-[#a8a8a8] dark:hover:border-white/25 dark:hover:text-white"
                        >
                          <SquarePen
                            className="size-4"
                            strokeWidth={1.7}
                            aria-hidden="true"
                          />
                          <span className="sr-only">Edit {subject.name}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => void deleteSubject(subject)}
                          disabled={deletingId === subject.id}
                          title={`Delete ${subject.name}`}
                          className="grid size-9 place-items-center rounded-[9px] border border-black/[0.1] text-[#606060] transition-colors hover:border-red-700/30 hover:text-red-700 active:scale-[0.96] disabled:opacity-45 dark:border-white/[0.11] dark:text-[#a8a8a8] dark:hover:border-red-300/30 dark:hover:text-red-300"
                        >
                          <Trash2
                            className="size-4"
                            strokeWidth={1.7}
                            aria-hidden="true"
                          />
                          <span className="sr-only">Delete {subject.name}</span>
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
