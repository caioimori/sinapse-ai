# Pre-Deploy Checklist

> Validacao final antes de deployar o clone no ecossistema Sinapse.

---

## Estrutura de Arquivos

- [ ] Diretorio segue padrao: `squad-{nome}/`
- [ ] `squad.yaml` existe e tem todos campos obrigatorios
- [ ] `agents/` contem agent.md (Tier 2+)
- [ ] `knowledge-base/` contem KBs (SINGULAR, nao "knowledge-bases")
- [ ] `tasks/` contem tasks (Tier 3)
- [ ] `workflows/` contem workflows (Tier 3)
- [ ] Todos filenames em kebab-case
- [ ] Nenhum arquivo vazio

## squad.yaml

- [ ] `name` em kebab-case, 2-50 chars
- [ ] `version` em semver ("1.0.0")
- [ ] `description` clara e completa
- [ ] `slashPrefix` definido
- [ ] `sinapse.minVersion` e `type` presentes
- [ ] `agents` listados com id, name, file, role
- [ ] `knowledge_bases` listados
- [ ] `workflows` listados (Tier 3)
- [ ] Contagens corretas (agents_count, tasks_count, etc)

## Naming Conventions

- [ ] Todos filenames: kebab-case
- [ ] Agent IDs: kebab-case
- [ ] Task names: verbo-acao (define-, create-, analyze-)
- [ ] KB names: descritivos em kebab-case
- [ ] Regex valida: `/^[a-z0-9]+(-[a-z0-9]+)*$/`

## Cross-Squad Deploy

- [ ] KBs destino identificados
- [ ] Nao ha conflito de nomes nos squads destino
- [ ] KBs seguem naming: `{source-mind}-{topic}.md`
- [ ] Deploy header presente (data, source, tier, confidence)

## Integridade

- [ ] Nenhuma referencia quebrada (cross-references entre KBs)
- [ ] Agent.md referencia tasks e KBs que existem
- [ ] Workflows referenciam tasks e agents que existem
- [ ] Sem contradicoes nao-documentadas

## Quality Standards

- [ ] Confidence score documentado
- [ ] Tier justificado
- [ ] SQUAD-CREATION-STANDARDS compliance (se aplicavel)
- [ ] Honestidade: nenhum conteudo fabricado
