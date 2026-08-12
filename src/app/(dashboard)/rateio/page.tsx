import { Metadata } from "next";
import { RateioBrutoChart } from "@/components/DashboardComponents2";
import prisma from "@/lib/prisma";
import { getDDDsForEstado, getDDDsForRegiao } from "@/lib/ddd";
import { getRecebimentoTotalAsync } from "@/lib/pdf-recebimento";

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

  let idImoveis: number[] | null = null;

  if (condominio) {
    const id = parseInt(condominio, 10);
    where.idImovel = id;
    idImoveis = [id];
  }

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
      const idsByDdd = clientesMatches.map(c => c.idImovel);
      
      if (idImoveis) {
        idImoveis = idImoveis.filter(id => idsByDdd.includes(id));
      } else {
        idImoveis = idsByDdd;
      }
      
      where.idImovel = { in: idImoveis };
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
      idTituloPagar: true,
      mesRef: true,
      valor: true,
      receitaAntecipada: true,
      perdas: true,
      custas: true,
      servicos: true,
    }
  });

  let descontos: any[] = [];
  if (antecipacoes.length > 0) {
    const whereDescontos: any = {};
    const idTitulos = antecipacoes.map(a => a.idTituloPagar);
    
    if (idImoveis && idImoveis.length > 0) {
      // Otimização: buscar pela chave primária (idImovel) é muito mais rápido que um IN gigante
      whereDescontos.idImovel = { in: idImoveis };
    } else if (idTitulos.length <= 50000) {
      whereDescontos.idTituloPagar = { in: idTitulos };
    }

    descontos = await prisma.tbDescontoAntecipacao.findMany({
      where: whereDescontos,
      select: {
        idTituloPagar: true,
        valor: true,
      }
    });
  }

  const mesesMap = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const chartMap: Record<string, number> = {};
  const tableMap: Record<string, any> = {};
  const tituloToMes: Record<number, string> = {};

  antecipacoes.forEach(a => {
    if (a.mesRef && a.valor) {
      const month = a.mesRef.getUTCMonth();
      const year = a.mesRef.getUTCFullYear();
      const label = mesesMap[month];
      chartMap[label] = (chartMap[label] || 0) + a.valor;

      const mesKey = `${String(month + 1).padStart(2, '0')}/${year}`;
      tituloToMes[a.idTituloPagar] = mesKey;

      if (!tableMap[mesKey]) {
        tableMap[mesKey] = {
          mesRefObj: a.mesRef,
          ref: mesKey,
          antecipado: 0,
          outros: 0,
          perda: 0,
          adicional: 0,
          servico: 0,
        };
      }
      tableMap[mesKey].antecipado += (a.receitaAntecipada || 0);
      tableMap[mesKey].perda += (a.perdas || 0);
      tableMap[mesKey].adicional += (a.custas || 0);
      tableMap[mesKey].servico += (a.servicos || 0);
    }
  });

  descontos.forEach(d => {
    const mesKey = tituloToMes[d.idTituloPagar];
    if (mesKey && tableMap[mesKey]) {
      tableMap[mesKey].outros += (d.valor || 0);
    }
  });

  const tableData = Object.values(tableMap)
    .sort((a, b) => b.mesRefObj.getTime() - a.mesRefObj.getTime())
    .map(row => {
      const antecipacaoLiquida = row.antecipado - row.outros - row.perda + row.adicional - row.servico;
      return {
        ref: row.ref,
        antecipado: row.antecipado,
        outros: row.outros,
        perda: row.perda,
        adicional: row.adicional,
        servico: row.servico,
        antecipacao: antecipacaoLiquida,
        pis: 0,
        cofins: 0,
        csll: 0,
        ir: 0
      };
    });

  const chartData = mesesMap.map(mes => ({
    periodo: mes,
    valor: chartMap[mes] || 0
  }));

  // Para a tabela TbAntecipacao, mesRef costuma ser o último dia do mês. 
  // "Data de vencimento hoje" no contexto de mesRef significa o mês atual.
  const startOfMonth = new Date();
  startOfMonth.setHours(0, 0, 0, 0);
  startOfMonth.setDate(1);

  const endOfMonth = new Date(startOfMonth);
  endOfMonth.setMonth(endOfMonth.getMonth() + 1);
  endOfMonth.setDate(0); // Último dia do mês atual
  endOfMonth.setHours(23, 59, 59, 999);

  const antecipacoesHoje = await prisma.tbAntecipacao.aggregate({
    where: {
      ...where,
      mesRef: {
        gte: startOfMonth,
        lte: endOfMonth,
      }
    },
    _sum: {
      servicos: true,
    }
  });

  const servicosHoje = antecipacoesHoje._sum.servicos || 0;

  const totalRecebimentoPDF = await getRecebimentoTotalAsync();

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-500 font-medium text-sm">Rateio (Mês Atual)</h3>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-2">
            R$ {servicosHoje.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-500 font-medium text-sm">Recebimento (PDF)</h3>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-2 text-green-600">
            R$ {totalRecebimentoPDF}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RateioBrutoChart data={chartData} />
      </div>
    </div>
  );
}

