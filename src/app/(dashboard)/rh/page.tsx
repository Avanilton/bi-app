import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recursos Humanos - BV Garantia BI",
};

export default function RHPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Recursos Humanos</h1>
        <p className="text-sm text-gray-500 mt-1">Indicadores do departamento de RH</p>
      </div>
      
      <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Painel em Desenvolvimento</h2>
        <p className="text-gray-500 max-w-md">Os indicadores de Recursos Humanos serão disponibilizados nas próximas atualizações do dashboard.</p>
      </div>
    </div>
  );
}
