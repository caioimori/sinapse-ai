---
task: compile-competitive-dossier
responsavel: "@data-synthesizer"
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

# Task: Compile Competitive Dossier

## Metadata
- **Squad:** squad-research
- **Agent:** data-synthesizer (Loom)
- **Complexity:** STANDARD
- **Depends on:** Hawk competitive tasks (map-competitive-landscape, analyze-competitor-strategy, etc.)
- **Feeds:** commercial-systems, brand-system, @pm

## Objetivo
Compilar dossier competitivo completo a partir dos outputs do Hawk — documento unico de referencia para toda a organizacao.

## Entrada
- Mapeamento de landscape competitivo (Hawk)
- Perfis de competidores (Hawk)
- Analises de estrategia (Hawk)
- Battle cards (Hawk)
- Dados de pricing e digital (Hawk)

## Passos

### 1. Estruturar Dossier
- **Parte 1:** Overview do Landscape (mapa, categorias, tendencias)
- **Parte 2:** Perfis Individuais (1 secao por competidor-chave)
- **Parte 3:** Analise Comparativa (matrizes, rankings)
- **Parte 4:** Gaps e Oportunidades
- **Parte 5:** Battle Cards (1-2 pags por competidor)
- **Parte 6:** Monitoramento e Alertas

### 2. Consolidar Perfis de Competidores
Para cada competidor-chave (top 5-7):
- Overview: fundacao, tamanho, funding, mercado
- Estrategia: modelo de negocio, GTM, diferenciacao
- Produto: features, pricing, target, positioning
- Forcas e fraquezas (com evidencias)
- Movimentos recentes (ultimos 6 meses)
- Threat level: CRITICO / ALTO / MEDIO / BAIXO

### 3. Construir Matrizes Comparativas
- Feature comparison matrix (nos vs competidores)
- Pricing comparison (modelos, faixas, value)
- Market positioning map (2x2: eixos relevantes)
- Digital presence comparison (trafego, social, SEO)
- Customer satisfaction indicators (se disponiveis)

### 4. Sintetizar Gaps e Oportunidades
- Product gaps: features que ninguem oferece
- Segment gaps: audiencias mal servidas
- Model gaps: modelos de negocio nao explorados
- Positioning gaps: posicionamentos disponiveis
- Ranking por oportunidade (impacto x viabilidade)

### 5. Definir Cadencia de Atualizacao
- Dossier completo: revisao trimestral
- Battle cards: revisao mensal
- Alertas competitivos: continuo (quando detectados)
- Versioning: v1.0, v1.1, v2.0 (major = reestruturacao)

## Cross-Squad Handoffs
```yaml
handoffs:
  - to: commercial-systems
    delivers: battle cards e pricing comparison
    format: 1-2 pags por competidor, sales-ready
  - to: brand-system
    delivers: positioning gaps e diferenciacao
    format: perceptual map + oportunidades
  - to: copywriting-persuasion
    delivers: objecoes competitivas e counterpoints
    format: lista de objecoes com respostas
```

## Saida
- Dossier competitivo completo
- Perfis individuais de competidores-chave
- Matrizes comparativas
- Gaps e oportunidades priorizados
- Battle cards atualizados

## Validacao
- [ ] Top 5-7 competidores perfilados
- [ ] Matrizes comparativas construidas
- [ ] Gaps identificados e priorizados
- [ ] Battle cards incluidos
- [ ] Cadencia de atualizacao definida

---

*Task operada por: data-synthesizer (Loom)*
