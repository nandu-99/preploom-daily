export type EditableValue = string | number | boolean | null | EditableValue[] | { [key: string]: EditableValue };

const requiredText = new Set(["id", "slug", "title", "name", "question", "prompt", "label", "expression"]);
const pathLabel = (path: (string | number)[]) => path.map((part) => typeof part === "number" ? `item ${part + 1}` : part.replace(/([a-z])([A-Z])/g, "$1 $2")).join(" / ") || "Content";

export function validateContent(kind: string, id: string, value: EditableValue): string[] {
  const errors: string[] = [];
  const add = (path: (string | number)[], message: string) => errors.push(`${pathLabel(path)}: ${message}`);
  const object = (input: EditableValue): input is Record<string, EditableValue> => input !== null && typeof input === "object" && !Array.isArray(input);
  const list = (input: EditableValue, path: (string | number)[]) => {
    if (!Array.isArray(input) || input.length === 0) add(path, "add at least one item");
  };
  if (["interview-questions", "catalog"].includes(kind)) list(value, []);
  else if (!object(value)) add([], "the content must have fields");
  if (object(value)) {
    if (kind === "course") {
      if (value.slug !== id) add(["slug"], "the page address must match this subject");
      list(value.modules, ["modules"]);
      if (Array.isArray(value.modules)) value.modules.forEach((module, index) => {
        if (object(module)) list(module.topics, ["modules", index, "topics"]);
      });
    }
    if (kind === "quiz") {
      if (value.slug !== id) add(["slug"], "the page address must match this quiz");
      list(value.questions, ["questions"]);
      if (Array.isArray(value.questions)) value.questions.forEach((question, index) => {
        if (!object(question)) return;
        list(question.options, ["questions", index, "options"]);
        if (Array.isArray(question.options)) {
          const optionIds = question.options.filter(object).map((option) => option.id);
          if (!optionIds.includes(question.correctOptionId)) add(["questions", index, "correctOptionId"], "choose an option ID from this question");
        }
      });
    }
    if (kind === "webdev") for (const key of ["websiteResources", "projectIdeas", "componentLibraries", "skillTemplates", "practicalGuides"]) {
      if (!Array.isArray(value[key])) add([key], "this must be a list");
    }
    if (kind === "public-roadmap") list(value.stages, ["stages"]);
  }
  function walk(input: EditableValue, path: (string | number)[]) {
    if (Array.isArray(input)) {
      for (const uniqueKey of ["id", "slug"]) {
        const values = input.filter(object).map((entry) => entry[uniqueKey]).filter((entry) => typeof entry === "string" && entry.trim());
        if (new Set(values).size !== values.length) add(path, `duplicate ${uniqueKey} values`);
      }
      input.forEach((entry, index) => walk(entry, [...path, index]));
    } else if (object(input)) {
      Object.entries(input).forEach(([key, entry]) => {
        if (requiredText.has(key) && typeof entry === "string" && !entry.trim()) add([...path, key], "cannot be empty");
        if (typeof entry === "number" && !Number.isFinite(entry)) add([...path, key], "enter a valid number");
        walk(entry, [...path, key]);
      });
    }
  }
  walk(value, []);
  return errors.slice(0, 30);
}

export function contentChanges(before: EditableValue, after: EditableValue, limit = 20) {
  const changes: { path: string; before: string; after: string }[] = [];
  const describe = (value: EditableValue | undefined) => {
    if (value === undefined) return "Not set";
    if (Array.isArray(value)) return `${value.length} items`;
    if (value !== null && typeof value === "object") return "Section";
    if (typeof value === "string") return value.length > 150 ? `${value.slice(0, 147)}...` : value || "Empty";
    return String(value);
  };
  function walk(left: EditableValue | undefined, right: EditableValue | undefined, path: (string | number)[]) {
    if (changes.length >= limit || JSON.stringify(left) === JSON.stringify(right)) return;
    if (Array.isArray(left) && Array.isArray(right)) {
      if (left.length !== right.length) changes.push({ path: pathLabel(path), before: describe(left), after: describe(right) });
      for (let index = 0; index < Math.max(left.length, right.length) && changes.length < limit; index++) walk(left[index], right[index], [...path, index]);
    } else if (left && right && typeof left === "object" && typeof right === "object") {
      for (const key of new Set([...Object.keys(left), ...Object.keys(right)])) {
        if (changes.length >= limit) break;
        walk((left as Record<string, EditableValue>)[key], (right as Record<string, EditableValue>)[key], [...path, key]);
      }
    } else changes.push({ path: pathLabel(path), before: describe(left), after: describe(right) });
  }
  walk(before, after, []);
  return changes;
}
