export type QuizOption = {
  id: string;
  label: string;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
  keyPoint: string;
  relatedHref?: string;
};

export type QuizDefinition = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  subject: string;
  topic: string;
  estimatedMinutes: number;
  timeLimitMinutes: number;
  subjectHref: string;
  questions: QuizQuestion[];
};
