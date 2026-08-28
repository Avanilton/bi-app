import prisma from './src/lib/prisma';

async function main() {
  try {
    const res = await prisma.$queryRaw`
      EXPLAIN SELECT SUM(total) FROM TbBoleto 
      WHERE idEmpresa = 75 
        AND pago = false 
        AND cancelado = false 
        AND (origem IS NULL OR origem NOT IN (5,6));
    `;
    console.log("EXPLAIN Inadimplencia sem condominio:", res);
  } catch (e: any) {
    console.error("Error:", e.message);
  }
}

main().finally(() => prisma.$disconnect());
