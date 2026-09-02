import prisma from './src/lib/prisma';

async function run() {
  const sum = await prisma.tbBoleto.aggregate({
    _sum: { total: true },
    where: {
      idEmpresa: 75,
      idImovel: 98,
      pago: false,
      cancelado: false
    }
  });
  console.log('Total for FLORENCE (98) regardless of origem:', sum._sum.total);

  // Group by origem
  const grouped = await prisma.tbBoleto.groupBy({
    by: ['origem'],
    _sum: { total: true },
    where: {
      idEmpresa: 75,
      idImovel: 98,
      pago: false,
      cancelado: false
    }
  });
  console.log('Grouped by origem for FLORENCE:', grouped);
}

run()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
