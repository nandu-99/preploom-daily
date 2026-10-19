import "dotenv/config";
import { z } from "zod";

const environmentSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().max(65535).default(4000),
  FRONTEND_URL: z.url().default("http://localhost:3000"),
});

const result = environmentSchema.safeParse(process.env);

if (!result.success) {
  console.error(
    "Invalid backend environment configuration",
    result.error.flatten().fieldErrors,
  );
  process.exit(1);
}

export const env = result.data;
