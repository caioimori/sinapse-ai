# Clone Completeness Checklist

> Valida que o clone atinge todos os requisitos do seu tier antes de assembly.

---

## Perfil Cognitivo

- [ ] cognitive-profile.md gerado e coerente
- [ ] Confidence score calculado
- [ ] Tier determinado e justificado
- [ ] Contradicoes resolvidas (ou documentadas como unresolved)
- [ ] Mind map de conexoes gerado (Tier 2+)

## Agent.md (Tier 2+)

- [ ] Nome/persona definidos
- [ ] ID em formato kebab-case
- [ ] Icon definido
- [ ] Role descrito
- [ ] Core principles (5-6 itens de alta confianca)
- [ ] Heuristics com trigger/action/rationale (min 5 Tier 2, 10 Tier 3)
- [ ] Protocols com steps (min 2)
- [ ] Commands definidos
- [ ] Communication tone/greeting/signature
- [ ] `real_person: true` e `source_mind` preenchidos
- [ ] `clone_tier` e `confidence_score` corretos
- [ ] Cross-squad handoffs definidos
- [ ] Segue SQUAD-CREATION-STANDARDS

## Knowledge Bases

- [ ] Min KBs gerados (3 Tier 1, 5 Tier 2, 8 Tier 3)
- [ ] Cada KB tem titulo, fonte, confidence, tipo
- [ ] Toda afirmacao tem tag de confianca
- [ ] Fontes listadas com word count
- [ ] Squad destino identificado para cada KB
- [ ] Cross-referencias entre KBs
- [ ] Sem contradicoes entre KBs

## Tasks (Tier 3)

- [ ] Min 6 tasks geradas
- [ ] Cada task segue TASK-FORMAT-SPECIFICATION-V1
- [ ] Frontmatter YAML com 7 campos obrigatorios
- [ ] `responsavel` usa agent ID (nao persona name)
- [ ] Tasks refletem workflows extraidos da pessoa

## Confidence Score

- [ ] Score >= 60% (Tier 1 gate)
- [ ] Score >= 75% (Tier 2 gate)
- [ ] Score >= 85% (Tier 3 gate)
- [ ] Score por layer calculado
- [ ] Nenhuma layer core (L1, L2) abaixo de 50%
