export type WebsiteResource = {
  name: string;
  description: string;
  category: string;
  href: string;
  image: string;
  imageAlt: string;
};

export type ProjectIdea = {
  id: string;
  title: string;
  description: string;
  level: string;
  stack: string;
  features: string[];
  skills: string[];
};

export type ComponentLibrary = {
  name: string;
  description: string;
  category: string;
  href: string;
  image: string;
  imageAlt: string;
};

export type PracticalGuide = {
  id: string;
  title: string;
  summary: string;
  environment: string;
  prerequisites: string[];
  outcome: string;
  checked: string;
  sourceLabel: string;
  sourceHref: string;
  steps: Array<{
    title: string;
    explanation: string;
    code: string;
    language?: string;
    warning?: string;
  }>;
};

export type SkillTemplate = {
  title: string;
  description: string;
  category: string;
  href: string;
};
