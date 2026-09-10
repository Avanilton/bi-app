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
import { PrismaLibSql } from "@prisma/adapter-libsql";

const dbPath = path.resolve(process.cwd(), "local.db");
const adapter = new PrismaLibSql({ url: `file:${dbPath}` });
const prismaLocal = new PrismaClient({ adapter });

// Função para buscar dados injetados pela automação Python/Playwright
const getDashboardData = async () => {
  let inadimplenciaTotal = 0;
  let inadimplenciaDetalhes = [];
  
  try {
    const lastRecord = await prismaLocal.inadimplenciaDiaria.findFirst({
      orderBy: { dataExecucao: "desc" }
    });
    
    if (lastRecord) {
      inadimplenciaTotal = lastRecord.valorTotal;
      if (lastRecord.detalhes) {
        inadimplenciaDetalhes = JSON.parse(lastRecord.detalhes);
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

  // Valores padrão/zerados caso o arquivo da automação ainda não exista
  return {
    recebimentoTotal: 0,
    juridicosTotal: 0,
    amigavelTotal: 0,
    trendInadimplencia: { trend: "up", trendValue: "0.0%" },
    trendRecebimento: { trend: "up", trendValue: "0.0%" },
    trendJuridicos: { trend: "up", trendValue: "0.0%" },
    trendAmigavel: { trend: "up", trendValue: "0.0%" },
    recebimentoChartData: [],
    ...outrosDados,
    inadimplenciaTotal, // sobrescreve com o do banco de dados
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

  const data = await getDashboardData();

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
