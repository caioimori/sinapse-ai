---
task: write-microcopy-guidelines
responsavel: "@brand-voice-writer"
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

# Task: Write Microcopy Guidelines

## Metadata
- **Squad:** squad-copy
- **Agent:** brand-voice-writer (Tone)
- **Complexity:** STANDARD
- **Depends on:** brand voice, UX patterns, product
- **Feeds:** squad-design, copy-editor (Chisel)

## Objetivo
Criar guidelines de microcopy — as pequenas palavras que guiam usuarios dentro do produto. Microcopy e invisivel quando bom e frustrante quando ruim. Impacto desproporcional: poucas palavras, grande efeito.

## Entrada
- Brand voice guidelines
- Product UI/UX flows
- User research (pain points, confusions)
- Competitor product copy

## Passos

### 1. Categorizar Tipos de Microcopy
| Categoria | Exemplos | Impacto |
|-----------|----------|---------|
| Botoes e CTAs | "Salvar", "Cancelar", "Enviar" | Direto na conversao |
| Labels | Campos de formulario, menus | Usabilidade |
| Tooltips | Explicacoes on-hover | Reducao de suporte |
| Empty States | Telas sem conteudo | Onboarding/ativacao |
| Error Messages | Erros de validacao, sistema | Frustração vs. confianca |
| Success Messages | Confirmacoes de acao | Satisfacao |
| Loading States | Indicadores de progresso | Paciencia vs. abandono |
| Onboarding | Tours, hints, walkthroughs | Ativacao |
| Notifications | Push, in-app, badges | Re-engajamento |
| Placeholders | Texto dentro de inputs | Orientacao |

### 2. Principios de Microcopy
**Regras universais:**

**Clareza > Personalidade:**
- Em microcopy, ser claro e mais importante que ser divertido
- Personalidade e bonus, nunca substitui clareza
- ✅ "Email ou senha incorretos" — claro
- ❌ "Ops! Algo deu errado com suas credenciais!" — vago

**Acao > Descricao:**
- Diga o que FAZER, nao o que ACONTECEU
- ✅ "Tente novamente com outra senha"
- ❌ "Ocorreu um erro de autenticacao"

**Especifico > Generico:**
- Diga EXATAMENTE o que e necessario
- ✅ "Senha deve ter min 8 caracteres, 1 numero e 1 simbolo"
- ❌ "Senha invalida"

**Humano > Tecnico:**
- Fale como pessoa, nao como maquina
- ✅ "Nao encontramos resultados. Tente termos diferentes?"
- ❌ "Query returned 0 results. Modify search parameters."

### 3. Templates por Categoria

**Botoes e CTAs:**
```
Padrao: Verbo + Objeto
  "Salvar Alteracoes" (nao "Salvar")
  "Enviar Mensagem" (nao "Submit")
  "Criar Conta" (nao "Registrar")

Destrutivos: Verbo especifico + confirmacao
  "Excluir Projeto" → "Tem certeza? Esta acao nao pode ser desfeita."
```

**Error Messages:**
```
Padrao: [O que aconteceu] + [O que fazer]
  "Email ja cadastrado. Tente fazer login ou use outro email."
  "Arquivo grande demais (max 10MB). Reduza o tamanho e tente novamente."

NUNCA:
  - Culpar o usuario ("Voce errou")
  - Ser vago ("Algo deu errado")
  - Ser tecnico ("Error 500: Internal Server Error")
```

**Empty States:**
```
Padrao: [O que vai aparecer aqui] + [Como comecar]
  "Nenhum projeto ainda. Crie seu primeiro projeto para comecar. [Criar Projeto]"
  "Sua inbox esta vazia. Quando receber mensagens, elas aparecerão aqui."
```

**Success Messages:**
```
Padrao: [O que foi feito] + [Proximo passo opcional]
  "Projeto criado com sucesso! Adicione membros para colaborar."
  "Pagamento confirmado. Voce recebera um email com os detalhes."
```

**Loading States:**
```
Padrao: [O que esta acontecendo] ou [Dica enquanto espera]
  "Gerando seu relatorio..."
  "Quase la! Processando seus dados..."
  "Sabia que voce pode [tip]? (enquanto carrega)"
```

### 4. Microcopy x Brand Voice
**Como infundir personalidade SEM prejudicar clareza:**

| Situacao | Personalidade | Neutro |
|----------|---------------|--------|
| Sucesso | OK ✅ "Mandou bem!" | OK "Salvo com sucesso" |
| Erro | CUIDADO "Oops!" | PREFERIVEL "Nao foi possivel..." |
| Destrutivo | NUNCA humor | "Esta acao nao pode ser desfeita" |
| Dados sensiveis | NUNCA casual | "Seus dados estao protegidos" |
| Onboarding | OK ✅ "Vamos nessa!" | OK "Comecar" |

### 5. Acessibilidade em Microcopy
- Screen reader friendly (sem depender apenas de cor/icone)
- Alt text para icones com significado
- Aria labels para botoes de icone
- Error messages associadas ao campo (nao apenas topo)
- Linguagem Plain Language (nivel de leitura 6-8 serie)

## Cross-Squad Handoff
```yaml
handoffs:
  - to: squad-design
    delivers: Microcopy guidelines para implementacao
    format: Guidelines + library de exemplos + patterns
  - to: copy-editor (Chisel)
    delivers: Padroes para review de microcopy
    format: Checklist de microcopy quality
```

## Saida
- Microcopy guidelines completo
- Templates por categoria (10 categorias)
- Library de exemplos (bom/ruim)
- Acessibilidade checklist
- Quick reference card

## Validacao
- [ ] 10 categorias de microcopy cobertas
- [ ] Principios de clareza definidos
- [ ] Templates com exemplos bom/ruim por categoria
- [ ] Brand voice infundida sem prejudicar clareza
- [ ] Acessibilidade considerada
- [ ] Quick reference card prática
- [ ] Exemplos de erro e sucesso messages
- [ ] Revisado por UX/product

---

*Task operada por: brand-voice-writer (Tone)*
