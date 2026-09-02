import prisma from './src/lib/prisma';
import { INACTIVE_CONDOMINIOS } from './src/lib/constants';

async function run() {
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const whereJuridicosNaoPagos = {
    idEmpresa: 75,
    pago: false,
    cancelado: false,
    idImovel: { notIn: INACTIVE_CONDOMINIOS },
    origem: 5,
    dataVecto: { lte: today }
  };

  const grouped = await prisma.tbBoleto.groupBy({
    by: ['idImovel'],
    _sum: { total: true },
    where: whereJuridicosNaoPagos
  });

  console.log(`Found ${grouped.length} condominios with Juridicos.`);
  for (const g of grouped) {
    const total = g._sum.total || 0;
    if (total > 200000 && total < 300000) {
      console.log(`Condominio ${g.idImovel}: ${total.toFixed(2)}`);
    }
  }
}

run()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
