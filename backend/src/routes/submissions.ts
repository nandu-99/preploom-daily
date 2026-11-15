import { Router } from "express";
import { prisma } from "../config/database.js";
import { requireAdmin } from "../middleware/require-admin.js";

export const submissionsRouter = Router();

submissionsRouter.post("/", async (request, response) => {
  const input = request.body as Record<string, unknown>;
  const kind = input.formType;
  const name =
    typeof input.name === "string" ? input.name.trim().slice(0, 120) : "";
  const email =
    typeof input.email === "string" ? input.email.trim().slice(0, 254) : "";
  const category =
    typeof input.category === "string"
      ? input.category.trim().slice(0, 80)
      : "";
  const message =
    typeof input.message === "string"
      ? input.message.trim().slice(0, 5000)
      : "";
  const pageUrl =
    typeof input.pageUrl === "string"
      ? input.pageUrl.trim().slice(0, 1000)
      : "";

  if (
    (kind !== "contact" && kind !== "feedback") ||
    !category ||
    !message ||
    (kind === "contact" && (!name || !email)) ||
    (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
  ) {
    response.status(400).json({ message: "Please check the form fields." });
    return;
  }

  await prisma.submission.create({
    data: {
      kind,
      name: name || null,
      email: email || null,
      category,
      message,
      pageUrl: pageUrl || null,
    },
  });
  response.status(201).json({ message: "Submission received." });
});

submissionsRouter.get("/", requireAdmin, async (_request, response) => {
  const submissions = await prisma.submission.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  response.status(200).json({ data: { submissions } });
});
