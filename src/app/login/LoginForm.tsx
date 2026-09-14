"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error("Non-JSON response from server:", text);
        throw new Error(`O servidor retornou um erro inesperado (HTML). Possível falha no Cloudflare Workers ou banco de dados.`);
      }

      if (!res.ok) {
        throw new Error(data.error || "Erro ao realizar login");
      }

      window.location.href = "/configuracoes";
    } catch (err: any) {
      setError(err.message || "Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100">
          {error}
        </div>
      )}
      
      <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-gray-700">E-mail corporativo</label>
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary focus:bg-white transition-all duration-200"
          placeholder="seu.nome@bvgarantia.com.br"
          required
        />
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-semibold text-gray-700">Senha</label>
          <a href="#" className="text-xs font-semibold text-brand-primary hover:text-brand-primary/80 transition-colors">Esqueceu a senha?</a>
        </div>
        <input 
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary focus:bg-white transition-all duration-200"
          placeholder="••••••••"
          required
        />
      </div>
      
      <div className="pt-2">
        <button 
          type="submit"
          disabled={loading}
          className="w-full py-4 px-4 bg-brand-primary hover:bg-brand-primary/95 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-brand-primary/30 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <LogIn size={20} />
          )}
          {loading ? "Entrando..." : "Entrar na Plataforma"}
        </button>
      </div>
    </form>
  );
}
