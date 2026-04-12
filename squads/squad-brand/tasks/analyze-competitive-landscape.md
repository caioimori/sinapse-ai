---
task: analyze-competitive-landscape
responsavel: "@brand-strategist"
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

# Task: analyze-competitive-landscape

## Metadata
- **Agent:** brand-strategist (Athena)
- **Squad:** squad-brand
- **Trigger:** `*analyze-competitors` ou durante discovery
- **Inputs:** Briefing, industria, concorrentes indicados pelo cliente
- **Outputs:** Competitive analysis report

## Description
Analisa o landscape competitivo para identificar oportunidades de diferenciacao. Mapeia posicionamento, identidade visual e estrategia dos concorrentes.

## Steps
1. Identificar 5-10 concorrentes (diretos e indiretos)
2. Para cada concorrente analisar:
   - **Posicionamento:** como se posiciona, para quem fala
   - **Identidade visual:** cores, tipografia, estilo visual
   - **Tom de voz:** como comunica, personalidade verbal
   - **Pontos fortes:** o que faz bem
   - **Pontos fracos:** onde falha ou tem gaps
   - **Percepcao de mercado:** como e visto pelo publico
3. Criar Perceptual Map 2x2 (2 eixos mais relevantes para o setor)
4. Identificar patterns (o que todos fazem igual — oportunidade de diferenciacao)
5. Identificar gaps (o que ninguem faz — blue ocean)
6. Identificar benchmarks (o que alguem faz excepcionalmente bem)
7. Mapear threats (tendencias que podem impactar a marca)
8. Definir territorio de diferenciacao unico para a marca
9. Compilar competitive analysis report

## Validation Criteria
- Minimo 5 concorrentes analisados em profundidade
- Perceptual map com posicoes justificadas
- Gaps e oportunidades sao acionaveis
- Territorio de diferenciacao e defensavel
- Analise e factual (sem opiniao sem evidencia)

## Output Format
```markdown
# Competitive Analysis — {brand_name}

## Concorrentes Analisados
### 1. {nome}
- Posicionamento: ...
- Visual: ...
- Forcas: ...
- Fraquezas: ...

## Perceptual Map
[eixo X] vs [eixo Y]
{posicoes}

## Patterns do Setor
- Todos fazem: ...

## Gaps / Oportunidades
- Ninguem faz: ...

## Territorio Recomendado
{espaco de diferenciacao}
```
