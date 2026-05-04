# Easing Functions Reference

> Referencia completa de easing functions para animacoes web.

---

## Cubic-Bezier Essenciais

| Nome | Curva | Sensacao | Uso |
|------|-------|---------|-----|
| ease-out-sine | `(0.39, 0.575, 0.565, 1)` | Suave, sutil | Micro-interactions |
| ease-out-quad | `(0.25, 0.46, 0.45, 0.94)` | Natural, confortavel | Transitions padrao |
| ease-out-cubic | `(0.33, 1, 0.68, 1)` | Responsivo, confiante | Entradas de elementos |
| ease-out-quart | `(0.25, 1, 0.5, 1)` | Rapido e refinado | Scroll reveals |
| ease-out-expo | `(0.16, 1, 0.3, 1)` | Muito rapido inicio | Page transitions |
| ease-out-back | `(0.34, 1.56, 0.64, 1)` | Overshoot, playful | CTA, notificacoes |
| ease-in-out-quart | `(0.76, 0, 0.24, 1)` | Simetrico, elegante | State changes |
| ease-in-out-back | `(0.68, -0.6, 0.32, 1.6)` | Dramatico, bounce duplo | Modais, drawers |
| ease-in-expo | `(0.7, 0, 0.84, 0)` | Lento→rapido | Exits, dismiss |

---

## Spring Physics

Simulacao de mola sem duracao fixa:

| Config | Sensacao | mass | stiffness | damping |
|--------|---------|------|-----------|---------|
| Snappy | Rapido, preciso | 1 | 300 | 30 |
| Gentle | Suave, organico | 1 | 100 | 15 |
| Bouncy | Elastico, fun | 1 | 200 | 10 |
| Heavy | Pesado, dramatico | 3 | 200 | 25 |
| Wobbly | Gelatinoso | 1 | 150 | 8 |

### GSAP Spring
```javascript
gsap.to(el, { x: 100, ease: 'elastic.out(1, 0.3)', duration: 1 });
```

### Framer Motion Spring
```jsx
<motion.div animate={{ x: 100 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }} />
```

---

## Stagger Patterns

| Pattern | Delay Formula | Efeito |
|---------|--------------|--------|
| Sequential | `i * 50ms` | Cascata linear |
| From center | `abs(i - mid) * 50ms` | Expande do centro |
| From edges | `(mid - abs(i - mid)) * 50ms` | Converge para centro |
| Random | `random(0, 200)ms` | Organico, natural |
| Grid (2D) | `(row + col) * 30ms` | Onda diagonal |

---

## Regra de Ouro

- **Entradas:** ease-OUT (chega rapido, freia suave)
- **Saidas:** ease-IN (comeca devagar, acelera fora)
- **Mudanca de estado:** ease-IN-OUT (suave nos dois lados)
- **Scroll-driven:** NONE (linear — o scroll E o easing)
- **Loop/ambient:** LINEAR (constante, sem interrupcao)
