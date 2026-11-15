import { Router } from "express";
import { prisma } from "../config/database.js";

export const publicRoadmapsRouter = Router();

publicRoadmapsRouter.get("/", async (_request, response) => {
  const rows = await prisma.publicRoadmap.findMany({
    orderBy: { position: "asc" },
  });
  response
    .status(200)
    .json({ data: { roadmaps: rows.map((row) => row.details) } });
});
