---
task: create-empty-error-states
responsavel: "@dx-ui-designer"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: context
    tipo: object
    origem: "workflow ou manual"
    obrigatorio: true

Saida:
  - campo: resultado
    tipo: document
    destino: "stakeholders"

Checklist:
  - "[ ] Validar inputs e pre-condicoes"
  - "[ ] Executar steps conforme documentado"
  - "[ ] Verificar criterios de qualidade"
  - "[ ] Gerar output no formato especificado"
---

# Task: Create Empty & Error States

## Metadata
- **Squad:** squad-design
- **Agent:** Canvas (dx-ui-designer)
- **Complexity:** Standard

## Objetivo
Projetar empty states e error states consistentes — transformar momentos de ausencia de conteudo ou falha em oportunidades de orientacao e recuperacao.

## Entrada
- User flows e scenarios
- Illustration style guide
- Content hierarchy
- Error types do sistema

## Passos

### 1. Catalogar Empty States
| Tipo | Contexto | Exemplo |
|------|----------|---------|
| First use | Nenhum dado ainda | Dashboard vazio, lista vazia |
| No results | Busca sem resultados | Search results empty |
| No data | Dados removidos/expirados | Historico limpo |
| No permission | Sem acesso ao conteudo | Restricted area |
| No connection | Offline | Network error |

### 2. Design Pattern por Tipo
```yaml
empty_state:
  type: "first-use"
  components:
    illustration: "spot illustration (200-300px)"
    headline: "Friendly, orientador"
    description: "1-2 linhas explicando o que fazer"
    primary_action: "CTA para comecar"
    secondary_action: "Link para docs/help (opcional)"
  tone: "Encorajador, nao culpabilizador"
```

### 3. Catalogar Error States
| Tipo | HTTP | Mensagem | Recovery |
|------|------|----------|---------|
| Not Found | 404 | Pagina nao encontrada | Link para home, search |
| Server Error | 500 | Algo deu errado | Retry, contact support |
| Forbidden | 403 | Sem permissao | Login, request access |
| Timeout | 408 | Demorou demais | Retry |
| Rate Limit | 429 | Muitas requisicoes | Wait, retry |
| Validation | 422 | Dados invalidos | Fix e resubmit |
| Offline | — | Sem conexao | Check connection |

### 4. Error Message Framework
Cada error message deve ter:
1. **O que aconteceu** (sem jargao tecnico)
2. **Por que aconteceu** (se relevante)
3. **O que fazer agora** (acao clara)

Exemplos:
- Ruim: "Error 500: Internal Server Error"
- Bom: "Algo deu errado do nosso lado. Tente novamente em alguns minutos. Se o problema persistir, entre em contato."

### 5. Visual Consistency
| Componente | Empty State | Error State |
|-----------|------------|-------------|
| Ilustracao | Leve, positiva | Empática, nao alarmista |
| Headline | Orientador | Claro sobre o problema |
| Body | Instrutivo | Solucionador |
| CTA | Acao principal | Recovery action |
| Cor | Neutral, brand accent | Warning/error palette |

### 6. Responsiveness
- Mobile: Ilustracao menor ou removida, foco no texto
- Tablet: Layout adaptado
- Desktop: Full illustration + text

## Saida
- Empty state patterns library
- Error state patterns library
- Message copywriting guidelines
- Illustration specifications
- Responsive adaptations
- Handoff para Scaffold (implementation) e squad-copy (copy)

## Validacao
- [ ] Todos os tipos de empty state cobertos
- [ ] Error messages sem jargao tecnico
- [ ] Recovery actions claras em todos os errors
- [ ] Ilustracoes consistentes com style guide
- [ ] Responsive behavior definido
- [ ] Accessibility (screen reader announces error)
