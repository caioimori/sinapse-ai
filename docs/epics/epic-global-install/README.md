# Épico: Instalação global + fim da duplicidade do framework

**Status:** In Progress
**Origem:** Briefing Caio 2026-07-05 — "framework global na minha máquina, sem duplicidade,
sempre na versão final; público continua no install por projeto".
**Autorização:** Caio, 2026-07-05. Aplicação na máquina + atualização de projetos = **gate
de confirmação**; publicação = gate "publica".
**Método:** doc-first + CLI First (Art. I). O recurso é genérico (serve qualquer usuário);
a aplicação na máquina do Caio é uma instância pessoal do recurso.

## Diagnóstico que motivou o épico (medido 2026-07-05)

Cópias do framework na máquina do Caio:

| Local | Versão | Ação |
|-------|--------|------|
| `sinapse-ai/.sinapse-ai` (fonte) | 1.21.0 | manter |
| `sinapse-plataform/.sinapse-ai` | 7.7.9 | atualizar (capstone) |
| `source-of-truth/.sinapse-ai` | 10.0.0-rc.5 | atualizar (capstone) |
| `coverage/.sinapse-ai` (~20 MB) | — | ✅ removido 2026-07-05 |
| `_archive/…broken-recovery/repo` (~340 MB) | — | ✅ removido (bundles preservados) |

A qualidade em toda sessão já vem de uma **camada global** em `~/.claude/` (197 agentes +
comandos SINAPSE + 31 regras + `sinapse-ai-config.yaml`). O mecanismo existe em embrião,
montado ad-hoc; falta torná-lo **de primeira classe, versionado, deduplicado e repetível**,
sem jamais sobrescrever a config **pessoal** do usuário (vault grounding, ds-routing, hooks
pessoais — ver `feedback_framework_vs_personal_config`).

## Princípio de fronteira (NON-NEGOTIABLE deste épico)

- **Público / produto:** install **por projeto** segue sendo o caminho recomendado e default.
- **Global:** recurso **opt-in avançado** — instala/atualiza a camada global framework-owned.
- **Config pessoal do usuário nunca é tocada** — o global é **aditivo e reconciliado**, com
  backup e dry-run. O que é "framework-owned" vs "personal-owned" é declarado por manifesto.

## Stories

| ID | Story | Tipo | Nota |
|----|-------|------|------|
| G1 | Manifesto do layer global (contrato framework-owned vs personal) | design/feature | fundação — define o que o global gerencia |
| G2 | `sinapse install --global` idempotente (dry-run, backup, reconciliação) | feature | CLI First |
| G3 | `doctor`: check de duplicidade/drift (cópias espalhadas + layer desatualizado) | feature | observabilidade |
| G4 | Docs: global como opção avançada; per-project segue default recomendado | docs | fronteira pública |
| G5 | Testes do install --global + reconciliação | test | qualidade |

Stories detalhadas serão redigidas em `docs/stories/global-install-g{N}-*.md` ao iniciar o
Bloco 2 (após o Bloco 1/Mesa), cada uma `Ready` antes de código.

## Capstone (gated — só após publicar a versão final)

1. Publicar a versão final (empacota Mesa + este recurso) — **gate "publica"**.
2. Rodar `sinapse install --global` na máquina do Caio → camada global na versão final.
3. Atualizar `sinapse-plataform` (7.7.9) e `source-of-truth` (10.0.0-rc.5) via `sinapse update`
   idempotente, verificando zero regressão em cada — **gate de confirmação por projeto**.
4. Validar: toda sessão nova nasce no nível máximo; zero duplicidade residual.

## Critério de pronto do épico

- Recurso `install --global` publicado, documentado e testado (parte genérica).
- Máquina do Caio: 1 camada global na versão final + 2 projetos atualizados + 0 lixo.
- `doctor` reporta 0 cópias órfãs/estale.

## Fora de escopo

- Sobrescrever qualquer config pessoal do `~/.claude/`.
- Mudar o default público (per-project permanece recomendado).
