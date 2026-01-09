import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  calculateClinicCosts,
  calculateTreatmentPricing,
  formatCurrency,
} from "@/lib/calculations";
import type { ClinicData, Treatment } from "@/lib/types";
import {
  Heart,
  Trash2,
  Clock,
  DollarSign,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

interface TreatmentsTabProps {
  treatments: Treatment[];
  clinicData: ClinicData;
  onRemoveTreatment: (id: string) => void;
}

export function TreatmentsTab({
  treatments,
  clinicData,
  onRemoveTreatment,
}: TreatmentsTabProps) {
  const costs = calculateClinicCosts(clinicData);

  // Função para converter minutos em horas formatadas
  const formatMinutesToHours = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `0h${mins.toString().padStart(2, '0')}`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h${mins.toString().padStart(2, '0')}`;
  };

  if (treatments.length === 0) {
    return (
      <Card className="p-12 text-center border-2 border-dashed border-purple-300 bg-purple-50/50">
        <div className="bg-purple-100 p-6 rounded-full w-fit mx-auto mb-4">
          <Heart className="w-12 h-12 text-purple-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Nenhum tratamento salvo ainda
        </h3>
        <p className="text-gray-600 mb-6">
          Vá para a aba "Precificar" para calcular e salvar seus tratamentos
        </p>
      </Card>
    );
  }

  // Calcular lucro de cada tratamento
  const treatmentsWithPricing = treatments.map((treatment) => {
    const pricing = calculateTreatmentPricing(
      treatment,
      costs,
      clinicData.goals.profitMargin
    );
    return { treatment, pricing };
  });

  // Ordenar por lucro (ideal price - real cost)
  const sortedTreatments = [...treatmentsWithPricing].sort((a, b) => {
    const profitA = a.pricing.idealPrice - a.pricing.realCost;
    const profitB = b.pricing.idealPrice - b.pricing.realCost;
    return profitB - profitA;
  });

  const mostProfitable = sortedTreatments[0];
  const leastProfitable = sortedTreatments[sortedTreatments.length - 1];

  return (
    <div className="space-y-6">
      {/* Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-600">
              Total de Tratamentos
            </span>
          </div>
          <p className="text-3xl font-bold text-purple-700">{treatments.length}</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-gray-600">
              Mais Lucrativo
            </span>
          </div>
          <p className="text-lg font-bold text-green-700 truncate">
            {mostProfitable.treatment.name}
          </p>
          <p className="text-sm text-green-600">
            {formatCurrency(
              mostProfitable.pricing.idealPrice - mostProfitable.pricing.realCost
            )}{" "}
            de lucro
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-gray-600">
              Menos Lucrativo
            </span>
          </div>
          <p className="text-lg font-bold text-orange-700 truncate">
            {leastProfitable.treatment.name}
          </p>
          <p className="text-sm text-orange-600">
            {formatCurrency(
              leastProfitable.pricing.idealPrice - leastProfitable.pricing.realCost
            )}{" "}
            de lucro
          </p>
        </Card>
      </div>

      {/* Lista de tratamentos */}
      <div className="space-y-4">
        {sortedTreatments.map(({ treatment, pricing }, index) => {
          const profit = pricing.idealPrice - pricing.realCost;
          const profitMargin = (profit / pricing.realCost) * 100;

          return (
            <Card
              key={treatment.id}
              className="p-6 border-2 border-purple-100 hover:shadow-lg transition-shadow bg-white"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Heart className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-800 mb-1">
                        {treatment.name}
                      </h4>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {treatment.durationMinutes} min
                        </span>
                        <span className="text-purple-600 font-semibold">
                          ⏱️ {formatMinutesToHours(treatment.durationMinutes)}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          Custo: {formatCurrency(pricing.realCost)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                      <p className="text-xs text-yellow-700 mb-1">Mínimo</p>
                      <p className="text-sm font-bold text-yellow-800">
                        {formatCurrency(pricing.minimumPrice)}
                      </p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <p className="text-xs text-green-700 mb-1">⭐ Ideal</p>
                      <p className="text-sm font-bold text-green-800">
                        {formatCurrency(pricing.idealPrice)}
                      </p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                      <p className="text-xs text-purple-700 mb-1">🚀 Estratégico</p>
                      <p className="text-sm font-bold text-purple-800">
                        {formatCurrency(pricing.strategicPrice)}
                      </p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <p className="text-xs text-blue-700 mb-1">Lucro</p>
                      <p className="text-sm font-bold text-blue-800">
                        {formatCurrency(profit)}
                      </p>
                      <p className="text-xs text-blue-600">
                        {profitMargin.toFixed(0)}%
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => onRemoveTreatment(treatment.id)}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Badge de ranking */}
              {index === 0 && (
                <div className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold border border-green-300">
                  <TrendingUp className="w-3 h-3" />
                  Tratamento mais lucrativo
                </div>
              )}
              {index === sortedTreatments.length - 1 && sortedTreatments.length > 1 && (
                <div className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 px-3 py-1 rounded-full text-xs font-semibold border border-orange-300">
                  <AlertCircle className="w-3 h-3" />
                  Considere revisar este preço
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
