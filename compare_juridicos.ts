import prisma from './src/lib/prisma';
import { INACTIVE_CONDOMINIOS } from './src/lib/constants';
import * as fs from 'fs';

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

  const boletos = await prisma.tbBoleto.findMany({
    where: whereJuridicosNaoPagos,
    select: {
      idBoleto: true,
      total: true,
      idImovel: true,
      dataVecto: true,
    }
  });

  let sum = 0;
  for (const b of boletos) {
    sum += Number(b.total) || 0;
  }
  console.log(`Total sum in DB for Juridicos: ${sum.toFixed(2)}`);
  console.log(`Number of boletos: ${boletos.length}`);

  fs.writeFileSync('db_juridicos.json', JSON.stringify(boletos, null, 2));
  console.log('Saved to db_juridicos.json');
}

run()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
