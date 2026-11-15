import { Router } from "express";
import { prisma } from "../config/database.js";

export const webdevRouter = Router();

webdevRouter.get("/", async (_request, response) => {
  const content = await prisma.webdevContent.findUnique({
    where: { id: "main" },
  });
  response.status(200).json({ data: { content: content?.details ?? null } });
});
