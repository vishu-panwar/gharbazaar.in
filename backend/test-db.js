const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function main() {
  console.log("Testing database connection...");
  try {
    const user = await prisma.user.findFirst();
    console.log(
      "DB connection successful. First user:",
      user ? user.email : "No users found",
    );
  } catch (e) {
    console.error("DB connection error:", e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
