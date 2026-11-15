export type DsaGoal = "Foundations" | "Interview" | "Revision";
export type DsaExperience =
  "New to DSA" | "Know the basics" | "Comfortable with DSA";
export type DsaScope = "Focused" | "Balanced" | "Comprehensive";

export type DsaSheet = {
  id: string;
  name: string;
  provider: string;
  mark: string;
  summary: string;
  bestFor: string;
  avoidIf: string;
  goals: DsaGoal[];
  experience: DsaExperience;
  scope: DsaScope;
  pace: string;
  topics: string[];
  approach: string[];
  href: string;
};
