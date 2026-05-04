# Accessibility Audit Checklist

## Uso
Checklist completo para auditoria WCAG 2.2 Level AA. Usar em conjunto com ferramentas automatizadas (axe-core, Lighthouse) E testes manuais. Organizado pelos 4 principios POUR.

## 1. Perceivable (Perceptivel)

### 1.1 Text Alternatives
- [ ] Todas imagens informativas tem alt text descritivo
- [ ] Imagens decorativas tem alt="" ou role="presentation"
- [ ] Icons com significado tem aria-label ou sr-only text
- [ ] Graficos complexos tem descricao longa (longdesc ou aria-describedby)
- [ ] CAPTCHAs tem alternativa acessivel

### 1.2 Time-Based Media
- [ ] Videos tem legendas (captions)
- [ ] Audio tem transcricao
- [ ] Videos pre-gravados tem audio-descricao (se necessario)

### 1.3 Adaptable
- [ ] Estrutura semantica correta (headings, lists, tables)
- [ ] Headings em ordem hierarquica (h1 → h2 → h3, sem pular)
- [ ] Landmarks ARIA presentes (main, nav, banner, contentinfo)
- [ ] Tabelas de dados com headers (th + scope)
- [ ] Formularios com labels programaticamente associados
- [ ] Conteudo faz sentido linearizado (sem CSS)

### 1.4 Distinguishable
- [ ] Contraste texto normal: >= 4.5:1
- [ ] Contraste texto grande (>= 18pt ou 14pt bold): >= 3:1
- [ ] Contraste UI components: >= 3:1
- [ ] Cor NAO e unico meio de transmitir informacao
- [ ] Audio nao toca automaticamente (ou pode ser parado)
- [ ] Texto redimensionavel ate 200% sem perda de funcionalidade
- [ ] Reflow: conteudo funciona em 320px width sem scroll horizontal
- [ ] Spacing de texto ajustavel sem perda de conteudo

## 2. Operable (Operavel)

### 2.1 Keyboard Accessible
- [ ] TODA funcionalidade acessivel por teclado
- [ ] Sem keyboard traps (exceto modals com Escape para sair)
- [ ] Tab order logico e previsivel
- [ ] Skip navigation link funcional
- [ ] Atalhos de teclado documentados (se existem)

### 2.2 Enough Time
- [ ] Timeouts podem ser estendidos, desativados ou ajustados
- [ ] Conteudo em movimento pode ser pausado, parado ou escondido
- [ ] Sem conteudo que pisca > 3x/segundo

### 2.3 Seizures and Physical Reactions
- [ ] Nenhum conteudo pisca > 3x/segundo (pode causar convulsoes)
- [ ] Motion animation pode ser desativada (prefers-reduced-motion)

### 2.4 Navigable
- [ ] Paginas tem titulos descritivos (title tag)
- [ ] Links tem proposito claro (no "clique aqui" isolado)
- [ ] Breadcrumbs ou sitemap disponivel (multiplas formas de encontrar paginas)
- [ ] **[2.4.11 NOVO] Focus Not Obscured (Minimum):** Elemento focado nao esta totalmente escondido
- [ ] **[2.4.12 NOVO] Focus Not Obscured (Enhanced):** Elemento focado totalmente visivel
- [ ] **[2.4.13 NOVO] Focus Appearance:** Indicador de foco com area >= 2px, contraste >= 3:1

### 2.5 Input Modalities
- [ ] Gestos complexos tem alternativa simples (single pointer)
- [ ] **[2.5.7 NOVO] Dragging Movements:** Alternativa para drag-and-drop
- [ ] **[2.5.8 NOVO] Target Size (Minimum):** Alvos de clique >= 24x24 CSS pixels
- [ ] Touch targets: >= 44x44px (iOS) / 48x48dp (Android)

## 3. Understandable (Compreensivel)

### 3.1 Readable
- [ ] Idioma da pagina declarado (lang="pt-BR")
- [ ] Mudancas de idioma marcadas (lang em elementos especificos)

### 3.2 Predictable
- [ ] Navegacao consistente entre paginas
- [ ] Componentes com mesma funcao identificados consistentemente
- [ ] Mudancas de contexto nao ocorrem sem acao do usuario
- [ ] **[3.2.6 NOVO] Consistent Help:** Mecanismo de ajuda na mesma posicao

### 3.3 Input Assistance
- [ ] Erros identificados e descritos em texto
- [ ] Labels ou instrucoes em inputs
- [ ] Sugestoes de correcao para erros
- [ ] Prevencao de erros em submissoes legais/financeiras (reversivel, verificavel, confirmavel)
- [ ] **[3.3.7 NOVO] Redundant Entry:** Nao pedir mesma informacao duas vezes
- [ ] **[3.3.8 NOVO] Accessible Authentication (Min):** Login sem teste cognitivo
- [ ] **[3.3.9 NOVO] Accessible Authentication (Enhanced):** Login sem reconhecimento de objetos

## 4. Robust (Robusto)

### 4.1 Compatible
- [ ] HTML valido (sem erros de parsing criticos)
- [ ] IDs unicos na pagina
- [ ] ARIA roles/states/properties validos
- [ ] Status messages comunicados com aria-live ou role="status"

## Testes Manuais Obrigatorios

### Keyboard Navigation
- [ ] Tab para frente: ordem logica
- [ ] Shift+Tab para tras: ordem reversa logica
- [ ] Enter/Space: ativa elementos interativos
- [ ] Escape: fecha modals/dropdowns
- [ ] Arrow keys: navegacao em componentes compostos (tabs, menus, radio groups)
- [ ] Home/End: primeiro/ultimo item em listas

### Screen Reader (NVDA ou VoiceOver)
- [ ] Todos headings lidos corretamente
- [ ] Landmarks anunciados
- [ ] Imagens com alt text lido corretamente
- [ ] Formularios com labels anunciados
- [ ] Tabelas com headers anunciados
- [ ] Atualizacoes dinamicas anunciadas (aria-live)
- [ ] Modals: foco entra e anuncia titulo

### Contrast Tools
- [ ] WCAG contrast ratio verificado
- [ ] APCA verificado (Lc >= 45 body, Lc >= 60 headlines)
- [ ] Simulacao de daltonismo verificada

## Verdicts
| Verdict | Criterio |
|---------|----------|
| **PASS** | 0 issues Critical, 0 Major, <= 3 Minor |
| **CONDITIONAL** | 0 Critical, <= 2 Major com fix agendado |
| **FAIL** | Qualquer Critical OU > 2 Major |
