import { PrismaClient } from './prisma/generated/local-client';

const prismaLocal = new PrismaClient({ datasources: { db: { url: 'file:./local.db' } } } as any);

const getChartData = async (tipo: string, params: any) => {
  const baseWhere: any = { tipo };
  if (params.condominio) {
    const idImovel = parseInt(params.condominio, 10);
    if (!isNaN(idImovel)) baseWhere.idImovel = idImovel;
  }
  
  // To get the last 6 months up to yesterday
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(today.getMonth() - 5); // This month + 5 previous
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const rows = await prismaLocal.dashboardAggregates.findMany({
    where: {
      ...baseWhere,
      data: { gte: sixMonthsAgo, lte: today }
    },
    select: { data: true, total: true }
  });

  const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  
  // Aggregate by month/year
  const map = new Map<string, number>();
  
  // Initialize last 6 months in map to guarantee order
  for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${meses[d.getMonth()]}/${String(d.getFullYear()).slice(-2)}`;
      map.set(key, 0);
  }

  for (const row of rows) {
    if (!row.data) continue;
    const d = new Date(row.data);
    const key = `${meses[d.getMonth()]}/${String(d.getFullYear()).slice(-2)}`;
    if (map.has(key)) {
        map.set(key, (map.get(key) || 0) + row.total);
    }
  }

  const result = Array.from(map.entries()).map(([periodo, valor]) => ({
      data: periodo,
      periodo: periodo,
      valor,
      crescimento: 0
  }));

  // Calculate crescimento for Faturamento
  if (tipo === "FATURAMENTO") {
      for (let i = 1; i < result.length; i++) {
          const prev = result[i-1].valor;
          const curr = result[i].valor;
          if (prev > 0) {
              result[i].crescimento = Number((((curr - prev) / prev) * 100).toFixed(1));
          } else if (prev === 0 && curr > 0) {
              result[i].crescimento = 100;
          }
      }
  }

  return result;
};

async function test() {
    console.log("Recebimento:", await getChartData("RECEBIMENTO", {}));
    console.log("Faturamento:", await getChartData("FATURAMENTO", {}));
}
test();
