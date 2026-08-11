import prisma from "./src/lib/prisma";

async function check() {
  const descontos = await prisma.tbDescontoAntecipacao.findMany({
    where: { idTituloPagar: 71815 }
  });
  console.log("Descontos para 71815:", descontos);
  
  const sumDescontos = descontos.reduce((acc, curr) => acc + (curr.valor || 0), 0);
  console.log("Total descontos:", sumDescontos);
}

check().catch(console.error).finally(() => prisma.$disconnect());
