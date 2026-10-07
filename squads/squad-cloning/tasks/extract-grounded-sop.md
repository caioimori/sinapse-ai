---
task: extract-grounded-sop
responsavel: "@sop-extractor"
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

# Extrair procedimento rastreável

## Objetivo

SOP com trigger, passos, veto, exceções, output, fontes e gaps.

## Entradas necessárias

conteúdo autorizado, objetivo, unidades/locators e contexto. Identificar owner, finalidade, janela e origem; dados ausentes permanecem gaps. Saída de modelo é rascunho a verificar.

## Procedimento

1. Confirmar o brief e a cobertura das evidências antes de calcular ou recomendar.
2. Identificar trigger e sequência no conteúdo; preservar vetos, exceções e contradições; distinguir declaração do autor de inferência; conferir cada passo contra locator.
3. Conferir o resultado contra dados e fontes, registrar limitações e produzir a saída indicada.
4. Entregar ao responsável pelo aceite; execução por outro domínio exige delegação explícita.

## Saída e aceite

SOP com trigger, passos, veto, exceções, output, fontes e gaps. Incluir localizadores, versões/datas relevantes, premissas, exceções, falhas e próximo passo.

## Veto e fronteira de autoridade

Repetição ou nome famoso não comprovam expertise; não completar passos faltantes nem copiar obra integral.  Nenhum pagamento, envio, remoção externa, transmissão, mudança de cadastro ou publicação é autorizado por este contrato.

## Verificação e freio

No máximo três passagens: verificar fonte/escopo, consistência da saída e caso negativo/veto. Se dados ou fontes essenciais faltarem, entregar gap explícito; não fechar com número ou claim inventado. Refinamento proporcional ao tamanho da tarefa.

## Referências e proveniência

- Definição canônica: `squads/squad-cloning/agents/sop-extractor.md`.
- Fonte para consulta atual: Fonte fornecida e autorizada pelo usuário, com locator e direitos.
- Contrato operacional próprio, escrito em 2026-10-02 para suprir arquivo ausente; referência não significa leitura integral nem promoção de expertise.
