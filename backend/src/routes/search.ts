import { Router } from "express";
import { prisma } from "../config/database.js";

type SearchItem = {
  title: string;
  description: string;
  href: string;
  keywords: string[];
  icon: "book" | "braces" | "code" | "route";
  type:
    | "subject"
    | "module"
    | "topic"
    | "interview-question"
    | "resource"
    | "roadmap";
};

type Course = {
  modules?: {
    title: string;
    description?: string;
    topics?: {
      slug: string;
      title: string;
      description?: string;
      tags?: string[];
    }[];
  }[];
};

export const searchRouter = Router();

searchRouter.get("/catalog", async (_request, response) => {
  const [catalog, subjects, interviews, roadmaps, webdev] = await Promise.all([
    prisma.siteCatalog.findUnique({ where: { id: "subjects" } }),
    prisma.subject.findMany({
      select: { slug: true, name: true, description: true, course: true },
    }),
    prisma.interviewCollection.findMany(),
    prisma.publicRoadmap.findMany(),
    prisma.webdevContent.findUnique({ where: { id: "main" } }),
  ]);
  const catalogSubjects = Array.isArray(catalog?.details)
    ? (catalog.details as {
        slug: string;
        name: string;
        description?: string;
      }[])
    : [];
  const subjectItems: SearchItem[] = catalogSubjects.map((subject) => ({
    title: subject.name,
    description: subject.description ?? "",
    href: `/subjects/${subject.slug}`,
    keywords: [subject.slug],
    icon: "book",
    type: "subject",
  }));
  const noteItems: SearchItem[] = [];
  for (const subject of subjects) {
    const course = subject.course as Course | null;
    for (const module of course?.modules ?? []) {
      noteItems.push({
        title: module.title,
        description: module.description ?? subject.name,
        href: `/subjects/${subject.slug}`,
        keywords: [subject.name],
        icon: "book",
        type: "module",
      });
      for (const topic of module.topics ?? []) {
        noteItems.push({
          title: topic.title,
          description: topic.description ?? subject.name,
          href: `/subjects/${subject.slug}?topic=${encodeURIComponent(topic.slug)}`,
          keywords: [subject.name, ...(topic.tags ?? [])],
          icon: "book",
          type: "topic",
        });
      }
    }
  }
  const questionItems: SearchItem[] = [];
  for (const collection of interviews) {
    const questions = Array.isArray(collection.questions)
      ? (collection.questions as {
          id: string;
          question: string;
          category?: string;
        }[])
      : [];
    for (const question of questions) {
      questionItems.push({
        title: question.question,
        description: question.category ?? collection.slug,
        href: `/interview-questions/${collection.slug}#${question.id}`,
        keywords: [collection.slug],
        icon: "code",
        type: "interview-question",
      });
    }
  }
  const roadmapItems: SearchItem[] = roadmaps.map((entry) => {
    const details = entry.details as { name?: string; description?: string };
    return {
      title: details.name ?? entry.id,
      description: details.description ?? "",
      href: "/roadmaps",
      keywords: [entry.id],
      icon: "route",
      type: "roadmap",
    };
  });
  const resources =
    (
      webdev?.details as {
        websiteResources?: {
          name: string;
          description: string;
          href: string;
        }[];
      } | null
    )?.websiteResources ?? [];
  const resourceItems: SearchItem[] = resources.map((resource) => ({
    title: resource.name,
    description: resource.description,
    href: resource.href,
    keywords: ["webdev"],
    icon: "code",
    type: "resource",
  }));
  response.status(200).json({
    data: {
      catalog: {
        initialGroups: [
          { label: "Subjects", items: subjectItems.slice(0, 5) },
          { label: "Roadmaps", items: roadmapItems },
        ],
        searchGroups: [
          { label: "Subjects", items: subjectItems },
          { label: "Notes", items: noteItems },
          { label: "Interview questions", items: questionItems },
          { label: "Roadmaps", items: roadmapItems },
          { label: "Resources", items: resourceItems },
        ],
      },
    },
  });
});
