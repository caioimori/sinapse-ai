---
task: create-error-boundary-patterns
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

# Task: Create Error Boundary Patterns

## Metadata
- **Squad:** squad-design
- **Agent:** Scaffold (dx-frontend-engineer)
- **Complexity:** Standard

## Objetivo
Implementar padroes de error boundary robustos — capturar, reportar e recuperar de erros de forma graceful em todas as camadas da aplicacao.

## Entrada
- Route structure
- Error types do sistema
- Empty/error state designs (de Canvas)
- Monitoring requirements

## Passos

### 1. Error Boundary Hierarchy
```
Root Error Boundary
├── Layout Error Boundary (per route group)
│   ├── Page Error Boundary (per route)
│   │   ├── Section Error Boundary (critical sections)
│   │   └── Component Error Boundary (isolated components)
```

### 2. Route Error Handling (Next.js)
```typescript
// app/error.tsx — Global fallback
'use client';
export default function GlobalError({ error, reset }: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => { reportError(error); }, [error]);

  return (
    <ErrorState
      title="Algo deu errado"
      description="Estamos trabalhando para resolver."
      action={{ label: 'Tentar novamente', onClick: reset }}
    />
  );
}

// app/not-found.tsx
export default function NotFound() {
  return (
    <ErrorState
      title="Pagina nao encontrada"
      description="O endereco que voce procura nao existe."
      action={{ label: 'Voltar ao inicio', href: '/' }}
    />
  );
}
```

### 3. Component Error Boundary
```typescript
'use client';
import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error) => void;
}

class ErrorBoundary extends Component<Props, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <InlineErrorState />;
    }
    return this.props.children;
  }
}
```

### 4. Error Reporting
```typescript
function reportError(error: Error) {
  // Structured error report
  const report = {
    message: error.message,
    stack: error.stack,
    url: window.location.href,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
  };

  // Send to monitoring service
  // Sentry, LogRocket, etc.
}
```

### 5. Graceful Degradation Patterns
| Cenario | Comportamento |
|---------|--------------|
| API timeout | Show cached data + warning |
| Partial data | Show available, hide missing |
| Image load fail | Show placeholder |
| Third-party fail | Hide widget, don't crash |
| Auth expired | Redirect to login |

### 6. User-Facing Error Messages
| Tipo | Mensagem | Tom |
|------|---------|-----|
| Network | "Verifique sua conexao" | Neutro |
| Server | "Algo deu errado do nosso lado" | Empatico |
| Not Found | "Pagina nao encontrada" | Informativo |
| Permission | "Voce nao tem acesso" | Claro |
| Validation | "Corrija os campos indicados" | Diretivo |

## Saida
- Error boundary components
- Route-level error handlers
- Error reporting integration
- Graceful degradation patterns
- User-facing message guidelines

## Validacao
- [ ] Error boundaries em todos os niveis
- [ ] Not-found handler customizado
- [ ] Error reporting configurado
- [ ] Mensagens sem jargao tecnico
- [ ] Recovery actions em todos os errors
- [ ] Graceful degradation para partial failures
