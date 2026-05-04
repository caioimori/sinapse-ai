---
task: create-event-branding
responsavel: "@brand-collateral-designer"
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

# Task: Create Event Branding System

> Projetar sistema de branding para eventos — presenciais, virtuais e híbridos.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | brand-collateral-designer (Vellum) |
| **Co-agents** | brand-identity-designer (Iris) direção visual, brand-creative-engineer (Forge) assets, brand-motion-vfx (Flux) motion |
| **Trigger** | Quando marca realiza eventos (conferências, workshops, meetups, feiras, lançamentos) |
| **Input** | Brand guidelines completos, tipo de evento, público esperado |
| **Output** | `event-branding-system.md` + templates |
| **Handoff** | → brand-compiler (Atlas) para inclusão no brandbook |

---

## Steps

### Step 1: Classificar Tipo de Evento
Diferentes tipos exigem diferentes níveis de branding:

| Tipo | Duração | Público | Nível de Branding | Exemplos |
|------|---------|---------|-------------------|----------|
| **Flagship** | 1-3 dias | 500-5000+ | Premium (100% custom) | Conferência anual, summit |
| **Série** | Recorrente | 50-500 | Sistema (templates + custom) | Meetups mensais, webinars |
| **Parceria** | Variável | Variável | Co-branded (guidelines) | Patrocínio, sponsorship |
| **Interno** | Variável | Equipe | Padrão (templates) | Town hall, treinamento |
| **Pop-up** | Horas-dias | Variável | Impacto (bold, efêmero) | Launch, experiencial |
| **Virtual** | Horas | Variável | Digital-first | Webinar, live, online conf |
| **Híbrido** | Variável | Variável | Dual (físico + digital) | Conferência transmitida |

### Step 2: Definir Hierarquia Visual do Evento

**Sistema de naming:**
```
{MARCA} {NOME DO EVENTO} {EDIÇÃO/ANO}
Exemplo: ACME Summit 2026
```

**Relação marca-mãe vs evento:**

| Modelo | Uso | Visual |
|--------|-----|--------|
| **Branded event** | Evento é extensão da marca | Cores + tipografia da marca |
| **Sub-branded** | Evento tem identidade própria dentro da marca | Logo derivado + paleta expandida |
| **Co-branded** | Evento com parceiros | Lockup com regras de proporção |
| **White-label** | Evento para cliente | Marca do cliente + "powered by" |

### Step 3: Projetar Touchpoints Presenciais

| Touchpoint | Spec | Material | Entregável |
|-----------|------|----------|-----------|
| **Backdrop/Stage** | {largura × altura} | Tecido tensionado / LED | Arte + spec de produção |
| **Banner/Roll-up** | 80×200cm ou 100×200cm | Lona/vinil | PDF pronto para gráfica |
| **Crachá/Badge** | 90×55mm (frente) + 90×120mm (com lanyard) | PVC ou papel grosso | PDF + dados variáveis |
| **Lanyard** | 20mm largura, 90cm circunferência | Poliéster sublimado | Arte + spec |
| **Sinalização/Wayfinding** | Variável | Adesivo/placa/foam | Kit de sinalização |
| **Totem/Stand** | 60×160cm ou custom | Estrutura + impressão | Arte + spec 3D |
| **Mesa de recepção** | 120-180cm largura | Adesivo wrap ou tecido | Arte wrap |
| **Palco backdrop** | {conforme palco} | LED/projeção/print | Arte + motion loops |
| **Lounge branding** | Mesas, almofadas, totens | Variados | Mockups + arte |
| **Floor graphics** | Variável | Vinil adesivo antiderrapante | Arte + spec |
| **Kit participante** | Sacola/pasta + brindes | Variados | Design de cada item |

### Step 4: Projetar Touchpoints Digitais

| Touchpoint | Spec | Formato | Entregável |
|-----------|------|---------|-----------|
| **Landing page** | Responsive | Web (Figma/HTML) | Template + conteúdo |
| **Email convite** | 600px largura | HTML email | Template + copy |
| **Social announcement** | Feed + Stories | PNG/JPG + MP4 | Série de posts |
| **Virtual background** | 1920×1080 | PNG | 3-5 variações |
| **Slide template** | 16:9 | PPTX/Google Slides/Keynote | 10-15 layouts master |
| **Stream overlay** | 1920×1080 | PNG com alpha | Lower thirds, cards, frames |
| **Waiting screen** | 1920×1080 | MP4 loop | Animação com countdown |
| **Q&A/Poll cards** | 1920×1080 | PNG/HTML | Templates |
| **Certificate** | A4 landscape | PDF gerável | Template + dados variáveis |
| **Post-event recap** | Feed + carousel | PNG/JPG | Templates |

### Step 5: Definir Sistema de Cores para Eventos

| Abordagem | Quando | Como |
|-----------|--------|------|
| **Cores da marca** | Evento = extensão direta da marca | Paleta idêntica ao brand system |
| **Paleta expandida** | Evento precisa de distinção | Core colors + 2-3 accent colors exclusivas |
| **Paleta sazonal** | Evento recorrente com edições | Core colors + accent color que muda por edição |
| **Paleta temática** | Evento com tema forte | Inspirada no tema, com core brand color como âncora |

**Regra:** Independente da abordagem, a cor primária da marca SEMPRE presente em ≥30% do material.

### Step 6: Projetar Experiências Sensoriais no Evento

| Sentido | Elemento | Spec | Responsável |
|---------|----------|------|------------|
| **Visual** | Iluminação, projeções, décor | Cor de luz = brand colors, gobos | Produção + Brand |
| **Auditivo** | Playlist, audio logo nos transitions, background | Curadoria alinhada com sonic identity | Echo + Produção |
| **Olfativo** | Difusor na recepção/lounge | Scent da marca (se definido) | Produção |
| **Tátil** | Materiais premium em brindes/badges | Papel texturizado, soft-touch | Design + Produção |
| **Gustativo** | Coffee break, drinks, snacks | Alinhados com brand palette (cor) e personality | Catering + Brand |

### Step 7: Criar Timeline de Produção

| Milestone | Semanas Antes | Entregáveis |
|-----------|--------------|-------------|
| Brand brief do evento | -12 | Brief aprovado |
| Identidade do evento | -10 | Logo/visual + paleta |
| Materiais digitais | -8 | Landing page, social, email |
| Materiais impressos | -6 | Artes finalizadas para gráfica |
| Produção gráfica | -4 | Envio para produção |
| Motion/Stream assets | -3 | Overlays, waiting screens, loops |
| Sinalização + montagem | -1 | Kit completo para venue |
| Evento | 0 | Execução |
| Post-event content | +1 | Recap, certificados, thank you |
| Debrief + arquivo | +2 | Todos os assets arquivados |

### Step 8: Criar Checklist de QA de Evento

**Pré-evento:**
- [ ] Logo do evento aprovado e em todos os materiais
- [ ] Cores corretas (verificar CMYK para print, HEX para digital)
- [ ] Tipografia correta em todos os materiais
- [ ] Crachás testados (legibilidade a 1.5m)
- [ ] Sinalização de wayfinding completa e lógica
- [ ] Landing page funcionando + mobile responsive
- [ ] Stream setup testado (overlays, transitions, audio)
- [ ] Slide template testado com conteúdo real
- [ ] Materiais impressos revisados (typos, bleeds, safe zones)
- [ ] Kit de fotos/vídeo briefado (enquadramento, ângulos)

**Durante evento:**
- [ ] Backdrop alinhado e iluminado
- [ ] Stream com branding consistente
- [ ] Social media real-time seguindo templates
- [ ] Fotografo com briefing de brand guidelines

**Pós-evento:**
- [ ] Fotos editadas com tratamento de marca
- [ ] Recap content publicado em 48h
- [ ] Certificados enviados em 1 semana
- [ ] Thank you email enviado em 24h
- [ ] Assets arquivados no DAM
- [ ] Debrief documentado

### Step 9: Handoff
```yaml
handoff:
  to: brand-compiler (Atlas)
  artifact: event-branding-system.md
  context: "Sistema completo de event branding com touchpoints presenciais, digitais, sensoriais e timeline"
  also_to:
    - brand-creative-engineer (Forge): "Produzir assets de evento"
    - brand-motion-vfx (Flux): "Motion assets para stream e palco"
    - brand-sonic-designer (Echo): "Audio para transições e ambientação"
  next: "Atlas inclui no brandbook como capítulo de Event Branding"
```
