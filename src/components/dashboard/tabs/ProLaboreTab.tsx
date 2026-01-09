"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

interface ProLaboreTabProps {
  onUpdateTotalProLabore?: (total: number) => void;
}

export function ProLaboreTab({ onUpdateTotalProLabore }: ProLaboreTabProps) {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [formData, setFormData] = useState({
    nome_socio: "",
    prolabore_mensal: "",
    inss_prolabore_percentual: "11",
  });

  // Carregar dados do localStorage ao montar
  useEffect(() => {
    const savedPartners = localStorage.getItem("socios_prolabore");
    if (savedPartners) {
      try {
        const parsed = JSON.parse(savedPartners);
        setPartners(parsed);
      } catch (error) {
        console.error("Erro ao carregar sócios:", error);
      }
    }
  }, []);

  // Salvar no localStorage sempre que partners mudar
  useEffect(() => {
    if (partners.length > 0) {
      localStorage.setItem("socios_prolabore", JSON.stringify(partners));
    }
    
    // Calcular e notificar total de pró-labore
    const total = calculateTotalProLabore();
    if (onUpdateTotalProLabore) {
      onUpdateTotalProLabore(total);
    }
  }, [partners, onUpdateTotalProLabore]);

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

  const handleOpenDialog = (partner?: Partner) => {
    if (partner) {
      setEditingPartner(partner);
      setFormData({
        nome_socio: partner.nome_socio,
        prolabore_mensal: partner.prolabore_mensal.toString(),
        inss_prolabore_percentual: partner.inss_prolabore_percentual.toString(),
      });
    } else {
      setEditingPartner(null);
      setFormData({
        nome_socio: "",
        prolabore_mensal: "",
        inss_prolabore_percentual: "11",
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingPartner(null);
    setFormData({
      nome_socio: "",
      prolabore_mensal: "",
      inss_prolabore_percentual: "11",
    });
  };

  const handleSavePartner = () => {
    const prolabore = parseFloat(formData.prolabore_mensal) || 0;
    const inssPercentual = parseFloat(formData.inss_prolabore_percentual) || 0;
    const inssValor = (prolabore * inssPercentual) / 100;

    if (!formData.nome_socio.trim()) {
      alert("Nome do sócio é obrigatório");
      return;
    }

    if (prolabore <= 0) {
      alert("Pró-labore mensal deve ser maior que zero");
      return;
    }

    const now = new Date().toISOString();

    if (editingPartner) {
      // Atualizar sócio existente
      setPartners(partners.map(p => 
        p.socio_id === editingPartner.socio_id
          ? {
              ...p,
              nome_socio: formData.nome_socio,
              prolabore_mensal: prolabore,
              inss_prolabore_percentual: inssPercentual,
              inss_prolabore_valor: inssValor,
              updated_at: now,
            }
          : p
      ));
    } else {
      // Criar novo sócio
      const newPartner: Partner = {
        socio_id: `socio_${Date.now()}`,
        nome_socio: formData.nome_socio,
        prolabore_mensal: prolabore,
        inss_prolabore_percentual: inssPercentual,
        inss_prolabore_valor: inssValor,
        ativo: true,
        created_at: now,
        updated_at: now,
      };
      setPartners([...partners, newPartner]);
    }

    handleCloseDialog();
  };

  const handleRemovePartner = (socio_id: string) => {
    if (confirm("Deseja realmente desativar este sócio? O histórico será mantido.")) {
      setPartners(partners.map(p => 
        p.socio_id === socio_id ? { ...p, ativo: false, updated_at: new Date().toISOString() } : p
      ));
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const activePartners = partners.filter(p => p.ativo);
  const totalProLabore = calculateTotalProLabore();
  const totalINSS = calculateTotalINSS();

  return (
    <div className="space-y-6">
      {/* Card de Resumo */}
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Users className="w-6 h-6 text-purple-600" />
            Pró-labore dos Sócios
          </CardTitle>
          <CardDescription className="text-base">
            Gerencie os valores de pró-labore dos sócios da clínica
          </CardDescription>
        </CardHeader>
        <CardContent>
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

      {/* Botão Adicionar Sócio - Layout Original Simples */}
      <div className="flex justify-start">
        <Button
          onClick={() => handleOpenDialog()}
          className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          <Plus className="w-4 h-4" />
          Adicionar Sócio
        </Button>
      </div>

      {/* Lista de Sócios */}
      {activePartners.length === 0 ? (
        <Alert>
          <AlertDescription className="text-base">
            Nenhum sócio cadastrado. Clique em "Adicionar Sócio" para começar.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {activePartners.map((partner) => (
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
                  {/* Botões de Ação - Layout Original Simples */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleOpenDialog(partner)}
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
          ))}
        </div>
      )}

      {/* Dialog de Adicionar/Editar Sócio - Layout Original Simples */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                value={formData.nome_socio}
                onChange={(e) => setFormData({ ...formData, nome_socio: e.target.value })}
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
                value={formData.prolabore_mensal}
                onChange={(e) => setFormData({ ...formData, prolabore_mensal: e.target.value })}
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
                value={formData.inss_prolabore_percentual}
                onChange={(e) => setFormData({ ...formData, inss_prolabore_percentual: e.target.value })}
                placeholder="Ex: 11"
              />
              <p className="text-sm text-gray-600">
                Valor calculado: {formatCurrency((parseFloat(formData.prolabore_mensal) || 0) * (parseFloat(formData.inss_prolabore_percentual) || 0) / 100)}
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={handleCloseDialog}
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

      {/* Informações Importantes */}
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
  );
}
