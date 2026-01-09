import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 💰 FORMATAÇÃO MONETÁRIA BRASILEIRA (R$)
 * Converte número para formato: R$ X.XXX,XX
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

/**
 * 💰 PARSE DE VALOR MONETÁRIO
 * Converte string formatada (R$ X.XXX,XX) para número
 */
export function parseCurrency(value: string): number {
  // Remove R$, espaços, pontos (separador de milhar)
  const cleaned = value.replace(/[R$\s.]/g, "").replace(",", ".");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * 💰 FORMATAÇÃO MONETÁRIA PARA INPUT
 * Formata valor enquanto usuário digita
 */
export function formatCurrencyInput(value: string): string {
  // Remove tudo exceto números
  const numbers = value.replace(/\D/g, "");
  
  if (!numbers) return "";
  
  // Converte para número (centavos)
  const amount = parseInt(numbers) / 100;
  
  // Formata como moeda brasileira
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);
}

/**
 * 💰 EXTRAI VALOR NUMÉRICO DE INPUT FORMATADO
 * Retorna número puro para cálculos
 */
export function extractNumericValue(formattedValue: string): number {
  const cleaned = formattedValue.replace(/[R$\s.]/g, "").replace(",", ".");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}
