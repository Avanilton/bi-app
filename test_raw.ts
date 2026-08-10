import prisma from './src/lib/prisma';

async function main() {
  console.log("Starting raw query...");
  const start = Date.now();
  
  const rompidosRaw = await prisma.$queryRaw`
    SELECT idCliente
    FROM (
      SELECT idCliente, origem, MAX(idBoleto) as max_id
      FROM tbBoleto
      WHERE idEmpresa = 75 AND origem IN (5, 6, 99)
      GROUP BY idCliente
    ) t
    WHERE origem IN (6, 99)
  `;

  console.log(`Query finished in ${Date.now() - start}ms, found ${(rompidosRaw as any[]).length} records`);
}

main().finally(() => prisma.$disconnect());
