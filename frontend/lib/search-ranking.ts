import type { SearchGroup, SearchItem } from "@/lib/search-types";

export type SearchMatchReason =
  | "exact_title"
  | "exact_alias"
  | "title_prefix"
  | "title_phrase"
  | "title_tokens"
  | "keyword_tokens"
  | "description_tokens"
  | "fuzzy_tokens";

export type RankedSearchResult = {
  item: SearchItem;
  groupLabel: string;
  matchReason: SearchMatchReason;
  rank: number;
  score: number;
};

const typeBoost: Record<SearchItem["type"], number> = {
  module: 80,
  topic: 70,
  subject: 50,
  "interview-question": 40,
  resource: 20,
  roadmap: 10,
};

export function normalizeSearchText(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function words(value: string) {
  return normalizeSearchText(value).split(" ").filter(Boolean);
}

function editDistanceAtMostOne(left: string, right: string) {
  if (left === right) return true;
  if (Math.abs(left.length - right.length) > 1) return false;

  let leftIndex = 0;
  let rightIndex = 0;
  let edits = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] === right[rightIndex]) {
      leftIndex += 1;
      rightIndex += 1;
      continue;
    }

    edits += 1;
    if (edits > 1) return false;

    if (left.length > right.length) leftIndex += 1;
    else if (right.length > left.length) rightIndex += 1;
    else {
      leftIndex += 1;
      rightIndex += 1;
    }
  }

  if (leftIndex < left.length || rightIndex < right.length) edits += 1;
  return edits <= 1;
}

function everyTokenMatches(
  queryTokens: string[],
  candidateWords: string[],
  fuzzy = false,
) {
  return queryTokens.every((token) =>
    candidateWords.some(
      (candidate) =>
        candidate === token ||
        candidate.startsWith(token) ||
        (fuzzy &&
          token.length >= 4 &&
          candidate.length >= 4 &&
          editDistanceAtMostOne(token, candidate)),
    ),
  );
}

function scoreItem(item: SearchItem, normalizedQuery: string) {
  const queryTokens = words(normalizedQuery);
  if (!queryTokens.length) return null;

  const normalizedTitle = normalizeSearchText(item.title);
  const normalizedAliases = (item.aliases ?? []).map(normalizeSearchText);
  const titleWords = words(item.title);
  const keywordWords = words(
    [item.title, ...(item.aliases ?? []), ...item.keywords].join(" "),
  );
  const descriptionWords = words(
    [
      item.title,
      item.description,
      ...(item.aliases ?? []),
      ...item.keywords,
    ].join(" "),
  );

  let score: number;
  let matchReason: SearchMatchReason;

  if (normalizedTitle === normalizedQuery) {
    score = 10_000;
    matchReason = "exact_title";
  } else if (normalizedAliases.includes(normalizedQuery)) {
    score = 9_500;
    matchReason = "exact_alias";
  } else if (normalizedTitle.startsWith(normalizedQuery)) {
    score = 9_000;
    matchReason = "title_prefix";
  } else if (normalizedTitle.includes(normalizedQuery)) {
    score = 8_500;
    matchReason = "title_phrase";
  } else if (everyTokenMatches(queryTokens, titleWords)) {
    score = 8_000;
    matchReason = "title_tokens";
  } else if (normalizedQuery.includes(normalizedTitle)) {
    score = 7_200;
    matchReason = "title_phrase";
  } else if (everyTokenMatches(queryTokens, keywordWords)) {
    score = 6_500;
    matchReason = "keyword_tokens";
  } else if (everyTokenMatches(queryTokens, descriptionWords)) {
    score = 5_000;
    matchReason = "description_tokens";
  } else if (everyTokenMatches(queryTokens, descriptionWords, true)) {
    score = 3_500;
    matchReason = "fuzzy_tokens";
  } else {
    return null;
  }

  return { matchReason, score: score + typeBoost[item.type] };
}

export function rankSearchGroups(
  groups: SearchGroup[],
  query: string,
  limit = 16,
): RankedSearchResult[] {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return [];

  const seen = new Set<string>();
  const results = groups.flatMap((group) =>
    group.items.flatMap((item) => {
      const key = `${item.href}:${item.title}`;
      if (seen.has(key)) return [];
      seen.add(key);

      const match = scoreItem(item, normalizedQuery);
      return match ? [{ item, groupLabel: group.label, ...match }] : [];
    }),
  );

  return results
    .sort(
      (left, right) =>
        right.score - left.score ||
        left.item.title.length - right.item.title.length ||
        left.item.title.localeCompare(right.item.title),
    )
    .slice(0, limit)
    .map((result, index) => ({ ...result, rank: index + 1 }));
}
