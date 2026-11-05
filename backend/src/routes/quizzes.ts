import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/database.js";
import { AppError } from "../errors/app-error.js";
import { requireAdmin } from "../middleware/require-admin.js";
import { validateRequest } from "../middleware/validate-request.js";

const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(2)
  .max(160)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a URL-friendly slug.");

const quizQuestionSchema = z
  .object({
    prompt: z.string().trim().min(5),
    options: z.array(z.string().trim().min(1)).min(2).max(6),
    correctOption: z.number().int().min(0),
    explanation: z.string().trim().nullable().optional(),
  })
  .refine((question) => question.correctOption < question.options.length, {
    message: "The correct option must match one of the options.",
    path: ["correctOption"],
  });

export const createQuizSchema = z.object({
  title: z.string().trim().min(2).max(160),
  slug: slugSchema,
  summary: z.string().trim().min(10).max(1000).nullable().optional(),
  position: z.number().int().min(0).optional(),
  questions: z.array(quizQuestionSchema).min(1),
});

export const updateQuizSchema = createQuizSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update.",
  });

const subjectParamsSchema = z.object({ subjectSlug: slugSchema });
const quizSlugParamsSchema = subjectParamsSchema.extend({
  quizSlug: slugSchema,
});
const quizIdParamsSchema = subjectParamsSchema.extend({
  id: z.string().min(1),
});

export const quizzesRouter = Router({ mergeParams: true });

quizzesRouter.get(
  "/",
  validateRequest({ params: subjectParamsSchema }),
  async (request, response) => {
    const subject = await prisma.subject.findUnique({
      where: { slug: request.params.subjectSlug as string },
    });
    if (!subject) {
      throw new AppError("Subject not found.", 404, "SUBJECT_NOT_FOUND");
    }

    const quizzes = await prisma.quiz.findMany({
      where: { subjectId: subject.id },
      orderBy: [{ position: "asc" }, { title: "asc" }],
      select: {
        id: true,
        title: true,
        slug: true,
        summary: true,
        position: true,
        _count: { select: { questions: true } },
      },
    });
    response.status(200).json({ data: { quizzes } });
  },
);

quizzesRouter.get(
  "/:quizSlug/answer-key",
  requireAdmin,
  validateRequest({ params: quizSlugParamsSchema }),
  async (request, response) => {
    const subject = await prisma.subject.findUnique({
      where: { slug: request.params.subjectSlug as string },
    });
    if (!subject) {
      throw new AppError("Subject not found.", 404, "SUBJECT_NOT_FOUND");
    }

    const quiz = await prisma.quiz.findUnique({
      where: {
        subjectId_slug: {
          subjectId: subject.id,
          slug: request.params.quizSlug as string,
        },
      },
      include: { questions: { orderBy: { position: "asc" } } },
    });
    if (!quiz) {
      throw new AppError("Quiz not found.", 404, "QUIZ_NOT_FOUND");
    }

    response.status(200).json({ data: { quiz } });
  },
);

quizzesRouter.get(
  "/:quizSlug",
  validateRequest({ params: quizSlugParamsSchema }),
  async (request, response) => {
    const subject = await prisma.subject.findUnique({
      where: { slug: request.params.subjectSlug as string },
    });
    if (!subject) {
      throw new AppError("Subject not found.", 404, "SUBJECT_NOT_FOUND");
    }

    const quiz = await prisma.quiz.findUnique({
      where: {
        subjectId_slug: {
          subjectId: subject.id,
          slug: request.params.quizSlug as string,
        },
      },
      include: {
        questions: {
          orderBy: { position: "asc" },
          select: { id: true, prompt: true, options: true, position: true },
        },
      },
    });
    if (!quiz) {
      throw new AppError("Quiz not found.", 404, "QUIZ_NOT_FOUND");
    }

    response.status(200).json({ data: { quiz } });
  },
);

quizzesRouter.post(
  "/",
  requireAdmin,
  validateRequest({ params: subjectParamsSchema, body: createQuizSchema }),
  async (request, response) => {
    const input = request.body as z.infer<typeof createQuizSchema>;
    const subject = await prisma.subject.findUnique({
      where: { slug: request.params.subjectSlug as string },
    });
    if (!subject) {
      throw new AppError("Subject not found.", 404, "SUBJECT_NOT_FOUND");
    }

    const existingQuiz = await prisma.quiz.findUnique({
      where: { subjectId_slug: { subjectId: subject.id, slug: input.slug } },
    });
    if (existingQuiz) {
      throw new AppError(
        "A quiz with this slug already exists in the subject.",
        409,
        "QUIZ_SLUG_EXISTS",
      );
    }

    const { questions, ...details } = input;
    const quiz = await prisma.quiz.create({
      data: {
        ...details,
        subjectId: subject.id,
        questions: {
          create: questions.map((question, position) => ({
            ...question,
            position,
          })),
        },
      },
      include: { questions: { orderBy: { position: "asc" } } },
    });
    response.status(201).json({ data: { quiz } });
  },
);

quizzesRouter.patch(
  "/:id",
  requireAdmin,
  validateRequest({ params: quizIdParamsSchema, body: updateQuizSchema }),
  async (request, response) => {
    const input = request.body as z.infer<typeof updateQuizSchema>;
    const subject = await prisma.subject.findUnique({
      where: { slug: request.params.subjectSlug as string },
    });
    if (!subject) {
      throw new AppError("Subject not found.", 404, "SUBJECT_NOT_FOUND");
    }

    const quiz = await prisma.quiz.findFirst({
      where: { id: request.params.id as string, subjectId: subject.id },
    });
    if (!quiz) {
      throw new AppError("Quiz not found.", 404, "QUIZ_NOT_FOUND");
    }

    if (input.slug && input.slug !== quiz.slug) {
      const existingQuiz = await prisma.quiz.findUnique({
        where: { subjectId_slug: { subjectId: subject.id, slug: input.slug } },
      });
      if (existingQuiz) {
        throw new AppError(
          "A quiz with this slug already exists in the subject.",
          409,
          "QUIZ_SLUG_EXISTS",
        );
      }
    }

    const { questions, ...details } = input;
    const updatedQuiz = await prisma.quiz.update({
      where: { id: quiz.id },
      data: {
        ...details,
        ...(questions && {
          questions: {
            deleteMany: {},
            create: questions.map((question, position) => ({
              ...question,
              position,
            })),
          },
        }),
      },
      include: { questions: { orderBy: { position: "asc" } } },
    });
    response.status(200).json({ data: { quiz: updatedQuiz } });
  },
);

quizzesRouter.delete(
  "/:id",
  requireAdmin,
  validateRequest({ params: quizIdParamsSchema }),
  async (request, response) => {
    const subject = await prisma.subject.findUnique({
      where: { slug: request.params.subjectSlug as string },
    });
    if (!subject) {
      throw new AppError("Subject not found.", 404, "SUBJECT_NOT_FOUND");
    }

    const quiz = await prisma.quiz.findFirst({
      where: { id: request.params.id as string, subjectId: subject.id },
    });
    if (!quiz) {
      throw new AppError("Quiz not found.", 404, "QUIZ_NOT_FOUND");
    }

    await prisma.quiz.delete({ where: { id: quiz.id } });
    response.status(204).end();
  },
);
