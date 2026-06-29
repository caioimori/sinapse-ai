<!--
  Tradução: PT-BR
  Original: /docs/en/guides/service-discovery.md
  Última sincronização: 2026-01-26
-->

# Guia de Service Discovery SINAPSE

> 🌐 [EN](../../guides/service-discovery.md) | **PT**

---

> Como descobrir, consultar e usar workers no framework SINAPSE.

**Versão:** 2.1.0
**Última Atualização:** 2025-12-01

---

## Visão Geral

O sistema de Service Discovery permite encontrar e usar workers (tasks, templates, scripts, workflows) em todo o framework SINAPSE. O **Service Registry** é o catálogo central contendo metadados sobre todos os workers disponíveis.

### Conceitos Principais

| Conceito             | Descrição                                                                     |
| -------------------- | ----------------------------------------------------------------------------- |
| **Worker**           | Qualquer unidade executável: task, template, script, workflow                 |
| **Service Registry** | Catálogo central de todos os workers com metadados                            |
| **Category**         | Tipo de worker: `task`, `template`, `script`, `checklist`, `workflow`, `data` |
| **Tag**              | Rótulo pesquisável para agrupar workers                                       |

---

## API do Service Registry

### Carregando o Registry

```javascript
const { getRegistry, loadRegistry } = require('./.sinapse-ai/core/registry/registry-loader');

// Carregamento rápido (retorna dados do registry)
const registry = await loadRegistry();
console.log(`Carregados ${registry.totalWorkers} workers`);

// Loader completo com métodos
const reg = getRegistry();
await reg.load();
```

### Consultando Workers

#### Obter por ID

```javascript
const registry = getRegistry();
const worker = await registry.getById('create-story');

console.log(worker);
// {
//   id: 'create-story',
//   name: 'Create Story',
//   category: 'task',
//   path: '.sinapse-ai/development/tasks/po-create-story.md',
//   tags: ['task', 'creation', 'story', 'product'],
//   agents: ['po']
// }
```

#### Obter por Categoria

```javascript
// Obter todas as tasks
const tasks = await registry.getByCategory('task');
console.log(`Encontradas ${tasks.length} tasks`);

// Obter todos os templates
const templates = await registry.getByCategory('template');
```

#### Obter por Tag

```javascript
// Tag única
const devTasks = await registry.getByTag('development');

// Múltiplas tags (lógica AND)
const qaDevTasks = await registry.getByTags(['testing', 'development']);
```

#### Obter Workers para Agente

```javascript
// Obter todos os workers atribuídos ao agente dev
const devWorkers = await registry.getForAgent('dev');

// Obter workers para múltiplos agentes
const teamWorkers = await registry.getForAgents(['dev', 'qa']);
```

#### Pesquisar

```javascript
// Pesquisa de texto em nomes e descrições de workers
const results = await registry.search('validate', { maxResults: 10 });

// Pesquisar dentro de categoria
const taskResults = await registry.search('story', {
  category: 'task',
  maxResults: 5,
});
```

### Informações do Registry

```javascript
const registry = getRegistry();

// Obter metadados
const info = await registry.getInfo();
// { version: '1.0.0', generated: '2025-12-01', totalWorkers: 203 }

// Obter resumo de categorias
const categories = await registry.getCategories();
// { task: 115, template: 52, script: 55, ... }

// Obter todas as tags
const tags = await registry.getTags();
// ['task', 'creation', 'story', 'testing', ...]

// Contar workers
const count = await registry.count();
// 203
```

---

## Comandos CLI

### `sinapse workers search`

Pesquisar workers no registry.

```bash
# Pesquisar por texto
sinapse workers search "create story"

# Filtrar por categoria
sinapse workers search "story" --category=task

# Filtrar por tags (separadas por vírgula)
sinapse workers search "validation" --tags=schema,json

# Limitar resultados
sinapse workers search "story" --limit=5

# Saída em JSON
sinapse workers search "api" --format=json
```

**Saída:**

```
Encontrados 5 workers correspondendo a "create story":

  [task] po-create-story
         Path: .sinapse-ai/development/tasks/po-create-story.md
         Tags: task, creation, story, product
         Agents: po

  [task] dev-create-brownfield-story
         Path: .sinapse-ai/development/tasks/dev-create-brownfield-story.md
         Tags: task, creation, brownfield
         Agents: dev

  ...
```

### `sinapse info`

Obter informações detalhadas sobre um worker específico.

```bash
# Obter info do worker por ID
sinapse info create-story

# Obter info do worker com path completo
sinapse info --path .sinapse-ai/development/tasks/po-create-story.md
```

**Saída:**

```
Worker: create-story
========================
Nome:        Create Story
Categoria:   task
Path:        .sinapse-ai/development/tasks/po-create-story.md

Descrição:
  Cria uma nova user story a partir de template com formatação
  adequada e critérios de aceitação.

Entradas:
  - story-title (string, obrigatório)
  - epic-id (string, opcional)
  - priority (string, opcional)

Saídas:
  - story-file-path (string)

Tags:
  task, creation, story, product

Agentes:
  po

Performance:
  Duração Média: 1m
  Cacheável: Não
  Paralelizável: Não
```

### Listar workers por categoria

Use `sinapse workers search` com o filtro `--category` para restringir os resultados a um tipo de worker.

```bash
# Encontrar tasks
sinapse workers search "story" --category=task

# Encontrar templates
sinapse workers search "template" --category=template

# Limitar o número de resultados
sinapse workers search "story" --category=task --limit=20
```

---

## Tipos de Serviço

### Tasks

Definições de workflow executáveis para agentes.

```yaml
# Exemplo de estrutura de task
task:
  name: create-story
  version: 1.0.0
  description: 'Cria uma nova user story'

inputs:
  - name: story-title
    type: string
    required: true

outputs:
  - name: story-file-path
    type: string

steps:
  - name: gather-requirements
    action: elicit
  - name: generate-story
    action: template-render
```

**Localização:** `.sinapse-ai/development/tasks/`

### Templates

Templates de documento e código para geração.

| Template                   | Propósito                            |
| -------------------------- | ------------------------------------ |
| `story-tmpl.yaml`          | Template de documento de story       |
| `prd-tmpl.yaml`            | Template de PRD                      |
| `architecture-tmpl.yaml`   | Template de documento de arquitetura |
| `component-react-tmpl.tsx` | Template de componente React         |
| `ide-rules/*.md`           | Regras específicas por IDE           |

**Localização:** `.sinapse-ai/product/templates/`

### Scripts

Utilitários JavaScript para automação.

| Script                | Propósito                   |
| --------------------- | --------------------------- |
| `backup-manager.js`   | Operações de backup/restore |
| `template-engine.js`  | Processamento de templates  |
| `git-wrapper.js`      | Operações Git               |
| `security-checker.js` | Validação de segurança      |

**Localização:** `.sinapse-ai/infrastructure/scripts/`

### Workflows

Processos de desenvolvimento multi-etapas.

| Workflow                    | Caso de Uso                         |
| --------------------------- | ----------------------------------- |
| `greenfield-fullstack.yaml` | Novo projeto full-stack             |
| `brownfield-fullstack.yaml` | Aprimoramento de projeto existente  |
| `greenfield-service.yaml`   | Novo serviço backend                |
| `brownfield-ui.yaml`        | Aprimoramento de frontend existente |

**Localização:** `.sinapse-ai/development/workflows/`

### Checklists

Checklists de validação de qualidade.

| Checklist                | Propósito                   |
| ------------------------ | --------------------------- |
| `story-dod-checklist.md` | Definition of Done de story |
| `pre-push-checklist.md`  | Validação pré-push          |
| `architect-checklist.md` | Revisão de arquitetura      |
| `release-checklist.md`   | Validação de release        |

**Localização:** `.sinapse-ai/product/checklists/`

---

## Registro de Workers

### Registro Automático

Workers são automaticamente registrados quando o registry é construído:

```bash
# Reconstruir registry
node .sinapse-ai/core/registry/build-registry.js
```

O builder escaneia:

- `.sinapse-ai/development/tasks/**/*.md`
- `.sinapse-ai/product/templates/**/*`
- `.sinapse-ai/infrastructure/scripts/**/*.js`
- `.sinapse-ai/product/checklists/**/*.md`
- `.sinapse-ai/development/workflows/**/*.yaml`
- `.sinapse-ai/core/data/**/*`

### Schema de Entrada de Worker

```json
{
  "id": "create-story",
  "name": "Create Story",
  "description": "Cria uma nova user story a partir de template",
  "category": "task",
  "subcategory": "creation",
  "inputs": ["story-title", "epic-id"],
  "outputs": ["story-file-path"],
  "tags": ["task", "creation", "story", "product"],
  "path": ".sinapse-ai/development/tasks/po-create-story.md",
  "taskFormat": "TASK-FORMAT-V1",
  "executorTypes": ["Agent", "Worker"],
  "performance": {
    "avgDuration": "1m",
    "cacheable": false,
    "parallelizable": false
  },
  "agents": ["po"],
  "metadata": {
    "source": "development",
    "addedVersion": "1.0.0"
  }
}
```

---

## Cache

O registry loader implementa cache inteligente:

| Funcionalidade         | Descrição                               |
| ---------------------- | --------------------------------------- |
| **Cache TTL**          | Expiração padrão de 5 minutos           |
| **Lookups Indexados**  | O(1) por ID, categoria, tag             |
| **Carregamento Lazy**  | Registry carregado na primeira consulta |
| **Atualização Manual** | Forçar reload com `registry.load(true)` |

### Operações de Cache

```javascript
const registry = getRegistry();

// Forçar reload (ignorar cache)
await registry.load(true);

// Limpar cache
registry.clearCache();

// Verificar se está em cache
const isCached = registry.isCached();
```

---

## Exemplos de Código

### Encontrar Todas as Tasks para um Agente

```javascript
const { getRegistry } = require('./.sinapse-ai/core/registry/registry-loader');

async function getAgentTasks(agentId) {
  const registry = getRegistry();
  const tasks = await registry.getForAgent(agentId);

  return tasks.filter((w) => w.category === 'task');
}

// Uso
const devTasks = await getAgentTasks('dev');
console.log(`Agente dev tem ${devTasks.length} tasks`);
```

### Pesquisar e Executar Task

```javascript
const { getRegistry } = require('./.sinapse-ai/core/registry/registry-loader');
const { TaskExecutor } = require('./.sinapse-ai/development/scripts/task-executor');

async function findAndExecute(searchTerm, inputs) {
  const registry = getRegistry();
  const results = await registry.search(searchTerm, {
    category: 'task',
    maxResults: 1,
  });

  if (results.length === 0) {
    throw new Error(`Nenhuma task encontrada para: ${searchTerm}`);
  }

  const task = results[0];
  const executor = new TaskExecutor(task.path);
  return executor.execute(inputs);
}

// Uso
await findAndExecute('create story', {
  'story-title': 'Implementar autenticação de usuário',
  'epic-id': 'EPIC-001',
});
```

### Listar Workers por Categoria

```javascript
const { getRegistry } = require('./.sinapse-ai/core/registry/registry-loader');

async function listByCategory() {
  const registry = getRegistry();
  const categories = await registry.getCategories();

  for (const [category, count] of Object.entries(categories)) {
    console.log(`${category}: ${count} workers`);
  }
}

// Saída:
// task: 115 workers
// template: 52 workers
// script: 55 workers
// checklist: 11 workers
// workflow: 7 workers
// data: 3 workers
```

---

## Solução de Problemas

### Registry Não Carrega

```bash
# Verificar se o arquivo do registry existe
ls .sinapse-ai/core/registry/service-registry.json

# Reconstruir registry
node .sinapse-ai/core/registry/build-registry.js

# Validar registry
node .sinapse-ai/core/registry/validate-registry.js
```

### Worker Não Encontrado

1. Verifique se o arquivo do worker existe na localização esperada
2. Verifique se o arquivo tem frontmatter YAML adequado
3. Reconstrua o registry para incluir novos workers
4. Verifique categoria e tags na consulta de pesquisa

### Problemas de Performance

```javascript
// Verificar status do cache
const registry = getRegistry();
console.log('Em cache:', registry.isCached());

// Limpar cache se desatualizado
registry.clearCache();
await registry.load(true);
```

---

## Documentação Relacionada

- [Arquitetura do Sistema de Módulos](../architecture/module-system.md)
- [Guia de Quality Gates](./quality-gates.md)

---

_Guia de Service Discovery SINAPSE v4_

