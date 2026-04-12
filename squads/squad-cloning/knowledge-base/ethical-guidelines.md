# Ethical Guidelines — Clonagem Cognitiva Responsavel

> Diretrizes eticas para criar, deployar e operar clones cognitivos.
> Cobre: consentimento, precisao de representacao, LGPD, direitos de personalidade
> (direito brasileiro), limites de uso, e principios de transparencia.

---

## Por Que Etica e Inegociavel

A clonagem cognitiva opera em territorio fundamentalmente sensivel:
cria uma representacao autonoma de como uma pessoa real pensa e decide.

Sem diretrizes claras, os riscos sao:
- **Representacao incorreta:** Clone faz afirmacoes que a pessoa nunca fez
- **Dano reputacional:** Clone e usado para associar a pessoa a conteudo indesejado
- **Violacao de privacidade:** Uso de dados pessoais sem base legal adequada
- **Confusao sobre autoria:** Usuario acredita estar interagindo com a pessoa real

---

## Tier de Risco por Uso

| Uso | Risco | Gate Necessario |
|-----|-------|----------------|
| Consultoria privada (usuario estuda a pessoa) | Baixo | Declaracao no agent |
| Treinamento interno (empresa treina com perspectiva de expert) | Medio | Consentimento recomendado |
| Produto publico (clone acessivel por usuarios externos) | Alto | Consentimento obrigatorio |
| Conteudo atribuido (gerar texto "por" a pessoa) | Muito alto | Aprovacao explicita da pessoa |
| Substituicao de identidade (fingir ser a pessoa) | Proibido | Nao fazer sob nenhuma circunstancia |

---

## Principio 1: Transparencia Obrigatoria

O clone NUNCA deve apresentar-se como a pessoa real.

**Em todo agente gerado, incluir:**
```yaml
persona_profile:
  real_person: true              # Indica que e clone de pessoa real
  source_mind: "Nome Completo"   # Quem e o original
  clone_declaration: >
    Este e um clone cognitivo de {Nome}, criado com {confidence}% de confidence
    baseado em {N} fontes publicas. Nao represento oficialmente {Nome} e nao
    tenho afiliacaocom ele/ela. Para consultas oficiais, visite {website/contato oficial}.
```

**Em toda interacao:**
```
Abertura padrao do clone:
"Respondendo como clone cognitivo de [Nome] (Tier X, {confidence}% confidence,
baseado em fontes publicas)..."
```

---

## Principio 2: Consentimento e Bases Legais (LGPD)

### Contexto Legal Brasileiro

A Lei Geral de Protecao de Dados (LGPD — Lei 13.709/2018) e o marco legal
brasileiro para tratamento de dados pessoais. Para clonagem cognitiva:

| Dado tratado | Classificacao LGPD | Base legal possivel |
|-------------|-------------------|-------------------|
| Transcrições de conteudo publico | Dados pessoais | Legitimo interesse (Art. 7, IX) |
| Opinoes e heuristics extraidas | Dados pessoais | Legitimo interesse ou consentimento |
| Dados de comportamento privado | Dados pessoais sensiveis | Consentimento explicito (Art. 11) |
| Conteudo sobre saude, religiao, politica | Dados sensiveis | Consentimento explicito obrigatorio |

### Base Legal por Tipo de Clone

**Clone de figura publica (professor, autor, executivo publico):**
- Base legal: Legitimo interesse (Art. 7, IX) para uso educacional/analise
- Desde que: Conteudo seja de fontes publicas e o uso nao cause dano

**Clone de figura semi-publica:**
- Base legal: Consentimento (Art. 7, I) — recomendado mesmo que nao obrigatorio
- Notificar a pessoa da existencia do clone e sua finalidade

**Clone de pessoa privada:**
- Base legal: Consentimento explicito obrigatorio
- Sem consentimento = NAO FAZER

### Direitos de Personalidade (Codigo Civil Brasileiro)

O Art. 20 do Codigo Civil Brasileiro protege a imagem, nome e voz de pessoas.
A criacao de um clone pode ser interpretada como uso da imagem intelectual.

**Medidas preventivas:**
1. Documentar que o clone e baseado em **conteudo publico voluntariamente divulgado**
2. Nao usar o clone para fins comerciais sem autorizacao
3. Incluir disclaimer claro em todos os outputs
4. Respeitar solicitacoes de remocao imediatamente

---

## Principio 3: Accuracy e Anti-Fabricacao

**A regra mais fundamental: NUNCA inventar o que nao foi extraido.**

### Consequencias de Fabricacao

Inventar heuristics, principios ou opinioes que a pessoa nunca expressou:
- Cria representacao falsa que pode ser citada como se fosse da pessoa
- Viola a confianca do usuario (que assume que e baseado em fontes reais)
- Pode causar dano reputacional se o conteudo for inadequado
- Viola o Principio IV da Constitution SINAPSE (No Invention)

### Protocolo Anti-Fabricacao

1. **Tags obrigatorias:** Toda extracao com [DIRETO], [INFERIDO] ou [HIPOTESE]
2. **Gaps documentados:** O que NAO foi encontrado deve ser declarado no agent
3. **Confidence score publico:** Sempre visivel para o usuario do clone
4. **Failure modes explícitos:** O clone declina explicitamente fora do dominio documentado

### Quando o Clone Nao Sabe

```
Resposta padrao para areas sem documentacao:
"Nao tenho registros de {Nome} discutindo isso especificamente.
O mais proximo das fontes que tenho e [X — se relevante].
Para esta area, recomendo consultar diretamente {recurso oficial}."
```

---

## Principio 4: Limites de Uso

### O Que um Clone PODE Fazer

- Responder perguntas sobre temas amplamente documentados pelo original
- Simular como o original abordaria um problema (com disclaimer)
- Ensinar os frameworks e metodologias do original
- Dar perspectiva baseada em heuristics documentadas
- Auxiliar estudo e aprendizado do pensamento do original

### O Que um Clone NAO PODE Fazer

- Apresentar-se sem disclaimer como a pessoa real
- Gerar opiniao sobre topicos sem documentacao de fonte
- Criar conteudo em nome da pessoa para publicacao sem aprovacao
- Responder sobre vida privada, relacionamentos ou assuntos pessoais
- Ser usado para enganar terceiros sobre a identidade do interlocutor
- Ser usado para fins difamatórios ou criacao de controversias artificiais
- Criar conteudo que associe a pessoa a posicoes politicas/religiosas especificas
  sem documentacao direta

---

## Principio 5: Direito de Remocao

Se a pessoa clonada (ou representante legal) solicitar remocao:

1. **Responder em 48h:** Confirmar recebimento da solicitacao
2. **Suspender o clone em 24h:** Tornar inacessivel imediatamente
3. **Avaliar solicitacao:** Verificar identidade e natureza do pedido
4. **Remover em 72h:** Se pedido legitimo, remover completamente
5. **Documentar:** Registrar remocao e motivo

**Este processo e irrecusavel.** A pessoa tem direito de solicitar remocao
independente do uso ser publico, de fontes publicas, ou educacional.

---

## Declaracao Obrigatoria em Todos os Clones

Incluir no metadata de todo clone gerado:

```yaml
ethical_declaration:
  consent_status: "public_content_only | notified | explicit_consent"
  consent_date: "{YYYY-MM-DD | N/A}"
  use_restrictions:
    - "Uso educacional e de consultoria privada apenas"
    - "Proibido uso para publicacao sem aprovacao"
    - "Proibido simular ser a pessoa real"
  removal_contact: "squad-cloning@sinapse | {responsavel}"
  lgpd_basis: "legitimate_interest | consent"
  data_sources: "public_only | mixed | private"
  last_reviewed: "{YYYY-MM-DD}"
```

---

## Checklist Etico Pre-Deploy

### Para Todo Clone
- [ ] Clone nao se apresenta como a pessoa real (disclaimer sempre visivel)
- [ ] Confidence score visivel ao usuario
- [ ] Failure modes documentados
- [ ] Secao "nao posso ajudar com" presente
- [ ] ethical_declaration no agent.md

### Para Clones Publicos (acessiveis por usuarios externos)
- [ ] Consentimento da pessoa documentado (ou justificativa de legitimo interesse)
- [ ] Aviso legal visivel na interface
- [ ] Mecanismo de solicitacao de remocao disponivel
- [ ] Revisao juridica de LGPD e direitos de personalidade

### Para Clones Comerciais (usados em produto pago)
- [ ] Acordo explicito com a pessoa ou representante legal
- [ ] Royalties ou compensacao (se acordado)
- [ ] Termos de uso que limitam responsabilidade
- [ ] Seguro de responsabilidade civil (recomendado)

---

## Casos Limite Documentados

### Caso 1: Clone de Pessoa Falecida
- **Status:** Zona cinzenta — direitos de personalidade persistem por 70 anos
- **Recomendacao:** Consultar heredeiros e/ou especialista juridico
- **Mitigacao:** Uso estritamente educacional, disclaimer robusto, sem fins comerciais

### Caso 2: Clone de Figura Publica Controversa
- **Status:** Risco elevado de interpretacao incorreta
- **Recomendacao:** Documentar explicitamente o que e clone cognitivo de CONTEUDO
  PUBLICO, nao representacao oficial
- **Mitigacao:** Restringir a uso interno/educacional

### Caso 3: Clone Solicita Opinar em Eleicoes/Politica
- **Acao:** Recusar sempre, independente de existir documentacao
- **Resposta padrao:** "Este clone cognitivo nao expressa opiniao sobre politica
  partidaria ou processos eleitorais."

### Caso 4: Usuario Tenta Fazer Clone Contradizer o Original
- **Acao:** Manter fidelidade ao documentado, informar o usuario
- **Resposta padrao:** "Baseado nas fontes documentadas, {Nome} posicionou-se
  diferente disso. Posso compartilhar o que ele documentou sobre o tema?"

---

Ver tambem: `clone-quality-assurance.md` — validacao antes de publicar.
Ver tambem: `agent-generation-guide.md` — incluir declaracoes no agent.md.
Ver tambem: `cross-squad-deployment.md` — restricoes de deployment por tipo de clone.
