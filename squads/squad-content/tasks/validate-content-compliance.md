---
task: validate-content-compliance
responsavel: "@content-governor"
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

# Task: Validate Content Compliance

> Validar conteudo contra requisitos legais, regulatorios e de compliance do setor.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | content-governor (Index) |
| **Trigger** | Pre-publicacao de conteudo em setores regulados |
| **Input** | Conteudo finalizado, regulacoes do setor, politicas de compliance |
| **Output** | Validacao de compliance com flags e recomendacoes |
| **Handoff** | → publicacao se pass, content-engineer (Arc) se fail |
| **Complexity** | medium |

---

## Fundamentacao

Em setores regulados (saude, financas, educacao, alimentos), conteudo errado pode gerar multas, processos e danos reputacionais. Claims de saude sem base cientifica, promessas financeiras sem disclaimer, depoimentos sem comprovacao — tudo isso e risco. A validacao de compliance e obrigatoria, nao opcional. Referencia: FTC guidelines, CONAR, regulacoes setoriais.

---

## Steps

### Step 1: Identificar Regulacoes Aplicaveis
Setor do cliente define: ANVISA (saude), CVM (financas), CONAR (publicidade geral), LGPD (dados pessoais). Listar regulacoes relevantes.

### Step 2: Verificar Claims
Todo claim de resultado deve ter: base factual, fonte citavel, disclaimer se necessario. "Emagreca 10kg" sem disclaimer e ilegal. "Baseado em estudo X" sem link e insuficiente.

### Step 3: Verificar Depoimentos
Depoimentos devem ser reais e verificaveis. Resultados atipicos devem ter disclaimer. UGC usado como depoimento precisa de autorizacao.

### Step 4: Verificar Uso de Imagem e Dados
Imagens de banco: licenca correta? Dados de terceiros: atribuicao? Screenshots: autorizacao? LGPD: dados pessoais anonimizados?

### Step 5: Emitir Veredicto
PASS: sem riscos de compliance. CAUTION: riscos menores (adicionar disclaimer). FAIL: risco significativo (reescrever ou nao publicar).

### Step 6: Handoff

```yaml
handoff:
  artifact: "compliance-validation-{peca}.md"
  context: "Compliance: {PASS/CAUTION/FAIL}, regulacoes verificadas: {lista}, {N} flags"
  next: "Publicacao se PASS, Arc para ajustes se CAUTION/FAIL"
```
