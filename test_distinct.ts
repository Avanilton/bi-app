import prisma from './src/lib/prisma';

async function main() {
  console.log("Starting distinct query...");
  const start = Date.now();
  
  const origensRecentes = await prisma.tbBoleto.findMany({
    where: { idEmpresa: 75, origem: { in: [5, 6, 99] } },
    distinct: ['idCliente', 'origem'],
    orderBy: { idBoleto: 'desc' },
    select: { idCliente: true, origem: true, idBoleto: true }
  });

  console.log(`Query finished in ${Date.now() - start}ms, found ${origensRecentes.length} records`);
}

main().finally(() => prisma.$disconnect());
