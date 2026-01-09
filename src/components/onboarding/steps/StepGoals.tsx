"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Target, TrendingUp, DollarSign } from "lucide-react";
import type { Goals } from "@/lib/types";

interface StepGoalsProps {
  onNext: (data: Goals) => void;
  onBack: () => void;
  initialData: Goals | null;
}

export function StepGoals({ onNext, onBack, initialData }: StepGoalsProps) {
  const [formData, setFormData] = useState<Goals>(
    initialData || {
      proLabore: 0,
      monthlyRevenue: undefined,
      profitMargin: 40, // Sugestão padrão de 40%
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-green-100 p-3 rounded-xl">
            <Target className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">
            Pró-labore e Metas
          </h3>
        </div>

        <p className="text-sm text-gray-600 bg-green-50 p-4 rounded-lg border border-green-200">
          💡 <strong>Pró-labore</strong> é o salário que você, como dentista e dono da clínica, deseja receber mensalmente.
        </p>

        <div className="space-y-2">
          <Label htmlFor="proLabore" className="flex items-center gap-2 text-base">
            <DollarSign className="w-5 h-5 text-purple-600" />
            Pró-labore desejado (R$)
          </Label>
          <Input
            id="proLabore"
            type="number"
            min="0"
            step="0.01"
            placeholder="R$ 0,00"
            value={formData.proLabore || ""}
            onChange={(e) =>
              setFormData({ ...formData, proLabore: parseFloat(e.target.value) || 0 })
            }
            required
            className="border-purple-200 focus:border-purple-400 text-lg"
          />
          <p className="text-xs text-gray-500">
            Quanto você quer receber por mês pelo seu trabalho?
          </p>
        </div>

        <div className="space-y-2 pt-4">
          <Label htmlFor="monthlyRevenue" className="flex items-center gap-2 text-base">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Meta de faturamento mensal (R$) - Opcional
          </Label>
          <Input
            id="monthlyRevenue"
            type="number"
            min="0"
            step="0.01"
            placeholder="R$ 0,00 (deixe em branco se não tiver meta)"
            value={formData.monthlyRevenue || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                monthlyRevenue: e.target.value ? parseFloat(e.target.value) : undefined,
              })
            }
            className="border-purple-200 focus:border-purple-400"
          />
          <p className="text-xs text-gray-500">
            Quanto você deseja faturar por mês? (opcional)
          </p>
        </div>

        <div className="space-y-2 pt-4">
          <Label htmlFor="profitMargin" className="flex items-center gap-2 text-base">
            <Target className="w-5 h-5 text-purple-600" />
            Margem de lucro desejada (%)
          </Label>
          <Input
            id="profitMargin"
            type="number"
            min="0"
            max="100"
            step="1"
            placeholder="40"
            value={formData.profitMargin || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                profitMargin: parseFloat(e.target.value) || 0,
              })
            }
            required
            className="border-purple-200 focus:border-purple-400 text-lg"
          />
          <p className="text-xs text-gray-500">
            Sugestão: 30-50% é uma margem saudável para clínicas odontológicas
          </p>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border-2 border-green-200 mt-6">
          <h4 className="font-semibold text-gray-700 mb-3">Resumo das suas metas:</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Pró-labore mensal:</span>
              <span className="font-semibold text-gray-800">
                {formatCurrency(formData.proLabore)}
              </span>
            </div>
            {formData.monthlyRevenue && (
              <div className="flex justify-between">
                <span className="text-gray-600">Meta de faturamento:</span>
                <span className="font-semibold text-gray-800">
                  {formatCurrency(formData.monthlyRevenue)}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Margem de lucro:</span>
              <span className="font-semibold text-gray-800">
                {formData.profitMargin}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button
          type="button"
          onClick={onBack}
          variant="outline"
          className="border-purple-200 hover:bg-purple-50"
        >
          Voltar
        </Button>
        <Button
          type="submit"
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8"
        >
          Continuar
        </Button>
      </div>
    </form>
  );
}
