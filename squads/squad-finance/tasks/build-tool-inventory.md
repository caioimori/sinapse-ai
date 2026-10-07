---
task: build-tool-inventory
responsavel: "@cost-optimizer"
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

# Construir inventário de ferramentas

## Objetivo

Inventário com owner, finalidade, plano, uso, custo, prazo e evidência.

## Entradas necessárias

contratos, faturas, owners, acessos e datas de renovação. Identificar owner, finalidade, janela e origem; dados ausentes permanecem gaps. Saída de modelo é rascunho a verificar.

## Procedimento

1. Confirmar o brief e a cobertura das evidências antes de calcular ou recomendar.
2. Deduplicar produto/conta/contrato preservando versões e entidades; reconciliar custos, acessos e centro de custo.
3. Conferir o resultado contra dados e fontes, registrar limitações e produzir a saída indicada.
4. Entregar ao responsável pelo aceite; execução por outro domínio exige delegação explícita.

## Saída e aceite

Inventário com owner, finalidade, plano, uso, custo, prazo e evidência. Incluir localizadores, versões/datas relevantes, premissas, exceções, falhas e próximo passo. Moeda, competência, denominador, deduplicação e memória de cálculo são obrigatórios; fato, estimativa e decisão aprovada ficam separados.

## Veto e fronteira de autoridade

Não inventar owner/uso para fechar completude; dados desconhecidos ficam marcados.  Nenhum pagamento, envio, remoção externa, transmissão, mudança de cadastro ou publicação é autorizado por este contrato.

## Verificação e freio

No máximo três passagens: verificar fonte/escopo, consistência da saída e caso negativo/veto. Se dados ou fontes essenciais faltarem, entregar gap explícito; não fechar com número ou claim inventado. Refinamento proporcional ao tamanho da tarefa.

## Referências e proveniência

- Definição canônica: `squads/squad-finance/agents/cost-optimizer.md`.
- Fonte para consulta atual: https://www.finops.org/framework/.
- Contrato operacional próprio, escrito em 2026-10-02 para suprir arquivo ausente; referência não significa leitura integral nem promoção de expertise.
