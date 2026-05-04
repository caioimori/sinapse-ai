---
task: adapt-content-language
responsavel: "@platform-specialist"
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

# Task: Adapt Content Language

> Adaptar conteudo para diferentes idiomas mantendo tom, nuance e eficacia.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | platform-specialist (Morph) |
| **Co-agents** | content-governor (Index) |
| **Trigger** | Projeto multi-idioma ou expansao para novo mercado |
| **Input** | Conteudo original, idioma-alvo, contexto cultural do mercado |
| **Output** | Conteudo adaptado (nao traduzido) para o idioma e cultura-alvo |
| **Handoff** | → content-governor (Index) para validacao |
| **Complexity** | complex |

---

## Fundamentacao

Adaptacao linguistica nao e traducao. "Just Do It" da Nike nao foi traduzido — foi adaptado para cada mercado. Humor, referencias culturais, expressoes idiomaticas, e ate comprimento de texto variam por idioma (alemao e ~30% mais longo que ingles). A adaptacao deve manter a ESSENCIA (Espinha Dorsal) enquanto muda a EXPRESSAO (palavras, referencias, tom). Referencia: Transcreation as a discipline, adapting brand voice across languages.

---

## Steps

### Step 1: Preservar Espinha Dorsal
A TESE, MECANISMO, PROVA e DIRECAO devem ser mantidos. O que muda e como sao expressos, nao o que dizem.

### Step 2: Adaptar Referencias Culturais
Substituir referencias que nao funcionam no mercado-alvo. Dados locais em vez de dados americanos. Exemplos do mercado local. Holidays e contextos locais.

### Step 3: Ajustar Tom por Cultura
Culturas tem distancias de poder diferentes: tom informal no Brasil pode ser inadequado no Japao. Adaptar formalidade, humor, e diretividade.

### Step 4: Verificar Comprimento
Idiomas tem comprimentos diferentes. Verificar se a adaptacao cabe nos limites do Template Contract. Reformular se necessario (nao apenas cortar).

### Step 5: Validar com Nativo
Se possivel, revisar com falante nativo. Nuances que AI pode errar: duplo sentido, girias datadas, tom inapropriado.

### Step 6: Handoff

```yaml
handoff:
  artifact: "language-adaptation-{peca}-{idioma}.md"
  context: "Adaptado para {idioma}: Espinha Dorsal preservada, {N} referencias culturais ajustadas"
  next: "content-governor (Index) para validacao de qualidade e brand consistency no idioma-alvo"
```
