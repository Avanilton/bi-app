import prisma from './src/lib/prisma';

async function run() {
  const boletos = await prisma.tbBoleto.findMany({
    where: {
      idEmpresa: 75,
      pago: false,
      cancelado: false
    },
    select: {
      idImovel: true,
      origem: true,
      total: true,
      dataVecto: true
    }
  });

  const totals: Record<string, number> = {};
  for (const b of boletos) {
    const key = `${b.idImovel}_${b.origem}`;
    totals[key] = (totals[key] || 0) + Number(b.total);
  }

  let found229 = false;
  let found226 = false;
  for (const key in totals) {
    if (Math.abs(totals[key] - 229201.90) < 1) {
      console.log(`Match for 229201.90 found: ${key} -> ${totals[key]}`);
      found229 = true;
    }
    if (Math.abs(totals[key] - 226754.55) < 1) {
      console.log(`Match for 226754.55 found: ${key} -> ${totals[key]}`);
      found226 = true;
    }
  }

  if (!found229) console.log("No match for 229201.90 with simple grouping.");
  if (!found226) console.log("No match for 226754.55 with simple grouping.");
}

run()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
