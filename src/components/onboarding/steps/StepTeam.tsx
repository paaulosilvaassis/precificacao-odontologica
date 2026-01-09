"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Plus, Trash2, UserCheck } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Team, Employee, PartnerDentist, LaborCharge } from "@/lib/types";

interface StepTeamProps {
  onNext: (data: Team) => void;
  onBack: () => void;
  initialData: Team | null;
}

// 🔑 CHAVE ÚNICA PARA SINCRONIZAÇÃO COM APP INTERNO
const TEAM_STORAGE_KEY = "bestPriceOdonto_TeamBase";

// 📋 ENCARGOS TRABALHISTAS PADRÃO (mesmos do TeamTab)
const DEFAULT_LABOR_CHARGES: LaborCharge[] = [
  { id: "fgts", name: "FGTS", percentage: 8 },
  { id: "inss-employer", name: "INSS Empregador", percentage: 20 },
  { id: "inss-third", name: "INSS Terceiros", percentage: 5.8 },
  { id: "rat", name: "RAT", percentage: 1 },
  { id: "13th", name: "13º Salário", percentage: 8.33 },
  { id: "vacation", name: "Férias + 1/3 de Férias", percentage: 11.11 },
  { id: "fgts-13-vacation", name: "FGTS sobre 13º e Férias", percentage: 3.2 },
  { id: "inss-13-vacation", name: "INSS sobre 13º e Férias", percentage: 20 },
  { id: "fgts-penalty", name: "Multa FGTS", percentage: 40 },
];

export function StepTeam({ onNext, onBack, initialData }: StepTeamProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [partnerDentists, setPartnerDentists] = useState<PartnerDentist[]>([]);

  // 🔄 CARREGAR DADOS SALVOS AO MONTAR O COMPONENTE
  useEffect(() => {
    // Prioridade 1: dados do localStorage (base oficial)
    const savedTeam = localStorage.getItem(TEAM_STORAGE_KEY);
    if (savedTeam) {
      try {
        const parsedTeam = JSON.parse(savedTeam);
        setEmployees(parsedTeam.employees || []);
        setPartnerDentists(parsedTeam.partnerDentists || []);
        return;
      } catch (error) {
        console.error("Erro ao carregar equipe salva:", error);
      }
    }

    // Prioridade 2: dados iniciais do onboarding
    if (initialData) {
      setEmployees(initialData.employees || []);
      setPartnerDentists(initialData.partnerDentists || []);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const teamData: Team = { employees, partnerDentists };
    
    // 🔄 SALVAR NA BASE OFICIAL (localStorage)
    localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(teamData));
    
    // Passar dados para o próximo passo
    onNext(teamData);
  };

  const addEmployee = () => {
    const newEmployee: Employee = {
      id: `emp-${Date.now()}`,
      name: "",
      role: "",
      employmentType: "CLT",
      grossSalary: 0,
      laborCharges: [...DEFAULT_LABOR_CHARGES],
    };
    setEmployees([...employees, newEmployee]);
  };

  const removeEmployee = (id: string) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
  };

  const updateEmployee = (id: string, field: keyof Employee, value: any) => {
    setEmployees(
      employees.map((emp) => (emp.id === id ? { ...emp, [field]: value } : emp))
    );
  };

  const addPartnerDentist = () => {
    setPartnerDentists([
      ...partnerDentists,
      {
        id: `partner-${Date.now()}`,
        name: "",
        type: "percentage",
        value: 0,
      },
    ]);
  };

  const removePartnerDentist = (id: string) => {
    setPartnerDentists(partnerDentists.filter((pd) => pd.id !== id));
  };

  const updatePartnerDentist = (
    id: string,
    field: keyof PartnerDentist,
    value: any
  ) => {
    setPartnerDentists(
      partnerDentists.map((pd) => (pd.id === id ? { ...pd, [field]: value } : pd))
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 p-3 rounded-xl">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">
            Equipe e Salários
          </h3>
        </div>

        {/* Aviso de sincronização */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>💾 Sincronização Automática:</strong> Os dados da equipe são salvos automaticamente e estarão disponíveis em todo o app. Você não precisará redigitar essas informações.
          </p>
        </div>

        {/* Funcionários */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-lg font-semibold">Funcionários</Label>
            <Button
              type="button"
              onClick={addEmployee}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 gap-2"
            >
              <Plus className="w-4 h-4" />
              Adicionar
            </Button>
          </div>

          {employees.length === 0 ? (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              Nenhum funcionário adicionado
            </div>
          ) : (
            <div className="space-y-4">
              {employees.map((employee) => (
                <div
                  key={employee.id}
                  className="p-4 border-2 border-purple-200 rounded-xl bg-purple-50/50 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-semibold text-purple-700">
                      Funcionário
                    </span>
                    <Button
                      type="button"
                      onClick={() => removeEmployee(employee.id)}
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <div className="space-y-2">
                      <Label>Nome</Label>
                      <Input
                        placeholder="Ex: Maria Silva"
                        value={employee.name}
                        onChange={(e) =>
                          updateEmployee(employee.id, "name", e.target.value)
                        }
                        required
                        className="border-purple-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Função</Label>
                      <Input
                        placeholder="Ex: Recepcionista"
                        value={employee.role}
                        onChange={(e) =>
                          updateEmployee(employee.id, "role", e.target.value)
                        }
                        required
                        className="border-purple-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Tipo de vínculo</Label>
                      <Select
                        value={employee.employmentType}
                        onValueChange={(value) =>
                          updateEmployee(employee.id, "employmentType", value as "CLT" | "Outros")
                        }
                      >
                        <SelectTrigger className="border-purple-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CLT">CLT</SelectItem>
                          <SelectItem value="Outros">Outros</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Salário bruto mensal (R$)</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0,00"
                        value={employee.grossSalary || ""}
                        onChange={(e) =>
                          updateEmployee(
                            employee.id,
                            "grossSalary",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        required
                        className="border-purple-300"
                      />
                    </div>
                  </div>

                  <div className="bg-purple-100 rounded-lg p-3 mt-3">
                    <p className="text-xs text-purple-700">
                      <strong>💡 Encargos trabalhistas:</strong> Os encargos padrão (FGTS, INSS, 13º, férias, etc.) já estão configurados automaticamente. Você pode ajustá-los depois na aba "Equipe e Salários".
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dentistas Parceiros */}
        <div className="space-y-4 pt-6 border-t-2 border-gray-200">
          <div className="flex items-center justify-between">
            <Label className="text-lg font-semibold flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-purple-600" />
              Dentistas Parceiros
            </Label>
            <Button
              type="button"
              onClick={addPartnerDentist}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 gap-2"
            >
              <Plus className="w-4 h-4" />
              Adicionar
            </Button>
          </div>

          {partnerDentists.length === 0 ? (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              Nenhum dentista parceiro adicionado
            </div>
          ) : (
            <div className="space-y-4">
              {partnerDentists.map((partner) => (
                <div
                  key={partner.id}
                  className="p-4 border-2 border-pink-200 rounded-xl bg-pink-50/50 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-semibold text-pink-700">
                      Dentista Parceiro
                    </span>
                    <Button
                      type="button"
                      onClick={() => removePartnerDentist(partner.id)}
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>Nome</Label>
                      <Input
                        placeholder="Ex: Dr. João Santos"
                        value={partner.name}
                        onChange={(e) =>
                          updatePartnerDentist(partner.id, "name", e.target.value)
                        }
                        required
                        className="border-pink-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Tipo de remuneração</Label>
                      <RadioGroup
                        value={partner.type}
                        onValueChange={(value) =>
                          updatePartnerDentist(
                            partner.id,
                            "type",
                            value as "percentage" | "fixed"
                          )
                        }
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="percentage" id={`perc-${partner.id}`} />
                          <Label htmlFor={`perc-${partner.id}`}>Percentual (%)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="fixed" id={`fixed-${partner.id}`} />
                          <Label htmlFor={`fixed-${partner.id}`}>Valor fixo (R$)</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label>
                        {partner.type === "percentage" ? "Percentual (%)" : "Valor (R$)"}
                      </Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder={partner.type === "percentage" ? "50" : "0,00"}
                        value={partner.value || ""}
                        onChange={(e) =>
                          updatePartnerDentist(
                            partner.id,
                            "value",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        required
                        className="border-pink-300"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-3 pt-6">
        <Button
          type="button"
          onClick={onBack}
          variant="outline"
          className="w-full sm:w-auto border-purple-200 hover:bg-purple-50"
        >
          Voltar
        </Button>
        <Button
          type="submit"
          className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8"
        >
          Continuar
        </Button>
      </div>
    </form>
  );
}
