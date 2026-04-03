---
name: Proposta de Squad
about: Propor um novo Squad para o ecossistema SINAPSE-AI
title: '[Squad] '
labels: ['squad-proposal']
assignees: ''
---

## Proposta de Squad

### Informacoes do Squad

- **Nome do Squad:** (ex: `meu-dominio-squad`)
- **Titulo Curto:** (ex: "Meu Dominio Squad - Equipe de IA Especializada")
- **Versao:** 1.0.0
- **Autor:** (Seu nome/organizacao)

### Descricao

Uma descricao clara e concisa do que este Squad faz e qual dominio ele cobre.

> Squads do SINAPSE-AI sao equipes modulares de agentes de IA que trabalham juntos para realizar tarefas especializadas.

### Proposito

Qual problema este squad resolve? Qual dominio ou caso de uso ele endereca?

### Estrutura Proposta

**Agentes:** (Liste os agentes propostos neste squad)

- `@agente-1` - Proposito e expertise
- `@agente-2` - Proposito e expertise

**Tasks:** (Liste as tasks propostas)

- `*task-1` - Proposito do workflow
- `*task-2` - Proposito do workflow

**Templates:** (Liste os templates propostos)

- `template-1-tmpl.yaml` - Proposito

**Checklists:** (Liste os checklists propostos)

- `checklist-1-checklist.md` - Proposito

### Pontos de Integracao

Como este squad se integra com:

- Core do SINAPSE-AI (sinapse-ai)?
- Outros squads existentes?
- Servicos/APIs externos?

### Casos de Uso

Forneca 2-3 casos de uso concretos:

1. Caso de uso 1
2. Caso de uso 2
3. Caso de uso 3

### Exemplo de Workflow

```bash
# Exemplo de como usuarios usariam este squad
@meu-dominio-squad:agente-1
*task-1 --option valor
```

### Dependencias

- **Core Framework:** Versao minima do sinapse-ai necessaria?
- **Outros Squads:** Alguma dependencia de outros Squads do SINAPSE?
- **Servicos Externos:** Alguma API key ou servico externo necessario?

### Licenca e Distribuicao

- [ ] Este squad sera open-source (MIT)
- [ ] Este squad requer licenca proprietaria
- [ ] Este squad sera contribuido pela comunidade

### Plano de Documentacao

- [ ] README.md com exemplos de uso
- [ ] Documentacao de cada agente
- [ ] Documentacao de workflow de tasks
- [ ] Guia de integracao com squads existentes

### Checklist

- [ ] Squad segue a estrutura do SINAPSE (`{squad}/agents/`, `{squad}/tasks/`, etc.)
- [ ] Todos os agentes seguem a convencao de nomenclatura (`{agent-name}.md`)
- [ ] Todas as tasks tem frontmatter YAML correto
- [ ] Manifesto pack.yaml esta incluido
- [ ] Documentacao esta completa
- [ ] Exemplos sao fornecidos
- [ ] Sem dependencias rigidas em repos privados

### Informacoes do Contribuidor

- **Disposto a manter:** [ ] Sim [ ] Nao
- **Pode fornecer suporte:** [ ] Sim [ ] Nao
- **Disponivel para review:** [ ] Sim [ ] Nao

### Relacionados

- Issues ou discussoes relacionadas
- Squads similares para referencia

---

**Nota:** Todas as propostas de squad sao revisadas pelos maintainers. Squads aprovados podem ser incluidos no repositorio oficial.
