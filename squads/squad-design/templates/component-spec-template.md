# Component Specification Template

## Instrucoes
Preencher para CADA componente do design system. Define visual, API, estados, acessibilidade e motion.

---

## 1. Identidade

| Campo | Valor |
|-------|-------|
| Nome | |
| Atomic Level | [Atom / Molecule / Organism] |
| Status | [Proposal / Draft / Review / Stable / Deprecated] |
| Owner | |
| Figma link | |
| Storybook link | |

## 2. Descricao
<!-- O que e este componente? Quando usar? Quando NAO usar? -->

### Quando usar
-

### Quando NAO usar
-

## 3. API (Props)

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| variant | | | | |
| size | | | | |
| disabled | boolean | false | No | |
| className | string | — | No | |
| children | ReactNode | — | | |

### Variantes
| Variant | Uso | Visual |
|---------|-----|--------|
| | | |
| | | |

### Sizes
| Size | Uso | Dimensoes |
|------|-----|-----------|
| sm | | |
| md | | |
| lg | | |

## 4. Tokens Consumidos

| Propriedade | Token | Fallback |
|-------------|-------|----------|
| Background | | |
| Text color | | |
| Border | | |
| Border-radius | | |
| Padding | | |
| Font | | |

## 5. Estados Visuais

| Estado | Background | Text | Border | Cursor | Opacity |
|--------|-----------|------|--------|--------|---------|
| Default | | | | | 1 |
| Hover | | | | pointer | 1 |
| Active | | | | pointer | 1 |
| Focus | | | | | 1 |
| Disabled | | | | not-allowed | 0.5 |
| Error | | | | | 1 |
| Loading | | | | wait | 0.7 |

## 6. Acessibilidade

### ARIA
- **Role:**
- **aria-label:**
- **aria-describedby:**
- **aria-expanded:** (se aplicavel)
- **aria-pressed:** (se aplicavel)

### Keyboard
| Tecla | Acao |
|-------|------|
| Tab | Focus |
| Enter | |
| Space | |
| Escape | |

### Focus
- **Focus visible:** [Descricao do indicador]
- **Focus order:** [Posicao relativa]
- **Tab index:** [0 / -1 / nao aplicavel]

### Screen Reader
- **Announcement:** "[O que e anunciado]"
- **State changes:** "[Como estados sao comunicados]"

## 7. Motion

| Transicao | Propriedade | Duracao | Easing |
|-----------|-------------|---------|--------|
| Hover enter | | ms | |
| Hover exit | | ms | |
| Press | | ms | |
| Focus | | ms | |
| Appear | | ms | |

### Reduced Motion
<!-- Comportamento com prefers-reduced-motion -->

## 8. Responsivo

| Breakpoint | Mudanca |
|-----------|---------|
| Mobile | |
| Tablet | |
| Desktop | |

## 9. Composicao

### Dependencias (usa)
- Componente X
- Token set Y

### Dependentes (usado por)
- Componente A
- Componente B

## 10. Exemplos de Uso

### Basico
```jsx
<Component variant="primary" size="md">
  Label
</Component>
```

### Com todas as props
```jsx
<Component
  variant="primary"
  size="lg"
  disabled={false}
  onClick={handleClick}
>
  Label
</Component>
```

### Do / Don't
| Do | Don't |
|----|-------|
| | |
| | |

## 11. Changelog

| Versao | Data | Mudanca |
|--------|------|---------|
| 1.0.0 | | Initial release |
