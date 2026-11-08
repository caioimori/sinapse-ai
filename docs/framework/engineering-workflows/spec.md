---
status: Ready
owner: project-lead
executor: developer
quality_gate: quality-gate
created: 2026-11-08
issue: https://github.com/caioimori/sinapse-ai/issues/424
---

# Workflows de engenharia: contrato de implementação

## Objetivo

Tornar os 275 workflows canônicos e os 10 aplicados da base de engenharia
consultáveis e utilizáveis no SINAPSE, com seleção proporcional, contexto sob
demanda e execução guiada retomável na sessão atual.

## Scope

- Catálogo dos 60 domínios, fontes públicas versionadas e integridade SHA-256.
- Busca explicável e consulta de um workflow por vez, preservando sua origem.
- Receitas SINAPSE para correção pequena, feature, arquitetura e incidente.
- Plano com motivo, entradas, etapas, saídas, limites e verificações pertinentes.
- Estado local, avanço com artefatos e detecção de alteração ao retomar.
- CLI adicional e skills equivalentes para Claude Code e Codex.
- Sem dependências, serviços, processos de modelo ou automações adicionais.

O executor coordena trabalho e registra evidências fornecidas pelo responsável.
Não interpreta diagramas como comandos nem atesta a correção semântica de um
artefato por sua existência ou hash. Dados importados são referência não confiável;
as regras do projeto e a autorização do usuário continuam superiores.

## Acceptance Criteria

1. **AC1 — Cobertura e origem:** contar os headings reais dos 275 canônicos e
   10 aplicados, identificar separadamente as quatro receitas originais e
   registrar revisão, URLs, licença, atribuição e hashes das fontes públicas.
2. **AC2 — Recuperação seletiva:** pesquisar por texto/domínio e recuperar
   somente o trecho do workflow escolhido; falhar claramente para ID, filtro,
   arquivo ou hash inválido. Nenhum carregamento integral da base no prompt.
3. **AC3 — Proporcionalidade:** justificar o caminho rápido, padrão ou profundo
   segundo sinais explícitos de tarefa e risco, sem obrigar story/PRD em ajustes
   simples. Preservar a interface advisory do seletor anterior.
4. **AC4 — Estado e evidência:** criar estado isolado por execução, recusar
   conflito de versão, traversal, links que escapam do projeto, artefatos vazios,
   deriva de plano/fonte/evidência e tentativa além dos limites. Falha, timeout e
   intervenção humana nunca equivalem a conclusão.
5. **AC5 — Autoridade:** não executar shell, LLM, publicação, migração, cobrança,
   envio a terceiros ou operação destrutiva. Encaminhar ações externas para
   o caminho oficial; registro de evidência não concede autorização.
6. **AC6 — Integração:** oferecer CLI de consulta e ciclo guiado, skills com o
   mesmo contrato nos dois providers e incluir os arquivos necessários no pacote.
7. **AC7 — Evidência honesta:** verificar os contratos alterados com casos
   positivos e negativos, registrar verificações ausentes e entregar branch/PR.
   Manter o checkout original e os caminhos protegidos intactos.

## Limites, risco e recuperação

Importação manual e limitada a hosts/fontes conhecidos; nenhuma consulta de rede
durante uso normal. Limites de tentativas e prazo definidos antes do início;
downloads com timeout, tamanho máximo e concorrência limitada.

Não alterar core, constituição, workflows legados, hooks ou CI. O principal risco
é confundir evidência registrada com aceite verificado; status e documentação
devem separar essas condições. Recuperação por descontinuação da nova CLI/skill
ou reversão do PR, preservando estados e artefatos do usuário.

## Validação prevista

Contagens e integridade das fontes, busca PT-BR, plano proporcional, estado e
retomada, limites, entradas inválidas, filesystem, concorrência e CLI. Testes
focados sem instalar dependências; sem build ou suíte completa com menos de
10 GB livres. Resultado observado fica no handoff e no PR.
