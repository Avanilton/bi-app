import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function debug542() {
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const boletos = await prisma.tbBoleto.findMany({
    where: {
      idImovel: 542,
      pago: false,
      cancelado: false
    },
    select: {
      idBoleto: true,
      dataVecto: true,
      valorParc: true,
      total: true,
      origem: true,
      idRateio: true,
      pago: true,
      cancelado: true
    }
  });

  let inadimplenciaSum = 0;
  let included = [];
  let excluded = [];

  for (const b of boletos) {
    if (b.dataVecto && b.dataVecto <= today) {
      if (b.origem !== 5 && b.origem !== 6) {
        inadimplenciaSum += b.total || 0;
        included.push(b);
      } else {
        excluded.push({ ...b, reason: "origem 5 ou 6" });
      }
    } else {
      excluded.push({ ...b, reason: "dataVecto futuro (nao vencido)" });
    }
  }

  console.log(`\nSoma calculada (igual ao BI): R$ ${inadimplenciaSum.toFixed(2)}`);
  
  console.log("\nBOLETOS INCLUIDOS:");
  console.table(included);
  
  console.log("\nBOLETOS EXCLUIDOS:");
  console.table(excluded);
}

debug542().catch(console.error).finally(() => prisma.$disconnect());
