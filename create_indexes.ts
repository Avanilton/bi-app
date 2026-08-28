import prisma from './src/lib/prisma';

async function main() {
  try {
    console.log("Criando indice 1/2...");
    await prisma.$queryRaw`CREATE INDEX idx_dash_imovel ON TbBoleto(idImovel, pago, cancelado, idEmpresa);`;
    console.log("Criando indice 2/2...");
    await prisma.$queryRaw`CREATE INDEX idx_dash_recebimento ON TbBoleto(idImovel, pago, cancelado, dataPgto);`;
    console.log("Indices criados com sucesso!");
  } catch (e: any) {
    console.error("Erro ao criar indices:", e.message);
  }
}

main().finally(() => prisma.$disconnect());
