---
task: build-proof-stack
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

# Task: Build Proof Stack

## Metadata
- **Squad:** squad-copy
- **Agent:** proof-architect (Evidence)
- **Complexity:** STANDARD
- **Depends on:** copy brief, claims list, available proof assets
- **Feeds:** direct-response-writer (Forge), funnel-copywriter (Flow), conversion-writer (Spark)

## Objetivo
Construir proof stack completo que torna cada claim do copy acreditavel e irrefutavel. Organizar provas em camadas seguindo a Proof Hierarchy de Bencivenga: demonstration > documentation > testimonials > credentials > data. O proof stack e a espinha dorsal da credibilidade de qualquer peca de copy.

## Entrada
- Lista de claims principais do copy
- Testimonials disponiveis (texto, video, audio)
- Dados e metricas de resultados
- Credenciais, certificacoes e premios
- Cases de sucesso documentados
- Mencoes na midia, parcerias, endorsements

## Passos

### 1. Auditar Claims e Believability Score
**Para cada claim principal, avaliar:**
| Claim | Believability (1-10) | Proof Needed | Priority |
|-------|---------------------|-------------|----------|
| [Claim 1] | [Score] | [Tipo de proof] | [Alta/Media/Baixa] |

**Regra:** Claims com score < 7 PRECISAM de proof adicional.
**Claims com score < 4** devem ser reformulados ou removidos.

### 2. Mapear Proofs Disponiveis por Tipo
**Inventario de proofs:**
- **Demonstrations:** Demos ao vivo, before/after, screencasts, auditorias
- **Documentation:** Screenshots, relatorios, emails de clientes, faturas
- **Testimonials:** Depoimentos texto, video, audio (com resultado especifico)
- **Credentials:** Certificacoes, premios, anos de experiencia, clientes notaveis
- **Data:** Numeros, porcentagens, estudos, benchmarks, ROI calculado
- **Authority Transfer:** Mencoes na midia, endorsements, parcerias

### 3. Criar Proof Stack por Camadas
**Estrutura de empilhamento (do mais forte para o mais fraco):**

```
CAMADA 1 — Demonstration Proof (MAIS FORTE)
  → "Veja com seus proprios olhos: [demonstracao]"
  → Before/after com timeline
  → Screencast do processo funcionando

CAMADA 2 — Documentation Proof
  → Screenshot de [metrica real]
  → Email de cliente: "[citacao direta]"
  → Relatorio com dados verificaveis

CAMADA 3 — Testimonial Proof
  → [Nome, empresa, cargo]: "[resultado especifico em prazo especifico]"
  → [Nome]: "[transformacao emocional]"
  → [Quantidade] clientes com [resultado]

CAMADA 4 — Credential Proof
  → [N] anos de experiencia em [area]
  → Certificacao [nome] por [instituicao]
  → Trabalhou com [clientes notaveis]

CAMADA 5 — Data Proof
  → [X]% de aumento medio em [metrica]
  → [N] clientes atendidos em [periodo]
  → Estudo mostra que [dado relevante]
```

### 4. Otimizar Testimonials
**Regras para testimonials eficazes:**
- Resultado ESPECIFICO com numeros e prazo
- Nome completo + foto + empresa + cargo (quanto mais real, melhor)
- Variedade de perfis (nao 5 testimonials do mesmo tipo de cliente)
- Formato: ANTES (dor) → ACAO (o que fez) → DEPOIS (resultado)
- Cada testimonial endereça uma objecao diferente

### 5. Posicionar Proofs no Copy
**Mapeamento: claim → proof → posicao:**
| Secao do Copy | Claim | Proof Type | Proof Especifico |
|---------------|-------|-----------|-----------------|
| Lead | Big Promise | Demonstration | [prova especifica] |
| Body | Mecanismo funciona | Documentation | [prova especifica] |
| Social proof section | Resultados reais | Testimonials | [3-5 depoimentos] |
| Close | Sem risco | Credential + Data | [garantia + numeros] |

## Cross-Squad Handoff
```yaml
handoffs:
  - to: direct-response-writer (Forge)
    delivers: Proof stack organizado para integracao em sales copy
    format: Proofs mapeados por claim e posicao
  - to: funnel-copywriter (Flow)
    delivers: Proof blocks para cada etapa do funil
    format: Proofs segmentados por etapa (LP, upsell, checkout)
```

## Saida
- Proof stack completo organizado por camada
- Mapeamento claim → proof
- Testimonials otimizados (formato ANTES-ACAO-DEPOIS)
- Posicionamento recomendado por secao do copy
- Gap analysis (claims sem proof suficiente)

## Validacao
- [ ] Todas as claims com believability < 7 tem proof assignado
- [ ] Proof hierarchy respeitada (demonstration priorizado)
- [ ] Testimonials com resultados ESPECIFICOS (numeros, prazos)
- [ ] Variedade de tipos de proof (nao depender de 1 tipo)
- [ ] Cada testimonial endereça objecao diferente
- [ ] Posicionamento mapeado por secao do copy
- [ ] Gap analysis completo com recomendacoes
- [ ] Nenhum proof fabricado ou exagerado

---

*Task operada por: proof-architect (Evidence)*
