"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Settings, UserPlus, Save, RefreshCcw, Database, FileSpreadsheet, CheckCircle, XCircle, Clock } from "lucide-react";

type PlanilhasStatus = "idle" | "running" | "done" | "error";

function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}


export default function ConfiguracoesPage() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [automationStatus, setAutomationStatus] = useState<any>(null);
  const [isStarting, setIsStarting] = useState(false);
  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/automation/status");
      const data = await res.json();
      setAutomationStatus(data);
    } catch (e) {
      console.error(e);
    }
  };

  const [isLocalhost, setIsLocalhost] = useState(true);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 2000);
    if (typeof window !== "undefined") {
      setIsLocalhost(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    }
    return () => clearInterval(interval);
  }, []);

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      const res = await fetch("/api/sync", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
      } else {
        alert("Erro na sincronização.");
      }
    } catch (error) {
      alert("Erro de conexão ao sincronizar.");
    } finally {
      setIsSyncing(false);
    }
  };
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-xl">
            <Settings size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Configurações do Sistema</h1>
            <p className="text-sm text-gray-500">Gerencie configurações globais, usuários e sincronizações do sistema.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Sync Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <Database className="text-brand-primary" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Sincronização de Dados</h2>
          </div>
          <p className="text-sm text-gray-500 mb-6">Sincronize a base de dados local com a API da Novacorp. Para grandes volumes (milhões de registros de boletos), utilize o worker via terminal.</p>
          
          <button 
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-primary text-white font-medium text-sm rounded-lg hover:bg-brand-primary/90 transition-all disabled:opacity-50 shadow-md shadow-brand-primary/20"
          >
            <RefreshCcw size={18} className={isSyncing ? "animate-spin" : ""} />
            {isSyncing ? "Sincronizando Base de Dados..." : "Sincronizar API (Limitações Aplicadas)"}
          </button>
          
          <div className="mt-6 border-t pt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Clock size={20} className="text-brand-primary"/> 
              Automação de Inadimplência
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              O robô (Playwright) acessará o sistema da Novacorp, fará os filtros de todos os condomínios para ontem (D-1), e atualizará o Card de Inadimplência. O processo pode demorar alguns minutos.
            </p>
            
            {!isLocalhost && (
              <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <p className="text-sm text-yellow-700">
                  <strong>Atenção:</strong> A automação do robô exige a abertura de um navegador. Por limitações de servidor (Serverless), este recurso foi <strong>desativado no ambiente online da Vercel</strong>. Para atualizar a inadimplência diária, rode o projeto no seu computador (<i>localhost</i>). Ele enviará os dados para a nuvem automaticamente ao terminar!
                </p>
              </div>
            )}
            
            {(automationStatus?.isRunning || isStarting) && (
              <div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-700">
                    {isStarting ? "Iniciando processo em segundo plano..." : automationStatus?.message || "Iniciando..."}
                  </span>
                  <span className="text-sm font-bold text-brand-primary">{automationStatus?.progress || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-brand-primary h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${automationStatus?.progress || 0}%` }}></div>
                </div>
              </div>
            )}
            
            <div className="flex gap-4">
              <button 
                onClick={async () => {
                  try {
                    setIsStarting(true);
                    await fetch("/api/automation/run", { method: "POST" });
                    setTimeout(() => setIsStarting(false), 8000);
                    fetchStatus();
                  } catch (e) {
                    console.error(e);
                    setIsStarting(false);
                  }
                }}
                disabled={!isLocalhost || automationStatus?.isRunning || isStarting}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium text-sm rounded-lg hover:bg-gray-800 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCcw size={18} className={(automationStatus?.isRunning || isStarting) ? "animate-spin" : ""} />
                {(automationStatus?.isRunning || isStarting) ? "Automação em Andamento..." : "Rodar Automação Manualmente"}
              </button>

              {(automationStatus?.isRunning || isStarting) && (
                <button 
                  onClick={async () => {
                    try {
                      await fetch("/api/automation/cancel", { method: "POST" });
                      alert("Solicitação de cancelamento enviada! O robô vai parar na próxima etapa.");
                      fetchStatus();
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-600 font-medium text-sm rounded-lg hover:bg-red-100 transition-all border border-red-200"
                >
                  <XCircle size={18} />
                  Cancelar
                </button>
              )}
            </div>

            {/* Console de Logs */}
            {automationStatus?.logs && automationStatus.logs.length > 0 && (automationStatus?.isRunning || isStarting) && (
              <div className="mt-6 bg-gray-900 rounded-lg p-4 font-mono text-xs text-gray-300 h-64 overflow-y-auto shadow-inner border border-gray-800">
                <div className="flex items-center gap-2 mb-3 border-b border-gray-700 pb-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="ml-2 text-gray-400 font-sans text-sm">Terminal do Robô</span>
                </div>
                {automationStatus.logs.map((log: string, idx: number) => (
                  <div key={idx} className={`mb-1 ${log.toLowerCase().includes("erro") ? "text-red-400" : "text-green-400"}`}>
                    {log}
                  </div>
                ))}
                {automationStatus?.isError && (
                  <div className="mt-2 text-red-500 font-bold">
                    O processo foi interrompido devido a um erro.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>



        {/* User Registration Form */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <UserPlus className="text-brand-primary" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Cadastro de Usuário</h2>
          </div>
          
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                placeholder="Ex: João Silva"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input 
                type="email" 
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                placeholder="joao@empresa.com.br"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                <input 
                  type="password" 
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nível de Acesso</label>
                <select className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 bg-white">
                  <option value="admin">Administrador</option>
                  <option value="diretoria">Diretoria</option>
                  <option value="rh">Recursos Humanos</option>
                  <option value="juridico">Jurídico</option>
                  <option value="operacional">Operacional</option>
                </select>
              </div>
            </div>

            <button 
              type="button"
              className="mt-4 w-full flex items-center justify-center gap-2 py-3 px-4 bg-brand-primary hover:bg-brand-primary/90 text-white font-medium rounded-lg transition-colors shadow-md shadow-brand-primary/20"
            >
              <UserPlus size={18} />
              Cadastrar Novo Usuário
            </button>
          </form>
        </div>

        {/* Global Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="text-brand-secondary" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Configurações Gerais</h2>
          </div>
          
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL da API Externa</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                defaultValue="https://api.sistemasnovacorp.com.br"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tempo de Cache (minutos)</label>
              <input 
                type="number" 
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                defaultValue="60"
              />
            </div>

            <div className="pt-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Modo de Manutenção</p>
                <p className="text-xs text-gray-500">Impede o acesso de usuários não administradores.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
              </label>
            </div>

            <button 
              type="button"
              className="mt-6 w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors shadow-md"
            >
              <Save size={18} />
              Salvar Configurações
            </button>
          </form>
        </div>
      </div>

      {/* Users List Placeholder */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Usuários Cadastrados</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 rounded-t-lg">
              <tr>
                <th className="px-6 py-3">Nome</th>
                <th className="px-6 py-3">E-mail</th>
                <th className="px-6 py-3">Nível</th>
                <th className="px-6 py-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white border-b">
                <td className="px-6 py-4 font-medium text-gray-900">Administrador</td>
                <td className="px-6 py-4">admin@bvgarantia.com.br</td>
                <td className="px-6 py-4"><span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Admin</span></td>
                <td className="px-6 py-4 text-right">
                  <button className="text-brand-primary hover:underline">Editar</button>
                </td>
              </tr>
              <tr className="bg-white">
                <td className="px-6 py-4 font-medium text-gray-900">Diretor Financeiro</td>
                <td className="px-6 py-4">diretoria@bvgarantia.com.br</td>
                <td className="px-6 py-4"><span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Diretoria</span></td>
                <td className="px-6 py-4 text-right">
                  <button className="text-brand-primary hover:underline">Editar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
