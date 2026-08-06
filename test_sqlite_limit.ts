import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    const chunk = Array.from({ length: 1000 }, (_, i) => ({ idEmpresa: 1, idImovel: i }));
    await prisma.tbImovel.findMany({
      where: { OR: chunk.map(c => ({ idEmpresa: c.idEmpresa, idImovel: c.idImovel })) },
      select: { idEmpresa: true, idImovel: true }
    });
    console.log("Sucesso!");
  } catch (err) {
    console.error("Erro capturado:");
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
