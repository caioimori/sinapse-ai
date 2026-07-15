<!--
  Tradução: PT-BR
  Original: /docs/en/guides/project-status-feature.md
  Última sincronização: 2026-01-26
-->

# Funcionalidade de Status do Projeto - Guia do Usuário

> 🌐 [EN](../../guides/project-status-feature.md) | **PT**

---

**Funcionalidade:** Contexto Dinâmico de Status do Projeto para Ativação de Agentes
**Versão:** 1.0
**Story:** 6.1.2.4
**Criado:** 2025-01-14

---

## Visão Geral

A funcionalidade de Status do Projeto exibe automaticamente seu contexto de trabalho atual quando qualquer agente SINAPSE é ativado. Isso inclui:

- **Branch do Git** em que você está atualmente
- **Arquivos modificados** no seu diretório de trabalho
- **Commits recentes** (últimos 2)
- **Story/Epic atual** (se alguma story estiver InProgress)

Isso fornece contexto imediato sobre seu trabalho sem precisar executar manualmente `git status` ou procurar por stories ativas.

---

## Exemplo de Exibição

Quando você ativa um agente (`@developer` no Claude Code ou
`$sinapse-agent developer` no Codex), você verá:

```text
Pixel the Builder ready to innovate!

Current Project Status:
  - Branch: main
  - Modified: story-6.1.2.4.md, po.md
  - Recent: chore: cleanup Utils Registry, Phase 4: Open-Source Preparation

Type *help to see available commands!
```

---

## Configuração

### Pré-requisitos

- **Repositório Git** - Projeto deve ser inicializado com `git init`
- **Framework SINAPSE AI** instalado
- **Node.js 18+** com pacotes necessários

### Configuração Inicial

Nenhum comando de agente é necessário. Nas instalações atuais, `projectStatus`
fica habilitado em `.sinapse-ai/core-config.yaml` e carrega automaticamente na
ativação dos agentes. O loader detecta o repositório Git e mantém
`.sinapse/project-status.yaml` como cache de runtime.

**Configuração Manual Alternativa:**

Se você preferir configuração manual:

1. Edite `.sinapse-ai/core-config.yaml`:
   ```yaml
   projectStatus:
     enabled: true
     autoLoadOnAgentActivation: true
     showInGreeting: true
     cacheTimeSeconds: 60
   ```

2. Crie o diretório `.sinapse/`:
   ```bash
   mkdir .sinapse
   ```

3. Adicione ao `.gitignore`:
   ```gitignore
   .sinapse/project-status.yaml
   ```

---

## Configuração

### Opções Completas de Configuração

Localização: `.sinapse-ai/core-config.yaml`

```yaml
projectStatus:
  enabled: true                      # Habilitar/desabilitar funcionalidade
  autoLoadOnAgentActivation: true    # Carregar na ativação do agente
  showInGreeting: true               # Exibir no greeting
  cacheTimeSeconds: 60               # TTL do cache (segundos)
  components:                        # Alternar componentes individuais
    gitBranch: true                  # Mostrar nome da branch
    gitStatus: true                  # Mostrar arquivos modificados
    recentWork: true                 # Mostrar commits recentes
    currentEpic: true                # Mostrar epic atual
    currentStory: true               # Mostrar story atual
  statusFile: .sinapse/project-status.yaml  # Localização do arquivo de cache
  maxModifiedFiles: 5                # Limitar arquivos modificados exibidos
  maxRecentCommits: 2                # Limitar commits exibidos
```

### Exemplos de Personalização

**Mostrar apenas branch e story:**
```yaml
projectStatus:
  enabled: true
  components:
    gitBranch: true
    gitStatus: false      # Ocultar arquivos modificados
    recentWork: false     # Ocultar commits
    currentEpic: false
    currentStory: true
```

**Aumentar TTL do cache para 5 minutos:**
```yaml
projectStatus:
  cacheTimeSeconds: 300
```

**Mostrar mais commits e arquivos:**
```yaml
projectStatus:
  maxModifiedFiles: 10
  maxRecentCommits: 5
```

---

## Como Funciona

### Coleta de Status

Quando um agente é ativado, o sistema:

1. **Verifica cache** - Procura por `.sinapse/project-status.yaml`
2. **Valida TTL** - O cache tem menos de 60 segundos?
3. **Retorna em cache** - Se válido, usa status em cache (rápido)
4. **Gera novo** - Se expirado, executa comandos git e escaneia stories
5. **Atualiza cache** - Salva novo status para próxima ativação

### Comandos Git Utilizados

```bash
# Check if git repo
git rev-parse --is-inside-work-tree

# Get branch (modern git >= 2.22)
git branch --show-current

# Get branch (fallback for older git)
git rev-parse --abbrev-ref HEAD

# Get modified files
git status --porcelain

# Get recent commits
git log -2 --oneline --no-decorate
```

### Detecção de Story

Escaneia `docs/stories/` por arquivos contendo:
```markdown
**Status:** InProgress
**Story ID:** STORY-X.Y.Z
**Epic:** Epic X.Y - Name
```

Mostra apenas stories com status: `InProgress` ou `In Progress`.

---

## Performance

### Benchmarks

| Operação | Tempo | Notas |
|----------|-------|-------|
| **Primeira Carga** | 80-100ms | Executa comandos git + scan de arquivos |
| **Carga em Cache** | 5-10ms | Lê YAML do cache |
| **Cache Miss** | 80-100ms | TTL expirado, regenera |
| **Overhead do Agente** | <100ms | Adicionado ao tempo de ativação |

### Estratégia de Cache

- **TTL do Cache:** 60 segundos (configurável)
- **Localização do Cache:** `.sinapse/project-status.yaml`
- **Formato do Cache:** YAML com objeto de status + timestamp
- **Invalidação:** Automática após TTL expirar

**Por que 60 segundos?**
- Longo o suficiente para evitar chamadas git repetidas durante troca de agentes
- Curto o suficiente para refletir mudanças recentes
- Equilíbrio ótimo entre performance e atualidade

---

## Agentes Afetados

O SINAPSE inclui 172 agentes especializados em 17 squads. O status de projeto
é uma capacidade compartilhada do framework; a lista abaixo é o subconjunto
core de desenvolvimento, não o catálogo completo:

1. `developer` (Pixel)
2. `product-lead` (Axis)
3. `quality-gate` (Litmus)
4. `sprint-lead` (Sync)
5. `project-lead` (Beacon)
6. `architect` (Stratum)
7. `analyst` (Scope)
8. `devops` (Pipeline)
9. `data-engineer` (Tensor)
10. `ux-design-expert` (Mosaic)
11. `snps-orqx` (Imperator)

Ative esses IDs com `@agent-id` no Claude Code ou `$sinapse-agent agent-id` no
Codex; para roteamento principal no Codex, use `$snps`.

---

## Solução de Problemas

### Status Não Aparece

**Sintoma:** Agente ativa sem exibição de status

**Verificar:**
1. O `projectStatus.enabled: true` está no core-config.yaml?
2. Este é um repositório git? (`git rev-parse --is-inside-work-tree`)
3. O arquivo `.sinapse-ai/infrastructure/scripts/project-status-loader.js` existe?
4. Há erros na saída de ativação do agente?

**Solução:** Execute `npx sinapse-ai@latest doctor`, confirme as verificações
acima e reinicie a sessão do provider. O status recarrega automaticamente; não
existe task pointer público `init-project-status` no Codex.

### Dados de Status Desatualizados

**Sintoma:** Status mostra dados antigos

**Causa:** Cache não está invalidando corretamente

**Solução:**
```bash
# Manually clear cache
rm .sinapse/project-status.yaml

# Or restart agent session
```

### Comandos Git Falhando

**Sintoma:** Branch mostra "unknown", arquivos faltando

**Verificar:**
1. O git está no PATH? (`git --version`)
2. A versão do git é >= 2.0? (2.22+ recomendado)
3. Repositório corrompido? (`git fsck`)

**Fallback:** O sistema usa comandos git mais antigos automaticamente se comandos modernos falharem.

### Problemas de Performance

**Sintoma:** Ativação do agente > 200ms consistentemente

**Causa:** Repositório grande ou I/O de disco lento

**Solução:**
```yaml
# Reduce data collected
projectStatus:
  maxModifiedFiles: 3    # Default: 5
  maxRecentCommits: 1     # Default: 2
  components:
    recentWork: false     # Disable commits
```

### Projetos Sem Git

**Comportamento Esperado:**
```
Current Project Status:
  (Not a git repository)
```

Isso é normal e inofensivo. Agentes funcionam normalmente sem git.

---

## Uso Avançado

### Desabilitar para Agentes Específicos

Atualmente, o status é exibido em todos os agentes. Para desabilitar globalmente:

```yaml
projectStatus:
  enabled: false
```

*Nota: Desabilitar por agente ainda não implementado (veja Melhorias Futuras).*

### Localização Personalizada do Arquivo de Status

```yaml
projectStatus:
  statusFile: .custom/my-status.yaml
```

Não esqueça de atualizar o `.gitignore`.

### Acesso Programático

```javascript
const { loadProjectStatus, formatStatusDisplay } = require('./.sinapse-ai/infrastructure/scripts/project-status-loader.js');

// Get raw status object
const status = await loadProjectStatus();
console.log(status);

// Get formatted display string
const display = formatStatusDisplay(status);
console.log(display);

// Clear cache manually
const { clearCache } = require('./.sinapse-ai/infrastructure/scripts/project-status-loader.js');
await clearCache();
```

---

## Rollback

### Desabilitar Funcionalidade

1. **Editar config:**
   ```yaml
   projectStatus:
     enabled: false
   ```

2. **Limpar cache:**
   ```bash
   rm .sinapse/project-status.yaml
   ```

3. **Reiniciar agentes** - Novas ativações não mostrarão status

### Remoção Completa

Não apague scripts, testes ou tasks do framework. Desabilite a funcionalidade
em `.sinapse-ai/core-config.yaml` e remova somente o cache de runtime:

```bash
rm .sinapse/project-status.yaml
```

Defina `projectStatus.enabled: false`; os arquivos protegidos permanecem instalados.

---

## Compatibilidade de Versão do Git

### Recomendado: git >= 2.22

Usa comando moderno:
```bash
git branch --show-current
```

### Suportado: git >= 2.0

Fallback para:
```bash
git rev-parse --abbrev-ref HEAD
```

### Mínimo: git 2.0+

Versões mais antigas podem funcionar mas não são testadas.

**Verifique sua versão:**
```bash
git --version
```

---

## Melhorias Futuras

Melhorias potenciais (ainda não implementadas):

- [ ] Toggle de status por agente (ex: desabilitar apenas para @quality-gate)
- [ ] Indicadores de status coloridos (verde limpo, amarelo modificado, vermelho conflitos)
- [ ] Porcentagem de progresso da story (tarefas completadas / total)
- [ ] Tempo estimado para completar story atual
- [ ] Detecção de múltiplas stories (mostrar todas InProgress)
- [ ] Componentes de status personalizados via plugins
- [ ] Observação de arquivos em tempo real (remover delay do cache)

---

## FAQ

**P: Isso vai deixar a ativação do agente mais lenta?**
R: A carga inicial adiciona ~100ms. Cargas em cache adicionam ~10ms. Isso é mínimo e vale o benefício do contexto.

**P: Posso desabilitar para agentes específicos?**
R: Ainda não. Você pode desabilitar globalmente via `projectStatus.enabled: false`.

**P: E se eu não estiver usando git?**
R: O status mostra "(Not a git repository)" e os agentes funcionam normalmente.

**P: Com que frequência o status é atualizado?**
R: A cada 60 segundos por padrão (configurável via `cacheTimeSeconds`).

**P: Isso funciona no Windows/Linux/macOS?**
R: Sim, testado em todas as plataformas.

**P: Posso personalizar o formato do status?**
R: Ainda não. O formato é fixo em `project-status-loader.js:formatStatusDisplay()`.

**P: O cache é compartilhado entre agentes?**
R: Sim, todos os agentes usam o mesmo arquivo de cache (`.sinapse/project-status.yaml`).

---

## Documentação Relacionada

- **Story:** `docs/stories/sinapse migration/story-6.1.2.4-project-status-context.md`
- **Config:** `.sinapse-ai/core-config.yaml` (seção projectStatus)
- **Script:** `.sinapse-ai/infrastructure/scripts/project-status-loader.js`
- **Inicialização:** automática quando `projectStatus.enabled` está habilitado
- **Testes:** `.sinapse-ai/infrastructure/scripts/__tests__/project-status-loader.test.js`

---

**Versão:** 1.0
**Status:** Pronto para Produção
**Última Atualização:** 2025-01-14
