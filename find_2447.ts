import prisma from './src/lib/prisma';

async function run() {
  const endOfMonth = new Date(Date.UTC(2026, 8, 30, 23, 59, 59, 999)); // Sept 30, 2026
  
  const boletos = await prisma.tbBoleto.findMany({
    where: {
      idEmpresa: 75,
      idImovel: 98,
      pago: false,
      cancelado: false,
      OR: [{ origem: null }, { origem: 0 }],
      dataVecto: { lte: endOfMonth }
    },
    select: { idBoleto: true, total: true, dataVecto: true, idCliente: true }
  });

  // Try to find a single boleto or combination of 2 that sum to 2447.35
  const diff = 2447.35;
  for (const b of boletos) {
    if (Math.abs(Number(b.total) - diff) < 0.1) {
      console.log('Found single boleto:', b);
    }
  }

  for (let i = 0; i < boletos.length; i++) {
    for (let j = i + 1; j < boletos.length; j++) {
      if (Math.abs(Number(boletos[i].total) + Number(boletos[j].total) - diff) < 0.1) {
        console.log('Found pair:', boletos[i], boletos[j]);
      }
    }
  }
}

run()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
