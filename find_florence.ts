import prisma from './src/lib/prisma';

async function run() {
  const imoveis = await prisma.tbImovel.findMany({
    where: {
      nomeFantasia: {
        contains: 'FLORENCE'
      }
    }
  });
  console.log(imoveis);
}

run()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
