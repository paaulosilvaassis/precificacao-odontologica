// Tipos principais do aplicativo Best Price Odonto

export interface ClinicProfile {
  name: string;
  city: string;
  state: string;
  workAlone: boolean;
  daysPerWeek: number;
  hoursPerDay: number;
  chairs: number;
}

export interface CustomFixedCost {
  id: string;
  name: string;
  category: "Estrutura" | "Administrativo" | "Marketing" | "Tecnologia" | "Outros";
  value: number;
  notes?: string;
}

export interface AdminExpense {
  id: string;
  name: string;
  value: number;
}

// 🔥 BASE ÚNICA DE CUSTOS FIXOS - UNIFICADA
export interface FixedCosts {
  // ✅ BASE ÚNICA: Despesas Administrativas (fonte oficial)
  adminExpenses?: AdminExpense[];
  
  // ✅ Custos personalizados adicionais
  customCosts?: CustomFixedCost[];
  
  // ❌ REMOVIDO: Campos duplicados (rent, utilities, software, marketing, accounting, other)
  // Agora tudo está unificado em adminExpenses
}

export interface LaborCharge {
  id: string;
  name: string;
  percentage: number;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  employmentType: "CLT" | "Outros";
  grossSalary: number;
  laborCharges: LaborCharge[];
}

export interface PartnerDentist {
  id: string;
  name: string;
  type: "percentage" | "fixed";
  value: number;
}

// 🆕 Pró-labore dos Sócios (BASE ÚNICA)
export interface Partner {
  socio_id: string;
  nome_socio: string;
  prolabore_mensal: number;
  inss_prolabore_percentual: number;
  inss_prolabore_valor: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Team {
  employees: Employee[];
  partnerDentists: PartnerDentist[];
  partners?: Partner[]; // Sócios com pró-labore
}

export interface Goals {
  proLabore: number;
  monthlyRevenue?: number;
  profitMargin: number;
}

export interface Equipment {
  id: string;
  name: string;
  value: number;
  depreciationMonths: number;
}

// 🆕 Faixas do Simples Nacional - APENAS ALÍQUOTA NOMINAL
export interface SimplesNacionalFaixa {
  faixa: number;
  limiteInferior: number;
  limiteSuperior: number;
  aliquota: number;
  // ❌ REMOVIDO: deducao (não é mais utilizada)
}

export interface TaxConfig {
  regime: "simplesNacional" | "lucroPresumido" | "lucroReal" | "cpf";
  state: string;
  customISS?: number;
  rates: {
    totalRate?: number; // Para Simples Nacional - APENAS ALÍQUOTA NOMINAL
    anexo?: "anexo3" | "anexo5"; // Para Simples Nacional
    faixaSelecionada?: number; // Faixa do Simples Nacional (1-6)
    // ❌ REMOVIDO: faturamentoAnual, aliquotaEfetiva, deducao
    iss?: number;
    pis?: number;
    cofins?: number;
    irpj?: number;
    csll?: number;
    inss?: number;
    irpf?: number;
  };
  calculationMethod: "onRevenue" | "embedded";
}

export interface ClinicData {
  profile: ClinicProfile;
  fixedCosts: FixedCosts;
  team: Team;
  goals: Goals;
  equipment: Equipment[];
  taxConfig?: TaxConfig;
  monthlyRevenue?: number;
}

export interface CalculatedCosts {
  totalFixedCosts: number;
  totalTeamCosts: number;
  totalDepreciation: number;
  totalMonthlyCosts: number;
  costPerHour: number;
  costPerMinute: number;
  workingHoursPerMonth: number;
}

export interface Treatment {
  id: string;
  name: string;
  durationMinutes: number;
  professionalId?: string;
  materials: Material[];
  labCost: number;
}

export interface Material {
  id: string;
  name: string;
  cost: number;
}

export interface PricingResult {
  realCost: number;
  minimumPrice: number;
  idealPrice: number;
  strategicPrice: number;
  breakdown: {
    timeCost: number;
    materialsCost: number;
    labCost: number;
  };
}
