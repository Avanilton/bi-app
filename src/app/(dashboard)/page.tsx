import { Metadata } from "next";
import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import { getDDDsForEstado, getDDDsForRegiao } from "@/lib/ddd";
import { INACTIVE_CONDOMINIOS } from "@/lib/constants";
import {
  StatCard,
  RecebimentoChart,
  FaturamentoChart,
  GanhosTotaisChart,
  ReceitasVariaveisChart
} from "@/components/DashboardComponents";
import { AlertCircle, FileText, CalendarClock, DollarSign } from "lucide-react";

export const metadata: Metadata = {
  title: "Financeiro - BV Garantia BI",
};

function computeTrend(currentTotal: number, prevTotal: number) {
  if (prevTotal > 0) {
    const diff = currentTotal - prevTotal;
    const pct = (diff / prevTotal) * 100;
    return {
      trend: pct >= 0 ? ("up" as const) : ("down" as const),
      trendValue: `${Math.abs(pct).toFixed(1)}%`
    };
  } else if (currentTotal > 0) {
    return {
      trend: "up" as const,
      trendValue: "100.0%"
    };
  }
  return {
    trend: "up" as const,
    trendValue: "0.0%"
  };
}

const getFinanceiroData = async (
  condominio?: string,
  regiao?: string,
  estado?: string,
  dataInicio?: string,
  dataFim?: string,
  periodo?: string
) => {
  const cacheKey = [
    'financeiro-v5',
    condominio || 'all',
    regiao || 'all',
    estado || 'all',
    dataInicio || 'all',
    dataFim || 'all',
    periodo || 'all'
  ];

  const fetchData = async () => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const whereBoleto: any = {
      idEmpresa: 75,
      pago: false,
      cancelado: false,
      idImovel: { notIn: INACTIVE_CONDOMINIOS }
    };

    if (condominio) {
      whereBoleto.idImovel = parseInt(condominio, 10);
    }

    if (regiao || estado) {
      let ddds: number[] = [];
      if (estado) ddds = getDDDsForEstado(estado);
      else if (regiao) ddds = getDDDsForRegiao(regiao);

      if (ddds.length > 0) {
        whereBoleto.cliente = {
          dddce: { in: ddds }
        };
      }
    }

    if (dataInicio || dataFim) {
      whereBoleto.dataVecto = {};
      if (dataInicio) {
        const dateInicioObj = new Date(dataInicio);
        if (!isNaN(dateInicioObj.getTime())) {
          whereBoleto.dataVecto.gte = dateInicioObj;
        }
      }

      if (dataFim) {
        const dateFimObj = new Date(dataFim);
        if (!isNaN(dateFimObj.getTime())) {
          dateFimObj.setHours(23, 59, 59, 999);
          whereBoleto.dataVecto.lte = dateFimObj;
        }
      }
    } else if (periodo) {
      const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
      const monthIndex = meses.indexOf(periodo);
      if (monthIndex >= 0) {
        const year = new Date().getFullYear();
        const firstDay = new Date(Date.UTC(year, monthIndex, 1));
        const nextMonth = new Date(Date.UTC(year, monthIndex + 1, 1));
        whereBoleto.dataVecto = {
          gte: firstDay,
          lte: nextMonth < today ? nextMonth : today
        };
      }
    } else {
      whereBoleto.dataVecto = {
        lte: today
      };
    }

    // Get the last day of the current month
    const year = today.getFullYear();
    const month = today.getMonth();
    const endOfCurrentMonth = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));
    
    const yesterday = new Date(Date.UTC(year, month, today.getDate() - 1, 23, 59, 59, 999));
    const whereInadimplenciaNormal = {
      ...whereBoleto,
      dataVecto: { lte: yesterday }
    };

    const whereInadimplenciaCancelado = {
      ...whereBoleto,
      cancelado: true,
      dataVecto: { lte: yesterday }
    };

    const whereAmigavelNaoPagos = {
      ...whereBoleto,
      origem: 6
    };

    const whereJuridicosNaoPagos = {
      ...whereBoleto,
      origem: 5
    };

    let prevDateFilter: any = {};
    if (periodo) {
      const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
      const monthIndex = meses.indexOf(periodo);
      if (monthIndex >= 0) {
        const year = new Date().getFullYear();
        const prevMonthIndex = monthIndex === 0 ? 11 : monthIndex - 1;
        const prevYear = monthIndex === 0 ? year - 1 : year;
        const startPrev = new Date(Date.UTC(prevYear, prevMonthIndex, 1, 0, 0, 0, 0));
        const endPrev = new Date(Date.UTC(prevYear, prevMonthIndex + 1, 0, 23, 59, 59, 999));
        prevDateFilter = { gte: startPrev, lte: endPrev };
      }
    } else {
      const year = today.getFullYear();
      const month = today.getMonth();
      const endPrevMonth = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
      prevDateFilter = { lte: endPrevMonth };
    }

    const wherePrevBoleto: any = {
      idEmpresa: 75,
      pago: false,
      cancelado: false,
      dataVecto: prevDateFilter,
      idImovel: { notIn: INACTIVE_CONDOMINIOS }
    };
    if (condominio) wherePrevBoleto.idImovel = whereBoleto.idImovel;
    if (whereBoleto.cliente) wherePrevBoleto.cliente = whereBoleto.cliente;

    const wherePrevInadimplenciaNormal = {
      ...wherePrevBoleto,
      dataVecto: prevDateFilter
    };

    const wherePrevInadimplenciaCancelado = {
      ...wherePrevBoleto,
      cancelado: true,
      dataVecto: prevDateFilter
    };

    const wherePrevJuridicosNaoPagos = {
      ...wherePrevBoleto,
      origem: 5
    };

    const wherePrevAmigavelNaoPagos = {
      ...wherePrevBoleto,
      origem: 6
    };

    const whereRecebimentoCard: any = {
      pago: true,
      cancelado: false,
      idImovel: { notIn: INACTIVE_CONDOMINIOS }
    };
    if (condominio) whereRecebimentoCard.idImovel = whereBoleto.idImovel;
    if (whereBoleto.cliente) whereRecebimentoCard.cliente = whereBoleto.cliente;

    const whereRecebimentoChart: any = {
      pago: true,
      cancelado: false,
      idImovel: { notIn: INACTIVE_CONDOMINIOS }
    };
    if (condominio) whereRecebimentoChart.idImovel = whereBoleto.idImovel;
    if (whereBoleto.cliente) whereRecebimentoChart.cliente = whereBoleto.cliente;

    if (dataInicio || dataFim) {
      whereRecebimentoCard.dataPgto = {};
      whereRecebimentoChart.dataPgto = {};
      if (dataInicio) {
        const dateInicioObj = new Date(dataInicio);
        if (!isNaN(dateInicioObj.getTime())) {
          whereRecebimentoCard.dataPgto.gte = dateInicioObj;
          whereRecebimentoChart.dataPgto.gte = dateInicioObj;
        }
      }
      if (dataFim) {
        const dateFimObj = new Date(dataFim);
        if (!isNaN(dateFimObj.getTime())) {
          dateFimObj.setHours(23, 59, 59, 999);
          whereRecebimentoCard.dataPgto.lte = dateFimObj;
          whereRecebimentoChart.dataPgto.lte = dateFimObj;
        }
      }
    } else if (periodo) {
      const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
      const monthIndex = meses.indexOf(periodo);
      if (monthIndex >= 0) {
        const year = new Date().getFullYear();
        const firstDay = new Date(Date.UTC(year, monthIndex, 1));
        const nextMonth = new Date(Date.UTC(year, monthIndex + 1, 1));
        whereRecebimentoCard.dataPgto = { gte: firstDay, lt: nextMonth };
        whereRecebimentoChart.dataPgto = { gte: firstDay, lt: nextMonth };
      }
    } else {
      const year = today.getFullYear();
      const month = today.getMonth();
      const firstDay = new Date(Date.UTC(year, month, 1));
      whereRecebimentoCard.dataPgto = { gte: firstDay, lte: today };

      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(today.getMonth() - 5);
      sixMonthsAgo.setDate(1);
      sixMonthsAgo.setHours(0, 0, 0, 0);
      whereRecebimentoChart.dataPgto = { gte: sixMonthsAgo, lte: today };
    }

    const wherePrevRecebimento: any = {
      pago: true,
      cancelado: false,
      idImovel: { notIn: INACTIVE_CONDOMINIOS }
    };
    if (condominio) wherePrevRecebimento.idImovel = whereBoleto.idImovel;
    if (whereBoleto.cliente) wherePrevRecebimento.cliente = whereBoleto.cliente;

    if (dataInicio || dataFim) {
      wherePrevRecebimento.dataPgto = prevDateFilter;
    } else if (periodo) {
      wherePrevRecebimento.dataPgto = prevDateFilter;
    } else {
      const year = today.getFullYear();
      const month = today.getMonth();
      const startPrev = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
      const endPrev = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
      wherePrevRecebimento.dataPgto = { gte: startPrev, lte: endPrev };
    }

    // Cache logic execution
    let useCache = false;
    let cacheData: any = null;
    let idImoveis: number[] | null = null;

    if (condominio) idImoveis = [parseInt(condominio, 10)];
    
    if (regiao || estado) {
      let ddds: number[] = [];
      if (estado) ddds = getDDDsForEstado(estado);
      else if (regiao) ddds = getDDDsForRegiao(regiao);

      if (ddds.length > 0) {
        const clientesMatches = await prisma.tbCliente.findMany({
          where: { dddce: { in: ddds } },
          select: { idImovel: true },
          distinct: ['idImovel']
        });
        const idsByDdd = clientesMatches.map(c => c.idImovel).filter(id => id !== null) as number[];
        if (idImoveis) {
          idImoveis = idImoveis.filter(id => idsByDdd.includes(id));
        } else {
          idImoveis = idsByDdd;
        }
      }
    }

    if (!dataInicio && !dataFim) {
      try {
        const fs = require('fs');
        const path = require('path');
        const cachePath = path.join(process.cwd(), "planilhas", "cache-boletos.json");
        if (fs.existsSync(cachePath)) {
          cacheData = JSON.parse(fs.readFileSync(cachePath, 'utf8')).data;
          useCache = true;
        }
      } catch(e) {}
    }

    if (useCache && cacheData) {
      if (!idImoveis) {
        idImoveis = Object.keys(cacheData).map(k => parseInt(k, 10));
      }
      let inad = 0;
      let juri = 0;
      let amig = 0;
      let receb = 0;
      let prevReceb = 0;
      const recebGroupedMap: Record<string, number> = {};

      let targetMonth = today.getMonth() + 1;
      let targetYear = today.getFullYear();
      let prevMonth = targetMonth === 1 ? 12 : targetMonth - 1;
      let prevYear = targetMonth === 1 ? targetYear - 1 : targetYear;

      if (periodo) {
        const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        const monthIndex = meses.indexOf(periodo);
        if (monthIndex >= 0) {
          targetMonth = monthIndex + 1;
          targetYear = today.getFullYear();
          prevMonth = targetMonth === 1 ? 12 : targetMonth - 1;
          prevYear = targetMonth === 1 ? targetYear - 1 : targetYear;
        }
      }

      const targetKey = `${targetYear}-${String(targetMonth).padStart(2, '0')}`;
      const prevKey = `${prevYear}-${String(prevMonth).padStart(2, '0')}`;

      // Keys for the last 6 months for the chart
      const chartKeys: string[] = [];
      for (let i = 5; i >= 0; i--) {
        let m = targetMonth - i;
        let y = targetYear;
        if (m <= 0) {
          m += 12;
          y -= 1;
        }
        chartKeys.push(`${y}-${String(m).padStart(2, '0')}`);
      }

      for (const id of idImoveis) {
        const imovelData = cacheData[id];
        if (imovelData) {
          inad += (imovelData.inadimplencia || 0);
          juri += (imovelData.juridico || 0);
          amig += (imovelData.amigavel || 0);
          
          if (imovelData.recebimentosPorMes) {
             receb += (imovelData.recebimentosPorMes[targetKey] || 0);
             prevReceb += (imovelData.recebimentosPorMes[prevKey] || 0);
             
             chartKeys.forEach(k => {
               recebGroupedMap[k] = (recebGroupedMap[k] || 0) + (imovelData.recebimentosPorMes[k] || 0);
             });
          }
        }
      }

      return {
        inadimplenciaTotal: inad,
        recebimentoTotal: receb,
        juridicosTotal: juri,
        amigavelTotal: amig,
        prevInadTotal: inad, // No trend for inadimplencia when cached
        prevRecebimentoTotal: prevReceb,
        prevJuridicosTotal: juri, // No trend
        prevAmigavelTotal: amig, // No trend
        recebimentoGrouped: Object.entries(recebGroupedMap).map(([k, v]) => {
          const [y, m] = k.split('-');
          return {
            dataPgto: new Date(Date.UTC(parseInt(y), parseInt(m) - 1, 15)).toISOString(),
            total: v
          };
        })
      };
    }

    // Executa 1 por 1 sequencialmente para não disputar conexão ou travar o pool do MySQL remoto
    const inadimplenciaNormalResult = await prisma.tbBoleto.aggregate({ _sum: { valorParc: true }, where: whereInadimplenciaNormal });
    const inadimplenciaCanceladoResult = await prisma.tbBoleto.aggregate({ _sum: { valorParc: true }, where: whereInadimplenciaCancelado });
    const recebimentoResult = await prisma.tbBoleto.aggregate({ _sum: { total: true }, where: whereRecebimentoCard });
    const juridicosResult = await prisma.tbBoleto.aggregate({ _sum: { total: true }, where: whereJuridicosNaoPagos });
    const amigavelResult = await prisma.tbBoleto.aggregate({ _sum: { total: true }, where: whereAmigavelNaoPagos });

    const prevInadimplenciaNormalResult = await prisma.tbBoleto.aggregate({ _sum: { valorParc: true }, where: wherePrevInadimplenciaNormal });
    const prevInadimplenciaCanceladoResult = await prisma.tbBoleto.aggregate({ _sum: { valorParc: true }, where: wherePrevInadimplenciaCancelado });
    const prevRecebimentoResult = await prisma.tbBoleto.aggregate({ _sum: { total: true }, where: wherePrevRecebimento });
    const prevJuridicosResult = await prisma.tbBoleto.aggregate({ _sum: { total: true }, where: wherePrevJuridicosNaoPagos });
    const prevAmigavelResult = await prisma.tbBoleto.aggregate({ _sum: { total: true }, where: wherePrevAmigavelNaoPagos });

    const recebimentoGrouped = await prisma.tbBoleto.groupBy({
      by: ['dataPgto'],
      _sum: { total: true },
      where: whereRecebimentoChart
    });

    return {
      inadimplenciaTotal: (inadimplenciaNormalResult._sum?.valorParc || 0) - (inadimplenciaCanceladoResult._sum?.valorParc || 0),
      recebimentoTotal: recebimentoResult._sum?.total || 0,
      juridicosTotal: (juridicosResult as any)._sum?.total || 0,
      amigavelTotal: (amigavelResult as any)._sum?.total || 0,

      prevInadTotal: (prevInadimplenciaNormalResult._sum?.valorParc || 0) - (prevInadimplenciaCanceladoResult._sum?.valorParc || 0),
      prevRecebimentoTotal: prevRecebimentoResult._sum?.total || 0,
      prevJuridicosTotal: (prevJuridicosResult as any)._sum?.total || 0,
      prevAmigavelTotal: (prevAmigavelResult as any)._sum?.total || 0,

      recebimentoGrouped: recebimentoGrouped.map(item => ({
        dataPgto: item.dataPgto ? item.dataPgto.toISOString() : null,
        total: item._sum?.total || 0,
      })),
    };
  };

  return unstable_cache(fetchData, cacheKey, { revalidate: 1800, tags: ['financeiro-dashboard'] })();
};

export default async function FinanceiroPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams || {};
  const condominio = params.condominio as string;
  const regiao = params.regiao as string;
  const estado = params.estado as string;
  const dataInicio = params.dataInicio as string;
  const dataFim = params.dataFim as string;
  const periodo = params.periodo as string;

  const data = await getFinanceiroData(
    condominio,
    regiao,
    estado,
    dataInicio,
    dataFim,
    periodo
  );

  const inadimplenciaTotal = data.inadimplenciaTotal;
  const recebimentoTotal = data.recebimentoTotal;
  const juridicosTotal = data.juridicosTotal;
  const amigavelTotal = data.amigavelTotal;

  const inadimplenciaFormatada = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(inadimplenciaTotal);
  const recebimentoFormatado = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(recebimentoTotal);
  const juridicosFormatado = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(juridicosTotal);
  const amigavelFormatado = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amigavelTotal);

  const trendInadimplencia = computeTrend(inadimplenciaTotal, data.prevInadTotal);
  const trendRecebimento = computeTrend(recebimentoTotal, data.prevRecebimentoTotal);
  const trendJuridicos = computeTrend(juridicosTotal, data.prevJuridicosTotal);
  const trendAmigavel = computeTrend(amigavelTotal, data.prevAmigavelTotal);

  const monthNamesShort = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const monthlyRecebimentoMap: { [key: string]: number } = {};

  for (const item of data.recebimentoGrouped) {
    if (!item.dataPgto) continue;
    const d = new Date(item.dataPgto);
    const label = `${monthNamesShort[d.getUTCMonth()]}/${String(d.getUTCFullYear()).slice(-2)}`;
    monthlyRecebimentoMap[label] = (monthlyRecebimentoMap[label] || 0) + (item.total || 0);
  }

  const recebimentoChartData = Object.entries(monthlyRecebimentoMap).map(([data, valor]) => ({
    data,
    valor: Math.round(valor)
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Financeiro</h1>
        <p className="text-sm text-gray-500 mt-1">Visão geral dos indicadores financeiros</p>
      </div>

      {/* Cards de Inadimplência e Acordos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Inadimplência"
          value={inadimplenciaFormatada}
          iconNode={<AlertCircle size={20} />}
          trend={trendInadimplencia.trend}
          trendValue={trendInadimplencia.trendValue}
          colorClass="text-red-500 bg-red-50"
        />
        <StatCard
          title="Recebimento"
          value={recebimentoFormatado}
          iconNode={<FileText size={20} />}
          trend={trendRecebimento.trend}
          trendValue={trendRecebimento.trendValue}
          colorClass="text-brand-primary bg-brand-primary/10"
        />
        <StatCard
          title="Jurídicos não pagos"
          value={juridicosFormatado}
          iconNode={<CalendarClock size={20} />}
          trend={trendJuridicos.trend}
          trendValue={trendJuridicos.trendValue}
          colorClass="text-orange-500 bg-orange-50"
        />
        <StatCard
          title="Amigável não pagos"
          value={amigavelFormatado}
          iconNode={<DollarSign size={20} />}
          trend={trendAmigavel.trend}
          trendValue={trendAmigavel.trendValue}
          colorClass="text-brand-secondary-foreground bg-brand-secondary/30"
        />
      </div>

      {/* Gráficos Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecebimentoChart data={recebimentoChartData} />
        <FaturamentoChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GanhosTotaisChart />
        <ReceitasVariaveisChart />
      </div>
    </div>
  );
}
