"use client";

import { AdminHeader } from "@/components/admin/admin-header";
import { StructuredContentEditor } from "@/components/admin/structured-content-editor";
import { clearAdminToken, getAdminToken } from "@/lib/admin-session";
import { contentChanges, type EditableValue, validateContent } from "@/lib/content-validation";
import { ArrowLeft, Check, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";
type ContentItem = { kind: string; id: string; value: EditableValue };
const kinds = [
  ["course", "Subject notes"],
  ["interview-questions", "Interview questions"],
  ["dsa-sheet", "DSA sheets"],
  ["public-roadmap", "Roadmaps"],
  ["quiz", "Quizzes"],
  ["webdev", "WebDev resources"],
  ["catalog", "Subject catalog"],
] as const;

function displayName(item: ContentItem) {
  const value = item.value;
  if (value && !Array.isArray(value) && typeof value === "object") {
    for (const key of ["title", "name"]) {
      const label = value[key];
      if (typeof label === "string" && label.trim()) return label;
    }
  }
  return item.id.replace(/-/g, " ");
}

function publicHref(item: ContentItem) {
  switch (item.kind) {
    case "course": return `/subjects/${item.id}`;
    case "interview-questions": return `/interview-questions/${item.id}`;
    case "dsa-sheet": return "/dsa";
    case "public-roadmap": return "/roadmaps";
    case "quiz": return `/quizzes/${item.id}`;
    case "webdev": return "/webdev";
    case "catalog": return "/subjects";
    default: return "/";
  }
}

export default function ContentEditorPage() {
  const router = useRouter();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [selected, setSelected] = useState("");
  const [draft, setDraft] = useState<EditableValue | null>(null);
  const [mode, setMode] = useState<"edit" | "review">("edit");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const selectedItem = items.find((item) => `${item.kind}:${item.id}` === selected);
  const changed = selectedItem && draft !== null && JSON.stringify(selectedItem.value) !== JSON.stringify(draft);
  const examples = useMemo(() => selectedItem ? items.filter((item) => item.kind === selectedItem.kind).map((item) => item.value) : [], [items, selectedItem]);
  const problems = selectedItem && draft !== null ? validateContent(selectedItem.kind, selectedItem.id, draft) : [];
  const changes = selectedItem && draft !== null ? contentChanges(selectedItem.value, draft) : [];

  useEffect(() => {
    const token = getAdminToken();
    if (!token) { router.replace("/admin"); return; }
    fetch(`${backendUrl}/admin/content`, { headers: { authorization: `Bearer ${token}` } })
      .then(async (response) => {
        if (response.status === 401) { clearAdminToken(); router.replace("/admin"); return; }
        if (!response.ok) throw new Error("Unable to load content.");
        const body = await response.json() as { data?: { items?: ContentItem[] } };
        setItems(body.data?.items ?? []);
      })
      .catch(() => setError("Unable to load content from the backend."))
      .finally(() => setLoading(false));
  }, [router]);

  useEffect(() => {
    if (!changed) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [changed]);

  function choose(item: ContentItem) {
    if (changed && !window.confirm("Discard your unsaved changes?")) return;
    setSelected(`${item.kind}:${item.id}`);
    setDraft(structuredClone(item.value));
    setMode("edit");
    setError("");
    setMessage("");
  }

  async function save() {
    if (!selectedItem || draft === null) return;
    const errors = validateContent(selectedItem.kind, selectedItem.id, draft);
    if (errors.length) { setError("Fix the listed content checks before saving."); return; }
    const token = getAdminToken();
    if (!token) { router.replace("/admin"); return; }
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch(`${backendUrl}/admin/content/${encodeURIComponent(selectedItem.kind)}/${encodeURIComponent(selectedItem.id)}`, {
        method: "PUT",
        headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
        body: JSON.stringify({ value: draft }),
      });
      if (!response.ok) { const body = await response.json() as { message?: string }; throw new Error(body.message ?? "Unable to save content."); }
      setItems((current) => current.map((item) => item.kind === selectedItem.kind && item.id === selectedItem.id ? { ...item, value: structuredClone(draft) } : item));
      setMode("edit");
      setMessage("Saved. The public page now reads this content from the backend.");
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Unable to save content.");
    } finally { setBusy(false); }
  }

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-[#151515] dark:bg-[#0a0a0a] dark:text-[#f3f3f1]">
      <AdminHeader onNavigate={() => !changed || window.confirm("Discard your unsaved changes?")} onLogout={() => { if (changed && !window.confirm("Discard your unsaved changes?")) return; clearAdminToken(); router.replace("/admin"); }} />
      <main className="mx-auto max-w-[1440px] px-5 py-10 sm:px-6 lg:px-8">
        <Link href="/admin/dashboard" onClick={(event) => { if (changed && !window.confirm("Discard your unsaved changes?")) event.preventDefault(); }} className="inline-flex items-center gap-2 text-sm text-[#606060] hover:underline dark:text-[#a8a8a8]"><ArrowLeft className="size-4" /> Dashboard</Link>
        <div className="mt-7 flex flex-wrap items-end justify-between gap-4">
          <div><h1 className="text-4xl font-semibold tracking-[-0.05em]">Public content</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#606060] dark:text-[#a8a8a8]">Select a page, edit its fields, review your changes, then save. You do not need to write JSON.</p></div>
          {selectedItem && <a href={publicHref(selectedItem)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs text-[#555] underline underline-offset-4 dark:text-[#bbb]">View current public page <ExternalLink className="size-3.5" /></a>}
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-[270px_minmax(0,1fr)]">
          <aside className="max-h-[calc(100dvh-120px)] space-y-5 overflow-y-auto rounded-[14px] border border-black/[0.1] bg-white/50 p-4 dark:border-white/[0.11] dark:bg-[#111] lg:sticky lg:top-6">
            {loading ? <p className="text-sm text-[#777]">Loading content...</p> : kinds.map(([kind, label]) => {
              const group = items.filter((item) => item.kind === kind);
              if (!group.length) return null;
              return <section key={kind}><h2 className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#777] dark:text-[#999]">{label}</h2><div className="space-y-1">{group.map((item) => <button key={`${kind}:${item.id}`} type="button" onClick={() => choose(item)} className={`block w-full truncate rounded-[9px] px-3 py-2.5 text-left text-[13px] ${selected === `${kind}:${item.id}` ? "bg-[#151515] text-white dark:bg-[#242424] dark:text-[#f3f3f1]" : "hover:bg-black/[0.05] dark:hover:bg-white/[0.06]"}`}>{displayName(item)}</button>)}</div></section>;
            })}
          </aside>
          <section className="min-w-0 rounded-[14px] border border-black/[0.1] bg-white/60 p-5 dark:border-white/[0.11] dark:bg-[#111] sm:p-7">
            {!selectedItem || draft === null ? <p className="text-sm text-[#606060] dark:text-[#a8a8a8]">Choose a page from the list to start editing.</p> : <>
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/[0.1] pb-5 dark:border-white/[0.11]">
                <div><p className="text-xs text-[#777] dark:text-[#999]">{kinds.find(([kind]) => kind === selectedItem.kind)?.[1]}</p><h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em]">{displayName(selectedItem)}</h2></div>
                <span className={`rounded-full px-3 py-1 text-xs ${changed ? "bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-200" : "bg-black/[0.05] text-[#666] dark:bg-white/[0.06] dark:text-[#aaa]"}`}>{changed ? "Unsaved changes" : "Up to date"}</span>
              </div>
              <div className="my-5 flex gap-2"><button type="button" onClick={() => setMode("edit")} className={`rounded-[8px] px-4 py-2 text-sm ${mode === "edit" ? "bg-[#242424] text-white" : "border border-black/10 dark:border-white/10"}`}>Edit fields</button><button type="button" onClick={() => { setMode("review"); setError(""); }} className={`rounded-[8px] px-4 py-2 text-sm ${mode === "review" ? "bg-[#242424] text-white" : "border border-black/10 dark:border-white/10"}`}>Review changes {changed ? `(${changes.length})` : ""}</button></div>
              {mode === "edit" ? <StructuredContentEditor key={selected} value={draft} examples={examples} onChange={(next) => { setDraft(next); setMessage(""); }} /> : <div className="space-y-6">
                <div><h3 className="text-lg font-semibold">Before you save</h3>{problems.length ? <div role="alert" className="mt-3 rounded-[10px] border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"><p className="font-semibold">Fix these fields:</p><ul className="mt-2 list-inside list-disc space-y-1">{problems.map((problem, index) => <li key={index}>{problem}</li>)}</ul></div> : <p className="mt-2 flex items-center gap-2 text-sm text-green-800 dark:text-green-300"><Check className="size-4" /> Content checks passed.</p>}</div>
                <div><h3 className="text-sm font-semibold">Changes from the saved version</h3>{changes.length ? <ul className="mt-3 space-y-2">{changes.map((change, index) => <li key={index} className="rounded-[9px] border border-black/10 p-3 text-xs dark:border-white/10"><p className="font-semibold">{change.path}</p><p className="mt-1 break-words text-[#777] dark:text-[#aaa]">Was: {change.before}</p><p className="mt-1 break-words">Now: {change.after}</p></li>)}</ul> : <p className="mt-2 text-sm text-[#777]">No changes yet.</p>}{changes.length >= 20 && <p className="mt-2 text-xs text-[#777]">Showing the first 20 changes.</p>}</div>
                <div className="border-t border-black/10 pt-5 dark:border-white/10"><p className="mb-4 text-xs text-[#777]">Browse the draft content below. The public page link above shows the currently saved version.</p><StructuredContentEditor value={draft} examples={examples} onChange={() => {}} readOnly /></div>
              </div>}
              <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-black/[0.1] pt-5 dark:border-white/[0.11]"><button type="button" onClick={mode === "edit" ? () => setMode("review") : save} disabled={busy || (mode === "review" && (!changed || problems.length > 0))} className="rounded-[9px] bg-[#151515] px-5 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-45 dark:border dark:border-white/[0.14] dark:bg-[#242424] dark:text-[#f3f3f1]">{mode === "edit" ? "Review before saving" : busy ? "Saving..." : "Save changes"}</button>{mode === "review" && <button type="button" onClick={() => setMode("edit")} className="text-sm text-[#555] underline underline-offset-4 dark:text-[#bbb]">Keep editing</button>}{message && <span role="status" className="text-sm text-green-800 dark:text-green-300">{message}</span>}</div>
            </>}
            {error && <p role="alert" className="mt-4 text-sm text-red-700 dark:text-red-400">{error}</p>}
          </section>
        </div>
      </main>
    </div>
  );
}
