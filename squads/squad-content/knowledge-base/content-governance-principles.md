# Content Governance Principles

> Principios de governanca que regulam producao, publicacao e manutencao de conteudo.

---

## Os 7 Principios de Governanca

### 1. Quality Gate Obrigatorio
Nenhum conteudo e publicado sem passar por pelo menos 1 gate de qualidade (Index). Conteudo sensivel passa por 2 gates.

### 2. Template Contract Compliance
Todo conteudo deve estar dentro dos limites do Template Contract. Violacao = rejeicao automatica.

### 3. Brand Consistency
Todo conteudo deve estar alinhado com brand voice, visual guidelines e posicionamento. Desvios sao flagged e corrigidos antes da publicacao.

### 4. Compliance e Legal
Em setores regulados, conteudo passa por validacao de compliance. Claims sem evidencia, promessas sem disclaimer, e dados sem fonte sao rejeitados.

### 5. Rastreabilidade
Cada peca de conteudo e rastreavel: quem produziu, quando, qual brief originou, quem aprovou, quando publicou. Taxonomia e metadados completos.

### 6. Feedback Loop
Toda rejeicao gera feedback estruturado. Padroes de rejeicao geram ajustes sistemicos. O sistema aprende e melhora.

### 7. Auto-Aprendizado
Preferencias do cliente, padroes de performance e insights de audiencia sao documentados e atualizados continuamente. O sistema evolui com cada ciclo.

---

## Matriz RACI

| Atividade | Arc (Produz) | Morph (Adapta) | Index (Valida) | Nexus (Orquestra) |
|-----------|:-----------:|:--------------:|:--------------:|:-----------------:|
| Produzir conteudo | R | C | I | A |
| Adaptar por plataforma | C | R | I | A |
| Validar qualidade | I | I | R | A |
| Aprovar publicacao | I | I | R | A |
| Monitorar performance | I | I | I | A |

R=Responsible, A=Accountable, C=Consulted, I=Informed

---

## Fluxo de Aprovacao

```
Nivel 1 (Padrao): Arc → Index (1 gate) → Publicacao
Nivel 2 (Sensivel): Arc → Index → Review Adicional → Publicacao
Nivel 3 (Crise): Arc → Index → Nexus → Stakeholder → Publicacao
```

---

---

## Content Audit — Processo Completo

Revisao sistematica de todo conteudo existente. Minimo anualmente, idealmente semestralmente.

```
1. INVENTARIO
   ├── Listar todas as URLs/pecas de conteudo
   ├── Ferramentas: Screaming Frog (crawl), GA4 export, CMS export
   └── Dados: URL, titulo, tipo, data, autor, categoria

2. ANALISE
   ├── Performance: trafego, engajamento, conversao
   ├── SEO: posicao, keywords, backlinks
   ├── Qualidade: precisao, atualidade, completude
   ├── Brand: alinhamento com voz, visual, valores
   └── Tecnico: links quebrados, imagens, mobile

3. CLASSIFICACAO
   ├── MANTER: conteudo de alta performance, atualizado
   ├── ATUALIZAR: bom conteudo mas desatualizado ou com gaps
   ├── CONSOLIDAR: multiplas pecas sobre o mesmo tema → fundir
   ├── REMOVER: conteudo sem trafego, desatualizado, duplicado
   └── CRIAR: gaps identificados (temas sem cobertura)

4. PRIORIZACAO
   ├── Quick wins: atualizacoes simples que geram impacto imediato
   ├── Investimentos: projetos maiores com retorno a medio prazo
   └── Manutencao: trabalho regular de higiene

5. EXECUCAO + TRACKING
   ├── Plano de acao com responsaveis e deadlines
   ├── Monitoramento de impacto pos-mudancas
   └── Documentacao para proximo audit
```

---

## Content QA Checklist Pre-Publicacao

```
EDITORIAL:
[ ] Titulo segue formula comprovada e inclui keyword
[ ] Introducao tem hook nos primeiros 100 palavras
[ ] Headings em hierarquia correta (H2 → H3 → H4)
[ ] Paragrafos < 5 linhas
[ ] Sem erros gramaticais ou ortograficos
[ ] Tom consistente com brand voice
[ ] CTA claro e especifico
[ ] Fontes citadas / fact-checked

SEO:
[ ] Keyword primaria no titulo, H1, primeiro paragrafo
[ ] Meta title < 60 chars, inclui keyword
[ ] Meta description < 160 chars, inclui keyword + CTA
[ ] URL slug curto e descritivo
[ ] Internal links (3-5 minimo)
[ ] External links para fontes autoritativas
[ ] Alt text em todas as imagens
[ ] Schema markup aplicado (se aplicavel)

VISUAL:
[ ] Imagem destaque de alta qualidade
[ ] Imagens otimizadas (< 200KB, formato WebP)
[ ] Quebras visuais a cada 300-500 palavras
[ ] Mobile preview verificado
[ ] Acessibilidade (contraste, tamanho de texto)

TECNICO:
[ ] Links funcionando (nenhum 404)
[ ] Tracking configurado (UTMs, eventos GA4)
[ ] Open Graph tags corretas (titulo, descricao, imagem)
[ ] Twitter Card tags corretas
[ ] Canonical URL definida
[ ] Redirect configurado se URL mudou
```

---

## Acessibilidade de Conteudo (WCAG)

15% da populacao mundial tem alguma deficiencia. Conteudo acessivel e obrigatorio por lei em muitos paises.

| Principio WCAG | Aplicacao em Conteudo |
|-----------|----------------------|
| **Perceptivel** | Alt text em imagens, legendas em videos, transcricoes de audio |
| **Operavel** | Navegacao por teclado, links descritivos (nao "clique aqui") |
| **Compreensivel** | Linguagem clara, abreviacoes explicadas, layout consistente |
| **Robusto** | HTML semantico, headings hierarquicos, compativel com leitores de tela |

**Checklist WCAG para conteudo:**
- Alt text descritivo em todas as imagens
- Legendas (closed captions) em todos os videos
- Transcricoes de episodios de podcast
- Contraste de cor minimo 4.5:1 para texto
- Links com texto descritivo (nao "clique aqui")
- Headings em ordem hierarquica (H1 → H2 → H3)
- Fontes legiveis (minimo 16px para body text)

---

## Linguagem Inclusiva

**Principios praticos:**
- Evitar linguagem que assume genero (preferir "pessoas" a "os profissionais")
- Usar linguagem neutra quando possivel (PT-BR: "profissionais de marketing" vs "os marketeiros")
- Representar diversidade em imagens e exemplos
- Evitar estereotipos em case studies e ilustracoes
- Linguagem person-first para deficiencias ("pessoa com deficiencia" vs "deficiente")

---

## Revisao Legal — Aspectos Essenciais

| Aspecto | Regra |
|---------|-------|
| **Copyright** | Nao usar imagens/textos sem licenca. Usar bancos (Unsplash, Pexels) ou criar |
| **Disclosure** | Conteudo patrocinado DEVE ser claramente identificado (#publi, "patrocinado por") |
| **Claims** | Evitar claims nao comprovaneis ("melhor do mercado", "garantido"). Adicionar disclaimers |
| **Dados de terceiros** | Citar fontes ao usar estatisticas. Verificar licenca de uso |
| **Depoimentos** | Devem ser reais. Resultados atipicos precisam de disclaimer |
| **LGPD** | Captura de dados (formularios, cookies) precisa de consentimento explicito |
| **Direito de imagem** | Fotos de pessoas precisam de autorizacao (model release) |
| **CONAR** | Autorregulacao brasileira de publicidade. Pode recomendar alteracao ou suspensao |

---

## Referências

- Kristina Halvorson — Content Strategy for the Web (2009/2012)
- Content Strategy Alliance — Governance frameworks
- Mailchimp Content Style Guide — Standards reference
- WCAG 2.1 Guidelines — W3C
- CONAR — Codigo Brasileiro de Autorregulamentacao Publicitaria
- LGPD (Lei 13.709/2018) — ANPD
