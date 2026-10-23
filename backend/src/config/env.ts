import "dotenv/config";
import { z } from "zod";

const environmentSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().max(65535).default(4000),
  FRONTEND_URL: z.url().default("http://localhost:3000"),
  DATABASE_URL: z
    .url()
    .refine(
      (value) =>
        value.startsWith("postgresql://") || value.startsWith("postgres://"),
      "DATABASE_URL must use the PostgreSQL protocol.",
    )
    .default(
      "postgresql://postgres:postgres@localhost:5432/preploom?schema=public",
    ),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN_SECONDS: z.coerce.number().int().positive().default(3600),
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
