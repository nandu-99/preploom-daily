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

export const createTopicSchema = z.object({
  title: z.string().trim().min(2).max(160),
  slug: slugSchema,
  summary: z.string().trim().min(10).max(1000).nullable().optional(),
  content: z.string().trim().min(20),
  position: z.number().int().min(0).optional(),
});

export const updateTopicSchema = createTopicSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update.",
  });

const subjectParamsSchema = z.object({ subjectSlug: slugSchema });
const topicSlugParamsSchema = subjectParamsSchema.extend({
  topicSlug: slugSchema,
});
const topicIdParamsSchema = subjectParamsSchema.extend({
  id: z.string().min(1),
});

export const topicsRouter = Router({ mergeParams: true });

topicsRouter.get(
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

    const topics = await prisma.topic.findMany({
      where: { subjectId: subject.id },
      orderBy: [{ position: "asc" }, { title: "asc" }],
      select: {
        id: true,
        title: true,
        slug: true,
        summary: true,
        position: true,
      },
    });

    response.status(200).json({ data: { topics } });
  },
);

topicsRouter.get(
  "/:topicSlug",
  validateRequest({ params: topicSlugParamsSchema }),
  async (request, response) => {
    const subjectSlug = request.params.subjectSlug as string;
    const topicSlug = request.params.topicSlug as string;
    const subject = await prisma.subject.findUnique({
      where: { slug: subjectSlug },
    });

    if (!subject) {
      throw new AppError("Subject not found.", 404, "SUBJECT_NOT_FOUND");
    }

    const topic = await prisma.topic.findUnique({
      where: { subjectId_slug: { subjectId: subject.id, slug: topicSlug } },
    });

    if (!topic) {
      throw new AppError("Topic not found.", 404, "TOPIC_NOT_FOUND");
    }

    response.status(200).json({ data: { topic } });
  },
);

topicsRouter.post(
  "/",
  requireAdmin,
  validateRequest({ params: subjectParamsSchema, body: createTopicSchema }),
  async (request, response) => {
    const subjectSlug = request.params.subjectSlug as string;
    const input = request.body as z.infer<typeof createTopicSchema>;
    const subject = await prisma.subject.findUnique({
      where: { slug: subjectSlug },
    });

    if (!subject) {
      throw new AppError("Subject not found.", 404, "SUBJECT_NOT_FOUND");
    }

    const existingTopic = await prisma.topic.findUnique({
      where: { subjectId_slug: { subjectId: subject.id, slug: input.slug } },
    });

    if (existingTopic) {
      throw new AppError(
        "A topic with this slug already exists in the subject.",
        409,
        "TOPIC_SLUG_EXISTS",
      );
    }

    const topic = await prisma.topic.create({
      data: { ...input, subjectId: subject.id },
    });

    response.status(201).json({ data: { topic } });
  },
);

topicsRouter.patch(
  "/:id",
  requireAdmin,
  validateRequest({ params: topicIdParamsSchema, body: updateTopicSchema }),
  async (request, response) => {
    const subjectSlug = request.params.subjectSlug as string;
    const id = request.params.id as string;
    const input = request.body as z.infer<typeof updateTopicSchema>;
    const subject = await prisma.subject.findUnique({
      where: { slug: subjectSlug },
    });

    if (!subject) {
      throw new AppError("Subject not found.", 404, "SUBJECT_NOT_FOUND");
    }

    const topic = await prisma.topic.findFirst({
      where: { id, subjectId: subject.id },
    });

    if (!topic) {
      throw new AppError("Topic not found.", 404, "TOPIC_NOT_FOUND");
    }

    if (input.slug && input.slug !== topic.slug) {
      const existingTopic = await prisma.topic.findUnique({
        where: { subjectId_slug: { subjectId: subject.id, slug: input.slug } },
      });

      if (existingTopic) {
        throw new AppError(
          "A topic with this slug already exists in the subject.",
          409,
          "TOPIC_SLUG_EXISTS",
        );
      }
    }

    const updatedTopic = await prisma.topic.update({
      where: { id: topic.id },
      data: input,
    });

    response.status(200).json({ data: { topic: updatedTopic } });
  },
);

topicsRouter.delete(
  "/:id",
  requireAdmin,
  validateRequest({ params: topicIdParamsSchema }),
  async (request, response) => {
    const subjectSlug = request.params.subjectSlug as string;
    const id = request.params.id as string;
    const subject = await prisma.subject.findUnique({
      where: { slug: subjectSlug },
    });

    if (!subject) {
      throw new AppError("Subject not found.", 404, "SUBJECT_NOT_FOUND");
    }

    const topic = await prisma.topic.findFirst({
      where: { id, subjectId: subject.id },
    });

    if (!topic) {
      throw new AppError("Topic not found.", 404, "TOPIC_NOT_FOUND");
    }

    await prisma.topic.delete({ where: { id: topic.id } });
    response.status(204).end();
  },
);
