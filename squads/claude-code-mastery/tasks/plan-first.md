---
task: plan-first
responsavel: "@roadmap-sentinel"
responsavel_type: Agent
atomic_layer: Task
elicit: false
Entrada:
  - campo: brief_and_evidence
    tipo: object
    origem: "usuario e fontes autorizadas"
    obrigatorio: true
Saida:
  - campo: reviewed_artifact
    tipo: document
    destino: "orquestrador e responsavel pelo aceite"
Checklist:
  - "[ ] Delimitar outcome, janela, unidade e direitos"
  - "[ ] Rastrear afirmacoes e calculos a evidencia"
  - "[ ] Verificar veto, excecoes e gaps"
  - "[ ] Separar recomendacao de execucao externa"
---

# Planejar mudança no nível necessário

## Objetivo

Plano ou spec/tarefas verificáveis conforme escopo.

## Entradas necessárias

outcome, contexto, restrições e critérios de aceite. Identificar owner, finalidade, janela e origem; dados ausentes permanecem gaps. Saída de modelo é rascunho a verificar.

## Procedimento

1. Confirmar o brief e a cobertura das evidências antes de calcular ou recomendar.
2. Classificar P/M/G; elaborar plano mínimo proporcional; somente G usa envelope/spec/ADR; limitar revisão a três ciclos nesta execução.
3. Conferir o resultado contra dados e fontes, registrar limitações e produzir a saída indicada.
4. Entregar ao responsável pelo aceite; execução por outro domínio exige delegação explícita.

## Saída e aceite

Plano ou spec/tarefas verificáveis conforme escopo. Incluir localizadores, versões/datas relevantes, premissas, exceções, falhas e próximo passo.

## Veto e fronteira de autoridade

Não impor cerimônia a bug pequeno nem implementar domínio delegado sem autoridade.  Nenhum pagamento, envio, remoção externa, transmissão, mudança de cadastro ou publicação é autorizado por este contrato.

## Verificação e freio

No máximo três passagens: verificar fonte/escopo, consistência da saída e caso negativo/veto. Se dados ou fontes essenciais faltarem, entregar gap explícito; não fechar com número ou claim inventado. Refinamento proporcional ao tamanho da tarefa.

## Referências e proveniência

- Definição canônica: `squads/claude-code-mastery/agents/roadmap-sentinel.md`.
- Fonte para consulta atual: https://code.claude.com/docs/en/overview ; https://github.com/anthropics/claude-code/releases.
- Contrato operacional próprio, escrito em 2026-10-02 para suprir arquivo ausente; referência não significa leitura integral nem promoção de expertise.
