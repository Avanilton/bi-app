import prisma from './src/lib/prisma';

async function main() {
  try {
    const res = await prisma.$queryRaw`SELECT VERSION()`;
    console.log("MySQL Version:", res);
  } catch (e: any) {
    console.error("Error:", e.message);
  }
}

main().finally(() => prisma.$disconnect());
