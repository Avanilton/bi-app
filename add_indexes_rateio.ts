import prisma from './src/lib/prisma';

async function main() {
  console.log("Criando índices para otimizar os filtros de rateio...");
  
  const queries = [
    `CREATE INDEX idx_tbcliente_dddce ON tbcliente(dddce)`,
    `CREATE INDEX idx_tbcliente_idImovel_dddce ON tbcliente(idImovel, dddce)`,
    `CREATE INDEX idx_tbantecipacao_mesRef ON tbantecipacao(mesRef)`,
    `CREATE INDEX idx_tbantecipacao_idImovel_mesRef ON tbantecipacao(idImovel, mesRef)`,
    `CREATE INDEX idx_tbdescontoantecipacao_idTituloPagar ON tbdescontoantecipacao(idTituloPagar)`
  ];

  for (const q of queries) {
    try {
      await prisma.$executeRawUnsafe(q);
      console.log("Sucesso:", q);
    } catch (e: any) {
      if (e.message.includes("Duplicate key name")) {
        console.log("Índice já existe:", q);
      } else {
        console.log("Erro:", q, e.message);
      }
    }
  }
}

main().finally(() => prisma.$disconnect());
