import { Router } from "express";
import { prisma } from "../config/database.js";
import { requireAdmin } from "../middleware/require-admin.js";
import { validatePublicContent } from "./validate-public-content.js";

export const adminContentRouter = Router();

adminContentRouter.use(requireAdmin);

adminContentRouter.get("/", async (_request, response) => {
  const [subjects, sheets, interviews, roadmaps, quizzes, webdev, catalog] =
    await Promise.all([
      prisma.subject.findMany({ select: { slug: true, name: true, description: true, course: true } }),
      prisma.dsaSheet.findMany({ orderBy: { position: "asc" } }),
      prisma.interviewCollection.findMany(),
      prisma.publicRoadmap.findMany({ orderBy: { position: "asc" } }),
      prisma.quiz.findMany({ select: {
        slug: true,
        title: true,
        summary: true,
        definition: true,
        subject: { select: { slug: true, name: true } },
        questions: { orderBy: { position: "asc" }, select: { id: true, prompt: true, options: true, correctOption: true, explanation: true } },
      } }),
      prisma.webdevContent.findMany(),
      prisma.siteCatalog.findMany(),
    ]);

  response.status(200).json({
    data: {
      items: [
        ...subjects.map((item) => ({
            kind: "course",
            id: item.slug,
            value: item.course ?? {
              order: "",
              slug: item.slug,
              title: item.name,
              shortTitle: item.name,
              description: item.description ?? "",
              eyebrow: "Subject notes",
              estimatedTime: "",
              modules: [],
            },
          })),
        ...sheets.map((item) => ({
          kind: "dsa-sheet",
          id: item.id,
          value: item.details,
        })),
        ...interviews.map((item) => ({
          kind: "interview-questions",
          id: item.slug,
          value: item.questions,
        })),
        ...roadmaps.map((item) => ({
          kind: "public-roadmap",
          id: item.id,
          value: item.details,
        })),
        ...quizzes.map((item) => ({
            kind: "quiz",
            id: item.slug,
            value: item.definition ?? {
              slug: item.slug,
              eyebrow: "Practice quiz",
              title: item.title,
              description: item.summary ?? "",
              subject: item.subject.name,
              topic: "General",
              estimatedMinutes: 10,
              timeLimitMinutes: 10,
              subjectHref: `/subjects/${item.subject.slug}`,
              questions: item.questions.map((question) => {
                const labels = Array.isArray(question.options) ? question.options : [];
                const options = labels.map((label, index) => ({
                  id: String.fromCharCode(65 + index),
                  label: typeof label === "string" ? label : String(label),
                }));
                return {
                  id: question.id,
                  prompt: question.prompt,
                  options,
                  correctOptionId: options[question.correctOption]?.id ?? "",
                  explanation: question.explanation ?? "",
                  keyPoint: "",
                };
              }),
            },
          })),
        ...webdev.map((item) => ({
          kind: "webdev",
          id: item.id,
          value: item.details,
        })),
        ...catalog.map((item) => ({
          kind: "catalog",
          id: item.id,
          value: item.details,
        })),
      ],
    },
  });
});

adminContentRouter.put("/:kind/:id", async (request, response) => {
  const kind = request.params.kind as string;
  const id = request.params.id as string;
  const value = (request.body as { value?: unknown }).value;
  if (!value || typeof value !== "object" || id.length > 120) {
    response.status(400).json({ message: "Provide valid content." });
    return;
  }

  const validationError = validatePublicContent(kind, id, value);
  if (validationError) {
    response.status(400).json({ message: validationError });
    return;
  }

  if (kind === "course") {
    if (
      Array.isArray(value) ||
      !Array.isArray((value as { modules?: unknown }).modules)
    ) {
      response.status(400).json({ message: "A course needs modules." });
      return;
    }
    const updated = await prisma.subject.updateMany({
      where: { slug: id },
      data: { course: value },
    });
    if (!updated.count) {
      response.status(404).json({ message: "Subject not found." });
      return;
    }
  } else if (kind === "dsa-sheet") {
    if (Array.isArray(value)) {
      response.status(400).json({ message: "A sheet must be an object." });
      return;
    }
    await prisma.dsaSheet.upsert({
      where: { id },
      update: { details: value },
      create: { id, details: value },
    });
  } else if (kind === "interview-questions") {
    if (!Array.isArray(value)) {
      response.status(400).json({ message: "Questions must be a list." });
      return;
    }
    await prisma.interviewCollection.upsert({
      where: { slug: id },
      update: { questions: value },
      create: { slug: id, questions: value },
    });
  } else if (kind === "public-roadmap") {
    if (Array.isArray(value)) {
      response.status(400).json({ message: "A roadmap must be an object." });
      return;
    }
    await prisma.publicRoadmap.upsert({
      where: { id },
      update: { details: value },
      create: { id, details: value },
    });
  } else if (kind === "quiz") {
    if (Array.isArray(value)) {
      response.status(400).json({ message: "A quiz must be an object." });
      return;
    }
    const updated = await prisma.quiz.updateMany({
      where: { slug: id },
      data: { definition: value },
    });
    if (!updated.count) {
      response.status(404).json({ message: "Quiz not found." });
      return;
    }
  } else if (kind === "webdev") {
    if (Array.isArray(value)) {
      response
        .status(400)
        .json({ message: "WebDev content must be an object." });
      return;
    }
    await prisma.webdevContent.upsert({
      where: { id },
      update: { details: value },
      create: { id, details: value },
    });
  } else if (kind === "catalog") {
    if (!Array.isArray(value)) {
      response.status(400).json({ message: "Catalog must be a list." });
      return;
    }
    await prisma.siteCatalog.upsert({
      where: { id },
      update: { details: value },
      create: { id, details: value },
    });
  } else {
    response.status(404).json({ message: "Unknown content type." });
    return;
  }

  response.status(200).json({ data: { kind, id, value } });
});
