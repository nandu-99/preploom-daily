type JsonObject = Record<string, unknown>;

function object(value: unknown): value is JsonObject {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function nonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function validatePublicContent(kind: string, id: string, value: unknown): string | null {
  if ((kind === "catalog" || kind === "interview-questions") ? !Array.isArray(value) || value.length === 0 : !object(value)) {
    return "Content must have the expected fields or a nonempty list.";
  }
  if (kind === "course") {
    if (!object(value) || value.slug !== id || !nonEmpty(value.title) || !Array.isArray(value.modules) || !value.modules.length) return "A subject needs a matching address, title, and modules.";
    if (value.modules.some((module) => !object(module) || !nonEmpty(module.title) || !Array.isArray(module.topics) || !module.topics.length)) return "Every module needs a title and topics.";
  }
  if (kind === "quiz") {
    if (!object(value) || value.slug !== id || !nonEmpty(value.title) || !Array.isArray(value.questions) || !value.questions.length) return "A quiz needs a matching address, title, and questions.";
    for (const question of value.questions) {
      if (!object(question) || !nonEmpty(question.id) || !nonEmpty(question.prompt) || !Array.isArray(question.options) || !question.options.length || !question.options.some((option) => object(option) && option.id === question.correctOptionId)) return "Every quiz question needs a prompt, options, and a valid correct option.";
    }
  }
  if (kind === "public-roadmap" && (!object(value) || !Array.isArray(value.stages) || !value.stages.length)) return "A roadmap needs stages.";
  if (kind === "webdev" && (!object(value) || ["websiteResources", "projectIdeas", "componentLibraries", "skillTemplates", "practicalGuides"].some((key) => !Array.isArray(value[key])))) return "WebDev content needs its resource lists.";
  const required = new Set(["id", "slug", "title", "name", "question", "prompt", "label", "expression"]);
  function walk(node: unknown): boolean {
    if (Array.isArray(node)) {
      for (const key of ["id", "slug"]) {
        const values = node.filter(object).map((item) => item[key]).filter(nonEmpty);
        if (new Set(values).size !== values.length) return false;
      }
      return node.every(walk);
    }
    if (object(node)) return Object.entries(node).every(([key, entry]) => {
      if (required.has(key) && !nonEmpty(entry)) return false;
      if (typeof entry === "number" && !Number.isFinite(entry)) return false;
      return walk(entry);
    });
    return true;
  }
  return walk(value) ? null : "Required text, numbers, and item addresses must be valid and unique.";
}
