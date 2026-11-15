import { Router } from "express";
import { prisma } from "../config/database.js";

export const dsaSheetsRouter = Router();

dsaSheetsRouter.get("/", async (_request, response) => {
  const rows = await prisma.dsaSheet.findMany({ orderBy: { position: "asc" } });
  response
    .status(200)
    .json({ data: { sheets: rows.map((row) => row.details) } });
});
