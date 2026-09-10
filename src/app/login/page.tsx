import { Metadata } from "next";
import Link from "next/link";
import { LogIn, BarChart3, TrendingUp, ShieldCheck, PieChart } from "lucide-react";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "BI BVGarantia - Login",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Panel - Landing Page Info */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 bg-gradient-to-br from-brand-primary via-[#0f2a4a] to-gray-900 text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-secondary/20 blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/20 blur-[100px]"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 font-bold text-2xl tracking-tight mb-16">
            <div className="w-10 h-10 rounded-xl bg-white text-brand-primary flex items-center justify-center shadow-lg">
              <PieChart size={24} />
            </div>
            BI BVGarantia
          </div>

          <div className="max-w-lg space-y-6">
            <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">
              A inteligência por trás das suas decisões.
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed">
              Plataforma exclusiva de Business Intelligence para gestão financeira integrada. Acesse seus indicadores do Dashboard em tempo real.
            </p>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-6 mt-16 max-w-lg">
          <div className="bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex items-start gap-4">
            <div className="p-2 bg-brand-secondary/20 rounded-lg text-brand-secondary">
              <BarChart3 size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-white">Análise de Dados</h3>
              <p className="text-xs text-gray-300 mt-1">Visualize todos os dados em tempo real.</p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex items-start gap-4">
            <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
              <TrendingUp size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-white">Alta Performance</h3>
              <p className="text-xs text-gray-300 mt-1">Dashboard otimizado para milhões de registros.</p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex items-start gap-4 col-span-2">
            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-white">Ambiente Seguro</h3>
              <p className="text-xs text-gray-300 mt-1">Acesso restrito e criptografado para garantir a confidencialidade das informações da sua empresa.</p>
            </div>
          </div>
        </div>
        
        <div className="relative z-10 mt-12 text-sm text-gray-400 font-medium">
          &copy; {new Date().getFullYear()} Grupo BV Garantia. Todos os direitos reservados.
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50/50">
        <div className="max-w-md w-full">
          {/* Mobile Logo */}
          <div className="md:hidden flex items-center justify-center gap-3 font-bold text-2xl text-brand-primary tracking-tight mb-12">
            <div className="w-10 h-10 rounded-xl bg-brand-primary text-white flex items-center justify-center shadow-lg">
              <PieChart size={24} />
            </div>
            BI BVGarantia
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 sm:p-10 border border-gray-100">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Acesse sua conta</h2>
              <p className="text-sm text-gray-500">
                Insira suas credenciais corporativas para acessar o dashboard de métricas.
              </p>
            </div>
            
            <LoginForm />
            
            <div className="mt-8 pt-8 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500">
                Acesso restrito a colaboradores autorizados.<br/>
                Para solicitar acesso, entre em contato com o <span className="font-semibold text-gray-700">Administrador</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
