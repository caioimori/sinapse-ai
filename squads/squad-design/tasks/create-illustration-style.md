---
task: create-illustration-style
responsavel: "@dx-ui-designer"
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

# Task: Create Illustration Style

## Metadata
- **Squad:** squad-design
- **Agent:** Canvas (dx-ui-designer)
- **Complexity:** Standard

## Objetivo
Definir o estilo de ilustracao do produto — criar guidelines para ilustracoes que complementam a UI mantendo consistencia com brand e tom visual.

## Entrada
- Brand guidelines (estilo, personalidade)
- Icon system (para coerencia)
- Use cases de ilustracao
- Tone of voice do produto

## Passos

### 1. Definir Estilo Visual
| Dimensao | Opcoes | Decisao |
|----------|--------|---------|
| Complexidade | Minimal / Moderate / Detailed | |
| Perspectiva | Flat / Isometric / 3D-ish | |
| Estilo humano | Abstract / Geometric / Realistic | |
| Cor | Monocromatico / Limitado / Full | |
| Traço | Sem traço / Fine / Bold | |
| Textura | Clean / Grain / Textured | |

### 2. Definir Uso
| Contexto | Tipo | Tamanho | Frequencia |
|----------|------|---------|-----------|
| Empty states | Spot illustration | 200-300px | Comum |
| Onboarding | Scene illustration | 300-400px | Pontual |
| Error pages | Feature illustration | 400-600px | Raro |
| Features | Spot illustration | 150-250px | Comum |
| Hero sections | Hero illustration | Full-width | Pontual |
| Blog/content | Inline illustration | Varies | Comum |

### 3. Paleta de Cores
- Derivar da paleta de brand tokens
- Limitar a 4-6 cores primarias + tints
- Definir opcao monocromatica para dark mode
- Garantir contraste adequado com backgrounds

### 4. Guidelines de Consistencia
- **Proporcoes:** Mesma escala de personagens/objetos
- **Stroke:** Mesmo peso e estilo do icon system
- **Cantos:** Consistente com border-radius do sistema
- **Grid:** Usar multiplos do spacing base (8px)
- **Sombras:** Consistente com elevation system

### 5. Documentar Do/Don't
```yaml
illustration_guidelines:
  do:
    - "Usar paleta de cores definida"
    - "Manter proporcoes consistentes"
    - "Incluir diversidade em representacoes humanas"
    - "Manter estilo coerente com icons"
    - "Fornecer alt text descritivo"
  dont:
    - "Misturar estilos (flat com 3D)"
    - "Usar cores fora da paleta"
    - "Criar ilustracoes com texto embutido"
    - "Esquecer versao dark mode"
    - "Usar ilustracao como unica forma de comunicacao"
```

### 6. Accessibility
- Alt text obrigatorio para ilustracoes informativas
- `role="presentation"` para decorativas
- Nao depender apenas de ilustracao para comunicar informacao
- Versao high-contrast se necessario

## Saida
- Illustration style guide
- Color palette para ilustracoes
- Size/usage guidelines
- Do/Don't documentation
- Dark mode adaptation rules
- Handoff para squad-brand (visual consistency)

## Validacao
- [ ] Estilo visual definido e documentado
- [ ] Paleta de cores derivada da brand
- [ ] Guidelines de uso por contexto
- [ ] Dark mode adaptation rules
- [ ] Accessibility guidelines incluidos
- [ ] Consistencia com icon system
