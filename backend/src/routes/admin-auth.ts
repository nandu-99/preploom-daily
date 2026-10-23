import bcrypt from "bcryptjs";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../config/database.js";
import { env } from "../config/env.js";
import { AppError } from "../errors/app-error.js";
import { requireAdmin } from "../middleware/require-admin.js";
import { validateRequest } from "../middleware/validate-request.js";

const loginSchema = z.object({
  email: z.email().transform((email) => email.trim().toLowerCase()),
  password: z.string().min(1),
});

export const adminAuthRouter = Router();

adminAuthRouter.post(
  "/login",
  validateRequest({ body: loginSchema }),
  async (request, response) => {
    const { email, password } = request.body as z.infer<typeof loginSchema>;
    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
      throw new AppError(
        "Email or password is incorrect.",
        401,
        "INVALID_CREDENTIALS",
      );
    }

    if (!admin.isActive) {
      throw new AppError(
        "This admin account is inactive.",
        403,
        "ADMIN_INACTIVE",
      );
    }

    const token = jwt.sign({ email: admin.email }, env.JWT_SECRET, {
      subject: admin.id,
      expiresIn: env.JWT_EXPIRES_IN_SECONDS,
    });

    response.status(200).json({
      data: {
        token,
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
        },
      },
    });
  },
);

adminAuthRouter.get("/me", requireAdmin, async (request, response) => {
  const admin = await prisma.admin.findUnique({
    where: { id: request.adminAuth?.id },
  });

  if (!admin || !admin.isActive) {
    throw new AppError("Admin account not found.", 401, "UNAUTHORIZED");
  }

  response.status(200).json({
    data: {
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    },
  });
});
