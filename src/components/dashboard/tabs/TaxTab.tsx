"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Calculator, AlertCircle, Info, Edit, FileText, TrendingUp } from "lucide-react";
import type { TaxConfig, SimplesNacionalFaixa } from "@/lib/types";
import { formatCurrency } from "@/lib/calculations";

interface TaxTabProps {
  taxConfig: TaxConfig;
  onUpdateTaxConfig: (config: TaxConfig) => void;
}

const BRAZILIAN_STATES = [
  { code: "AC", name: "Acre", avgISS: 3.5 },
  { code: "AL", name: "Alagoas", avgISS: 3.5 },
  { code: "AP", name: "Amapá", avgISS: 3.5 },
  { code: "AM", name: "Amazonas", avgISS: 3.5 },
  { code: "BA", name: "Bahia", avgISS: 3.5 },
  { code: "CE", name: "Ceará", avgISS: 3.5 },
  { code: "DF", name: "Distrito Federal", avgISS: 3.5 },
  { code: "ES", name: "Espírito Santo", avgISS: 3.5 },
  { code: "GO", name: "Goiás", avgISS: 3.5 },
  { code: "MA", name: "Maranhão", avgISS: 3.5 },
  { code: "MT", name: "Mato Grosso", avgISS: 3.5 },
  { code: "MS", name: "Mato Grosso do Sul", avgISS: 3.5 },
  { code: "MG", name: "Minas Gerais", avgISS: 3.5 },
  { code: "PA", name: "Pará", avgISS: 3.5 },
  { code: "PB", name: "Paraíba", avgISS: 3.5 },
  { code: "PR", name: "Paraná", avgISS: 3.5 },
  { code: "PE", name: "Pernambuco", avgISS: 3.5 },
  { code: "PI", name: "Piauí", avgISS: 3.5 },
  { code: "RJ", name: "Rio de Janeiro", avgISS: 5.0 },
  { code: "RN", name: "Rio Grande do Norte", avgISS: 3.5 },
  { code: "RS", name: "Rio Grande do Sul", avgISS: 3.5 },
  { code: "RO", name: "Rondônia", avgISS: 3.5 },
  { code: "RR", name: "Roraima", avgISS: 3.5 },
  { code: "SC", name: "Santa Catarina", avgISS: 3.5 },
  { code: "SP", name: "São Paulo", avgISS: 5.0 },
  { code: "SE", name: "Sergipe", avgISS: 3.5 },
  { code: "TO", name: "Tocantins", avgISS: 3.5 },
];

// 📊 TABELAS OFICIAIS DO SIMPLES NACIONAL - APENAS ALÍQUOTA NOMINAL

// 🟦 ANEXO V - Serviços Intelectuais / Odontologia
const ANEXO_V_FAIXAS: SimplesNacionalFaixa[] = [
  { faixa: 1, limiteInferior: 0, limiteSuperior: 180000, aliquota: 15.5 },
  { faixa: 2, limiteInferior: 180000.01, limiteSuperior: 360000, aliquota: 18 },
  { faixa: 3, limiteInferior: 360000.01, limiteSuperior: 720000, aliquota: 19.5 },
  { faixa: 4, limiteInferior: 720000.01, limiteSuperior: 1800000, aliquota: 20.5 },
  { faixa: 5, limiteInferior: 1800000.01, limiteSuperior: 3600000, aliquota: 23 },
  { faixa: 6, limiteInferior: 3600000.01, limiteSuperior: 4800000, aliquota: 30.5 },
];

// 🟩 ANEXO III - Serviços com Fator R
const ANEXO_III_FAIXAS: SimplesNacionalFaixa[] = [
  { faixa: 1, limiteInferior: 0, limiteSuperior: 180000, aliquota: 6 },
  { faixa: 2, limiteInferior: 180000.01, limiteSuperior: 360000, aliquota: 11.2 },
  { faixa: 3, limiteInferior: 360000.01, limiteSuperior: 720000, aliquota: 13.5 },
  { faixa: 4, limiteInferior: 720000.01, limiteSuperior: 1800000, aliquota: 16 },
  { faixa: 5, limiteInferior: 1800000.01, limiteSuperior: 3600000, aliquota: 21 },
  { faixa: 6, limiteInferior: 3600000.01, limiteSuperior: 4800000, aliquota: 33 },
];

const DEFAULT_TAX_CONFIGS = {
  lucroPresumido: {
    iss: 5.0,
    pis: 0.65,
    cofins: 3.0,
    irpj: 4.8,
    csll: 2.88,
  },
  lucroReal: {
    iss: 5.0,
    pis: 1.65,
    cofins: 7.6,
    irpj: 15.0,
    csll: 9.0,
  },
  cpf: {
    iss: 5.0,
    inss: 11.0,
    irpf: 15.0,
  },
};

export function TaxTab({ taxConfig, onUpdateTaxConfig }: TaxTabProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingTaxes, setEditingTaxes] = useState<any>(null);

  // 🔒 VALIDAÇÃO AUTOMÁTICA NA MONTAGEM DO COMPONENTE
  useEffect(() => {
    if (taxConfig.regime === "simplesNacional" && taxConfig.rates) {
      const anexo = (taxConfig.rates.anexo || "anexo3") as "anexo3" | "anexo5";
      const faixaSelecionada = taxConfig.rates.faixaSelecionada || 1;
      const totalRate = taxConfig.rates.totalRate || 0;

      // Se está na faixa 1 e a alíquota está zerada, corrigir automaticamente
      if (faixaSelecionada === 1 && totalRate === 0) {
        const aliquotaCorreta = anexo === "anexo5" ? 15.5 : 6.0;
        console.warn(`⚠️ CORREÇÃO AUTOMÁTICA: Faixa 1 do ${anexo === "anexo5" ? "Anexo V" : "Anexo III"} estava com 0%, corrigindo para ${aliquotaCorreta}%`);
        
        onUpdateTaxConfig({
          ...taxConfig,
          rates: {
            ...taxConfig.rates,
            totalRate: aliquotaCorreta,
            faixaSelecionada: 1,
            anexo,
          },
        });
      }
    }
  }, [taxConfig, onUpdateTaxConfig]);

  const handleRegimeChange = (regime: TaxConfig["regime"]) => {
    let defaultRates: any = {};

    switch (regime) {
      case "simplesNacional":
        // 🔒 GARANTIA: Faixa 1 nunca pode ser 0%
        // Anexo III padrão = 6% | Anexo V = 15,5%
        defaultRates = {
          totalRate: 6.0, // Anexo III - Faixa 1
          anexo: "anexo3",
          faixaSelecionada: 1,
        };
        console.log("✅ Simples Nacional selecionado - Anexo III, Faixa 1, Alíquota: 6%");
        break;
      case "lucroPresumido":
        defaultRates = DEFAULT_TAX_CONFIGS.lucroPresumido;
        break;
      case "lucroReal":
        defaultRates = DEFAULT_TAX_CONFIGS.lucroReal;
        break;
      case "cpf":
        defaultRates = DEFAULT_TAX_CONFIGS.cpf;
        break;
    }

    onUpdateTaxConfig({
      ...taxConfig,
      regime,
      rates: defaultRates,
    });
  };

  const handleAnexoChange = (anexo: "anexo3" | "anexo5") => {
    const faixas = anexo === "anexo5" ? ANEXO_V_FAIXAS : ANEXO_III_FAIXAS;
    const primeiraFaixa = faixas[0];

    // 🔒 VALIDAÇÃO: Faixa 1 nunca pode ser 0%
    const aliquotaCorreta = primeiraFaixa.aliquota;
    if (aliquotaCorreta === 0) {
      console.error("❌ ERRO CRÍTICO: Faixa 1 com alíquota 0% detectada na tabela!");
    }

    console.log(`✅ Anexo alterado para ${anexo === "anexo5" ? "Anexo V" : "Anexo III"} - Faixa 1, Alíquota: ${aliquotaCorreta}%`);

    onUpdateTaxConfig({
      ...taxConfig,
      rates: {
        ...taxConfig.rates,
        anexo,
        faixaSelecionada: 1,
        totalRate: aliquotaCorreta,
      },
    });
  };

  const handleFaixaChange = (faixa: number) => {
    const anexo = (taxConfig.rates?.anexo || "anexo3") as "anexo3" | "anexo5";
    const faixas = anexo === "anexo5" ? ANEXO_V_FAIXAS : ANEXO_III_FAIXAS;
    const faixaSelecionada = faixas.find((f) => f.faixa === faixa);

    if (!faixaSelecionada) return;

    // 🔒 VALIDAÇÃO: Faixa 1 nunca pode ser 0%
    const aliquotaCorreta = faixaSelecionada.aliquota;
    if (faixa === 1 && aliquotaCorreta === 0) {
      console.error("❌ ERRO CRÍTICO: Faixa 1 com alíquota 0% detectada!");
      // Correção automática
      const aliquotaFallback = anexo === "anexo5" ? 15.5 : 6.0;
      console.warn(`⚠️ Aplicando correção automática: ${aliquotaFallback}%`);
      onUpdateTaxConfig({
        ...taxConfig,
        rates: {
          ...taxConfig.rates,
          faixaSelecionada: faixa,
          totalRate: aliquotaFallback,
        },
      });
      return;
    }

    console.log(`✅ Faixa ${faixa} selecionada - Alíquota: ${aliquotaCorreta}%`);

    onUpdateTaxConfig({
      ...taxConfig,
      rates: {
        ...taxConfig.rates,
        faixaSelecionada: faixa,
        totalRate: aliquotaCorreta,
      },
    });
  };

  const handleStateChange = (stateCode: string) => {
    const state = BRAZILIAN_STATES.find((s) => s.code === stateCode);
    if (state) {
      onUpdateTaxConfig({
        ...taxConfig,
        state: stateCode,
        customISS: state.avgISS,
      });
    }
  };

  const handleEditTaxes = () => {
    setEditingTaxes({ ...taxConfig.rates });
    setShowEditDialog(true);
  };

  const handleSaveTaxes = () => {
    onUpdateTaxConfig({
      ...taxConfig,
      rates: editingTaxes,
    });
    setShowEditDialog(false);
  };

  const calculateTotalTaxRate = (): number => {
    if (!taxConfig.rates) return 0;

    switch (taxConfig.regime) {
      case "simplesNacional":
        return taxConfig.rates.totalRate || 0;
      case "lucroPresumido":
        return (
          (taxConfig.rates.iss || 0) +
          (taxConfig.rates.pis || 0) +
          (taxConfig.rates.cofins || 0) +
          (taxConfig.rates.irpj || 0) +
          (taxConfig.rates.csll || 0)
        );
      case "lucroReal":
        return (
          (taxConfig.rates.iss || 0) +
          (taxConfig.rates.pis || 0) +
          (taxConfig.rates.cofins || 0) +
          (taxConfig.rates.irpj || 0) +
          (taxConfig.rates.csll || 0)
        );
      case "cpf":
        return (
          (taxConfig.rates.iss || 0) +
          (taxConfig.rates.inss || 0) +
          (taxConfig.rates.irpf || 0)
        );
      default:
        return 0;
    }
  };

  const getRegimeName = (regime: string): string => {
    const names: Record<string, string> = {
      simplesNacional: "Simples Nacional",
      lucroPresumido: "Lucro Presumido",
      lucroReal: "Lucro Real",
      cpf: "Pessoa Física (CPF)",
    };
    return names[regime] || regime;
  };

  const selectedState = BRAZILIAN_STATES.find((s) => s.code === taxConfig.state);
  const totalTaxRate = calculateTotalTaxRate();

  // Obter faixas do anexo selecionado
  const anexoAtual = (taxConfig.rates?.anexo || "anexo3") as "anexo3" | "anexo5";
  const faixasAtuais = anexoAtual === "anexo5" ? ANEXO_V_FAIXAS : ANEXO_III_FAIXAS;
  const faixaSelecionadaAtual = faixasAtuais.find(
    (f) => f.faixa === taxConfig.rates?.faixaSelecionada
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Calculator className="w-6 h-6 text-blue-600" />
            Impostos e Tributação
          </CardTitle>
          <CardDescription className="text-base">
            Configure o regime tributário da sua clínica para calcular o preço final correto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-gray-600 mb-1">Regime Tributário</p>
              <p className="text-xl font-bold text-blue-600">
                {getRegimeName(taxConfig.regime)}
              </p>
              {taxConfig.regime === "simplesNacional" && taxConfig.rates?.anexo && (
                <p className="text-sm text-gray-600 mt-1">
                  {taxConfig.rates.anexo === "anexo3" ? "Anexo III" : "Anexo V"}
                </p>
              )}
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-gray-600 mb-1">Carga Tributária Total</p>
              <p className="text-xl font-bold text-cyan-600">
                {totalTaxRate.toFixed(2)}%
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
                <strong>Os percentuais são estimativas médias.</strong> Consulte seu contador
                para ajustar conforme sua realidade tributária específica. A tributação pode
                variar conforme faturamento, município e atividades.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seleção de Regime */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Regime Tributário</CardTitle>
          <CardDescription>
            Escolha como sua clínica é tributada
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Tipo de Regime</Label>
            <Select value={taxConfig.regime} onValueChange={handleRegimeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="simplesNacional">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Simples Nacional</span>
                    <span className="text-xs text-gray-500">Regime simplificado para PMEs</span>
                  </div>
                </SelectItem>
                <SelectItem value="lucroPresumido">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Lucro Presumido</span>
                    <span className="text-xs text-gray-500">Tributação sobre margem presumida</span>
                  </div>
                </SelectItem>
                <SelectItem value="lucroReal">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Lucro Real</span>
                    <span className="text-xs text-gray-500">Tributação sobre lucro efetivo</span>
                  </div>
                </SelectItem>
                <SelectItem value="cpf">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Pessoa Física (CPF)</span>
                    <span className="text-xs text-gray-500">Profissional autônomo</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 🆕 SIMPLES NACIONAL - ANEXO E FAIXA (APENAS ALÍQUOTA NOMINAL) */}
          {taxConfig.regime === "simplesNacional" && (
            <div className="space-y-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Configuração do Simples Nacional</h3>
              </div>

              {/* Seleção de Anexo */}
              <div className="space-y-2">
                <Label>Anexo do Simples Nacional</Label>
                <Select
                  value={taxConfig.rates?.anexo || "anexo3"}
                  onValueChange={handleAnexoChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="anexo3">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Anexo III - Serviços com Fator R</span>
                        <span className="text-xs text-gray-500">Alíquotas de 6% a 33%</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="anexo5">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Anexo V - Serviços Intelectuais</span>
                        <span className="text-xs text-gray-500">Alíquotas de 15,5% a 30,5%</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Seleção de Faixa */}
              <div className="space-y-2">
                <Label>Faixa de Faturamento Anual (RBT12)</Label>
                <Select
                  value={String(taxConfig.rates?.faixaSelecionada || 1)}
                  onValueChange={(value) => handleFaixaChange(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {faixasAtuais.map((faixa) => (
                      <SelectItem key={faixa.faixa} value={String(faixa.faixa)}>
                        <div className="flex flex-col items-start">
                          <span className="font-medium">
                            Faixa {faixa.faixa} - Alíquota {faixa.aliquota}%
                          </span>
                          <span className="text-xs text-gray-500">
                            {faixa.limiteInferior === 0 ? "Até" : "De"}{" "}
                            {formatCurrency(faixa.limiteInferior)}
                            {faixa.limiteInferior > 0 && ` a ${formatCurrency(faixa.limiteSuperior)}`}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Informações da Faixa Selecionada - APENAS ALÍQUOTA NOMINAL */}
              {faixaSelecionadaAtual && (
                <div className="bg-white rounded-lg p-4 border border-blue-300 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-blue-900">Alíquota Nominal:</span>
                    <span className="text-lg font-bold text-blue-600">
                      {faixaSelecionadaAtual.aliquota}%
                    </span>
                  </div>
                </div>
              )}

              {/* Texto Explicativo */}
              <div className="bg-cyan-50 rounded-lg p-3 border border-cyan-200">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-cyan-800">
                    Para simplificação e padronização da precificação, o sistema utiliza a <strong>alíquota nominal do Simples Nacional</strong>, conforme a faixa de faturamento selecionada.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 🔧 LOCALIZAÇÃO E ISS - APENAS PARA LUCRO PRESUMIDO E LUCRO REAL */}
      {(taxConfig.regime === "lucroPresumido" || taxConfig.regime === "lucroReal") && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Localização e ISS</CardTitle>
            <CardDescription>
              O ISS varia conforme o município
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select value={taxConfig.state} onValueChange={handleStateChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
                <SelectContent>
                  {BRAZILIAN_STATES.map((state) => (
                    <SelectItem key={state.code} value={state.code}>
                      {state.name} - ISS médio: {state.avgISS}%
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedState && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      Base tributária utilizada para: {selectedState.name}
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      ISS médio sugerido: {taxConfig.customISS}%
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>ISS Customizado (%)</Label>
              <Input
                type="number"
                value={taxConfig.customISS || 0}
                onChange={(e) =>
                  onUpdateTaxConfig({
                    ...taxConfig,
                    customISS: parseFloat(e.target.value) || 0,
                  })
                }
                step="0.01"
                placeholder="Ex: 5.00"
              />
              <p className="text-xs text-gray-500">
                Ajuste conforme a alíquota do seu município
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detalhamento dos Impostos */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Detalhamento dos Impostos</CardTitle>
              <CardDescription>
                Percentuais aplicados sobre o faturamento
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleEditTaxes}
              className="gap-2"
            >
              <Edit className="w-4 h-4" />
              Editar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {taxConfig.regime === "simplesNacional" && (
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">Simples Nacional (Nominal)</span>
                <span className="text-lg font-bold text-blue-600">
                  {(taxConfig.rates?.totalRate || 0).toFixed(2)}%
                </span>
              </div>
            )}

            {(taxConfig.regime === "lucroPresumido" || taxConfig.regime === "lucroReal") && (
              <>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-900">ISS</span>
                  <span className="font-semibold text-gray-900">
                    {taxConfig.rates?.iss?.toFixed(2) || 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-900">PIS</span>
                  <span className="font-semibold text-gray-900">
                    {taxConfig.rates?.pis?.toFixed(2) || 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-900">COFINS</span>
                  <span className="font-semibold text-gray-900">
                    {taxConfig.rates?.cofins?.toFixed(2) || 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-900">IRPJ</span>
                  <span className="font-semibold text-gray-900">
                    {taxConfig.rates?.irpj?.toFixed(2) || 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-900">CSLL</span>
                  <span className="font-semibold text-gray-900">
                    {taxConfig.rates?.csll?.toFixed(2) || 0}%
                  </span>
                </div>
              </>
            )}

            {taxConfig.regime === "cpf" && (
              <>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-900">ISS</span>
                  <span className="font-semibold text-gray-900">
                    {taxConfig.rates?.iss?.toFixed(2) || 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-900">INSS</span>
                  <span className="font-semibold text-gray-900">
                    {taxConfig.rates?.inss?.toFixed(2) || 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-900">IRPF (estimado)</span>
                  <span className="font-semibold text-gray-900">
                    {taxConfig.rates?.irpf?.toFixed(2) || 0}%
                  </span>
                </div>
              </>
            )}

            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border-2 border-blue-200 mt-4">
              <span className="font-bold text-gray-900">Carga Tributária Total</span>
              <span className="text-xl font-bold text-blue-600">
                {totalTaxRate.toFixed(2)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Forma de Cálculo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Forma de Cálculo</CardTitle>
          <CardDescription>
            Como os impostos serão aplicados no preço
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Método de Aplicação</Label>
            <Select
              value={taxConfig.calculationMethod}
              onValueChange={(value: "onRevenue" | "embedded") =>
                onUpdateTaxConfig({
                  ...taxConfig,
                  calculationMethod: value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="onRevenue">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Imposto sobre faturamento</span>
                    <span className="text-xs text-gray-500">
                      Imposto calculado sobre o valor total do procedimento
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="embedded">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Imposto embutido no preço</span>
                    <span className="text-xs text-gray-500">
                      Preço final já inclui os impostos
                    </span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
            <div className="flex items-start gap-2">
              <FileText className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-cyan-900">
                  {taxConfig.calculationMethod === "onRevenue"
                    ? "Os impostos serão somados ao custo final do tratamento"
                    : "O preço sugerido já considera os impostos inclusos"}
                </p>
                <p className="text-xs text-cyan-700 mt-1">
                  Isso impacta diretamente na margem líquida e no preço final sugerido
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de edição de impostos */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Percentuais de Impostos</DialogTitle>
            <DialogDescription>
              Ajuste os percentuais conforme sua realidade tributária
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {taxConfig.regime === "simplesNacional" && (
              <div className="space-y-2">
                <Label>Alíquota Nominal do Simples Nacional (%)</Label>
                <Input
                  type="number"
                  value={editingTaxes?.totalRate || 0}
                  onChange={(e) =>
                    setEditingTaxes({
                      ...editingTaxes,
                      totalRate: parseFloat(e.target.value) || 0,
                    })
                  }
                  step="0.01"
                />
                <p className="text-xs text-gray-500">
                  Este valor será usado nos cálculos de precificação
                </p>
              </div>
            )}

            {(taxConfig.regime === "lucroPresumido" || taxConfig.regime === "lucroReal") && (
              <>
                <div className="space-y-2">
                  <Label>ISS (%)</Label>
                  <Input
                    type="number"
                    value={editingTaxes?.iss || 0}
                    onChange={(e) =>
                      setEditingTaxes({
                        ...editingTaxes,
                        iss: parseFloat(e.target.value) || 0,
                      })
                    }
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label>PIS (%)</Label>
                  <Input
                    type="number"
                    value={editingTaxes?.pis || 0}
                    onChange={(e) =>
                      setEditingTaxes({
                        ...editingTaxes,
                        pis: parseFloat(e.target.value) || 0,
                      })
                    }
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label>COFINS (%)</Label>
                  <Input
                    type="number"
                    value={editingTaxes?.cofins || 0}
                    onChange={(e) =>
                      setEditingTaxes({
                        ...editingTaxes,
                        cofins: parseFloat(e.target.value) || 0,
                      })
                    }
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label>IRPJ (%)</Label>
                  <Input
                    type="number"
                    value={editingTaxes?.irpj || 0}
                    onChange={(e) =>
                      setEditingTaxes({
                        ...editingTaxes,
                        irpj: parseFloat(e.target.value) || 0,
                      })
                    }
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label>CSLL (%)</Label>
                  <Input
                    type="number"
                    value={editingTaxes?.csll || 0}
                    onChange={(e) =>
                      setEditingTaxes({
                        ...editingTaxes,
                        csll: parseFloat(e.target.value) || 0,
                      })
                    }
                    step="0.01"
                  />
                </div>
              </>
            )}

            {taxConfig.regime === "cpf" && (
              <>
                <div className="space-y-2">
                  <Label>ISS (%)</Label>
                  <Input
                    type="number"
                    value={editingTaxes?.iss || 0}
                    onChange={(e) =>
                      setEditingTaxes({
                        ...editingTaxes,
                        iss: parseFloat(e.target.value) || 0,
                      })
                    }
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label>INSS (%)</Label>
                  <Input
                    type="number"
                    value={editingTaxes?.inss || 0}
                    onChange={(e) =>
                      setEditingTaxes({
                        ...editingTaxes,
                        inss: parseFloat(e.target.value) || 0,
                      })
                    }
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label>IRPF Estimado (%)</Label>
                  <Input
                    type="number"
                    value={editingTaxes?.irpf || 0}
                    onChange={(e) =>
                      setEditingTaxes({
                        ...editingTaxes,
                        irpf: parseFloat(e.target.value) || 0,
                      })
                    }
                    step="0.01"
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSaveTaxes}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
