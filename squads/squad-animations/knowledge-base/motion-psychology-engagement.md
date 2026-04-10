# Motion Psychology & User Engagement

> Como animacao afeta o cerebro, a atencao e o comportamento do usuario.
> Principios de psicologia cognitiva aplicados a motion design web.

---

## 1. Por Que Animacao Funciona

O cerebro humano esta programado para detectar movimento — e um instinto de sobrevivencia
herdado de milhoes de anos de evolucao. Na web, animacao:

- **Captura atencao involuntaria** — movimento no campo periferico e impossivel de ignorar
- **Cria modelos mentais** — transicoes ajudam o usuario a entender relacoes espaciais
- **Reduz carga cognitiva** — mudancas animadas sao mais faceis de processar que instantaneas
- **Gera emocao** — ritmo, tempo e estilo de motion evocam sentimentos especificos
- **Aumenta percepcao de qualidade** — sites com motion bem feito sao percebidos como mais profissionais

---

## 2. Regras Cognitivas

### Regra dos 3 Segundos
O usuario decide em 3 segundos se fica ou sai. A animacao do hero section DEVE:
- Ser visivel em < 1s (nao bloquear conteudo)
- Causar impacto emocional imediato
- Sugerir que "tem mais" abaixo (scroll invitation)

### Lei de Hick (Tempo de Decisao)
Mais opcoes = mais tempo para decidir. Animacao ajuda a:
- Guiar o olho para o CTA principal (staging)
- Revelar opcoes progressivamente (stagger)
- Reduzir overwhelm visual

### Lei de Fitts (Target Acquisition)
Alvos maiores e mais proximos sao mais faceis de clicar. Animacao pode:
- Expandir botoes no hover (affordance)
- Magnetizar o cursor para o alvo
- Indicar area clicavel via motion

### Efeito Von Restorff (Isolation Effect)
Coisas diferentes sao lembradas. Animacao diferenciada em UM elemento faz ele se destacar:
- CTA com bounce enquanto resto e estatico
- Card com hover 3D enquanto outros sao flat
- Secao com parallax enquanto resto e scroll normal

### Gestalt de Movimento Comum
Elementos que se movem juntos sao percebidos como grupo:
- Cards de mesma categoria animam juntos
- Stagger unifica grupo visual
- Direction compartilhada = pertencimento

---

## 3. Emocao por Tipo de Motion

| Tipo de Motion | Emocao Evocada | Uso Ideal |
|---------------|---------------|-----------|
| Lento e suave | Calma, confianca, luxo | Marcas premium, wellness, finance |
| Rapido e bouncy | Energia, diversao, juventude | Startups, games, e-commerce |
| Linear e preciso | Eficiencia, tecnologia | SaaS, dashboards, tools |
| Organico e fluido | Naturalidade, creatividade | Arte, portfolio, lifestyle |
| Cinematico e lento | Drama, importancia, exclusividade | Lancamentos, luxury brands |
| Glitch e interrompido | Ousadia, rebeldia, tech | Gaming, music, streetwear |
| Loop hipnotico | Meditacao, fascinacao, retencao | Backgrounds, loading, ambient |

---

## 4. Dopamine Loops em Micro-Interactions

Micro-interactions bem desenhadas criam pequenas doses de dopamina que:
- Recompensam cada acao do usuario (click → feedback visual)
- Criam curiosidade sobre "o que acontece se eu..."
- Incentivam exploracao (hover effects revelam conteudo)

### Pattern: Curiosity Gap via Motion
1. Revelar parcialmente (blur, clip-path, fade parcial)
2. Usuario interage para ver mais
3. Reveal completo com animacao satisfatoria
4. Repeat em proxima secao

### Pattern: Progressive Disclosure
1. Mostrar minimo necessario (clean)
2. Expandir com animacao ao interagir
3. Cada nivel revela mais com motion reward

---

## 5. Retencao e Tempo no Site

Animacoes que aumentam tempo no site:
- **Scroll storytelling** — usuario quer ver "o que vem depois"
- **Interactive elements** — usuario experimenta hovering, clicking
- **Loading transitions** — mascarar loading com animacao manteem engajamento
- **Page transitions** — transicoes suaves eliminam o "impulso de sair"
- **Parallax depth** — cria sensacao de exploracao espacial

Animacoes que DIMINUEM tempo no site:
- **Blocking animations** — conteudo aparece so depois da animacao
- **Excessive motion** — causa fadiga visual e nausea
- **Slow transitions** — usuario sente que o site e lento
- **Autoplay audio/video** — irrita e causa saida imediata

---

## 6. A Curva de Complexidade

```
                    ✓ Sweet spot
                   /|
Engagement        / |
                 /  |
                /   |
    ___________/    |_____________
              |     |
   Boring     |     |  Overwhelming
   (no motion)|     |  (too much)
              |     |
    ──────────┴─────┴──────────── Complexity
```

- **Pouca animacao:** Site parece morto, sem personalidade
- **Sweet spot:** Motion com proposito, hierarquia clara, feeling coeso
- **Muita animacao:** Nauseante, confuso, distrai do conteudo

**Regra pratica:** Se voce remover a animacao e o site perder funcionalidade, a animacao e necessaria.
Se perder apenas "wow", use com moderacao.

---

## 7. Acessibilidade Cognitiva

- **prefers-reduced-motion:** ~30% dos usuarios tem sensibilidade a motion
- **Disturbios vestibulares:** Parallax e rotacao podem causar nausea
- **TDAH:** Animacoes loop podem distrair do conteudo
- **Epilepsia:** Flash > 3/segundo pode causar convulsoes (WCAG)

### Abordagem Inclusiva
1. Toda animacao tem fallback estatico
2. `prefers-reduced-motion: reduce` → animacoes simplificadas (fade only)
3. Botao de pause para animacoes continuas
4. Parallax maximo 50px de diferenca (evitar extremos)
5. Nunca depender de animacao para transmitir informacao critica
