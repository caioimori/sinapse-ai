# Aprendizado de mercado para qualidade dos agentes

Escopo: `market-learning-only`. Leitura registrada em **2026-10-02 17:05:07 UTC**, pelo relógio após a consulta das fontes. Mecanismos **propostos**; nenhuma implementação, inferência Anthropic, ativação de provider ou comparação faturada nesta frente.

**Recomendação:** priorizar critérios executáveis de UI, briefs por tarefa e recuperação de evidências. A pesquisa oferece hipóteses para os contratos existentes; a transferência precisa de revisão independente e validação local.

## O que foi observado

A publicação oficial de **Opus 5.5** está datada de **22/09/2026**. Melhorias de eficiência, comunicação, código e aparência são afirmações do fornecedor; não demonstram superioridade no nosso framework nem acesso na conta. [Anúncio oficial](https://www.anthropic.com/claude-opus-5-5).

A orientação antiga de agentes aponta para a abordagem de abril de 2026. Extraímos contratos estáveis e registros duráveis; adotar o serviço gerenciado fica fora deste escopo. [Artigo atual](https://www.anthropic.com/engineering/managed-agents).

O artigo do `think tool` contém atualização de **15/12/2025** que prefere o recurso nativo de raciocínio na maioria dos casos. Mantemos a checagem de decisões sequenciais como hipótese, sem instalar essa ferramenta nem inferir recursos em outros fornecedores. [Atualização oficial](https://www.anthropic.com/engineering/claude-think-tool).

## Mecanismos transferíveis

Todos os critérios abaixo estão **não executados nesta frente**. Condições, contraindicações, alvos e checks completos estão no [registro estruturado](market-model-learning.json).

| ID / alvo existente | Aplicar quando | Evitar | Aceitação proposta / fonte |
|---|---|---|---|
| ML-01 · `dx-ui-designer`, `dx-frontend-engineer` | Brief define tarefa, marca e escolhas visuais. | Trocar fontes úteis somente pela novidade. | Decisões remetem ao brief e ação principal identificável em 1440/390px. [Dimensões visuais](https://platform.claude.com/cookbook/coding-prompting-for-frontend-aesthetics). |
| ML-02 · `motion-choreographer`, `animation-performance-engineer` | Movimento informa estado, prioridade ou feedback. | Atrasar a tarefa; aprovar Reel por frames. | Trigger e interrupção definidos; modo reduzido utilizável; sequência contínua revisada. [Motion no brief](https://platform.claude.com/cookbook/coding-prompting-for-frontend-aesthetics). |
| ML-03 · `dx-frontend-engineer`, `dx-accessibility-specialist` | Mudança altera UI ou navegação. | Concluir pelo build ou screenshot inicial. | Jornada e estados em desktop/mobile; zero overflow; foco visível; persistência verificada quando aplicável. [Verificação](https://code.claude.com/docs/en/best-practices), [fluxo real](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents). |
| ML-04 · `research-orqx`, `design-orqx` | Biblioteca excede o necessário para a tarefa. | Carregar o acervo inteiro ou chamar metadado de fluxo observado. | Fonte e locator em cada regra; orçamento de contexto respeitado; fatos separados de hipótese. [Recuperação por referência](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents). |
| ML-05 · `design-orqx`, `animations-orqx`, `content-orqx` | Há responsabilidades independentes. | Dividir o mesmo arquivo sem ownership ou delegar cálculo simples. | Owner, entrega, dependências e freio explícitos; zero alterações fora do escopo sem coordenação. [Orquestração](https://www.anthropic.com/engineering/building-effective-agents). |
| ML-06 · `design-orqx`, `research-orqx` | Comparar entregáveis e comportamento. | Autoavaliação única ou ganho estatístico por um caso. | Checks críticos passam; revisão independente; preferência estética separada da função; casos reservados preservados. [Avaliação de resultado](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents). |
| ML-07 · `design-orqx`, `animations-orqx` | Entrega atravessa sessões. | Criar cerimônia para ajuste pequeno ou reduzir critérios para aprovar. | Próxima etapa recuperável; status concluído exige receipt; critérios preservados. [Progresso incremental](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents). |
| ML-08 · `research-orqx`, `design-orqx` | Modelo ou ferramenta muda, evidência precisa sobreviver. | Migrar infraestrutura por imitação. | Contratos e receipts preservados; falha não apaga evidência; tentativa paga incerta não repete. [Interfaces e sessão durável](https://www.anthropic.com/engineering/managed-agents). |
| ML-09 · `research-orqx`, `design-orqx` | Observação nova muda ação dependente. | `think tool` legado, cadeia de pensamento ou pausas em tarefas simples. | Decisão remete à evidência atual; lacuna material gera escalonamento; loop limitado. [Limites e atualização](https://www.anthropic.com/engineering/claude-think-tool). |

## Limites e aplicação

Foram consultadas **nove fontes oficiais**. Elas sustentam a existência da orientação e dos anúncios; pertencem ao mesmo fornecedor e não constituem validação independente das alegações de desempenho.

A documentação de boas práticas não apresenta uma data editorial explícita na leitura; o JSON registra `publishedAt: null`. Os artigos mantêm suas datas publicadas e notas de atualização observadas.

Nenhum fluxo Mobbin foi observado nesta frente. A aquisição pelo navegador deve registrar telas, ações e estados, separar observação de transferência e aplicar os critérios ao contexto SINAPSE.

Vídeo e áudio precisam de avaliação própria. Saber ordenar animações de UI não comprova ritmo, som, edição ou qualidade final de Reels.

## Verificação do artefato

**PASS:** parse JSON, IDs únicos, 17 referências de fonte resolvidas, nove fontes em domínios oficiais, 21 referências de alvo existentes e nove mecanismos completos.

Os 36 checks de aceitação permanecem propostos e não executados. A verificação acima valida a estrutura documental; não demonstra implementação ou ganho de qualidade.
