"use client";

import React from "react";
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Cell
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, DollarSign, AlertCircle, FileText, CalendarClock } from "lucide-react";

// Mock Data
const recebimentoData = [
  { data: '01/05', valor: 45000 },
  { data: '05/05', valor: 52000 },
  { data: '10/05', valor: 48000 },
  { data: '15/05', valor: 61000 },
  { data: '20/05', valor: 59000 },
  { data: '25/05', valor: 75000 },
  { data: '30/05', valor: 82000 },
];

const faturamentoData = [
  { periodo: 'Jan', valor: 120000, crescimento: 5 },
  { periodo: 'Fev', valor: 135000, crescimento: 12.5 },
  { periodo: 'Mar', valor: 130000, crescimento: -3.7 },
  { periodo: 'Abr', valor: 155000, crescimento: 19.2 },
  { periodo: 'Mai', valor: 178000, crescimento: 14.8 },
  { periodo: 'Jun', valor: 195000, crescimento: 9.5 },
];

const ganhosTotaisData = [
  { periodo: 'Jan', valor: 25000 },
  { periodo: 'Fev', valor: 28000 },
  { periodo: 'Mar', valor: 26000 },
  { periodo: 'Abr', valor: 35000 },
  { periodo: 'Mai', valor: 42000 },
  { periodo: 'Jun', valor: 48000 },
];

const receitasVariaveisData = [
  { periodo: 'Jan', multa: 20, juros: 30, correcao: 15, encargos: 25, txBoleto: 10 },
  { periodo: 'Fev', multa: 25, juros: 25, correcao: 20, encargos: 20, txBoleto: 10 },
  { periodo: 'Mar', multa: 15, juros: 35, correcao: 10, encargos: 30, txBoleto: 10 },
  { periodo: 'Abr', multa: 30, juros: 20, correcao: 25, encargos: 15, txBoleto: 10 },
  { periodo: 'Mai', multa: 22, juros: 28, correcao: 18, encargos: 22, txBoleto: 10 },
];

// Reusable Card Component
export function StatCard({ title, value, iconNode, trend, trendValue, colorClass = "text-brand-primary", onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-gray-500 font-medium text-sm">{title}</h3>
        <div className={`p-2 rounded-lg bg-gray-50 ${colorClass}`}>
          {iconNode}
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-2">{value}</div>
      {trend && (
        <div className={`flex items-center text-xs font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {trend === 'up' ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
          <span>{trendValue}</span>
          <span className="text-gray-400 ml-2 font-normal">vs mês anterior</span>
        </div>
      )}
    </div>
  );
}

// Chart Components
export function ChartCard({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-gray-900 font-semibold mb-6">{title}</h3>
      <div className="h-72 w-full">
        {children}
      </div>
    </div>
  );
}

export function RecebimentoChart({ data }: { data?: { data: string; valor: number }[] }) {
  const chartData = data && data.length > 0 ? data : recebimentoData;
  return (
    <ChartCard title="Recebimento">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis dataKey="data" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} dy={10} />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{fill: '#888', fontSize: 12}}
            tickFormatter={(value) => `R$ ${(Number(value) / 1000)}k`}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, 'Recebimento']}
          />
          <Bar dataKey="valor" fill="#fed7aa" radius={[4, 4, 0, 0]} barSize={40} />
          <Line 
            type="monotone" 
            dataKey="valor" 
            stroke="#de8531" 
            strokeWidth={3} 
            dot={{ fill: '#de8531', strokeWidth: 2, r: 4 }} 
            activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function FaturamentoChart({ data }: { data?: { periodo: string; valor: number; crescimento: number }[] }) {
  const chartData = data && data.length > 0 ? data : faturamentoData;
  return (
    <ChartCard title="Faturamento & Crescimento">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis dataKey="periodo" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} dy={10} />
          <YAxis 
            yAxisId="left"
            axisLine={false} 
            tickLine={false} 
            tick={{fill: '#888', fontSize: 12}}
            tickFormatter={(value) => `R$ ${(Number(value) / 1000)}k`}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            axisLine={false} 
            tickLine={false} 
            tick={{fill: '#888', fontSize: 12}}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value, name) => {
              if (name === 'valor') return [`R$ ${Number(value).toLocaleString('pt-BR')}`, 'Faturamento'];
              return [`${value}%`, 'Crescimento'];
            }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Bar yAxisId="left" dataKey="valor" fill="#bfe0c0" radius={[4, 4, 0, 0]} barSize={40} name="Faturamento" />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="crescimento" 
            stroke="#de8531" 
            strokeWidth={2} 
            name="Crescimento (%)"
            dot={{ fill: '#de8531', r: 3 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function GanhosTotaisChart() {
  return (
    <ChartCard title="Ganhos Totais">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={ganhosTotaisData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis dataKey="periodo" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} dy={10} />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{fill: '#888', fontSize: 12}}
            tickFormatter={(value) => `R$ ${(Number(value) / 1000)}k`}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, 'Ganhos']}
            cursor={{ fill: 'rgba(222, 133, 49, 0.05)' }}
          />
          <Bar dataKey="valor" fill="#de8531" radius={[4, 4, 0, 0]} barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function ReceitasVariaveisChart() {
  // Azul = multa, laranja = juros, verde escuro = correção, azul claro = encargos, roxo = tx boleto
  const colors = {
    multa: "#3b82f6",     // Azul
    juros: "#f97316",     // Laranja
    correcao: "#15803d",  // Verde escuro
    encargos: "#38bdf8",  // Azul claro
    txBoleto: "#8b5cf6"   // Roxo
  };

  return (
    <ChartCard title="Receitas Variáveis (%)">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={receitasVariaveisData} layout="vertical" stackOffset="expand" margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
          <XAxis type="number" hide />
          <YAxis 
            dataKey="periodo" 
            type="category" 
            axisLine={false} 
            tickLine={false} 
            tick={{fill: '#888', fontSize: 12}}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value) => [`${value}%`]}
          />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          <Bar dataKey="multa" stackId="a" fill={colors.multa} name="Multa" radius={[0, 0, 0, 0]} />
          <Bar dataKey="juros" stackId="a" fill={colors.juros} name="Juros" />
          <Bar dataKey="correcao" stackId="a" fill={colors.correcao} name="Correção" />
          <Bar dataKey="encargos" stackId="a" fill={colors.encargos} name="Encargos" />
          <Bar dataKey="txBoleto" stackId="a" fill={colors.txBoleto} name="Tx Boleto" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
