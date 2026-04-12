---
task: create-case-study-framework
responsavel: "@proof-architect"
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

# Task: Create Case Study Framework

## Metadata
- **Squad:** squad-copy
- **Agent:** proof-architect (Evidence)
- **Complexity:** STANDARD
- **Depends on:** resultados de clientes, dados de transformacao
- **Feeds:** content-intelligence squad, commercial-systems squad, copy-strategist (Quill)

## Objetivo
Criar framework replicavel para case studies que demonstram transformacao real de clientes. Um case study eficaz nao e um depoimento longo — e uma HISTORIA de transformacao com estrutura narrativa, dados concretos e elementos de identificacao que o prospect ve e pensa: "isso poderia ser eu."

## Entrada
- Dados do cliente (com permissao de uso)
- Metricas antes e depois
- Timeline da transformacao
- Desafios enfrentados durante o processo
- Depoimentos diretos do cliente
- Contexto do setor/segmento

## Passos

### 1. Definir Template do Case Study
**Estrutura SCSR (Situation-Complication-Solution-Result):**

```
TITULO: [Resultado especifico] — Como [Cliente] [alcancou resultado] em [prazo]

SNAPSHOT (caixa de destaque):
  Cliente: [nome/empresa]
  Segmento: [setor]
  Desafio: [1 frase]
  Resultado: [metrica principal]
  Timeline: [duracao]

SITUACAO (200-300 palavras):
  → Contexto do cliente antes
  → Dor principal e impacto no negocio
  → O que ja tinham tentado (e por que nao funcionou)

COMPLICACAO (100-200 palavras):
  → O que tornava o problema urgente
  → Ponto de virada que motivou a busca por solucao
  → Stakes: o que estava em risco

SOLUCAO (200-400 palavras):
  → Como encontraram/escolheram a solucao
  → Processo de implementacao
  → Diferenciais que fizeram a diferenca
  → Desafios superados durante o processo

RESULTADO (200-300 palavras):
  → Metricas concretas (antes vs depois)
  → Timeline dos resultados
  → Impacto no negocio (revenue, eficiencia, satisfacao)
  → Resultados inesperados/bonus

QUOTE DO CLIENTE:
  → Depoimento direto com emocao e especificidade

PROXIMO PASSO (CTA):
  → "Quer resultados semelhantes? [CTA]"
```

### 2. Extrair Dados de Transformacao
**Metricas obrigatorias (minimo 3):**
| Categoria | Metrica | Antes | Depois | Melhoria |
|-----------|---------|-------|--------|----------|
| Revenue | [metrica] | [valor] | [valor] | [%] |
| Eficiencia | [metrica] | [valor] | [valor] | [%] |
| Satisfacao | [metrica] | [valor] | [valor] | [%] |

**Regras de dados:**
- Numeros REAIS (nunca arredondados para parecer melhor)
- Timeline EXATA (nao "em poucos meses")
- Contexto de comparacao (vs benchmark do setor, vs antes)

### 3. Construir Narrativa de Identificacao
**Elementos de identificacao:**
- O cliente deve ser PARECIDO com o prospect ideal
- Os desafios devem ESPELHAR as dores do prospect
- A hesitacao do cliente (antes de comprar) valida a hesitacao do prospect
- O resultado deve ser ASPIRACIONAL mas ALCANCAVEL

**Arco emocional:** Frustração → Esperança → Ação → Transformação → Satisfação

### 4. Criar Versoes por Canal
| Canal | Formato | Comprimento |
|-------|---------|-------------|
| Sales page | Full case study com dados | 800-1200 palavras |
| Email | Historia resumida + link | 200-400 palavras |
| Social media | Quote + metrica + imagem | 100-200 palavras |
| Proposta comercial | Snapshot + resultado | 150-250 palavras |
| Video | Script baseado no case | 2-4 minutos |

### 5. Definir Collection Protocol
**Processo para coletar novos case studies:**
1. Identificar clientes com resultados acima da media
2. Solicitar permissao formal de uso
3. Conduzir entrevista estruturada (perguntas padrao)
4. Coletar metricas antes/depois com documentacao
5. Redigir draft e submeter para aprovacao do cliente
6. Formatar em todos os canais definidos

**Perguntas-chave da entrevista:**
- "Como era [situacao] antes de nos conhecer?"
- "O que voce ja tinha tentado?"
- "O que te fez decidir experimentar [produto]?"
- "Qual foi o primeiro resultado que percebeu?"
- "Qual o impacto mais significativo ate agora?"
- "O que voce diria para alguem na mesma situacao?"

## Cross-Squad Handoff
```yaml
handoffs:
  - to: content-intelligence squad
    delivers: Case studies formatados para blog/social
    format: Versoes por canal com assets
  - to: commercial-systems squad
    delivers: Case studies para equipe de vendas
    format: Versao proposta comercial + full version
```

## Saida
- Template de case study replicavel (SCSR)
- Case study(s) completo(s) formatado(s)
- Versoes por canal (sales page, email, social, proposta, video)
- Collection protocol documentado
- Perguntas-chave de entrevista

## Validacao
- [ ] Estrutura SCSR completa e coerente
- [ ] Minimo 3 metricas concretas (antes vs depois)
- [ ] Timeline especifica (nao vaga)
- [ ] Quote do cliente autentica e emocional
- [ ] Narrativa de identificacao com prospect ideal
- [ ] Versoes para 4+ canais formatadas
- [ ] Collection protocol documentado
- [ ] Permissao do cliente obtida
- [ ] Arco emocional claro (frustracao → transformacao)

---

*Task operada por: proof-architect (Evidence)*
