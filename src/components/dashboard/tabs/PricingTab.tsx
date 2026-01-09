import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  calculateClinicCosts,
  calculateTreatmentPricing,
  formatCurrency,
} from "@/lib/calculations";
import type { ClinicData, Treatment, Material } from "@/lib/types";
import {
  Plus,
  Trash2,
  Clock,
  AlertCircle,
  Save,
  Package,
  BookOpen,
  Info,
  DollarSign,
  Heart,
  FileEdit,
} from "lucide-react";
import { TreatmentLibrary } from "@/components/treatments/TreatmentLibrary";
import { TreatmentEditor, type CustomizedTreatment } from "@/components/treatments/TreatmentEditor";
import type { TreatmentTemplate } from "@/lib/treatments-database";

interface PricingTabProps {
  clinicData: ClinicData;
  treatments: Treatment[];
  onAddTreatment: (treatment: Treatment) => void;
  onRemoveTreatment: (id: string) => void;
}

export function PricingTab({ clinicData, treatments, onAddTreatment, onRemoveTreatment }: PricingTabProps) {
  const [mode, setMode] = useState<"main" | "library" | "editor" | "manual">("main");
  const [selectedTemplate, setSelectedTemplate] = useState<TreatmentTemplate | null>(null);
  const [selectedTreatmentId, setSelectedTreatmentId] = useState<string | null>(null);
  
  // Estados para cadastro manual
  const [manualName, setManualName] = useState("");
  const [manualDescription, setManualDescription] = useState("");
  const [manualDuration, setManualDuration] = useState("");
  const [manualLabCost, setManualLabCost] = useState("");
  const [manualMaterials, setManualMaterials] = useState<Material[]>([]);
  const [newMaterialName, setNewMaterialName] = useState("");
  const [newMaterialCost, setNewMaterialCost] = useState("");

  const costs = calculateClinicCosts(clinicData);

  const handleSelectTemplate = (template: TreatmentTemplate) => {
    setSelectedTemplate(template);
    setMode("editor");
  };

  const handleSaveCustomizedTreatment = (customized: CustomizedTreatment) => {
    const treatment: Treatment = {
      id: Date.now().toString(),
      name: customized.name,
      durationMinutes: customized.durationMinutes,
      materials: customized.materials.map(m => ({
        id: m.id,
        name: m.name,
        cost: m.cost,
      })),
      labCost: customized.labCost,
    };

    onAddTreatment(treatment);
    setMode("main");
    setSelectedTemplate(null);
  };

  const handleCancelEditor = () => {
    setMode("library");
    setSelectedTemplate(null);
  };

  const handleAddMaterial = () => {
    if (newMaterialName && newMaterialCost) {
      const material: Material = {
        id: Date.now().toString(),
        name: newMaterialName,
        cost: parseFloat(newMaterialCost),
      };
      setManualMaterials([...manualMaterials, material]);
      setNewMaterialName("");
      setNewMaterialCost("");
    }
  };

  const handleRemoveMaterial = (id: string) => {
    setManualMaterials(manualMaterials.filter(m => m.id !== id));
  };

  const handleSaveManualTreatment = () => {
    if (!manualName || !manualDuration) {
      alert("Preencha pelo menos o nome e a duração do tratamento");
      return;
    }

    const treatment: Treatment = {
      id: Date.now().toString(),
      name: manualName,
      durationMinutes: parseInt(manualDuration),
      materials: manualMaterials,
      labCost: manualLabCost ? parseFloat(manualLabCost) : 0,
    };

    onAddTreatment(treatment);
    
    // Limpar formulário
    setManualName("");
    setManualDescription("");
    setManualDuration("");
    setManualLabCost("");
    setManualMaterials([]);
    setMode("main");
  };

  const handleCancelManual = () => {
    setManualName("");
    setManualDescription("");
    setManualDuration("");
    setManualLabCost("");
    setManualMaterials([]);
    setMode("main");
  };

  // Função para converter minutos em horas formatadas
  const formatMinutesToHours = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `0h${mins.toString().padStart(2, '0')}`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h${mins.toString().padStart(2, '0')}`;
  };

  // Calcular precificação para tratamento selecionado (APENAS CUSTOS BASE)
  const selectedTreatment = treatments.find(t => t.id === selectedTreatmentId);
  const pricing = selectedTreatment 
    ? calculateTreatmentPricing(selectedTreatment, costs, clinicData.goals.profitMargin)
    : null;

  // Se estiver no modo biblioteca
  if (mode === "library") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">📚 Biblioteca de Tratamentos</h2>
            <p className="text-gray-600">Escolha um template pronto e personalize conforme sua necessidade</p>
          </div>
          <Button
            onClick={() => setMode("main")}
            variant="outline"
            className="border-purple-200 hover:border-purple-400"
          >
            <Heart className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
        <TreatmentLibrary onSelectTreatment={handleSelectTemplate} />
      </div>
    );
  }

  // Se estiver no modo editor
  if (mode === "editor" && selectedTemplate) {
    return (
      <TreatmentEditor
        template={selectedTemplate}
        onSave={handleSaveCustomizedTreatment}
        onCancel={handleCancelEditor}
      />
    );
  }

  // Se estiver no modo cadastro manual
  if (mode === "manual") {
    const durationMinutes = parseInt(manualDuration) || 0;
    const durationHours = durationMinutes > 0 ? formatMinutesToHours(durationMinutes) : "";

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FileEdit className="w-7 h-7 text-purple-600" />
              Cadastrar Tratamento Manualmente
            </h2>
            <p className="text-gray-600">Crie um tratamento personalizado do zero</p>
          </div>
          <Button
            onClick={handleCancelManual}
            variant="outline"
            className="border-purple-200 hover:border-purple-400"
          >
            <Heart className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>

        <Card className="p-6 border-2 border-purple-200">
          <div className="space-y-6">
            {/* Nome do Tratamento */}
            <div>
              <Label htmlFor="manual-name" className="text-base font-semibold">
                Nome do Tratamento *
              </Label>
              <Input
                id="manual-name"
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                placeholder="Ex: Clareamento Dental Personalizado"
                className="mt-2"
              />
            </div>

            {/* Descrição */}
            <div>
              <Label htmlFor="manual-description" className="text-base font-semibold">
                Descrição (opcional)
              </Label>
              <Textarea
                id="manual-description"
                value={manualDescription}
                onChange={(e) => setManualDescription(e.target.value)}
                placeholder="Descreva os detalhes do tratamento..."
                className="mt-2"
                rows={3}
              />
            </div>

            {/* Duração COM CONVERSÃO AUTOMÁTICA */}
            <div>
              <Label htmlFor="manual-duration" className="text-base font-semibold">
                Tempo Clínico (minutos) *
              </Label>
              <Input
                id="manual-duration"
                type="number"
                value={manualDuration}
                onChange={(e) => setManualDuration(e.target.value)}
                placeholder="Ex: 60"
                className="mt-2"
              />
              {durationHours && (
                <p className="text-sm text-purple-600 font-semibold mt-2 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  ⏱️ {durationHours}
                </p>
              )}
            </div>

            {/* Custo Laboratorial */}
            <div>
              <Label htmlFor="manual-lab" className="text-base font-semibold">
                Custo Laboratorial (R$)
              </Label>
              <Input
                id="manual-lab"
                type="number"
                step="0.01"
                value={manualLabCost}
                onChange={(e) => setManualLabCost(e.target.value)}
                placeholder="Ex: 150.00"
                className="mt-2"
              />
            </div>

            {/* Materiais */}
            <div>
              <Label className="text-base font-semibold mb-3 block">
                Materiais Utilizados
              </Label>
              
              {/* Lista de materiais */}
              {manualMaterials.length > 0 && (
                <div className="space-y-2 mb-4">
                  {manualMaterials.map((material) => (
                    <div
                      key={material.id}
                      className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200"
                    >
                      <div>
                        <p className="font-semibold text-gray-800">{material.name}</p>
                        <p className="text-sm text-gray-600">{formatCurrency(material.cost)}</p>
                      </div>
                      <Button
                        onClick={() => handleRemoveMaterial(material.id)}
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Adicionar material */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  value={newMaterialName}
                  onChange={(e) => setNewMaterialName(e.target.value)}
                  placeholder="Nome do material"
                />
                <Input
                  type="number"
                  step="0.01"
                  value={newMaterialCost}
                  onChange={(e) => setNewMaterialCost(e.target.value)}
                  placeholder="Custo (R$)"
                />
                <Button
                  onClick={handleAddMaterial}
                  variant="outline"
                  className="border-purple-300 hover:bg-purple-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Material
                </Button>
              </div>
            </div>

            {/* Botões de ação */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                onClick={handleCancelManual}
                variant="outline"
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveManualTreatment}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar Tratamento
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Modo principal - TRATAMENTOS (APENAS MONTAGEM BASE)
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Heart className="w-8 h-8 text-purple-600" />
            Tratamentos
          </h2>
          <p className="text-gray-600">Monte a precificação base de cada tratamento odontológico</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setMode("manual")}
            variant="outline"
            className="border-purple-300 hover:bg-purple-50 hover:border-purple-400"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Cadastrar Manualmente
          </Button>
          <Button
            onClick={() => setMode("library")}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
            size="lg"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            📚 Biblioteca de Tratamentos
          </Button>
        </div>
      </div>

      {/* Card Informativo */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200">
        <div className="flex items-start gap-3">
          <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-bold text-blue-900 mb-2">
              Sobre a Aba Tratamentos
            </h3>
            <p className="text-sm text-blue-800 leading-relaxed">
              Nesta área você monta a <strong>precificação individual de cada tratamento</strong>, considerando materiais, tempo clínico e estrutura.
              <br />
              <br />
              Os valores aqui definidos servirão de base para o cálculo final de preços e estratégias, que serão apresentados <strong>apenas na aba PRESIFICAÇÃO</strong>.
            </p>
          </div>
        </div>
      </Card>

      {/* Alerta sobre Resultado Final */}
      <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-purple-800 font-semibold">
              ⚠️ Esta aba NÃO apresenta resultados financeiros finais
            </p>
            <p className="text-xs text-purple-700 mt-1">
              Para ver preços estratégicos, margens e lucros, acesse a aba <strong>PRESIFICAÇÃO</strong>
            </p>
          </div>
        </div>
      </Card>

      {treatments.length === 0 ? (
        // Estado vazio
        <Card className="p-12 text-center border-2 border-dashed border-purple-200">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
              <Heart className="w-10 h-10 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">
              Nenhum tratamento cadastrado
            </h3>
            <p className="text-gray-600">
              Escolha uma opção para começar a montar sua base de custos
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Button
                onClick={() => setMode("manual")}
                variant="outline"
                className="border-purple-300 hover:bg-purple-50"
                size="lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Cadastrar Manualmente
              </Button>
              <Button
                onClick={() => setMode("library")}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                size="lg"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Biblioteca de Tratamentos
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Coluna 1: Lista de Tratamentos */}
          <div className="space-y-4">
            <Card className="p-4 border-2 border-purple-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-600" />
                Tratamentos Cadastrados
              </h3>
              <div className="space-y-2">
                {treatments.map((treatment) => (
                  <div
                    key={treatment.id}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedTreatmentId === treatment.id
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                    onClick={() => setSelectedTreatmentId(treatment.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-sm">
                          {treatment.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-gray-600">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {treatment.durationMinutes} min
                          </p>
                          <p className="text-xs text-purple-600 font-semibold">
                            ⏱️ {formatMinutesToHours(treatment.durationMinutes)}
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveTreatment(treatment.id);
                          if (selectedTreatmentId === treatment.id) {
                            setSelectedTreatmentId(null);
                          }
                        }}
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Coluna 2: Custos Base (SEM PREÇOS FINAIS) */}
          {selectedTreatment && pricing ? (
            <div className="space-y-4">
              <Card className="p-6 border-2 border-purple-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                  Custos Base do Tratamento
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-600">Custo de material</span>
                    <span className="font-semibold text-gray-800">
                      {formatCurrency(pricing.breakdown.materialsCost)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-600">Tempo clínico</span>
                    <div className="text-right">
                      <span className="font-semibold text-gray-800 block">
                        {selectedTreatment.durationMinutes} min
                      </span>
                      <span className="text-xs text-purple-600 font-semibold">
                        ⏱️ {formatMinutesToHours(selectedTreatment.durationMinutes)}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-600">Custo hora clínica</span>
                    <span className="font-semibold text-gray-800">
                      {formatCurrency(costs.costPerHour)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-600">Custo tempo clínico</span>
                    <span className="font-semibold text-gray-800">
                      {formatCurrency(pricing.breakdown.timeCost)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-600">Custo laboratorial</span>
                    <span className="font-semibold text-gray-800">
                      {formatCurrency(pricing.breakdown.labCost)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 bg-purple-50 rounded-lg px-3 mt-4">
                    <span className="text-base font-bold text-purple-900">Custo Total Base</span>
                    <span className="text-xl font-bold text-purple-700">
                      {formatCurrency(pricing.realCost)}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Card de Redirecionamento */}
              <Card className="p-6 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
                <div className="flex items-start gap-3">
                  <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-bold text-blue-900 mb-2">
                      Para ver preços estratégicos
                    </h3>
                    <p className="text-sm text-blue-800 leading-relaxed mb-3">
                      Os preços finais, margens de lucro e estratégias de precificação estão disponíveis na aba <strong>PRESIFICAÇÃO</strong>.
                    </p>
                    <p className="text-xs text-blue-700">
                      Esta aba serve apenas para montar a base de custos de cada tratamento.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <div>
              <Card className="p-12 text-center border-2 border-dashed border-gray-300">
                <AlertCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">
                  Selecione um tratamento da lista para ver os custos base
                </p>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
