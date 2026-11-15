import { Router } from "express";
import { prisma } from "../config/database.js";
import { AppError } from "../errors/app-error.js";

export const publicQuizzesRouter = Router();

publicQuizzesRouter.get("/:slug", async (request, response) => {
  const slug = request.params.slug as string;
  const quiz = await prisma.quiz.findFirst({ where: { slug } });
  if (!quiz?.definition)
    throw new AppError("Quiz not found.", 404, "QUIZ_NOT_FOUND");
  const definition = quiz.definition as {
    questions: { correctOptionId: string }[];
  } & Record<string, unknown>;
  response.status(200).json({
    data: {
      quiz: {
        ...definition,
        questions: definition.questions.map((question) => ({
          ...question,
          correctOptionId: undefined,
          explanation: undefined,
          keyPoint: undefined,
        })),
      },
    },
  });
});

publicQuizzesRouter.post("/:slug/grade", async (request, response) => {
  const slug = request.params.slug as string;
  const quiz = await prisma.quiz.findFirst({ where: { slug } });
  if (!quiz?.definition)
    throw new AppError("Quiz not found.", 404, "QUIZ_NOT_FOUND");
  const answers = (request.body as { answers?: unknown }).answers;
  if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
    response.status(400).json({ message: "Provide your answers." });
    return;
  }
  const definition = quiz.definition as {
    questions: {
      id: string;
      correctOptionId: string;
      explanation: string;
      keyPoint: string;
    }[];
  };
  const correctOptionIds = Object.fromEntries(
    definition.questions.map((question) => [
      question.id,
      question.correctOptionId,
    ]),
  );
  const reviewDetails = Object.fromEntries(
    definition.questions.map((question) => [
      question.id,
      { explanation: question.explanation, keyPoint: question.keyPoint },
    ]),
  );
  const score = definition.questions.filter(
    (question) =>
      (answers as Record<string, unknown>)[question.id] ===
      question.correctOptionId,
  ).length;
  response
    .status(200)
    .json({ data: { score, correctOptionIds, reviewDetails } });
});
