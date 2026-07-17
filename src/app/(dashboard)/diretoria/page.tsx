import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Diretoria - BV Garantia BI",
};

export default function DiretoriaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Diretoria</h1>
        <p className="text-sm text-gray-500 mt-1">Visão executiva e resultados gerais</p>
      </div>
      
      <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Painel Executivo em Desenvolvimento</h2>
        <p className="text-gray-500 max-w-md">Os indicadores da Diretoria serão disponibilizados nas próximas atualizações do dashboard.</p>
      </div>
    </div>
  );
}
