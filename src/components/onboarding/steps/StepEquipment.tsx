"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wrench, Plus, Trash2, CheckCircle2 } from "lucide-react";
import type { Equipment } from "@/lib/types";

interface StepEquipmentProps {
  onComplete: (equipment: Equipment[]) => void;
  onBack: () => void;
  initialData?: Equipment[];
}

export function StepEquipment({ onComplete, onBack, initialData }: StepEquipmentProps) {
  const [equipment, setEquipment] = useState<Equipment[]>(initialData || []);

  useEffect(() => {
    if (initialData) {
      setEquipment(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(equipment);
  };

  const addEquipment = () => {
    setEquipment([
      ...equipment,
      {
        id: Date.now().toString(),
        name: "",
        value: 0,
        depreciationMonths: 60, // Sugestão padrão de 60 meses (5 anos)
      },
    ]);
  };

  const removeEquipment = (id: string) => {
    setEquipment(equipment.filter((eq) => eq.id !== id));
  };

  const updateEquipment = (id: string, field: keyof Equipment, value: any) => {
    setEquipment(
      equipment.map((eq) => (eq.id === id ? { ...eq, [field]: value } : eq))
    );
  };

  const totalInvestment = equipment.reduce((sum, eq) => sum + eq.value, 0);

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
          <div className="bg-orange-100 p-3 rounded-xl">
            <Wrench className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">
            Investimentos e Equipamentos
          </h3>
        </div>

        <p className="text-sm text-gray-600 bg-orange-50 p-4 rounded-lg border border-orange-200">
          💡 <strong>Depreciação:</strong> É o custo mensal do desgaste dos seus equipamentos. Ajuda a entender quanto você precisa guardar para renovar seus equipamentos no futuro.
        </p>

        <div className="flex items-center justify-between pt-4">
          <Label className="text-lg font-semibold">Equipamentos principais</Label>
          <Button
            type="button"
            onClick={addEquipment}
            size="sm"
            className="bg-orange-600 hover:bg-orange-700 gap-2"
          >
            <Plus className="w-4 h-4" />
            Adicionar
          </Button>
        </div>

        {equipment.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <Wrench className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="font-medium">Nenhum equipamento adicionado</p>
            <p className="text-sm mt-1">
              Adicione seus principais equipamentos para calcular a depreciação
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {equipment.map((eq) => (
              <div
                key={eq.id}
                className="p-4 border-2 border-orange-200 rounded-xl bg-orange-50/50 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <span className="text-sm font-semibold text-orange-700">
                    Equipamento
                  </span>
                  <Button
                    type="button"
                    onClick={() => removeEquipment(eq.id)}
                    size="sm"
                    variant="ghost"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Nome do equipamento</Label>
                    <Input
                      placeholder="Ex: Cadeira odontológica"
                      value={eq.name}
                      onChange={(e) => updateEquipment(eq.id, "name", e.target.value)}
                      required
                      className="border-orange-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Valor (R$)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0,00"
                      value={eq.value || ""}
                      onChange={(e) =>
                        updateEquipment(eq.id, "value", parseFloat(e.target.value) || 0)
                      }
                      required
                      className="border-orange-300"
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-3">
                    <Label>Tempo de retorno (meses)</Label>
                    <Input
                      type="number"
                      min="1"
                      placeholder="60"
                      value={eq.depreciationMonths || ""}
                      onChange={(e) =>
                        updateEquipment(
                          eq.id,
                          "depreciationMonths",
                          parseInt(e.target.value) || 60
                        )
                      }
                      required
                      className="border-orange-300"
                    />
                    <p className="text-xs text-gray-500">
                      Em quantos meses você espera recuperar o investimento? (Sugestão: 60 meses = 5 anos)
                    </p>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-orange-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Depreciação mensal:</span>
                    <span className="font-semibold text-orange-700">
                      {formatCurrency(eq.value / eq.depreciationMonths)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {equipment.length > 0 && (
          <div className="bg-gradient-to-r from-orange-50 to-pink-50 p-6 rounded-xl border-2 border-orange-200 mt-6">
            <h4 className="font-semibold text-gray-700 mb-3">Resumo dos investimentos:</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total investido:</span>
                <span className="text-xl font-bold text-orange-700">
                  {formatCurrency(totalInvestment)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Depreciação mensal total:</span>
                <span className="text-lg font-semibold text-orange-600">
                  {formatCurrency(
                    equipment.reduce((sum, eq) => sum + eq.value / eq.depreciationMonths, 0)
                  )}
                </span>
              </div>
            </div>
          </div>
        )}
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
          className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 gap-2"
        >
          <CheckCircle2 className="w-5 h-5" />
          Finalizar
        </Button>
      </div>
    </form>
  );
}
