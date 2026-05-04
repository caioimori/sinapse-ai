---
task: implement-authentication-ui
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

# Task: Implement Authentication UI

## Metadata
- **Squad:** squad-design
- **Agent:** Scaffold (dx-frontend-engineer)
- **Complexity:** Standard

## Objetivo
Implementar fluxos de autenticacao na UI — login, registro, reset de senha, proteção de rotas e session management.

## Entrada
- Auth provider (NextAuth, Supabase Auth, etc)
- UI design specs (de Canvas)
- Security requirements
- A11y requirements

## Passos

### 1. Auth Pages
| Pagina | Route | Components |
|--------|-------|-----------|
| Login | /login | Email/password + social buttons |
| Register | /register | Form + terms checkbox |
| Forgot Password | /forgot-password | Email input |
| Reset Password | /reset-password | New password + confirm |
| Verify Email | /verify-email | Status message |

### 2. Route Protection
```typescript
// middleware.ts
const protectedRoutes = ['/dashboard', '/settings', '/profile'];
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session');
  const isProtected = protectedRoutes.some(r =>
    request.nextUrl.pathname.startsWith(r)
  );
  const isAuthRoute = authRoutes.some(r =>
    request.nextUrl.pathname.startsWith(r)
  );

  if (isProtected && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
}
```

### 3. Auth Form Pattern
```typescript
function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    const result = await signIn('credentials', {
      ...data,
      redirect: false,
    });
    if (result?.error) setError('Credenciais invalidas');
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {error && <Alert variant="error">{error}</Alert>}
      <FormField label="Email" type="email" autoComplete="email" {...form.register('email')} />
      <FormField label="Senha" type="password" autoComplete="current-password" {...form.register('password')} />
      <Button type="submit" loading={form.formState.isSubmitting}>Entrar</Button>
    </form>
  );
}
```

### 4. Social Auth Buttons
```typescript
function SocialAuth() {
  return (
    <div>
      <Divider label="ou continue com" />
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" onClick={() => signIn('google')}>
          <GoogleIcon /> Google
        </Button>
        <Button variant="outline" onClick={() => signIn('github')}>
          <GitHubIcon /> GitHub
        </Button>
      </div>
    </div>
  );
}
```

### 5. Session Management
| Aspecto | Implementacao |
|---------|--------------|
| Storage | HTTP-only cookies (secure) |
| Refresh | Automatic token refresh |
| Expiry | Session timeout with warning |
| Logout | Clear all tokens + redirect |
| Multi-tab | Sync across tabs |

### 6. Security Checklist
- [ ] Passwords never logged or exposed
- [ ] CSRF protection enabled
- [ ] Rate limiting on auth endpoints
- [ ] Autocomplete attributes (WCAG 3.3.8)
- [ ] No accessible authentication barriers
- [ ] Secure password requirements communicated

## Saida
- Auth pages implementation
- Route protection middleware
- Auth form components
- Social auth integration
- Session management
- Security checklist verified

## Validacao
- [ ] Login/Register forms functional
- [ ] Route protection working
- [ ] Social auth configured
- [ ] Password reset flow complete
- [ ] Session management secure
- [ ] A11y: autocomplete, labels, error messages
