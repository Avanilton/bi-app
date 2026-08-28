import prisma from './src/lib/prisma';

async function main() {
  const condominio = 50; // just an example idImovel
  try {
    const res = await prisma.$queryRaw`
      EXPLAIN SELECT SUM(total) FROM TbBoleto 
      WHERE idEmpresa = 75 
        AND idImovel = ${condominio} 
        AND pago = false 
        AND cancelado = false 
        AND (origem IS NULL OR origem NOT IN (5,6));
    `;
    console.log("EXPLAIN Inadimplencia:", res);

    const res2 = await prisma.$queryRaw`
      EXPLAIN SELECT SUM(total) FROM TbBoleto 
      WHERE idEmpresa = 75 
        AND idImovel = ${condominio} 
        AND pago = true 
        AND cancelado = false 
        AND dataPgto >= '2026-08-01';
    `;
    console.log("EXPLAIN Recebimento:", res2);

    const res3 = await prisma.$queryRaw`
      EXPLAIN SELECT SUM(total) FROM TbBoleto 
      WHERE idImovel = ${condominio} 
        AND pago = true 
        AND cancelado = false 
        AND dataPgto >= '2026-08-01';
    `;
    console.log("EXPLAIN Recebimento sem idEmpresa:", res3);

  } catch (e: any) {
    console.error("Error EXPLAIN:", e.message);
  }
}

main().finally(() => prisma.$disconnect());
