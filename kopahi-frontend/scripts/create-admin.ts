#!/usr/bin/env tsx
/**
 * Interactive super-admin / admin creation script.
 *
 * Usage:
 *   npm run admin:create
 *
 * Prompts for email + name + password (16+ chars) + super-admin flag.
 * Marks the resulting User row as `emailVerified: true` and
 * `onboardingComplete: true`. This is the ONLY way to create an admin —
 * the public signup endpoints do not accept role=admin.
 */

import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import bcrypt from "bcryptjs";

// We import Prisma from the FRONTEND's generated client.
// `node --import tsx` resolves `@prisma/client` to `node_modules/.prisma/client`.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function readSecret(rl: readline.Interface, prompt: string): Promise<string> {
  // Note: this echoes the password while typing. Node's readline doesn't
  // have a built-in silent mode; if needed wire in `password-prompt` later.
  return rl.question(prompt);
}

async function main() {
  const rl = readline.createInterface({ input, output });

  try {
    const email = (await rl.question("Admin email: ")).trim().toLowerCase();
    if (!email || !email.includes("@")) {
      console.error("Invalid email.");
      process.exit(1);
    }
    const name = (await rl.question("Admin name: ")).trim();
    if (name.length < 2) {
      console.error("Name must be at least 2 characters.");
      process.exit(1);
    }
    const password = await readSecret(rl, "Password (16+ chars): ");
    if (password.length < 16) {
      console.error("Password must be at least 16 characters.");
      process.exit(1);
    }
    const superAdminAnswer = (
      await rl.question("Super-admin? (y/N): ")
    ).trim().toLowerCase();
    const isSuper = superAdminAnswer === "y" || superAdminAnswer === "yes";

    const passwordHash = await bcrypt.hash(password, 12);

    const existing = await prisma.user.findUnique({ where: { email } });
    const now = new Date();

    if (existing) {
      await prisma.user.update({
        where: { id: existing.id },
        data: {
          name,
          role: "admin",
          isSuperAdmin: isSuper,
          passwordHash,
          emailVerified: true,
          emailVerifiedAt: existing.emailVerifiedAt ?? now,
          onboardingComplete: true,
          failedLoginAttempts: 0,
          lockedUntil: null,
        },
      });
      console.log(`Promoted ${email} to ${isSuper ? "super-" : ""}admin.`);
    } else {
      await prisma.user.create({
        data: {
          email,
          name,
          passwordHash,
          role: "admin",
          isSuperAdmin: isSuper,
          emailVerified: true,
          emailVerifiedAt: now,
          onboardingComplete: true,
        },
      });
      console.log(`Created ${isSuper ? "super-" : ""}admin: ${email}`);
    }
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error("create-admin failed:", err);
  process.exit(1);
});
