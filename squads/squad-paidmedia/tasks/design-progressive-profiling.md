---
task: design-progressive-profiling
responsavel: "@cro-specialist"
responsavel_type: Agent
atomic_layer: Task
elicit: true
---

# Task: Design Progressive Profiling

## Metadata
- **Agent:** cro-specialist (Convert)
- **Squad:** squad-paidmedia
- **Complexity:** MEDIUM

## Objetivo
Desenhar estrategia de progressive profiling para coletar dados gradualmente sem friccao excessiva.

## Steps

1. **Inventariar dados necessarios** - Dados para conversao (minimo): nome, email. Dados para qualificacao: empresa, cargo, tamanho. Dados para personalizacao: industria, use case, budget
2. **Definir momentos de coleta** - Signup: apenas nome + email (+ social login). Onboarding: empresa, cargo. In-app (apos valor): industria, use case. Follow-up email: budget, timeline
3. **Definir incentivos por momento** - Signup: acesso ao produto/trial. Onboarding: personalizacao da experiencia. In-app: desbloqueio de feature. Email: conteudo exclusivo
4. **Implementar logica** - Form dinámico que mostra campos diferentes por visita. Cookie/session tracking de dados ja coletados. CRM enrichment automatico (Clearbit, etc.)

## Output
Progressive profiling strategy com momentos, campos, incentivos e logica.

## Quality Gates
- [ ] Dados categorizados por importancia
- [ ] Momentos de coleta definidos
- [ ] Incentivos para cada momento
- [ ] Nunca pedir dado ja coletado

## Quando Usar
- Setup de lead gen flow
- Quando form muito longo afeta conversao
- Para B2B com necessidade de qualificacao
