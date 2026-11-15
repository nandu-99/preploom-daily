export type SubjectStudyMode = "learn" | "revise" | "last-minute";

export type SubjectVisual = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
};

export type SubjectGantt = {
  segments: {
    label: string;
    start: number;
    end: number;
  }[];
};

export type SubjectDataTable = {
  headers: string[];
  rows: string[][];
};

export type SubjectFormula = {
  label?: string;
  expression: string;
  note?: string;
};

export type SubjectProblem = {
  title: string;
  prompt: string;
  steps: string[];
  answer: string;
};

export type SubjectTopic = {
  slug: string;
  title: string;
  description: string;
  readTime: string;
  difficulty: "Foundation" | "Intermediate" | "Advanced";
  tags: string[];
  learn: {
    opening: string;
    sections: {
      title: string;
      paragraphs: string[];
      points?: string[];
      flow?: string[];
      table?: {
        headers: [string, string];
        rows: [string, string][];
      };
      visual?: SubjectVisual;
      gantt?: SubjectGantt;
      dataTable?: SubjectDataTable;
      formulas?: SubjectFormula[];
      problems?: SubjectProblem[];
    }[];
    mechanism: {
      title: string;
      steps: string[];
    };
    example: {
      title: string;
      body: string;
    };
    misconception: string;
  };
  revise: {
    definitionLabel?: string;
    compactDefinition?: boolean;
    definition: string;
    sections?: {
      title: string;
      paragraphs?: string[];
      points?: string[];
      steps?: string[];
      flow?: string[];
      table?: {
        headers: [string, string];
        rows: [string, string][];
      };
      visual?: SubjectVisual;
      gantt?: SubjectGantt;
      dataTable?: SubjectDataTable;
      formulas?: SubjectFormula[];
      problems?: SubjectProblem[];
    }[];
    essentialsStyle?: "numbered" | "plain";
    essentials: string[];
    comparisonTitle?: string;
    comparison?: {
      left: { label: string; points: string[] };
      right: { label: string; points: string[] };
    };
    followUp: string;
  };
  lastMinute: {
    definition?: string;
    sections?: {
      title: string;
      paragraphs?: string[];
      points?: string[];
      flow?: string[];
      visual?: SubjectVisual;
      wide?: boolean;
    }[];
    cuesLabel?: string;
    memoryLineLabel?: string;
    memoryLineAtEnd?: boolean;
    memoryLine: string;
    cues: string[];
    trap: string;
  };
};

export type SubjectModule = {
  order: string;
  title: string;
  description: string;
  topics: SubjectTopic[];
};

export type SubjectContent = {
  order: string;
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  eyebrow: string;
  estimatedTime: string;
  modules: SubjectModule[];
};
