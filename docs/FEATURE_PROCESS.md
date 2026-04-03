# Processo de Propostas de Features

> Como propor novas funcionalidades para o SINAPSE-AI.

---

## Visao Geral

O SINAPSE segue o principio de Documentation-First (Constitution Art. III). Toda feature --- desde uma ideia simples ate uma mudanca arquitetural --- passa por um pipeline documentado antes de qualquer implementacao.

```
Ideia → Discussao → Decisao → Story → Implementacao → Release
```

---

## Passo 1: Abra uma Discussion ou Issue

**Para ideias e sugestoes:**
- Abra uma [Discussion](../../discussions) na categoria **Ideas**
- Descreva o problema que a feature resolve
- Proponha uma solucao (pode ser alto nivel)
- Inclua exemplos de uso se possivel

**Para bugs ou melhorias pontuais:**
- Abra uma [Issue](../../issues) usando o template **Feature Request** ou **Bug Report**
- Preencha todos os campos do template

---

## Passo 2: Periodo de Feedback (7 dias)

A comunidade e os maintainers revisam a proposta durante 7 dias:

- Use reacoes (+1) para mostrar apoio
- Comente com sugestoes, preocupacoes ou alternativas
- Maintainers podem pedir esclarecimentos

**Dica:** propostas com exemplos concretos e justificativa clara tem mais chances de aceitacao.

---

## Passo 3: Decisao dos Maintainers

Apos o periodo de feedback, os maintainers tomam uma decisao:

| Decisao | Significado | Proximo Passo |
|---------|-------------|---------------|
| **Aceita** | Feature aprovada para implementacao | Segue para Passo 4 |
| **Adiada** | Valida, mas nao prioritaria agora | Fica no backlog |
| **Rejeitada** | Nao alinha com a visao do projeto | Explicacao fornecida |

### Criterios de Decisao

- **Alinhamento com a Constitution:** a feature respeita os 10 artigos?
- **Compatibilidade retroativa:** quebra algo existente?
- **Carga de manutencao:** o custo de manter justifica o beneficio?
- **Demanda da comunidade:** quantas pessoas precisam disso?
- **Escopo:** e core framework ou pertence a um squad?

### Quem Decide

| Maintainer | GitHub | Papel |
|-----------|--------|-------|
| Caio Imori | @caioimori | Lead maintainer |
| Matheus Soier | @Matheus-soier | Co-maintainer |

---

## Passo 4: Criacao de Story (se aceita)

Toda feature aceita segue o pipeline Documentation-First:

1. @sprint-lead (Sync) cria a story em `docs/stories/`
2. Story inclui: acceptance criteria, escopo IN/OUT, dependencias, estimativa
3. @product-lead (Axis) valida a story (checklist de 10 pontos)
4. Story recebe status **Ready** apos validacao

**Nenhum codigo e escrito antes da story estar validada.**

---

## Passo 5: Implementacao via SDC

A implementacao segue o Story Development Cycle (SDC):

```
@sprint-lead *draft → @product-lead *validate → @developer *develop → @quality-gate *qa-gate → @devops *push
```

O contribuidor pode implementar a feature seguindo o [CONTRIBUTING.md](../CONTRIBUTING.md).

---

## Mudancas Significativas: Processo de RFC

Para mudancas que impactam arquitetura, APIs publicas ou o comportamento do framework:

### Quando Escrever um RFC

- Novas funcionalidades de grande porte
- Breaking changes em APIs ou comportamento existente
- Mudancas arquiteturais significativas
- Alteracoes que afetam muitos usuarios

### Como Criar um RFC

1. Crie um PR com o arquivo `docs/rfcs/RFC-NNN.md`
2. Use o template de RFC disponivel em `.github/RFC_TEMPLATE.md`
3. O PR serve como espaco de discussao
4. Periodo de review: minimo 14 dias

### Ciclo de Vida do RFC

```
Draft → Em Revisao (14 dias) → Decisao (Aceito/Rejeitado) → Implementacao
```

---

## De Ideia a Release

```
Comunidade propoe (Discussion/Issue)
        |
        | [Aprovada pelos maintainers]
        v
Backlog interno
        |
        | [Priorizada por @product-lead (Axis)]
        v
Sprint Planning
        |
        | [Story criada por @sprint-lead (Sync)]
        v
Implementacao (SDC)
        |
        | [QA Gate por @quality-gate (Litmus)]
        v
Release (creditada no CHANGELOG.md)
```

---

## Credito ao Contribuidor

Contribuidores cujas ideias sao implementadas recebem credito em:

- **CHANGELOG.md** nas notas de release
- **PR** que implementa a feature
- **Discussion** original marcada como resolvida

---

## Perguntas?

- Abra uma Discussion na categoria **Q&A**
- Consulte o [Troubleshooting Guide](troubleshooting.md)

---

_Veja tambem: [CONTRIBUTING.md](../CONTRIBUTING.md) | [Guiding Principles](GUIDING-PRINCIPLES.md) | [Code of Conduct](../CODE_OF_CONDUCT.md)_
