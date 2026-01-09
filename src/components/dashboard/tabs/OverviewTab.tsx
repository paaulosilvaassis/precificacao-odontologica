import { Card } from "@/components/ui/card";
import { calculateClinicCosts, formatCurrency } from "@/lib/calculations";
import type { ClinicData, Treatment } from "@/lib/types";
import {
  Clock,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Building2,
  Users,
  Target,
} from "lucide-react";

interface OverviewTabProps {
  clinicData: ClinicData;
  treatments: Treatment[];
}

export function OverviewTab({ clinicData, treatments }: OverviewTabProps) {
  const costs = calculateClinicCosts(clinicData);

  const stats = [
    {
      label: "Custo Total Mensal",
      value: formatCurrency(costs.totalMonthlyCosts),
      icon: DollarSign,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
    },
    {
      label: "Custo por Hora",
      value: formatCurrency(costs.costPerHour),
      icon: Clock,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
    },
    {
      label: "Custo por Minuto",
      value: formatCurrency(costs.costPerMinute),
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
    },
    {
      label: "Horas Trabalhadas/Mês",
      value: costs.workingHoursPerMonth.toFixed(0) + "h",
      icon: Target,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Boas-vindas */}
      <Card className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white p-6 sm:p-8 border-0 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
            <Building2 className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              {clinicData.profile.name}
            </h2>
            <p className="text-white/90 text-sm sm:text-base">
              {clinicData.profile.city}, {clinicData.profile.state} •{" "}
              {clinicData.profile.chairs} cadeira(s) •{" "}
              {clinicData.profile.daysPerWeek} dias/semana
            </p>
          </div>
        </div>
      </Card>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className={`${stat.bgColor} border-2 border-purple-100 p-6 hover:shadow-lg transition-shadow`}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className={`bg-gradient-to-br ${stat.color} p-3 rounded-xl shadow-lg`}
              >
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.textColor}`}>
              {stat.value}
            </p>
          </Card>
        ))}
      </div>

      {/* Breakdown de custos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border-2 border-purple-100 bg-white">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-purple-600" />
            Composição dos Custos
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-gray-700">Custos Fixos</span>
              <span className="font-semibold text-purple-700">
                {formatCurrency(costs.totalFixedCosts)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-pink-50 rounded-lg">
              <span className="text-gray-700">Equipe + Pró-labore</span>
              <span className="font-semibold text-pink-700">
                {formatCurrency(costs.totalTeamCosts)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-700">Depreciação</span>
              <span className="font-semibold text-blue-700">
                {formatCurrency(costs.totalDepreciation)}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border-2 border-purple-200">
              <span className="font-semibold text-gray-800">TOTAL</span>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {formatCurrency(costs.totalMonthlyCosts)}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2 border-purple-100 bg-white">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Informações da Equipe
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Funcionários</p>
              <p className="text-lg font-semibold text-gray-800">
                {clinicData.team.employees.length || "Nenhum"}
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Dentistas Parceiros</p>
              <p className="text-lg font-semibold text-gray-800">
                {clinicData.team.partnerDentists.length || "Nenhum"}
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Pró-labore Desejado</p>
              <p className="text-lg font-semibold text-green-700">
                {formatCurrency(clinicData.goals.proLabore)}
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Margem de Lucro</p>
              <p className="text-lg font-semibold text-blue-700">
                {clinicData.goals.profitMargin}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Alerta se não tiver tratamentos */}
      {treatments.length === 0 && (
        <Card className="bg-orange-50 border-2 border-orange-200 p-6">
          <div className="flex items-start gap-4">
            <div className="bg-orange-100 p-3 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h4 className="font-semibold text-orange-900 mb-1">
                Comece a precificar seus tratamentos
              </h4>
              <p className="text-sm text-orange-700">
                Vá para a aba "Precificar" para calcular o preço ideal dos seus procedimentos com base nos seus custos reais.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
