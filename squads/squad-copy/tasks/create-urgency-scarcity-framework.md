---
task: create-urgency-scarcity-framework
responsavel: "@persuasion-psychologist"
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

# Task: Create Urgency & Scarcity Framework

## Metadata
- **Squad:** squad-copy
- **Agent:** persuasion-psychologist (Nudge)
- **Complexity:** STANDARD
- **Depends on:** oferta, ciclo de venda, audiencia
- **Feeds:** conversion-writer (Spark), todos os writers

## Objetivo
Criar framework de urgencia e escassez que acelera decisao de compra — usando APENAS triggers reais e verificaveis. A diferenca entre persuasao e manipulacao e a VERACIDADE.

## Entrada
- Oferta e pricing
- Limites reais (estoque, vagas, prazo)
- Ciclo de venda tipico
- Competitor urgency tactics

## Passos

### 1. Tipos de Urgencia Etica
| Tipo | Descricao | Exemplo | Etico? |
|------|-----------|---------|:------:|
| Deadline real | Oferta tem data fim | "Valido ate 31/03" | ✅ |
| Estoque real | Quantidade limitada | "47 unidades restantes" | ✅ |
| Vagas reais | Capacidade limitada | "30 vagas (23 preenchidas)" | ✅ |
| Preco sobe | Aumento programado | "Preco sobe em [data]" | ✅ |
| Bonus temporario | Bonus so nesta oferta | "Bonus X so ate [data]" | ✅ |
| Seasonal | Ligada a estacao/data | "Black Friday — so hoje" | ✅ |
| FOMO fabricado | Timer que reseta | "Oferta expira em 10:00..." | ❌ |
| Escassez falsa | "Ultimos 3!" sempre | Numero nunca muda | ❌ |
| Urgencia generica | "Compre agora!" sem razao | Nenhuma razao real | ❌ |

### 2. Framework de Urgencia por Fase
**Pre-Launch:**
```
TIPO: Anticipation urgency
COPY: "Lista de espera aberta. Primeiros [N] ganham [bonus]"
MECANISMO: Early bird advantage
REAL? ✅ Bonus limitado a primeiros inscritos
```

**Launch:**
```
TIPO: Launch window
COPY: "Inscricoes abertas ate [data]. Proxima turma so em [data]"
MECANISMO: Janela de oportunidade
REAL? ✅ Turmas com datas fixas
```

**Promotional:**
```
TIPO: Time-limited offer
COPY: "[X]% de desconto ate [data]. Depois, preco volta a R$[Y]"
MECANISMO: Desconto temporario
REAL? ✅ Preco efetivamente sobe
```

**Evergreen:**
```
TIPO: Value-based urgency
COPY: "Cada dia sem [solucao] custa R$[X] em [metrica]"
MECANISMO: Cost of inaction
REAL? ✅ Dados verificaveis de custo
```

### 3. Copy Patterns de Urgencia
**Countdown copy:**
- "Faltam [X] dias para o preco subir"
- "Esta oferta expira em [data/hora]"
- "[N] horas restantes — depois nao ha garantia de disponibilidade"

**Scarcity copy:**
- "[N] vagas restantes de [total]"
- "Estoque limitado — [N] unidades disponíveis"
- "So [N] sessoes de consultoria por mes"

**Social urgency:**
- "[N] pessoas olhando agora"
- "[N] compras nas ultimas [X] horas"
- "Mais popular esta semana"

**Opportunity cost:**
- "Enquanto voce decide, seus concorrentes ja estao usando"
- "Cada semana sem [solucao] = R$[X] perdidos"
- "Profissionais que adotaram [solucao] em [mes] ja viram [resultado]"

### 4. Intensidade por Canal
| Canal | Intensidade | Copy Approach |
|-------|:-----------:|---------------|
| Landing Page | Alta | Countdown + escassez visual |
| Email (launch) | Alta | Deadline + contagem regressiva |
| Email (nurture) | Baixa | Opportunity cost sutil |
| Ad (retargeting) | Media | "Ainda disponivel — por pouco tempo" |
| Social | Baixa | "Vagas preenchendo" (informativo) |
| Checkout | Media | "Preco garantido por [X] min" |

### 5. Anti-Patterns (NUNCA USAR)
| Anti-Pattern | Por que e ruim | Alternativa Etica |
|-------------|----------------|-------------------|
| Timer eterno | Destroi confianca quando descoberto | Deadline real |
| "So 3 restando!" (falso) | Violacao de confianca, possivel fraude | Numero real atualizado |
| "Compre AGORA ou perca PARA SEMPRE" | Pressao excessiva, gera arrependimento | "Oferta valida ate [data]" |
| Urgencia em tudo | Fatiga, ninguem acredita mais | Urgencia em 20-30% da copy |
| FOMO em vulneraveis | Antiético e regulatoriamente arriscado | Informar sem pressionar |

### 6. Urgency Audit Checklist
**Antes de publicar copy com urgencia:**
- [ ] A urgencia e REAL e verificavel?
- [ ] O deadline efetivamente expira?
- [ ] O estoque/vagas efetivamente acabam?
- [ ] O preco efetivamente sobe?
- [ ] Nao ha timer que reseta?
- [ ] A copy seria aceitavel se publicada em jornal?
- [ ] O prospect se sentiria INFORMADO, nao MANIPULADO?
- [ ] A urgencia e proporcional ao valor da oferta?

## Saida
- Urgency & Scarcity framework por tipo
- Copy patterns (15+ templates)
- Intensidade por canal
- Anti-patterns documentados
- Audit checklist

## Validacao
- [ ] Todos os tipos de urgencia documentados
- [ ] APENAS urgencia real e verificavel
- [ ] Copy patterns prontos para uso (min 15)
- [ ] Anti-patterns claramente listados
- [ ] Audit checklist criada
- [ ] Intensidade calibrada por canal
- [ ] Ethical guidelines respeitadas
- [ ] Teste de veracidade em cada pattern

---

*Task operada por: persuasion-psychologist (Nudge)*
