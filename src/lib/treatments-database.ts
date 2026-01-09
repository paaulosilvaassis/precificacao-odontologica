// Base de dados completa de tratamentos odontológicos
// Com materiais detalhados, custos médios e tempos clínicos

export interface MaterialDetail {
  id: string;
  name: string;
  category: "descartavel" | "reutilizavel" | "alto_custo" | "laboratorial" | "clinico_basico";
  costMin: number;
  costAvg: number;
  costMax: number;
  unit: string;
  explanation: string;
}

export interface TreatmentTemplate {
  id: string;
  name: string;
  category: "preventivo" | "restaurador" | "endodontia" | "cirurgia" | "implantodontia" | "protese" | "estetica" | "ortodontia";
  durationMin: number;
  durationAvg: number;
  durationMax: number;
  materials: MaterialDetail[];
  labCostAvg: number;
  marketPriceMin: number;
  marketPriceAvg: number;
  marketPriceMax: number;
  description: string;
  tips: string[];
}

// ============================================
// MATERIAIS COMUNS (REUTILIZÁVEIS)
// ============================================

const MATERIAIS_BASICOS: MaterialDetail[] = [
  {
    id: "anestesico",
    name: "Anestésico (tubete)",
    category: "clinico_basico",
    costMin: 2.5,
    costAvg: 3.5,
    costMax: 5.0,
    unit: "tubete",
    explanation: "Anestésico local para procedimentos. Marcas: Mepiadre, Alphacaine, Articaine."
  },
  {
    id: "agulha_anestesia",
    name: "Agulha para anestesia",
    category: "descartavel",
    costMin: 0.5,
    costAvg: 0.8,
    costMax: 1.2,
    unit: "unidade",
    explanation: "Agulha descartável curta ou longa para aplicação de anestésico."
  },
  {
    id: "luvas",
    name: "Luvas de procedimento",
    category: "descartavel",
    costMin: 0.3,
    costAvg: 0.5,
    costMax: 0.8,
    unit: "par",
    explanation: "Luvas descartáveis de látex ou nitrílica para proteção."
  },
  {
    id: "mascara",
    name: "Máscara descartável",
    category: "descartavel",
    costMin: 0.2,
    costAvg: 0.4,
    costMax: 0.6,
    unit: "unidade",
    explanation: "Máscara cirúrgica tripla para proteção do profissional."
  },
  {
    id: "campo_descartavel",
    name: "Campo descartável",
    category: "descartavel",
    costMin: 0.5,
    costAvg: 1.0,
    costMax: 1.5,
    unit: "unidade",
    explanation: "Campo estéril para proteção da área de trabalho."
  },
  {
    id: "sugador",
    name: "Sugador descartável",
    category: "descartavel",
    costMin: 0.3,
    costAvg: 0.5,
    costMax: 0.8,
    unit: "unidade",
    explanation: "Ponteira de sucção descartável para aspiração."
  },
  {
    id: "babador",
    name: "Babador descartável",
    category: "descartavel",
    costMin: 0.1,
    costAvg: 0.2,
    costMax: 0.3,
    unit: "unidade",
    explanation: "Proteção para o paciente durante o procedimento."
  },
  {
    id: "gaze",
    name: "Gaze estéril",
    category: "descartavel",
    costMin: 0.1,
    costAvg: 0.2,
    costMax: 0.3,
    unit: "unidade",
    explanation: "Gaze para limpeza e hemostasia."
  },
];

// ============================================
// BASE DE TRATAMENTOS COMPLETA
// ============================================

export const TREATMENTS_DATABASE: TreatmentTemplate[] = [
  
  // ============================================
  // PREVENTIVOS
  // ============================================
  
  {
    id: "consulta_inicial",
    name: "Consulta Inicial",
    category: "preventivo",
    durationMin: 20,
    durationAvg: 30,
    durationMax: 45,
    materials: [
      ...MATERIAIS_BASICOS.filter(m => ["luvas", "mascara", "campo_descartavel"].includes(m.id)),
      {
        id: "ficha_clinica",
        name: "Ficha clínica impressa",
        category: "clinico_basico",
        costMin: 0.5,
        costAvg: 1.0,
        costMax: 1.5,
        unit: "unidade",
        explanation: "Documentação e anamnese do paciente."
      }
    ],
    labCostAvg: 0,
    marketPriceMin: 80,
    marketPriceAvg: 150,
    marketPriceMax: 300,
    description: "Primeira consulta com anamnese, exame clínico e plano de tratamento.",
    tips: [
      "Inclua tempo para radiografias se necessário",
      "Considere o valor estratégico da primeira impressão",
      "Pode ser oferecida como cortesia em campanhas"
    ]
  },

  {
    id: "profilaxia",
    name: "Profilaxia",
    category: "preventivo",
    durationMin: 30,
    durationAvg: 40,
    durationMax: 60,
    materials: [
      ...MATERIAIS_BASICOS,
      {
        id: "pasta_profilaxia",
        name: "Pasta profilática",
        category: "clinico_basico",
        costMin: 0.5,
        costAvg: 1.0,
        costMax: 2.0,
        unit: "dose",
        explanation: "Pasta abrasiva para polimento dental."
      },
      {
        id: "escova_robinson",
        name: "Escova de Robinson",
        category: "descartavel",
        costMin: 1.0,
        costAvg: 1.5,
        costMax: 2.5,
        unit: "unidade",
        explanation: "Escova para polimento com contra-ângulo."
      },
      {
        id: "fio_dental",
        name: "Fio dental",
        category: "clinico_basico",
        costMin: 0.2,
        costAvg: 0.5,
        costMax: 1.0,
        unit: "porção",
        explanation: "Fio dental para limpeza interproximal."
      }
    ],
    labCostAvg: 0,
    marketPriceMin: 100,
    marketPriceAvg: 180,
    marketPriceMax: 350,
    description: "Limpeza profissional com remoção de tártaro, polimento e orientação de higiene.",
    tips: [
      "Inclua aplicação de flúor no pacote",
      "Ofereça planos de manutenção semestral",
      "Considere descontos para famílias"
    ]
  },

  {
    id: "aplicacao_fluor",
    name: "Aplicação de Flúor",
    category: "preventivo",
    durationMin: 10,
    durationAvg: 15,
    durationMax: 20,
    materials: [
      ...MATERIAIS_BASICOS.filter(m => ["luvas", "mascara", "campo_descartavel", "sugador"].includes(m.id)),
      {
        id: "fluor_gel",
        name: "Flúor gel",
        category: "clinico_basico",
        costMin: 1.0,
        costAvg: 2.0,
        costMax: 4.0,
        unit: "dose",
        explanation: "Flúor tópico para prevenção de cáries."
      },
      {
        id: "moldeira_descartavel",
        name: "Moldeira descartável",
        category: "descartavel",
        costMin: 0.5,
        costAvg: 1.0,
        costMax: 1.5,
        unit: "unidade",
        explanation: "Moldeira para aplicação do flúor."
      }
    ],
    labCostAvg: 0,
    marketPriceMin: 40,
    marketPriceAvg: 80,
    marketPriceMax: 150,
    description: "Aplicação tópica de flúor para prevenção de cáries.",
    tips: [
      "Geralmente incluído na profilaxia",
      "Importante para crianças e adolescentes",
      "Pode ser vendido em pacotes preventivos"
    ]
  },

  {
    id: "selante",
    name: "Selante (por dente)",
    category: "preventivo",
    durationMin: 15,
    durationAvg: 20,
    durationMax: 30,
    materials: [
      ...MATERIAIS_BASICOS,
      {
        id: "acido_fosforico",
        name: "Ácido fosfórico 37%",
        category: "clinico_basico",
        costMin: 0.5,
        costAvg: 1.0,
        costMax: 2.0,
        unit: "dose",
        explanation: "Condicionamento ácido para adesão do selante."
      },
      {
        id: "selante_resina",
        name: "Selante resinoso",
        category: "clinico_basico",
        costMin: 3.0,
        costAvg: 5.0,
        costMax: 8.0,
        unit: "dose",
        explanation: "Resina fluida para selamento de sulcos e fissuras."
      },
      {
        id: "pincel_aplicador",
        name: "Pincel aplicador",
        category: "descartavel",
        costMin: 0.3,
        costAvg: 0.5,
        costMax: 1.0,
        unit: "unidade",
        explanation: "Pincel descartável para aplicação."
      }
    ],
    labCostAvg: 0,
    marketPriceMin: 60,
    marketPriceAvg: 120,
    marketPriceMax: 200,
    description: "Selamento de sulcos e fissuras para prevenção de cáries.",
    tips: [
      "Indicado principalmente para crianças",
      "Cobrar por dente selado",
      "Ofereça pacotes para múltiplos dentes"
    ]
  },

  // ============================================
  // RESTAURADORES
  // ============================================

  {
    id: "restauracao_resina_simples",
    name: "Restauração em Resina Simples",
    category: "restaurador",
    durationMin: 30,
    durationAvg: 45,
    durationMax: 60,
    materials: [
      ...MATERIAIS_BASICOS,
      {
        id: "broca_diamantada",
        name: "Broca diamantada",
        category: "reutilizavel",
        costMin: 2.0,
        costAvg: 3.0,
        costMax: 5.0,
        unit: "uso",
        explanation: "Broca para remoção de cárie e preparo cavitário (custo por uso)."
      },
      {
        id: "acido_fosforico_rest",
        name: "Ácido fosfórico 37%",
        category: "clinico_basico",
        costMin: 0.5,
        costAvg: 1.0,
        costMax: 2.0,
        unit: "dose",
        explanation: "Condicionamento ácido para adesão."
      },
      {
        id: "adesivo_dentinario",
        name: "Adesivo dentinário",
        category: "clinico_basico",
        costMin: 2.0,
        costAvg: 4.0,
        costMax: 7.0,
        unit: "dose",
        explanation: "Sistema adesivo para união resina-dente."
      },
      {
        id: "resina_composta",
        name: "Resina composta",
        category: "clinico_basico",
        costMin: 8.0,
        costAvg: 15.0,
        costMax: 25.0,
        unit: "dose",
        explanation: "Resina fotopolimerizável para restauração estética."
      },
      {
        id: "matriz_metalica",
        name: "Matriz metálica",
        category: "reutilizavel",
        costMin: 0.5,
        costAvg: 1.0,
        costMax: 2.0,
        unit: "uso",
        explanation: "Matriz para reconstrução de parede proximal."
      },
      {
        id: "cunha_madeira",
        name: "Cunha de madeira",
        category: "descartavel",
        costMin: 0.2,
        costAvg: 0.4,
        costMax: 0.6,
        unit: "unidade",
        explanation: "Cunha para adaptação da matriz."
      },
      {
        id: "disco_lixa",
        name: "Disco de lixa (Sof-Lex)",
        category: "descartavel",
        costMin: 1.0,
        costAvg: 2.0,
        costMax: 3.0,
        unit: "jogo",
        explanation: "Discos para acabamento e polimento."
      },
      {
        id: "papel_carbono",
        name: "Papel carbono",
        category: "descartavel",
        costMin: 0.1,
        costAvg: 0.2,
        costMax: 0.3,
        unit: "folha",
        explanation: "Verificação de contatos oclusais."
      }
    ],
    labCostAvg: 0,
    marketPriceMin: 150,
    marketPriceAvg: 280,
    marketPriceMax: 500,
    description: "Restauração direta em resina composta de 1 face.",
    tips: [
      "Diferencie preço por número de faces",
      "Resinas premium justificam valor maior",
      "Inclua garantia no preço estratégico"
    ]
  },

  {
    id: "restauracao_resina",
    name: "Restauração em Resina",
    category: "restaurador",
    durationMin: 30,
    durationAvg: 45,
    durationMax: 60,
    materials: [
      ...MATERIAIS_BASICOS,
      {
        id: "broca_diamantada",
        name: "Broca diamantada",
        category: "reutilizavel",
        costMin: 2.0,
        costAvg: 3.0,
        costMax: 5.0,
        unit: "uso",
        explanation: "Broca para preparo cavitário."
      },
      {
        id: "acido_fosforico_rest",
        name: "Ácido fosfórico 37%",
        category: "clinico_basico",
        costMin: 0.5,
        costAvg: 1.0,
        costMax: 2.0,
        unit: "dose",
        explanation: "Condicionamento ácido."
      },
      {
        id: "adesivo_dentinario",
        name: "Adesivo dentinário",
        category: "clinico_basico",
        costMin: 2.0,
        costAvg: 4.0,
        costMax: 7.0,
        unit: "dose",
        explanation: "Sistema adesivo."
      },
      {
        id: "resina_composta",
        name: "Resina composta",
        category: "clinico_basico",
        costMin: 8.0,
        costAvg: 15.0,
        costMax: 25.0,
        unit: "dose",
        explanation: "Resina fotopolimerizável."
      },
      {
        id: "disco_lixa",
        name: "Disco de lixa",
        category: "descartavel",
        costMin: 1.0,
        costAvg: 2.0,
        costMax: 3.0,
        unit: "jogo",
        explanation: "Discos para acabamento."
      }
    ],
    labCostAvg: 0,
    marketPriceMin: 150,
    marketPriceAvg: 280,
    marketPriceMax: 500,
    description: "Restauração direta em resina composta.",
    tips: [
      "Diferencie preço por número de faces",
      "Resinas premium justificam valor maior",
      "Inclua garantia no preço"
    ]
  },

  {
    id: "restauracao_resina_composta",
    name: "Restauração em Resina Composta Extensa",
    category: "restaurador",
    durationMin: 45,
    durationAvg: 60,
    durationMax: 90,
    materials: [
      ...MATERIAIS_BASICOS,
      {
        id: "broca_diamantada_mult",
        name: "Brocas diamantadas (múltiplas)",
        category: "reutilizavel",
        costMin: 4.0,
        costAvg: 6.0,
        costMax: 10.0,
        unit: "uso",
        explanation: "Múltiplas brocas para preparo complexo."
      },
      {
        id: "acido_fosforico_rest",
        name: "Ácido fosfórico 37%",
        category: "clinico_basico",
        costMin: 1.0,
        costAvg: 2.0,
        costMax: 3.0,
        unit: "dose",
        explanation: "Condicionamento ácido."
      },
      {
        id: "adesivo_dentinario_premium",
        name: "Adesivo dentinário premium",
        category: "clinico_basico",
        costMin: 4.0,
        costAvg: 7.0,
        costMax: 12.0,
        unit: "dose",
        explanation: "Sistema adesivo de alta performance."
      },
      {
        id: "resina_composta_mult",
        name: "Resina composta (múltiplas cores)",
        category: "clinico_basico",
        costMin: 15.0,
        costAvg: 30.0,
        costMax: 50.0,
        unit: "dose",
        explanation: "Resinas de múltiplas cores para estratificação."
      },
      {
        id: "matriz_metalica",
        name: "Matriz metálica",
        category: "reutilizavel",
        costMin: 1.0,
        costAvg: 2.0,
        costMax: 3.0,
        unit: "uso",
        explanation: "Matriz para reconstrução."
      },
      {
        id: "cunha_madeira",
        name: "Cunhas de madeira",
        category: "descartavel",
        costMin: 0.4,
        costAvg: 0.8,
        costMax: 1.2,
        unit: "múltiplas",
        explanation: "Cunhas para adaptação."
      },
      {
        id: "disco_lixa_mult",
        name: "Discos de lixa (múltiplos)",
        category: "descartavel",
        costMin: 2.0,
        costAvg: 4.0,
        costMax: 6.0,
        unit: "jogos",
        explanation: "Múltiplos discos para acabamento refinado."
      },
      {
        id: "ponta_diamantada_polimento",
        name: "Pontas diamantadas para polimento",
        category: "reutilizavel",
        costMin: 2.0,
        costAvg: 4.0,
        costMax: 6.0,
        unit: "uso",
        explanation: "Pontas para polimento final."
      }
    ],
    labCostAvg: 0,
    marketPriceMin: 250,
    marketPriceAvg: 450,
    marketPriceMax: 800,
    description: "Restauração extensa em resina composta de 3+ faces ou reconstrução de cúspide.",
    tips: [
      "Justifique o valor pela complexidade",
      "Mostre fotos do antes/depois",
      "Inclua garantia estendida"
    ]
  },

  {
    id: "restauracao_provisoria",
    name: "Restauração Provisória",
    category: "restaurador",
    durationMin: 15,
    durationAvg: 20,
    durationMax: 30,
    materials: [
      ...MATERIAIS_BASICOS.filter(m => ["anestesico", "agulha_anestesia", "luvas", "mascara"].includes(m.id)),
      {
        id: "cimento_provisorio",
        name: "Cimento provisório",
        category: "clinico_basico",
        costMin: 1.0,
        costAvg: 2.0,
        costMax: 4.0,
        unit: "dose",
        explanation: "Material temporário para vedação."
      },
      {
        id: "broca_simples",
        name: "Broca simples",
        category: "reutilizavel",
        costMin: 0.5,
        costAvg: 1.0,
        costMax: 2.0,
        unit: "uso",
        explanation: "Broca para limpeza básica."
      }
    ],
    labCostAvg: 0,
    marketPriceMin: 50,
    marketPriceAvg: 100,
    marketPriceMax: 180,
    description: "Restauração temporária para alívio de sintomas ou proteção.",
    tips: [
      "Explique que é temporária",
      "Agende retorno para definitiva",
      "Pode ser cortesia em alguns casos"
    ]
  },

  {
    id: "incrustacao",
    name: "Incrustação (Inlay/Onlay)",
    category: "restaurador",
    durationMin: 60,
    durationAvg: 90,
    durationMax: 120,
    materials: [
      ...MATERIAIS_BASICOS,
      {
        id: "broca_diamantada_prep",
        name: "Brocas diamantadas para preparo",
        category: "reutilizavel",
        costMin: 5.0,
        costAvg: 8.0,
        costMax: 12.0,
        unit: "uso",
        explanation: "Brocas específicas para preparo de incrustação."
      },
      {
        id: "moldagem_silicone",
        name: "Silicone de moldagem",
        category: "clinico_basico",
        costMin: 15.0,
        costAvg: 25.0,
        costMax: 40.0,
        unit: "moldagem",
        explanation: "Silicone de adição para moldagem de precisão."
      },
      {
        id: "moldeira",
        name: "Moldeira",
        category: "reutilizavel",
        costMin: 2.0,
        costAvg: 3.0,
        costMax: 5.0,
        unit: "uso",
        explanation: "Moldeira para moldagem."
      },
      {
        id: "cimento_provisorio_inc",
        name: "Cimento provisório",
        category: "clinico_basico",
        costMin: 2.0,
        costAvg: 4.0,
        costMax: 6.0,
        unit: "dose",
        explanation: "Cimentação temporária."
      },
      {
        id: "cimento_definitivo",
        name: "Cimento resinoso",
        category: "alto_custo",
        costMin: 20.0,
        costAvg: 35.0,
        costMax: 60.0,
        unit: "dose",
        explanation: "Cimento resinoso para cimentação definitiva."
      }
    ],
    labCostAvg: 250,
    marketPriceMin: 600,
    marketPriceAvg: 1000,
    marketPriceMax: 1800,
    description: "Restauração indireta em porcelana ou resina composta laboratorial.",
    tips: [
      "Custo laboratorial é significativo",
      "Diferencie inlay de onlay no preço",
      "Destaque durabilidade e estética"
    ]
  },

  // ============================================
  // ENDODONTIA
  // ============================================

  {
    id: "canal_unirradicular",
    name: "Tratamento de Canal Unirradicular",
    category: "endodontia",
    durationMin: 60,
    durationAvg: 90,
    durationMax: 120,
    materials: [
      ...MATERIAIS_BASICOS,
      {
        id: "lencol_borracha",
        name: "Lençol de borracha",
        category: "descartavel",
        costMin: 1.0,
        costAvg: 2.0,
        costMax: 3.0,
        unit: "unidade",
        explanation: "Isolamento absoluto para endodontia."
      },
      {
        id: "grampo",
        name: "Grampo para isolamento",
        category: "reutilizavel",
        costMin: 1.0,
        costAvg: 2.0,
        costMax: 3.0,
        unit: "uso",
        explanation: "Grampo para fixação do lençol."
      },
      {
        id: "broca_acesso",
        name: "Broca para acesso endodôntico",
        category: "reutilizavel",
        costMin: 3.0,
        costAvg: 5.0,
        costMax: 8.0,
        unit: "uso",
        explanation: "Broca específica para abertura coronária."
      },
      {
        id: "limas_endodonticas",
        name: "Limas endodônticas",
        category: "descartavel",
        costMin: 15.0,
        costAvg: 25.0,
        costMax: 40.0,
        unit: "jogo",
        explanation: "Limas manuais ou rotatórias para instrumentação."
      },
      {
        id: "hipoclorito_sodio",
        name: "Hipoclorito de sódio",
        category: "clinico_basico",
        costMin: 1.0,
        costAvg: 2.0,
        costMax: 3.0,
        unit: "dose",
        explanation: "Solução irrigadora para limpeza dos canais."
      },
      {
        id: "edta",
        name: "EDTA",
        category: "clinico_basico",
        costMin: 1.0,
        costAvg: 2.0,
        costMax: 3.0,
        unit: "dose",
        explanation: "Quelante para remoção de smear layer."
      },
      {
        id: "cone_guta_percha",
        name: "Cones de guta-percha",
        category: "clinico_basico",
        costMin: 2.0,
        costAvg: 4.0,
        costMax: 6.0,
        unit: "conjunto",
        explanation: "Material obturador dos canais."
      },
      {
        id: "cimento_endodontico",
        name: "Cimento endodôntico",
        category: "clinico_basico",
        costMin: 3.0,
        costAvg: 5.0,
        costMax: 8.0,
        unit: "dose",
        explanation: "Cimento para selamento dos canais."
      },
      {
        id: "restauracao_provisoria_endo",
        name: "Material restaurador provisório",
        category: "clinico_basico",
        costMin: 2.0,
        costAvg: 4.0,
        costMax: 6.0,
        unit: "dose",
        explanation: "Selamento provisório após tratamento."
      }
    ],
    labCostAvg: 0,
    marketPriceMin: 400,
    marketPriceAvg: 700,
    marketPriceMax: 1200,
    description: "Tratamento endodôntico de dente com 1 canal radicular.",
    tips: [
      "Pode ser feito em 1 ou múltiplas sessões",
      "Inclua radiografias no orçamento",
      "Diferencie dentes anteriores de pré-molares"
    ]
  },

  {
    id: "canal_birradicular",
    name: "Tratamento de Canal Birradicular",
    category: "endodontia",
    durationMin: 90,
    durationAvg: 120,
    durationMax: 150,
    materials: [
      ...MATERIAIS_BASICOS,
      {
        id: "lencol_borracha",
        name: "Lençol de borracha",
        category: "descartavel",
        costMin: 1.0,
        costAvg: 2.0,
        costMax: 3.0,
        unit: "unidade",
        explanation: "Isolamento absoluto."
      },
      {
        id: "grampo",
        name: "Grampo para isolamento",
        category: "reutilizavel",
        costMin: 1.0,
        costAvg: 2.0,
        costMax: 3.0,
        unit: "uso",
        explanation: "Grampo para fixação."
      },
      {
        id: "broca_acesso",
        name: "Broca para acesso endodôntico",
        category: "reutilizavel",
        costMin: 3.0,
        costAvg: 5.0,
        costMax: 8.0,
        unit: "uso",
        explanation: "Broca para abertura."
      },
      {
        id: "limas_endodonticas_mult",
        name: "Limas endodônticas (2 canais)",
        category: "descartavel",
        costMin: 25.0,
        costAvg: 40.0,
        costMax: 60.0,
        unit: "jogos",
        explanation: "Limas para instrumentação de 2 canais."
      },
      {
        id: "hipoclorito_sodio",
        name: "Hipoclorito de sódio",
        category: "clinico_basico",
        costMin: 2.0,
        costAvg: 3.0,
        costMax: 5.0,
        unit: "dose",
        explanation: "Solução irrigadora."
      },
      {
        id: "edta",
        name: "EDTA",
        category: "clinico_basico",
        costMin: 2.0,
        costAvg: 3.0,
        costMax: 5.0,
        unit: "dose",
        explanation: "Quelante."
      },
      {
        id: "cone_guta_percha_mult",
        name: "Cones de guta-percha (2 canais)",
        category: "clinico_basico",
        costMin: 4.0,
        costAvg: 7.0,
        costMax: 10.0,
        unit: "conjuntos",
        explanation: "Material obturador."
      },
      {
        id: "cimento_endodontico",
        name: "Cimento endodôntico",
        category: "clinico_basico",
        costMin: 4.0,
        costAvg: 7.0,
        costMax: 10.0,
        unit: "dose",
        explanation: "Cimento para selamento."
      },
      {
        id: "restauracao_provisoria_endo",
        name: "Material restaurador provisório",
        category: "clinico_basico",
        costMin: 2.0,
        costAvg: 4.0,
        costMax: 6.0,
        unit: "dose",
        explanation: "Selamento provisório."
      }
    ],
    labCostAvg: 0,
    marketPriceMin: 600,
    marketPriceAvg: 1000,
    marketPriceMax: 1600,
    description: "Tratamento endodôntico de dente com 2 canais radiculares (pré-molares inferiores).",
    tips: [
      "Mais complexo que unirradicular",
      "Pode necessitar múltiplas sessões",
      "Considere uso de localizador apical"
    ]
  },

  {
    id: "canal_multirradicular",
    name: "Tratamento de Canal Multirradicular",
    category: "endodontia",
    durationMin: 120,
    durationAvg: 150,
    durationMax: 180,
    materials: [
      ...MATERIAIS_BASICOS,
      {
        id: "lencol_borracha",
        name: "Lençol de borracha",
        category: "descartavel",
        costMin: 1.0,
        costAvg: 2.0,
        costMax: 3.0,
        unit: "unidade",
        explanation: "Isolamento absoluto."
      },
      {
        id: "grampo",
        name: "Grampo para isolamento",
        category: "reutilizavel",
        costMin: 1.0,
        costAvg: 2.0,
        costMax: 3.0,
        unit: "uso",
        explanation: "Grampo para fixação."
      },
      {
        id: "broca_acesso",
        name: "Broca para acesso endodôntico",
        category: "reutilizavel",
        costMin: 4.0,
        costAvg: 6.0,
        costMax: 10.0,
        unit: "uso",
        explanation: "Broca para abertura complexa."
      },
      {
        id: "limas_endodonticas_mult_3",
        name: "Limas endodônticas (3-4 canais)",
        category: "descartavel",
        costMin: 35.0,
        costAvg: 60.0,
        costMax: 90.0,
        unit: "jogos",
        explanation: "Limas para instrumentação de múltiplos canais."
      },
      {
        id: "hipoclorito_sodio",
        name: "Hipoclorito de sódio",
        category: "clinico_basico",
        costMin: 3.0,
        costAvg: 5.0,
        costMax: 7.0,
        unit: "dose",
        explanation: "Solução irrigadora."
      },
      {
        id: "edta",
        name: "EDTA",
        category: "clinico_basico",
        costMin: 3.0,
        costAvg: 5.0,
        costMax: 7.0,
        unit: "dose",
        explanation: "Quelante."
      },
      {
        id: "cone_guta_percha_mult_3",
        name: "Cones de guta-percha (3-4 canais)",
        category: "clinico_basico",
        costMin: 6.0,
        costAvg: 10.0,
        costMax: 15.0,
        unit: "conjuntos",
        explanation: "Material obturador."
      },
      {
        id: "cimento_endodontico",
        name: "Cimento endodôntico",
        category: "clinico_basico",
        costMin: 5.0,
        costAvg: 8.0,
        costMax: 12.0,
        unit: "dose",
        explanation: "Cimento para selamento."
      },
      {
        id: "restauracao_provisoria_endo",
        name: "Material restaurador provisório",
        category: "clinico_basico",
        costMin: 3.0,
        costAvg: 5.0,
        costMax: 8.0,
        unit: "dose",
        explanation: "Selamento provisório."
      }
    ],
    labCostAvg: 0,
    marketPriceMin: 800,
    marketPriceAvg: 1400,
    marketPriceMax: 2200,
    description: "Tratamento endodôntico de dente com 3 ou 4 canais radiculares (molares).",
    tips: [
      "Procedimento mais complexo e demorado",
      "Geralmente requer múltiplas sessões",
      "Considere uso de microscópio operatório"
    ]
  },

  {
    id: "retratamento_endodontico",
    name: "Retratamento Endodôntico",
    category: "endodontia",
    durationMin: 120,
    durationAvg: 180,
    durationMax: 240,
    materials: [
      ...MATERIAIS_BASICOS,
      {
        id: "lencol_borracha",
        name: "Lençol de borracha",
        category: "descartavel",
        costMin: 1.0,
        costAvg: 2.0,
        costMax: 3.0,
        unit: "unidade",
        explanation: "Isolamento absoluto."
      },
      {
        id: "grampo",
        name: "Grampo para isolamento",
        category: "reutilizavel",
        costMin: 1.0,
        costAvg: 2.0,
        costMax: 3.0,
        unit: "uso",
        explanation: "Grampo para fixação."
      },
      {
        id: "broca_acesso_retrat",
        name: "Brocas para acesso e remoção",
        category: "reutilizavel",
        costMin: 5.0,
        costAvg: 8.0,
        costMax: 12.0,
        unit: "uso",
        explanation: "Brocas para remoção de material obturador."
      },
      {
        id: "solvente",
        name: "Solvente (eucaliptol/xilol)",
        category: "clinico_basico",
        costMin: 2.0,
        costAvg: 4.0,
        costMax: 6.0,
        unit: "dose",
        explanation: "Solvente para amolecer guta-percha."
      },
      {
        id: "limas_endodonticas_retrat",
        name: "Limas endodônticas (retratamento)",
        category: "descartavel",
        costMin: 40.0,
        costAvg: 70.0,
        costMax: 100.0,
        unit: "jogos",
        explanation: "Limas específicas para retratamento."
      },
      {
        id: "hipoclorito_sodio",
        name: "Hipoclorito de sódio",
        category: "clinico_basico",
        costMin: 3.0,
        costAvg: 5.0,
        costMax: 7.0,
        unit: "dose",
        explanation: "Solução irrigadora."
      },
      {
        id: "edta",
        name: "EDTA",
        category: "clinico_basico",
        costMin: 3.0,
        costAvg: 5.0,
        costMax: 7.0,
        unit: "dose",
        explanation: "Quelante."
      },
      {
        id: "cone_guta_percha_retrat",
        name: "Cones de guta-percha",
        category: "clinico_basico",
        costMin: 5.0,
        costAvg: 8.0,
        costMax: 12.0,
        unit: "conjuntos",
        explanation: "Material obturador."
      },
      {
        id: "cimento_endodontico",
        name: "Cimento endodôntico",
        category: "clinico_basico",
        costMin: 5.0,
        costAvg: 8.0,
        costMax: 12.0,
        unit: "dose",
        explanation: "Cimento para selamento."
      },
      {
        id: "restauracao_provisoria_endo",
        name: "Material restaurador provisório",
        category: "clinico_basico",
        costMin: 3.0,
        costAvg: 5.0,
        costMax: 8.0,
        unit: "dose",
        explanation: "Selamento provisório."
      }
    ],
    labCostAvg: 0,
    marketPriceMin: 1000,
    marketPriceAvg: 1800,
    marketPriceMax: 3000,
    description: "Retratamento de canal previamente tratado com insucesso.",
    tips: [
      "Mais complexo que tratamento inicial",
      "Pode necessitar microscópio operatório",
      "Explique ao paciente a complexidade"
    ]
  },

  // ============================================
  // CIRURGIA / PERIODONTIA / ESTÉTICA
  // ============================================

  {
    id: "exodontia_simples",
    name: "Exodontia Simples",
    category: "cirurgia",
    durationMin: 20,
    durationAvg: 30,
    durationMax: 45,
    materials: [
      ...MATERIAIS_BASICOS,
      {
        id: "forceps",
        name: "Fórceps",
        category: "reutilizavel",
        costMin: 1.0,
        costAvg: 2.0,
        costMax: 3.0,
        unit: "uso",
        explanation: "Instrumento para extração (custo de esterilização)."
      },
      {
        id: "alavanca",
        name: "Alavanca",
        category: "reutilizavel",
        costMin: 1.0,
        costAvg: 2.0,
        costMax: 3.0,
        unit: "uso",
        explanation: "Instrumento para luxação."
      },
      {
        id: "gaze_esteril",
        name: "Gaze estéril",
        category: "descartavel",
        costMin: 0.5,
        costAvg: 1.0,
        costMax: 1.5,
        unit: "pacote",
        explanation: "Gazes para hemostasia."
      },
      {
        id: "sutura",
        name: "Fio de sutura",
        category: "descartavel",
        costMin: 3.0,
        costAvg: 5.0,
        costMax: 8.0,
        unit: "unidade",
        explanation: "Fio para sutura se necessário."
      }
    ],
    labCostAvg: 0,
    marketPriceMin: 80,
    marketPriceAvg: 150,
    marketPriceMax: 300,
    description: "Extração dentária simples sem necessidade de retalho ou osteotomia.",
    tips: [
      "Diferencie de extração complexa",
      "Inclua orientações pós-operatórias",
      "Considere retorno para avaliação"
    ]
  },

  {
    id: "exodontia_raiz_residual",
    name: "Exodontia de Raiz Residual",
    category: "cirurgia",
    durationMin: 30,
    durationAvg: 45,
    durationMax: 60,
    materials: [
      ...MATERIAIS_BASICOS,
      {
        id: "lamina_bisturi",
        name: "Lâmina de bisturi",
        category: "descartavel",
        costMin: 1.0,
        costAvg: 2.0,
        costMax: 3.0,
        unit: "unidade",
        explanation: "Lâmina estéril para incisão."
      },
      {
        id: "forceps",
        name: "Fórceps",
        category: "reutilizavel",
        costMin: 1.0,
        costAvg: 2.0,
        costMax: 3.0,
        unit: "uso",
        explanation: "Instrumento para extração."
      },
      {
        id: "alavanca",
        name: "Alavanca",
        category: "reutilizavel",
        costMin: 1.0,
        costAvg: 2.0,
        costMax: 3.0,
        unit: "uso",
        explanation: "Instrumento para luxação."
      },
      {
        id: "gaze_esteril",
        name: "Gaze estéril",
        category: "descartavel",
        costMin: 1.0,
        costAvg: 2.0,
        costMax: 3.0,
        unit: "pacote",
        explanation: "Gazes para hemostasia."
      },
      {
        id: "sutura",
        name: "Fio de sutura",
        category: "descartavel",
        costMin: 3.0,
        costAvg: 5.0,
        costMax: 8.0,
        unit: "unidade",
        explanation: "Fio para sutura."
      }
    ],
    labCostAvg: 0,
    marketPriceMin: 120,
    marketPriceAvg: 200,
    marketPriceMax: 350,
    description: "Extração de raiz residual (resto radicular).",
    tips: [
      "Mais complexo que extração simples",
      "Pode necessitar pequeno retalho",
      "Inclua orientações pós-operatórias"
    ]
  },

  {
    id: "exodontia_terceiros_molares",
    name: "Exodontia de 3ºs Molares e Inclusos",
    category: "cirurgia",
    durationMin: 60,
    durationAvg: 90,
    durationMax: 120,
    materials: [
      ...MATERIAIS_BASICOS,
      {
        id: "lamina_bisturi",
        name: "Lâmina de bisturi",
        category: "descartavel",
        costMin: 1.0,
        costAvg: 2.0,
        costMax: 3.0,
        unit: "unidade",
        explanation: "Lâmina estéril."
      },
      {
        id: "cabo_bisturi",
        name: "Cabo de bisturi",
        category: "reutilizavel",
        costMin: 1.0,
        costAvg: 2.0,
        costMax: 3.0,
        unit: "uso",
        explanation: "Cabo para lâmina."
      },
      {
        id: "descolador",
        name: "Descolador",
        category: "reutilizavel",
        costMin: 1.0,
        costAvg: 2.0,
        costMax: 3.0,
        unit: "uso",
        explanation: "Descolamento de retalho."
      },
      {
        id: "broca_cirurgica_mult",
        name: "Brocas cirúrgicas (múltiplas)",
        category: "reutilizavel",
        costMin: 5.0,
        costAvg: 10.0,
        costMax: 15.0,
        unit: "uso",
        explanation: "Brocas para osteotomia e odontosecção."
      },
      {
        id: "forceps",
        name: "Fórceps",
        category: "reutilizavel",
        costMin: 1.0,
        costAvg: 2.0,
        costMax: 3.0,
        unit: "uso",
        explanation: "Instrumento para extração."
      },
      {
        id: "alavanca_mult",
        name: "Alavancas (múltiplas)",
        category: "reutilizavel",
        costMin: 2.0,
        costAvg: 4.0,
        costMax: 6.0,
        unit: "uso",
        explanation: "Instrumentos para luxação."
      },
      {
        id: "cureta",
        name: "Cureta",
        category: "reutilizavel",
        costMin: 1.0,
        costAvg: 2.0,
        costMax: 3.0,
        unit: "uso",
        explanation: "Curetagem."
      },
      {
        id: "lima_osso",
        name: "Lima para osso",
        category: "reutilizavel",
        costMin: 1.0,
        costAvg: 2.0,
        costMax: 3.0,
        unit: "uso",
        explanation: "Regularização óssea."
      },
      {
        id: "gaze_esteril",
        name: "Gaze estéril",
        category: "descartavel",
        costMin: 2.0,
        costAvg: 3.0,
        costMax: 5.0,
        unit: "pacote",
        explanation: "Gazes para hemostasia."
      },
      {
        id: "sutura_mult",
        name: "Fio de sutura",
        category: "descartavel",
        costMin: 5.0,
        costAvg: 8.0,
        costMax: 12.0,
        unit: "unidade",
        explanation: "Fio para sutura."
      },
      {
        id: "soro_fisiologico",
        name: "Soro fisiológico",
        category: "clinico_basico",
        costMin: 2.0,
        costAvg: 3.0,
        costMax: 5.0,
        unit: "dose",
        explanation: "Irrigação abundante."
      }
    ],
    labCostAvg: 0,
    marketPriceMin: 400,
    marketPriceAvg: 800,
    marketPriceMax: 1500,
    description: "Extração cirúrgica de terceiro molar incluso ou semi-incluso.",
    tips: [
      "Avaliar complexidade pela radiografia",
      "Considere sedação consciente",
      "Inclua medicação pós-operatória no orçamento"
    ]
  },

  {
    id: "aumento_coroa",
    name: "Aumento de Coroa",
    category: "cirurgia",
    durationMin: 45,
    durationAvg: 60,
    durationMax: 90,
    materials: [
      ...MATERIAIS_BASICOS,
      {
        id: "lamina_bisturi",
        name: "Lâmina de bisturi",
        category: "descartavel",
        costMin: 1.0,
        costAvg: 2.0,
        costMax: 3.0,
        unit: "unidade",
        explanation: "Lâmina estéril."
      },
      {
        id: "cabo_bisturi",
        name: "Cabo de bisturi",
        category: "reutilizavel",
        costMin: 1.0,
        costAvg: 2.0,
        costMax: 3.0,
        unit: "uso",
        explanation: "Cabo para lâmina."
      },
      {
        id: "descolador",
        name: "Descolador",
        category: "reutilizavel",
        costMin: 1.0,
        costAvg: 2.0,
        costMax: 3.0,
        unit: "uso",
        explanation: "Descolamento."
      },
      {
        id: "broca_cirurgica",
        name: "Broca cirúrgica",
        category: "reutilizavel",
        costMin: 3.0,
        costAvg: 5.0,
        costMax: 8.0,
        unit: "uso",
        explanation: "Broca para osteotomia."
      },
      {
        id: "gaze_esteril",
        name: "Gaze estéril",
        category: "descartavel",
        costMin: 1.0,
        costAvg: 2.0,
        costMax: 3.0,
        unit: "pacote",
        explanation: "Gazes."
      },
      {
        id: "sutura_mult",
        name: "Fio de sutura",
        category: "descartavel",
        costMin: 5.0,
        costAvg: 8.0,
        costMax: 12.0,
        unit: "unidade",
        explanation: "Fio para sutura."
      },
      {
        id: "cimento_cirurgico",
        name: "Cimento cirúrgico periodontal",
        category: "clinico_basico",
        costMin: 5.0,
        costAvg: 10.0,
        costMax: 15.0,
        unit: "dose",
        explanation: "Proteção pós-operatória."
      }
    ],
    labCostAvg: 0,
    marketPriceMin: 500,
    marketPriceAvg: 1000,
    marketPriceMax: 2000,
    description: "Cirurgia para aumento de coroa clínica (exposição de estrutura dental).",
    tips: [
      "Indicado antes de próteses",
      "Melhora estética do sorriso",
      "Diferencie por número de dentes"
    ]
  },

  {
    id: "bichectomia",
    name: "Bichectomia",
    category: "cirurgia",
    durationMin: 45,
    durationAvg: 60,
    durationMax: 90,
    materials: [
      ...MATERIAIS_BASICOS,
      {
        id: "lamina_bisturi",
        name: "Lâmina de bisturi",
        category: "descartavel",
        costMin: 1.0,
        costAvg: 2.0,
        costMax: 3.0,
        unit: "unidade",
        explanation: "Lâmina estéril."
      },
      {
        id: "cabo_bisturi",
        name: "Cabo de bisturi",
        category: "reutilizavel",
        costMin: 1.0,
        costAvg: 2.0,
        costMax: 3.0,
        unit: "uso",
        explanation: "Cabo para lâmina."
      },
      {
        id: "pinca_cirurgica",
        name: "Pinça cirúrgica",
        category: "reutilizavel",
        costMin: 1.0,
        costAvg: 2.0,
        costMax: 3.0,
        unit: "uso",
        explanation: "Pinça para manipulação."
      },
      {
        id: "gaze_esteril",
        name: "Gaze estéril",
        category: "descartavel",
        costMin: 2.0,
        costAvg: 3.0,
        costMax: 5.0,
        unit: "pacote",
        explanation: "Gazes."
      },
      {
        id: "sutura_mult",
        name: "Fio de sutura",
        category: "descartavel",
        costMin: 5.0,
        costAvg: 8.0,
        costMax: 12.0,
        unit: "unidade",
        explanation: "Fio para sutura."
      }
    ],
    labCostAvg: 0,
    marketPriceMin: 1500,
    marketPriceAvg: 3000,
    marketPriceMax: 5000,
    description: "Remoção cirúrgica da bola de Bichat para afinamento facial.",
    tips: [
      "Procedimento estético facial",
      "Resultado aparece após 3-6 meses",
      "Destaque benefícios estéticos"
    ]
  },

  {
    id: "frenectomia",
    name: "Frenectomia",
    category: "cirurgia",
    durationMin: 20,
    durationAvg: 30,
    durationMax: 45,
    materials: [
      ...MATERIAIS_BASICOS,
      {
        id: "lamina_bisturi",
        name: "Lâmina de bisturi",
        category: "descartavel",
        costMin: 1.0,
        costAvg: 2.0,
        costMax: 3.0,
        unit: "unidade",
        explanation: "Lâmina estéril."
      },
      {
        id: "cabo_bisturi",
        name: "Cabo de bisturi",
        category: "reutilizavel",
        costMin: 1.0,
        costAvg: 2.0,
        costMax: 3.0,
        unit: "uso",
        explanation: "Cabo para lâmina."
      },
      {
        id: "gaze_esteril",
        name: "Gaze estéril",
        category: "descartavel",
        costMin: 1.0,
        costAvg: 2.0,
        costMax: 3.0,
        unit: "pacote",
        explanation: "Gazes."
      },
      {
        id: "sutura",
        name: "Fio de sutura",
        category: "descartavel",
        costMin: 3.0,
        costAvg: 5.0,
        costMax: 8.0,
        unit: "unidade",
        explanation: "Fio para sutura."
      }
    ],
    labCostAvg: 0,
    marketPriceMin: 300,
    marketPriceAvg: 600,
    marketPriceMax: 1000,
    description: "Remoção cirúrgica de freio labial ou lingual.",
    tips: [
      "Indicado para diastemas",
      "Melhora fonação (freio lingual)",
      "Procedimento rápido"
    ]
  },

  {
    id: "gengivoplastia_meia_boca",
    name: "Gengivoplastia / Gengivectomia (½ boca)",
    category: "cirurgia",
    durationMin: 45,
    durationAvg: 60,
    durationMax: 90,
    materials: [
      ...MATERIAIS_BASICOS,
      {
        id: "lamina_bisturi",
        name: "Lâmina de bisturi",
        category: "descartavel",
        costMin: 1.0,
        costAvg: 2.0,
        costMax: 3.0,
        unit: "unidade",
        explanation: "Lâmina estéril."
      },
      {
        id: "cabo_bisturi",
        name: "Cabo de bisturi",
        category: "reutilizavel",
        costMin: 1.0,
        costAvg: 2.0,
        costMax: 3.0,
        unit: "uso",
        explanation: "Cabo para lâmina."
      },
      {
        id: "eletrocauterio",
        name: "Ponta de eletrocautério",
        category: "descartavel",
        costMin: 5.0,
        costAvg: 10.0,
        costMax: 15.0,
        unit: "unidade",
        explanation: "Ponta descartável para eletrocirurgia."
      },
      {
        id: "gaze_esteril",
        name: "Gaze estéril",
        category: "descartavel",
        costMin: 1.0,
        costAvg: 2.0,
        costMax: 3.0,
        unit: "pacote",
        explanation: "Gazes."
      },
      {
        id: "cimento_cirurgico",
        name: "Cimento cirúrgico periodontal",
        category: "clinico_basico",
        costMin: 5.0,
        costAvg: 10.0,
        costMax: 15.0,
        unit: "dose",
        explanation: "Proteção pós-operatória."
      }
    ],
    labCostAvg: 0,
    marketPriceMin: 600,
    marketPriceAvg: 1200,
    marketPriceMax: 2000,
    description: "Cirurgia plástica gengival para correção estética (meia arcada).",
    tips: [
      "Pode ser feita com bisturi ou laser",
      "Laser reduz sangramento",
      "Melhora estética do sorriso"
    ]
  },

  {
    id: "lipo_papada_cirurgica",
    name: "Lipo de Papada Cirúrgica",
    category: "cirurgia",
    durationMin: 60,
    durationAvg: 90,
    durationMax: 120,
    materials: [
      ...MATERIAIS_BASICOS,
      {
        id: "lamina_bisturi",
        name: "Lâmina de bisturi",
        category: "descartavel",
        costMin: 1.0,
        costAvg: 2.0,
        costMax: 3.0,
        unit: "unidade",
        explanation: "Lâmina estéril."
      },
      {
        id: "canula_lipoaspiracao",
        name: "Cânula de lipoaspiração",
        category: "descartavel",
        costMin: 50.0,
        costAvg: 100.0,
        costMax: 150.0,
        unit: "unidade",
        explanation: "Cânula específica para lipoaspiração."
      },
      {
        id: "gaze_esteril",
        name: "Gaze estéril",
        category: "descartavel",
        costMin: 2.0,
        costAvg: 3.0,
        costMax: 5.0,
        unit: "pacote",
        explanation: "Gazes."
      },
      {
        id: "sutura",
        name: "Fio de sutura",
        category: "descartavel",
        costMin: 5.0,
        costAvg: 8.0,
        costMax: 12.0,
        unit: "unidade",
        explanation: "Fio para sutura."
      },
      {
        id: "curativo_compressivo",
        name: "Curativo compressivo",
        category: "descartavel",
        costMin: 10.0,
        costAvg: 20.0,
        costMax: 30.0,
        unit: "unidade",
        explanation: "Curativo pós-operatório."
      }
    ],
    labCostAvg: 0,
    marketPriceMin: 2000,
    marketPriceAvg: 4000,
    marketPriceMax: 7000,
    description: "Lipoaspiração cirúrgica da região submentoniana (papada).",
    tips: [
      "Procedimento estético facial",
      "Requer avaliação médica",
      "Resultado aparece após 2-3 meses"
    ]
  },

  {
    id: "hidroxiapatita_calcio",
    name: "Hidroxiapatita de Cálcio",
    category: "cirurgia",
    durationMin: 30,
    durationAvg: 45,
    durationMax: 60,
    materials: [
      ...MATERIAIS_BASICOS,
      {
        id: "hidroxiapatita",
        name: "Hidroxiapatita de cálcio",
        category: "alto_custo",
        costMin: 200.0,
        costAvg: 400.0,
        costMax: 600.0,
        unit: "frasco",
        explanation: "Biomaterial para preenchimento ósseo."
      },
      {
        id: "seringa_aplicacao",
        name: "Seringa de aplicação",
        category: "descartavel",
        costMin: 5.0,
        costAvg: 10.0,
        costMax: 15.0,
        unit: "unidade",
        explanation: "Seringa para aplicação do biomaterial."
      }
    ],
    labCostAvg: 0,
    marketPriceMin: 500,
    marketPriceAvg: 1000,
    marketPriceMax: 1800,
    description: "Aplicação de hidroxiapatita de cálcio para preenchimento ósseo.",
    tips: [
      "Usado em enxertos ósseos",
      "Material biocompatível",
      "Custo do material é significativo"
    ]
  },

  // ============================================
  // CLAREAMENTOS
  // ============================================

  {
    id: "clareamento_laser",
    name: "Clareamento a Laser",
    category: "estetica",
    durationMin: 60,
    durationAvg: 90,
    durationMax: 120,
    materials: [
      ...MATERIAIS_BASICOS.filter(m => ["luvas", "mascara", "campo_descartavel", "sugador"].includes(m.id)),
      {
        id: "gel_clareador",
        name: "Gel clareador (peróxido de hidrogênio 35%)",
        category: "clinico_basico",
        costMin: 30.0,
        costAvg: 60.0,
        costMax: 100.0,
        unit: "seringa",
        explanation: "Gel clareador de alta concentração."
      },
      {
        id: "barreira_gengival",
        name: "Barreira gengival fotopolimerizável",
        category: "clinico_basico",
        costMin: 10.0,
        costAvg: 20.0,
        costMax: 30.0,
        unit: "dose",
        explanation: "Proteção gengival durante clareamento."
      },
      {
        id: "afastador_labial",
        name: "Afastador labial",
        category: "descartavel",
        costMin: 2.0,
        costAvg: 4.0,
        costMax: 6.0,
        unit: "unidade",
        explanation: "Afastador para exposição dos dentes."
      },
      {
        id: "oculos_protecao",
        name: "Óculos de proteção para paciente",
        category: "reutilizavel",
        costMin: 1.0,
        costAvg: 2.0,
        costMax: 3.0,
        unit: "uso",
        explanation: "Proteção ocular."
      }
    ],
    labCostAvg: 0,
    marketPriceMin: 600,
    marketPriceAvg: 1200,
    marketPriceMax: 2500,
    description: "Clareamento dental em consultório com ativação por laser ou LED.",
    tips: [
      "Resultado imediato",
      "Mais rápido que clareamento caseiro",
      "Pode ser feito em 1 ou múltiplas sessões"
    ]
  },

  {
    id: "clareamento_interno",
    name: "Clareamento Interno",
    category: "estetica",
    durationMin: 30,
    durationAvg: 45,
    durationMax: 60,
    materials: [
      ...MATERIAIS_BASICOS.filter(m => ["luvas", "mascara", "campo_descartavel"].includes(m.id)),
      {
        id: "gel_clareador_interno",
        name: "Gel clareador para uso interno",
        category: "clinico_basico",
        costMin: 15.0,
        costAvg: 30.0,
        costMax: 50.0,
        unit: "dose",
        explanation: "Gel específico para clareamento interno."
      },
      {
        id: "cimento_provisorio",
        name: "Cimento provisório",
        category: "clinico_basico",
        costMin: 2.0,
        costAvg: 4.0,
        costMax: 6.0,
        unit: "dose",
        explanation: "Selamento temporário."
      },
      {
        id: "broca_acesso",
        name: "Broca para acesso",
        category: "reutilizavel",
        costMin: 2.0,
        costAvg: 3.0,
        costMax: 5.0,
        unit: "uso",
        explanation: "Broca para abertura coronária."
      }
    ],
    labCostAvg: 0,
    marketPriceMin: 300,
    marketPriceAvg: 600,
    marketPriceMax: 1000,
    description: "Clareamento interno de dente escurecido após tratamento de canal.",
    tips: [
      "Indicado para dentes desvitalizados",
      "Pode necessitar múltiplas sessões",
      "Resultado gradual"
    ]
  },

  // ============================================
  // PRÓTESE / ESTÉTICA
  // ============================================

  {
    id: "lente_contato_porcelana",
    name: "Lente de Contato de Porcelana",
    category: "estetica",
    durationMin: 60,
    durationAvg: 90,
    durationMax: 120,
    materials: [
      ...MATERIAIS_BASICOS,
      {
        id: "broca_diamantada_fina",
        name: "Brocas diamantadas finas",
        category: "reutilizavel",
        costMin: 3.0,
        costAvg: 5.0,
        costMax: 8.0,
        unit: "uso",
        explanation: "Brocas para preparo ultra-conservador."
      },
      {
        id: "moldagem_silicone_precisao",
        name: "Silicone de moldagem de precisão",
        category: "clinico_basico",
        costMin: 20.0,
        costAvg: 35.0,
        costMax: 50.0,
        unit: "moldagem",
        explanation: "Silicone de adição."
      },
      {
        id: "moldeira",
        name: "Moldeira",
        category: "reutilizavel",
        costMin: 2.0,
        costAvg: 3.0,
        costMax: 5.0,
        unit: "uso",
        explanation: "Moldeira."
      },
      {
        id: "fio_retrator",
        name: "Fio retrator gengival",
        category: "descartavel",
        costMin: 2.0,
        costAvg: 4.0,
        costMax: 6.0,
        unit: "dose",
        explanation: "Afastamento gengival."
      },
      {
        id: "provisoria_lente",
        name: "Lente provisória",
        category: "clinico_basico",
        costMin: 10.0,
        costAvg: 20.0,
        costMax: 30.0,
        unit: "unidade",
        explanation: "Provisória durante confecção."
      },
      {
        id: "cimento_resinoso_estetico",
        name: "Cimento resinoso estético",
        category: "alto_custo",
        costMin: 25.0,
        costAvg: 45.0,
        costMax: 70.0,
        unit: "dose",
        explanation: "Cimento resinoso de alta estética."
      },
      {
        id: "acido_fluoridrico",
        name: "Ácido fluorídrico",
        category: "clinico_basico",
        costMin: 5.0,
        costAvg: 10.0,
        costMax: 15.0,
        unit: "dose",
        explanation: "Condicionamento da porcelana."
      },
      {
        id: "silano",
        name: "Silano",
        category: "clinico_basico",
        costMin: 5.0,
        costAvg: 10.0,
        costMax: 15.0,
        unit: "dose",
        explanation: "Agente de união para porcelana."
      }
    ],
    labCostAvg: 800,
    marketPriceMin: 1500,
    marketPriceAvg: 3000,
    marketPriceMax: 5000,
    description: "Lente de contato ultra-fina em porcelana (faceta minimamente invasiva).",
    tips: [
      "Procedimento de alta estética",
      "Custo laboratorial significativo",
      "Destaque preparo minimamente invasivo"
    ]
  },

  {
    id: "fechamento_diastema",
    name: "Fechamento de Diastema",
    category: "estetica",
    durationMin: 45,
    durationAvg: 60,
    durationMax: 90,
    materials: [
      ...MATERIAIS_BASICOS,
      {
        id: "acido_fosforico_rest",
        name: "Ácido fosfórico 37%",
        category: "clinico_basico",
        costMin: 1.0,
        costAvg: 2.0,
        costMax: 3.0,
        unit: "dose",
        explanation: "Condicionamento ácido."
      },
      {
        id: "adesivo_dentinario_premium",
        name: "Adesivo dentinário premium",
        category: "clinico_basico",
        costMin: 4.0,
        costAvg: 7.0,
        costMax: 12.0,
        unit: "dose",
        explanation: "Sistema adesivo de alta performance."
      },
      {
        id: "resina_composta_estetica",
        name: "Resina composta estética",
        category: "clinico_basico",
        costMin: 15.0,
        costAvg: 30.0,
        costMax: 50.0,
        unit: "dose",
        explanation: "Resina de alta estética."
      },
      {
        id: "disco_lixa_mult",
        name: "Discos de lixa (múltiplos)",
        category: "descartavel",
        costMin: 2.0,
        costAvg: 4.0,
        costMax: 6.0,
        unit: "jogos",
        explanation: "Discos para acabamento."
      }
    ],
    labCostAvg: 0,
    marketPriceMin: 400,
    marketPriceAvg: 800,
    marketPriceMax: 1500,
    description: "Fechamento de diastema (espaço entre dentes) com resina composta.",
    tips: [
      "Procedimento direto em consultório",
      "Resultado imediato",
      "Alternativa à ortodontia"
    ]
  },

  {
    id: "placa_miorrelaxante",
    name: "Placa Miorrelaxante",
    category: "protese",
    durationMin: 30,
    durationAvg: 45,
    durationMax: 60,
    materials: [
      ...MATERIAIS_BASICOS.filter(m => ["luvas", "mascara", "campo_descartavel"].includes(m.id)),
      {
        id: "moldagem_alginato",
        name: "Alginato para moldagem",
        category: "clinico_basico",
        costMin: 5.0,
        costAvg: 10.0,
        costMax: 15.0,
        unit: "moldagem",
        explanation: "Material de moldagem."
      },
      {
        id: "moldeira",
        name: "Moldeira",
        category: "reutilizavel",
        costMin: 2.0,
        costAvg: 3.0,
        costMax: 5.0,
        unit: "uso",
        explanation: "Moldeira."
      },
      {
        id: "registro_mordida",
        name: "Cera para registro de mordida",
        category: "clinico_basico",
        costMin: 2.0,
        costAvg: 4.0,
        costMax: 6.0,
        unit: "dose",
        explanation: "Registro oclusal."
      }
    ],
    labCostAvg: 300,
    marketPriceMin: 500,
    marketPriceAvg: 1000,
    marketPriceMax: 1800,
    description: "Placa oclusal para tratamento de bruxismo e DTM.",
    tips: [
      "Custo laboratorial significativo",
      "Inclua ajustes no preço",
      "Importante para saúde oclusal"
    ]
  },

  {
    id: "nucleo_material",
    name: "Núcleo (Material)",
    category: "protese",
    durationMin: 30,
    durationAvg: 45,
    durationMax: 60,
    materials: [
      ...MATERIAIS_BASICOS,
      {
        id: "pino_fibra_vidro",
        name: "Pino de fibra de vidro",
        category: "alto_custo",
        costMin: 30.0,
        costAvg: 60.0,
        costMax: 100.0,
        unit: "unidade",
        explanation: "Pino para reforço radicular."
      },
      {
        id: "cimento_resinoso",
        name: "Cimento resinoso",
        category: "clinico_basico",
        costMin: 15.0,
        costAvg: 30.0,
        costMax: 50.0,
        unit: "dose",
        explanation: "Cimento para fixação do pino."
      },
      {
        id: "resina_composta",
        name: "Resina composta",
        category: "clinico_basico",
        costMin: 10.0,
        costAvg: 20.0,
        costMax: 35.0,
        unit: "dose",
        explanation: "Resina para reconstrução coronária."
      }
    ],
    labCostAvg: 0,
    marketPriceMin: 200,
    marketPriceAvg: 400,
    marketPriceMax: 700,
    description: "Núcleo de preenchimento com pino de fibra de vidro.",
    tips: [
      "Necessário antes de coroa",
      "Pino de fibra é mais estético",
      "Custo do pino é significativo"
    ]
  },

  // ============================================
  // IMPLANTE / PRÓTESE SOBRE IMPLANTE
  // ============================================

  {
    id: "implante",
    name: "Implante",
    category: "implantodontia",
    durationMin: 60,
    durationAvg: 90,
    durationMax: 120,
    materials: [
      ...MATERIAIS_BASICOS,
      {
        id: "lamina_bisturi",
        name: "Lâmina de bisturi",
        category: "descartavel",
        costMin: 1.0,
        costAvg: 2.0,
        costMax: 3.0,
        unit: "unidade",
        explanation: "Lâmina estéril."
      },
      {
        id: "cabo_bisturi",
        name: "Cabo de bisturi",
        category: "reutilizavel",
        costMin: 1.0,
        costAvg: 2.0,
        costMax: 3.0,
        unit: "uso",
        explanation: "Cabo para lâmina."
      },
      {
        id: "descolador",
        name: "Descolador",
        category: "reutilizavel",
        costMin: 1.0,
        costAvg: 2.0,
        costMax: 3.0,
        unit: "uso",
        explanation: "Descolamento."
      },
      {
        id: "implante_osseointegrado",
        name: "Implante osseointegrado",
        category: "alto_custo",
        costMin: 300.0,
        costAvg: 600.0,
        costMax: 1200.0,
        unit: "unidade",
        explanation: "Implante de titânio. Marcas: Neodent, Straumann, Nobel."
      },
      {
        id: "kit_cirurgico_implante",
        name: "Kit cirúrgico (brocas)",
        category: "reutilizavel",
        costMin: 10.0,
        costAvg: 20.0,
        costMax: 30.0,
        unit: "uso",
        explanation: "Brocas para perfuração óssea (custo por uso)."
      },
      {
        id: "parafuso_cobertura",
        name: "Parafuso de cobertura",
        category: "clinico_basico",
        costMin: 10.0,
        costAvg: 20.0,
        costMax: 40.0,
        unit: "unidade",
        explanation: "Parafuso para fechamento do implante."
      },
      {
        id: "gaze_esteril",
        name: "Gaze estéril",
        category: "descartavel",
        costMin: 2.0,
        costAvg: 3.0,
        costMax: 5.0,
        unit: "pacote",
        explanation: "Gazes."
      },
      {
        id: "sutura_mult",
        name: "Fio de sutura",
        category: "descartavel",
        costMin: 5.0,
        costAvg: 8.0,
        costMax: 12.0,
        unit: "unidade",
        explanation: "Fio para sutura."
      },
      {
        id: "soro_fisiologico",
        name: "Soro fisiológico",
        category: "clinico_basico",
        costMin: 2.0,
        costAvg: 3.0,
        costMax: 5.0,
        unit: "dose",
        explanation: "Irrigação abundante."
      }
    ],
    labCostAvg: 0,
    marketPriceMin: 1500,
    marketPriceAvg: 3000,
    marketPriceMax: 6000,
    description: "Instalação de implante dentário unitário.",
    tips: [
      "Custo do implante varia muito por marca",
      "Não inclui a coroa protética",
      "Considere tomografia no orçamento"
    ]
  },

  {
    id: "remocao_implante",
    name: "Remoção de Implante",
    category: "implantodontia",
    durationMin: 45,
    durationAvg: 60,
    durationMax: 90,
    materials: [
      ...MATERIAIS_BASICOS,
      {
        id: "lamina_bisturi",
        name: "Lâmina de bisturi",
        category: "descartavel",
        costMin: 1.0,
        costAvg: 2.0,
        costMax: 3.0,
        unit: "unidade",
        explanation: "Lâmina estéril."
      },
      {
        id: "cabo_bisturi",
        name: "Cabo de bisturi",
        category: "reutilizavel",
        costMin: 1.0,
        costAvg: 2.0,
        costMax: 3.0,
        unit: "uso",
        explanation: "Cabo para lâmina."
      },
      {
        id: "trefina",
        name: "Trefina para remoção",
        category: "reutilizavel",
        costMin: 10.0,
        costAvg: 20.0,
        costMax: 30.0,
        unit: "uso",
        explanation: "Broca específica para remoção de implante."
      },
      {
        id: "gaze_esteril",
        name: "Gaze estéril",
        category: "descartavel",
        costMin: 2.0,
        costAvg: 3.0,
        costMax: 5.0,
        unit: "pacote",
        explanation: "Gazes."
      },
      {
        id: "sutura",
        name: "Fio de sutura",
        category: "descartavel",
        costMin: 5.0,
        costAvg: 8.0,
        costMax: 12.0,
        unit: "unidade",
        explanation: "Fio para sutura."
      }
    ],
    labCostAvg: 0,
    marketPriceMin: 500,
    marketPriceAvg: 1000,
    marketPriceMax: 2000,
    description: "Remoção cirúrgica de implante falho ou com complicações.",
    tips: [
      "Procedimento complexo",
      "Pode necessitar enxerto posterior",
      "Avalie causa da falha"
    ]
  },

  {
    id: "manutencao_protese_implante",
    name: "Manutenção de Prótese Sobre Implante",
    category: "implantodontia",
    durationMin: 20,
    durationAvg: 30,
    durationMax: 45,
    materials: [
      ...MATERIAIS_BASICOS.filter(m => ["luvas", "mascara", "campo_descartavel"].includes(m.id)),
      {
        id: "pasta_profilaxia",
        name: "Pasta profilática",
        category: "clinico_basico",
        costMin: 0.5,
        costAvg: 1.0,
        costMax: 2.0,
        unit: "dose",
        explanation: "Pasta para polimento."
      },
      {
        id: "escova_robinson",
        name: "Escova de Robinson",
        category: "descartavel",
        costMin: 1.0,
        costAvg: 1.5,
        costMax: 2.5,
        unit: "unidade",
        explanation: "Escova para polimento."
      }
    ],
    labCostAvg: 0,
    marketPriceMin: 100,
    marketPriceAvg: 200,
    marketPriceMax: 350,
    description: "Manutenção e limpeza de prótese sobre implante.",
    tips: [
      "Importante para longevidade",
      "Recomendado semestralmente",
      "Inclua orientações de higiene"
    ]
  },

  {
    id: "coroa_metal_free_dente",
    name: "Coroa Metal Free sobre Dente",
    category: "protese",
    durationMin: 45,
    durationAvg: 60,
    durationMax: 90,
    materials: [
      ...MATERIAIS_BASICOS,
      {
        id: "moldagem_silicone_precisao",
        name: "Silicone de moldagem de precisão",
        category: "clinico_basico",
        costMin: 20.0,
        costAvg: 35.0,
        costMax: 50.0,
        unit: "moldagem",
        explanation: "Silicone de adição para moldagem."
      },
      {
        id: "moldeira",
        name: "Moldeira",
        category: "reutilizavel",
        costMin: 2.0,
        costAvg: 3.0,
        costMax: 5.0,
        unit: "uso",
        explanation: "Moldeira para moldagem."
      },
      {
        id: "fio_retrator",
        name: "Fio retrator gengival",
        category: "descartavel",
        costMin: 2.0,
        costAvg: 4.0,
        costMax: 6.0,
        unit: "dose",
        explanation: "Afastamento gengival para moldagem."
      },
      {
        id: "cimento_definitivo_coroa",
        name: "Cimento definitivo",
        category: "clinico_basico",
        costMin: 15.0,
        costAvg: 30.0,
        costMax: 50.0,
        unit: "dose",
        explanation: "Cimento para cimentação definitiva."
      },
      {
        id: "papel_carbono",
        name: "Papel carbono",
        category: "descartavel",
        costMin: 0.1,
        costAvg: 0.2,
        costMax: 0.3,
        unit: "folha",
        explanation: "Verificação de oclusão."
      }
    ],
    labCostAvg: 500,
    marketPriceMin: 1200,
    marketPriceAvg: 2500,
    marketPriceMax: 4500,
    description: "Coroa definitiva metal free (porcelana ou zircônia) sobre dente.",
    tips: [
      "Custo laboratorial varia por material",
      "Zircônia é mais cara que porcelana",
      "Inclua garantia no preço"
    ]
  },

  {
    id: "coroa_metal_free_implante",
    name: "Coroa Metal Free sobre Implante",
    category: "implantodontia",
    durationMin: 45,
    durationAvg: 60,
    durationMax: 90,
    materials: [
      ...MATERIAIS_BASICOS.filter(m => ["luvas", "mascara", "campo_descartavel"].includes(m.id)),
      {
        id: "transferentes",
        name: "Transferente para moldagem",
        category: "clinico_basico",
        costMin: 20.0,
        costAvg: 40.0,
        costMax: 60.0,
        unit: "unidade",
        explanation: "Transferente para moldagem de implante."
      },
      {
        id: "moldagem_silicone_precisao",
        name: "Silicone de moldagem de precisão",
        category: "clinico_basico",
        costMin: 20.0,
        costAvg: 35.0,
        costMax: 50.0,
        unit: "moldagem",
        explanation: "Silicone de adição."
      },
      {
        id: "pilar_protese",
        name: "Pilar protético",
        category: "alto_custo",
        costMin: 100.0,
        costAvg: 200.0,
        costMax: 400.0,
        unit: "unidade",
        explanation: "Pilar para conexão com prótese."
      },
      {
        id: "parafuso_protese",
        name: "Parafuso protético",
        category: "clinico_basico",
        costMin: 10.0,
        costAvg: 20.0,
        costMax: 40.0,
        unit: "unidade",
        explanation: "Parafuso para fixação."
      }
    ],
    labCostAvg: 600,
    marketPriceMin: 1500,
    marketPriceAvg: 3000,
    marketPriceMax: 5500,
    description: "Coroa definitiva metal free sobre implante.",
    tips: [
      "Custo do pilar é significativo",
      "Zircônia é mais estética",
      "Inclua garantia no preço"
    ]
  },

  {
    id: "coroa_provisoria_dente",
    name: "Coroa Provisória sobre Dente",
    category: "protese",
    durationMin: 30,
    durationAvg: 45,
    durationMax: 60,
    materials: [
      ...MATERIAIS_BASICOS.filter(m => ["luvas", "mascara", "campo_descartavel"].includes(m.id)),
      {
        id: "resina_acrilica",
        name: "Resina acrílica autopolimerizável",
        category: "clinico_basico",
        costMin: 5.0,
        costAvg: 10.0,
        costMax: 15.0,
        unit: "dose",
        explanation: "Material para confecção da provisória."
      },
      {
        id: "cimento_provisorio_coroa",
        name: "Cimento provisório",
        category: "clinico_basico",
        costMin: 2.0,
        costAvg: 4.0,
        costMax: 6.0,
        unit: "dose",
        explanation: "Cimentação temporária."
      },
      {
        id: "disco_lixa",
        name: "Discos de acabamento",
        category: "descartavel",
        costMin: 1.0,
        costAvg: 2.0,
        costMax: 3.0,
        unit: "jogo",
        explanation: "Acabamento da provisória."
      }
    ],
    labCostAvg: 0,
    marketPriceMin: 150,
    marketPriceAvg: 300,
    marketPriceMax: 500,
    description: "Coroa provisória em resina acrílica sobre dente.",
    tips: [
      "Pode ser confeccionada em consultório",
      "Protege o dente preparado",
      "Mantém estética e função"
    ]
  },

  {
    id: "coroa_provisoria_implante",
    name: "Coroa Provisória sobre Implante",
    category: "implantodontia",
    durationMin: 30,
    durationAvg: 45,
    durationMax: 60,
    materials: [
      ...MATERIAIS_BASICOS.filter(m => ["luvas", "mascara", "campo_descartavel"].includes(m.id)),
      {
        id: "pilar_provisorio",
        name: "Pilar provisório",
        category: "clinico_basico",
        costMin: 50.0,
        costAvg: 100.0,
        costMax: 150.0,
        unit: "unidade",
        explanation: "Pilar temporário para implante."
      },
      {
        id: "coroa_provisoria_acrilica",
        name: "Coroa provisória acrílica",
        category: "clinico_basico",
        costMin: 50.0,
        costAvg: 100.0,
        costMax: 150.0,
        unit: "unidade",
        explanation: "Coroa temporária."
      },
      {
        id: "parafuso_protese",
        name: "Parafuso protético",
        category: "clinico_basico",
        costMin: 10.0,
        costAvg: 20.0,
        costMax: 40.0,
        unit: "unidade",
        explanation: "Parafuso para fixação."
      }
    ],
    labCostAvg: 100,
    marketPriceMin: 300,
    marketPriceAvg: 600,
    marketPriceMax: 1000,
    description: "Coroa provisória sobre implante.",
    tips: [
      "Importante para moldagem gengival",
      "Mantém estética durante osseointegração",
      "Custo do pilar é significativo"
    ]
  },

  {
    id: "overdenture",
    name: "Overdenture",
    category: "protese",
    durationMin: 90,
    durationAvg: 120,
    durationMax: 180,
    materials: [
      ...MATERIAIS_BASICOS.filter(m => ["luvas", "mascara", "campo_descartavel"].includes(m.id)),
      {
        id: "moldagem_alginato",
        name: "Alginato para moldagem",
        category: "clinico_basico",
        costMin: 8.0,
        costAvg: 15.0,
        costMax: 20.0,
        unit: "moldagens",
        explanation: "Material de moldagem (múltiplas)."
      },
      {
        id: "transferentes",
        name: "Transferentes para moldagem",
        category: "clinico_basico",
        costMin: 40.0,
        costAvg: 80.0,
        costMax: 120.0,
        unit: "conjunto",
        explanation: "Transferentes para moldagem de implantes."
      },
      {
        id: "attachments_overdenture",
        name: "Attachments (O-rings ou barra)",
        category: "alto_custo",
        costMin: 200.0,
        costAvg: 400.0,
        costMax: 800.0,
        unit: "conjunto",
        explanation: "Sistema de retenção para overdenture."
      }
    ],
    labCostAvg: 1500,
    marketPriceMin: 3000,
    marketPriceAvg: 6000,
    marketPriceMax: 12000,
    description: "Prótese total removível sobre implantes (overdenture).",
    tips: [
      "Requer 2-4 implantes",
      "Custo laboratorial significativo",
      "Melhor retenção que prótese total convencional"
    ]
  },

  {
    id: "overdenture_he",
    name: "Overdenture HE",
    category: "protese",
    durationMin: 90,
    durationAvg: 120,
    durationMax: 180,
    materials: [
      ...MATERIAIS_BASICOS.filter(m => ["luvas", "mascara", "campo_descartavel"].includes(m.id)),
      {
        id: "moldagem_alginato",
        name: "Alginato para moldagem",
        category: "clinico_basico",
        costMin: 8.0,
        costAvg: 15.0,
        costMax: 20.0,
        unit: "moldagens",
        explanation: "Material de moldagem."
      },
      {
        id: "transferentes",
        name: "Transferentes para moldagem",
        category: "clinico_basico",
        costMin: 40.0,
        costAvg: 80.0,
        costMax: 120.0,
        unit: "conjunto",
        explanation: "Transferentes."
      },
      {
        id: "attachments_he",
        name: "Attachments HE (sistema avançado)",
        category: "alto_custo",
        costMin: 300.0,
        costAvg: 600.0,
        costMax: 1000.0,
        unit: "conjunto",
        explanation: "Sistema de retenção de alta eficiência."
      }
    ],
    labCostAvg: 1800,
    marketPriceMin: 4000,
    marketPriceAvg: 8000,
    marketPriceMax: 15000,
    description: "Overdenture com sistema de retenção de alta eficiência.",
    tips: [
      "Sistema de retenção superior",
      "Maior estabilidade",
      "Custo mais elevado"
    ]
  },

  {
    id: "protocolo_all_on_four",
    name: "Protocolo All-on-Four",
    category: "implantodontia",
    durationMin: 180,
    durationAvg: 240,
    durationMax: 360,
    materials: [
      ...MATERIAIS_BASICOS,
      {
        id: "lamina_bisturi",
        name: "Lâminas de bisturi",
        category: "descartavel",
        costMin: 3.0,
        costAvg: 5.0,
        costMax: 8.0,
        unit: "múltiplas",
        explanation: "Lâminas estéreis."
      },
      {
        id: "cabo_bisturi",
        name: "Cabo de bisturi",
        category: "reutilizavel",
        costMin: 1.0,
        costAvg: 2.0,
        costMax: 3.0,
        unit: "uso",
        explanation: "Cabo para lâmina."
      },
      {
        id: "descolador",
        name: "Descolador",
        category: "reutilizavel",
        costMin: 1.0,
        costAvg: 2.0,
        costMax: 3.0,
        unit: "uso",
        explanation: "Descolamento."
      },
      {
        id: "implantes_multiplos",
        name: "Implantes osseointegrados (4 unidades)",
        category: "alto_custo",
        costMin: 1200.0,
        costAvg: 2400.0,
        costMax: 4800.0,
        unit: "conjunto",
        explanation: "4 implantes para protocolo."
      },
      {
        id: "kit_cirurgico_implante",
        name: "Kit cirúrgico (brocas)",
        category: "reutilizavel",
        costMin: 20.0,
        costAvg: 40.0,
        costMax: 60.0,
        unit: "uso",
        explanation: "Brocas para múltiplas perfurações."
      },
      {
        id: "pilares_multiunit",
        name: "Pilares multi-unit (4 unidades)",
        category: "alto_custo",
        costMin: 400.0,
        costAvg: 800.0,
        costMax: 1600.0,
        unit: "conjunto",
        explanation: "Pilares angulados para protocolo."
      },
      {
        id: "gaze_esteril",
        name: "Gaze estéril",
        category: "descartavel",
        costMin: 5.0,
        costAvg: 8.0,
        costMax: 12.0,
        unit: "pacotes",
        explanation: "Gazes."
      },
      {
        id: "sutura_mult",
        name: "Fio de sutura",
        category: "descartavel",
        costMin: 10.0,
        costAvg: 15.0,
        costMax: 20.0,
        unit: "múltiplas",
        explanation: "Fios para sutura."
      },
      {
        id: "soro_fisiologico",
        name: "Soro fisiológico",
        category: "clinico_basico",
        costMin: 5.0,
        costAvg: 8.0,
        costMax: 12.0,
        unit: "dose",
        explanation: "Irrigação abundante."
      }
    ],
    labCostAvg: 3500,
    marketPriceMin: 15000,
    marketPriceAvg: 30000,
    marketPriceMax: 60000,
    description: "Reabilitação total de arcada com prótese protocolo sobre 4 implantes.",
    tips: [
      "Procedimento de alta complexidade",
      "Custo laboratorial significativo",
      "Pode incluir carga imediata"
    ]
  },

  {
    id: "protocolo_resinoso_protetico",
    name: "Protocolo Resinoso (Parte Protética)",
    category: "protese",
    durationMin: 90,
    durationAvg: 120,
    durationMax: 180,
    materials: [
      ...MATERIAIS_BASICOS.filter(m => ["luvas", "mascara", "campo_descartavel"].includes(m.id)),
      {
        id: "transferentes",
        name: "Transferentes para moldagem",
        category: "clinico_basico",
        costMin: 80.0,
        costAvg: 150.0,
        costMax: 250.0,
        unit: "conjunto",
        explanation: "Transferentes para moldagem de implantes."
      },
      {
        id: "moldagem_silicone_precisao",
        name: "Silicone de moldagem de precisão",
        category: "clinico_basico",
        costMin: 30.0,
        costAvg: 50.0,
        costMax: 80.0,
        unit: "moldagem",
        explanation: "Silicone de adição."
      },
      {
        id: "registro_mordida",
        name: "Registro de mordida",
        category: "clinico_basico",
        costMin: 5.0,
        costAvg: 10.0,
        costMax: 15.0,
        unit: "dose",
        explanation: "Registro oclusal."
      },
      {
        id: "parafusos_protese",
        name: "Parafusos protéticos",
        category: "clinico_basico",
        costMin: 50.0,
        costAvg: 100.0,
        costMax: 200.0,
        unit: "conjunto",
        explanation: "Parafusos para fixação da prótese."
      }
    ],
    labCostAvg: 3000,
    marketPriceMin: 6000,
    marketPriceAvg: 12000,
    marketPriceMax: 25000,
    description: "Prótese protocolo definitiva em resina acrílica sobre implantes.",
    tips: [
      "Custo laboratorial significativo",
      "Mais acessível que porcelana",
      "Facilita reparos"
    ]
  },

  {
    id: "protocolo_resinoso_carga_imediata",
    name: "Protocolo Resinoso Carga Imediata Cone Morse",
    category: "implantodontia",
    durationMin: 240,
    durationAvg: 300,
    durationMax: 420,
    materials: [
      ...MATERIAIS_BASICOS,
      {
        id: "lamina_bisturi",
        name: "Lâminas de bisturi",
        category: "descartavel",
        costMin: 3.0,
        costAvg: 5.0,
        costMax: 8.0,
        unit: "múltiplas",
        explanation: "Lâminas estéreis."
      },
      {
        id: "implantes_cone_morse",
        name: "Implantes Cone Morse (4-6 unidades)",
        category: "alto_custo",
        costMin: 1500.0,
        costAvg: 3000.0,
        costMax: 6000.0,
        unit: "conjunto",
        explanation: "Implantes com conexão cone morse."
      },
      {
        id: "kit_cirurgico_implante",
        name: "Kit cirúrgico (brocas)",
        category: "reutilizavel",
        costMin: 20.0,
        costAvg: 40.0,
        costMax: 60.0,
        unit: "uso",
        explanation: "Brocas para perfurações."
      },
      {
        id: "pilares_multiunit",
        name: "Pilares multi-unit",
        category: "alto_custo",
        costMin: 600.0,
        costAvg: 1200.0,
        costMax: 2400.0,
        unit: "conjunto",
        explanation: "Pilares para protocolo."
      },
      {
        id: "protese_provisoria_imediata",
        name: "Prótese provisória imediata",
        category: "laboratorial",
        costMin: 1500.0,
        costAvg: 3000.0,
        costMax: 5000.0,
        unit: "unidade",
        explanation: "Prótese instalada no mesmo dia."
      },
      {
        id: "gaze_esteril",
        name: "Gaze estéril",
        category: "descartavel",
        costMin: 5.0,
        costAvg: 8.0,
        costMax: 12.0,
        unit: "pacotes",
        explanation: "Gazes."
      },
      {
        id: "sutura_mult",
        name: "Fio de sutura",
        category: "descartavel",
        costMin: 10.0,
        costAvg: 15.0,
        costMax: 20.0,
        unit: "múltiplas",
        explanation: "Fios para sutura."
      }
    ],
    labCostAvg: 3000,
    marketPriceMin: 20000,
    marketPriceAvg: 40000,
    marketPriceMax: 80000,
    description: "Protocolo com carga imediata usando implantes cone morse.",
    tips: [
      "Procedimento de altíssima complexidade",
      "Paciente sai com dentes no mesmo dia",
      "Valor agregado muito alto"
    ]
  },

  {
    id: "limpeza_protocolo",
    name: "Limpeza de Protocolo",
    category: "implantodontia",
    durationMin: 30,
    durationAvg: 45,
    durationMax: 60,
    materials: [
      ...MATERIAIS_BASICOS.filter(m => ["luvas", "mascara", "campo_descartavel"].includes(m.id)),
      {
        id: "pasta_profilaxia",
        name: "Pasta profilática",
        category: "clinico_basico",
        costMin: 1.0,
        costAvg: 2.0,
        costMax: 3.0,
        unit: "dose",
        explanation: "Pasta para polimento."
      },
      {
        id: "escova_robinson",
        name: "Escova de Robinson",
        category: "descartavel",
        costMin: 1.0,
        costAvg: 1.5,
        costMax: 2.5,
        unit: "unidade",
        explanation: "Escova para polimento."
      },
      {
        id: "fio_dental_especial",
        name: "Fio dental especial para implantes",
        category: "clinico_basico",
        costMin: 2.0,
        costAvg: 4.0,
        costMax: 6.0,
        unit: "porção",
        explanation: "Fio específico para limpeza de protocolo."
      }
    ],
    labCostAvg: 0,
    marketPriceMin: 150,
    marketPriceAvg: 300,
    marketPriceMax: 500,
    description: "Limpeza e manutenção de prótese protocolo sobre implantes.",
    tips: [
      "Importante para longevidade",
      "Recomendado semestralmente",
      "Inclua orientações de higiene"
    ]
  },

  // ============================================
  // PRÓTESES TOTAIS E PARCIAIS
  // ============================================

  {
    id: "protese_parcial_removivel",
    name: "Prótese Parcial Removível",
    category: "protese",
    durationMin: 60,
    durationAvg: 90,
    durationMax: 120,
    materials: [
      ...MATERIAIS_BASICOS.filter(m => ["luvas", "mascara", "campo_descartavel"].includes(m.id)),
      {
        id: "moldagem_alginato",
        name: "Alginato para moldagem",
        category: "clinico_basico",
        costMin: 5.0,
        costAvg: 10.0,
        costMax: 15.0,
        unit: "moldagem",
        explanation: "Material de moldagem."
      },
      {
        id: "moldeira",
        name: "Moldeira",
        category: "reutilizavel",
        costMin: 2.0,
        costAvg: 3.0,
        costMax: 5.0,
        unit: "uso",
        explanation: "Moldeira."
      },
      {
        id: "registro_mordida",
        name: "Cera para registro de mordida",
        category: "clinico_basico",
        costMin: 2.0,
        costAvg: 4.0,
        costMax: 6.0,
        unit: "dose",
        explanation: "Registro oclusal."
      }
    ],
    labCostAvg: 600,
    marketPriceMin: 1200,
    marketPriceAvg: 2500,
    marketPriceMax: 5000,
    description: "Prótese parcial removível com grampos.",
    tips: [
      "Custo laboratorial é significativo",
      "Diferencie por número de dentes",
      "Inclua ajustes no preço"
    ]
  },

  {
    id: "protese_parcial_provisoria",
    name: "Prótese Parcial Removível Provisória",
    category: "protese",
    durationMin: 45,
    durationAvg: 60,
    durationMax: 90,
    materials: [
      ...MATERIAIS_BASICOS.filter(m => ["luvas", "mascara", "campo_descartavel"].includes(m.id)),
      {
        id: "moldagem_alginato",
        name: "Alginato para moldagem",
        category: "clinico_basico",
        costMin: 5.0,
        costAvg: 10.0,
        costMax: 15.0,
        unit: "moldagem",
        explanation: "Material de moldagem."
      },
      {
        id: "moldeira",
        name: "Moldeira",
        category: "reutilizavel",
        costMin: 2.0,
        costAvg: 3.0,
        costMax: 5.0,
        unit: "uso",
        explanation: "Moldeira."
      }
    ],
    labCostAvg: 300,
    marketPriceMin: 500,
    marketPriceAvg: 1000,
    marketPriceMax: 1800,
    description: "Prótese parcial removível provisória (temporária).",
    tips: [
      "Mais simples que definitiva",
      "Mantém estética durante tratamento",
      "Custo laboratorial menor"
    ]
  },

  {
    id: "protese_total_provisoria",
    name: "Prótese Total Provisória",
    category: "protese",
    durationMin: 60,
    durationAvg: 90,
    durationMax: 120,
    materials: [
      ...MATERIAIS_BASICOS.filter(m => ["luvas", "mascara", "campo_descartavel"].includes(m.id)),
      {
        id: "moldagem_alginato",
        name: "Alginato para moldagem",
        category: "clinico_basico",
        costMin: 8.0,
        costAvg: 15.0,
        costMax: 20.0,
        unit: "moldagens",
        explanation: "Material de moldagem."
      },
      {
        id: "moldeira",
        name: "Moldeira",
        category: "reutilizavel",
        costMin: 3.0,
        costAvg: 5.0,
        costMax: 8.0,
        unit: "uso",
        explanation: "Moldeiras."
      }
    ],
    labCostAvg: 500,
    marketPriceMin: 800,
    marketPriceAvg: 1500,
    marketPriceMax: 2500,
    description: "Prótese total provisória (temporária).",
    tips: [
      "Mantém estética durante tratamento",
      "Mais simples que definitiva",
      "Custo laboratorial menor"
    ]
  },

  {
    id: "protese_total_provisoria_imediata",
    name: "Prótese Total Provisória Imediata",
    category: "protese",
    durationMin: 90,
    durationAvg: 120,
    durationMax: 180,
    materials: [
      ...MATERIAIS_BASICOS.filter(m => ["luvas", "mascara", "campo_descartavel"].includes(m.id)),
      {
        id: "moldagem_alginato",
        name: "Alginato para moldagem",
        category: "clinico_basico",
        costMin: 8.0,
        costAvg: 15.0,
        costMax: 20.0,
        unit: "moldagens",
        explanation: "Material de moldagem."
      },
      {
        id: "moldeira",
        name: "Moldeira",
        category: "reutilizavel",
        costMin: 3.0,
        costAvg: 5.0,
        costMax: 8.0,
        unit: "uso",
        explanation: "Moldeiras."
      }
    ],
    labCostAvg: 700,
    marketPriceMin: 1200,
    marketPriceAvg: 2000,
    marketPriceMax: 3500,
    description: "Prótese total provisória instalada imediatamente após extrações.",
    tips: [
      "Instalada no dia das extrações",
      "Mantém estética imediatamente",
      "Requer ajustes frequentes"
    ]
  },

  {
    id: "reparo_protese_parcial",
    name: "Reparo de Prótese Parcial",
    category: "protese",
    durationMin: 20,
    durationAvg: 30,
    durationMax: 45,
    materials: [
      ...MATERIAIS_BASICOS.filter(m => ["luvas", "mascara"].includes(m.id)),
      {
        id: "resina_acrilica_reparo",
        name: "Resina acrílica para reparo",
        category: "clinico_basico",
        costMin: 5.0,
        costAvg: 10.0,
        costMax: 15.0,
        unit: "dose",
        explanation: "Material para reparo."
      }
    ],
    labCostAvg: 100,
    marketPriceMin: 150,
    marketPriceAvg: 300,
    marketPriceMax: 500,
    description: "Reparo de prótese parcial removível (fratura, grampo, dente).",
    tips: [
      "Pode ser feito em consultório ou laboratório",
      "Diferencie por complexidade",
      "Inclua garantia do reparo"
    ]
  },

  {
    id: "reparo_protese_total",
    name: "Reparo de Prótese Total",
    category: "protese",
    durationMin: 20,
    durationAvg: 30,
    durationMax: 45,
    materials: [
      ...MATERIAIS_BASICOS.filter(m => ["luvas", "mascara"].includes(m.id)),
      {
        id: "resina_acrilica_reparo",
        name: "Resina acrílica para reparo",
        category: "clinico_basico",
        costMin: 5.0,
        costAvg: 10.0,
        costMax: 15.0,
        unit: "dose",
        explanation: "Material para reparo."
      }
    ],
    labCostAvg: 100,
    marketPriceMin: 150,
    marketPriceAvg: 300,
    marketPriceMax: 500,
    description: "Reparo de prótese total (fratura, dente).",
    tips: [
      "Pode ser feito em consultório ou laboratório",
      "Diferencie por complexidade",
      "Inclua garantia do reparo"
    ]
  },

  {
    id: "reparo_protocolo",
    name: "Reparo de Protocolo",
    category: "protese",
    durationMin: 30,
    durationAvg: 45,
    durationMax: 60,
    materials: [
      ...MATERIAIS_BASICOS.filter(m => ["luvas", "mascara"].includes(m.id)),
      {
        id: "resina_acrilica_reparo",
        name: "Resina acrílica para reparo",
        category: "clinico_basico",
        costMin: 10.0,
        costAvg: 20.0,
        costMax: 30.0,
        unit: "dose",
        explanation: "Material para reparo."
      },
      {
        id: "parafuso_protese",
        name: "Parafuso protético (se necessário)",
        category: "clinico_basico",
        costMin: 10.0,
        costAvg: 20.0,
        costMax: 40.0,
        unit: "unidade",
        explanation: "Parafuso de reposição."
      }
    ],
    labCostAvg: 200,
    marketPriceMin: 300,
    marketPriceAvg: 600,
    marketPriceMax: 1000,
    description: "Reparo de prótese protocolo sobre implantes.",
    tips: [
      "Geralmente feito em laboratório",
      "Diferencie por complexidade",
      "Custo laboratorial significativo"
    ]
  },

  // ============================================
  // ORTODONTIA / OUTROS
  // ============================================

  {
    id: "contencao_3x3_inferior",
    name: "Contenção 3x3 Inferior",
    category: "ortodontia",
    durationMin: 30,
    durationAvg: 45,
    durationMax: 60,
    materials: [
      ...MATERIAIS_BASICOS.filter(m => ["luvas", "mascara", "campo_descartavel"].includes(m.id)),
      {
        id: "fio_contencao",
        name: "Fio de contenção trançado",
        category: "clinico_basico",
        costMin: 20.0,
        costAvg: 40.0,
        costMax: 60.0,
        unit: "unidade",
        explanation: "Fio para contenção fixa."
      },
      {
        id: "resina_colagem",
        name: "Resina para colagem",
        category: "clinico_basico",
        costMin: 5.0,
        costAvg: 10.0,
        costMax: 15.0,
        unit: "dose",
        explanation: "Resina para fixação do fio."
      },
      {
        id: "acido_fosforico",
        name: "Ácido fosfórico 37%",
        category: "clinico_basico",
        costMin: 1.0,
        costAvg: 2.0,
        costMax: 3.0,
        unit: "dose",
        explanation: "Condicionamento ácido."
      }
    ],
    labCostAvg: 0,
    marketPriceMin: 300,
    marketPriceAvg: 600,
    marketPriceMax: 1000,
    description: "Contenção ortodôntica fixa 3x3 na arcada inferior.",
    tips: [
      "Importante após tratamento ortodôntico",
      "Previne recidiva",
      "Manutenção permanente"
    ]
  },

  {
    id: "mini_implante_ortodontico",
    name: "Mini Implante Ortodôntico (Material)",
    category: "ortodontia",
    durationMin: 20,
    durationAvg: 30,
    durationMax: 45,
    materials: [
      ...MATERIAIS_BASICOS,
      {
        id: "mini_implante",
        name: "Mini implante ortodôntico",
        category: "alto_custo",
        costMin: 100.0,
        costAvg: 200.0,
        costMax: 400.0,
        unit: "unidade",
        explanation: "Mini implante para ancoragem ortodôntica."
      },
      {
        id: "broca_mini_implante",
        name: "Broca para mini implante",
        category: "reutilizavel",
        costMin: 5.0,
        costAvg: 10.0,
        costMax: 15.0,
        unit: "uso",
        explanation: "Broca específica."
      }
    ],
    labCostAvg: 0,
    marketPriceMin: 300,
    marketPriceAvg: 600,
    marketPriceMax: 1000,
    description: "Instalação de mini implante para ancoragem ortodôntica.",
    tips: [
      "Facilita movimentação ortodôntica",
      "Procedimento rápido",
      "Custo do mini implante é significativo"
    ]
  },

  // ============================================
  // PROCEDIMENTOS GERAIS (URGÊNCIA)
  // ============================================

  {
    id: "urgencia",
    name: "Urgência",
    category: "preventivo",
    durationMin: 20,
    durationAvg: 30,
    durationMax: 45,
    materials: [
      ...MATERIAIS_BASICOS,
      {
        id: "medicamento_urgencia",
        name: "Medicamento para urgência",
        category: "clinico_basico",
        costMin: 5.0,
        costAvg: 10.0,
        costMax: 20.0,
        unit: "dose",
        explanation: "Medicamento para alívio imediato."
      }
    ],
    labCostAvg: 0,
    marketPriceMin: 80,
    marketPriceAvg: 150,
    marketPriceMax: 300,
    description: "Atendimento de urgência para alívio de dor ou trauma.",
    tips: [
      "Atendimento imediato",
      "Pode incluir medicação",
      "Agende retorno para tratamento definitivo"
    ]
  },

];

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

export function getTreatmentsByCategory(category: TreatmentTemplate["category"]): TreatmentTemplate[] {
  return TREATMENTS_DATABASE.filter(t => t.category === category);
}

export function getTreatmentById(id: string): TreatmentTemplate | undefined {
  return TREATMENTS_DATABASE.find(t => t.id === id);
}

export function getAllCategories(): TreatmentTemplate["category"][] {
  return ["preventivo", "restaurador", "endodontia", "cirurgia", "implantodontia", "protese", "estetica", "ortodontia"];
}

export function getCategoryLabel(category: TreatmentTemplate["category"]): string {
  const labels: Record<TreatmentTemplate["category"], string> = {
    preventivo: "Preventivos",
    restaurador: "Restauradores",
    endodontia: "Endodontia",
    cirurgia: "Cirurgia",
    implantodontia: "Implantodontia",
    protese: "Prótese",
    estetica: "Estética",
    ortodontia: "Ortodontia"
  };
  return labels[category];
}

export function getMaterialCategoryLabel(category: MaterialDetail["category"]): string {
  const labels: Record<MaterialDetail["category"], string> = {
    descartavel: "Descartável",
    reutilizavel: "Reutilizável",
    alto_custo: "Alto Custo",
    laboratorial: "Laboratorial",
    clinico_basico: "Clínico Básico"
  };
  return labels[category];
}

export function calculateTotalMaterialCost(materials: MaterialDetail[], costType: "min" | "avg" | "max" = "avg"): number {
  return materials.reduce((sum, material) => {
    const cost = costType === "min" ? material.costMin : costType === "max" ? material.costMax : material.costAvg;
    return sum + cost;
  }, 0);
}
