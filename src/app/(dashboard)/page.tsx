import { Metadata } from "next";
import { Suspense } from "react";
import { unstable_cache } from "next/cache";
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

// Parse de datas em modo numérico YYYYMMDD (Ultra rápido, sem Date objects na RAM)
const parseToYYYYMMDD = (dateString: string) => {
  if (!dateString) return 0;
  const parts = dateString.split('/');
  if (parts.length === 3) {
    return parseInt(parts[2] + parts[1] + parts[0], 10);
  }
  return 0;
};

// CACHE DE 24 HORAS (86400 segundos) PARA AS QUERYS REMOTAS (D-1)
const getCachedJuridicosTotal = async (condominio: string | undefined, dataInicio: string | undefined, dataFim: string | undefined, periodo: string | undefined) => {
  return await unstable_cache(
    async () => {
      const params: any = { condominio, dataInicio, dataFim, periodo };
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
      const baseWhere: any = { idEmpresa: 75, idImovel: { notIn: INACTIVE_CONDOMINIOS } };
      if (params.condominio) {
        const idImovel = parseInt(params.condominio, 10);
        if (!isNaN(idImovel)) baseWhere.idImovel = idImovel;
      }
      const dateFilterVecto = startDate && endDate ? { gte: startDate, lte: endDate } : { lt: new Date() };

      try {
        const result = await prisma.tbBoleto.aggregate({
          _sum: { total: true },
          where: { ...baseWhere, pago: false, cancelado: false, origem: 5, dataVecto: dateFilterVecto }
        });
        return result?._sum?.total || 0;
      } catch (error) {
        console.error("Erro Juridicos:", error);
        return 0;
      }
    },
    ['juridicos-total-v3', condominio || 'all', dataInicio || 'any', dataFim || 'any', periodo || 'any'],
    { revalidate: 86400 }
  )();
};

const getCachedAmigavelTotal = async (condominio: string | undefined, dataInicio: string | undefined, dataFim: string | undefined, periodo: string | undefined) => {
  return await unstable_cache(
    async () => {
      const params: any = { condominio, dataInicio, dataFim, periodo };
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
      const baseWhere: any = { idEmpresa: 75, idImovel: { notIn: INACTIVE_CONDOMINIOS } };
      if (params.condominio) {
        const idImovel = parseInt(params.condominio, 10);
        if (!isNaN(idImovel)) baseWhere.idImovel = idImovel;
      }
      const dateFilterVecto = startDate && endDate ? { gte: startDate, lte: endDate } : { lt: new Date() };

      try {
        const result = await prisma.tbBoleto.aggregate({
          _sum: { total: true },
          where: { ...baseWhere, pago: false, cancelado: false, origem: 6, dataVecto: dateFilterVecto }
        });
        return result?._sum?.total || 0;
      } catch (error) {
        console.error("Erro Amigavel:", error);
        return 0;
      }
    },
    ['amigavel-total-v3', condominio || 'all', dataInicio || 'any', dataFim || 'any', periodo || 'any'],
    { revalidate: 86400 }
  )();
};

const getCachedRecebimentoTotal = async (condominio: string | undefined, dataInicio: string | undefined, dataFim: string | undefined, periodo: string | undefined) => {
  return await unstable_cache(
    async () => {
      const params: any = { condominio, dataInicio, dataFim, periodo };
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
      const baseWhere: any = { idEmpresa: 75, idImovel: { notIn: INACTIVE_CONDOMINIOS } };
      if (params.condominio) {
        const idImovel = parseInt(params.condominio, 10);
        if (!isNaN(idImovel)) baseWhere.idImovel = idImovel;
      }
      const dateFilterPgto: any = {};
      if (startDate && endDate) {
        dateFilterPgto.gte = startDate;
        dateFilterPgto.lte = endDate;
      } else if (!startDate && !endDate && !params.periodo) {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        dateFilterPgto.gte = firstDay;
      }

      try {
        const result = await prisma.tbBoleto.aggregate({
          _sum: { total: true },
          where: {
            ...baseWhere,
            pago: true,
            cancelado: false,
            dataPgto: Object.keys(dateFilterPgto).length > 0 ? dateFilterPgto : undefined
          }
        });
        return result?._sum?.total || 0;
      } catch (error) {
        console.error("Erro Recebimento:", error);
        return 0;
      }
    },
    ['recebimento-total-v3', condominio || 'all', dataInicio || 'any', dataFim || 'any', periodo || 'any'],
    { revalidate: 86400 }
  )();
};


// COMPONENTES ASSÍNCRONOS
async function AsyncJuridicosCard({ params }: { params: any }) {
  const total = await getCachedJuridicosTotal(params.condominio as string, params.dataInicio as string, params.dataFim as string, params.periodo as string);
  const formatado = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total);
  
  return (
    <StatCard
      title="Jurídicos não pagos"
      value={formatado}
      iconNode={<CalendarClock size={20} />}
      trend="up"
      trendValue="0.0%"
      colorClass="text-orange-500 bg-orange-50"
    />
  );
}

async function AsyncAmigavelCard({ params }: { params: any }) {
  const total = await getCachedAmigavelTotal(params.condominio as string, params.dataInicio as string, params.dataFim as string, params.periodo as string);
  const formatado = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total);
  
  return (
    <StatCard
      title="Amigável não pagos"
      value={formatado}
      iconNode={<DollarSign size={20} />}
      trend="up"
      trendValue="0.0%"
      colorClass="text-brand-secondary-foreground bg-brand-secondary/30"
    />
  );
}

async function AsyncRecebimentoCard({ params }: { params: any }) {
  const total = await getCachedRecebimentoTotal(params.condominio as string, params.dataInicio as string, params.dataFim as string, params.periodo as string);
  const formatado = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total);
  
  return (
    <StatCard
      title="Recebimento"
      value={formatado}
      iconNode={<FileText size={20} />}
      trend="up"
      trendValue="0.0%"
      colorClass="text-brand-primary bg-brand-primary/10"
    />
  );
}


// Função de Inadimplência
const getInadimplenciaData = async (params: any) => {
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
        // Precisa atualizar o cache. Carrega tudo.
        const lastRecord = await prismaLocal.inadimplenciaDiaria.findFirst({
          orderBy: { dataExecucao: "desc" }
        });
        
        if (lastRecord && lastRecord.detalhes) {
          inadimplenciaTotal = lastRecord.valorTotal;
          inadimplenciaDetalhes = JSON.parse(lastRecord.detalhes);
          
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
            const imovel = await prisma.tbImovel.findFirst({
              where: { idImovel: idImovel },
              select: { nomeFantasia: true }
            });
            if (imovel) nomeFantasia = imovel.nomeFantasia;
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

      // Filtro por Data (LAZY PARSING)
      if (startDate && endDate) {
        const startInt = startDate.getFullYear() * 10000 + (startDate.getMonth() + 1) * 100 + startDate.getDate();
        const endInt = endDate.getFullYear() * 10000 + (endDate.getMonth() + 1) * 100 + endDate.getDate();
        
        inadimplenciaDetalhes = inadimplenciaDetalhes.map((cond: any) => {
          let totalCondominio = 0;
          const condominosFiltrados = cond.condominos?.map((pessoa: any) => {
            const documentosFiltrados = pessoa.documentos?.filter((doc: any) => {
              // Converte a data da string on the fly ultra rápido
              const docInt = doc.parsedTS || parseToYYYYMMDD(doc.vecto);
              doc.parsedTS = docInt; 
              return docInt >= startInt && docInt <= endInt;
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
    trendInadimplencia: { trend: "up", trendValue: "0.0%" },
    recebimentoChartData: [],
    ...outrosDados,
    inadimplenciaTotal, 
    inadimplenciaDetalhes 
  };
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Os parâmetros de busca
  const params = await searchParams || {};

  // Busca rápida (sem MySQL remoto)
  const data = await getInadimplenciaData(params);

  const inadimplenciaFormatada = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.inadimplenciaTotal);

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
        
        {/* Usando Suspense para Carregamento em Background das requisições pesadas */}
        <Suspense fallback={
          <StatCard title="Recebimento" value="Buscando..." iconNode={<FileText size={20} />} trend="up" trendValue="0.0%" colorClass="text-brand-primary bg-brand-primary/10 opacity-50" />
        }>
          <AsyncRecebimentoCard params={params} />
        </Suspense>

        <Suspense fallback={
          <StatCard title="Jurídicos não pagos" value="Buscando..." iconNode={<CalendarClock size={20} />} trend="up" trendValue="0.0%" colorClass="text-orange-500 bg-orange-50 opacity-50" />
        }>
          <AsyncJuridicosCard params={params} />
        </Suspense>

        <Suspense fallback={
          <StatCard title="Amigável não pagos" value="Buscando..." iconNode={<DollarSign size={20} />} trend="up" trendValue="0.0%" colorClass="text-brand-secondary-foreground bg-brand-secondary/30 opacity-50" />
        }>
          <AsyncAmigavelCard params={params} />
        </Suspense>
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
