---
task: write-thread-content
responsavel: "@content-engineer"
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

# Task: Write Thread Content

> Escrever thread (Twitter/X ou LinkedIn) com progressao que mantem leitura ate o final.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | content-engineer (Arc) |
| **Trigger** | Producao de conteudo formato thread |
| **Input** | Espinha Dorsal, plataforma (Twitter/X ou LinkedIn), Template Contract |
| **Output** | Thread completa com tweet/post por posicao e CTA final |
| **Handoff** | → content-governor (Index) para validacao |
| **Complexity** | medium |

---

## Fundamentacao

Threads sao o formato com maior potencial de viralidade em Twitter/X. Uma thread bem escrita pode gerar milhoes de impressoes porque cada tweet e individualmente compartilhavel. A chave e que cada tweet funcione sozinho E em sequencia. Referencia: Dickie Bush — thread writing, Ship 30 for 30 — atomic essay framework.

---

## Steps

### Step 1: Escrever Tweet 1 (Hook)
O primeiro tweet determina se a thread sera lida. Formato: afirmacao forte + promessa de valor + "🧵" para sinalizar thread. Maximo 280 chars (Twitter) ou adaptado para LinkedIn.

### Step 2: Escrever Tweets de Conteudo
Cada tweet = 1 ponto. Estrutura por tweet: insight + exemplo ou dado. Numerar opcionalmente (1/, 2/...) para indicar progressao. 7-15 tweets para thread completa.

### Step 3: Criar Transicoes Entre Tweets
Cada tweet deve terminar com algo que leva ao proximo: pergunta, "mas tem mais...", "o problema e que...", revelacao parcial. Sem transicao, o leitor para no tweet 3.

### Step 4: Escrever Tweet Final (CTA)
Ultimo tweet: resumo do valor + CTA. "Se isso foi util: 1) RT o primeiro tweet 2) Siga para mais threads assim 3) Salve para referencia".

### Step 5: Escrever Tweet de Gancho Adicional
Tweet adicional (auto-reply): link relevante, recurso para download, ou convite para newsletter. Separar do CTA principal para nao competir.

### Step 6: Handoff

```yaml
handoff:
  artifact: "thread-{peca}.md"
  context: "Thread: {N} tweets, plataforma {plataforma}, hook tipo '{tipo}'"
  next: "content-governor (Index) para validacao final"
```
