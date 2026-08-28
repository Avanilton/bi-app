import prisma from './src/lib/prisma';

async function main() {
  try {
    const res = await prisma.$queryRaw`SHOW INDEXES FROM TbBoleto`;
    console.log("Indexes from TbBoleto:", res);
  } catch (e: any) {
    console.error("Error:", e.message);
  }
}

main().finally(() => prisma.$disconnect());
