"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Clock, Armchair, Save, AlertCircle } from "lucide-react";
import type { ClinicData, ClinicProfile } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface ClinicSettingsTabProps {
  clinicData: ClinicData;
  onUpdateData: (data: ClinicData) => void;
}

export function ClinicSettingsTab({ clinicData, onUpdateData }: ClinicSettingsTabProps) {
  const [profile, setProfile] = useState<ClinicProfile>(clinicData.profile);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: keyof ClinicProfile, value: string | number) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    const updatedData: ClinicData = {
      ...clinicData,
      profile,
    };

    onUpdateData(updatedData);
    setHasChanges(false);

    toast({
      title: "✅ Configurações atualizadas!",
      description: "As informações da clínica foram salvas com sucesso. Todos os cálculos foram atualizados automaticamente.",
      variant: "default",
    });
  };

  const handleCancel = () => {
    setProfile(clinicData.profile);
    setHasChanges(false);

    toast({
      title: "Alterações canceladas",
      description: "As configurações foram restauradas para os valores anteriores.",
      variant: "default",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Configurações da Clínica</h2>
          <p className="text-gray-600 mt-1">
            Edite as informações básicas da sua clínica sem refazer o cadastro completo
          </p>
        </div>
      </div>

      {/* Alerta de mudanças não salvas */}
      {hasChanges && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-800">
              Você tem alterações não salvas
            </p>
            <p className="text-xs text-amber-700 mt-1">
              Clique em "Salvar Alterações" para aplicar as mudanças ou "Cancelar" para descartar.
            </p>
          </div>
        </div>
      )}

      {/* Informações Básicas */}
      <Card className="border-2 border-purple-100 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-purple-600" />
            <CardTitle>Informações Básicas</CardTitle>
          </div>
          <CardDescription>
            Nome e identificação da clínica
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clinicName">Nome da Clínica</Label>
            <Input
              id="clinicName"
              value={profile.clinicName}
              onChange={(e) => handleInputChange("clinicName", e.target.value)}
              placeholder="Ex: Clínica Odonto Sorriso"
              className="border-purple-200 focus:border-purple-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Horário de Funcionamento */}
      <Card className="border-2 border-purple-100 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-600" />
            <CardTitle>Horário de Funcionamento</CardTitle>
          </div>
          <CardDescription>
            Defina os horários de atendimento da clínica
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="workingDays">Dias de Trabalho (por mês)</Label>
              <Input
                id="workingDays"
                type="number"
                min="1"
                max="31"
                value={profile.workingDays}
                onChange={(e) => handleInputChange("workingDays", parseInt(e.target.value) || 0)}
                className="border-purple-200 focus:border-purple-400"
              />
              <p className="text-xs text-gray-500">
                Quantos dias por mês a clínica funciona
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hoursPerDay">Horas por Dia</Label>
              <Input
                id="hoursPerDay"
                type="number"
                min="1"
                max="24"
                step="0.5"
                value={profile.hoursPerDay}
                onChange={(e) => handleInputChange("hoursPerDay", parseFloat(e.target.value) || 0)}
                className="border-purple-200 focus:border-purple-400"
              />
              <p className="text-xs text-gray-500">
                Quantas horas por dia de atendimento
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Total de horas mensais:</strong>{" "}
              {(profile.workingDays * profile.hoursPerDay).toFixed(1)} horas
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Estrutura da Clínica */}
      <Card className="border-2 border-purple-100 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center gap-2">
            <Armchair className="w-5 h-5 text-purple-600" />
            <CardTitle>Estrutura da Clínica</CardTitle>
          </div>
          <CardDescription>
            Capacidade de atendimento
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="chairs">Número de Cadeiras</Label>
            <Input
              id="chairs"
              type="number"
              min="1"
              max="50"
              value={profile.chairs}
              onChange={(e) => handleInputChange("chairs", parseInt(e.target.value) || 0)}
              className="border-purple-200 focus:border-purple-400"
            />
            <p className="text-xs text-gray-500">
              Quantas cadeiras odontológicas a clínica possui
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Botões de Ação */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4">
        <Button
          variant="outline"
          onClick={handleCancel}
          disabled={!hasChanges}
          className="border-gray-300 hover:bg-gray-50"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          disabled={!hasChanges}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white gap-2"
        >
          <Save className="w-4 h-4" />
          Salvar Alterações
        </Button>
      </div>

      {/* Informações Adicionais */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h3 className="font-semibold text-purple-900 mb-2">💡 Dica Importante</h3>
        <p className="text-sm text-purple-800">
          Alterações nestas configurações afetarão automaticamente todos os cálculos de custos,
          precificação e resultados. Não é necessário refazer o cadastro completo.
        </p>
      </div>
    </div>
  );
}
