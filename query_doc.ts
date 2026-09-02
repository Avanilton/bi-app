import prisma from './src/lib/prisma';

async function run() {
  const docNum = '477037';
  // Try to find it in tbBoleto by idBoleto or documento or nrParcela or something
  // Wait, let's try finding by idBoleto
  let b = await prisma.tbBoleto.findFirst({
    where: { idCliente: 20752 },
    include: {
      imovel: true,
      cliente: true
    }
  });
  console.log(b?.imovel);
  
  // Try by 'documento' (if the field exists) -> wait, there's no documento, let's search if not found
  if (!b) {
    const arr = await (prisma.tbBoleto as any).findMany({
      where: { 
         // anything string that could be "477037"
      },
      take: 1
    });
    console.log(arr);
  }
}

run()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
