import { Sparkles, RotateCcw, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onReset?: () => void;
  onLogout?: () => void;
  isAdminMaster?: boolean;
}

export function Header({ onReset, onLogout, isAdminMaster }: HeaderProps) {
  const handleResetClick = () => {
    if (onReset) {
      const confirmed = window.confirm(
        "⚠️ Tem certeza que deseja recomeçar?\n\nTodos os dados da clínica serão perdidos e você voltará para a página de cadastro inicial."
      );
      
      if (confirmed) {
        onReset();
      }
    }
  };

  const handleLogoutClick = () => {
    if (onLogout) {
      const confirmed = window.confirm(
        "Deseja sair da sua conta?\n\nVocê precisará fazer login novamente para acessar o aplicativo."
      );
      
      if (confirmed) {
        onLogout();
      }
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 sm:p-3 rounded-2xl shadow-lg">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                  Best Price Odonto
                </h1>
                {isAdminMaster && (
                  <div className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-1 rounded-lg text-xs font-semibold shadow-md">
                    <Shield className="w-3 h-3" />
                    <span className="hidden sm:inline">Admin Master</span>
                  </div>
                )}
              </div>
              <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                O preço certo começa pelo custo real
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onReset && (
              <Button
                onClick={handleResetClick}
                variant="outline"
                size="sm"
                className="gap-2 border-purple-200 hover:bg-purple-50 hover:border-purple-300 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">Recomeçar</span>
              </Button>
            )}

            {onLogout && (
              <Button
                onClick={handleLogoutClick}
                variant="outline"
                size="sm"
                className="gap-2 border-red-200 hover:bg-red-50 hover:border-red-300 text-red-600 hover:text-red-700 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
