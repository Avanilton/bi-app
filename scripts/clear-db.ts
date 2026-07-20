import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function clearDb() {
  console.log("Limpiando banco de dados (exceto usuários)...");
  
  // Excluir na ordem correta para não ferir foreign keys (ou usar cascade no schema se houver)
  await prisma.tbDescontoAntecipacao.deleteMany();
  await prisma.tbAntecipacao.deleteMany();
  await prisma.tbBoleto.deleteMany();
  await prisma.tbCliente.deleteMany();
  await prisma.tbImovel.deleteMany();

  console.log("Dados excluídos com sucesso!");
}

clearDb()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
