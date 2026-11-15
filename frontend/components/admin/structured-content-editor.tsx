"use client";

import { ArrowDown, ArrowLeft, ArrowUp, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

type ContentValue = string | number | boolean | null | ContentValue[] | { [key: string]: ContentValue };
type Path = (string | number)[];
type Shape =
  | { type: "object"; fields: Record<string, Shape> }
  | { type: "array"; element: Shape | null }
  | { type: "string" | "number" | "boolean" | "null" };

type Props = {
  value: ContentValue;
  examples: ContentValue[];
  onChange: (value: ContentValue) => void;
  readOnly?: boolean;
};

const fieldClass = "w-full rounded-[9px] border border-black/[0.13] bg-[#fafaf9] px-3 py-2.5 text-[13px] leading-5 outline-none transition-colors focus:border-black/40 focus:ring-2 focus:ring-black/10 dark:border-white/[0.16] dark:bg-[#181818] dark:text-[#f3f3f1] dark:focus:border-white/40";
const secondaryButton = "inline-flex min-h-9 items-center justify-center gap-1.5 rounded-[8px] border border-black/[0.12] px-3 text-xs font-medium text-[#444] hover:bg-black/[0.04] disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/[0.15] dark:text-[#c7c7c7] dark:hover:bg-white/[0.06]";
const longFields = new Set(["description", "summary", "opening", "body", "answer", "question", "prompt", "explanation", "note", "caption", "howToAnswer", "example", "misconception", "definition", "followUp", "trap", "keyPoint", "code", "warning"]);
const choices: Record<string, string[]> = {
  difficulty: ["Foundation", "Intermediate", "Advanced"],
  availability: ["available", "coming-soon"],
  experience: ["New to DSA", "Know the basics", "Comfortable with DSA"],
  scope: ["Focused", "Balanced", "Comprehensive"],
  essentialsStyle: ["numbered", "plain"],
};

export function labelFor(key: string | number) {
  if (typeof key === "number") return `Item ${key + 1}`;
  return key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[-_]/g, " ").replace(/^./, (letter) => letter.toUpperCase());
}

function isObject(value: ContentValue | undefined): value is Record<string, ContentValue> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function mergeShapes(left: Shape | null, right: Shape): Shape {
  if (!left || left.type !== right.type) return right;
  if (left.type === "object" && right.type === "object") {
    const fields = { ...left.fields };
    for (const [key, shape] of Object.entries(right.fields)) fields[key] = mergeShapes(fields[key] ?? null, shape);
    return { type: "object", fields };
  }
  if (left.type === "array" && right.type === "array") return {
    type: "array",
    element: right.element ? mergeShapes(left.element, right.element) : left.element,
  };
  return left;
}

function shapeOf(value: ContentValue): Shape {
  if (Array.isArray(value)) return { type: "array", element: value.reduce<Shape | null>((shape, item) => mergeShapes(shape, shapeOf(item)), null) };
  if (isObject(value)) return { type: "object", fields: Object.fromEntries(Object.entries(value).map(([key, item]) => [key, shapeOf(item)])) };
  return { type: value === null ? "null" : typeof value as "string" | "number" | "boolean" };
}

function shapeAt(shape: Shape, path: Path): Shape | null {
  let current: Shape | null = shape;
  for (const segment of path) {
    if (typeof segment === "number" && current?.type === "array") current = current.element;
    else if (typeof segment === "string" && current?.type === "object") current = current.fields[segment] ?? null;
    else return null;
  }
  return current;
}

function blankFrom(shape: Shape | null): ContentValue {
  if (!shape) return "";
  if (shape.type === "object") return Object.fromEntries(Object.entries(shape.fields).map(([key, field]) => [key, blankFrom(field)]));
  if (shape.type === "array") return [];
  if (shape.type === "number") return 0;
  if (shape.type === "boolean") return false;
  if (shape.type === "null") return null;
  return "";
}

function nodeAt(value: ContentValue, path: Path): ContentValue | undefined {
  let node: ContentValue | undefined = value;
  for (const segment of path) {
    if (typeof segment === "number" && Array.isArray(node)) node = node[segment];
    else if (typeof segment === "string" && isObject(node)) node = node[segment];
    else return undefined;
  }
  return node;
}

function replaceAt(value: ContentValue, path: Path, replacement: ContentValue): ContentValue {
  if (!path.length) return replacement;
  const [segment, ...remaining] = path;
  if (typeof segment === "number" && Array.isArray(value)) {
    return value.map((item, index) => index === segment ? replaceAt(item, remaining, replacement) : item);
  }
  if (typeof segment === "string" && isObject(value)) {
    return { ...value, [segment]: replaceAt(value[segment], remaining, replacement) };
  }
  return value;
}

function itemTitle(value: ContentValue, index: number) {
  if (typeof value === "string") return value || `Item ${index + 1}`;
  if (typeof value === "number") return String(value);
  if (isObject(value)) {
    for (const key of ["title", "name", "question", "prompt", "label", "slug", "id", "expression"]) {
      const text = value[key];
      if (typeof text === "string" && text.trim()) return text;
    }
  }
  return `Item ${index + 1}`;
}

export function StructuredContentEditor({ value, examples, onChange, readOnly = false }: Props) {
  const [path, setPath] = useState<Path>([]);
  const [newField, setNewField] = useState("");
  const shape = useMemo<Shape>(() => examples.reduce<Shape | null>((current, example) => mergeShapes(current, shapeOf(example)), null) ?? { type: "object", fields: {} }, [examples]);
  const current = nodeAt(value, path);
  const currentShape = shapeAt(shape, path);

  function change(pathToChange: Path, replacement: ContentValue) {
    onChange(replaceAt(value, pathToChange, replacement));
  }

  function editArray(next: ContentValue[]) {
    change(path, next);
  }

  function move(index: number, direction: -1 | 1) {
    if (!Array.isArray(current)) return;
    const next = [...current];
    [next[index], next[index + direction]] = [next[index + direction], next[index]];
    editArray(next);
  }

  function renderField(key: string | number, fieldValue: ContentValue, fieldPath: Path) {
    const label = labelFor(key);
    if (typeof fieldValue === "boolean") return (
      <label key={String(key)} className="flex items-center gap-3 rounded-[9px] border border-black/[0.1] px-3 py-3 text-sm dark:border-white/[0.12]">
        <input type="checkbox" checked={fieldValue} disabled={readOnly} onChange={(event) => change(fieldPath, event.target.checked)} className="size-4 accent-[#242424]" />
        {label}
      </label>
    );
    if (fieldValue === null) return <p key={String(key)} className="text-sm text-[#777]">{label}: empty</p>;
    const parent = nodeAt(value, fieldPath.slice(0, -1));
    const optionItems = key === "correctOptionId" && isObject(parent) && Array.isArray(parent.options)
      ? parent.options.filter(isObject).filter((option) => typeof option.id === "string")
      : [];
    if (typeof fieldValue === "string" && (choices[String(key)] || optionItems.length)) {
      return <label key={String(key)} className="block text-xs font-medium text-[#555] dark:text-[#b3b3b3]">
        <span className="mb-1.5 block">{label}</span>
        <select value={fieldValue} disabled={readOnly} onChange={(event) => change(fieldPath, event.target.value)} className={fieldClass}>
          {optionItems.length ? <><option value="">Choose the correct option</option>{optionItems.map((option) => <option key={String(option.id)} value={String(option.id)}>{String(option.label ?? option.id)}</option>)}</> : choices[String(key)].map((choice) => <option key={choice} value={choice}>{choice}</option>)}
        </select>
      </label>;
    }
    const multiline = typeof fieldValue === "string" && (fieldValue.length > 100 || longFields.has(String(key)));
    const locked = fieldPath.length === 1 && ["id", "slug"].includes(String(key));
    return (
      <label key={String(key)} className="block min-w-0 text-xs font-medium text-[#555] dark:text-[#b3b3b3]">
        <span className="mb-1.5 block">{label}{locked ? " (fixed page address)" : ""}</span>
        {multiline ? (
          <textarea rows={Math.min(9, Math.max(3, Math.ceil(String(fieldValue).length / 90)))} value={String(fieldValue)} readOnly={readOnly || locked} onChange={(event) => change(fieldPath, event.target.value)} className={`${fieldClass} resize-y`} />
        ) : (
          <input type={typeof fieldValue === "number" ? "number" : "text"} value={typeof fieldValue === "number" ? fieldValue : String(fieldValue)} readOnly={readOnly || locked} onChange={(event) => change(fieldPath, typeof fieldValue === "number" ? Number(event.target.value) : event.target.value)} className={fieldClass} />
        )}
      </label>
    );
  }

  if (current === undefined) return null;
  const missingFields = currentShape?.type === "object" && isObject(current)
    ? Object.keys(currentShape.fields).filter((key) => !(key in current))
    : [];

  return (
    <div className="min-w-0">
      <nav aria-label="Content sections" className="mb-5 flex flex-wrap items-center gap-1 text-xs text-[#666] dark:text-[#aaa]">
        <button type="button" onClick={() => setPath([])} className="rounded px-1 py-1 hover:underline">Content</button>
        {path.map((segment, index) => <span key={index} className="flex items-center gap-1"><span>/</span><button type="button" onClick={() => setPath(path.slice(0, index + 1))} className="max-w-[190px] truncate rounded px-1 py-1 hover:underline">{typeof segment === "number" ? itemTitle(nodeAt(value, path.slice(0, index + 1)) ?? "", segment) : labelFor(segment)}</button></span>)}
      </nav>
      {path.length > 0 && <button type="button" onClick={() => setPath(path.slice(0, -1))} className={`${secondaryButton} mb-5`}><ArrowLeft className="size-3.5" /> Back</button>}
      <h3 className="mb-5 text-xl font-semibold tracking-[-0.035em]">{path.length ? labelFor(path[path.length - 1]) : "Overview"}</h3>
      {Array.isArray(current) ? (
        <div className="space-y-2">
          {current.map((entry, index) => (
            <div key={index} className="flex min-w-0 items-center gap-2 rounded-[10px] border border-black/[0.1] bg-[#fafaf9] p-2 dark:border-white/[0.12] dark:bg-[#181818]">
              {isObject(entry) || Array.isArray(entry) ? (
                <button type="button" onClick={() => setPath([...path, index])} className="min-w-0 flex-1 truncate rounded px-2 py-2 text-left text-sm font-medium hover:bg-black/[0.04] dark:hover:bg-white/[0.05]">{String(index + 1).padStart(2, "0")}. {itemTitle(entry, index)}</button>
              ) : <div className="min-w-0 flex-1">{renderField(index, entry, [...path, index])}</div>}
              {!readOnly && <div className="flex shrink-0 items-center gap-1">
                <button type="button" aria-label={`Move item ${index + 1} up`} disabled={index === 0} onClick={() => move(index, -1)} className={`${secondaryButton} !size-8 !min-h-8 !px-0`}><ArrowUp className="size-3.5" /></button>
                <button type="button" aria-label={`Move item ${index + 1} down`} disabled={index === current.length - 1} onClick={() => move(index, 1)} className={`${secondaryButton} !size-8 !min-h-8 !px-0`}><ArrowDown className="size-3.5" /></button>
                <button type="button" aria-label={`Remove item ${index + 1}`} onClick={() => editArray(current.filter((_, position) => position !== index))} className={`${secondaryButton} !size-8 !min-h-8 !px-0 text-red-700 dark:text-red-400`}><Trash2 className="size-3.5" /></button>
              </div>}
            </div>
          ))}
          {!current.length && <p className="rounded-[9px] border border-dashed border-black/15 p-6 text-center text-sm text-[#777] dark:border-white/15">No items yet.</p>}
          {!readOnly && <button type="button" onClick={() => {
            const nextItem = blankFrom(currentShape?.type === "array" ? currentShape.element : null);
            editArray([...current, nextItem]);
            if (isObject(nextItem) || Array.isArray(nextItem)) setPath([...path, current.length]);
          }} className={`${secondaryButton} mt-3`}><Plus className="size-3.5" /> Add item</button>}
        </div>
      ) : isObject(current) ? (
        <div className="space-y-5">
          <div className="grid gap-4">{Object.entries(current).filter(([, entry]) => !isObject(entry) && !Array.isArray(entry)).map(([key, entry]) => renderField(key, entry, [...path, key]))}</div>
          {Object.entries(current).filter(([, entry]) => isObject(entry) || Array.isArray(entry)).map(([key, entry]) => (
            <button key={key} type="button" onClick={() => setPath([...path, key])} className="flex w-full min-w-0 items-center justify-between rounded-[10px] border border-black/[0.1] bg-[#fafaf9] px-4 py-3 text-left hover:border-black/25 dark:border-white/[0.12] dark:bg-[#181818] dark:hover:border-white/25">
              <span className="min-w-0 truncate text-sm font-medium">{labelFor(key)}</span>
              <span className="ml-3 shrink-0 text-xs text-[#777] dark:text-[#aaa]">{Array.isArray(entry) ? `${entry.length} items` : `${isObject(entry) ? Object.keys(entry).length : 0} fields`} →</span>
            </button>
          ))}
          {!readOnly && missingFields.length > 0 && <div className="flex flex-wrap gap-2 border-t border-black/10 pt-5 dark:border-white/10">
            <select aria-label="Optional field to add" value={newField} onChange={(event) => setNewField(event.target.value)} className={`${fieldClass} max-w-[260px]`}><option value="">Choose optional field</option>{missingFields.map((field) => <option key={field} value={field}>{labelFor(field)}</option>)}</select>
            <button type="button" disabled={!newField} onClick={() => { const template = currentShape?.type === "object" ? currentShape.fields[newField] : null; change(path, { ...current, [newField]: blankFrom(template) }); setNewField(""); }} className={secondaryButton}><Plus className="size-3.5" /> Add field</button>
          </div>}
        </div>
      ) : <div>{renderField(path[path.length - 1] ?? "Value", current, path)}</div>}
    </div>
  );
}
