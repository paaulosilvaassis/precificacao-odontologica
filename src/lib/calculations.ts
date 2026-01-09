// Cálculos financeiros do Best Price Odonto

import type { ClinicData, CalculatedCosts, Treatment, PricingResult, Employee, TaxConfig } from "./types";

export function calculateEmployeeTotalCost(employee: Employee): number {
  // Validação: garantir que laborCharges existe e é um array
  if (!employee.laborCharges || !Array.isArray(employee.laborCharges)) {
    return employee.grossSalary;
  }
  
  const totalChargesPercentage = employee.laborCharges.reduce(
    (sum, charge) => sum + charge.percentage,
    0
  );
  const totalChargesValue = employee.grossSalary * (totalChargesPercentage / 100);
  return employee.grossSalary + totalChargesValue;
}

export function calculateClinicCosts(data: ClinicData): CalculatedCosts {
  // 🔥 BASE ÚNICA DE CUSTOS FIXOS - UNIFICADA
  // ✅ Despesas Administrativas (fonte única e oficial)
  const adminExpensesCosts = (data.fixedCosts.adminExpenses || []).reduce(
    (sum, expense) => sum + expense.value,
    0
  );

  // ✅ Custos fixos personalizados
  const customFixedCosts = (data.fixedCosts.customCosts || []).reduce(
    (sum, cost) => sum + cost.value,
    0
  );

  // 🎯 TOTAL DE CUSTOS FIXOS (BASE ÚNICA)
  // Soma APENAS adminExpenses + customCosts
  // ❌ REMOVIDO: standardFixedCosts (rent, utilities, etc) - eliminada duplicidade
  const totalFixedCosts = adminExpensesCosts + customFixedCosts;

  // Custos com equipe - usando novo cálculo com encargos detalhados
  const employeesCosts = data.team.employees.reduce((sum, emp) => {
    return sum + calculateEmployeeTotalCost(emp);
  }, 0);

  const partnerDentistsCosts = data.team.partnerDentists.reduce((sum, partner) => {
    if (partner.type === "fixed") {
      return sum + partner.value;
    }
    return sum; // Percentual será calculado sobre cada procedimento
  }, 0);

  const totalTeamCosts = employeesCosts + partnerDentistsCosts + data.goals.proLabore;

  // Depreciação de equipamentos
  const totalDepreciation = data.equipment.reduce((sum, eq) => {
    return sum + eq.value / eq.depreciationMonths;
  }, 0);

  // Total mensal
  const totalMonthlyCosts = totalFixedCosts + totalTeamCosts + totalDepreciation;

  // Horas trabalhadas por mês
  const workingHoursPerMonth = data.profile.daysPerWeek * 4.33 * data.profile.hoursPerDay;

  // Custo por hora e por minuto
  const costPerHour = totalMonthlyCosts / workingHoursPerMonth;
  const costPerMinute = costPerHour / 60;

  return {
    totalFixedCosts,
    totalTeamCosts,
    totalDepreciation,
    totalMonthlyCosts,
    costPerHour,
    costPerMinute,
    workingHoursPerMonth,
  };
}

export function calculateTaxRate(taxConfig?: TaxConfig): number {
  if (!taxConfig || !taxConfig.rates) return 0;

  switch (taxConfig.regime) {
    case "simplesNacional":
      return taxConfig.rates.totalRate || 0;
    case "lucroPresumido":
      return (
        (taxConfig.rates.iss || 0) +
        (taxConfig.rates.pis || 0) +
        (taxConfig.rates.cofins || 0) +
        (taxConfig.rates.irpj || 0) +
        (taxConfig.rates.csll || 0)
      );
    case "lucroReal":
      return (
        (taxConfig.rates.iss || 0) +
        (taxConfig.rates.pis || 0) +
        (taxConfig.rates.cofins || 0) +
        (taxConfig.rates.irpj || 0) +
        (taxConfig.rates.csll || 0)
      );
    case "cpf":
      return (
        (taxConfig.rates.iss || 0) +
        (taxConfig.rates.inss || 0) +
        (taxConfig.rates.irpf || 0)
      );
    default:
      return 0;
  }
}

export function calculateTaxAmount(price: number, taxConfig?: TaxConfig): number {
  if (!taxConfig) return 0;
  
  const taxRate = calculateTaxRate(taxConfig);
  
  if (taxConfig.calculationMethod === "embedded") {
    // Imposto embutido: preço / (1 + taxa) * taxa
    return (price / (1 + taxRate / 100)) * (taxRate / 100);
  } else {
    // Imposto sobre faturamento: preço * taxa
    return price * (taxRate / 100);
  }
}

export function calculatePriceWithTax(basePrice: number, taxConfig?: TaxConfig): number {
  if (!taxConfig) return basePrice;
  
  const taxRate = calculateTaxRate(taxConfig);
  
  if (taxConfig.calculationMethod === "embedded") {
    // Preço já inclui impostos
    return basePrice;
  } else {
    // Adicionar impostos ao preço
    return basePrice * (1 + taxRate / 100);
  }
}

export function calculateNetProfit(price: number, realCost: number, taxConfig?: TaxConfig): number {
  const taxAmount = calculateTaxAmount(price, taxConfig);
  return price - realCost - taxAmount;
}

export function calculateNetMargin(price: number, realCost: number, taxConfig?: TaxConfig): number {
  const netProfit = calculateNetProfit(price, realCost, taxConfig);
  return (netProfit / price) * 100;
}

export function calculateTreatmentPricing(
  treatment: Treatment,
  costs: CalculatedCosts,
  profitMargin: number,
  taxConfig?: TaxConfig
): PricingResult {
  // Custo do tempo
  const timeCost = treatment.durationMinutes * costs.costPerMinute;

  // Custo dos materiais
  const materialsCost = treatment.materials.reduce((sum, mat) => sum + mat.cost, 0);

  // Custo do laboratório
  const labCost = treatment.labCost;

  // Custo real total
  const realCost = timeCost + materialsCost + labCost;

  // Calcular preços base (sem impostos)
  let minimumPrice = realCost * 1.1;
  let idealPrice = realCost * (1 + profitMargin / 100);
  let strategicPrice = idealPrice * 1.5;

  // Ajustar preços conforme método de cálculo de impostos
  if (taxConfig) {
    const taxRate = calculateTaxRate(taxConfig);
    
    if (taxConfig.calculationMethod === "embedded") {
      // Se imposto é embutido, aumentar preço base para compensar
      minimumPrice = minimumPrice / (1 - taxRate / 100);
      idealPrice = idealPrice / (1 - taxRate / 100);
      strategicPrice = strategicPrice / (1 - taxRate / 100);
    }
    // Se imposto é sobre faturamento, os preços já estão corretos
    // e o imposto será adicionado na hora da venda
  }

  return {
    realCost,
    minimumPrice,
    idealPrice,
    strategicPrice,
    breakdown: {
      timeCost,
      materialsCost,
      labCost,
    },
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatNumber(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}
