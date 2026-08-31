import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "mysql://Intelligence:@bv2026@@sistemasnovacorp.com.br:5643/novacorpconect"
    }
  }
});

async function run() {
  try {
    console.log("Searching for 359.62 in 1241...");
    const rows = await prisma.$queryRaw`
      SELECT idBoleto, total, dataVecto, origem, pago, cancelado, dtEmissaoExtra
      FROM TbBoleto 
      WHERE idImovel = 1241 AND total >= 359.60 AND total <= 359.65
    `;
    console.log(rows);
  } catch(e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}
run();
