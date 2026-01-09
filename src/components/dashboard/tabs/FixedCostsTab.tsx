"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { formatCurrency } from "@/lib/calculations";
import type { ClinicData, CustomFixedCost } from "@/lib/types";
import {
  Home,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  FileText,
  AlertTriangle,
} from "lucide-react";

interface FixedCostsTabProps {
  clinicData: ClinicData;
  onUpdateData: (data: ClinicData) => void;
}

// 📋 LISTA DE DESPESAS ADMINISTRATIVAS PADRÃO
const DEFAULT_ADMIN_EXPENSES = [
  { id: "rent", name: "Aluguel", value: 0 },
  { id: "iptu", name: "IPTU", value: 0 },
  { id: "condo", name: "Condomínio", value: 0 },
  { id: "internet", name: "Internet e telefone", value: 0 },
  { id: "water", name: "Água e esgoto", value: 0 },
  { id: "electricity", name: "Energia elétrica", value: 0 },
  { id: "accounting", name: "Contabilidade", value: 0 },
  { id: "events", name: "Confraternizações", value: 0 },
  { id: "bank", name: "Despesas bancárias", value: 0 },
  { id: "lawyer", name: "Honorários de advogados", value: 0 },
  { id: "meals", name: "Lanches e refeições", value: 0 },
  { id: "office", name: "Material de escritório", value: 0 },
  { id: "cleaning", name: "Material de limpeza", value: 0 },
  { id: "software", name: "Mensalidade de software", value: 0 },
  { id: "security", name: "Monitoramento e segurança", value: 0 },
  { id: "insurance", name: "Seguros", value: 0 },
  { id: "credit", name: "Serasa / SCPC / Associação Comercial", value: 0 },
  { id: "health", name: "Medicina do trabalho", value: 0 },
  { id: "maintenance", name: "Manutenção de equipamentos", value: 0 },
];

export function FixedCostsTab({ clinicData, onUpdateData }: FixedCostsTabProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingCost, setEditingCost] = useState<CustomFixedCost | null>(null);
  const [newCost, setNewCost] = useState<Partial<CustomFixedCost>>({
    name: "",
    category: "Outros",
    value: 0,
    notes: "",
  });

  // Estado para despesas administrativas
  const [adminExpenses, setAdminExpenses] = useState(() => {
    const saved = clinicData.fixedCosts.adminExpenses || DEFAULT_ADMIN_EXPENSES;
    return saved;
  });

  const [showAddAdminDialog, setShowAddAdminDialog] = useState(false);
  const [newAdminExpense, setNewAdminExpense] = useState({ name: "", value: 0 });

  const handleAddCustomCost = () => {
    if (!newCost.name || !newCost.value) return;

    const customCost: CustomFixedCost = {
      id: Date.now().toString(),
      name: newCost.name,
      category: newCost.category as CustomFixedCost["category"],
      value: newCost.value,
      notes: newCost.notes,
    };

    const updatedData = {
      ...clinicData,
      fixedCosts: {
        ...clinicData.fixedCosts,
        customCosts: [...(clinicData.fixedCosts.customCosts || []), customCost],
      },
    };

    onUpdateData(updatedData);
    setNewCost({ name: "", category: "Outros", value: 0, notes: "" });
    setShowAddDialog(false);
  };

  const handleEditCustomCost = () => {
    if (!editingCost || !newCost.name || !newCost.value) return;

    const updatedCosts = (clinicData.fixedCosts.customCosts || []).map((cost) =>
      cost.id === editingCost.id
        ? {
            ...cost,
            name: newCost.name!,
            category: newCost.category as CustomFixedCost["category"],
            value: newCost.value!,
            notes: newCost.notes,
          }
        : cost
    );

    const updatedData = {
      ...clinicData,
      fixedCosts: {
        ...clinicData.fixedCosts,
        customCosts: updatedCosts,
      },
    };

    onUpdateData(updatedData);
    setEditingCost(null);
    setNewCost({ name: "", category: "Outros", value: 0, notes: "" });
    setShowAddDialog(false);
  };

  const handleDeleteCustomCost = (id: string) => {
    const updatedData = {
      ...clinicData,
      fixedCosts: {
        ...clinicData.fixedCosts,
        customCosts: (clinicData.fixedCosts.customCosts || []).filter(
          (cost) => cost.id !== id
        ),
      },
    };

    onUpdateData(updatedData);
  };

  const openEditDialog = (cost: CustomFixedCost) => {
    setEditingCost(cost);
    setNewCost({
      name: cost.name,
      category: cost.category,
      value: cost.value,
      notes: cost.notes,
    });
    setShowAddDialog(true);
  };

  const openAddDialog = () => {
    setEditingCost(null);
    setNewCost({ name: "", category: "Outros", value: 0, notes: "" });
    setShowAddDialog(true);
  };

  // 🔄 ATUALIZAR DESPESA ADMINISTRATIVA
  const handleUpdateAdminExpense = (id: string, value: number) => {
    const updated = adminExpenses.map((exp) =>
      exp.id === id ? { ...exp, value } : exp
    );
    setAdminExpenses(updated);

    // Salvar no clinicData
    const updatedData = {
      ...clinicData,
      fixedCosts: {
        ...clinicData.fixedCosts,
        adminExpenses: updated,
      },
    };
    onUpdateData(updatedData);
  };

  // ➕ ADICIONAR NOVA DESPESA ADMINISTRATIVA
  const handleAddAdminExpense = () => {
    if (!newAdminExpense.name) return;

    const newExpense = {
      id: `custom-${Date.now()}`,
      name: newAdminExpense.name,
      value: newAdminExpense.value,
    };

    const updated = [...adminExpenses, newExpense];
    setAdminExpenses(updated);

    const updatedData = {
      ...clinicData,
      fixedCosts: {
        ...clinicData.fixedCosts,
        adminExpenses: updated,
      },
    };
    onUpdateData(updatedData);

    setNewAdminExpense({ name: "", value: 0 });
    setShowAddAdminDialog(false);
  };

  // 🗑️ REMOVER DESPESA ADMINISTRATIVA CUSTOMIZADA
  const handleDeleteAdminExpense = (id: string) => {
    const updated = adminExpenses.filter((exp) => exp.id !== id);
    setAdminExpenses(updated);

    const updatedData = {
      ...clinicData,
      fixedCosts: {
        ...clinicData.fixedCosts,
        adminExpenses: updated,
      },
    };
    onUpdateData(updatedData);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Estrutura":
        return <Home className="w-4 h-4" />;
      default:
        return <Plus className="w-4 h-4" />;
    }
  };

  const adminTotal = adminExpenses.reduce((sum, exp) => sum + exp.value, 0);
  const customTotal = (clinicData.fixedCosts.customCosts || []).reduce(
    (sum, cost) => sum + cost.value,
    0
  );
  const total = adminTotal + customTotal;

  // 📊 CÁLCULO DE ALERTA (>25% do faturamento)
  const monthlyRevenue = clinicData.monthlyRevenue || 0;
  const adminPercentage = monthlyRevenue > 0 ? (adminTotal / monthlyRevenue) * 100 : 0;
  const showAlert = adminPercentage > 25;

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 border-0 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <DollarSign className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Custos Fixos da Clínica</h2>
              <p className="text-white/90 text-sm mt-1">
                Base única e centralizada de todos os custos fixos mensais
              </p>
            </div>
          </div>
        </Card>

        {/* Mensagem educativa */}
        <Card className="bg-purple-50 border-2 border-purple-200 p-4">
          <p className="text-sm text-purple-700">
            ✨ <strong>Quanto mais completo o cadastro, mais preciso será seu preço.</strong>
            <br />
            Adicione todos os custos fixos reais da sua clínica para evitar subprecificação.
          </p>
        </Card>

        {/* 📂 SEÇÃO: CUSTOS FIXOS DA CLÍNICA (BASE ÚNICA) */}
        <Card className="p-6 border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              Custos Fixos Mensais
            </h3>
            <Button
              onClick={() => setShowAddAdminDialog(true)}
              variant="outline"
              className="gap-2 border-purple-300 text-purple-700 hover:bg-purple-100"
            >
              <Plus className="w-4 h-4" />
              Adicionar novo custo
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {adminExpenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-200"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">(-) {expense.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <MoneyInput
                    value={expense.value}
                    onChange={(value) => handleUpdateAdminExpense(expense.id, value)}
                    className="w-32"
                  />
                  {expense.id.startsWith("custom-") && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteAdminExpense(expense.id)}
                      className="h-8 w-8 p-0 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Total de Custos Fixos */}
          <div className="mt-4 pt-4 border-t-2 border-purple-300">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-800">
                Subtotal (Custos Fixos):
              </span>
              <span className="text-2xl font-bold text-purple-600">
                {formatCurrency(adminTotal)}
              </span>
            </div>

            {/* 🔥 RESUMO AUTOMÁTICO + ALERTA */}
            {monthlyRevenue > 0 && (
              <div className="mt-3 p-3 bg-white rounded-lg border border-purple-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    % sobre faturamento mensal ({formatCurrency(monthlyRevenue)}):
                  </span>
                  <span
                    className={`font-bold ${
                      showAlert ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {adminPercentage.toFixed(1)}%
                  </span>
                </div>
                {showAlert && (
                  <div className="mt-2 flex items-start gap-2 text-xs text-red-700 bg-red-50 p-2 rounded">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <p>
                      <strong>Atenção:</strong> Seus custos fixos ultrapassam 25%
                      do faturamento. Considere revisar custos para manter a saúde financeira.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Custos Personalizados */}
        <Card className="p-6 border-2 border-purple-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Plus className="w-5 h-5 text-purple-600" />
              Custos Personalizados Adicionais
            </h3>
            <Button
              onClick={openAddDialog}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 gap-2"
            >
              <Plus className="w-4 h-4" />
              Adicionar custo
            </Button>
          </div>

          {clinicData.fixedCosts.customCosts &&
          clinicData.fixedCosts.customCosts.length > 0 ? (
            <div className="space-y-2">
              {clinicData.fixedCosts.customCosts.map((cost) => (
                <div
                  key={cost.id}
                  className="flex items-center justify-between p-4 bg-white border border-purple-100 rounded-lg hover:border-purple-300 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="text-purple-600">{getCategoryIcon(cost.category)}</div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{cost.name}</p>
                      <p className="text-xs text-gray-500">{cost.category}</p>
                      {cost.notes && (
                        <p className="text-xs text-gray-400 mt-1">{cost.notes}</p>
                      )}
                    </div>
                    <span className="font-semibold text-purple-600">
                      {formatCurrency(cost.value)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(cost)}
                      className="h-8 w-8 p-0 hover:bg-purple-50"
                    >
                      <Edit className="w-4 h-4 text-purple-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCustomCost(cost.id)}
                      className="h-8 w-8 p-0 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">
                    Subtotal (Personalizados):
                  </span>
                  <span className="text-xl font-bold text-purple-600">
                    {formatCurrency(customTotal)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 border-2 border-dashed border-purple-200 rounded-lg">
              <Plus className="w-12 h-12 text-purple-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-2">Nenhum custo personalizado adicionado</p>
              <p className="text-sm text-gray-400">
                Clique em "Adicionar custo" para incluir custos específicos da sua clínica
              </p>
            </div>
          )}
        </Card>

        {/* 🔥 TOTAL GERAL - CUSTO FIXO TOTAL MENSAL DA CLÍNICA */}
        <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 border-0 shadow-2xl">
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm text-white/80">
              <span>Custos fixos mensais:</span>
              <span className="font-medium">{formatCurrency(adminTotal)}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-white/80">
              <span>Custos personalizados:</span>
              <span className="font-medium">{formatCurrency(customTotal)}</span>
            </div>
            <div className="border-t border-white/20 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">
                  💰 Custo Fixo Total Mensal da Clínica:
                </span>
                <span className="text-3xl font-bold">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Dialog Adicionar/Editar Custo */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {editingCost ? (
                <>
                  <Edit className="w-5 h-5 text-purple-600" />
                  Editar custo fixo
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 text-purple-600" />
                  Adicionar novo custo fixo
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados do custo fixo mensal da sua clínica.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cost-name">Nome do custo *</Label>
              <Input
                id="cost-name"
                placeholder="Ex: Manutenção de equipamentos"
                value={newCost.name || ""}
                onChange={(e) => setNewCost({ ...newCost, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost-category">Categoria</Label>
              <Select
                value={newCost.category}
                onValueChange={(value) =>
                  setNewCost({
                    ...newCost,
                    category: value as CustomFixedCost["category"],
                  })
                }
              >
                <SelectTrigger id="cost-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Estrutura">Estrutura</SelectItem>
                  <SelectItem value="Administrativo">Administrativo</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                  <SelectItem value="Outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost-value">Valor mensal *</Label>
              <MoneyInput
                id="cost-value"
                value={newCost.value || 0}
                onChange={(value) => setNewCost({ ...newCost, value })}
                placeholder="R$ 0,00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost-notes">Observações (opcional)</Label>
              <Textarea
                id="cost-notes"
                placeholder="Detalhes adicionais sobre este custo..."
                value={newCost.notes || ""}
                onChange={(e) => setNewCost({ ...newCost, notes: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddDialog(false);
                setEditingCost(null);
                setNewCost({ name: "", category: "Outros", value: 0, notes: "" });
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={editingCost ? handleEditCustomCost : handleAddCustomCost}
              disabled={!newCost.name || !newCost.value}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {editingCost ? "Salvar alterações" : "Adicionar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Adicionar Custo Fixo */}
      <Dialog open={showAddAdminDialog} onOpenChange={setShowAddAdminDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-purple-600" />
              Adicionar novo custo fixo
            </DialogTitle>
            <DialogDescription>
              Crie um custo fixo personalizado para sua clínica.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="admin-name">Nome do custo *</Label>
              <Input
                id="admin-name"
                placeholder="Ex: Taxa de alvará"
                value={newAdminExpense.name}
                onChange={(e) =>
                  setNewAdminExpense({ ...newAdminExpense, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-value">Valor mensal</Label>
              <MoneyInput
                id="admin-value"
                value={newAdminExpense.value}
                onChange={(value) =>
                  setNewAdminExpense({ ...newAdminExpense, value })
                }
                placeholder="R$ 0,00"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddAdminDialog(false);
                setNewAdminExpense({ name: "", value: 0 });
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAddAdminExpense}
              disabled={!newAdminExpense.name}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
