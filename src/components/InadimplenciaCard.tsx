"use client";

import React, { useState } from "react";
import { StatCard } from "./DashboardComponents";
import { AlertCircle, X } from "lucide-react";

export function InadimplenciaCard({ inadimplenciaFormatada, trend, trendValue, detalhes }: any) {
  const [isOpen, setIsOpen] = useState(false);

  // Separar os que vieram (valor != 0) e zerados (valor == 0)
  const importados = detalhes?.filter((d: any) => d.valor !== 0) || [];
  const zerados = detalhes?.filter((d: any) => d.valor === 0) || [];

  return (
    <>
      <StatCard
        title="Inadimplência"
        value={inadimplenciaFormatada}
        iconNode={<AlertCircle size={20} />}
        trend={trend}
        trendValue={trendValue}
        colorClass="text-red-500 bg-red-50"
        onClick={() => setIsOpen(true)}
      />

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Detalhes da Inadimplência</h2>
                <p className="text-sm text-gray-500 mt-1">Dados importados por condomínio</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Com valor */}
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center justify-between">
                    <span>Importados com Valor</span>
                    <span className="bg-brand-primary/10 text-brand-primary px-2 py-1 rounded-md text-xs">{importados.length}</span>
                  </h3>
                  <div className="space-y-3">
                    {importados.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">Nenhum condomínio com valor.</p>
                    ) : (
                      importados.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg border border-gray-50 transition-colors">
                          <span className="text-sm font-medium text-gray-700 truncate mr-2" title={item.condominio}>
                            {item.condominio}
                          </span>
                          <span className="text-sm font-bold text-red-600 whitespace-nowrap">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor)}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Zerados */}
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center justify-between">
                    <span>Zerados</span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs">{zerados.length}</span>
                  </h3>
                  <div className="space-y-3">
                    {zerados.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">Nenhum condomínio zerado.</p>
                    ) : (
                      zerados.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg border border-gray-50 transition-colors">
                          <span className="text-sm font-medium text-gray-700 truncate" title={item.condominio}>
                            {item.condominio}
                          </span>
                          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-md">Zerado</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            </div>
            
            <div className="p-4 border-t border-gray-100 flex justify-end bg-white">
              <button 
                onClick={() => setIsOpen(false)}
                className="px-6 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
