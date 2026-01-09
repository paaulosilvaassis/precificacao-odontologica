import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Info, HelpCircle, TrendingUp, AlertTriangle, Package } from "lucide-react";
import type { MaterialDetail } from "@/lib/treatments-database";
import { getMaterialCategoryLabel } from "@/lib/treatments-database";
import { formatCurrency } from "@/lib/calculations";

interface MaterialInfoDialogProps {
  material: MaterialDetail;
  children: React.ReactNode;
}

export function MaterialInfoDialog({ material, children }: MaterialInfoDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Package className="w-6 h-6 text-purple-600" />
            {material.name}
          </DialogTitle>
          <DialogDescription>
            Informações detalhadas sobre este material
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Categoria */}
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-purple-600" />
              <h3 className="text-sm font-semibold text-purple-800">Categoria</h3>
            </div>
            <p className="text-sm text-purple-700">
              {getMaterialCategoryLabel(material.category)}
            </p>
          </div>

          {/* Explicação */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-semibold text-blue-800">Para que serve?</h3>
            </div>
            <p className="text-sm text-blue-700">{material.explanation}</p>
          </div>

          {/* Faixa de Custo */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <h3 className="text-sm font-semibold text-green-800">
                Faixa de Custo por {material.unit}
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded-lg border border-green-300">
                <p className="text-xs text-green-700 mb-1">Mínimo</p>
                <p className="text-lg font-bold text-green-800">
                  {formatCurrency(material.costMin)}
                </p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-green-300">
                <p className="text-xs text-green-700 mb-1">Médio</p>
                <p className="text-lg font-bold text-green-800">
                  {formatCurrency(material.costAvg)}
                </p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-green-300">
                <p className="text-xs text-green-700 mb-1">Máximo</p>
                <p className="text-lg font-bold text-green-800">
                  {formatCurrency(material.costMax)}
                </p>
              </div>
            </div>
          </div>

          {/* Dicas */}
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-yellow-800 mb-2">
                  Dicas de Uso
                </h3>
                <ul className="space-y-1 text-sm text-yellow-700">
                  {material.category === "descartavel" && (
                    <>
                      <li>• Use sempre material novo para cada paciente</li>
                      <li>• Considere compra em maior quantidade para reduzir custo</li>
                      <li>• Verifique validade regularmente</li>
                    </>
                  )}
                  {material.category === "reutilizavel" && (
                    <>
                      <li>• Custo calculado por uso (inclui esterilização)</li>
                      <li>• Vida útil varia conforme cuidados e manutenção</li>
                      <li>• Considere depreciação no cálculo</li>
                    </>
                  )}
                  {material.category === "alto_custo" && (
                    <>
                      <li>• Material de alto valor agregado</li>
                      <li>• Negocie com fornecedores para melhores preços</li>
                      <li>• Considere parcelamento na compra</li>
                    </>
                  )}
                  {material.category === "laboratorial" && (
                    <>
                      <li>• Custo pode variar muito entre laboratórios</li>
                      <li>• Considere qualidade x preço</li>
                      <li>• Estabeleça parcerias de longo prazo</li>
                    </>
                  )}
                  {material.category === "clinico_basico" && (
                    <>
                      <li>• Material essencial para procedimentos</li>
                      <li>• Mantenha estoque adequado</li>
                      <li>• Compare marcas e fornecedores</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface CategoryExplanationProps {
  category: MaterialDetail["category"];
}

export function CategoryExplanation({ category }: CategoryExplanationProps) {
  const explanations: Record<
    MaterialDetail["category"],
    { title: string; description: string; icon: React.ReactNode; color: string }
  > = {
    descartavel: {
      title: "Descartável",
      description:
        "Materiais de uso único, descartados após cada procedimento. Essenciais para biossegurança.",
      icon: <Package className="w-5 h-5" />,
      color: "blue",
    },
    reutilizavel: {
      title: "Reutilizável",
      description:
        "Instrumentos que podem ser esterilizados e reutilizados. Custo calculado por uso.",
      icon: <Package className="w-5 h-5" />,
      color: "green",
    },
    alto_custo: {
      title: "Alto Custo",
      description:
        "Materiais de valor elevado que impactam significativamente no custo do procedimento.",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "red",
    },
    laboratorial: {
      title: "Laboratorial",
      description:
        "Serviços e materiais fornecidos por laboratórios de prótese parceiros.",
      icon: <Package className="w-5 h-5" />,
      color: "purple",
    },
    clinico_basico: {
      title: "Clínico Básico",
      description:
        "Materiais de uso rotineiro na clínica, essenciais para diversos procedimentos.",
      icon: <Package className="w-5 h-5" />,
      color: "gray",
    },
  };

  const info = explanations[category];
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    green: "bg-green-50 border-green-200 text-green-700",
    red: "bg-red-50 border-red-200 text-red-700",
    purple: "bg-purple-50 border-purple-200 text-purple-700",
    gray: "bg-gray-50 border-gray-200 text-gray-700",
  };

  return (
    <div className={`p-3 rounded-lg border ${colorClasses[info.color as keyof typeof colorClasses]}`}>
      <div className="flex items-start gap-2">
        {info.icon}
        <div>
          <h4 className="text-sm font-semibold mb-1">{info.title}</h4>
          <p className="text-xs">{info.description}</p>
        </div>
      </div>
    </div>
  );
}
