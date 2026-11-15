import { Router } from "express";
import { prisma } from "../config/database.js";
import { AppError } from "../errors/app-error.js";

export const interviewCollectionsRouter = Router();

interviewCollectionsRouter.get("/", async (_request, response) => {
  const collections = await prisma.interviewCollection.findMany();
  response.status(200).json({
    data: {
      collections: collections.map((item) => ({
        slug: item.slug,
        count: Array.isArray(item.questions) ? item.questions.length : 0,
      })),
    },
  });
});

interviewCollectionsRouter.get("/:slug", async (request, response) => {
  const slug = request.params.slug as string;
  const collection = await prisma.interviewCollection.findUnique({
    where: { slug },
  });
  if (!collection)
    throw new AppError("Collection not found.", 404, "COLLECTION_NOT_FOUND");
  response.status(200).json({ data: { collection } });
});
