import { Metadata } from "next";
import { RateioBrutoChart } from "@/components/DashboardComponents2";
import prisma from "@/lib/prisma";
import { getDDDsForEstado, getDDDsForRegiao } from "@/lib/ddd";

export const metadata: Metadata = {
  title: "Rateio - BV Garantia BI",
};

export const dynamic = 'force-dynamic';

export default async function RateioPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const condominio = params.condominio as string;
  const regiao = params.regiao as string;
  const estado = params.estado as string;
  const dataFiltro = params.data as string;
  const periodo = params.periodo as string;

  console.log("Filtros recebidos na página de Rateio:", { condominio, regiao, estado, dataFiltro, periodo });

  const where: any = {};

  if (condominio) {
    where.idImovel = parseInt(condominio, 10);
  }

  if (regiao || estado) {
    let ddds: number[] = [];
    if (estado) ddds = getDDDsForEstado(estado);
    else if (regiao) ddds = getDDDsForRegiao(regiao);
    
    if (ddds.length > 0) {
      where.imovel = {
        clientes: {
          some: {
            dddce: { in: ddds }
          }
        }
      };
    }
  }

  if (dataFiltro) {
    const dateObj = new Date(dataFiltro);
    if (!isNaN(dateObj.getTime())) {
      const year = dateObj.getUTCFullYear();
      const month = dateObj.getUTCMonth();
      where.mesRef = {
        gte: new Date(Date.UTC(year, month, 1)),
        lt: new Date(Date.UTC(year, month + 1, 1))
      };
    }
  } else if (periodo) {
    const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const monthIndex = meses.indexOf(periodo);
    if (monthIndex >= 0) {
      const year = new Date().getUTCFullYear();
      where.mesRef = {
        gte: new Date(Date.UTC(year, monthIndex, 1)),
        lt: new Date(Date.UTC(year, monthIndex + 1, 1))
      };
    }
  }

  const antecipacoes = await prisma.tbAntecipacao.findMany({
    where,
    select: {
      mesRef: true,
      valor: true,
    }
  });

  const mesesMap = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const chartMap: Record<string, number> = {};
  
  antecipacoes.forEach(a => {
    if (a.mesRef && a.valor) {
      const month = a.mesRef.getUTCMonth();
      const label = mesesMap[month];
      chartMap[label] = (chartMap[label] || 0) + a.valor;
    }
  });

  const chartData = mesesMap.map(mes => ({
    periodo: mes,
    valor: chartMap[mes] || 0
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Rateio</h1>
          <p className="text-sm text-gray-500 mt-1">Análise de indicadores de rateio</p>
        </div>
        <div className="text-xs text-gray-400 bg-gray-50 p-2 rounded border border-gray-100">
          <strong>Filtros Ativos:</strong> Condomínio: {condominio || 'Nenhum'}, Região: {regiao || 'Nenhum'}, Estado: {estado || 'Nenhum'}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RateioBrutoChart data={chartData} />
      </div>
    </div>
  );
}

