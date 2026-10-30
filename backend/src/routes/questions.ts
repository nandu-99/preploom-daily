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

export const createQuestionSchema = z.object({
  prompt: z.string().trim().min(10),
  slug: slugSchema,
  answer: z.string().trim().min(20),
  position: z.number().int().min(0).optional(),
});

export const updateQuestionSchema = createQuestionSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update.",
  });

const subjectParamsSchema = z.object({ subjectSlug: slugSchema });
const questionSlugParamsSchema = subjectParamsSchema.extend({
  questionSlug: slugSchema,
});
const questionIdParamsSchema = subjectParamsSchema.extend({
  id: z.string().min(1),
});

export const questionsRouter = Router({ mergeParams: true });

questionsRouter.get(
  "/",
  validateRequest({ params: subjectParamsSchema }),
  async (request, response) => {
    const subjectSlug = request.params.subjectSlug as string;
    const subject = await prisma.subject.findUnique({
      where: { slug: subjectSlug },
    });

    if (!subject) {
      throw new AppError("Subject not found.", 404, "SUBJECT_NOT_FOUND");
    }

    const questions = await prisma.question.findMany({
      where: { subjectId: subject.id },
      orderBy: [{ position: "asc" }, { prompt: "asc" }],
      select: {
        id: true,
        prompt: true,
        slug: true,
        position: true,
      },
    });

    response.status(200).json({ data: { questions } });
  },
);

questionsRouter.get(
  "/:questionSlug",
  validateRequest({ params: questionSlugParamsSchema }),
  async (request, response) => {
    const subjectSlug = request.params.subjectSlug as string;
    const questionSlug = request.params.questionSlug as string;
    const subject = await prisma.subject.findUnique({
      where: { slug: subjectSlug },
    });

    if (!subject) {
      throw new AppError("Subject not found.", 404, "SUBJECT_NOT_FOUND");
    }

    const question = await prisma.question.findUnique({
      where: {
        subjectId_slug: { subjectId: subject.id, slug: questionSlug },
      },
    });

    if (!question) {
      throw new AppError("Question not found.", 404, "QUESTION_NOT_FOUND");
    }

    response.status(200).json({ data: { question } });
  },
);

questionsRouter.post(
  "/",
  requireAdmin,
  validateRequest({ params: subjectParamsSchema, body: createQuestionSchema }),
  async (request, response) => {
    const subjectSlug = request.params.subjectSlug as string;
    const input = request.body as z.infer<typeof createQuestionSchema>;
    const subject = await prisma.subject.findUnique({
      where: { slug: subjectSlug },
    });

    if (!subject) {
      throw new AppError("Subject not found.", 404, "SUBJECT_NOT_FOUND");
    }

    const existingQuestion = await prisma.question.findUnique({
      where: { subjectId_slug: { subjectId: subject.id, slug: input.slug } },
    });

    if (existingQuestion) {
      throw new AppError(
        "A question with this slug already exists in the subject.",
        409,
        "QUESTION_SLUG_EXISTS",
      );
    }

    const question = await prisma.question.create({
      data: { ...input, subjectId: subject.id },
    });

    response.status(201).json({ data: { question } });
  },
);

questionsRouter.patch(
  "/:id",
  requireAdmin,
  validateRequest({
    params: questionIdParamsSchema,
    body: updateQuestionSchema,
  }),
  async (request, response) => {
    const subjectSlug = request.params.subjectSlug as string;
    const id = request.params.id as string;
    const input = request.body as z.infer<typeof updateQuestionSchema>;
    const subject = await prisma.subject.findUnique({
      where: { slug: subjectSlug },
    });

    if (!subject) {
      throw new AppError("Subject not found.", 404, "SUBJECT_NOT_FOUND");
    }

    const question = await prisma.question.findFirst({
      where: { id, subjectId: subject.id },
    });

    if (!question) {
      throw new AppError("Question not found.", 404, "QUESTION_NOT_FOUND");
    }

    if (input.slug && input.slug !== question.slug) {
      const existingQuestion = await prisma.question.findUnique({
        where: { subjectId_slug: { subjectId: subject.id, slug: input.slug } },
      });

      if (existingQuestion) {
        throw new AppError(
          "A question with this slug already exists in the subject.",
          409,
          "QUESTION_SLUG_EXISTS",
        );
      }
    }

    const updatedQuestion = await prisma.question.update({
      where: { id: question.id },
      data: input,
    });

    response.status(200).json({ data: { question: updatedQuestion } });
  },
);

questionsRouter.delete(
  "/:id",
  requireAdmin,
  validateRequest({ params: questionIdParamsSchema }),
  async (request, response) => {
    const subjectSlug = request.params.subjectSlug as string;
    const id = request.params.id as string;
    const subject = await prisma.subject.findUnique({
      where: { slug: subjectSlug },
    });

    if (!subject) {
      throw new AppError("Subject not found.", 404, "SUBJECT_NOT_FOUND");
    }

    const question = await prisma.question.findFirst({
      where: { id, subjectId: subject.id },
    });

    if (!question) {
      throw new AppError("Question not found.", 404, "QUESTION_NOT_FOUND");
    }

    await prisma.question.delete({ where: { id: question.id } });
    response.status(204).end();
  },
);
