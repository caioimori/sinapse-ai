# KB Generation Guide — Estrutura e Geracao de Knowledge Bases

> Como criar KBs de alta qualidade a partir de extracoes cognitivas.

---

## 4 Tipos de KB

### Framework KB
Mental models transformados em frameworks reutilizaveis.
- **Fonte:** Layer 1 (Mental Models)
- **Estrutura:** Nome do framework → Descricao → Quando usar → Steps → Exemplos
- **Naming:** `{topic}-framework.md`

### Pattern KB
Padroes recorrentes com exemplos concretos.
- **Fonte:** Layer 2 (Heuristics) + Layer 4 (Communication)
- **Estrutura:** Pattern name → Descricao → Quando ocorre → Exemplos → Anti-patterns
- **Naming:** `{topic}-patterns.md`

### Methodology KB
Processos step-by-step replicaveis.
- **Fonte:** Layer 3 (Workflows)
- **Estrutura:** Nome → Objetivo → Pre-requisitos → Steps detalhados → Output esperado
- **Naming:** `{topic}-methodology.md`

### Reference KB
Compilacoes de principios, regras e material de referencia.
- **Fonte:** Cross-layer (compilacao de todas as layers)
- **Estrutura:** Categorias → Principios → Regras → Citacoes → Fontes
- **Naming:** `{topic}-reference.md`

---

## Formato Obrigatorio

```markdown
# {Titulo} — {Nome da Pessoa}

> Fonte: {Nome da Pessoa}
> Confidence Score: {X%}
> Tipo: {Framework|Pattern|Methodology|Reference}
> Squad destino: {squad(s) alvo}

## Contexto
{Por que este KB existe, como foi extraido}

## {Conteudo Principal}
{Cada afirmacao com tag de confianca}

- **{Item}:** {Descricao} [DIRETO]
- **{Item}:** {Descricao} [INFERIDO]

## Fontes
| # | Fonte | Tipo | Palavras |
|---|-------|------|----------|

## Aplicacao
{Como o squad destino deve usar este KB}
```

---

## Regras de Citacao

1. **Toda afirmacao tem tag** — [DIRETO], [INFERIDO] ou [HIPOTESE]
2. **[DIRETO] inclui fonte** — "Frase exata" (Fonte, Contexto)
3. **[INFERIDO] cita 3+ fontes** de suporte
4. **[HIPOTESE] tem disclaimer** — marcada como precisa validacao
5. **Secao Fontes** lista todas as fontes consultadas com word count

---

## Guidelines de Tamanho

| Tipo | Linhas | Notas |
|------|--------|-------|
| Framework KB | 80-200 | Profundo, com exemplos |
| Pattern KB | 60-150 | Patterns com anti-patterns |
| Methodology KB | 100-250 | Steps detalhados |
| Reference KB | 80-200 | Compilacao organizada |

---

## Mapeamento KB → Squad Destino

| Tipo de extracao | Squad(s) destino |
|-----------------|-----------------|
| Content patterns | squad-content, squad-storytelling |
| Copy/headline patterns | squad-copy |
| Business strategy frameworks | squad-commercial, squad-council |
| Growth/marketing methodologies | squad-growth, squad-paidmedia |
| Brand voice patterns | squad-brand |
| Product thinking frameworks | squad-product |
| Research methodology | squad-research |
| Design system patterns | squad-design |
| Security frameworks | squad-cybersecurity |
| Financial models | squad-finance |

---

## Cross-Referencing

- KBs do mesmo clone devem referenciar uns aos outros onde relevante
- Usar links relativos: `Ver tambem: {outro-kb}.md`
- NAO contradizer entre KBs — se houver tensao, explicar
- KBs deployados em squads diferentes podem ter perspectivas complementares
