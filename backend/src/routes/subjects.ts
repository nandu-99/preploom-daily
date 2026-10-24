import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/database.js";
import { AppError } from "../errors/app-error.js";
import { requireAdmin } from "../middleware/require-admin.js";
import { validateRequest } from "../middleware/validate-request.js";

export const createSubjectSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a URL-friendly slug."),
  description: z.string().trim().min(10).max(1000).nullable().optional(),
});

export const updateSubjectSchema = createSubjectSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update.",
  });

const subjectIdSchema = z.object({ id: z.string().min(1) });
const subjectSlugSchema = z.object({ slug: z.string().min(1) });

export const subjectsRouter = Router();

subjectsRouter.get("/", async (_request, response) => {
  const subjects = await prisma.subject.findMany({
    orderBy: { name: "asc" },
  });

  response.status(200).json({ data: { subjects } });
});

subjectsRouter.get(
  "/:slug",
  validateRequest({ params: subjectSlugSchema }),
  async (request, response) => {
    const slug = request.params.slug as string;
    const subject = await prisma.subject.findUnique({
      where: { slug },
    });

    if (!subject) {
      throw new AppError("Subject not found.", 404, "SUBJECT_NOT_FOUND");
    }

    response.status(200).json({ data: { subject } });
  },
);

subjectsRouter.post(
  "/",
  requireAdmin,
  validateRequest({ body: createSubjectSchema }),
  async (request, response) => {
    const input = request.body as z.infer<typeof createSubjectSchema>;
    const existingSubject = await prisma.subject.findUnique({
      where: { slug: input.slug },
    });

    if (existingSubject) {
      throw new AppError(
        "A subject with this slug already exists.",
        409,
        "SUBJECT_SLUG_EXISTS",
      );
    }

    const subject = await prisma.subject.create({ data: input });
    response.status(201).json({ data: { subject } });
  },
);

subjectsRouter.patch(
  "/:id",
  requireAdmin,
  validateRequest({ params: subjectIdSchema, body: updateSubjectSchema }),
  async (request, response) => {
    const id = request.params.id as string;
    const input = request.body as z.infer<typeof updateSubjectSchema>;
    const subject = await prisma.subject.findUnique({
      where: { id },
    });

    if (!subject) {
      throw new AppError("Subject not found.", 404, "SUBJECT_NOT_FOUND");
    }

    if (input.slug && input.slug !== subject.slug) {
      const slugExists = await prisma.subject.findUnique({
        where: { slug: input.slug },
      });

      if (slugExists) {
        throw new AppError(
          "A subject with this slug already exists.",
          409,
          "SUBJECT_SLUG_EXISTS",
        );
      }
    }

    const updatedSubject = await prisma.subject.update({
      where: { id: subject.id },
      data: input,
    });

    response.status(200).json({ data: { subject: updatedSubject } });
  },
);

subjectsRouter.delete(
  "/:id",
  requireAdmin,
  validateRequest({ params: subjectIdSchema }),
  async (request, response) => {
    const id = request.params.id as string;
    const subject = await prisma.subject.findUnique({
      where: { id },
    });

    if (!subject) {
      throw new AppError("Subject not found.", 404, "SUBJECT_NOT_FOUND");
    }

    await prisma.subject.delete({ where: { id: subject.id } });
    response.status(204).end();
  },
);
