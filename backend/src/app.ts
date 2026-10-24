import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/error-handler.js";
import { adminAuthRouter } from "./routes/admin-auth.js";
import { subjectsRouter } from "./routes/subjects.js";

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

app.use("/admin", adminAuthRouter);
app.use("/subjects", subjectsRouter);

app.use(notFoundHandler);
app.use(errorHandler);
