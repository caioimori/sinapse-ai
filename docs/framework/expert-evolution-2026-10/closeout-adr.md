# ADR: contexto de projeto compartilhado com opt-in explícito

Status: aceito para implementação local em 2026-10-02.

Problema: o helper pessoal resolve a raiz HOME e omite os mecanismos privados da worktree. Um default de modelo Sol também não descreve a execução do Claude Code.

Decisão: manter a distribuição existente e adicionar uma extensão de nome único, com vínculo exato e verificável entre projeto e origem da evolução. Montagem determinística de contexto não concede execução/promoção de modelo. Mudanças usam precondições, backup, hashes e readback; acervo privado permanece na origem.

Alternativas rejeitadas: copiar acervo privado para HOME (exposição entre projetos); sobrescrever adapters ou checkout com 191 alterações (perda de trabalho concorrente); registrar Claude como Sol ou usar API Opus (proveniência falsa e escopo indevido); assumir que pool concede autoridade de tarefas (contratos incorretos).

Consequências: extensão depende da origem privada permanecer acessível e exige novo vínculo após mudanças relevantes. Descoberta e contexto são verificáveis localmente; inferência nativa e benefício causal dependem de avaliação separada. Material integral indisponível permanece gap.
