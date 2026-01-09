import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  type TreatmentTemplate,
  type MaterialDetail,
  getMaterialCategoryLabel,
  calculateTotalMaterialCost,
} from "@/lib/treatments-database";
import {
  ArrowLeft,
  Save,
  Trash2,
  Plus,
  AlertCircle,
  DollarSign,
  Clock,
  Package,
  TrendingUp,
  Info,
} from "lucide-react";
import { formatCurrency } from "@/lib/calculations";

interface TreatmentEditorProps {
  template: TreatmentTemplate;
  onSave: (customizedTreatment: CustomizedTreatment) => void;
  onCancel: () => void;
}

export interface CustomizedTreatment {
  templateId: string;
  name: string;
  durationMinutes: number;
  materials: CustomizedMaterial[];
  labCost: number;
  variant: "standard" | "premium" | "promotional";
}

export interface CustomizedMaterial {
  id: string;
  name: string;
  cost: number;
  category: MaterialDetail["category"];
  explanation: string;
}

export function TreatmentEditor({
  template,
  onSave,
  onCancel,
}: TreatmentEditorProps) {
  const [name, setName] = useState(template.name);
  const [duration, setDuration] = useState(template.durationAvg);
  const [labCost, setLabCost] = useState(template.labCostAvg);
  const [variant, setVariant] = useState<"standard" | "premium" | "promotional">("standard");
  const [materials, setMaterials] = useState<CustomizedMaterial[]>(
    template.materials.map((m) => ({
      id: m.id,
      name: m.name,
      cost: m.costAvg,
      category: m.category,
      explanation: m.explanation,
    }))
  );

  const totalMaterialCost = materials.reduce((sum, m) => sum + m.cost, 0);
  const totalCost = totalMaterialCost + labCost;

  const handleMaterialCostChange = (id: string, newCost: number) => {
    setMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, cost: newCost } : m))
    );
  };

  const handleRemoveMaterial = (id: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  };

  const handleAddCustomMaterial = () => {
    const newMaterial: CustomizedMaterial = {
      id: `custom_${Date.now()}`,
      name: "Material Personalizado",
      cost: 0,
      category: "clinico_basico",
      explanation: "Material adicionado manualmente",
    };
    setMaterials((prev) => [...prev, newMaterial]);
  };

  const handleSave = () => {
    const customized: CustomizedTreatment = {
      templateId: template.id,
      name,
      durationMinutes: duration,
      materials,
      labCost,
      variant,
    };
    onSave(customized);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          onClick={onCancel}
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para Biblioteca
        </Button>
        <Button
          onClick={handleSave}
          size="sm"
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          <Save className="w-4 h-4 mr-2" />
          Salvar Tratamento
        </Button>
      </div>

      {/* Template Info */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
        <div className="flex items-start gap-4">
          <div className="bg-purple-100 p-3 rounded-xl">
            <Package className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              Personalizando: {template.name}
            </h2>
            <p className="text-sm text-gray-600 mb-3">
              {template.description}
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-white px-3 py-1 rounded-full border border-purple-200 text-purple-700 font-medium">
                ⏱️ Tempo base: {template.durationMin}-{template.durationMax} min
              </span>
              <span className="text-xs bg-white px-3 py-1 rounded-full border border-purple-200 text-purple-700 font-medium">
                💰 Mercado: R$ {template.marketPriceMin} - R${" "}
                {template.marketPriceMax}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna 1: Configurações Básicas */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informações Gerais */}
          <Card className="p-6 border-2 border-purple-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-purple-600" />
              Informações Gerais
            </h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-semibold">
                  Nome do Tratamento
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 border-2 border-purple-200 focus:border-purple-400"
                  placeholder="Ex: Restauração em Resina Premium"
                />
              </div>

              <div>
                <Label htmlFor="duration" className="text-sm font-semibold">
                  Tempo Clínico (minutos)
                </Label>
                <div className="flex items-center gap-3 mt-1">
                  <Input
                    id="duration"
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="border-2 border-purple-200 focus:border-purple-400"
                    min={1}
                  />
                  <span className="text-sm text-gray-600 whitespace-nowrap">
                    ({(duration / 60).toFixed(1)}h)
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Base: {template.durationMin}-{template.durationMax} min
                </p>
              </div>

              <div>
                <Label htmlFor="labCost" className="text-sm font-semibold">
                  Custo Laboratorial (R$)
                </Label>
                <Input
                  id="labCost"
                  type="number"
                  value={labCost}
                  onChange={(e) => setLabCost(Number(e.target.value))}
                  className="mt-1 border-2 border-purple-200 focus:border-purple-400"
                  min={0}
                  step={10}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Base: R$ {template.labCostAvg}
                </p>
              </div>

              <div>
                <Label className="text-sm font-semibold mb-2 block">
                  Variante do Procedimento
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    onClick={() => setVariant("standard")}
                    variant={variant === "standard" ? "default" : "outline"}
                    size="sm"
                    className={
                      variant === "standard"
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "border-blue-200 hover:border-blue-400"
                    }
                  >
                    Padrão
                  </Button>
                  <Button
                    onClick={() => setVariant("premium")}
                    variant={variant === "premium" ? "default" : "outline"}
                    size="sm"
                    className={
                      variant === "premium"
                        ? "bg-purple-600 hover:bg-purple-700"
                        : "border-purple-200 hover:border-purple-400"
                    }
                  >
                    Premium
                  </Button>
                  <Button
                    onClick={() => setVariant("promotional")}
                    variant={variant === "promotional" ? "default" : "outline"}
                    size="sm"
                    className={
                      variant === "promotional"
                        ? "bg-green-600 hover:bg-green-700"
                        : "border-green-200 hover:border-green-400"
                    }
                  >
                    Promocional
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Materiais */}
          <Card className="p-6 border-2 border-purple-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-600" />
                Materiais Utilizados ({materials.length})
              </h3>
              <Button
                onClick={handleAddCustomMaterial}
                size="sm"
                variant="outline"
                className="border-purple-200 hover:border-purple-400"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </div>

            <div className="space-y-3">
              {materials.map((material) => (
                <MaterialRow
                  key={material.id}
                  material={material}
                  onCostChange={(newCost) =>
                    handleMaterialCostChange(material.id, newCost)
                  }
                  onRemove={() => handleRemoveMaterial(material.id)}
                />
              ))}
            </div>

            {materials.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Nenhum material adicionado</p>
              </div>
            )}
          </Card>
        </div>

        {/* Coluna 2: Resumo e Custos */}
        <div className="space-y-6">
          {/* Resumo de Custos */}
          <Card className="p-6 border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 sticky top-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-purple-600" />
              Resumo de Custos
            </h3>

            <div className="space-y-3">
              <div className="bg-white p-4 rounded-lg border border-purple-200">
                <p className="text-xs text-gray-600 mb-1">Materiais Clínicos</p>
                <p className="text-2xl font-bold text-purple-700">
                  {formatCurrency(totalMaterialCost)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {materials.length} itens
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-purple-200">
                <p className="text-xs text-gray-600 mb-1">Custo Laboratorial</p>
                <p className="text-2xl font-bold text-blue-700">
                  {formatCurrency(labCost)}
                </p>
              </div>

              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-lg text-white">
                <p className="text-xs opacity-90 mb-1">Custo Total de Materiais</p>
                <p className="text-3xl font-bold">{formatCurrency(totalCost)}</p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-yellow-800 mb-1">
                      Atenção
                    </p>
                    <p className="text-xs text-yellow-700">
                      Este é apenas o custo de materiais. O preço final será
                      calculado incluindo seu custo hora clínica.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Dicas do Template */}
          <Card className="p-6 border-2 border-blue-100 bg-blue-50">
            <h3 className="text-sm font-bold text-blue-800 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Dicas de Precificação
            </h3>
            <ul className="space-y-2">
              {template.tips.map((tip, index) => (
                <li key={index} className="text-xs text-blue-700 flex gap-2">
                  <span className="text-blue-500 flex-shrink-0">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

interface MaterialRowProps {
  material: CustomizedMaterial;
  onCostChange: (newCost: number) => void;
  onRemove: () => void;
}

function MaterialRow({ material, onCostChange, onRemove }: MaterialRowProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-semibold text-gray-800">
              {material.name}
            </h4>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
              {getMaterialCategoryLabel(material.category)}
            </span>
          </div>
          <p className="text-xs text-gray-600 mb-2">{material.explanation}</p>

          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Input
                  type="number"
                  value={material.cost}
                  onChange={(e) => onCostChange(Number(e.target.value))}
                  className="h-8 text-sm w-32 border-purple-200"
                  min={0}
                  step={0.5}
                />
                <Button
                  onClick={() => setIsEditing(false)}
                  size="sm"
                  variant="ghost"
                  className="h-8 text-xs"
                >
                  OK
                </Button>
              </>
            ) : (
              <>
                <span className="text-sm font-bold text-purple-700">
                  {formatCurrency(material.cost)}
                </span>
                <Button
                  onClick={() => setIsEditing(true)}
                  size="sm"
                  variant="ghost"
                  className="h-6 text-xs text-purple-600 hover:text-purple-700"
                >
                  Editar
                </Button>
              </>
            )}
          </div>
        </div>

        <Button
          onClick={onRemove}
          size="sm"
          variant="ghost"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
