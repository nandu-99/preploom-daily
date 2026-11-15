export type SearchIcon = "book" | "braces" | "code" | "route";

export type SearchResultType =
  | "subject"
  | "module"
  | "topic"
  | "interview-question"
  | "resource"
  | "roadmap";

export type SearchItem = {
  title: string;
  description: string;
  href: string;
  keywords: string[];
  icon: SearchIcon;
  type: SearchResultType;
  aliases?: string[];
};

export type SearchGroup = {
  label: string;
  items: SearchItem[];
};

export type SearchCatalog = {
  initialGroups: SearchGroup[];
  searchGroups: SearchGroup[];
};
