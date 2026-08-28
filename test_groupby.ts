import prisma from './src/lib/prisma';

async function main() {
  console.log("Starting GROUP BY query...");
  const start = Date.now();
  try {
    const res = await prisma.$queryRaw`
      SELECT idImovel, SUM(total) as total
      FROM TbBoleto 
      WHERE idEmpresa = 75 
        AND pago = false 
        AND cancelado = false 
        AND (origem IS NULL OR origem NOT IN (5,6))
      GROUP BY idImovel
    `;
    const end = Date.now();
    console.log(`Query finished in ${(end - start) / 1000}s`);
    // @ts-ignore
    console.log(`Returned ${res.length} rows`);
  } catch (e: any) {
    console.error("Error:", e.message);
  }
}

main().finally(() => prisma.$disconnect());
