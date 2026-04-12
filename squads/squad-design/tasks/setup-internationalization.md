---
task: setup-internationalization
responsavel: "@dx-frontend-engineer"
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

# Task: Setup Internationalization

## Metadata
- **Squad:** squad-design
- **Agent:** Scaffold (dx-frontend-engineer)
- **Complexity:** Standard

## Objetivo
Configurar internacionalizacao (i18n) do projeto — traducao, formatacao de datas/numeros, RTL support e locale detection.

## Entrada
- Supported locales
- Default locale
- Content strategy (de squad-content)
- SEO requirements

## Passos

### 1. Selecionar Abordagem
| Abordagem | Quando | Ferramenta |
|-----------|--------|-----------|
| next-intl | Next.js App Router | next-intl |
| react-intl | React generico | @formatjs/intl |
| i18next | Qualquer framework | react-i18next |

### 2. Configurar next-intl
```typescript
// i18n.ts
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./messages/${locale}.json`)).default,
}));
```

### 3. Message Files Structure
```
messages/
├── en.json
├── pt-BR.json
├── es.json
└── fr.json
```

```json
// messages/pt-BR.json
{
  "common": {
    "save": "Salvar",
    "cancel": "Cancelar",
    "loading": "Carregando..."
  },
  "auth": {
    "login": "Entrar",
    "register": "Criar conta",
    "forgot": "Esqueci minha senha"
  }
}
```

### 4. Usage Patterns
```typescript
import { useTranslations } from 'next-intl';

function LoginPage() {
  const t = useTranslations('auth');

  return (
    <div>
      <h1>{t('login')}</h1>
      <Button>{t('login')}</Button>
    </div>
  );
}
```

### 5. Date/Number Formatting
```typescript
import { useFormatter } from 'next-intl';

function Price({ value }: { value: number }) {
  const format = useFormatter();
  return <span>{format.number(value, { style: 'currency', currency: 'BRL' })}</span>;
}

function Date({ value }: { value: Date }) {
  const format = useFormatter();
  return <time>{format.dateTime(value, { dateStyle: 'long' })}</time>;
}
```

### 6. SEO & Routing
```typescript
// URL structure: /pt-BR/about, /en/about
// middleware.ts
export function middleware(request: NextRequest) {
  // Detect locale from:
  // 1. URL path (/pt-BR/...)
  // 2. Cookie preference
  // 3. Accept-Language header
  // 4. Default locale
}

// Hreflang tags
<link rel="alternate" hrefLang="pt-BR" href="/pt-BR/about" />
<link rel="alternate" hrefLang="en" href="/en/about" />
```

## Saida
- i18n configuration
- Message file structure
- Translation workflow
- Date/number formatting
- SEO routing setup
- RTL preparation (if needed)

## Validacao
- [ ] Todos os textos externalizados (no hardcoded strings)
- [ ] Formatacao de datas/numeros localizada
- [ ] Locale detection funcional
- [ ] SEO hreflang tags
- [ ] Fallback locale configurado
- [ ] Translation keys organizados por feature
