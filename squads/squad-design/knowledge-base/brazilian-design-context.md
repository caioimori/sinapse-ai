# Knowledge Base: Brazilian Design Context

## Escopo
Mercado de design no Brasil — design systems nacionais, regulatorio (LBI, e-MAG), comunidade, salarios, desafios especificos e contexto de acessibilidade legal. Fonte: MS-002 Design System Research (2026-04-07).

---

## 1. Mercado de Design Digital no Brasil (2025)

### Tamanho e Crescimento
- **200.000+** profissionais de UX/UI design (ABEDESIGN + LinkedIn Economic Graph, 2025)
- **15-20% a.a.** de crescimento do mercado
- Aceleracao pos-pandemia: digital-first em fintechs, e-commerce, saude digital

### Centros de Design
| Cidade | Destaque |
|--------|----------|
| **Sao Paulo** | Hub principal, maioria das agencias e tech companies |
| **Florianopolis** | Polo tecnologico forte (Resultados Digitais, Ahgora, TOTVS) |
| **Belo Horizonte** | Ecossistema crescente (Hotmart, Rock Content) |
| **Recife** | Porto Digital como polo de inovacao |
| **Porto Alegre, Curitiba, Brasilia** | Comunidades ativas e crescentes |

### Salarios UX/UI Design (2025, CLT, Sao Paulo)
| Nivel | Faixa |
|-------|-------|
| Junior | R$ 3.000 - R$ 5.500 |
| Pleno | R$ 6.000 - R$ 12.000 |
| Senior | R$ 12.000 - R$ 22.000 |
| Lead / Manager | R$ 18.000 - R$ 35.000 |
| Head of Design | R$ 25.000 - R$ 50.000+ |

Salarios PJ geralmente 30-50% acima do CLT para o mesmo nivel.

---

## 2. Design Systems Brasileiros

### Nubank — NuDS (Nubank Design System)
O Nubank e referencia global em fintech design. O NuDS evoluiu de uma biblioteca minimalista para um framework multi-mercado com:
- **100+ componentes** reutilizaveis e templates de tela
- Suporte a multiplos mercados (Brasil, Mexico, Colombia, Argentina)

**Nu Sans (2025):** A Nubank lancou tipografia propria desenvolvida pela **Blackletra Type Foundry**:
- 2 tamanhos oticos (texto e display)
- 3 larguras
- 4 pesos com italicos
- **32 fontes no total**

**Impacto de tokens na pratica:** A atualizacao recente de brand colors para contas empresariais (Nubank Empresas) foi implementada em **um unico sprint** gracas a arquitetura de tokens do NuDS. Sem tokens, isso levaria semanas de refactor.

**Referencia:** building.nubank.com/design, figma.com/customers/nubank-design-system-accessible-experiences-with-figma

### Itau Unibanco — Design System
O maior banco privado da America Latina com design system robusto para seus canais digitais:
- App, internet banking, ATMs, totem, correspondente bancario
- Foco: consistencia cross-channel, acessibilidade regulatoria financeira, escala (dezenas de milhoes de usuarios diarios)

**Reformulacao digital 2025:** O Itau anunciou meta de atender **75% dos clientes de varejo exclusivamente por canais digitais** nos proximos 3 anos (vs 15% atual em 2025). Isso implica investimento significativo na evolucao do design system e na experiencia digital.

### Natura Design System (Natura &Co)
Um dos casos mais avancados de design system multi-brand no Brasil. Grupo possui:
- Natura, Avon, The Body Shop, Aesop

**Desafio tecnico:** Um sistema que suporta multiplas marcas visuais sobre mesma arquitetura. Solucao: core system de tokens e componentes "neutros" tematizados via L1 tokens de marca. O mesmo `<Button>` renderiza verde para Natura, rosa para Avon.

### VTEX Design System (Styleguide)
Plataforma de e-commerce brasileira com design system open-source. Um dos poucos DS brasileiros genuinamente open-source, usado por times de desenvolvimento de lojistas VTEX.

### RD Station (Resultados Digitais)
Lider em marketing digital no Brasil. DS interno para produtos do ecossistema (Marketing, CRM, Conversas). React-based, foco em consistencia entre produtos.

### Magazine Luiza (Magalu)
DS para unificar experiencia entre app, site e marketplace. Destaque para inclusao da "Lu" (avatar digital) como elemento do sistema de brand — integracao de IP/mascote em design system.

---

## 3. Regulatorio Brasileiro de Acessibilidade

### Lei Brasileira de Inclusao (LBI — Lei 13.146/2015)

Artigo 63:
> "E obrigatoria a acessibilidade nos sitios da internet mantidos por empresas com sede ou representacao comercial no Pais ou por orgaos de governo."

**Implicacoes para design systems:**
- Componentes DEVEM atender **WCAG AA** como minimo
- Acessibilidade digital e **obrigacao legal**, nao diferencial competitivo
- Multas podem ser aplicadas pelo Ministerio Publico
- Empresas com representacao no Brasil estao sujeitas (inclui empresas estrangeiras)

### e-MAG (Modelo de Acessibilidade em Governo Eletronico)
Versao brasileira do WCAG, publicada pelo governo federal. Atualmente baseado no **WCAG 2.0**, com recomendacoes adicionais para o contexto brasileiro.

**Todo site governamental deve seguir e-MAG.** Sites privados seguem LBI (que referencia WCAG).

Diferenca WCAG vs e-MAG:
| Aspecto | WCAG (internacional) | e-MAG (brasileiro) |
|---------|---------------------|-------------------|
| Base | W3C | Governo Federal do Brasil |
| Versao atual | 2.2 (2023) | Baseado em WCAG 2.0 |
| Obrigatoriedade | Por lei em varios paises | Governo federal (obligatorio) |
| Privados | Por LBI | Por LBI (referencia WCAG) |

### Decreto 10.645/2021
Regulamenta avaliacao de acessibilidade de sites governamentais:
- Exige **selo de acessibilidade**
- Auditorias periodicas obrigatorias
- Ranking de acessibilidade de sites governamentais

### Checklist Legal para DS Brasileiro
```
- [ ] Componentes atendem WCAG 2.2 AA (minimo legal LBI)
- [ ] Contraste de texto minimo 4.5:1 (normal) e 3:1 (grande)
- [ ] Contraste de componentes UI minimo 3:1 (1.4.11)
- [ ] Navegacao por teclado completa
- [ ] Sites governamentais: seguir e-MAG
- [ ] Documentar conformidade WCAG (VPAT/declaracao de acessibilidade)
```

---

## 4. Desafios Especificos do Brasil

### 1. Diversidade de Dispositivos Android
O Brasil tem enorme variedade de dispositivos Android de baixo custo (R$ 400-800). Implicacoes:
- Telas menores (5"-5.5" comuns vs 6"+ nos EUA)
- Menor RAM (2-4GB)
- Processadores mais lentos
- **Design systems precisam priorizar performance em low-end**

### 2. Conectividade Variavel
Muitos usuarios acessam via conexoes lentas (3G ainda significativo) ou instáveis (Wi-Fi compartilhado). Implicacoes:
- Progressive loading e skeleton screens
- Graceful degradation (app funciona com conteudo parcial)
- Service workers para caching agressivo
- **Imagens otimizadas para conexoes lentas (AVIF/WebP, lazy loading)**

### 3. PIX como Padrao de Pagamento
Desde 2020, PIX transformou checkout digital no Brasil. **120M+ usuarios** (maior adocao global proporcional). Design systems de e-commerce e fintech devem incluir patterns especificos:
- QR Code display (tamanho, contraste, loading state)
- Copia-e-cola (action + feedback de copia)
- Timer de expiracao (countdown com accessible announcement)
- Confirmacao de pagamento (success state com animacao)

### 4. WhatsApp-First Journey
Brasil e o segundo maior mercado do WhatsApp (120M+ usuarios, 2025). Muitas jornadas de usuario comecam ou terminam no WhatsApp:
- Click-to-chat buttons (pattern padrao em landing pages)
- WhatsApp share (compartilhar produto/servico via WhatsApp)
- Notificacoes via WhatsApp Business
- **Design systems devem incluir patterns de integracao com WhatsApp**

### 5. Multilingue de Facto
Embora portugues seja dominante, operacoes internacionais precisam de i18n:
- Natura, Nubank: espanhol (LATAM), ingles
- Desafio: datas (dd/mm/yyyy vs mm/dd/yyyy), moedas (R$ vs $, $ vs €)
- **Internacionalizacao como parte das foundations, nao addon tardio**

---

## 5. Comunidade Brasileira de Design

### Eventos
- **Interaction Latin America (IxDA):** Principal evento de interaction design na America Latina
- **Design Sprint Brasil:** Comunidade focada em metodologias de design
- **UX Conf BR:** Conferencia de UX brasileira
- **Figma Community Brasil:** Meetups e eventos de usuarios Figma

### Publicacoes e Comunidades
- **UX Collective Brasil** (brasil.uxdesign.cc): Blog coletivo com milhares de artigos em portugues
- **Design Team Brasil:** Comunidade no Slack
- **Ladies that UX:** Capitulos em SP, RJ, BH, POA, Floripa
- **Design no Brasil** (designe.com.br): Recursos, salarios, comunidade

### Formacao
| Escola | Formato | Foco |
|--------|---------|------|
| Mergo (Pedro Aquino) | Online | UX Research e Design |
| Tera | Bootcamp | Product Design, UX |
| Digital House | Presencial/Online | UX/UI |
| Domestika | Online | Cursos avulsos |
| Alura | Online | Design Digital, Figma |

---

## 6. Brasilian DS Checklist (Requisitos Especificos)

```
Legal:
- [ ] WCAG 2.2 AA compliance (LBI obrigatorio)
- [ ] e-MAG compliance (sites governamentais)
- [ ] LGPD compliance em formularios (consentimento claro)
- [ ] Declaracao de acessibilidade publicada

UX Patterns Brasileiros:
- [ ] PIX payment pattern (QR code, copia-e-cola, timer, success)
- [ ] WhatsApp integration pattern (click-to-chat, share)
- [ ] Boleto bancario pattern (se aplicavel)
- [ ] CPF/CNPJ input masks

Performance (low-end devices):
- [ ] Testado em Android mid-range (Moto G ou similar)
- [ ] Funciona em 3G (simular com DevTools throttling)
- [ ] JS bundle < 300KB initial
- [ ] Imagens lazy-loaded com skeleton placeholder

Internacionalizacao (se multi-mercado):
- [ ] date-fns com locale pt-BR
- [ ] Intl.NumberFormat para moedas (R$, MXN, COP)
- [ ] RTL support (para expansao futura)
- [ ] Strings externalizadas (nao hardcoded em portugues)
```

---

## Referencias
- ABEDESIGN — abedesign.org.br
- Lei Brasileira de Inclusao (Lei 13.146/2015) — planalto.gov.br
- e-MAG — emag.governoeletronico.gov.br
- Decreto 10.645/2021 — planalto.gov.br
- Nubank Design — building.nubank.com/design
- Figma Customers: Nubank — figma.com/customers/nubank
- UX Collective Brasil — brasil.uxdesign.cc
- MS-002 Design System Research — SINAPSE (2026-04-07)
