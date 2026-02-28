const { PrismaClient } = require("@prisma/client");
const fs = require("fs");

const prisma = new PrismaClient();
async function main() {
  try {
    const user = await prisma.user.findFirst();
    fs.writeFileSync("db-error.log", "Success: " + user?.email);
  } catch (e) {
    fs.writeFileSync("db-error.log", e.stack || e.message || String(e));
  } finally {
    await prisma.$disconnect();
  }
}
main();
