---
task: configure-signal-sources
responsavel: "@signal-intelligence"
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

# Task: Configure Signal Sources

> Parametrizar fontes de monitoramento de sinais para cada cliente/projeto.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | signal-intelligence (Radar) |
| **Co-agents** | editorial-strategist (North) |
| **Trigger** | Novo projeto ou re-configuracao de fontes |
| **Input** | Pilares editoriais, setor do cliente, concorrentes, plataformas-alvo |
| **Output** | Configuracao de fontes documentada com keywords, concorrentes, thresholds |
| **Handoff** | → scan-daily-signals (primeira execucao) |
| **Complexity** | complex |

---

## Fundamentacao

Fontes mal configuradas = sinais irrelevantes = conteudo sem impacto. A configuracao e o alicerce de todo o sistema de deteccao. Cada cliente tem setor diferente, concorrentes diferentes, fontes relevantes diferentes. A configuracao deve ser completa no setup e refinada continuamente baseada no feedback loop. Referencia: signal-detection-methods.md.

---

## Steps

### Step 1: Mapear Fontes por Pilar
Para cada pilar editorial: quais fontes sao relevantes? Redes sociais, portais, newsletters, influencers, foruns, podcasts.

### Step 2: Configurar Keywords
Por pilar: termos de busca, hashtags, topicos, nomes de concorrentes, termos do setor.

### Step 3: Definir Concorrentes
Lista de concorrentes diretos (mesmo segmento) e indiretos (mesma audiencia, outro produto). Perfis a monitorar por plataforma.

### Step 4: Calibrar Thresholds
Definir threshold de temperatura para o setor: setores rapidos (tech, moda) tem thresholds mais baixos. Setores lentos (B2B enterprise) tem thresholds mais altos.

### Step 5: Configurar UGC Monitoring
Definir: hashtags da marca, mentions, nome do produto/servico, reviews.

### Step 6: Primeiro Scan de Validacao
Executar scan completo com configuracao nova. Avaliar: muitos falsos positivos? Fontes relevantes? Ajustar calibragem.

### Step 7: Handoff

```yaml
handoff:
  artifact: "signal-sources-config-{client}.md"
  context: "Fontes configuradas: {N} fontes, {M} keywords, {P} concorrentes, UGC ativo"
  next: "scan-daily-signals para operacao diaria"
```
