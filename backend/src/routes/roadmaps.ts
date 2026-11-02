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

const stepSchema = z.object({
  title: z.string().trim().min(2).max(160),
  description: z.string().trim().min(10),
});

export const createRoadmapSchema = z.object({
  title: z.string().trim().min(2).max(160),
  slug: slugSchema,
  summary: z.string().trim().min(10).max(1000).nullable().optional(),
  steps: z.array(stepSchema).min(1),
  position: z.number().int().min(0).optional(),
});

export const updateRoadmapSchema = createRoadmapSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update.",
  });

const subjectParamsSchema = z.object({ subjectSlug: slugSchema });
const roadmapSlugParamsSchema = subjectParamsSchema.extend({
  roadmapSlug: slugSchema,
});
const roadmapIdParamsSchema = subjectParamsSchema.extend({
  id: z.string().min(1),
});

export const roadmapsRouter = Router({ mergeParams: true });

roadmapsRouter.get(
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

    const roadmaps = await prisma.roadmap.findMany({
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

    response.status(200).json({ data: { roadmaps } });
  },
);

roadmapsRouter.get(
  "/:roadmapSlug",
  validateRequest({ params: roadmapSlugParamsSchema }),
  async (request, response) => {
    const subjectSlug = request.params.subjectSlug as string;
    const roadmapSlug = request.params.roadmapSlug as string;
    const subject = await prisma.subject.findUnique({
      where: { slug: subjectSlug },
    });

    if (!subject) {
      throw new AppError("Subject not found.", 404, "SUBJECT_NOT_FOUND");
    }

    const roadmap = await prisma.roadmap.findUnique({
      where: { subjectId_slug: { subjectId: subject.id, slug: roadmapSlug } },
    });

    if (!roadmap) {
      throw new AppError("Roadmap not found.", 404, "ROADMAP_NOT_FOUND");
    }

    response.status(200).json({ data: { roadmap } });
  },
);

roadmapsRouter.post(
  "/",
  requireAdmin,
  validateRequest({ params: subjectParamsSchema, body: createRoadmapSchema }),
  async (request, response) => {
    const subjectSlug = request.params.subjectSlug as string;
    const input = request.body as z.infer<typeof createRoadmapSchema>;
    const subject = await prisma.subject.findUnique({
      where: { slug: subjectSlug },
    });

    if (!subject) {
      throw new AppError("Subject not found.", 404, "SUBJECT_NOT_FOUND");
    }

    const existingRoadmap = await prisma.roadmap.findUnique({
      where: { subjectId_slug: { subjectId: subject.id, slug: input.slug } },
    });

    if (existingRoadmap) {
      throw new AppError(
        "A roadmap with this slug already exists in the subject.",
        409,
        "ROADMAP_SLUG_EXISTS",
      );
    }

    const roadmap = await prisma.roadmap.create({
      data: { ...input, subjectId: subject.id },
    });

    response.status(201).json({ data: { roadmap } });
  },
);

roadmapsRouter.patch(
  "/:id",
  requireAdmin,
  validateRequest({ params: roadmapIdParamsSchema, body: updateRoadmapSchema }),
  async (request, response) => {
    const subjectSlug = request.params.subjectSlug as string;
    const id = request.params.id as string;
    const input = request.body as z.infer<typeof updateRoadmapSchema>;
    const subject = await prisma.subject.findUnique({
      where: { slug: subjectSlug },
    });

    if (!subject) {
      throw new AppError("Subject not found.", 404, "SUBJECT_NOT_FOUND");
    }

    const roadmap = await prisma.roadmap.findFirst({
      where: { id, subjectId: subject.id },
    });

    if (!roadmap) {
      throw new AppError("Roadmap not found.", 404, "ROADMAP_NOT_FOUND");
    }

    if (input.slug && input.slug !== roadmap.slug) {
      const existingRoadmap = await prisma.roadmap.findUnique({
        where: { subjectId_slug: { subjectId: subject.id, slug: input.slug } },
      });

      if (existingRoadmap) {
        throw new AppError(
          "A roadmap with this slug already exists in the subject.",
          409,
          "ROADMAP_SLUG_EXISTS",
        );
      }
    }

    const updatedRoadmap = await prisma.roadmap.update({
      where: { id: roadmap.id },
      data: input,
    });

    response.status(200).json({ data: { roadmap: updatedRoadmap } });
  },
);

roadmapsRouter.delete(
  "/:id",
  requireAdmin,
  validateRequest({ params: roadmapIdParamsSchema }),
  async (request, response) => {
    const subjectSlug = request.params.subjectSlug as string;
    const id = request.params.id as string;
    const subject = await prisma.subject.findUnique({
      where: { slug: subjectSlug },
    });

    if (!subject) {
      throw new AppError("Subject not found.", 404, "SUBJECT_NOT_FOUND");
    }

    const roadmap = await prisma.roadmap.findFirst({
      where: { id, subjectId: subject.id },
    });

    if (!roadmap) {
      throw new AppError("Roadmap not found.", 404, "ROADMAP_NOT_FOUND");
    }

    await prisma.roadmap.delete({ where: { id: roadmap.id } });
    response.status(204).end();
  },
);
