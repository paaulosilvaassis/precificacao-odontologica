import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  TREATMENTS_DATABASE,
  getAllCategories,
  getCategoryLabel,
  getTreatmentsByCategory,
  type TreatmentTemplate,
} from "@/lib/treatments-database";
import {
  Search,
  Stethoscope,
  Clock,
  DollarSign,
  Info,
  Plus,
  ChevronRight,
} from "lucide-react";

interface TreatmentLibraryProps {
  onSelectTreatment: (template: TreatmentTemplate) => void;
}

export function TreatmentLibrary({ onSelectTreatment }: TreatmentLibraryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = getAllCategories();

  // Filtrar tratamentos
  const filteredTreatments = TREATMENTS_DATABASE.filter((treatment) => {
    const matchesSearch = treatment.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory
      ? treatment.category === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border-2 border-purple-200">
        <div className="flex items-start gap-4">
          <div className="bg-purple-100 p-3 rounded-xl">
            <Stethoscope className="w-8 h-8 text-purple-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Biblioteca de Tratamentos
            </h2>
            <p className="text-gray-600">
              Base completa com {TREATMENTS_DATABASE.length} tratamentos
              odontológicos, materiais detalhados e custos médios de mercado.
            </p>
          </div>
        </div>
      </div>

      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Buscar tratamento... (ex: restauração, implante, canal)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-12 h-12 text-base border-2 border-purple-200 focus:border-purple-400"
        />
      </div>

      {/* Categorias */}
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => setSelectedCategory(null)}
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          className={
            selectedCategory === null
              ? "bg-purple-600 hover:bg-purple-700"
              : "border-purple-200 hover:border-purple-400"
          }
        >
          Todos ({TREATMENTS_DATABASE.length})
        </Button>
        {categories.map((category) => {
          const count = getTreatmentsByCategory(category).length;
          return (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              className={
                selectedCategory === category
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "border-purple-200 hover:border-purple-400"
              }
            >
              {getCategoryLabel(category)} ({count})
            </Button>
          );
        })}
      </div>

      {/* Lista de tratamentos */}
      {filteredTreatments.length === 0 ? (
        <Card className="p-12 text-center border-2 border-dashed border-gray-300">
          <div className="bg-gray-100 p-6 rounded-full w-fit mx-auto mb-4">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Nenhum tratamento encontrado
          </h3>
          <p className="text-gray-600">
            Tente buscar por outro termo ou selecione outra categoria
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTreatments.map((treatment) => (
            <TreatmentCard
              key={treatment.id}
              treatment={treatment}
              onSelect={() => onSelectTreatment(treatment)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface TreatmentCardProps {
  treatment: TreatmentTemplate;
  onSelect: () => void;
}

function TreatmentCard({ treatment, onSelect }: TreatmentCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Card className="p-5 border-2 border-purple-100 hover:border-purple-300 hover:shadow-lg transition-all bg-white">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded">
                {getCategoryLabel(treatment.category)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              {treatment.name}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {treatment.description}
            </p>
          </div>
        </div>

        {/* Informações rápidas */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-center gap-1 mb-1">
              <Clock className="w-3 h-3 text-blue-600" />
              <span className="text-xs text-blue-700 font-medium">Tempo</span>
            </div>
            <p className="text-sm font-bold text-blue-800">
              {treatment.durationAvg} min
            </p>
          </div>

          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <div className="flex items-center gap-1 mb-1">
              <DollarSign className="w-3 h-3 text-green-600" />
              <span className="text-xs text-green-700 font-medium">
                Materiais
              </span>
            </div>
            <p className="text-sm font-bold text-green-800">
              {treatment.materials.length} itens
            </p>
          </div>

          <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
            <div className="flex items-center gap-1 mb-1">
              <DollarSign className="w-3 h-3 text-purple-600" />
              <span className="text-xs text-purple-700 font-medium">
                Mercado
              </span>
            </div>
            <p className="text-xs font-bold text-purple-800">
              R$ {treatment.marketPriceAvg}
            </p>
          </div>
        </div>

        {/* Detalhes expandidos */}
        {showDetails && (
          <div className="space-y-3 pt-3 border-t border-gray-200">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                💡 Dicas de Precificação:
              </h4>
              <ul className="space-y-1">
                {treatment.tips.map((tip, index) => (
                  <li key={index} className="text-xs text-gray-600 flex gap-2">
                    <span className="text-purple-500">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                📦 Principais Materiais:
              </h4>
              <div className="flex flex-wrap gap-1">
                {treatment.materials.slice(0, 5).map((material) => (
                  <span
                    key={material.id}
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                  >
                    {material.name}
                  </span>
                ))}
                {treatment.materials.length > 5 && (
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    +{treatment.materials.length - 5} mais
                  </span>
                )}
              </div>
            </div>

            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              <p className="text-xs text-yellow-800">
                <strong>Faixa de mercado:</strong> R${" "}
                {treatment.marketPriceMin} - R$ {treatment.marketPriceMax}
              </p>
            </div>
          </div>
        )}

        {/* Ações */}
        <div className="flex gap-2">
          <Button
            onClick={() => setShowDetails(!showDetails)}
            variant="outline"
            size="sm"
            className="flex-1 border-purple-200 hover:border-purple-400 hover:bg-purple-50"
          >
            <Info className="w-4 h-4 mr-2" />
            {showDetails ? "Ocultar" : "Ver"} Detalhes
          </Button>
          <Button
            onClick={onSelect}
            size="sm"
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Usar Template
          </Button>
        </div>
      </div>
    </Card>
  );
}
