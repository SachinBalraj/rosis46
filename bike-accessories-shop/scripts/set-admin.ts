import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  if (!email) {
    console.error("Usage: npm run db:admin <email>");
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error(`No user found with email ${email}`);
    process.exit(1);
  }

  await prisma.user.update({ where: { email }, data: { role: "ADMIN" } });
  console.log(`Promoted ${user.email} to ADMIN`);
}

main()
  .catch((error) => {
    console.error("Failed to promote user:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
