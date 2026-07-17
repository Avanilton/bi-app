import { Metadata } from "next";
import { 
  PosicaoAtualCarteiraChart,
  RecuperacaoCarteiraChart,
  CarteiraSaldoChart,
  ComparativoCarteiraChart
} from "@/components/DashboardComponents2";
import { StatCard } from "@/components/DashboardComponents";
import { Scale } from "lucide-react";

export const metadata: Metadata = {
  title: "Jurídico - BV Garantia BI",
};

export default function JuridicoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Jurídico</h1>
        <p className="text-sm text-gray-500 mt-1">Visão geral da carteira jurídica e recuperação</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Encargos" 
          value="R$ 485.200" 
          iconNode={<Scale size={20} />} 
          trend="up" 
          trendValue="4.2%"
          colorClass="text-brand-primary bg-brand-primary/10" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PosicaoAtualCarteiraChart />
        <RecuperacaoCarteiraChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CarteiraSaldoChart />
        <ComparativoCarteiraChart />
      </div>
    </div>
  );
}
