import prisma from './src/lib/prisma';

async function main() {
  console.log("Starting group by query...");
  const start = Date.now();
  const origensRecentes = await prisma.tbBoleto.groupBy({
    by: ['idCliente', 'origem'],
    _max: { idBoleto: true },
    where: { idEmpresa: 75, origem: { in: [5, 6, 99] } }
  });
  console.log(`Query finished in ${Date.now() - start}ms, found ${origensRecentes.length} records`);
}

main().finally(() => prisma.$disconnect());
