import { Metadata } from "next";
import { RateioBrutoChart } from "@/components/DashboardComponents2";

export const metadata: Metadata = {
  title: "Rateio - BV Garantia BI",
};

export default function RateioPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Rateio</h1>
        <p className="text-sm text-gray-500 mt-1">Análise de indicadores de rateio</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RateioBrutoChart />
      </div>
    </div>
  );
}
