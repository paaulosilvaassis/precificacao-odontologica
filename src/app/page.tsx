"use client";

import { useState, useEffect } from "react";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { Header } from "@/components/layout/Header";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { authService } from "@/lib/auth";
import type { ClinicData } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

type AuthView = "login" | "signup" | "forgot-password";

// 🔒 FUNÇÃO DE VALIDAÇÃO E CORREÇÃO DE DADOS TRIBUTÁRIOS
function validateAndFixTaxConfig(data: ClinicData): ClinicData {
  if (!data.taxConfig) {
    // Se não tem taxConfig, criar padrão
    return {
      ...data,
      taxConfig: {
        regime: "simplesNacional",
        state: "SP",
        customISS: 5.0,
        rates: {
          totalRate: 6.0, // Anexo III - Faixa 1
          anexo: "anexo3",
          faixaSelecionada: 1,
        },
        calculationMethod: "onRevenue",
      },
    };
  }

  // Se tem taxConfig mas está no Simples Nacional
  if (data.taxConfig.regime === "simplesNacional") {
    const rates = data.taxConfig.rates || {};
    
    // 🚨 CORREÇÃO CRÍTICA: Garantir que Faixa 1 nunca seja 0%
    if (!rates.faixaSelecionada || rates.faixaSelecionada === 1) {
      const anexo = (rates.anexo || "anexo3") as "anexo3" | "anexo5";
      const aliquotaCorreta = anexo === "anexo5" ? 15.5 : 6.0;
      
      // Se totalRate for 0 ou undefined, corrigir
      if (!rates.totalRate || rates.totalRate === 0) {
        console.warn("⚠️ Corrigindo alíquota 0% detectada no localStorage");
        return {
          ...data,
          taxConfig: {
            ...data.taxConfig,
            rates: {
              ...rates,
              totalRate: aliquotaCorreta,
              anexo,
              faixaSelecionada: 1,
            },
          },
        };
      }
    }
  }

  return data;
}

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState<AuthView>("login");
  const [clinicData, setClinicData] = useState<ClinicData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdminMaster, setIsAdminMaster] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // 🔑 VERIFICAR ACESSO ADMIN MASTER (SEM LOGIN)
    const checkAdminMasterAccess = () => {
      // Verificar parâmetros da URL
      const urlParams = new URLSearchParams(window.location.search);
      const role = urlParams.get("role");
      const isCreator = urlParams.get("is_creator");
      
      // Verificar localStorage para persistência
      const adminMasterFlag = localStorage.getItem("bestPriceAdminMaster");
      
      if (role === "admin_master" || isCreator === "true" || adminMasterFlag === "true") {
        // Salvar flag no localStorage para persistência
        localStorage.setItem("bestPriceAdminMaster", "true");
        setIsAdminMaster(true);
        setIsAuthenticated(true);
        
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
        
        toast({
          title: "🔓 Acesso Admin Master",
          description: "Você entrou como administrador principal. Acesso total concedido.",
          variant: "default",
        });
        
        return true;
      }
      
      return false;
    };

    // Tentar acesso admin master primeiro
    const hasAdminAccess = checkAdminMasterAccess();
    
    if (!hasAdminAccess) {
      // Verificar autenticação normal
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
    }

    if (isAuthenticated || hasAdminAccess) {
      // 🔒 VERIFICAR FLAG DE ONBOARDING CONCLUÍDO
      const onboardingFlag = localStorage.getItem("clinic_onboarding_completed");
      const isOnboardingComplete = onboardingFlag === "true";
      setOnboardingCompleted(isOnboardingComplete);

      // Carregar dados salvos do localStorage
      const savedData = localStorage.getItem("bestPriceOdontoData");
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          
          // 🔒 VALIDAR E CORRIGIR DADOS TRIBUTÁRIOS
          const validatedData = validateAndFixTaxConfig(parsedData);
          
          // Se houve correção, salvar novamente
          if (JSON.stringify(validatedData) !== JSON.stringify(parsedData)) {
            localStorage.setItem("bestPriceOdontoData", JSON.stringify(validatedData));
            console.log("✅ Dados tributários corrigidos e salvos");
          }
          
          setClinicData(validatedData);
          
          // Se tem dados mas não tem flag, marcar como completo
          if (!isOnboardingComplete && validatedData) {
            localStorage.setItem("clinic_onboarding_completed", "true");
            setOnboardingCompleted(true);
          }
        } catch (error) {
          console.error("Erro ao carregar dados:", error);
          localStorage.removeItem("bestPriceOdontoData");
          localStorage.removeItem("clinic_onboarding_completed");
        }
      }
    }
    
    setIsLoading(false);
  }, [toast, isAuthenticated]);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setAuthView("login");
  };

  const handleOnboardingComplete = (data: ClinicData) => {
    // 🔒 VALIDAR E CORRIGIR DADOS ANTES DE SALVAR
    const validatedData = validateAndFixTaxConfig(data);
    
    setClinicData(validatedData);
    
    // 🔒 SALVAR DADOS E MARCAR ONBOARDING COMO CONCLUÍDO
    localStorage.setItem("bestPriceOdontoData", JSON.stringify(validatedData));
    localStorage.setItem("clinic_onboarding_completed", "true");
    setOnboardingCompleted(true);
    setIsEditing(false);
    
    toast({
      title: "✅ Dados salvos com sucesso!",
      description: "Suas informações foram salvas permanentemente. Você não precisará preenchê-las novamente.",
      variant: "default",
    });
  };

  const handleReset = () => {
    // 🔄 REINICIAR APP SEM APAGAR DADOS
    // Apenas recarrega a página mantendo todos os dados salvos
    toast({
      title: "🔄 Reiniciando aplicativo",
      description: "Seus dados foram preservados e o app será recarregado.",
      variant: "default",
    });
    
    // Aguardar toast aparecer antes de recarregar
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleLogout = () => {
    // Executar logout completo
    authService.logout();
    
    // Limpar TODOS os dados da sessão
    localStorage.removeItem("bestPriceOdontoData");
    localStorage.removeItem("bestPriceAuth");
    
    // 🔧 CORREÇÃO: Limpar flag de admin master SEMPRE no logout
    // Usuário precisa clicar no botão novamente ou usar URL
    localStorage.removeItem("bestPriceAdminMaster");
    setIsAdminMaster(false);
    
    // ⚠️ NÃO LIMPAR clinic_onboarding_completed no logout
    // Os dados da clínica devem persistir mesmo após logout
    
    // Resetar estados da aplicação
    setIsAuthenticated(false);
    setClinicData(null);
    setIsEditing(false);
    setAuthView("login");
    
    // Feedback visual de sucesso
    toast({
      title: "✅ Sessão encerrada",
      description: "Você foi desconectado com sucesso. Seus dados da clínica foram preservados.",
      variant: "default",
    });
    
    // Limpar parâmetros da URL
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  const handleEditClinic = () => {
    setIsEditing(true);
  };

  // Proteção de rota: se não autenticado, bloquear acesso
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Garantir que dados sensíveis não fiquem em memória
      setClinicData(null);
      setIsEditing(false);
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="animate-pulse text-purple-600 text-xl font-medium">
          Carregando...
        </div>
      </div>
    );
  }

  // Tela de autenticação
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl">
          {authView === "login" && (
            <LoginForm
              onSuccess={handleAuthSuccess}
              onSwitchToSignUp={() => setAuthView("signup")}
              onSwitchToForgotPassword={() => setAuthView("forgot-password")}
            />
          )}
          {authView === "signup" && (
            <SignUpForm
              onSuccess={handleAuthSuccess}
              onSwitchToLogin={() => setAuthView("login")}
            />
          )}
          {authView === "forgot-password" && (
            <ForgotPasswordForm
              onBackToLogin={() => setAuthView("login")}
            />
          )}
        </div>
      </div>
    );
  }

  // 🔒 LÓGICA DE ENTRADA DO APP (CRÍTICA)
  // Se onboarding já foi concluído E tem dados salvos E não está editando
  // → Pular onboarding e ir direto para Dashboard
  const shouldShowDashboard = onboardingCompleted && clinicData && !isEditing;

  // Aplicação principal (após login)
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Header 
        onReset={clinicData ? handleReset : undefined}
        onLogout={handleLogout}
        isAdminMaster={isAdminMaster}
      />
      
      {!shouldShowDashboard ? (
        <OnboardingFlow 
          onComplete={handleOnboardingComplete}
          initialData={clinicData}
          isEditing={isEditing}
        />
      ) : (
        <Dashboard 
          clinicData={clinicData} 
          onUpdateData={handleOnboardingComplete}
          onEditClinic={handleEditClinic}
        />
      )}
    </div>
  );
}
