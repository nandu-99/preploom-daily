import cors from "cors";
import express from "express";
import helmet from "helmet";
import { prisma } from "./config/database.js";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/error-handler.js";
import { adminAuthRouter } from "./routes/admin-auth.js";
import { questionsRouter } from "./routes/questions.js";
import { quizzesRouter } from "./routes/quizzes.js";
import { roadmapsRouter } from "./routes/roadmaps.js";
import { subjectsRouter } from "./routes/subjects.js";
import { topicsRouter } from "./routes/topics.js";
import { dsaSheetsRouter } from "./routes/dsa-sheets.js";
import { interviewCollectionsRouter } from "./routes/interview-collections.js";
import { publicRoadmapsRouter } from "./routes/public-roadmaps.js";
import { publicQuizzesRouter } from "./routes/public-quizzes.js";
import { webdevRouter } from "./routes/webdev.js";
import { submissionsRouter } from "./routes/submissions.js";
import { catalogRouter } from "./routes/catalog.js";
import { adminContentRouter } from "./routes/admin-content.js";
import { searchRouter } from "./routes/search.js";

export const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));

app.get("/", (_request, response) => {
  response.status(200).json({
    service: "preploom-backend",
    status: "running",
  });
});

app.get("/health", async (_request, response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    response.status(200).json({ status: "ok" });
  } catch {
    response.status(503).json({ status: "unavailable" });
  }
});

app.use("/admin", adminAuthRouter);
app.use("/admin/content", adminContentRouter);
app.use("/subjects/:subjectSlug/questions", questionsRouter);
app.use("/subjects/:subjectSlug/quizzes", quizzesRouter);
app.use("/subjects/:subjectSlug/roadmaps", roadmapsRouter);
app.use("/subjects/:subjectSlug/topics", topicsRouter);
app.use("/subjects", subjectsRouter);
app.use("/dsa/sheets", dsaSheetsRouter);
app.use("/interview-questions", interviewCollectionsRouter);
app.use("/roadmaps", publicRoadmapsRouter);
app.use("/quizzes", publicQuizzesRouter);
app.use("/webdev", webdevRouter);
app.use("/messages", submissionsRouter);
app.use("/catalog", catalogRouter);
app.use("/search", searchRouter);

app.use(notFoundHandler);
app.use(errorHandler);
