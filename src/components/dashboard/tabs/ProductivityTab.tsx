"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Activity,
  Clock,
  Calendar,
  TrendingUp,
  Info,
  AlertCircle,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProductivityTabProps {
  onUpdateProductivity?: (data: ProductivityData) => void;
}

interface ProductivityData {
  hoursPerDay: number;
  daysPerMonth: number;
  effectiveHours: number;
}

export function ProductivityTab({ onUpdateProductivity }: ProductivityTabProps) {
  const [hoursPerDay, setHoursPerDay] = useState<number>(8);
  const [daysPerMonth, setDaysPerMonth] = useState<number>(20);
  const [effectiveHours, setEffectiveHours] = useState<number>(120);

  // Cálculo da taxa de ocupação
  const totalAvailableHours = hoursPerDay * daysPerMonth;
  const occupancyRate =
    totalAvailableHours > 0
      ? (effectiveHours / totalAvailableHours) * 100
      : 0;

  // Determinar status e cor
  const getOccupancyStatus = (rate: number) => {
    if (rate <= 50) {
      return {
        label: "Baixa ocupação",
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        icon: "🔴",
      };
    } else if (rate <= 75) {
      return {
        label: "Ocupação média",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        icon: "🟡",
      };
    } else if (rate <= 90) {
      return {
        label: "Ocupação ideal",
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        icon: "🟢",
      };
    } else {
      return {
        label: "Ocupação máxima",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        icon: "🔵",
      };
    }
  };

  const status = getOccupancyStatus(occupancyRate);

  // Atualizar dados quando houver mudança
  useEffect(() => {
    if (onUpdateProductivity) {
      onUpdateProductivity({
        hoursPerDay,
        daysPerMonth,
        effectiveHours,
      });
    }
  }, [hoursPerDay, daysPerMonth, effectiveHours, onUpdateProductivity]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white p-6 sm:p-8 border-0 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
            <Activity className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              Produtividade da Clínica
            </h2>
            <p className="text-white/90 text-sm sm:text-base">
              Monitore a taxa de ocupação e otimize o uso do tempo disponível
            </p>
          </div>
        </div>
      </Card>

      {/* Explicação */}
      <Card className="p-6 border-2 border-blue-100 bg-blue-50">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">
              O que é Taxa de Ocupação da Clínica?
            </h3>
            <p className="text-sm text-blue-800 leading-relaxed mb-2">
              A taxa de ocupação da clínica mostra quanto do tempo disponível
              para atendimento está sendo realmente utilizado.
            </p>
            <p className="text-sm text-blue-800 leading-relaxed mb-2">
              Uma taxa baixa indica horários ociosos e possível perda de
              faturamento. Uma taxa muito alta pode indicar sobrecarga da equipe
              e dificuldade de agenda.
            </p>
            <p className="text-sm text-blue-800 leading-relaxed font-medium">
              O ideal é manter a taxa de ocupação equilibrada, garantindo
              produtividade, qualidade no atendimento e melhor resultado
              financeiro.
            </p>
          </div>
        </div>
      </Card>

      {/* Campos de entrada */}
      <Card className="p-6 border-2 border-purple-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-purple-600" />
          Dados de Operação
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Horas por dia */}
          <div className="space-y-2">
            <Label htmlFor="hoursPerDay" className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-600" />
              Horas disponíveis por dia
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Quantas horas a clínica fica aberta para atendimento por
                      dia
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Input
              id="hoursPerDay"
              type="number"
              min="1"
              max="24"
              step="0.5"
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(Number(e.target.value))}
              className="border-purple-200 focus:border-purple-400"
            />
            <p className="text-xs text-gray-500">Exemplo: 8 horas</p>
          </div>

          {/* Dias por mês */}
          <div className="space-y-2">
            <Label htmlFor="daysPerMonth" className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-pink-600" />
              Dias de atendimento no mês
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Quantos dias úteis a clínica atende por mês
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Input
              id="daysPerMonth"
              type="number"
              min="1"
              max="31"
              value={daysPerMonth}
              onChange={(e) => setDaysPerMonth(Number(e.target.value))}
              className="border-pink-200 focus:border-pink-400"
            />
            <p className="text-xs text-gray-500">Exemplo: 20 dias</p>
          </div>

          {/* Horas efetivas */}
          <div className="space-y-2">
            <Label htmlFor="effectiveHours" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Horas efetivamente atendidas
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Total de horas realmente utilizadas com atendimento no mês
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Input
              id="effectiveHours"
              type="number"
              min="0"
              max={totalAvailableHours}
              value={effectiveHours}
              onChange={(e) => setEffectiveHours(Number(e.target.value))}
              className="border-blue-200 focus:border-blue-400"
            />
            <p className="text-xs text-gray-500">Exemplo: 120 horas</p>
          </div>
        </div>
      </Card>

      {/* Resultado da Taxa de Ocupação */}
      <Card
        className={`p-6 border-2 ${status.borderColor} ${status.bgColor}`}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple-600" />
          Taxa de Ocupação da Clínica
        </h3>

        <div className="space-y-4">
          {/* Cálculo visual */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">
                Horas totais disponíveis:
              </span>
              <span className="font-semibold text-gray-800">
                {totalAvailableHours.toFixed(1)}h
              </span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">
                Horas efetivamente atendidas:
              </span>
              <span className="font-semibold text-gray-800">
                {effectiveHours.toFixed(1)}h
              </span>
            </div>
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Fórmula:
                </span>
                <span className="text-xs text-gray-500">
                  ({effectiveHours} ÷ {totalAvailableHours}) × 100
                </span>
              </div>
            </div>
          </div>

          {/* Resultado principal */}
          <div className="bg-white rounded-lg p-6 border-2 border-purple-200 text-center">
            <p className="text-sm text-gray-600 mb-2">Taxa de Ocupação</p>
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {occupancyRate.toFixed(1)}%
              </span>
            </div>
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${status.bgColor} ${status.borderColor} border-2`}
            >
              <span className="text-xl">{status.icon}</span>
              <span className={`font-semibold ${status.color}`}>
                {status.label}
              </span>
            </div>
          </div>

          {/* Barra de progresso visual */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-600">
              <span>0%</span>
              <span>50%</span>
              <span>75%</span>
              <span>90%</span>
              <span>100%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500 rounded-full"
                style={{ width: `${Math.min(occupancyRate, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Interpretação e recomendações */}
      <Card className="p-6 border-2 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-purple-600" />
          Interpretação
        </h3>

        <div className="space-y-3">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <span className="text-xl">🔴</span>
              <div>
                <p className="font-semibold text-red-900 mb-1">
                  Até 50% - Baixa ocupação
                </p>
                <p className="text-sm text-red-700">
                  Muitos horários ociosos. Considere estratégias de marketing,
                  promoções ou ampliação de serviços para aumentar o fluxo de
                  pacientes.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <span className="text-xl">🟡</span>
              <div>
                <p className="font-semibold text-yellow-900 mb-1">
                  51% a 75% - Ocupação média
                </p>
                <p className="text-sm text-yellow-700">
                  Há espaço para crescimento. Otimize a agenda e busque
                  preencher os horários vagos com procedimentos rápidos ou
                  consultas de retorno.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-2">
              <span className="text-xl">🟢</span>
              <div>
                <p className="font-semibold text-green-900 mb-1">
                  76% a 90% - Ocupação ideal
                </p>
                <p className="text-sm text-green-700">
                  Excelente! Sua clínica está operando em um nível saudável,
                  com boa produtividade e espaço para imprevistos e qualidade no
                  atendimento.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <span className="text-xl">🔵</span>
              <div>
                <p className="font-semibold text-blue-900 mb-1">
                  Acima de 90% - Ocupação máxima
                </p>
                <p className="text-sm text-blue-700">
                  Atenção! Sua equipe pode estar sobrecarregada. Considere
                  contratar mais profissionais, aumentar cadeiras ou revisar a
                  agenda para manter a qualidade.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Nota importante */}
      <Card className="p-4 bg-purple-50 border-2 border-purple-200">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-purple-800">
              <strong>Nota:</strong> A taxa de ocupação é um indicador de
              desempenho e não altera diretamente os cálculos financeiros. Use
              este dado como referência para análises estratégicas e tomada de
              decisões sobre expansão, contratações e otimização de agenda.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
