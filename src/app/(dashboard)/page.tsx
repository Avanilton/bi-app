import { Metadata } from "next";
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

export default function FinanceiroPage() {
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
          value="R$ 1.245.000" 
          iconNode={<AlertCircle size={20} />} 
          trend="down" 
          trendValue="2.4%"
          colorClass="text-red-500 bg-red-50" 
        />
        <StatCard 
          title="Abertos S/ Acordo" 
          value="R$ 845.300" 
          iconNode={<FileText size={20} />} 
          trend="up" 
          trendValue="1.2%"
          colorClass="text-brand-primary bg-brand-primary/10"
        />
        <StatCard 
          title="Acordos Vencidos" 
          value="R$ 125.400" 
          iconNode={<CalendarClock size={20} />} 
          trend="up" 
          trendValue="5.1%"
          colorClass="text-orange-500 bg-orange-50"
        />
        <StatCard 
          title="Acordos a Vencer" 
          value="R$ 315.800" 
          iconNode={<DollarSign size={20} />} 
          trend="up" 
          trendValue="8.4%"
          colorClass="text-brand-secondary-foreground bg-brand-secondary/30"
        />
      </div>

      {/* Gráficos Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecebimentoChart />
        <FaturamentoChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GanhosTotaisChart />
        <ReceitasVariaveisChart />
      </div>
    </div>
  );
}
