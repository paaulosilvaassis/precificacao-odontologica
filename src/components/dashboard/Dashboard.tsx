"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { OverviewTab } from "./tabs/OverviewTab";
import { PricingTab } from "./tabs/PricingTab";
import { FixedCostsTab } from "./tabs/FixedCostsTab";
import { TeamTab } from "./tabs/TeamTab";
import { TaxTab } from "./tabs/TaxTab";
import { ProductivityTab } from "./tabs/ProductivityTab";
import { ResultsTab } from "./tabs/ResultsTab";
import { ClinicSettingsTab } from "./tabs/ClinicSettingsTab";
import type { ClinicData, Treatment, TaxConfig } from "@/lib/types";
import { LayoutDashboard, Edit, DollarSign, Users, Receipt, FileText, Activity, Settings, Smile } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DashboardProps {
  clinicData: ClinicData;
  onUpdateData: (data: ClinicData) => void;
  onEditClinic?: () => void;
}

export function Dashboard({ clinicData, onUpdateData, onEditClinic }: DashboardProps) {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Inicializar taxConfig se não existir
  // 🔒 GARANTIA: Faixa 1 do Anexo III = 6% | Faixa 1 do Anexo V = 15,5%
  const defaultTaxConfig: TaxConfig = {
    regime: "simplesNacional",
    state: "SP",
    customISS: 5.0,
    rates: {
      totalRate: 6.0, // Anexo III - Faixa 1
      anexo: "anexo3",
      faixaSelecionada: 1,
    },
    calculationMethod: "onRevenue",
  };

  const currentTaxConfig = clinicData.taxConfig || defaultTaxConfig;

  const handleAddTreatment = (treatment: Treatment) => {
    setTreatments([...treatments, treatment]);
  };

  const handleRemoveTreatment = (id: string) => {
    setTreatments(treatments.filter((t) => t.id !== id));
  };

  const handleEditClick = () => {
    setShowEditDialog(true);
  };

  const handleConfirmEdit = () => {
    setShowEditDialog(false);
    if (onEditClinic) {
      onEditClinic();
    }
  };

  const handleUpdateTaxConfig = (taxConfig: TaxConfig) => {
    onUpdateData({
      ...clinicData,
      taxConfig,
    });
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Botão de Editar Cadastro - Layout Original Simples */}
        <div className="mb-6">
          <Button
            onClick={handleEditClick}
            variant="outline"
            className="gap-2"
          >
            <Edit className="w-4 h-4" />
            Editar cadastro completo
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          {/* TabsList - Layout Original Simples */}
          <TabsList className="inline-flex w-auto">
            <TabsTrigger value="overview" className="gap-2">
              <LayoutDashboard className="w-4 h-4" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="w-4 h-4" />
              Configurações
            </TabsTrigger>
            <TabsTrigger value="team" className="gap-2">
              <Users className="w-4 h-4" />
              Equipe
            </TabsTrigger>
            <TabsTrigger value="fixed-costs" className="gap-2">
              <DollarSign className="w-4 h-4" />
              Custos Fixos
            </TabsTrigger>
            <TabsTrigger value="taxes" className="gap-2">
              <FileText className="w-4 h-4" />
              Impostos
            </TabsTrigger>
            <TabsTrigger value="productivity" className="gap-2">
              <Activity className="w-4 h-4" />
              Produtividade
            </TabsTrigger>
            <TabsTrigger value="treatments" className="gap-2">
              <Smile className="w-4 h-4" />
              Tratamentos
            </TabsTrigger>
            <TabsTrigger value="presificacao" className="gap-2">
              <Receipt className="w-4 h-4" />
              Presificação
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <OverviewTab clinicData={clinicData} treatments={treatments} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <ClinicSettingsTab clinicData={clinicData} onUpdateData={onUpdateData} />
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <TeamTab clinicData={clinicData} onUpdateData={onUpdateData} />
          </TabsContent>

          <TabsContent value="fixed-costs" className="space-y-6">
            <FixedCostsTab clinicData={clinicData} onUpdateData={onUpdateData} />
          </TabsContent>

          <TabsContent value="taxes" className="space-y-6">
            <TaxTab
              taxConfig={currentTaxConfig}
              onUpdateTaxConfig={handleUpdateTaxConfig}
            />
          </TabsContent>

          <TabsContent value="productivity" className="space-y-6">
            <ProductivityTab />
          </TabsContent>

          <TabsContent value="treatments" className="space-y-6">
            <PricingTab
              clinicData={clinicData}
              treatments={treatments}
              onAddTreatment={handleAddTreatment}
              onRemoveTreatment={handleRemoveTreatment}
            />
          </TabsContent>

          <TabsContent value="presificacao" className="space-y-6">
            <ResultsTab
              clinicData={clinicData}
              treatments={treatments}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog de Confirmação - Layout Original Simples */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5 text-purple-600" />
              Editar cadastro completo da clínica
            </DialogTitle>
            <DialogDescription>
              Alterações no cadastro podem impactar seus custos e preços. Todos os valores serão recalculados automaticamente.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-4">
            <p className="text-sm text-amber-800">
              ⚠️ <strong>Atenção:</strong> Seus dados atuais serão preservados e você poderá editá-los livremente.
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowEditDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmEdit}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Continuar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
