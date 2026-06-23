import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./src/generated/prisma/client.js";
import { verifyPassword } from "better-auth/crypto";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const user = await prisma.user.findUnique({ where: { email: "admin@m4vx.com" } });
  if (!user) {
    console.log("User not found");
    return;
  }
  console.log("User found:", user.email);
  console.log("Password hash:", user.passwordHash);
  const valid = await verifyPassword({ hash: user.passwordHash!, password: "Admin@123" });
  console.log("Password valid:", valid);
  const valid2 = await verifyPassword({ hash: user.passwordHash!, password: "wrong" });
  console.log("Wrong password:", valid2);
  console.log("Password valid:", valid);
  await prisma.$disconnect();
}

main().catch(console.error);
