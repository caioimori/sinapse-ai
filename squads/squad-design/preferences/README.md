# Squad Digital Experience — Preferences

## Sobre
Este diretorio armazena preferencias personalizaveis que ajustam o comportamento da squad sem modificar os arquivos core.

## Arquivos de Preferencia

### Stack Tecnologico
Crie `stack.yaml` para definir defaults do projeto:

```yaml
# stack.yaml
framework: next             # next | astro | nuxt | sveltekit
styling: tailwind            # tailwind | css-modules | vanilla-extract | styled-components
component_isolation: storybook  # storybook | histoire
token_pipeline: style-dictionary  # style-dictionary | theo | custom
animation: motion            # motion (framer) | gsap | css-only
testing: vitest              # vitest | jest
e2e: playwright              # playwright | cypress
typescript: strict           # strict | standard
bundler: vite                # vite | turbopack | webpack
```

### Design System
Crie `design-system.yaml` para configurar defaults:

```yaml
# design-system.yaml
token_format: w3c-dtcg       # w3c-dtcg | custom-json
token_tiers: 3               # 2 (primitive+semantic) | 3 (+ component)
atomic_design: true          # true | false
grid_base: 8                 # 4 | 8 (px)
spacing_base: 4              # 4 | 8 (px)
dark_mode: true              # true | false
multi_brand: false           # true | false
```

### Quality Gates
Crie `quality.yaml` para ajustar thresholds:

```yaml
# quality.yaml
accessibility:
  standard: wcag-2.2-aa      # wcag-2.2-aa | wcag-2.2-aaa
  blocking: true              # true | false
  tools: [axe-core, lighthouse, manual]

performance:
  lcp_target: 2.5             # seconds
  inp_target: 200             # milliseconds
  cls_target: 0.1
  lighthouse_min: 90
  blocking: true
  js_budget_kb: 300
  css_budget_kb: 50

motion:
  respect_reduced_motion: true  # SEMPRE true, nao desativar
  max_duration_ms: 800
  gpu_only: true
```

### Responsiveness
Crie `responsive.yaml` para breakpoints:

```yaml
# responsive.yaml
approach: mobile-first        # mobile-first | desktop-first
breakpoints:
  sm: 640px
  md: 768px
  lg: 1024px
  xl: 1280px
  2xl: 1536px
container_queries: true       # true | false
fluid_typography: true        # true | false
```

## Prioridade de Configuracao

```
1. Project brief (mais alta)
2. Preferences deste diretorio
3. Defaults dos agentes
4. Knowledge base da squad (mais baixa)
```

## Notas

- Quality gates de acessibilidade e performance sao SEMPRE bloqueantes (nao podem ser desativados via preferences)
- Preferencias sao opcionais — a squad funciona com todos os defaults
- Para configuracoes por projeto, use o DX Project Brief Template
