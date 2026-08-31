import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient({ log: ['query'] });

async function run() {
  const result = await prisma.tbImovel.findMany();
  console.log("Prisma tbImovel length:", result.length);
  
  const rawResult: any[] = await prisma.$queryRaw`SELECT * FROM TbImovel LIMIT 5`;
  console.log("Prisma raw tbImovel length:", rawResult.length);
}
run();
