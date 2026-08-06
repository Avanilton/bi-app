import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function fixLocal() {
  const validBoletos = [7181454, 7181493, 7000911, 7181494];
  
  // Update all other unpaid boletos for condo 538 to paid
  const updated = await prisma.tbBoleto.updateMany({
    where: {
      idImovel: 538,
      pago: false,
      cancelado: false,
      idBoleto: { notIn: validBoletos }
    },
    data: {
      pago: true
    }
  });

  console.log(`Atualizados ${updated.count} boletos localmente para 'pago = true'.`);
}

fixLocal().catch(console.error).finally(() => prisma.$disconnect());
