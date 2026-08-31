import prisma from './src/lib/prisma';

async function debugPrisma772() {

  
  const boletos = await prisma.tbBoleto.findMany({
    where: {
      idImovel: 772,
      pago: false,
      cancelado: false
    }
  });
  
  let totalApp = 0;
  let totalAll = 0;
  let discardedByEmpresa = [];

  for (const b of boletos) {
    totalAll += Number(b.total) || 0;
    
    // Regra do App (idEmpresa = 75 e origem != 5 e origem != 6)
    if (b.idEmpresa === 75 && b.origem !== 5 && b.origem !== 6) {
      totalApp += Number(b.total) || 0;
    } else {
        if (b.origem !== 5 && b.origem !== 6) {
             discardedByEmpresa.push(b);
        }
    }
  }

  console.log(`Total App (Empresa=75, sem origem 5,6): R$ ${totalApp.toFixed(2)}`);
  console.log(`Total ALL (Todos idEmpresa, mas sem origem 5,6): R$ ${discardedByEmpresa.reduce((s, b) => s + (Number(b.total) || 0), totalApp).toFixed(2)}`);
  
  // Find which boletos sum up to the difference (781.38)
  const diffTarget = 781.38;
  const tolerance = 0.05;
  
  for (const b of boletos) {
    if (Math.abs(Number(b.total) - diffTarget) < tolerance) {
      console.log(`Boleto com valor exato da diferenca achado! ID: ${b.idBoleto}, Origem: ${b.origem}, Empresa: ${b.idEmpresa}, Valor: ${b.total}, Venc: ${b.dataVecto}`);
    }
  }
  
  if (discardedByEmpresa.length > 0) {
      console.log("Boletos descartados por idEmpresa != 75:");
      console.table(discardedByEmpresa.map(b => ({ idBoleto: b.idBoleto, total: b.total, idEmpresa: b.idEmpresa })));
  }
  
  await prisma.$disconnect();
}

debugPrisma772().catch(console.error);
