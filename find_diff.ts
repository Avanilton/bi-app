import prisma from './src/lib/prisma';

async function run() {
  const whereJuridicosNaoPagos = {
    idEmpresa: 75,
    pago: false,
    cancelado: false,
    origem: 5,
  };

  const boletos = await prisma.tbBoleto.findMany({
    where: whereJuridicosNaoPagos,
    select: {
      idBoleto: true,
      total: true,
      dataVecto: true,
      idImovel: true
    }
  });

  const boletosFlorence = boletos.filter(b => b.idImovel === 98);
  console.log('FLORENCE origem 5 total:', boletosFlorence.reduce((a, b) => a + Number(b.total || 0), 0));

  // What about if we sum all boletos for FLORENCE regardless of origem?
  const allFlorence = await prisma.tbBoleto.findMany({
    where: {
      idEmpresa: 75,
      idImovel: 98,
      pago: false,
      cancelado: false,
    },
    select: { total: true, origem: true }
  });
  console.log('FLORENCE ALL total:', allFlorence.reduce((a, b) => a + Number(b.total || 0), 0));
}

run()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
