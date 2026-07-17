import { Metadata } from "next";
import { Settings, UserPlus, Save } from "lucide-react";

export const metadata: Metadata = {
  title: "Configurações e Usuários - BV Garantia BI",
};

export default function ConfiguracoesPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-xl">
            <Settings size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Configurações do Sistema</h1>
            <p className="text-sm text-gray-500">Gerencie configurações globais e usuários do sistema.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
