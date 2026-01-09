"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn, formatCurrencyInput, extractNumericValue } from "@/lib/utils";

export interface MoneyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value?: number;
  onChange?: (value: number) => void;
}

/**
 * 💰 COMPONENTE DE INPUT MONETÁRIO
 * 
 * Características:
 * - Formatação automática em R$ X.XXX,XX
 * - Aceita apenas números
 * - Converte automaticamente para número nos cálculos
 * - Exibe sempre formatado para o usuário
 * 
 * Uso:
 * <MoneyInput 
 *   value={salario} 
 *   onChange={(valor) => setSalario(valor)}
 * />
 */
const MoneyInput = React.forwardRef<HTMLInputElement, MoneyInputProps>(
  ({ className, value, onChange, ...props }, ref) => {
    // ✅ CORREÇÃO: Garantir que value sempre seja um número (0 por padrão)
    const numericValue = typeof value === 'number' ? value : 0;
    
    const [displayValue, setDisplayValue] = React.useState("");

    // Sincronizar valor inicial e mudanças
    React.useEffect(() => {
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(numericValue);
      setDisplayValue(formatted);
    }, [numericValue]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      
      // Formata enquanto digita
      const formatted = formatCurrencyInput(inputValue);
      setDisplayValue(formatted);
      
      // Extrai valor numérico para callback
      const extractedValue = extractNumericValue(formatted);
      onChange?.(extractedValue);
    };

    return (
      <Input
        ref={ref}
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        className={cn("text-right font-medium", className)}
        {...props}
      />
    );
  }
);

MoneyInput.displayName = "MoneyInput";

export { MoneyInput };
