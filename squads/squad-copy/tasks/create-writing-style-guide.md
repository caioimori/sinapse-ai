---
task: create-writing-style-guide
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

# Task: Create Writing Style Guide

## Metadata
- **Squad:** squad-copy
- **Agent:** brand-voice-writer (Tone)
- **Complexity:** STANDARD
- **Depends on:** brand voice, tone spectrum
- **Feeds:** todos os writers do squad, copy-editor (Chisel)

## Objetivo
Criar writing style guide que padroniza aspectos tecnicos e estilisticos da escrita — garantindo consistencia de gramatica, formatacao, terminologia e convencoes alem da voice.

## Entrada
- Brand voice guidelines
- Canais ativos
- Mercado/idiomas de operacao
- Convencoes existentes (se houver)

## Passos

### 1. Convencoes Gramaticais
**Definir padroes para:**

| Elemento | Decisao | Exemplo |
|----------|---------|---------|
| Oxford comma | Sim/Nao | "A, B, e C" ou "A, B e C" |
| Contracao | Quando usar | "voce" vs "você" |
| Voz ativa/passiva | Preferencia | "Nos criamos" vs "Foi criado por nos" |
| Pessoa | 1a/2a/3a | "Voce pode" vs "O usuario pode" |
| Tempo verbal | Padrao | Presente > Futuro > Passado |
| Genero | Neutro/inclusivo? | Como enderecar diversidade |

### 2. Formatacao e Estilo
**Titulos e headings:**
- Title Case ou Sentence case?
- Pontuacao em headings (sim/nao)
- Hierarquia (H1 → H2 → H3)

**Numeros:**
- Escrever por extenso ate 10 (ou outro threshold)
- Porcentagens: "50%" ou "cinquenta por cento"
- Moeda: "R$ 100" ou "R$100" ou "100 reais"
- Datas: "13 de marco de 2026" ou "13/03/2026"
- Horarios: "14h" ou "2 PM" ou "14:00"

**Listas:**
- Bullets: quando usar (listas nao ordenadas)
- Numeros: quando usar (sequencias, rankings)
- Pontuacao em itens de lista
- Capitalizacao em itens de lista

**Links e CTAs:**
- Como formatar links no texto
- Comprimento maximo de CTA text
- Capitalizacao de botoes

### 3. Terminologia
**Glossario da marca:**
```
TERMO OFICIAL      | NAO USE
produto             | ferramenta, software
plataforma          | app, aplicativo
cliente             | usuario (exceto contexto tecnico)
equipe              | time, staff
investimento        | custo, gasto
parceiro            | fornecedor, vendor
```

**Terminologia tecnica:**
- Quando usar termos tecnicos (nunca em marketing, ok em docs)
- Como explicar termos necessarios
- Acronimos: definir na primeira mencao

### 4. Convencoes por Canal
**Email:**
- Subject line capitalization
- Saudacao padrao
- Assinatura padrao
- Uso de emojis (sim/nao, quais)

**Social Media:**
- Hashtags: quantas, quais
- @mentions: quando
- Emojis: frequencia e contexto
- Abreviacoes aceitas

**Website:**
- Meta descriptions: comprimento, formato
- Alt text: como escrever
- Microcopy: botoes, labels, tooltips

**Blog:**
- Comprimento ideal de post
- Estrutura de post (intro, body, conclusion)
- Featured image alt text
- Author bio format

### 5. Acessibilidade e Inclusao
**Linguagem inclusiva:**
- Termos neutros de genero
- Evitar capacitismo ("cego a", "surdo a")
- Representatividade em exemplos
- Linguagem simples (Plain Language)

**Acessibilidade de conteudo:**
- Nivel de leitura alvo (Flesch-Kincaid)
- Alt text obrigatorio para imagens
- Contraste de cores em texto sobre imagem
- Subtitulos em videos

### 6. Compilar o Style Guide
**Estrutura do documento:**
```
1. INTRODUCAO
   - Proposito do guia
   - Para quem e (writers, designers, devs)

2. BRAND VOICE (resumo)
   - Link para voice guidelines completo

3. GRAMATICA E ESTILO
   - Convencoes gramaticais
   - Formatacao

4. TERMINOLOGIA
   - Glossario
   - Termos tecnicos

5. POR CANAL
   - Convencoes especificas por canal

6. ACESSIBILIDADE
   - Linguagem inclusiva
   - Acessibilidade de conteudo

7. QUICK REFERENCE
   - Cheat sheet de 1 pagina
```

## Cross-Squad Handoff
```yaml
handoffs:
  - to: copy-editor (Chisel)
    delivers: Style guide como referencia de edicao
    format: Documento completo + cheat sheet
  - to: squad-design
    delivers: Convencoes de UX writing
    format: Secao de microcopy + acessibilidade
```

## Saida
- Writing style guide completo
- Glossario de terminologia
- Cheat sheet (1 pagina)
- Convencoes por canal
- Acessibilidade guidelines

## Validacao
- [ ] Convencoes gramaticais definidas
- [ ] Formatacao padronizada
- [ ] Glossario com min 15 termos
- [ ] Convencoes por canal (min 4 canais)
- [ ] Acessibilidade e inclusao cobertos
- [ ] Cheat sheet de referencia rapida
- [ ] Exemplos praticos incluidos
- [ ] Aprovado por stakeholders

---

*Task operada por: brand-voice-writer (Tone)*
