"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { 
  LayoutDashboard, 
  Briefcase, 
  PieChart, 
  Users, 
  Scale,
  Menu,
  X,
  LogOut,
  Search,
  FilterX,
  Settings,
  Filter
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [condominios, setCondominios] = useState<{value: number, label: string}[]>([]);

  // Filter States
  const [filters, setFilters] = useState({
    condominio: searchParams.get("condominio") || "",
    regiao: searchParams.get("regiao") || "",
    estado: searchParams.get("estado") || "",
    dataInicio: searchParams.get("dataInicio") || "",
    dataFim: searchParams.get("dataFim") || "",
    periodo: searchParams.get("periodo") || ""
  });

  useEffect(() => {
    async function fetchCondominios() {
      try {
        const res = await fetch("/api/condominios");
        const data = await res.json();
        if (data.success) {
          setCondominios(data.data.map((c: any) => ({
            value: c.idImovel,
            label: c.nomeFantasia ? `${c.idImovel} - ${c.nomeFantasia}` : `Condomínio ${c.idImovel}`
          })));
        }
      } catch (error) {
        console.error("Erro ao buscar condominios", error);
      }
    }
    fetchCondominios();
  }, []);

  const handleClearFilters = () => {
    setFilters({
      condominio: "",
      regiao: "",
      estado: "",
      dataInicio: "",
      dataFim: "",
      periodo: ""
    });
    router.push(pathname);
  };

  const updateUrl = (newFilters: Partial<typeof filters>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleApplyFilters = () => {
    updateUrl(filters);
    if (window.innerWidth < 1024) setIsOpen(false); // fecha sidebar no mobile
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
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleClearFilters}
                  title="Limpar filtros"
                  className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 text-[10px] uppercase font-bold"
                >
                  <FilterX size={14} />
                  Limpar
                </button>
                <button 
                  onClick={handleApplyFilters}
                  title="Aplicar filtros"
                  className="text-brand-primary hover:text-brand-primary/80 transition-colors flex items-center gap-1 text-[10px] uppercase font-bold"
                >
                  <Filter size={14} />
                  Filtrar
                </button>
              </div>
            </div>
            
            <div className="space-y-4 px-1 pb-4">
              <SearchableSelect 
                label="Condomínio" 
                placeholder="Pesquisar condomínio..." 
                options={condominios} 
                value={filters.condominio}
                onChange={(val) => {
                  setFilters(prev => ({...prev, condominio: val}));
                  updateUrl({ condominio: val });
                }}
              />
              <DropdownFilter 
                label="Região" 
                placeholder="Selecione a região" 
                options={["Sul", "Sudeste", "Centro-Oeste", "Nordeste", "Norte"]} 
                value={filters.regiao} 
                onChange={(val) => {
                  setFilters(prev => ({...prev, regiao: val}));
                  updateUrl({ regiao: val });
                }} 
              />
              <DropdownFilter 
                label="Estado" 
                placeholder="Selecione o estado" 
                options={["AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA", "MG", "MS", "MT", "PA", "PB", "PE", "PI", "PR", "RJ", "RN", "RO", "RR", "RS", "SC", "SE", "SP", "TO"]} 
                value={filters.estado} 
                onChange={(val) => {
                  setFilters(prev => ({...prev, estado: val}));
                  updateUrl({ estado: val });
                }} 
              />
              <FilterSelect 
                label="Data de Início" 
                placeholder="Selecione a data inicial..." 
                type="date" 
                value={filters.dataInicio}
                disabled={!!filters.periodo} 
                onChange={(e) => {
                  setFilters(prev => ({...prev, dataInicio: e.target.value}));
                  updateUrl({ dataInicio: e.target.value });
                }} 
              />
              <FilterSelect 
                label="Data de Fim" 
                placeholder="Selecione a data final..." 
                type="date" 
                value={filters.dataFim} 
                disabled={!!filters.periodo} 
                onChange={(e) => {
                  setFilters(prev => ({...prev, dataFim: e.target.value}));
                  updateUrl({ dataFim: e.target.value });
                }} 
              />
              <DropdownFilter 
                label="Período (Mês)" 
                placeholder="Selecione o mês" 
                options={["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]} 
                value={filters.periodo} 
                disabled={!!filters.dataInicio || !!filters.dataFim}
                onChange={(val) => {
                  setFilters(prev => ({...prev, periodo: val}));
                  updateUrl({ periodo: val });
                }} 
              />
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 space-y-3">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium text-sm rounded-lg hover:bg-gray-50 transition-all">
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </aside>
    </>
  );
}

// Simple filter component for text/date
function FilterSelect({ label, placeholder, type = "text", value, onChange, disabled }: { label: string, placeholder: string, type?: string, value?: string, onChange?: (e: any) => void, disabled?: boolean }) {
  return (
    <div className={`space-y-1.5 ${disabled ? 'opacity-50' : ''}`}>
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
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full text-sm border border-gray-200 rounded-md py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-colors ${type === 'text' ? 'pl-8 pr-3' : 'px-3'} ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
        />
      </div>
    </div>
  );
}

// Generic Dropdown filter component
function DropdownFilter({ label, placeholder, options, value, onChange, disabled }: { label: string, placeholder: string, options: string[], value: string, onChange: (val: string) => void, disabled?: boolean }) {
  return (
    <div className={`space-y-1.5 ${disabled ? 'opacity-50' : ''}`}>
      <label className="text-xs font-medium text-gray-700 ml-1">{label}</label>
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-colors appearance-none ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
      >
        <option value="">{placeholder}</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

// Custom Searchable Select for Condominios
function SearchableSelect({ label, placeholder, options, value, onChange }: { label: string, placeholder: string, options: { value: string | number, label: string }[], value: string, onChange: (val: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt => opt.label.toLowerCase().includes(search.toLowerCase()));
  const selectedLabel = options.find(opt => opt.value.toString() === value)?.label || "";

  return (
    <div className="space-y-1.5 relative" ref={wrapperRef}>
      <label className="text-xs font-medium text-gray-700 ml-1">{label}</label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-sm bg-white border border-gray-200 rounded-md py-1.5 px-3 flex items-center justify-between cursor-pointer hover:border-brand-primary/50 transition-colors"
      >
        <span className={selectedLabel ? "text-gray-900 truncate" : "text-gray-400"}>
          {selectedLabel || placeholder}
        </span>
        <div className="border-l border-gray-200 pl-2 ml-2 flex items-center justify-center">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden">
          <div className="p-2 border-b border-gray-100 sticky top-0 bg-white">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <Search size={14} className="text-gray-400" />
              </div>
              <input 
                type="text"
                autoFocus
                className="w-full text-sm bg-gray-50 border-none rounded-md py-1.5 pl-8 pr-3 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                placeholder="Buscar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <ul className="max-h-48 overflow-y-auto py-1">
            <li 
              className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 ${!value ? 'bg-brand-primary/5 text-brand-primary font-medium' : 'text-gray-700'}`}
              onClick={() => { onChange(""); setIsOpen(false); setSearch(""); }}
            >
              Todos (Limpar)
            </li>
            {filteredOptions.length > 0 ? (
              filteredOptions.map(opt => (
                <li 
                  key={opt.value}
                  className={`px-3 py-2 text-sm cursor-pointer hover:bg-brand-primary/10 transition-colors ${value === opt.value.toString() ? 'bg-brand-primary/5 text-brand-primary font-medium' : 'text-gray-700'}`}
                  onClick={() => { onChange(opt.value.toString()); setIsOpen(false); setSearch(""); }}
                >
                  {opt.label}
                </li>
              ))
            ) : (
              <li className="px-3 py-3 text-sm text-gray-400 text-center">Nenhum resultado</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
