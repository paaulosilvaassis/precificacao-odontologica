"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  calculateClinicCosts,
  calculateTreatmentPricing,
  formatCurrency,
  calculateTaxRate,
} from "@/lib/calculations";
import type { ClinicData, Treatment } from "@/lib/types";
import {
  Receipt,
  TrendingUp,
  DollarSign,
  Clock,
  Package,
  Users,
  Building,
  Percent,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Target,
  TrendingDown,
  Search,
  Calculator,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface ResultsTabProps {
  clinicData: ClinicData;
  treatments: Treatment[];
}

type PricingStrategy = "risk" | "medium" | "premium";

export function ResultsTab({ clinicData, treatments }: ResultsTabProps) {
  const [selectedTreatmentId, setSelectedTreatmentId] = useState<string>("");
  const [customCommission, setCustomCommission] = useState<number>(0);
  const [selectedStrategy, setSelectedStrategy] = useState<PricingStrategy>("medium");
  const [customMargin, setCustomMargin] = useState<number>(clinicData.goals.profitMargin);

  // 🔥 USAR IMPOSTOS DA CONFIGURAÇÃO TRIBUTÁRIA (ALÍQUOTA NOMINAL)
  const taxRate = useMemo(() => {
    return calculateTaxRate(clinicData.taxConfig);
  }, [clinicData.taxConfig]);

  const costs = calculateClinicCosts(clinicData);
  
  const selectedTreatment = useMemo(() => {
    return treatments.find(t => t.id === selectedTreatmentId);
  }, [selectedTreatmentId, treatments]);

  // 🔑 MARGEM INFORMADA PELO USUÁRIO NO INÍCIO DO APP
  const userDefinedMargin = clinicData.goals.profitMargin;

  // 🎯 CÁLCULO DO CUSTO TOTAL DO TRATAMENTO (BASE ÚNICA DA VERDADE)
  const treatmentBaseCost = useMemo(() => {
    if (!selectedTreatment) return null;

    const pricing = calculateTreatmentPricing(
      selectedTreatment,
      costs,
      userDefinedMargin
    );

    const custo_total_tratamento = pricing.realCost;

    return {
      custo_total_tratamento,
      breakdown: pricing.breakdown,
    };
  }, [selectedTreatment, costs, userDefinedMargin]);

  // 📊 CÁLCULO DAS 3 ESTRATÉGIAS DE PREÇO
  const pricingStrategies = useMemo(() => {
    if (!treatmentBaseCost) return null;

    const baseCost = treatmentBaseCost.custo_total_tratamento;

    // 🔴 1. PREÇO DE RISCO (Margem inferior à definida pelo usuário)
    const riskMargin = Math.max(customMargin - 15, 10);
    const riskPrice = baseCost * (1 + riskMargin / 100);

    // 🟡 2. PREÇO MÉDIO SUGERIDO (Margem EXATA definida pelo usuário)
    const mediumMargin = customMargin;
    const mediumPrice = baseCost * (1 + mediumMargin / 100);

    // 🟢 3. PREÇO COM LUCRO AMPLIADO
    const premiumMargin = customMargin + 20;
    const premiumPrice = baseCost * (1 + premiumMargin / 100);

    return {
      baseCost,
      risk: {
        price: riskPrice,
        margin: riskMargin,
        label: "Preço de Risco",
        color: "red",
        icon: AlertCircle,
      },
      medium: {
        price: mediumPrice,
        margin: mediumMargin,
        label: "Preço Médio",
        color: "yellow",
        icon: Target,
      },
      premium: {
        price: premiumPrice,
        margin: premiumMargin,
        label: "Preço com Lucro Ampliado",
        color: "green",
        icon: TrendingUp,
      },
    };
  }, [treatmentBaseCost, customMargin]);

  // Cálculos detalhados baseados na estratégia selecionada
  const results = useMemo(() => {
    if (!selectedTreatment || !pricingStrategies || !treatmentBaseCost) return null;

    const selectedPrice = pricingStrategies[selectedStrategy].price;
    const selectedMargin = pricingStrategies[selectedStrategy].margin;

    const totalCost = pricingStrategies.baseCost;
    const materialCost = treatmentBaseCost.breakdown.materialsCost;
    const durationHours = selectedTreatment.durationMinutes / 60;
    const dailyDentistCost = clinicData.goals.proLabore / 22;
    const dentistCostPerProcedure = (dailyDentistCost / (clinicData.profile.hoursPerDay)) * durationHours;
    const clinicHourCost = costs.costPerHour;
    const labCost = treatmentBaseCost.breakdown.labCost;
    const commissionAmount = (selectedPrice * customCommission) / 100;
    const taxesAmount = (selectedPrice * taxRate) / 100;
    const netMargin = selectedPrice - totalCost - commissionAmount - taxesAmount;
    const netMarginPercent = (netMargin / selectedPrice) * 100;
    const finalPrice = selectedPrice;

    return {
      materialCost,
      durationHours,
      dailyDentistCost,
      dentistCostPerProcedure,
      clinicHourCost,
      labCost,
      totalCost,
      commissionAmount,
      taxesAmount,
      netMargin,
      netMarginPercent,
      finalPrice,
      selectedMargin,
    };
  }, [selectedTreatment, costs, clinicData, customCommission, taxRate, pricingStrategies, selectedStrategy, treatmentBaseCost]);

  const getMarginColor = (percent: number) => {
    if (percent >= 30) return "text-green-600 bg-green-50 border-green-200";
    if (percent >= 15) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getMarginIcon = (percent: number) => {
    if (percent >= 30) return <CheckCircle className="w-5 h-5" />;
    if (percent >= 15) return <AlertCircle className="w-5 h-5" />;
    return <XCircle className="w-5 h-5" />;
  };

  const getMarginLabel = (percent: number) => {
    if (percent >= 30) return "Saudável";
    if (percent >= 15) return "Atenção";
    return "Prejuízo";
  };

  if (treatments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="bg-purple-50 rounded-full p-6 mb-4">
          <Receipt className="w-12 h-12 text-purple-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Nenhum tratamento cadastrado
        </h3>
        <p className="text-gray-600 text-center max-w-md">
          Vá para a aba "Tratamentos" e adicione tratamentos para visualizar os resultados financeiros detalhados.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Receipt className="w-7 h-7 text-purple-600" />
          💰 PRESIFICAÇÃO
        </h2>
        <p className="text-gray-600 mt-1">
          Aba final do sistema - Cálculo completo de custos e estratégias de preço
        </p>
      </div>

      {/* Card Informativo */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
        <div className="flex items-start gap-3">
          <Info className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-bold text-purple-900 mb-2">
              Sobre a PRESIFICAÇÃO
            </h3>
            <p className="text-sm text-purple-800 leading-relaxed">
              Esta é a <strong>única aba responsável por calcular TODOS os custos e preços finais</strong> dos seus tratamentos.
              <br />
              <br />
              Aqui você pode: buscar tratamentos, calcular custos completos, gerar três estratégias de preço e ajustar a margem de lucro a qualquer momento.
            </p>
          </div>
        </div>
      </Card>

      {/* Botão de Busca - Layout Original Simples */}
      <Card className="p-6 border-2 border-purple-200">
        <Label htmlFor="treatment-select" className="text-sm font-semibold mb-3 block flex items-center gap-2">
          <Search className="w-5 h-5 text-purple-600" />
          🔍 Buscar Tratamento
        </Label>
        <Select value={selectedTreatmentId} onValueChange={setSelectedTreatmentId}>
          <SelectTrigger className="w-full border-2 border-purple-200 focus:border-purple-400">
            <SelectValue placeholder="Selecione um tratamento para precificar..." />
          </SelectTrigger>
          <SelectContent>
            {treatments.map((treatment) => (
              <SelectItem key={treatment.id} value={treatment.id}>
                {treatment.name} ({treatment.durationMinutes} min)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Card>

      {/* Conteúdo Principal */}
      {selectedTreatment && pricingStrategies && (
        <>
          {/* Margem Editável - Layout Original Simples */}
          <Card className="p-6 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              Margem de Lucro (Sempre Ativa)
            </h3>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold mb-2 block">
                  Margem Base Definida no Início: {userDefinedMargin}%
                </Label>
                <p className="text-xs text-blue-700">
                  Esta é a margem que você definiu nas configurações iniciais
                </p>
              </div>
              <div>
                <Label className="text-sm font-semibold mb-2 block">
                  Margem Atual: {customMargin}%
                </Label>
                <Input
                  type="number"
                  value={customMargin}
                  onChange={(e) => setCustomMargin(Number(e.target.value))}
                  className="border-2 border-blue-300 focus:border-blue-500"
                  min={0}
                  max={200}
                />
                <p className="text-xs text-blue-700 mt-1">
                  Ajuste a margem para recalcular automaticamente todas as estratégias
                </p>
              </div>
            </div>
          </Card>

          {/* Estratégias de Preço - Layout Original Simples */}
          <Card className="p-6 border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-purple-600" />
              📊 Estratégias de Preço
            </h3>
            
            <div className="mb-6 p-4 bg-purple-100 rounded-lg border border-purple-200">
              <p className="text-sm text-purple-800 font-semibold">
                💡 Custo Total do Tratamento (Base): {formatCurrency(pricingStrategies.baseCost)}
              </p>
              <p className="text-xs text-purple-700 mt-1">
                Todos os preços estratégicos são calculados sobre este valor
              </p>
            </div>

            {/* Cards de Estratégia - Layout Original Simples */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 🔴 Preço de Risco */}
              <Card
                className={`p-5 cursor-pointer transition-all border-2 ${ 
                  selectedStrategy === "risk"
                    ? "border-red-500 bg-red-50 shadow-lg"
                    : "border-red-200 bg-white hover:border-red-300 hover:shadow-md"
                }`}
                onClick={() => setSelectedStrategy("risk")}
              >
                <div className="flex items-center gap-2 mb-3">
                  <TrendingDown className="w-5 h-5 text-red-600" />
                  <h4 className="font-bold text-red-800">🔴 Preço de Risco</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Preço Final:</span>
                    <span className="text-lg font-bold text-red-700">
                      {formatCurrency(pricingStrategies.risk.price)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Margem:</span>
                    <span className="text-sm font-semibold text-red-700">
                      {pricingStrategies.risk.margin.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </Card>

              {/* 🟡 Preço Médio */}
              <Card
                className={`p-5 cursor-pointer transition-all border-2 ${
                  selectedStrategy === "medium"
                    ? "border-yellow-500 bg-yellow-50 shadow-lg"
                    : "border-yellow-200 bg-white hover:border-yellow-300 hover:shadow-md"
                }`}
                onClick={() => setSelectedStrategy("medium")}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-5 h-5 text-yellow-600" />
                  <h4 className="font-bold text-yellow-800">🟡 Preço Médio</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Preço Final:</span>
                    <span className="text-lg font-bold text-yellow-700">
                      {formatCurrency(pricingStrategies.medium.price)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Margem:</span>
                    <span className="text-sm font-semibold text-yellow-700">
                      {pricingStrategies.medium.margin.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="mt-3 p-2 bg-yellow-100 rounded border border-yellow-200">
                  <p className="text-xs text-yellow-800 font-semibold">
                    ⭐ Usa a margem definida
                  </p>
                </div>
              </Card>

              {/* 🟢 Preço com Lucro Ampliado */}
              <Card
                className={`p-5 cursor-pointer transition-all border-2 ${
                  selectedStrategy === "premium"
                    ? "border-green-500 bg-green-50 shadow-lg"
                    : "border-green-200 bg-white hover:border-green-300 hover:shadow-md"
                }`}
                onClick={() => setSelectedStrategy("premium")}
              >
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <h4 className="font-bold text-green-800">🟢 Lucro Ampliado</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Preço Final:</span>
                    <span className="text-lg font-bold text-green-700">
                      {formatCurrency(pricingStrategies.premium.price)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Margem:</span>
                    <span className="text-sm font-semibold text-green-700">
                      {pricingStrategies.premium.margin.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </Card>

          {/* Configurações - Layout Original Simples */}
          <Card className="p-6 border-2 border-purple-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Percent className="w-5 h-5 text-purple-600" />
              Configurações de Comissão e Impostos
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="commission" className="text-sm font-semibold mb-2 block">
                  Comissão (%)
                </Label>
                <Input
                  id="commission"
                  type="number"
                  value={customCommission}
                  onChange={(e) => setCustomCommission(Number(e.target.value))}
                  className="border-2 border-purple-200"
                  min={0}
                  max={100}
                />
              </div>
              <div>
                <Label htmlFor="taxes" className="text-sm font-semibold mb-2 block">
                  Impostos (%) - Alíquota Nominal
                </Label>
                <Input
                  id="taxes"
                  type="number"
                  value={taxRate}
                  disabled
                  className="border-2 border-purple-200 bg-gray-100"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Configure na aba "Impostos"
                </p>
              </div>
            </div>
          </Card>

          {/* Componentes Financeiros Detalhados - Layout Original Simples */}
          {results && (
            <Card className="p-6 border-2 border-purple-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-purple-600" />
                📑 Componentes Financeiros Detalhados
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between p-4 bg-gray-50 rounded border">
                  <span className="text-sm font-semibold">Custo de Material</span>
                  <span className="font-bold">{formatCurrency(results.materialCost)}</span>
                </div>
                <div className="flex justify-between p-4 bg-gray-50 rounded border">
                  <span className="text-sm font-semibold">Tempo Clínico</span>
                  <span className="font-bold">{results.durationHours.toFixed(2)}h</span>
                </div>
                <div className="flex justify-between p-4 bg-gray-50 rounded border">
                  <span className="text-sm font-semibold">Custo Hora Clínica</span>
                  <span className="font-bold">{formatCurrency(results.clinicHourCost)}/h</span>
                </div>
                <div className="flex justify-between p-4 bg-gray-50 rounded border">
                  <span className="text-sm font-semibold">Custo do Dentista</span>
                  <span className="font-bold">{formatCurrency(results.dentistCostPerProcedure)}</span>
                </div>
                {results.labCost > 0 && (
                  <div className="flex justify-between p-4 bg-gray-50 rounded border">
                    <span className="text-sm font-semibold">Custo Laboratorial</span>
                    <span className="font-bold">{formatCurrency(results.labCost)}</span>
                  </div>
                )}
                <div className="flex justify-between p-4 bg-purple-100 rounded-lg border-2 border-purple-300">
                  <span className="text-base font-bold text-purple-900">Custo Total</span>
                  <span className="text-xl font-bold text-purple-700">
                    {formatCurrency(results.totalCost)}
                  </span>
                </div>
                <div className="flex justify-between p-4 bg-gray-50 rounded border">
                  <span className="text-sm font-semibold">Comissão ({customCommission}%)</span>
                  <span className="font-bold">{formatCurrency(results.commissionAmount)}</span>
                </div>
                <div className="flex justify-between p-4 bg-gray-50 rounded border">
                  <span className="text-sm font-semibold">Impostos ({taxRate.toFixed(2)}%)</span>
                  <span className="font-bold">{formatCurrency(results.taxesAmount)}</span>
                </div>
                <div className={`flex justify-between p-4 rounded-lg border-2 ${getMarginColor(results.netMarginPercent)}`}>
                  <div className="flex items-center gap-2">
                    {getMarginIcon(results.netMarginPercent)}
                    <span className="font-bold">Margem Líquida ({results.netMarginPercent.toFixed(1)}%)</span>
                  </div>
                  <span className="text-xl font-bold">{formatCurrency(results.netMargin)}</span>
                </div>
                <div className="flex justify-between p-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-lg">
                  <span className="text-lg font-bold text-white">💰 Preço Final</span>
                  <span className="text-3xl font-bold text-white">
                    {formatCurrency(results.finalPrice)}
                  </span>
                </div>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
