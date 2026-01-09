"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Calculator, Plus, Edit, Trash2, FileText, Lock } from "lucide-react";
import type { FixedCosts, CustomFixedCost, AdminExpense } from "@/lib/types";
import { Input } from "@/components/ui/input";

interface StepFixedCostsProps {
  onNext: (data: FixedCosts) => void;
  onBack: () => void;
  initialData: FixedCosts | null;
}

// 📋 LISTA COMPLETA DE CUSTOS FIXOS (BASE ÚNICA OFICIAL)
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

export function StepFixedCosts({ onNext, onBack, initialData }: StepFixedCostsProps) {
  // Estado para despesas administrativas (BASE ÚNICA)
  const [adminExpenses, setAdminExpenses] = useState<AdminExpense[]>(() => {
    return initialData?.adminExpenses || DEFAULT_ADMIN_EXPENSES;
  });

  const [customCosts, setCustomCosts] = useState<CustomFixedCost[]>(() => {
    return initialData?.customCosts || [];
  });

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showAddAdminDialog, setShowAddAdminDialog] = useState(false);
  const [editingCost, setEditingCost] = useState<CustomFixedCost | null>(null);
  const [newCost, setNewCost] = useState<Partial<CustomFixedCost>>({
    name: "",
    category: "Outros",
    value: 0,
    notes: "",
  });
  const [newAdminExpense, setNewAdminExpense] = useState({ name: "", value: 0 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData: FixedCosts = {
      adminExpenses,
      customCosts,
    };
    
    onNext(formData);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // 🔄 ATUALIZAR DESPESA ADMINISTRATIVA
  const handleUpdateAdminExpense = (id: string, value: number) => {
    setAdminExpenses(prev => 
      prev.map(exp => exp.id === id ? { ...exp, value } : exp)
    );
  };

  // ➕ ADICIONAR NOVA DESPESA ADMINISTRATIVA
  const handleAddAdminExpense = () => {
    if (!newAdminExpense.name) return;

    const newExpense: AdminExpense = {
      id: `custom-${Date.now()}`,
      name: newAdminExpense.name,
      value: newAdminExpense.value,
    };

    setAdminExpenses(prev => [...prev, newExpense]);
    setNewAdminExpense({ name: "", value: 0 });
    setShowAddAdminDialog(false);
  };

  // 🗑️ REMOVER DESPESA ADMINISTRATIVA CUSTOMIZADA
  const handleDeleteAdminExpense = (id: string) => {
    setAdminExpenses(prev => prev.filter(exp => exp.id !== id));
  };

  const handleAddCustomCost = () => {
    if (!newCost.name || !newCost.value) return;

    const customCost: CustomFixedCost = {
      id: Date.now().toString(),
      name: newCost.name,
      category: newCost.category as CustomFixedCost["category"],
      value: newCost.value,
      notes: newCost.notes,
    };

    setCustomCosts(prev => [...prev, customCost]);
    setNewCost({ name: "", category: "Outros", value: 0, notes: "" });
    setShowAddDialog(false);
  };

  const handleEditCustomCost = () => {
    if (!editingCost || !newCost.name || !newCost.value) return;

    setCustomCosts(prev =>
      prev.map(cost =>
        cost.id === editingCost.id
          ? {
              ...cost,
              name: newCost.name!,
              category: newCost.category as CustomFixedCost["category"],
              value: newCost.value!,
              notes: newCost.notes,
            }
          : cost
      )
    );

    setEditingCost(null);
    setNewCost({ name: "", category: "Outros", value: 0, notes: "" });
    setShowAddDialog(false);
  };

  const handleDeleteCustomCost = (id: string) => {
    setCustomCosts(prev => prev.filter(cost => cost.id !== id));
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

  const adminTotal = adminExpenses.reduce((sum, exp) => sum + exp.value, 0);
  const customTotal = customCosts.reduce((sum, cost) => sum + cost.value, 0);
  const total = adminTotal + customTotal;

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-pink-100 p-3 rounded-xl">
              <Calculator className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                Custos Fixos Mensais da Clínica
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Base única e oficial de todos os custos fixos
              </p>
            </div>
          </div>

          {/* Selo de sincronização */}
          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 flex items-start gap-3">
            <Lock className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-purple-700 font-medium">
                🔒 Dados sincronizados automaticamente com a base oficial de custos
              </p>
              <p className="text-xs text-purple-600 mt-1">
                Todos os valores inseridos aqui serão usados em todos os cálculos do sistema.
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg border border-blue-200">
            💡 <strong>Dica:</strong> Custos fixos são aqueles que você paga todo mês, independente de quantos pacientes atender.
          </p>

          <p className="text-xs text-purple-600 bg-purple-50 p-3 rounded-lg border border-purple-200">
            ✨ Quanto mais completo o cadastro, mais preciso será seu preço.
          </p>

          {/* 📂 SEÇÃO: CUSTOS FIXOS DA CLÍNICA (BASE ÚNICA) */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                Custos Fixos Mensais (Base Completa)
              </h4>
              <Button
                type="button"
                onClick={() => setShowAddAdminDialog(true)}
                variant="outline"
                size="sm"
                className="gap-2 border-purple-300 text-purple-700 hover:bg-purple-100"
              >
                <Plus className="w-4 h-4" />
                Adicionar novo
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {adminExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-200"
                >
                  <div className="flex-1 min-w-0 mr-2">
                    <p className="text-sm font-medium text-gray-700 truncate">
                      {expense.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <MoneyInput
                      value={expense.value}
                      onChange={(value) => handleUpdateAdminExpense(expense.id, value)}
                      className="w-32"
                    />
                    {expense.id.startsWith("custom-") && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAdminExpense(expense.id)}
                        className="h-8 w-8 p-0 hover:bg-red-50 flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Subtotal Custos Fixos */}
            <div className="mt-4 pt-4 border-t-2 border-purple-300">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-800">
                  Subtotal (Custos Fixos):
                </span>
                <span className="text-xl font-bold text-purple-600">
                  {formatCurrency(adminTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Custos Personalizados Adicionais */}
          <div className="bg-white border-2 border-purple-100 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <Plus className="w-5 h-5 text-purple-600" />
                Custos Personalizados Adicionais
              </h4>
              <Button
                type="button"
                onClick={openAddDialog}
                variant="outline"
                size="sm"
                className="gap-2 border-purple-300 text-purple-700 hover:bg-purple-100"
              >
                <Plus className="w-4 h-4" />
                Adicionar
              </Button>
            </div>

            {customCosts.length > 0 ? (
              <div className="space-y-2">
                {customCosts.map((cost) => (
                  <div
                    key={cost.id}
                    className="flex items-center justify-between p-3 bg-white border border-purple-100 rounded-lg hover:border-purple-300 transition-colors"
                  >
                    <div className="flex-1 min-w-0 mr-3">
                      <p className="font-medium text-gray-800">{cost.name}</p>
                      <p className="text-xs text-gray-500">{cost.category}</p>
                      {cost.notes && (
                        <p className="text-xs text-gray-400 mt-1 truncate">{cost.notes}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-purple-600 whitespace-nowrap">
                        {formatCurrency(cost.value)}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(cost)}
                        className="h-8 w-8 p-0 hover:bg-purple-50"
                      >
                        <Edit className="w-4 h-4 text-purple-600" />
                      </Button>
                      <Button
                        type="button"
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
                <div className="mt-4 pt-4 border-t border-purple-200">
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
              <div className="text-center py-6 border-2 border-dashed border-purple-200 rounded-lg">
                <Plus className="w-10 h-10 text-purple-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Nenhum custo personalizado adicionado</p>
              </div>
            )}
          </div>

          {/* 🔥 TOTAL GERAL - CUSTO FIXO TOTAL MENSAL DA CLÍNICA */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-xl border-0 shadow-xl">
            <div className="space-y-3 text-white">
              <div className="flex justify-between items-center text-sm text-white/80">
                <span>Custos fixos mensais:</span>
                <span className="font-medium">{formatCurrency(adminTotal)}</span>
              </div>
              {customTotal > 0 && (
                <div className="flex justify-between items-center text-sm text-white/80">
                  <span>Custos personalizados:</span>
                  <span className="font-medium">{formatCurrency(customTotal)}</span>
                </div>
              )}
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

      {/* Dialog Adicionar/Editar Custo Personalizado */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {editingCost ? (
                <>
                  <Edit className="w-5 h-5 text-purple-600" />
                  Editar custo personalizado
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 text-purple-600" />
                  Adicionar custo personalizado
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados do custo personalizado da sua clínica.
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
                  setNewCost({ ...newCost, category: value as CustomFixedCost["category"] })
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
    </>
  );
}
