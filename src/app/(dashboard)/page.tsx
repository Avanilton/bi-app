import { Metadata } from "next";
import {
  StatCard,
  RecebimentoChart,
  FaturamentoChart,
  GanhosTotaisChart,
  ReceitasVariaveisChart
} from "@/components/DashboardComponents";
import { InadimplenciaCard } from "@/components/InadimplenciaCard";
import { AlertCircle, FileText, CalendarClock, DollarSign } from "lucide-react";
import fs from "fs";
import path from "path";

export const metadata: Metadata = {
  title: "Dashboard - BV Garantia BI",
};

export const dynamic = 'force-dynamic';

import { PrismaClient } from "../../../prisma/generated/local-client";

const dbPath = path.resolve(process.cwd(), "local.db");
const prismaLocal = new PrismaClient({ datasources: { db: { url: `file:${dbPath}` } } } as any);

import prisma from "@/lib/prisma";
import { INACTIVE_CONDOMINIOS } from "@/lib/constants";
// Cache global para evitar carregar e processar 20MB de JSON a cada load
let cachedDataExecucaoTS: number | null = null;
let cachedInadimplenciaDetalhes: any[] = [];
let cachedInadimplenciaTotal: number = 0;

// Parse de datas para filtro nos documentos
const parseDDMMYYYY = (dateString: string) => {
  if (!dateString) return null;
  const parts = dateString.split('/');
  if (parts.length === 3) {
    return new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
  }
  return null;
};

// Função para buscar dados injetados pela automação Python/Playwright
const getDashboardData = async (params: any) => {
  let inadimplenciaTotal = 0;
  let inadimplenciaDetalhes = [];
  
  let startDate: Date | null = null;
  let endDate: Date | null = null;
  
  if (params.dataInicio && params.dataFim) {
    startDate = new Date(params.dataInicio + 'T00:00:00.000Z');
    endDate = new Date(params.dataFim + 'T23:59:59.999Z');
  } else if (params.periodo) {
    const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const monthIndex = meses.indexOf(params.periodo);
    if (monthIndex !== -1) {
      const year = new Date().getFullYear();
      startDate = new Date(year, monthIndex, 1);
      endDate = new Date(year, monthIndex + 1, 0, 23, 59, 59, 999);
    }
  }

  // --- INICIO DAS PROMISES REMOTAS (Paralelismo) ---
  const baseWhere: any = {
    idEmpresa: 75,
    idImovel: { notIn: INACTIVE_CONDOMINIOS }
  };

  if (params.condominio) {
    const idImovel = parseInt(params.condominio, 10);
    if (!isNaN(idImovel)) {
      baseWhere.idImovel = idImovel;
    }
  }

  const dateFilterVecto: any = {};
  const dateFilterPgto: any = {};
  
  if (startDate && endDate) {
    dateFilterVecto.gte = startDate;
    dateFilterVecto.lte = endDate;
    
    dateFilterPgto.gte = startDate;
    dateFilterPgto.lte = endDate;
  }

  let recebimentoDateFilter = dateFilterPgto;
  if (!startDate && !endDate && !params.periodo) {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    recebimentoDateFilter = { gte: firstDay };
  }

  const promiseJuridicos = prisma.tbBoleto.aggregate({
    _sum: { total: true },
    where: {
      ...baseWhere,
      pago: false,
      cancelado: false,
      origem: 5,
      dataVecto: (startDate && endDate) ? dateFilterVecto : { lt: new Date() }
    }
  }).catch((e: any) => {
    console.error("Erro Juridicos:", e);
    return null;
  });

  const promiseAmigavel = prisma.tbBoleto.aggregate({
    _sum: { total: true },
    where: {
      ...baseWhere,
      pago: false,
      cancelado: false,
      origem: 6,
      dataVecto: (startDate && endDate) ? dateFilterVecto : { lt: new Date() }
    }
  }).catch((e: any) => {
    console.error("Erro Amigavel:", e);
    return null;
  });

  const promiseRecebimento = prisma.tbBoleto.aggregate({
    _sum: { total: true },
    where: {
      ...baseWhere,
      pago: true,
      cancelado: false,
      dataPgto: (startDate || endDate || params.periodo) ? recebimentoDateFilter : recebimentoDateFilter
    }
  }).catch((e: any) => {
    console.error("Erro Recebimento:", e);
    return null;
  });
  // --- FIM DAS PROMISES REMOTAS ---

  try {
    // 1. Busca apenas a dataExecucao primeiro (Ultra Rápido)
    const lastRecordMeta = await prismaLocal.inadimplenciaDiaria.findFirst({
      orderBy: { dataExecucao: "desc" },
      select: { dataExecucao: true, valorTotal: true }
    });
    
    if (lastRecordMeta) {
      const currentDBTime = lastRecordMeta.dataExecucao.getTime();
      
      // Verifica se o cache é válido
      if (cachedDataExecucaoTS === currentDBTime) {
        inadimplenciaDetalhes = cachedInadimplenciaDetalhes;
        inadimplenciaTotal = cachedInadimplenciaTotal;
      } else {
        // Precisa atualizar o cache. Carrega tudo. (Pode demorar 1-2 seg, mas só ocorre 1x)
        const lastRecord = await prismaLocal.inadimplenciaDiaria.findFirst({
          orderBy: { dataExecucao: "desc" }
        });
        
        if (lastRecord && lastRecord.detalhes) {
          inadimplenciaTotal = lastRecord.valorTotal;
          inadimplenciaDetalhes = JSON.parse(lastRecord.detalhes);
          
          // Pré-processamento: converter datas para timestamp pra busca O(1)
          inadimplenciaDetalhes.forEach((cond: any) => {
            cond.condominos?.forEach((pessoa: any) => {
              pessoa.documentos?.forEach((doc: any) => {
                const dateObj = parseDDMMYYYY(doc.vecto);
                doc.parsedTS = dateObj ? dateObj.getTime() : 0;
              });
            });
          });
          
          // Salva no cache
          cachedDataExecucaoTS = currentDBTime;
          cachedInadimplenciaDetalhes = inadimplenciaDetalhes;
          cachedInadimplenciaTotal = inadimplenciaTotal;
        }
      }
      
      // Aplicando filtros na memória instanciada (super rápido)
      
      // Filtro por Condomínio
      if (params.condominio) {
        const idImovel = parseInt(params.condominio, 10);
        if (!isNaN(idImovel)) {
          let nomeFantasia = null;
          try {
            const res = await fetch("http://localhost:3006/api/condominios", { next: { revalidate: 600 } });
            const json = await res.json();
            if (json.success && json.data) {
              const imovel = json.data.find((c: any) => c.idImovel === idImovel);
              if (imovel) nomeFantasia = imovel.nomeFantasia;
            }
          } catch (error) {
            console.error("Erro ao buscar nome do condominio internamente:", error);
          }
          
          if (nomeFantasia) {
            const nome = nomeFantasia.toUpperCase().trim();
            inadimplenciaDetalhes = inadimplenciaDetalhes.filter((d: any) => {
              const docNome = d.condominio?.toUpperCase().trim() || "";
              return docNome.includes(nome) || nome.includes(docNome);
            });
          }
        }
      }

      // Filtro por Data
      if (startDate && endDate) {
        const startTS = startDate.getTime();
        const endTS = endDate.getTime();
        
        inadimplenciaDetalhes = inadimplenciaDetalhes.map((cond: any) => {
          let totalCondominio = 0;
          const condominosFiltrados = cond.condominos?.map((pessoa: any) => {
            const documentosFiltrados = pessoa.documentos?.filter((doc: any) => {
              return doc.parsedTS >= startTS && doc.parsedTS <= endTS;
            }) || [];
            
            const totalPessoa = documentosFiltrados.reduce((acc: number, cur: any) => acc + (cur.valor || 0), 0);
            totalCondominio += totalPessoa;
            
            return { ...pessoa, documentos: documentosFiltrados, valor: totalPessoa };
          }) || [];
          
          return { ...cond, condominos: condominosFiltrados, valor: totalCondominio };
        });
      }

      // Se aplicamos qualquer filtro, devemos recalcular o Total Geral
      if (params.condominio || (startDate && endDate)) {
        inadimplenciaTotal = inadimplenciaDetalhes.reduce((acc: number, curr: any) => acc + (curr.valor || 0), 0);
      }
    }
  } catch (error) {
    console.error("Erro ao ler dados do banco local:", error);
  }

  // Resolvendo Promises Paralelas
  let recebimentoTotal = 0;
  let juridicosTotal = 0;
  let amigavelTotal = 0;

  try {
    const [resultJuridicos, resultAmigavel, resultRecebimento] = await Promise.all([
      promiseJuridicos,
      promiseAmigavel,
      promiseRecebimento
    ]);

    juridicosTotal = resultJuridicos?._sum?.total || 0;
    amigavelTotal = resultAmigavel?._sum?.total || 0;
    recebimentoTotal = resultRecebimento?._sum?.total || 0;
  } catch (error) {
    console.error("Erro ao resolver dados do banco para Recebimentos, Jurídicos e Amigáveis:", error);
  }

  // Lendo os outros dados estáticos (se existirem) ou zerados
  let outrosDados = {};
  try {
    const dataPath = path.join(process.cwd(), "public", "data", "dashboard.json");
    if (fs.existsSync(dataPath)) {
      const fileContents = fs.readFileSync(dataPath, "utf8");
      outrosDados = JSON.parse(fileContents);
    }
  } catch (error) {
    console.error("Erro ao ler dados json do dashboard:", error);
  }

  // Valores com os totais consultados remotamente e localmente
  return {
    recebimentoTotal,
    juridicosTotal,
    amigavelTotal,
    trendInadimplencia: { trend: "up", trendValue: "0.0%" },
    trendRecebimento: { trend: "up", trendValue: "0.0%" },
    trendJuridicos: { trend: "up", trendValue: "0.0%" },
    trendAmigavel: { trend: "up", trendValue: "0.0%" },
    recebimentoChartData: [],
    ...outrosDados,
    inadimplenciaTotal, // sobrescreve com o do banco de dados (local)
    inadimplenciaDetalhes // Array com os detalhes importados
  };
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Os parâmetros de busca podem ser repassados ou ignorados dependendo de como a automação funcionará
  const params = await searchParams || {};

  const data = await getDashboardData(params);

  const inadimplenciaFormatada = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.inadimplenciaTotal);
  const recebimentoFormatado = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.recebimentoTotal);
  const juridicosFormatado = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.juridicosTotal);
  const amigavelFormatado = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.amigavelTotal);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Visão geral dos indicadores financeiros</p>
      </div>

      {/* Cards Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <InadimplenciaCard
          inadimplenciaFormatada={inadimplenciaFormatada}
          trend={data.trendInadimplencia?.trend || "up"}
          trendValue={data.trendInadimplencia?.trendValue || "0.0%"}
          detalhes={data.inadimplenciaDetalhes}
        />
        <StatCard
          title="Recebimento"
          value={recebimentoFormatado}
          iconNode={<FileText size={20} />}
          trend={data.trendRecebimento?.trend || "up"}
          trendValue={data.trendRecebimento?.trendValue || "0.0%"}
          colorClass="text-brand-primary bg-brand-primary/10"
        />
        <StatCard
          title="Jurídicos não pagos"
          value={juridicosFormatado}
          iconNode={<CalendarClock size={20} />}
          trend={data.trendJuridicos?.trend || "up"}
          trendValue={data.trendJuridicos?.trendValue || "0.0%"}
          colorClass="text-orange-500 bg-orange-50"
        />
        <StatCard
          title="Amigável não pagos"
          value={amigavelFormatado}
          iconNode={<DollarSign size={20} />}
          trend={data.trendAmigavel?.trend || "up"}
          trendValue={data.trendAmigavel?.trendValue || "0.0%"}
          colorClass="text-brand-secondary-foreground bg-brand-secondary/30"
        />
      </div>

      {/* Gráficos Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecebimentoChart data={data.recebimentoChartData || []} />
        <FaturamentoChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GanhosTotaisChart />
        <ReceitasVariaveisChart />
      </div>
    </div>
  );
}
