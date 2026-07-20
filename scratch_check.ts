import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import Database from "better-sqlite3";

const sqlite = new Database("./dev.db");
const adapter = new PrismaBetterSqlite3(sqlite as any);
const prisma = new PrismaClient({ adapter });

async function main() {
  const c = await prisma.tbAntecipacao.findMany({
    select: { idImovel: true, valor: true },
    take: 5
  });
  console.log("Amostra de idImovel em tbAntecipacao:", c);
  
  const contagem = await prisma.tbAntecipacao.count();
  console.log("Total antecipacoes:", contagem);
}

main().catch(console.error).finally(() => prisma.$disconnect());
