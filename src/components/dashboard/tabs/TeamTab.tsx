"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoneyInput } from "@/components/ui/money-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Users, AlertCircle, RefreshCw, Briefcase } from "lucide-react";
import type { ClinicData, Employee, LaborCharge } from "@/lib/types";
import { formatCurrency } from "@/lib/calculations";
import { calculateEmployeeTotalCost } from "@/lib/calculations";
import { useToast } from "@/hooks/use-toast";

interface TeamTabProps {
  clinicData: ClinicData;
  onUpdateData: (data: ClinicData) => void;
}

interface Partner {
  socio_id: string;
  nome_socio: string;
  prolabore_mensal: number;
  inss_prolabore_percentual: number;
  inss_prolabore_valor: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

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

// 🔑 CHAVE ÚNICA PARA PERSISTÊNCIA DA BASE DE EQUIPE
const TEAM_STORAGE_KEY = "bestPriceOdonto_TeamBase";
const PROLABORE_STORAGE_KEY = "socios_prolabore";

export function TeamTab({ clinicData, onUpdateData }: TeamTabProps) {
  const { toast } = useToast();
  const [showEmployeeDialog, setShowEmployeeDialog] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [showChargesDialog, setShowChargesDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Pró-labore state
  const [partners, setPartners] = useState<Partner[]>([]);
  const [showPartnerDialog, setShowPartnerDialog] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [partnerFormData, setPartnerFormData] = useState({
    nome_socio: "",
    prolabore_mensal: "0",
    inss_prolabore_percentual: "11",
  });

  // Form state
  const [employeeName, setEmployeeName] = useState("");
  const [employeeRole, setEmployeeRole] = useState("");
  const [employmentType, setEmploymentType] = useState<"CLT" | "Outros">("CLT");
  const [grossSalary, setGrossSalary] = useState(0);

  // 🔄 SINCRONIZAÇÃO AUTOMÁTICA COM LOCALSTORAGE - EQUIPE
  useEffect(() => {
    if (clinicData.team?.employees) {
      localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(clinicData.team));
    }
  }, [clinicData.team]);

  // 🔄 CARREGAR DADOS SALVOS AO MONTAR O COMPONENTE - EQUIPE
  useEffect(() => {
    const savedTeam = localStorage.getItem(TEAM_STORAGE_KEY);
    if (savedTeam && (!clinicData.team?.employees || clinicData.team.employees.length === 0)) {
      try {
        const parsedTeam = JSON.parse(savedTeam);
        onUpdateData({
          ...clinicData,
          team: parsedTeam,
        });
      } catch (error) {
        console.error("Erro ao carregar equipe salva:", error);
      }
    }
  }, []);

  // 🔄 CARREGAR PRÓ-LABORE DO LOCALSTORAGE
  useEffect(() => {
    const savedPartners = localStorage.getItem(PROLABORE_STORAGE_KEY);
    if (savedPartners) {
      try {
        const parsed = JSON.parse(savedPartners);
        setPartners(parsed);
      } catch (error) {
        console.error("Erro ao carregar sócios:", error);
      }
    }
  }, []);

  // 🔄 SALVAR PRÓ-LABORE NO LOCALSTORAGE
  useEffect(() => {
    if (partners.length > 0) {
      localStorage.setItem(PROLABORE_STORAGE_KEY, JSON.stringify(partners));
    }
  }, [partners]);

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setEmployeeName("");
    setEmployeeRole("");
    setEmploymentType("CLT");
    setGrossSalary(0);
    setShowEmployeeDialog(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setEmployeeName(employee.name);
    setEmployeeRole(employee.role);
    setEmploymentType(employee.employmentType);
    setGrossSalary(employee.grossSalary || 0);
    setShowEmployeeDialog(true);
  };

  const handleSaveEmployee = () => {
    if (!employeeName || !employeeRole || !grossSalary) {
      toast({
        title: "⚠️ Campos obrigatórios",
        description: "Preencha todos os campos para continuar.",
        variant: "destructive",
      });
      return;
    }

    const newEmployee: Employee = {
      id: editingEmployee?.id || `emp-${Date.now()}`,
      name: employeeName,
      role: employeeRole,
      employmentType,
      grossSalary: grossSalary,
      laborCharges: editingEmployee?.laborCharges || [...DEFAULT_LABOR_CHARGES],
    };

    const updatedEmployees = editingEmployee
      ? clinicData.team.employees.map((emp) =>
          emp.id === editingEmployee.id ? newEmployee : emp
        )
      : [...clinicData.team.employees, newEmployee];

    const updatedTeam = {
      ...clinicData.team,
      employees: updatedEmployees,
    };

    onUpdateData({
      ...clinicData,
      team: updatedTeam,
    });

    localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(updatedTeam));

    toast({
      title: "✅ Funcionário salvo",
      description: `${employeeName} foi ${editingEmployee ? "atualizado" : "adicionado"} com sucesso!`,
      variant: "default",
    });

    setShowEmployeeDialog(false);
  };

  const handleDeleteEmployee = (id: string) => {
    const employee = clinicData.team.employees.find((emp) => emp.id === id);
    const updatedEmployees = clinicData.team.employees.filter((emp) => emp.id !== id);
    
    const updatedTeam = {
      ...clinicData.team,
      employees: updatedEmployees,
    };

    onUpdateData({
      ...clinicData,
      team: updatedTeam,
    });

    localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(updatedTeam));

    toast({
      title: "🗑️ Funcionário removido",
      description: `${employee?.name} foi removido da equipe.`,
      variant: "default",
    });
  };

  const handleEditCharges = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowChargesDialog(true);
  };

  const handleUpdateCharge = (chargeId: string, newPercentage: number) => {
    if (!selectedEmployee) return;

    const updatedCharges = (selectedEmployee.laborCharges || []).map((charge) =>
      charge.id === chargeId ? { ...charge, percentage: newPercentage } : charge
    );

    const updatedEmployee = { ...selectedEmployee, laborCharges: updatedCharges };

    const updatedEmployees = clinicData.team.employees.map((emp) =>
      emp.id === selectedEmployee.id ? updatedEmployee : emp
    );

    const updatedTeam = {
      ...clinicData.team,
      employees: updatedEmployees,
    };

    onUpdateData({
      ...clinicData,
      team: updatedTeam,
    });

    localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(updatedTeam));

    setSelectedEmployee(updatedEmployee);
  };

  const handleRefreshTeamBase = () => {
    const updatedTeam = {
      ...clinicData.team,
      employees: clinicData.team.employees.map((emp) => ({
        ...emp,
        laborCharges: emp.laborCharges || [...DEFAULT_LABOR_CHARGES],
      })),
    };

    onUpdateData({
      ...clinicData,
      team: updatedTeam,
    });

    localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(updatedTeam));

    localStorage.setItem("bestPriceOdontoData", JSON.stringify({
      ...clinicData,
      team: updatedTeam,
    }));

    toast({
      title: "🔄 Base atualizada",
      description: "Todos os custos da equipe foram recalculados com sucesso!",
      variant: "default",
    });
  };

  // PRÓ-LABORE FUNCTIONS
  const handleOpenPartnerDialog = (partner?: Partner) => {
    if (partner) {
      setEditingPartner(partner);
      setPartnerFormData({
        nome_socio: partner.nome_socio,
        prolabore_mensal: partner.prolabore_mensal.toString(),
        inss_prolabore_percentual: partner.inss_prolabore_percentual.toString(),
      });
    } else {
      setEditingPartner(null);
      setPartnerFormData({
        nome_socio: "",
        prolabore_mensal: "0",
        inss_prolabore_percentual: "11",
      });
    }
    setShowPartnerDialog(true);
  };

  const handleClosePartnerDialog = () => {
    setShowPartnerDialog(false);
    setEditingPartner(null);
    setPartnerFormData({
      nome_socio: "",
      prolabore_mensal: "0",
      inss_prolabore_percentual: "11",
    });
  };

  const handleSavePartner = () => {
    const prolabore = parseFloat(partnerFormData.prolabore_mensal) || 0;
    const inssPercentual = parseFloat(partnerFormData.inss_prolabore_percentual) || 0;
    const inssValor = (prolabore * inssPercentual) / 100;

    if (!partnerFormData.nome_socio.trim()) {
      toast({
        title: "⚠️ Nome obrigatório",
        description: "Nome do sócio é obrigatório",
        variant: "destructive",
      });
      return;
    }

    if (prolabore <= 0) {
      toast({
        title: "⚠️ Valor inválido",
        description: "Pró-labore mensal deve ser maior que zero",
        variant: "destructive",
      });
      return;
    }

    const now = new Date().toISOString();

    if (editingPartner) {
      setPartners(partners.map(p => 
        p.socio_id === editingPartner.socio_id
          ? {
              ...p,
              nome_socio: partnerFormData.nome_socio,
              prolabore_mensal: prolabore,
              inss_prolabore_percentual: inssPercentual,
              inss_prolabore_valor: inssValor,
              updated_at: now,
            }
          : p
      ));
      toast({
        title: "✅ Sócio atualizado",
        description: `${partnerFormData.nome_socio} foi atualizado com sucesso!`,
        variant: "default",
      });
    } else {
      const newPartner: Partner = {
        socio_id: `socio_${Date.now()}`,
        nome_socio: partnerFormData.nome_socio,
        prolabore_mensal: prolabore,
        inss_prolabore_percentual: inssPercentual,
        inss_prolabore_valor: inssValor,
        ativo: true,
        created_at: now,
        updated_at: now,
      };
      setPartners([...partners, newPartner]);
      toast({
        title: "✅ Sócio adicionado",
        description: `${partnerFormData.nome_socio} foi adicionado com sucesso!`,
        variant: "default",
      });
    }

    handleClosePartnerDialog();
  };

  const handleRemovePartner = (socio_id: string) => {
    const partner = partners.find(p => p.socio_id === socio_id);
    setPartners(partners.map(p => 
      p.socio_id === socio_id ? { ...p, ativo: false, updated_at: new Date().toISOString() } : p
    ));
    toast({
      title: "🗑️ Sócio desativado",
      description: `${partner?.nome_socio} foi desativado.`,
      variant: "default",
    });
  };

  const calculateTotalTeamCost = () => {
    return (clinicData.team?.employees || []).reduce((sum, emp) => {
      return sum + calculateEmployeeTotalCost(emp);
    }, 0);
  };

  const calculateTotalProLabore = () => {
    return partners
      .filter(p => p.ativo)
      .reduce((sum, p) => sum + p.prolabore_mensal, 0);
  };

  const calculateTotalINSS = () => {
    return partners
      .filter(p => p.ativo)
      .reduce((sum, p) => sum + p.inss_prolabore_valor, 0);
  };

  const calculateEmployeeCharges = (employee: Employee) => {
    if (!employee.laborCharges || !Array.isArray(employee.laborCharges)) {
      return { totalPercentage: 0, totalValue: 0 };
    }
    
    const totalPercentage = employee.laborCharges.reduce(
      (sum, charge) => sum + charge.percentage,
      0
    );
    const totalValue = employee.grossSalary * (totalPercentage / 100);
    return { totalPercentage, totalValue };
  };

  const employees = clinicData.team?.employees || [];
  const activePartners = partners.filter(p => p.ativo);
  const totalProLabore = calculateTotalProLabore();
  const totalINSS = calculateTotalINSS();

  return (
    <div className="space-y-6">
      {/* Header com resumo geral */}
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Users className="w-6 h-6 text-purple-600" />
            Equipe e Salários
          </CardTitle>
          <CardDescription className="text-base">
            Gerencie sua equipe, funcionários e pró-labore dos sócios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <p className="text-sm text-gray-600 mb-1">Total de Funcionários</p>
              <p className="text-2xl font-bold text-purple-600">
                {employees.length}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <p className="text-sm text-gray-600 mb-1">Custo Total da Equipe</p>
              <p className="text-2xl font-bold text-pink-600">
                {formatCurrency(calculateTotalTeamCost())}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <p className="text-sm text-gray-600 mb-1">Média por Funcionário</p>
              <p className="text-2xl font-bold text-purple-600">
                {employees.length > 0
                  ? formatCurrency(calculateTotalTeamCost() / employees.length)
                  : "R$ 0,00"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Aviso educativo */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-amber-800">
                <strong>💾 Sincronização Automática Ativada:</strong> Todos os salários e dados da equipe são salvos automaticamente e sincronizados em todo o app. Você não precisará redigitar essas informações em outras áreas.
              </p>
              <p className="text-sm text-amber-800 mt-2">
                <strong>Os encargos podem variar conforme regime e região.</strong> Ajuste os percentuais conforme sua contabilidade para obter o custo real da sua equipe.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEÇÃO 1: FUNCIONÁRIOS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Equipe (Funcionários)
          </h2>
          <div className="flex gap-2">
            <Button
              onClick={handleRefreshTeamBase}
              variant="outline"
              className="gap-2 border-purple-300 text-purple-700 hover:bg-purple-50"
            >
              <RefreshCw className="w-4 h-4" />
              Atualizar Base
            </Button>
            <Button
              onClick={handleAddEmployee}
              className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Plus className="w-4 h-4" />
              Adicionar Funcionário
            </Button>
          </div>
        </div>

        {/* Lista de funcionários */}
        <div className="grid grid-cols-1 gap-4">
          {employees.length === 0 ? (
            <Card className="border-dashed border-2">
              <CardContent className="pt-6 text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Nenhum funcionário cadastrado</p>
                <p className="text-sm text-gray-500">
                  Adicione funcionários para calcular o custo real da sua equipe
                </p>
              </CardContent>
            </Card>
          ) : (
            employees.map((employee) => {
              const charges = calculateEmployeeCharges(employee);
              const totalCost = calculateEmployeeTotalCost(employee);

              return (
                <Card key={employee.id} className="border-2 hover:border-purple-300 transition-all">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{employee.name}</h3>
                            <p className="text-sm text-gray-600">{employee.role}</p>
                            <span className="inline-block mt-1 px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
                              {employee.employmentType}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-600 mb-1">Salário Bruto</p>
                            <p className="text-lg font-semibold text-gray-900">
                              {formatCurrency(employee.grossSalary)}
                            </p>
                          </div>
                          <div className="bg-purple-50 rounded-lg p-3">
                            <p className="text-xs text-gray-600 mb-1">Total de Encargos</p>
                            <p className="text-lg font-semibold text-purple-600">
                              {formatCurrency(charges.totalValue)}
                            </p>
                            <p className="text-xs text-purple-500 mt-1">
                              {charges.totalPercentage.toFixed(2)}%
                            </p>
                          </div>
                          <div className="bg-pink-50 rounded-lg p-3">
                            <p className="text-xs text-gray-600 mb-1">Custo Total</p>
                            <p className="text-lg font-semibold text-pink-600">
                              {formatCurrency(totalCost)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex md:flex-col gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditCharges(employee)}
                          className="gap-2 flex-1 md:flex-none"
                        >
                          Encargos (%)
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditEmployee(employee)}
                          className="gap-2 flex-1 md:flex-none"
                        >
                          <Edit className="w-4 h-4" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteEmployee(employee.id)}
                          className="gap-2 text-red-600 hover:bg-red-50 flex-1 md:flex-none"
                        >
                          <Trash2 className="w-4 h-4" />
                          Excluir
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* SEÇÃO 2: SÓCIOS - PRÓ-LABORE */}
      <div className="space-y-4 pt-8 border-t-4 border-purple-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-purple-600" />
              Sócios – Pró-labore
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Gerencie os valores de pró-labore dos sócios da clínica
            </p>
          </div>
          <Button
            onClick={() => handleOpenPartnerDialog()}
            className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Plus className="w-4 h-4" />
            Adicionar Sócio
          </Button>
        </div>

        {/* Card de Resumo Pró-labore */}
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 border-2 border-purple-100">
                <p className="text-sm text-gray-600 mb-1">Total Mensal Pró-labore</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(totalProLabore)}</p>
              </div>
              <div className="bg-white rounded-lg p-4 border-2 border-blue-100">
                <p className="text-sm text-gray-600 mb-1">Total INSS Mensal</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalINSS)}</p>
              </div>
              <div className="bg-white rounded-lg p-4 border-2 border-pink-100">
                <p className="text-sm text-gray-600 mb-1">Sócios Ativos</p>
                <p className="text-2xl font-bold text-pink-600">{activePartners.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Sócios */}
        <div className="grid grid-cols-1 gap-4">
          {activePartners.length === 0 ? (
            <Card className="border-dashed border-2">
              <CardContent className="pt-6 text-center py-12">
                <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Nenhum sócio cadastrado</p>
                <p className="text-sm text-gray-500">
                  Adicione sócios para gerenciar o pró-labore
                </p>
              </CardContent>
            </Card>
          ) : (
            activePartners.map((partner) => (
              <Card key={partner.socio_id} className="border-2 border-gray-200 hover:border-purple-300 transition-all">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <h3 className="text-xl font-bold text-gray-900">{partner.nome_socio}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <p className="text-sm text-gray-600">Pró-labore Mensal</p>
                          <p className="text-lg font-semibold text-purple-600">
                            {formatCurrency(partner.prolabore_mensal)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">INSS ({partner.inss_prolabore_percentual}%)</p>
                          <p className="text-lg font-semibold text-blue-600">
                            {formatCurrency(partner.inss_prolabore_valor)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total com INSS</p>
                          <p className="text-lg font-semibold text-pink-600">
                            {formatCurrency(partner.prolabore_mensal + partner.inss_prolabore_valor)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleOpenPartnerDialog(partner)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleRemovePartner(partner.socio_id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Informações Importantes sobre Pró-labore */}
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-3 text-blue-900">ℹ️ Informações Importantes</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• O pró-labore é a remuneração dos sócios e não deve ser confundido com salário de funcionários CLT</li>
              <li>• Os valores de pró-labore são incluídos automaticamente nos custos mensais da clínica</li>
              <li>• O INSS sobre pró-labore é calculado automaticamente com base no percentual informado</li>
              <li>• Ao desativar um sócio, o histórico é mantido mas ele não entra mais nos cálculos</li>
              <li>• Todos os dados são salvos automaticamente e persistem entre sessões</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Dialog de adicionar/editar funcionário */}
      <Dialog open={showEmployeeDialog} onOpenChange={setShowEmployeeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingEmployee ? "Editar Funcionário" : "Adicionar Funcionário"}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados básicos do colaborador. Os encargos podem ser ajustados depois.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                placeholder="Ex: Maria Silva"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Cargo / Função</Label>
              <Input
                id="role"
                value={employeeRole}
                onChange={(e) => setEmployeeRole(e.target.value)}
                placeholder="Ex: Auxiliar de Saúde Bucal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de vínculo</Label>
              <Select value={employmentType} onValueChange={(v) => setEmploymentType(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CLT">CLT</SelectItem>
                  <SelectItem value="Outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary">Salário bruto mensal</Label>
              <MoneyInput
                id="salary"
                value={grossSalary}
                onChange={setGrossSalary}
                placeholder="R$ 0,00"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmployeeDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSaveEmployee}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {editingEmployee ? "Salvar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de editar encargos */}
      <Dialog open={showChargesDialog} onOpenChange={setShowChargesDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Configuração Avançada de Encargos - {selectedEmployee?.name}</DialogTitle>
            <DialogDescription>
              Ajuste os percentuais de encargos trabalhistas conforme sua realidade contábil
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {selectedEmployee?.laborCharges && Array.isArray(selectedEmployee.laborCharges) && selectedEmployee.laborCharges.map((charge) => (
              <div
                key={charge.id}
                className="flex items-center justify-between gap-4 p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-900">{charge.name}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Valor: {formatCurrency((selectedEmployee.grossSalary * charge.percentage) / 100)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={charge.percentage}
                    onChange={(e) => handleUpdateCharge(charge.id, parseFloat(e.target.value) || 0)}
                    className="w-24 text-right"
                    step="0.01"
                  />
                  <span className="text-sm text-gray-600">%</span>
                </div>
              </div>
            ))}
            <div className="mt-4 p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Total de Encargos:</span>
                <div className="text-right">
                  <p className="text-lg font-bold text-purple-600">
                    {selectedEmployee &&
                      formatCurrency(calculateEmployeeCharges(selectedEmployee).totalValue)}
                  </p>
                  <p className="text-sm text-purple-500">
                    {selectedEmployee &&
                      calculateEmployeeCharges(selectedEmployee).totalPercentage.toFixed(2)}%
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-purple-200">
                <span className="font-semibold text-gray-900">Custo Total do Funcionário:</span>
                <p className="text-xl font-bold text-pink-600">
                  {selectedEmployee && formatCurrency(calculateEmployeeTotalCost(selectedEmployee))}
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setShowChargesDialog(false)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Concluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de adicionar/editar sócio */}
      <Dialog open={showPartnerDialog} onOpenChange={setShowPartnerDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingPartner ? "Editar Sócio" : "Adicionar Sócio"}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados do sócio e seu pró-labore mensal
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome_socio">
                Nome do Sócio *
              </Label>
              <Input
                id="nome_socio"
                value={partnerFormData.nome_socio}
                onChange={(e) => setPartnerFormData({ ...partnerFormData, nome_socio: e.target.value })}
                placeholder="Ex: João Silva"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prolabore_mensal">
                Pró-labore Mensal (R$) *
              </Label>
              <Input
                id="prolabore_mensal"
                type="number"
                value={partnerFormData.prolabore_mensal}
                onChange={(e) => setPartnerFormData({ ...partnerFormData, prolabore_mensal: e.target.value })}
                placeholder="Ex: 5000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inss_prolabore_percentual">
                INSS sobre Pró-labore (%)
              </Label>
              <Input
                id="inss_prolabore_percentual"
                type="number"
                value={partnerFormData.inss_prolabore_percentual}
                onChange={(e) => setPartnerFormData({ ...partnerFormData, inss_prolabore_percentual: e.target.value })}
                placeholder="Ex: 11"
              />
              <p className="text-sm text-gray-600">
                Valor calculado: {formatCurrency((parseFloat(partnerFormData.prolabore_mensal) || 0) * (parseFloat(partnerFormData.inss_prolabore_percentual) || 0) / 100)}
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={handleClosePartnerDialog}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSavePartner}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {editingPartner ? "Salvar Alterações" : "Adicionar Sócio"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
