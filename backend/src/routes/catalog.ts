import { Router } from "express";
import { prisma } from "../config/database.js";

export const catalogRouter = Router();

catalogRouter.get("/subjects", async (_request, response) => {
  const catalog = await prisma.siteCatalog.findUnique({
    where: { id: "subjects" },
  });
  response.status(200).json({ data: { subjects: catalog?.details ?? [] } });
});
