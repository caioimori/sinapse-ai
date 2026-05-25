# Auditoria framework SINAPSE-AI, gargalos e disfuncoes

**Data:** 2026-05-25
**Versao auditada:** v1.5.0
**Auditor:** subagent geral (Opus 4.7)
**Escopo:** repo `sinapse-ai`, instalacao `~/.sinapse/`, configs `~/.claude/`, hooks, rules, commands

## Resumo executivo

Auditoria mapeou 14 bugs alem do BUG-001 ja em fix. Os achados criticos sao estruturais: (1) a persona "Imperator" do sinapse-orqx existe apenas no repo canonico do framework (nao instalada em `~/.sinapse/sinapse/agents/`), entao o stub local em `~/.claude/agents/sinapse-orqx.md` aponta pra arquivo inexistente, (2) o stub do sinapse-orqx nao tem o bloco "Activation Instructions" + "How to Execute Tasks" que os outros 21 stubs tem (drift de geracao), (3) faltam todos os commands SNPS (`.claude/commands/SNPS/` ausente), e (4) o command slash `/SINAPSE:agents:sinapse-orqx` nao existe (so existem os 21 squad-orqx + snps-orqx). Soma-se a isso ruido de rules redundantes/deprecated, varios pequenos drifts entre stubs e canonicos, e duas inconsistencias entre vault-routing e o vault real. A boa noticia: hooks v3 fusion funcionam, tasks/workflows tem boa coerencia, e 3 stories sinalizadas "Ready" na memory ja estao "Done".

## Bugs por severidade

### P0, Critico (bloqueia uso normal)

#### BUG-002, Persona Imperator nao instalada em `~/.sinapse/`
- **Sintoma:** invocar `sinapse-orqx` ativa stub que tenta ler `~/.sinapse/sinapse/agents/sinapse-orqx.md` mas o arquivo nao existe. So existe `snps-orqx.md` la. Imperator "fantasma".
- **Root cause:** o canonical em `.sinapse-ai/development/agents/` e o do repo `sinapse/agents/` nao foi copiado pra instalacao local `~/.sinapse/sinapse/agents/`. O installer pulou esse arquivo OU ele nunca existiu no canonical do repo.
- **Arquivos afetados:**
  - `C:/Users/Caio Imori/.claude/agents/sinapse-orqx.md` (stub)
  - `C:/Users/Caio Imori/.sinapse/sinapse/agents/` (so tem snps-orqx.md)
  - Repo: `Workspace/sinapse/sinapse-ai/.sinapse-ai/development/agents/snps-orqx.md` existe, mas o "Imperator master" da SINAPSE deveria estar em outro path
- **Fix sugerido:** localizar a persona Imperator no repo (provavel em `sinapse/agents/sinapse-orqx.md` no source), instalar em `~/.sinapse/sinapse/agents/sinapse-orqx.md`. Validar installer pra evitar regressao
- **Esforco:** S

#### BUG-003, Stub do sinapse-orqx desincronizado dos demais
- **Sintoma:** stub `~/.claude/agents/sinapse-orqx.md` tem 15 linhas; `snps-orqx.md` tem 39 linhas com bloco "Activation Instructions" + "How to Execute Tasks" + "Cross-Squad Handoff" completo. tools-orqx tem 45 linhas. Imperator stub nao tem esses blocos
- **Root cause:** algum gerador de stubs nao processou sinapse-orqx (ou foi sobrescrito por versao antiga)
- **Arquivos afetados:** `~/.claude/agents/sinapse-orqx.md`, mais 18 outros stubs de 15 linhas (animations, brand, claude, cloning, commercial, content, copy, council, courses, cyber, design, finance, growth, paidmedia, product, research, storytelling, swarm). Tres stubs ja foram regenerados (artdir, snps, tools)
- **Fix sugerido:** rodar gerador de stubs pra regerar TODOS os 22 (idealmente 23 com Imperator) num formato unico
- **Esforco:** S

#### BUG-004, Commands `/SNPS:agents:*` ausentes
- **Sintoma:** existe `.claude/commands/SINAPSE/agents/` com 21 commands mas nao existe `.claude/commands/SNPS/` na instalacao local
- **Root cause:** Codex parity / SNPS parity nunca foi propagado pra `~/.claude/commands/`. Existe no repo canonico (`.claude/commands/SNPS/agents/` no sinapse-ai)
- **Arquivos afetados:** ausencia em `~/.claude/commands/SNPS/`
- **Fix sugerido:** propagar via installer; ou copiar do repo
- **Esforco:** S

#### BUG-005, Command slash `/SINAPSE:agents:sinapse-orqx` inexistente
- **Sintoma:** dos 21 commands em `~/.claude/commands/SINAPSE/agents/`, nao existe `sinapse-orqx.md`. Imperator nao tem rota slash, so invocacao por nome de agent
- **Root cause:** consistente com BUG-002 + BUG-003: Imperator nao foi gerado/instalado
- **Arquivos afetados:** ausencia em `~/.claude/commands/SINAPSE/agents/sinapse-orqx.md`
- **Fix sugerido:** gerar command slash apontando pro stub Imperator (apos fix BUG-002)
- **Esforco:** S

### P1, Alto (degrada experiencia mas tem workaround)

#### BUG-006, Rule `n8n-squad-routing.md` contradiz a si mesma
- **Sintoma:** linha 3 diz "NAO faz parte do framework SINAPSE-AI (nao esta em `~/.sinapse/`). So existe na maquina do Caio". Linha 5 diz "Imperator (sinapse-orqx) DEVE delegar pra `@n8n-orqx`". Se a squad nao esta no framework, como Imperator (uma persona do framework) sabe routear? E ambigua: e local OR e do framework?
- **Arquivos afetados:** `~/.claude/rules/n8n-squad-routing.md`
- **Fix sugerido:** decidir oficialmente se n8n eh squad oficial (mover pra `~/.sinapse/squad-n8n/`) ou e extension local (manter mas remover comando @sinapse-orqx routing dessa rule)
- **Esforco:** M

#### BUG-007, Rule `documentation-first.md` vs `mandatory-delegation.md` vs CLAUDE.md, ativacao opt-in confusa
- **Sintoma:** CLAUDE.md global diz "Opt-In Rules (Projetos Grandes Apenas)" listando documentation-first, mandatory-delegation, workflow-execution. Mas a propria rule `documentation-first.md` linha 1 ainda diz "Documentation-First Development". Os triggers sao path-based + keyword-based + explicit. PRECISA INVESTIGAR: na pratica os hooks aplicam? Tem um hook que faz check de path? Nao parece estar registrado no settings.json
- **Arquivos afetados:** `~/.claude/rules/{documentation-first,mandatory-delegation,workflow-execution}.md`, `~/.claude/CLAUDE.md`
- **Fix sugerido:** ou implementar hook que filtra rule injection por path/keyword, ou simplificar deixando como sempre-ativo
- **Esforco:** M

#### BUG-008, Rules deprecated nao removidas
- **Sintoma:** `sinapse-source-of-truth.md` esta marcado como DEPRECATED (5 linhas, stub) mas ainda existe. `response-format.md` virou stub de retro-compatibilidade. Ambos consomem espaco no contexto via inclusao automatica das rules
- **Arquivos afetados:** `~/.claude/rules/sinapse-source-of-truth.md`, `~/.claude/rules/response-format.md`
- **Fix sugerido:** mover pra `~/.claude/rules/_deprecated/` ou remover de vez se nada referencia. Auditar se algum agent ainda referencia
- **Esforco:** S

#### BUG-009, Memory CLAUDE.md "27.5KB excedeu limite 24.4KB"
- **Sintoma:** o proprio system reminder mostra warning: "MEMORY.md is 27.5KB (limit: 24.4KB), index entries are too long. Only part of it was loaded". O resto eh truncado e perde contexto
- **Arquivos afetados:** `C:/Users/Caio Imori/.claude/projects/C--WINDOWS-system32/memory/MEMORY.md`
- **Fix sugerido:** auditar entradas, encurtar pra <200 chars por linha, mover detalhe pra topic files
- **Esforco:** M

#### BUG-010, vault-routing.json domain `caioimori` aponta pra notas que podem nao existir
- **Sintoma:** routing tem `caioimori-pages`, `caioimori-design-system`, `caioimori-carrosseis`, `caioimori-pesquisas` mas o caminho `caio-imori/carrosseis-lab` (que existe) aponta pro domain `mindloop`. PRECISA INVESTIGAR: e proposital ou ruido? E `notas/design-system-caioimori.md` existe?
- **Arquivos afetados:** `~/.claude/vault-routing.json`
- **Fix sugerido:** validar todas as notas referenciadas existem; se nao, criar stub ou corrigir routing
- **Esforco:** S

### P2, Medio (cosmetico/refactor)

#### BUG-011, Backup `.backup-stubs-20260512-120825/` ainda em `~/.claude/agents/`
- **Sintoma:** pasta de backup de 13 dias ainda no diretorio ativo de agents. Pode causar confusao em listagens, audits, ou se Claude Code ler agents recursivo
- **Arquivos afetados:** `~/.claude/agents/.backup-stubs-20260512-120825/` (18 arquivos)
- **Fix sugerido:** mover pra `~/.claude/backups/` ou deletar se nao precisar mais
- **Esforco:** S

#### BUG-012, Drift entre `~/.claude/agents/n8n/` e `~/.sinapse/`
- **Sintoma:** squad n8n existe em `~/.claude/agents/n8n/` (16 arquivos) mas NAO existe em `~/.sinapse/squad-n8n/`. Rule diz isso explicitamente, mas todos os outros squads vivem no padrao oposto (canonical em `~/.sinapse/`, stubs em `~/.claude/`). N8N e excecao arquitetural
- **Arquivos afetados:** estrutura geral
- **Fix sugerido:** consolidar n8n na mesma arquitetura dos outros (mover canonical pra `~/.sinapse/squad-n8n/` e deixar stubs em `~/.claude/agents/`)
- **Esforco:** L

#### BUG-013, Hooks duplicados entre repo e instalacao
- **Sintoma:** `Workspace/sinapse/sinapse-ai/.claude/hooks/` tem 18 hooks (enforce-architecture-first, enforce-delegation, enforce-nsn-guard, enforce-story-gate, secret-scanning, etc). `~/.claude/hooks/` tem 18 hooks completamente diferentes (vault-grounding, ds-anti-pattern-guard, unified-grounding, etc). Zero overlap. PRECISA INVESTIGAR: e proposital (repo hooks rodam quando no repo, global hooks sempre) ou tem hooks faltando em um dos lugares?
- **Arquivos afetados:** `.claude/hooks/` em ambos locais
- **Fix sugerido:** documentar arquitetura claramente OU consolidar
- **Esforco:** M

#### BUG-014, `higgsfield-studio` agents em `~/.claude/agents/` mas nao em `~/.sinapse/`
- **Sintoma:** mesmo padrao do BUG-012. Squad HiggsfieldStudio (14 agents) vive so em `~/.claude/agents/higgsfield-studio/`. Sem canonical em `~/.sinapse/squad-higgsfield/`
- **Arquivos afetados:** estrutura geral
- **Fix sugerido:** mesma arquitetura dos squads oficiais
- **Esforco:** L

#### BUG-015, Stories Ready mencionadas na memory ja estao Done
- **Sintoma:** memory cita "10.35, 10.38, 10.39, 10.40, 10.41, 10.42" como Ready. Realidade: docs/stories so tem 3 arquivos visiveis (10.38, 10.46, 10.47) todos com status "Done" no frontmatter. Drift entre memory e realidade
- **Arquivos afetados:** memory entries
- **Fix sugerido:** atualizar memory; talvez stories foram arquivadas em pasta nao escaneada
- **Esforco:** S

### P3, Baixo (nice-to-have)

#### BUG-016, Skills `Marketing Skills`, `Cro Skills` etc com espaco no nome
- **Sintoma:** pastas em `~/.claude/skills/` usam espacos: "Creative Skills", "Cro Skills", "Facebook Ads Skills", "Google Ads Skills", "Marketing Skills", "Measurement Skills", "Social Media Ads Skills", "Strategy Skills". Espacos quebram CLI/scripts em varios contextos
- **Arquivos afetados:** `~/.claude/skills/*/`
- **Fix sugerido:** renomear pra kebab-case
- **Esforco:** S

## Categorias auditadas

- **A. Contradicoes personas/rules:** 3 contradicoes encontradas (BUG-006, BUG-007, BUG-008). Aceitavel; nao critico
- **B. Stubs vs canonicos:** 19 dos 22 stubs orqx estao em formato curto (15 linhas) vs 3 em formato longo (39-45 linhas), incluindo o sinapse-orqx critico. BUG-002 + BUG-003 + BUG-004 + BUG-005
- **C. Hooks:** 17 hooks .cjs em `~/.claude/hooks/`, todos com `require`/`module.exports` ou funcao main. unified-grounding.cjs (fusion v3 23/05) usa modulos dos 4 hooks legados, funcional. settings.json registra: unified-grounding, session-capture, auto-checkpoint, workspace-routing, vault-project-register, ds-anti-pattern-guard, build-best-practices, chrome-ensure, chrome-brain-log. NAO registrados (orfaos): code-intel-pretool, healthcheck, repair, precompact-session-digest, synapse-engine. Status: parcialmente saudavel
- **D. Configs com entradas mortas:** ds-routing.json route "sinapse-mentoria" aponta pra pasta que admite nao existir ("sera criada"). br_cartography_fallback aponta pra `Workspace/caio-imori/ds-cartography` PRECISA INVESTIGAR se existe. vault-routing mapeamento `caio-imori/carrosseis-lab → mindloop` parece intencional mas confunde. Resto saudavel
- **E. Workflows referenciando tasks/agents:** 15 workflows YAML em `.sinapse-ai/development/workflows/`. Nao validei cada `task_ref` individualmente (fora do escopo de tempo), mas tasks dir tem 200+ arquivos. PRECISA INVESTIGAR amostragem cruzada
- **F. Squads undersized:** todos os 17 squad-* em `~/.sinapse/` tem agents/. NAO confirmei se algum `*-orqx.md` canonico tem <100 linhas (so chequei stubs). Memory mencionou "4 orqx undersized" mas nao consegui mapear quais
- **G. Documentacao quebrada:** docs/ no repo tem 28+ subpastas. Audits anteriores em audits/ (5 arquivos). Existe `check-docs-links.md` como task. PRECISA INVESTIGAR rodada atual de broken links
- **H. 6 stories Ready:** so 3 stories visiveis em docs/stories, todas "Done". BUG-015
- **I. Commands SINAPSE vs SNPS:** SNPS commands AUSENTES (BUG-004). SINAPSE tem 21 (faltando sinapse-orqx, BUG-005)
- **J. Installer/postinstall:** nao auditei codigo do installer por limite de tempo, mas o sintoma BUG-002 (Imperator nao instalado) sugere installer com bug ou geracao incompleta
- **K. Plugins/MCPs:** enabledPlugins so tem `claude-mem@thedotmack`. settings.json registra matchers MCP pra chrome-devtools, dev-browser, claude-in-chrome com hook `chrome-ensure`. OAuth Higgsfield MCP pendente (memory ja registra). MCP n8n mencionado como "quando configurado com VPS", nao validei

## Nao auditado / fora do escopo

- Codigo do installer (`packages/installer/`, `bin/commands/install.js`), por tempo
- Validacao cruzada task_refs em workflows (15 YAMLs x 200+ tasks)
- Health check completo dos 17 squads canonicos (so amostrei brand, claude, cybersecurity, product, research)
- Performance dos hooks (latencia real do unified-grounding em prompts grandes)
- Conteudo das 24 skills em `~/.claude/skills/` (so listei)
- Codex parity (`.codex/agents/` no repo) por tempo
- Tasks individuais sob `~/.sinapse/sinapse/tasks/` (mostradas 7, nao li conteudo)

## Proximas ondas sugeridas

**Onda 1 (P0, desbloqueio imediato):** BUG-001 (em fix) + BUG-002 (instalar Imperator) + BUG-003 (regenerar 19 stubs) + BUG-005 (gerar slash command). Tudo S, mesmo PR. Resolve 100% da fricção "Imperator nao dispara".

**Onda 2 (P1, qualidade de uso):** BUG-004 (propagar SNPS commands) + BUG-006 (decidir n8n oficial vs extension) + BUG-009 (encurtar MEMORY.md). Foco em saneamento.

**Onda 3 (P1 + P2, arquitetura):** BUG-007 (implementar trigger opt-in pra rules ou simplificar) + BUG-008 (mover deprecated) + BUG-010 (validar vault-routing) + BUG-012 + BUG-014 (consolidar n8n + higgsfield na arquitetura padrao).

**Onda 4 (P2-P3, polish):** BUG-011 (backup) + BUG-013 (documentar arquitetura hooks) + BUG-015 (sync memory com realidade stories) + BUG-016 (rename skills).

**Investigar antes de fixar:** BUG-007 (trigger opt-in funciona?), BUG-010 (notas existem?), BUG-013 (proposital?), categoria E (task refs), categoria F (undersized orqx).
