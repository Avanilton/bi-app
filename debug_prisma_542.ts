import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

async function debugPrisma542() {
  console.log("Buscando todos os boletos do 542 no Prisma (deve demorar uns 15s)...");
  
  const boletos = await prisma.tbBoleto.findMany({
    where: {
      idImovel: 542,
      // Nao vamos filtrar nada para ver EXATAMENTE o que tem no banco
    }
  });

  console.log(`Encontrados ${boletos.length} boletos totais para o imovel 542.`);
  
  // Filtrar os 3 problematicos
  const problemIDs = [7348766, 7348769, 7348761];
  const foundProblems = boletos.filter(b => problemIDs.includes(b.idBoleto));
  
  console.log("\nStatus dos 3 boletos que venceram ontem (segundo a sua imagem):");
  console.table(foundProblems.map(b => ({
    idBoleto: b.idBoleto,
    dataVecto: b.dataVecto,
    pago: b.pago,
    cancelado: b.cancelado,
    origem: b.origem,
    total: b.total,
    idRateio: b.idRateio
  })));
  
  // Calcular inadimplencia atual pelo Prisma (manual)
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  
  let inad = 0;
  for (const b of boletos) {
    if (b.pago === false && b.cancelado === false && b.dataVecto && b.dataVecto <= today) {
      if (b.origem !== 5 && b.origem !== 6) {
        inad += b.total || 0;
      }
    }
  }
  
  console.log(`\nSoma de inadimplencia calculada: R$ ${inad.toFixed(2)}`);

  fs.writeFileSync("boletos_542_dump.json", JSON.stringify(boletos, null, 2));
  console.log("\nTodos os boletos salvos em boletos_542_dump.json");
}

debugPrisma542().catch(console.error).finally(() => prisma.$disconnect());
