"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Briefcase, 
  PieChart, 
  Users, 
  Scale,
  Menu,
  X,
  LogOut,
  RefreshCcw,
  Search,
  FilterX,
  Settings
} from "lucide-react";

const navItems = [
  { name: "Financeiro", href: "/", icon: LayoutDashboard },
  { name: "Diretoria", href: "/diretoria", icon: Briefcase },
  { name: "Rateio", href: "/rateio", icon: PieChart },
  { name: "RH", href: "/rh", icon: Users },
  { name: "Jurídico", href: "/juridico", icon: Scale },
  { name: "Configurações", href: "/configuracoes", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      const res = await fetch("/api/sync", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        // Refresh page to load new data
        window.location.reload();
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
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md bg-white shadow-sm border border-gray-200 text-gray-600"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-200 z-40 transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo area */}
        <div className="h-16 flex items-center px-6 border-b border-gray-100 bg-brand-primary/5">
          <div className="font-bold text-xl text-brand-primary flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-primary text-white flex items-center justify-center">
              <PieChart size={18} />
            </div>
            BI BV Garantia
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-6">
          
          {/* Navigation */}
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">Setores</div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium
                      ${isActive 
                        ? 'bg-brand-primary/10 text-brand-primary' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <item.icon size={18} className={isActive ? 'text-brand-primary' : 'text-gray-400'} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <hr className="border-gray-100" />

          {/* Filters Section */}
          <div>
            <div className="flex items-center justify-between px-2 mb-3">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Filtros Globais</div>
              <button 
                title="Limpar filtros"
                className="text-gray-400 hover:text-brand-primary transition-colors flex items-center gap-1 text-[10px] uppercase font-bold"
              >
                <FilterX size={14} />
                Limpar
              </button>
            </div>
            
            <div className="space-y-4 px-1">
              <FilterSelect label="Condomínio" placeholder="Pesquisar condomínio..." />
              <FilterSelect label="Região" placeholder="Selecione a região..." />
              <FilterSelect label="Estado" placeholder="Selecione o estado..." />
              <FilterSelect label="Município" placeholder="Selecione o município..." />
              <FilterSelect label="Data" placeholder="Selecione a data..." type="date" />
              <FilterSelect label="Período" placeholder="Selecione o período..." />
              <FilterSelect label="Advogado" placeholder="Pesquisar advogado..." />
              <FilterSelect label="Índice de CM" placeholder="Selecione o índice..." />
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 space-y-3">
          <button 
            onClick={handleSync}
            disabled={isSyncing}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-brand-secondary text-brand-secondary-foreground font-medium text-sm rounded-lg hover:brightness-95 transition-all disabled:opacity-50"
          >
            <RefreshCcw size={16} className={isSyncing ? "animate-spin" : ""} />
            {isSyncing ? "Sincronizando..." : "Sincronizar API"}
          </button>
          
          <Link href="/login" className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium text-sm rounded-lg hover:bg-gray-50 transition-all">
            <LogOut size={16} />
            Sair
          </Link>
        </div>
      </aside>
    </>
  );
}

// Simple filter component
function FilterSelect({ label, placeholder, type = "text" }: { label: string, placeholder: string, type?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-gray-700 ml-1">{label}</label>
      <div className="relative">
        {type === "text" && (
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
            <Search size={14} className="text-gray-400" />
          </div>
        )}
        <input 
          type={type}
          placeholder={placeholder}
          className={`w-full text-sm bg-white border border-gray-200 rounded-md py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-colors ${type === 'text' ? 'pl-8 pr-3' : 'px-3'}`}
        />
      </div>
    </div>
  );
}
