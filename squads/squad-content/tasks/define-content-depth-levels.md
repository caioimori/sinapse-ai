---
task: define-content-depth-levels
responsavel: "@content-engineer"
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

# Task: Define Content Depth Levels

> Definir niveis de profundidade de conteudo para calibrar complexidade por formato e audiencia.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | content-engineer (Arc) |
| **Co-agents** | editorial-strategist (North) |
| **Trigger** | Setup de projeto ou recalibracao de estrategia de conteudo |
| **Input** | Perfil da audiencia, pilares, formatos ativos, setor do cliente |
| **Output** | Framework de niveis de profundidade com criterios e exemplos |
| **Handoff** | → create-content-brief (para aplicar nivel apropriado) |
| **Complexity** | simple |

---

## Fundamentacao

Nem todo conteudo precisa ser profundo. Um Reel de 15 segundos tem profundidade diferente de um artigo de 3000 palavras. Definir niveis evita: conteudo superficial quando deveria ser profundo (blog raso), e conteudo denso quando deveria ser leve (carrossel academico). Os niveis calibram expectativas de producao e consumo. Referencia: Rand Fishkin — 10x content, Ann Handley — content quality spectrum.

---

## Steps

### Step 1: Definir Niveis
Nivel 1 (Surface): Gancho, insight rapido, sem aprofundamento. Para: Reels, Stories, tweets. Nivel 2 (Applied): Framework ou dica acionavel com contexto. Para: carrosseis, posts LinkedIn. Nivel 3 (Deep): Analise completa com dados, exemplos, nuances. Para: blog, newsletter. Nivel 4 (Definitive): Guia completo, referencia do setor. Para: pillar pages, whitepapers.

### Step 2: Mapear Nivel x Formato
Cada formato tem um nivel natural: Reels = N1-N2, Carrossel = N2-N3, Blog = N3-N4, Newsletter = N2-N3, Thread = N2-N3. Formatos podem operar em niveis acima, mas raramente abaixo.

### Step 3: Calibrar para Setor
Setores tecnicos (B2B, SaaS) toleram e esperam N3-N4. Setores de consumo (moda, lifestyle) preferem N1-N2. Setores educacionais operam em N2-N3. Calibrar baseado no setor do cliente.

### Step 4: Documentar Exemplos
Para cada nivel: 1 exemplo real do setor do cliente mostrando como seria o mesmo tema em cada nivel. Isso calibra a equipe de producao.

### Step 5: Handoff

```yaml
handoff:
  artifact: "content-depth-levels-{client}.md"
  context: "Niveis definidos: N1-N4, mapeamento formato-nivel completo, calibrado para setor {setor}"
  next: "create-content-brief para aplicar nivel correto em cada brief"
```
