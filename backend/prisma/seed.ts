import "dotenv/config";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../src/config/database.js";

const seedEnvironment = z.object({
  ADMIN_EMAIL: z.email(),
  ADMIN_PASSWORD: z.string().min(12),
  ADMIN_NAME: z.string().trim().min(2).max(120).default("PrepLoom Admin"),
});

async function seedAdmin() {
  const environment = seedEnvironment.parse(process.env);
  const email = environment.ADMIN_EMAIL.trim().toLowerCase();
  const passwordHash = await bcrypt.hash(environment.ADMIN_PASSWORD, 12);

  await prisma.admin.upsert({
    where: { email },
    update: {
      name: environment.ADMIN_NAME,
      passwordHash,
      isActive: true,
    },
    create: {
      email,
      name: environment.ADMIN_NAME,
      passwordHash,
    },
  });

  console.info(`Admin account ready for ${email}.`);
}

seedAdmin()
  .catch((error: unknown) => {
    console.error("Could not seed the admin account.", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
