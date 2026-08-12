import prisma from './src/lib/prisma';
import { getDDDsForEstado } from './src/lib/ddd';

async function main() {
  const ddds = getDDDsForEstado('SP');
  const imoveis = await prisma.tbCliente.findMany({
    where: { dddce: { in: ddds } },
    select: { idImovel: true },
    distinct: ['idImovel']
  });
  const idImoveis = imoveis.map(i => i.idImovel);

  console.time("Query 4 (Descontos by idImovel)");
  let descontos2: any[] = [];
  if (idImoveis.length > 0) {
    descontos2 = await prisma.tbDescontoAntecipacao.findMany({
      where: {
        idImovel: { in: idImoveis }
      },
      select: {
        idTituloPagar: true,
        valor: true,
      }
    });
  }
  console.timeEnd("Query 4 (Descontos by idImovel)");
  console.log("Count 4:", descontos2.length);
}

main().finally(() => prisma.$disconnect());
