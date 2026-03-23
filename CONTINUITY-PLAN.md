# Sinapse — Plano de Continuidade

> **Última atualização:** 2026-03-20
> **Status:** Sprint 0, Sprint 1 e Sprint 1.5 concluídos — Sprint 2 pendente
> **Próxima ação:** Configurar Whisper (MCP/skill/API) + Executar Sprint 2 (primeiro clone)

---

## Estado Atual do Projeto

### O que foi feito (2026-03-20)
1. Análise completa de todas as 16 squads (maturidade, gaps, qualidade)
2. Comparação com SINAPSE Squad Calculator (11 squads do Thiago Finch)
3. Deletado `squad-operations-hub.deprecated`
4. Definido plano completo de evolução
5. Análise do Mega Brain (JARVIS pipeline) e OpenClaw setup
6. Plano aprovado e documentado
7. **Sprint 0 executado:** 15 squads renomeadas, squad-command eliminado, sinapse-master migrado para `sinapse/`, todas as referências atualizadas

### O que foi feito (2026-03-20 — Sprint 1)
8. **Squad-cloning criada:** 8 agentes, 54 tasks, 9 KBs, 6 workflows, 3 checklists, 5 templates (86 arquivos)
9. Integrada no ecossistema: routing table atualizada, squad-awareness regenerada

### O que foi feito (2026-03-20 — Sprint 1.5)
10. **Squad-courses criada:** 8 agentes, 59 tasks, 10 KBs, 6 workflows, 3 checklists, 6 templates (93 arquivos)
11. Cobre: cursos em video, cursos escritos, apresentacoes de mentoria/workshop, workbooks, assessments, launch strategy
12. Integrada no ecossistema: routing table atualizada, 17 squads no total

### O que NÃO foi executado ainda
- **PRE-SPRINT 2:** Configurar Whisper dentro do Claude Code (MCP server, skill, ou API) para transcrever diretamente sem depender de OpenClaw externo
- **Sprint 2:** Primeiro clone cognitivo real usando o pipeline squad-cloning
- Target do primeiro clone ainda não definido — Caio vai escolher quando retornar
- Extrações existentes em `extracted-intelligence/` (Marcelo Kimura, Matheus Soier) podem servir como base

### Decisão pendente do Caio (ao retornar)
1. Investigar melhor opção de Whisper para Claude Code: MCP server? Skill? API direta? Plugin local?
2. Escolher primeiro target para clonagem
3. Verificar se tem material pronto (transcrições, PDFs) ou precisa capturar do zero

---

## Arquitetura Definida

### Dual-Mode
- **Standalone:** sinapse-master (Imperator) orquestra todas as squads sozinho
- **Com SINAPSE:** sinapse-master (Orion) + sinapse-master co-orquestram

### sinapse-master como agente standalone
- Não existe mais squad-sinapse
- sinapse-master vive em `sinapse/agents/sinapse-master.md`
- Seus KBs vivem em `sinapse/knowledge-base/`

---

## Infraestrutura — Somente Plano Max

**Nenhuma API externa é necessária.** Todo o pipeline roda com o plano Max do Claude.

### Ferramentas

| Ferramenta | Uso | Ambiente | Custo extra |
|-----------|-----|---------|-------------|
| **Claude Code (Max)** | Extração, síntese, geração | Desktop + VPS | Nenhum |
| **OpenClaw** | Transcrição (Whisper), captura (Playwright), busca (Brave) | VPS 24/7 | Nenhum |
| **Codex** | Processamento paralelo auxiliar | VPS | Nenhum |
| **Syncthing** | Sync cross-machine | VPS ↔ Local | Nenhum |

### Modelo de execução com 1M de contexto

Com o novo modelo Claude (1M tokens ≈ 750K palavras):

| Antes (200K contexto) | Depois (1M contexto) |
|----------------------|---------------------|
| Chunkar em 600 pedaços | Carregar tudo de uma vez |
| Muitas sessões por clone | 1-3 sessões por clone |
| Precisava API Batch | Tudo no plano Max |
| Dias para 1 clone | 1-3 sessões para 1 clone |

### Distribuição por sessão

```
Sessão 1: Carregar transcrições + Extrair 5 camadas DNA
Sessão 2: Sintetizar perfil cognitivo + Gerar agente
Sessão 3: Gerar KBs + Tasks + Validar (se necessário)
```

---

## Padrão de Qualidade de Clones

### Classes de disponibilidade de conteúdo

Nem toda mente tem 200h de conteúdo acessível. O pipeline se adapta:

| Classe | Conteúdo disponível | Exemplo | Estratégia |
|--------|-------------------|---------|-----------|
| **A — Rico** | 100h+ (YouTube, cursos, livros, podcasts) | Gary Halbert, Alex Hormozi, Russell Brunson | Transcrição massiva → extração direta |
| **B — Moderado** | 20-100h (alguns vídeos, 1-2 livros, entrevistas) | Eugene Schwartz, Claude Hopkins, Brad Frost | Livros + entrevistas + artigos disponíveis |
| **C — Escasso** | <20h (poucos vídeos, artigos, citações) | Robert Collier, Parris Lampropoulos | Livros + artigos + menções por terceiros + inferência |
| **D — Histórico** | Só obras escritas, sem vídeo/áudio | Claude Hopkins, Joseph Campbell | OCR de livros + análise de obras + citações + biografias |

### Estratégia por classe

**Classe A (Rico):**
- OpenClaw transcreve YouTube/podcasts via Whisper
- Claude Code (1M) processa tudo numa sessão
- Output: Tier 3 (clone completo)

**Classe B (Moderado):**
- OpenClaw transcreve o que tem
- Brave Search busca entrevistas, artigos, palestras
- Complementa com livros (PDF → extração)
- Output: Tier 2 ou 3

**Classe C (Escasso):**
- Brave Search + Codex rastreiam tudo acessível
- Livros como fonte primária
- Análise de terceiros que estudam/citam essa pessoa
- OpenClaw captura menções em podcasts de outros
- Output: Tier 1 ou 2

**Classe D (Histórico):**
- Livros/obras como fonte única
- Biografias e análises acadêmicas como fonte secundária
- Citações compiladas
- Output: Tier 1 (KBs ricos baseados em obra escrita)

### Mínimos de qualidade por tier

#### Tier 1 — KB Clone (mínimo para ser útil)

| Critério | Mínimo obrigatório |
|----------|-------------------|
| Palavras processadas | 5K |
| Mental models identificados | 5 |
| Heurísticas extraídas | 8 |
| Workflows documentados | 3 |
| Content patterns | 5 |
| KBs gerados | 3 |
| Fontes consultadas | 3+ |
| Confidence score | ≥60% |

**Gate:** Se não atinge esses mínimos, NÃO gera clone. Documenta como "insuficiente" e lista o que falta.

#### Tier 2 — Consultant Clone

| Critério | Mínimo obrigatório |
|----------|-------------------|
| Palavras processadas | 30K |
| Mental models identificados | 10 |
| Heurísticas extraídas | 15 |
| Workflows documentados | 5 |
| Content patterns | 8 |
| Contradições resolvidas | 3+ |
| KBs gerados | 5 |
| Agent.md gerado | Sim |
| Fontes consultadas | 5+ |
| Confidence score | ≥75% |

#### Tier 3 — Full Clone

| Critério | Mínimo obrigatório |
|----------|-------------------|
| Palavras processadas | 80K |
| Mental models identificados | 15 |
| Heurísticas extraídas | 25 |
| Workflows documentados | 8 |
| Content patterns | 12 |
| Decision rules | 10 |
| Contradições resolvidas | 5+ |
| Vocabulário/tom extraído | Sim |
| Meta-patterns identificados | 5 |
| KBs gerados | 8 |
| Tasks gerados | 6 |
| Agent.md completo | Sim |
| Fontes consultadas | 8+ |
| Confidence score | ≥85% |

### Confidence Score — Como calcular

```
Confidence = (evidência_direta × 1.0 + inferência_segura × 0.7 + hipótese × 0.3) / total_extrações × 100

Evidência direta:   Citação literal da pessoa, transcrição própria
Inferência segura:  Padrão observado em 3+ fontes independentes
Hipótese:           Extraído de 1 fonte ou inferido de contexto
```

| Score | Significado | Ação |
|-------|------------|------|
| ≥85% | Alta confiança | Clone completo, Tier 3 eligible |
| 75-84% | Boa confiança | Tier 2 eligible, documentar gaps |
| 60-74% | Confiança moderada | Tier 1 only, marcar como parcial |
| <60% | Insuficiente | NÃO gerar clone, listar o que falta |

### Princípio de honestidade

**NUNCA inventar o que não foi extraído.** Cada afirmação deve ter tag de confiança:
- `[DIRETO]` — palavras da própria pessoa
- `[INFERIDO]` — padrão observado em múltiplas fontes
- `[HIPÓTESE]` — extrapolação que precisa validação

---

## Sprint 0: Renomeação (CONCLUÍDO 2026-03-20)

| Antigo | Novo |
|--------|------|
| squad-brand-system | **squad-brand** |
| squad-copywriting-persuasion | **squad-copy** |
| squad-content-intelligence | **squad-content** |
| squad-creative-animations | **squad-animations** |
| squad-digital-experience | **squad-design** |
| squad-paid-media | **squad-paidmedia** |
| squad-growth-analytics | **squad-growth** |
| squad-commercial-systems | **squad-commercial** |
| squad-product-systems | **squad-product** |
| squad-research-intelligence | **squad-research** |
| squad-financial-intelligence | **squad-finance** |
| squad-cyber-defense | **squad-cybersecurity** |
| squad-narrative-masters | **squad-storytelling** |
| squad-strategic-council | **squad-council** |
| squad-claude-mastery | **squad-claude** |
| squad-command | **sinapse/** (não é mais squad) |

### Checklist Sprint 0
- [x] Renomear 15 diretórios de squads
- [x] Atualizar `name:` e `slashPrefix:` em cada `squad.yaml`
- [x] Mover `squad-command/agents/sinapse-master.md` → `sinapse/agents/sinapse-master.md`
- [x] Mover KBs do squad-command → `sinapse/knowledge-base/`
- [x] Mover tasks do squad-command → `sinapse/tasks/`
- [x] Deletar `squad-command/`
- [x] Atualizar routing table do sinapse-master com novos nomes
- [x] Atualizar `SQUAD-CREATION-STANDARDS.md`
- [x] Atualizar `install-squads.sh` e `install-squads.ps1`
- [x] Atualizar `.claude/rules/squad-awareness.md`
- [x] Atualizar referências cross-squad em KBs e workflows (984 arquivos)
- [ ] Commit + push

---

## Sprint 1: Foundation (squad-cloning)

### Estrutura a criar
```
squad-cloning/
├── squad.yaml
├── agents/ (8 agentes: Helix, Scout, Capture, Cortex, Nexus, Forge, Archive, Assembly)
├── tasks/ (54 tasks)
├── workflows/ (6 workflows)
├── knowledge-base/ (8 KBs)
├── checklists/ (3)
├── templates/ (5)
└── preferences/
```

### Agentes
| ID | Persona | Função |
|----|---------|--------|
| cloning-orqx | Helix | Coordenador do pipeline |
| source-hunter | Scout | Descobre e cataloga fontes de conteúdo |
| content-capturer | Capture | Transcrição em massa via OpenClaw |
| cognitive-extractor | Cortex | Extrai 5 camadas DNA cognitivo |
| mind-synthesizer | Nexus | Consolida perfil cognitivo unificado |
| agent-forger | Forge | Gera agent.md a partir de perfis |
| kb-architect | Archive | Gera knowledge base files |
| squad-assembler | Assembly | Monta e valida squad final |

### Pipeline simplificado (1M contexto)

```
Fase 1: Source Discovery    → Scout    → source-catalog.yaml          [Brave + Claude Code]
Fase 2: Content Capture     → Capture  → raw/ (transcrições)          [OpenClaw Whisper]
Fase 3: Load & Extract      → Cortex   → 5 camadas DNA (sessão 1)    [Claude Code 1M]
Fase 4: Synthesize Mind     → Nexus    → cognitive-profile.md         [Claude Code 1M]
Fase 5: Generate Agent      → Forge    → agent.md (Tier 2+)          [Claude Code]
Fase 6: Generate KBs        → Archive  → knowledge-base/*.md          [Claude Code]
Fase 7: Generate Tasks      → Assembly → tasks/*.md (Tier 3)          [Claude Code]
Fase 8: Assemble & Validate → Assembly → squad completa               [Claude Code]
```

**Mudança vs plano anterior:** Fases 3-4 (Chunk + Extract) foram unificadas em "Load & Extract" — com 1M de contexto não precisa chunkar.

### 3 Tiers de Clones
| Tier | Palavras | Output | Sessões |
|------|----------|--------|---------|
| 1 | 5-20K | KBs only (3-8 arquivos) | 1 |
| 2 | 30-100K | KBs + agente consultor | 1-2 |
| 3 | 80-200K+ | Agente completo + tasks + KBs | 2-3 |

---

## Sprint 2-6: Ver plano completo

O plano detalhado dos Sprints 2-6 está em:
- **Neste repo:** `.claude/plans/adaptive-munching-fern.md`
- **Memória do Claude:** `project_evolution_plan.md`

---

## Deploy Cross-Squad

| Tipo de KB gerado | Squad(s) destino |
|-------------------|-----------------|
| Content patterns | squad-content, squad-storytelling |
| Copy/headline patterns | squad-copy |
| Business strategy | squad-commercial, squad-council |
| Growth/marketing | squad-growth, squad-paidmedia |
| Brand voice | squad-brand |
| Product thinking | squad-product |
| Research methodology | squad-research |
| Design systems | squad-design |
| Security frameworks | squad-cybersecurity |
| Financial models | squad-finance |

---

## Referências Críticas

- `SQUAD-CREATION-STANDARDS.md` — padrão obrigatório para squads
- `.sinapse-ai/product/templates/personalized-agent-template.md` — template de agente
- `extracted-intelligence/` — extrações existentes (Marcelo, Matheus)
- Mega Brain: `github.com/thiagofinch/mega-brain` — JARVIS pipeline reference
- OpenClaw setup: `Second-Brain/notas/openclaw-setup-reconstrucao.md`

---

## Como Continuar em Outra Máquina

1. `git pull` no repo sinapse
2. Ler este arquivo (`CONTINUITY-PLAN.md`) para entender estado atual
3. Ativar `@sinapse-master` ou pedir ao Claude Code para ler o plano
4. Dizer: "Continue o plano de evolução do Sinapse, estou no Sprint X"
5. O Claude vai ler este arquivo + memórias e saber exatamente onde parou
6. Continuar de onde parou

---

## Visão do Projeto

O Sinapse será o **melhor time de squads de IA do mundo**:
- **Open-source** no GitHub para qualquer pessoa usar
- **16 squads** cobrindo todas as disciplinas de negócio digital
- **Clones cognitivos** de mentes reais com padrão de qualidade documentado
- **Dual-mode:** funciona standalone (sinapse-master) ou com SINAPSE
- **Para qualquer um:** construção de projetos, automação, marketing/sales/growth
- **Zero custo extra:** tudo roda no plano Max + ferramentas gratuitas (OpenClaw, Codex)
