"use client";

import React from "react";
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart 
} from 'recharts';
import { ChartCard } from "./DashboardComponents";

const rateioData = [
  { periodo: 'Jan', valor: 85000 },
  { periodo: 'Fev', valor: 92000 },
  { periodo: 'Mar', valor: 88000 },
  { periodo: 'Abr', valor: 95000 },
  { periodo: 'Mai', valor: 110000 },
  { periodo: 'Jun', valor: 105000 },
];

const posAtualCarteiraData = [
  { categoria: 'Amigável', valor: 1500000, percentual: 65 },
  { categoria: 'Jurídica', valor: 800000, percentual: 35 },
];

const recuperacaoCarteiraData = [
  { periodo: 'Jan', valorAnterior: 45000, pctTTV: 15, pctCarteira: 8 },
  { periodo: 'Fev', valorAnterior: 52000, pctTTV: 18, pctCarteira: 9 },
  { periodo: 'Mar', valorAnterior: 48000, pctTTV: 16, pctCarteira: 8.5 },
  { periodo: 'Abr', valorAnterior: 61000, pctTTV: 22, pctCarteira: 11 },
  { periodo: 'Mai', valorAnterior: 59000, pctTTV: 20, pctCarteira: 10.5 },
];

const carteiraSaldoData = [
  { dias: '30 Dias', valor: 350000, pctJuridico: 10 },
  { dias: '60 Dias', valor: 280000, pctJuridico: 25 },
  { dias: '90 Dias', valor: 220000, pctJuridico: 45 },
  { dias: '120+ Dias', valor: 450000, pctJuridico: 80 },
];

const comparativoCarteiraData = [
  { periodo: 'Jan', atual: 1200000, anterior: 1100000 },
  { periodo: 'Fev', atual: 1150000, anterior: 1050000 },
  { periodo: 'Mar', atual: 1250000, anterior: 1120000 },
  { periodo: 'Abr', atual: 1300000, anterior: 1200000 },
  { periodo: 'Mai', atual: 1280000, anterior: 1180000 },
];

export function RateioBrutoChart({ data = rateioData }: { data?: { periodo: string, valor: number }[] }) {
  return (
    <ChartCard title="Rateio Bruto">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis dataKey="periodo" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} dy={10} />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{fill: '#888', fontSize: 12}}
            tickFormatter={(value) => `R$ ${(value / 1000)}k`}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, 'Rateio']}
            cursor={{ fill: 'rgba(222, 133, 49, 0.05)' }}
          />
          <Bar dataKey="valor" fill="#de8531" radius={[4, 4, 0, 0]} barSize={50} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// Custom tooltip for Posição Atual that shows %
const PosAtualTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-100 shadow-md rounded-lg">
        <p className="font-semibold text-gray-900 mb-1">{label}</p>
        <p className="text-brand-primary">Valor: R$ {data.valor.toLocaleString('pt-BR')}</p>
        <p className="text-gray-500 font-medium">Percentual: {data.percentual}%</p>
      </div>
    );
  }
  return null;
};

export function PosicaoAtualCarteiraChart({ data = posAtualCarteiraData }: { data?: { categoria: string, valor: number, percentual: number }[] }) {
  return (
    <ChartCard title="Posição Atual - Carteira">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis dataKey="categoria" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} dy={10} />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{fill: '#888', fontSize: 12}}
            tickFormatter={(value) => `R$ ${(value / 1000000)}M`}
          />
          <Tooltip content={<PosAtualTooltip />} cursor={{ fill: 'rgba(222, 133, 49, 0.05)' }} />
          <Bar dataKey="valor" fill="#bfe0c0" radius={[4, 4, 0, 0]} barSize={80}>
            {/* We could use customized label but keeping simple Tooltip for percentage for now */}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function RecuperacaoCarteiraChart({ data = recuperacaoCarteiraData }: { data?: { periodo: string, valorAnterior: number, pctTTV: number, pctCarteira: number }[] }) {
  return (
    <ChartCard title="Recuperação de Carteira">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis dataKey="periodo" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} dy={10} />
          <YAxis 
            yAxisId="left"
            axisLine={false} 
            tickLine={false} 
            tick={{fill: '#888', fontSize: 12}}
            tickFormatter={(value) => `R$ ${(value / 1000)}k`}
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
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Bar yAxisId="left" dataKey="valorAnterior" fill="#f97316" radius={[4, 4, 0, 0]} barSize={40} name="Val. Per. Anteriores (Laranja)" />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="pctTTV" 
            stroke="#8b5cf6" 
            strokeWidth={3} 
            name="% Rec TTV (Roxo)"
            dot={{ r: 4 }}
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="pctCarteira" 
            stroke="#15803d" 
            strokeWidth={3} 
            name="% Rec Cart. Nom. (Verde)"
            dot={{ r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function CarteiraSaldoChart({ data = carteiraSaldoData }: { data?: { dias: string, valor: number, pctJuridico: number }[] }) {
  return (
    <ChartCard title="Carteira - Saldo em Aberto">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis dataKey="dias" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} dy={10} />
          <YAxis 
            yAxisId="left"
            axisLine={false} 
            tickLine={false} 
            tick={{fill: '#888', fontSize: 12}}
            tickFormatter={(value) => `R$ ${(value / 1000)}k`}
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
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Bar yAxisId="left" dataKey="valor" fill="#de8531" radius={[4, 4, 0, 0]} barSize={50} name="Valor em Aberto" />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="pctJuridico" 
            stroke="#3b82f6" 
            strokeWidth={3} 
            name="% Jurídico"
            dot={{ r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function ComparativoCarteiraChart({ data = comparativoCarteiraData }: { data?: { periodo: string, atual: number, anterior: number }[] }) {
  return (
    <ChartCard title="Comparativo Carteira">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis dataKey="periodo" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} dy={10} />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{fill: '#888', fontSize: 12}}
            tickFormatter={(value) => `R$ ${(value / 1000000)}M`}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Line 
            type="monotone" 
            dataKey="atual" 
            stroke="#de8531" 
            strokeWidth={3} 
            name="Período Atual"
            dot={{ r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="anterior" 
            stroke="#bfe0c0" 
            strokeWidth={3} 
            name="Período Anterior"
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
