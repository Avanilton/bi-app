"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Settings, UserPlus, Save, RefreshCcw, Database, FileSpreadsheet, CheckCircle, XCircle, Clock } from "lucide-react";

type PlanilhasStatus = "idle" | "running" | "done" | "error";

interface PlanilhasDados {
  inadimplencia: number;
  juridiconaopago: number;
  amigavelnaopago: number;
  abertosSemAcordo: number;
  updatedAt: string;
}

function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

export default function ConfiguracoesPage() {
  const [isSyncing, setIsSyncing] = useState(false);

  // ── Atualizar Planilhas ─────────────────────────────────────────────────
  const [planilhasStatus, setPlanilhasStatus] = useState<PlanilhasStatus>("idle");
  const [planilhasDados, setPlanilhasDados] = useState<PlanilhasDados | null>(null);
  const [planilhasLog, setPlanilhasLog] = useState<string>("");
  const [planilhasUpdatedAt, setPlanilhasUpdatedAt] = useState<string | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const logEndRef = useRef<HTMLDivElement | null>(null);

  const fetchPlanilhasStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/planilhas-status");
      const json = await res.json();
      if (json.dados) setPlanilhasDados(json.dados);
      if (json.updatedAt) setPlanilhasUpdatedAt(json.updatedAt);
    } catch {
      // silently ignore errors
    }
  }, []);

  // Carrega status inicial ao montar
  useEffect(() => {
    fetchPlanilhasStatus();
  }, [fetchPlanilhasStatus]);

  const handleAtualizarPlanilhas = async () => {
    try {
      setPlanilhasStatus("running");

      const res = await fetch("/api/atualizar-planilhas", { method: "POST" });
      const data = await res.json();

      if (!data.success) {
        setPlanilhasStatus("error");
        return;
      }

      setPlanilhasStatus("done");
      setPlanilhasDados(data.dados);
      setPlanilhasUpdatedAt(data.dados.updatedAt);
      
      // Volta para idle depois de 3 segundos para permitir nova leitura
      setTimeout(() => setPlanilhasStatus("idle"), 3000);
    } catch (error) {
      setPlanilhasStatus("error");
    }
  };
  // ────────────────────────────────────────────────────────────────────────

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
        </div>

        {/* Atualizar Planilhas (Bot PDF) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FileSpreadsheet style={{ color: '#059669' }} size={24} />
              <div>
                <h2 className="text-xl font-bold text-gray-900">Atualizar Planilhas</h2>
                <p className="text-sm text-gray-500">
                  Bot extrai PDFs do sistema Novacorp e atualiza automaticamente os indicadores do dashboard.
                </p>
              </div>
            </div>

            {/* Badge de status */}
            {planilhasStatus === "running" && (
              <span style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', borderColor: '#bfdbfe' }} className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border">
                <RefreshCcw size={12} className="animate-spin" /> Executando...
              </span>
            )}
            {planilhasStatus === "done" && (
              <span style={{ backgroundColor: '#ecfdf5', color: '#065f46', borderColor: '#a7f3d0' }} className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border">
                <CheckCircle size={12} /> Concluído
              </span>
            )}
            {planilhasStatus === "error" && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-full border border-red-200">
                <XCircle size={12} /> Erro
              </span>
            )}
          </div>

          {/* Linha separadora */}
          <div className="border-t border-gray-100 my-4" />

          {/* Última atualização + Valores extraídos */}
          {planilhasDados && (
            <div className="mb-5">
              {planilhasUpdatedAt && (
                <p className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
                  <Clock size={12} />
                  Última atualização: <span className="font-medium text-gray-600">{formatDateTime(planilhasUpdatedAt)}</span>
                </p>
              )}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { label: "Inadimplência", value: planilhasDados.inadimplencia, bg: '#fef2f2', color: '#b91c1c', border: '#fecaca' },
                  { label: "Jurídicos não pagos", value: planilhasDados.juridiconaopago, bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' },
                  { label: "Amigável não pagos", value: planilhasDados.amigavelnaopago, bg: '#fefce8', color: '#a16207', border: '#fde68a' },
                  { label: "Abertos S/ Acordo", value: planilhasDados.abertosSemAcordo, bg: '#fdf6ee', color: '#de8531', border: '#f5cfa0' },
                ].map((item) => (
                  <div key={item.label} style={{ backgroundColor: item.bg, color: item.color, borderColor: item.border }} className="p-3 rounded-xl border">
                    <p className="text-xs font-medium opacity-80">{item.label}</p>
                    <p className="text-base font-bold mt-0.5">{formatBRL(item.value)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botões */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleAtualizarPlanilhas}
              disabled={planilhasStatus === "running"}
              style={{ backgroundColor: '#059669', color: '#fff' }}
              className="flex items-center justify-center gap-2 px-6 py-3 font-medium text-sm rounded-lg transition-all disabled:opacity-50 shadow-md hover:opacity-90"
            >
              <FileSpreadsheet size={18} className={planilhasStatus === "running" ? "animate-pulse" : ""} />
              {planilhasStatus === "running" ? "Lendo PDFs da pasta..." : "Ler PDFs da pasta planilhas"}
            </button>
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
