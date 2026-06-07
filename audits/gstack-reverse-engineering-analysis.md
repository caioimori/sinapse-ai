# Engenharia Reversa & Análise Crítica — `garrytan/gstack`

> AuditFinding nível framework · gerado via plano de orquestração SINAPSE
> Alvo: https://github.com/garrytan/gstack · versão analisada: **1.56.1.0** · licença: **MIT**
> Método: clone raso + leitura de setup, bins, daemon de browser, telemetria e vetores de rede.

---

## Plano de Orquestração SINAPSE (como foi conduzido)

Imperator absorveu o briefing e delegou (Art. VIII — Mandatory Delegation). Por ser
análise read-only de repo de terceiro, a coordenação rodou em pipeline sequencial:

| Fase | Especialista | Entrega |
|------|-------------|---------|
| 1. Recon | @analyst (Scope) | Clone, mapa de 1086 arquivos, identidade do projeto |
| 2. Engenharia reversa | @architect (Stratum) | Arquitetura real (daemon, CLI, skills) vs. marketing |
| 3. Auditoria de segurança | @cyber-orqx (Fortress) | Vetores: exec remoto, cookies, telemetria, rede saída |
| 4. Veredito de produtividade | @project-lead (Beacon) | Cabe ou não no fluxo diário SINAPSE |
| 5. Síntese | Imperator | Este documento |

---

## 1. O que é (resposta direta)

**gstack = "Garry's Stack".** É um pacote open-source do **Garry Tan (CEO da Y Combinator)**
que transforma o **Claude Code** (e mais ~9 agentes de código: Codex, Cursor, OpenCode,
Factory etc.) numa "equipe de engenharia virtual". Concretamente são **duas coisas**:

1. **~23 skills de workflow em Markdown** (slash commands): `/office-hours`, `/review`,
   `/qa`, `/cso` (auditoria OWASP+STRIDE), `/ship`, `/autoplan`, `/plan-ceo-review` etc.
   São personas/processos — papéis de CEO, eng manager, designer, reviewer, QA, security
   officer, release engineer. **Isto é conceitualmente o mesmo que o SINAPSE faz** (agentes
   + tasks + gates), só que com filosofia diferente.

2. **Um browser headless rápido** (`/browse`) — a única parte "pesada" de código. É um
   daemon Chromium de vida longa controlado por um binário compilado em **Bun**
   (~58MB), falando CDP, com latência ~100-200ms por comando após o cold start.

Números do projeto: **58 SKILL.md, 69 scripts em `bin/`, ~1086 arquivos**, versão 1.56.x
(altíssima cadência de release). Autor verificável e público. Não é vaporware nem fork
suspeito — é o "software factory" pessoal do Garry, aberto sob MIT.

---

## 2. Como funciona (engenharia reversa)

### Instalação
```
git clone --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack
cd ~/.claude/skills/gstack && ./setup
```
- `./setup` (bash, `set -e`, `umask 077`) **compila o binário do browser com Bun** e
  **registra as skills** simlinkando para `~/.claude/skills/` (e `~/.codex/skills/`, etc.).
- **Não** mexe em `.bashrc/.zshrc/.profile`. **Não** instala cron/launchd/systemd.
- A única mutação sensível é em `~/.claude/settings.json` (hooks do `/plan-tune`) —
  e o próprio setup **faz backup `settings.json.bak.<ts>` antes** e documenta que
  "never mutate settings.json silently".

### Arquitetura do browser (a parte real de engenharia)
```
Claude Code → CLI (binário Bun) → HTTP 127.0.0.1:porta-aleatória → Bun.serve → CDP → Chromium headless
```
- Daemon persistente (cookies/abas/login sobrevivem entre comandos), idle-timeout 30min.
- State file `.gstack/browse.json` escrito atômico, **modo 0600**, com token UUID.
- Porta aleatória 10000-60000 (suporta múltiplos workspaces sem conflito).
- Auto-restart por hash de versão do binário.

### Modo "team" e auto-update
- `./setup --team` faz commit de `.claude/` + `CLAUDE.md` no SEU repo para forçar gstack
  nos colegas. Cada sessão roda um update-check throttle 1x/hora, silencioso, contra
  `raw.githubusercontent.com/garrytan/gstack/main/VERSION`.

---

## 3. É seguro instalar? — Auditoria

### ✅ Sinais positivos (verificados em código)
- **Sem `curl | bash` malicioso, sem `base64 -d` de payload, sem `/dev/tcp`, sem
  `eval` de conteúdo remoto.** O único `curl|bash` no repo é texto de instrução para
  instalar o Bun. Os `eval` em `bin/` apenas executam saída do script local `gstack-slug`
  (carregamento de variáveis) — padrão benigno.
- **Telemetria é OPT-IN, default `off`** (tiers `off|anonymous|community`). Só envia se
  você ligar explicitamente. Envia JSONL de uso para uma edge function Supabase.
- `umask 077`, arquivos 0600, backup antes de tocar config. Postura de segurança madura.
- MIT, autor público e reputado, código legível (sem ofuscação).

### ⚠️ Pontos de atenção legítimos (não são "malware", são poder real)
1. **Leitura/descriptografia de cookies do Chromium.** O `/browse` lê o SQLite de cookies
   do Chrome direto (keychain/safeStorage) para dirigir seu browser *já logado*. É o
   propósito da ferramenta (QA em apps autenticados), mas significa que a skill **tem
   acesso às suas sessões logadas**. Confie no nível de "seu próprio browser".
2. **Túnel ngrok (`pair-agent`).** Expõe o daemon à internet para pareamento remoto.
   É **opt-in** (só liga com `--tunnel/start`) e usa arquitetura de dois listeners com
   allowlist + token escopado. Não ligue se não precisar.
3. **Supabase hardcoded** (`frugpmstpnojnhfyimgv.supabase.co`) para telemetria/gbrain —
   inerte enquanto telemetria=off.
4. **Modo `--team` faz commit no seu repo** e impõe auto-update a partir do `main` do
   Garry. Isso é **execução de código de terceiro auto-atualizável** no seu fluxo — risco
   de supply-chain padrão de qualquer dependência viva. Aceitável se você confia no autor
   e fixa versão; evite `--team` em repo sensível sem revisar.
5. **Roda em `~/.claude/skills/`** — as skills entram no contexto do Claude Code e podem
   sugerir/rodar comandos. É o modelo de confiança normal de skills, mas é amplo.

### Veredito de segurança
**Seguro de instalar para uso pessoal/dev, com ressalvas.** Não há código malicioso. Os
riscos são os *inerentes* a (a) automação de browser logado e (b) um pacote vivo
auto-atualizável de terceiro. Recomendo:
- Instalar **sem `--team`** primeiro, testar isolado.
- Manter **telemetria off** (default) e **não** ativar o túnel ngrok.
- **Fixar a versão** (clonar uma tag, não `main` com auto-update) em máquina de trabalho.
- Tratar o `/browse` como tendo acesso às suas sessões de browser — não use com perfil
  Chrome que tenha logins críticos não-descartáveis.

---

## 4. Potencializa o teu trabalho diário? — Veredito honesto

**Contexto:** você já roda o **SINAPSE**, que cobre o MESMO espaço conceitual: papéis
(@developer, @quality-gate, @architect, @cyber-orqx...), gates, documentation-first,
delegação. gstack e SINAPSE são **filosoficamente concorrentes**, não complementares no
nível de "equipe de agentes".

| Eixo | gstack | SINAPSE (seu) |
|------|--------|---------------|
| Papéis/personas | 23 skills MD | agentes + squads |
| Governança | leve, "boil the lake" | constituição, L1-L4, gates NON-NEGOTIABLE |
| Browser automation | **forte** (daemon Bun+CDP, QA real) | não tem equivalente nativo |
| Filosofia | velocidade/volume (810× LOC) | qualidade-first, conservador |

**Onde gstack te potencializa de verdade:** a peça **`/browse` + `/qa`** (QA visual em
URL real, screenshots anotados, teste de fluxo logado). Isso é uma capacidade que o
SINAPSE **não tem** e que o `nsn-mode.md` já antecipa via "Chrome Brain". O browser daemon
do gstack é uma referência de arquitetura excelente para esse vetor.

**Onde NÃO adiciona:** as 23 skills de processo (review/plan/ship/cso) **duplicam** o que
seus agentes SINAPSE já fazem, com filosofia *menos* conservadora que a sua Constituição
(Art. XI). Adotar as duas em paralelo cria conflito de governança e ruído de contexto.

### Recomendação
1. **Não substitua o SINAPSE.** As camadas de orquestração colidem.
2. **Garimpe o `/browse`**: a arquitetura daemon-Chromium-CDP é o ativo único. Vale como
   referência para implementar capacidade de QA/browser no SINAPSE (alinhada ao Chrome
   Brain do `nsn-mode`).
3. **Estude `/cso`** (auditoria OWASP+STRIDE) e `/qa` como inspiração de tasks para o
   @cyber-orqx e @quality-gate — sem importar a stack inteira.
4. Se quiser testar de verdade: instale isolado (VM/perfil Chrome descartável), rode
   `/qa` numa URL de staging, e compare com o que seu fluxo já entrega.

**TL;DR:** É legítimo, bem-feito e seguro o suficiente para uso pessoal com as ressalvas
acima. Mas para *você*, que já tem SINAPSE, o ganho marginal está concentrado **na
automação de browser** — não na camada de "equipe de agentes", que você já tem mais
rigorosa. Garimpe a peça de browser; não adote o stack inteiro.
