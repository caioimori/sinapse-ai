---
task: import-existing-content-library
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

# Task: Import Existing Content Library

> Importar e classificar biblioteca de conteudo existente de um novo cliente.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | content-governor (Index) |
| **Co-agents** | content-analyst (Lens) |
| **Trigger** | Onboarding de novo cliente com conteudo pre-existente |
| **Input** | Acesso as plataformas/repositorios do cliente, taxonomia definida |
| **Output** | Inventario completo classificado e importado no sistema |
| **Handoff** | → audit-content-library para avaliacao de qualidade |
| **Complexity** | complex |

---

## Fundamentacao

Clientes novos nao comecam do zero — ja tem conteudo publicado. Ignorar esse acervo e desperdicar asset. A importacao classifica o existente, identifica pecas reaproveitaveis, e estabelece baseline para medir evolucao. Referencia: content migration best practices.

---

## Steps

### Step 1: Mapear Fontes de Conteudo
Todas as plataformas onde o cliente tem conteudo: Instagram, LinkedIn, blog, YouTube, newsletter, TikTok, etc. Tambem: conteudo interno (apresentacoes, documentos, PDFs).

### Step 2: Extrair Inventario
Para cada plataforma: listar pecas com metadados basicos (titulo, data, formato, URL/link). Volume tipico: 50-500 pecas para clientes estabelecidos.

### Step 3: Classificar com Taxonomia
Aplicar taxonomia definida: pilar, sub-tema, formato, funil, tipo de conteudo. Classificar em lotes por plataforma.

### Step 4: Marcar Pecas Reaproveitaveis
Pecas com potencial de: atualizacao, atomizacao, repostagem, consolidacao. Marcar para auditoria detalhada.

### Step 5: Estabelecer Baseline
Metricas agregadas do acervo: distribuicao por pilar, por formato, por funil. Este e o ponto de partida para medir evolucao.

### Step 6: Handoff

```yaml
handoff:
  artifact: "content-import-{client}.md"
  context: "Importado: {N} pecas de {P} plataformas, classificadas, baseline estabelecido"
  next: "audit-content-library para avaliacao qualitativa do acervo"
```
