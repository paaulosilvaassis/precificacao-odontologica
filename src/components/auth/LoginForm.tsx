"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/lib/auth";

interface LoginFormProps {
  onSuccess: () => void;
  onSwitchToSignUp: () => void;
  onSwitchToForgotPassword: () => void;
}

export function LoginForm({ onSuccess, onSwitchToSignUp, onSwitchToForgotPassword }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await authService.login(email, password);
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  // 🔑 ACESSO ADMIN MASTER (SEM LOGIN)
  const handleCreatorAccess = () => {
    // Definir flags de Admin Master
    localStorage.setItem("bestPriceAdminMaster", "true");
    
    // Criar sessão de autenticação especial para o criador
    const creatorAuthData = {
      user: {
        id: "admin_master",
        name: "Admin Master",
        email: "admin@bestpriceodonto.com",
      },
      token: `admin_master_${Date.now()}`,
    };
    localStorage.setItem("bestPriceAuth", JSON.stringify(creatorAuthData));
    
    // Redirecionar para dashboard
    onSuccess();
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          Best Price Odonto
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          O preço certo começa pelo custo real.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            <p className="font-medium mb-1">{error}</p>
            <p className="text-xs">
              Verifique seus dados ou use o acesso do criador abaixo.
            </p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700">
            E-mail
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-700">
            Senha
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="pl-10 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          disabled={isLoading}
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>

        {/* 🔑 BOTÃO ADMIN MASTER - ACESSO DIRETO DO CRIADOR */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">ou</span>
          </div>
        </div>

        <Button
          type="button"
          onClick={handleCreatorAccess}
          variant="outline"
          className="w-full border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-amber-900 font-semibold gap-2 shadow-md hover:shadow-lg transition-all"
        >
          <Shield className="w-5 h-5" />
          Entrar como Criador
        </Button>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
          <p className="font-medium mb-1">🔓 Acesso Especial do Criador</p>
          <p>
            Este botão permite acesso direto ao sistema sem necessidade de login. 
            Use apenas se você é o criador do aplicativo.
          </p>
        </div>

        <div className="text-center space-y-3">
          <button
            type="button"
            onClick={onSwitchToForgotPassword}
            className="text-sm text-purple-600 hover:text-purple-700 hover:underline"
          >
            Esqueci minha senha
          </button>

          <div className="text-sm text-gray-600">
            Não tem uma conta?{" "}
            <button
              type="button"
              onClick={onSwitchToSignUp}
              className="text-purple-600 hover:text-purple-700 font-medium hover:underline"
            >
              Criar conta
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
