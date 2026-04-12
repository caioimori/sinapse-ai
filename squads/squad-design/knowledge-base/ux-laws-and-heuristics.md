# UX Laws and Heuristics

## Nielsen's 10 Usability Heuristics

### 1. Visibility of System Status
O sistema deve sempre informar ao usuario o que esta acontecendo, com feedback apropriado em tempo razoavel.
- **Em UI:** Loading states, progress bars, confirmacoes de acao, status indicators
- **Regra:** Feedback em < 400ms (Doherty Threshold)
- **Anti-pattern:** Acao sem feedback, loading sem indicador

### 2. Match Between System and Real World
O sistema deve falar a linguagem do usuario, com palavras, frases e conceitos familiares.
- **Em UI:** Icones reconheciveis, terminologia do dominio do usuario, metaforas naturais
- **Regra:** Nunca jargao tecnico para usuario nao-tecnico
- **Anti-pattern:** "Error 500", "null reference exception"

### 3. User Control and Freedom
Usuarios frequentemente executam acoes por engano. Oferecer "saida de emergencia" clara.
- **Em UI:** Undo, back, cancel, close, desfazer
- **Regra:** Toda acao destrutiva deve ter confirmacao + undo
- **Anti-pattern:** Sem botao de voltar, sem undo, modal sem fechar

### 4. Consistency and Standards
Usuarios nao devem precisar adivinhar se palavras, situacoes ou acoes diferentes significam a mesma coisa.
- **Em UI:** Padroes de design system, mesma acao = mesmo visual, platform conventions
- **Regra:** Consistencia interna > externa, mas ambas importam
- **Anti-pattern:** Botoes com estilos diferentes para mesma acao, icones inconsistentes

### 5. Error Prevention
Melhor que boas mensagens de erro e design que previne o problema.
- **Em UI:** Validacao em tempo real, confirmacao para acoes destrutivas, constraints
- **Regra:** Inline validation > on-submit validation
- **Anti-pattern:** Formulario que so valida ao submeter, sem confirmacao de delete

### 6. Recognition Rather than Recall
Minimizar carga de memoria do usuario tornando objetos, acoes e opcoes visiveis.
- **Em UI:** Menus visiveis, recentes, sugestoes, breadcrumbs, previews
- **Regra:** Mostrar, nao forcar memorizacao
- **Anti-pattern:** Atalhos como unica forma de acessar funcao, codigos para memorizar

### 7. Flexibility and Efficiency of Use
Atalhos — invisiveis para novatos — podem acelerar a interacao do expert.
- **Em UI:** Keyboard shortcuts, search, recent items, power user features
- **Regra:** Interface funciona para novato E expert
- **Anti-pattern:** So wizard (frustra experts), so atalhos (frustra novatos)

### 8. Aesthetic and Minimalist Design
Dialogos nao devem conter informacao irrelevante ou raramente necessaria.
- **Em UI:** Cada elemento serve a um proposito, progressive disclosure, whitespace
- **Regra:** Se remover um elemento e nada piora, remova-o
- **Anti-pattern:** Dashboards lotados, formularios com 20+ campos visiveis

### 9. Help Users Recognize, Diagnose, and Recover from Errors
Mensagens de erro devem ser expressas em linguagem simples, indicar o problema e sugerir solucao.
- **Em UI:** Mensagens claras, proximas ao campo com erro, com sugestao de correcao
- **Regra:** Diga O QUE deu errado + COMO corrigir
- **Anti-pattern:** "Erro desconhecido", "Falha na operacao", codigo HTTP sem explicacao

### 10. Help and Documentation
Mesmo que o sistema possa ser usado sem documentacao, pode ser necessario fornecer ajuda.
- **Em UI:** Tooltips, onboarding, help center, contextual help
- **Regra:** Help contextual > documentacao generica
- **Anti-pattern:** FAQ como unica ajuda, sem onboarding

## Laws of UX (Jon Yablonski)

### Fitts's Law
O tempo para atingir um alvo e proporcional a distancia e inversamente proporcional ao tamanho.
- **Aplicacao:** CTAs grandes e proximos, areas de clique generosas, botoes touch min 44x44px
- **Numeros:** Desktop min 32px, mobile min 44px (iOS) / 48dp (Android)

### Hick's Law
O tempo de decisao aumenta com o numero e complexidade de opcoes.
- **Aplicacao:** Max 5-7 itens de navegacao, progressive disclosure, defaults inteligentes
- **Formula:** RT = a + b * log2(n+1) onde n = numero de opcoes

### Miller's Law
A pessoa media consegue manter 7 (±2) itens na memoria de trabalho.
- **Aplicacao:** Agrupar informacao em chunks, max 7 items em listas, phone numbers em grupos
- **Nota:** Nao e "limite de 7" — e sobre chunking eficiente

### Von Restorff Effect (Isolation Effect)
Quando multiplos objetos similares estao presentes, o que DIFERE e mais lembrado.
- **Aplicacao:** CTA diferenciado, pricing plan destacado, badges "Popular"
- **Cuidado:** Se tudo e destaque, nada e destaque

### Tesler's Law (Conservation of Complexity)
Toda aplicacao tem complexidade inerente que nao pode ser removida — so movida.
- **Aplicacao:** Absorver complexidade no sistema, nao empurrar para o usuario
- **Exemplo:** Auto-detect timezone vs pedir usuario selecionar

### Doherty Threshold
Produtividade sobe quando computador e usuario interagem em ritmo (< 400ms) que garante nenhum espera.
- **Aplicacao:** Resposta percebida < 400ms, skeleton screens, optimistic updates
- **Regra:** 0-100ms = instantaneo, 100-300ms = percebido, 300ms+ = lento

### Zeigarnik Effect
Pessoas lembram melhor de tarefas incompletas do que completas.
- **Aplicacao:** Progress bars, checklists de onboarding, "continue de onde parou"
- **Cuidado:** Nao usar para manipular (dark pattern)

### Gestalt Principles
| Principio | Descricao | Aplicacao em UI |
|-----------|-----------|----------------|
| Proximity | Elementos proximos sao percebidos como grupo | Spacing entre secoes vs dentro |
| Similarity | Elementos similares sao percebidos como grupo | Mesma cor/forma = mesma funcao |
| Continuity | Olho segue linhas e curvas | Layouts lineares, breadcrumbs |
| Closure | Mente completa formas incompletas | Icons simplificados, cards |
| Figure-Ground | Elementos percebidos como figura ou fundo | Modals, overlays, elevation |
| Common Region | Elementos em mesma regiao sao grupo | Cards, containers, sections |

## Aplicacao por Contexto

### Para Formularios
- Hick's Law: Max 5-7 campos visiveis, progressive disclosure
- Error Prevention (Nielsen #5): Validacao inline
- Recognition over Recall (#6): Placeholders, labels, autofill

### Para Navegacao
- Miller's Law: Max 7 itens principais
- Consistency (#4): Mesma posicao em todas as paginas
- Visibility (#1): Indicar pagina ativa

### Para Dashboards
- Aesthetic Minimalism (#8): Priorizar KPIs
- Von Restorff: Alertas diferenciados visualmente
- Gestalt Proximity: Agrupar metricas relacionadas

### Para Mobile
- Fitts's Law: Alvos tocaveis >= 44px, thumb zone
- Hick's Law: Simplificar opcoes
- User Control (#3): Gestos + botoes (nao so gestos)

## Referencias
- Don Norman — The Design of Everyday Things
- Jakob Nielsen — 10 Usability Heuristics (nngroup.com)
- Jon Yablonski — Laws of UX (lawsofux.com)
- Steve Krug — Don't Make Me Think
- Jesse James Garrett — Elements of User Experience
