import prisma from './src/lib/prisma';

async function run() {
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const sum = await prisma.tbBoleto.aggregate({
    _sum: { total: true },
    where: {
      idEmpresa: 75,
      idImovel: 98,
      origem: 5,
      pago: false,
      cancelado: false,
      dataVecto: { lte: today }
    }
  });
  console.log('Total juridico in DB for FLORENCE (98):', sum._sum.total);
}

run()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
