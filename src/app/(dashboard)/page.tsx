import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { getDDDsForEstado, getDDDsForRegiao } from "@/lib/ddd";
import {
  StatCard,
  RecebimentoChart,
  FaturamentoChart,
  GanhosTotaisChart,
  ReceitasVariaveisChart
} from "@/components/DashboardComponents";
import { AlertCircle, FileText, CalendarClock, DollarSign } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const whereBoleto: any = {
    pago: false,
    cancelado: false,
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
      const year = new Date().getUTCFullYear();
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

  const whereAbertosSemAcordo = {
    ...whereBoleto,
    OR: [
      { origem: null },
      { origem: { notIn: [5, 6] } }
    ]
  };

  const whereJuridicosNaoPagos = {
    ...whereBoleto,
    origem: 6,
    nrParcela: {
      not: null,
      notIn: [0]
    }
  };

  const whereAmigavelNaoPagos = {
    ...whereBoleto,
    origem: 5,
    nrParcela: {
      not: null,
      notIn: [0]
    }
  };

  // Filtros do mês anterior para comparativo de trend
  let prevDateFilter: any = {};
  if (periodo) {
    const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const monthIndex = meses.indexOf(periodo);
    if (monthIndex >= 0) {
      const year = new Date().getUTCFullYear();
      const prevMonthIndex = monthIndex === 0 ? 11 : monthIndex - 1;
      const prevYear = monthIndex === 0 ? year - 1 : year;
      const startPrev = new Date(Date.UTC(prevYear, prevMonthIndex, 1, 0, 0, 0, 0));
      const endPrev = new Date(Date.UTC(prevYear, prevMonthIndex + 1, 0, 23, 59, 59, 999));
      prevDateFilter = { gte: startPrev, lte: endPrev };
    }
  } else {
    const year = today.getUTCFullYear();
    const month = today.getUTCMonth();
    const endPrevMonth = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
    prevDateFilter = { lte: endPrevMonth };
  }

  const wherePrevBoleto: any = {
    pago: false,
    cancelado: false,
    dataVecto: prevDateFilter
  };
  if (condominio) wherePrevBoleto.idImovel = whereBoleto.idImovel;
  if (whereBoleto.cliente) wherePrevBoleto.cliente = whereBoleto.cliente;

  const wherePrevAbertos = {
    ...wherePrevBoleto,
    OR: [
      { origem: null },
      { origem: { notIn: [5, 6] } }
    ]
  };

  const wherePrevJuridicos = {
    ...wherePrevBoleto,
    origem: 6,
    nrParcela: { not: null, notIn: [0] }
  };

  const wherePrevAmigavel = {
    ...wherePrevBoleto,
    origem: 5,
    nrParcela: { not: null, notIn: [0] }
  };

  // Filtro de Recebimento (pago = 1, cancelado = 0)
  const whereRecebimento: any = {
    pago: true,
    cancelado: false,
  };
  if (condominio) whereRecebimento.idImovel = whereBoleto.idImovel;
  if (whereBoleto.cliente) whereRecebimento.cliente = whereBoleto.cliente;

  if (dataInicio || dataFim) {
    whereRecebimento.dataPgto = {};
    if (dataInicio) {
      const dateInicioObj = new Date(dataInicio);
      if (!isNaN(dateInicioObj.getTime())) whereRecebimento.dataPgto.gte = dateInicioObj;
    }
    if (dataFim) {
      const dateFimObj = new Date(dataFim);
      if (!isNaN(dateFimObj.getTime())) {
        dateFimObj.setHours(23, 59, 59, 999);
        whereRecebimento.dataPgto.lte = dateFimObj;
      }
    }
  } else if (periodo) {
    const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const monthIndex = meses.indexOf(periodo);
    if (monthIndex >= 0) {
      const year = new Date().getUTCFullYear();
      const firstDay = new Date(Date.UTC(year, monthIndex, 1));
      const nextMonth = new Date(Date.UTC(year, monthIndex + 1, 1));
      whereRecebimento.dataPgto = { gte: firstDay, lt: nextMonth };
    }
  } else {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);
    whereRecebimento.dataPgto = { gte: sixMonthsAgo, lte: today };
  }

  // Executa todas as consultas em PARALELO no SQLite acelerado por índices
  const [
    inadimplenciaResult,
    abertosResult,
    juridicosResult,
    amigavelResult,
    prevInadimplenciaResult,
    prevAbertosResult,
    prevJuridicosResult,
    prevAmigavelResult,
    recebimentoGrouped,
  ] = await Promise.all([
    prisma.tbBoleto.aggregate({ _sum: { total: true }, where: whereBoleto }),
    prisma.tbBoleto.aggregate({ _sum: { total: true }, where: whereAbertosSemAcordo }),
    prisma.tbBoleto.aggregate({ _sum: { total: true }, where: whereJuridicosNaoPagos }),
    prisma.tbBoleto.aggregate({ _sum: { total: true }, where: whereAmigavelNaoPagos }),

    prisma.tbBoleto.aggregate({ _sum: { total: true }, where: wherePrevBoleto }),
    prisma.tbBoleto.aggregate({ _sum: { total: true }, where: wherePrevAbertos }),
    prisma.tbBoleto.aggregate({ _sum: { total: true }, where: wherePrevJuridicos }),
    prisma.tbBoleto.aggregate({ _sum: { total: true }, where: wherePrevAmigavel }),

    prisma.tbBoleto.groupBy({
      by: ['dataPgto'],
      _sum: { total: true },
      where: whereRecebimento
    })
  ]);

  const inadimplenciaTotal = inadimplenciaResult._sum.total || 0;
  const abertosTotal = abertosResult._sum.total || 0;
  const juridicosTotal = juridicosResult._sum.total || 0;
  const amigavelTotal = amigavelResult._sum.total || 0;

  const prevInadTotal = prevInadimplenciaResult._sum.total || 0;
  const prevAbertosTotal = prevAbertosResult._sum.total || 0;
  const prevJuridicosTotal = prevJuridicosResult._sum.total || 0;
  const prevAmigavelTotal = prevAmigavelResult._sum.total || 0;

  const inadimplenciaFormatada = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(inadimplenciaTotal);
  const abertosFormatado = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(abertosTotal);
  const juridicosFormatado = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(juridicosTotal);
  const amigavelFormatado = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amigavelTotal);

  const trendInadimplencia = computeTrend(inadimplenciaTotal, prevInadTotal);
  const trendAbertos = computeTrend(abertosTotal, prevAbertosTotal);
  const trendJuridicos = computeTrend(juridicosTotal, prevJuridicosTotal);
  const trendAmigavel = computeTrend(amigavelTotal, prevAmigavelTotal);

  // Formata o agrupamento de recebimento para o gráfico
  const monthNamesShort = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const monthlyRecebimentoMap: { [key: string]: number } = {};

  for (const item of recebimentoGrouped) {
    if (!item.dataPgto) continue;
    const d = new Date(item.dataPgto);
    const label = `${monthNamesShort[d.getUTCMonth()]}/${String(d.getUTCFullYear()).slice(-2)}`;
    monthlyRecebimentoMap[label] = (monthlyRecebimentoMap[label] || 0) + (item._sum.total || 0);
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
          title="Abertos S/ Acordo"
          value={abertosFormatado}
          iconNode={<FileText size={20} />}
          trend={trendAbertos.trend}
          trendValue={trendAbertos.trendValue}
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
