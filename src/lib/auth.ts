// Funções de autenticação para Best Price Odonto

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthData {
  user: User;
  token: string;
}

// Simular autenticação com localStorage
export const authService = {
  // Login com validação corrigida
  login: async (email: string, password: string): Promise<AuthData> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem("bestPriceUsers") || "[]");
        
        // 🔧 CORREÇÃO: Normalizar email e senha para evitar erros de validação
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedPassword = password.trim();
        
        // Buscar usuário com email normalizado
        const user = users.find((u: any) => {
          const userEmail = u.email.trim().toLowerCase();
          const userPassword = u.password.trim();
          return userEmail === normalizedEmail && userPassword === normalizedPassword;
        });
        
        if (user) {
          const authData: AuthData = {
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
            },
            token: `token_${user.id}_${Date.now()}`,
          };
          localStorage.setItem("bestPriceAuth", JSON.stringify(authData));
          resolve(authData);
        } else {
          // Verificar se o email existe
          const emailExists = users.some((u: any) => 
            u.email.trim().toLowerCase() === normalizedEmail
          );
          
          if (emailExists) {
            reject(new Error("Senha incorreta. Verifique sua senha e tente novamente."));
          } else {
            reject(new Error("E-mail não encontrado. Crie uma conta para continuar."));
          }
        }
      }, 500);
    });
  },

  // Cadastro com validação melhorada
  signUp: async (name: string, email: string, password: string): Promise<AuthData> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem("bestPriceUsers") || "[]");
        
        // Normalizar dados
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedName = name.trim();
        const normalizedPassword = password.trim();
        
        // Validações
        if (normalizedName.length < 3) {
          reject(new Error("Nome deve ter pelo menos 3 caracteres"));
          return;
        }
        
        if (normalizedPassword.length < 6) {
          reject(new Error("Senha deve ter pelo menos 6 caracteres"));
          return;
        }
        
        // Verificar se email já existe (normalizado)
        if (users.some((u: any) => u.email.trim().toLowerCase() === normalizedEmail)) {
          reject(new Error("Este e-mail já está cadastrado. Faça login para continuar."));
          return;
        }

        const newUser = {
          id: `user_${Date.now()}`,
          name: normalizedName,
          email: normalizedEmail,
          password: normalizedPassword,
        };

        users.push(newUser);
        localStorage.setItem("bestPriceUsers", JSON.stringify(users));

        const authData: AuthData = {
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
          },
          token: `token_${newUser.id}_${Date.now()}`,
        };
        localStorage.setItem("bestPriceAuth", JSON.stringify(authData));
        resolve(authData);
      }, 500);
    });
  },

  // Logout - Limpa TODOS os dados de sessão
  logout: () => {
    // Remover token de autenticação
    localStorage.removeItem("bestPriceAuth");
    
    // Remover dados da clínica (sessão completa)
    localStorage.removeItem("bestPriceOdontoData");
    
    // 🔧 CORREÇÃO: Verificar se deve limpar Admin Master
    // Só limpa se não houver parâmetros na URL
    const urlParams = new URLSearchParams(window.location.search);
    const hasAdminParams = urlParams.get("role") === "admin_master" || urlParams.get("is_creator") === "true";
    
    if (!hasAdminParams) {
      localStorage.removeItem("bestPriceAdminMaster");
    }
    
    // Limpar qualquer cache de sessão
    sessionStorage.clear();
    
    console.log("Sessão encerrada com sucesso");
  },

  // Verificar se está autenticado
  isAuthenticated: (): boolean => {
    // Verificar Admin Master primeiro
    const isAdminMaster = localStorage.getItem("bestPriceAdminMaster") === "true";
    if (isAdminMaster) {
      return true;
    }
    
    const authData = localStorage.getItem("bestPriceAuth");
    
    // Verificação adicional: se não há token, garantir limpeza
    if (!authData) {
      localStorage.removeItem("bestPriceOdontoData");
      return false;
    }
    
    return true;
  },

  // Obter usuário atual
  getCurrentUser: (): User | null => {
    const authData = localStorage.getItem("bestPriceAuth");
    if (authData) {
      try {
        const { user } = JSON.parse(authData);
        return user;
      } catch {
        // Se houver erro ao parsear, limpar dados corrompidos
        localStorage.removeItem("bestPriceAuth");
        localStorage.removeItem("bestPriceOdontoData");
        return null;
      }
    }
    return null;
  },

  // Recuperação de senha (simulado)
  forgotPassword: async (email: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem("bestPriceUsers") || "[]");
        const normalizedEmail = email.trim().toLowerCase();
        const user = users.find((u: any) => u.email.trim().toLowerCase() === normalizedEmail);
        
        if (user) {
          // Em produção, enviaria email real
          console.log(`Link de recuperação enviado para: ${email}`);
          resolve();
        } else {
          reject(new Error("E-mail não encontrado. Verifique o endereço digitado."));
        }
      }, 500);
    });
  },
};
