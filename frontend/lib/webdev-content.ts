import type {
  WebsiteResource,
  ProjectIdea,
  ComponentLibrary,
  SkillTemplate,
  PracticalGuide,
} from "@/content/webdev";

export type WebdevData = {
  websiteResources: WebsiteResource[];
  projectIdeas: ProjectIdea[];
  componentLibraries: ComponentLibrary[];
  skillTemplates: SkillTemplate[];
  practicalGuides: PracticalGuide[];
};

const backendUrl =
  process.env.BACKEND_URL ??
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  "http://localhost:4000";

export async function getWebdevContent(): Promise<WebdevData | null> {
  try {
    const response = await fetch(`${backendUrl}/webdev`, { cache: "no-store" });
    if (!response.ok) return null;
    const body = (await response.json()) as { data?: { content?: WebdevData } };
    return body.data?.content ?? null;
  } catch {
    return null;
  }
}
