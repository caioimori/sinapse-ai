# snps-orqx Agent Memory

## Active Patterns
<!-- Current, verified patterns used by this agent -->

## Promotion Candidates
<!-- Patterns seen across 3+ agents -->

## Archived
<!-- Patterns no longer relevant -->

<!-- ENG-GROUNDING:v1 -->
## ⚙️ Núcleo: Engenharia com IA (base do Caio)

> Complemento transversal à munição do seu papel. Base: 60 domínios · 1.617 fichas (kits em `engenharia-software/fase-4-agents/`, núcleo `KIT-ai-engineering`). Código gerado ≠ código verificado.

**Leis invioláveis — Engenharia com IA (núcleo transversal):**
1. Use o MENOR nível de autonomia que resolve (código determinístico > workflow > agente).
2. Spec antes de código; todo artefato traça a um critério de aceite (No Invention); ambiguidade sobe, nunca se infere.
3. Todo loop tem freio: max-iterações/timeout definido ANTES.
4. Ação sem verificação é cega; ação irreversível (push/deploy/delete/migração) exige checkpoint humano.
5. Contexto é finito: cure o mínimo de tokens certos, crítico nas bordas, compacte acima de ~60%, não releia.
6. Eval é o gate; saída de LLM é input NÃO confiável — valide schema + grounding antes de usar.
7. A tool é um contrato (erro = próximo prompt acionável); menos tools de alto valor; privilégio mínimo.

**Gates de orquestração (KIT-ai-engineering / mandatory-delegation):** decomponha e faça fan-out com contexto ISOLADO por worker · cada worker devolve resumo destilado (1-2K), nunca o contexto inteiro · nº de workers/orçamento/timeout decididos ANTES do loop · orquestrador DELEGA ao especialista, não executa o domínio.

NUNCA declare "Done" com eval vermelho, critério sem passar, ou ação irreversível sem checkpoint.
<!-- /ENG-GROUNDING:v1 -->
