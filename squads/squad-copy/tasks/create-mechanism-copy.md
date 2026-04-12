---
task: create-mechanism-copy
responsavel: "@direct-response-writer"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: context
    tipo: object
    origem: "workflow ou manual"
    obrigatorio: true

Saida:
  - campo: resultado
    tipo: document
    destino: "stakeholders"

Checklist:
  - "[ ] Validar inputs e pre-condicoes"
  - "[ ] Executar steps conforme documentado"
  - "[ ] Verificar criterios de qualidade"
  - "[ ] Gerar output no formato especificado"
---

# Task: Create Mechanism Copy

## Metadata
- **Squad:** squad-copy
- **Agent:** direct-response-writer (Forge)
- **Complexity:** COMPLEX
- **Depends on:** copy brief, product/service deep dive, competitive analysis
- **Feeds:** copy-strategist (Quill), funnel-copywriter (Flow), proof-architect (Evidence)

## Objetivo
Identificar, nomear e articular o mecanismo unico do produto/servico — o "POR QUE funciona" que diferencia de todas as alternativas. Segundo Eugene Schwartz, em mercados sofisticados, o mecanismo e o que vende — nao o produto, nao os beneficios, mas o MECANISMO que produz os beneficios.

## Entrada
- Produto/servico com descricao tecnica detalhada
- Processo ou metodologia de entrega
- Analise competitiva (como concorrentes se posicionam)
- Market sophistication level (Schwartz 1-5)
- Resultados documentados e como sao alcancados

## Passos

### 1. Identificar o Mecanismo Real
**Perguntas para extrair o mecanismo:**
- O que ESPECIFICAMENTE causa o resultado?
- Qual e o PROCESSO unico que voce usa?
- O que voce faz DIFERENTE de todos os outros?
- Qual e o ingrediente/componente/passo que ninguem mais tem?
- Se o cliente pudesse ver "por tras das cortinas", o que veria?

**Tipos de mecanismo:**
| Tipo | Descricao | Exemplo |
|------|-----------|---------|
| Processo | Metodologia unica em passos | "O Sistema 3R de Restruturacao" |
| Ingrediente | Componente especial | "Com tecnologia XYZ exclusiva" |
| Descoberta | Insight ou principio inedito | "Baseado na descoberta de que..." |
| Inversao | Faz o oposto do convencional | "Ao inves de [comum], fazemos [oposto]" |
| Combinacao | Juncao unica de elementos conhecidos | "A unica que combina [A] + [B] + [C]" |

### 2. Nomear o Mecanismo
**O nome e CRUCIAL — torna o mecanismo proprietario e memoravel:**
- Deve soar tecnico mas ser compreensivel
- 2-4 palavras ideal
- Usar formula: [Adjetivo/Numero] + [Substantivo Tecnico]
- Exemplos: "Metodo Cascata Inversa", "Protocolo 5-Fases", "Sistema de Calibracao Neural"

**Teste do nome:** Se alguem ouvir e perguntar "o que e isso?", o nome funciona.

### 3. Articular o Mecanismo em 3 Niveis
**Nivel 1 — One-liner (10 palavras):**
> "O [Nome do Mecanismo] faz [resultado] ao [diferencial]."

**Nivel 2 — Elevator pitch (50 palavras):**
> Explicacao que pode ser contada em 30 segundos. Inclui o QUE faz, POR QUE funciona e O QUE o torna diferente.

**Nivel 3 — Full mechanism section (300-500 palavras):**
> Secao completa para sales page/VSL. Inclui contexto, explicacao tecnica simplificada, analogia, e por que nada mais funciona sem esse mecanismo.

### 4. Criar Analogia Explicativa
- Comparar o mecanismo com algo familiar
- "E como [analogia] — [conexao com mecanismo]"
- A analogia deve tornar o complexo SIMPLES
- Teste: alguem de 12 anos entenderia?

### 5. Desenvolver Fascination Bullets do Mecanismo
**Minimo 10 fascination bullets:**
- "O [componente] que [resultado surpreendente]"
- "Por que [abordagem comum] nunca vai funcionar — e o que fazer ao inves"
- "O segredo de [processo] que [expert] descobriu em [contexto]"
- "Como [mecanismo] elimina [problema] sem [sacrificio]"
- Cada bullet deve criar desejo INCONTROLAVEL de saber mais

### 6. Integrar com Market Sophistication (Schwartz)
| Nivel | Abordagem do Mecanismo |
|-------|----------------------|
| 1 (Virgem) | Nao precisa de mecanismo — claim direto basta |
| 2 (Segundo) | Amplificar o claim — mecanismo simples |
| 3 (Terceiro) | MECANISMO e o diferencial — foco total nele |
| 4 (Quarto) | Mecanismo aprimorado — "novo e melhorado" |
| 5 (Quinto) | Identificacao + mecanismo — conectar com identidade |

## Cross-Squad Handoff
```yaml
handoffs:
  - to: copy-strategist (Quill)
    delivers: Mecanismo nomeado e articulado em 3 niveis
    format: Documento de mecanismo com bullets e analogia
  - to: funnel-copywriter (Flow)
    delivers: Mechanism copy para integracao em funil
    format: Copy blocks reutilizaveis por nivel
```

## Saida
- Nome proprietario do mecanismo
- Articulacao em 3 niveis (one-liner, elevator pitch, full section)
- Analogia explicativa
- 10+ fascination bullets
- Recomendacao de uso por market sophistication level
- Copy blocks prontos para integracao em sales page/VSL

## Validacao
- [ ] Mecanismo e REAL (nao inventado ou exagerado)
- [ ] Nome e proprietario, memoravel e intrigante
- [ ] Explica POR QUE funciona (nao apenas O QUE faz)
- [ ] Diferencia claramente de alternativas
- [ ] Analogia torna o complexo simples
- [ ] Fascination bullets (10+) criam curiosidade
- [ ] Articulacao em 3 niveis (one-liner, elevator, full)
- [ ] Adaptado ao market sophistication level
- [ ] Passaria no "teste do ctico" (nao parece snake oil)

---

*Task operada por: direct-response-writer (Forge)*
