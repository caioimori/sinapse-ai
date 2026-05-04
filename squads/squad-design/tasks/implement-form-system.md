---
task: implement-form-system
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

# Task: Implement Form System

## Metadata
- **Squad:** squad-design
- **Agent:** Scaffold (dx-frontend-engineer)
- **Complexity:** Complex

## Objetivo
Implementar sistema de formularios completo — validacao, error handling, multi-step forms, accessibility e integracao com server actions.

## Entrada
- Form patterns (de Canvas)
- A11y requirements (de Beacon)
- API integration patterns
- Validation schemas

## Passos

### 1. Setup React Hook Form + Zod
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email invalido'),
  message: z.string().min(10, 'Mensagem muito curta'),
});

type ContactForm = z.infer<typeof contactSchema>;

function ContactForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    await submitContact(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormField
        label="Nome"
        error={errors.name?.message}
        {...register('name')}
      />
      <Button type="submit" loading={isSubmitting}>Enviar</Button>
    </form>
  );
}
```

### 2. FormField Component (A11y-First)
```typescript
interface FormFieldProps {
  label: string;
  error?: string;
  helpText?: string;
  required?: boolean;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, helpText, required, ...props }, ref) => {
    const id = useId();
    const errorId = `${id}-error`;
    const helpId = `${id}-help`;

    return (
      <div>
        <Label htmlFor={id}>
          {label}
          {required && <span aria-hidden="true">*</span>}
        </Label>
        <Input
          ref={ref}
          id={id}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helpText ? helpId : undefined}
          {...props}
        />
        {helpText && !error && <p id={helpId} className="text-sm text-muted">{helpText}</p>}
        {error && <p id={errorId} role="alert" className="text-sm text-error">{error}</p>}
      </div>
    );
  }
);
```

### 3. Multi-Step Form Pattern
```typescript
function MultiStepForm() {
  const [step, setStep] = useState(0);
  const steps = [PersonalInfo, Address, Review];
  const CurrentStep = steps[step];

  return (
    <div role="form" aria-label="Registration">
      <ProgressBar current={step} total={steps.length} />
      <CurrentStep onNext={() => setStep(s => s + 1)} onBack={() => setStep(s => s - 1)} />
    </div>
  );
}
```

### 4. Server Action Integration
```typescript
'use server';
export async function submitForm(prevState: FormState, formData: FormData) {
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }
  await saveToDb(parsed.data);
  return { success: true };
}
```

### 5. Error Summary Pattern
```typescript
function ErrorSummary({ errors }: { errors: Record<string, string> }) {
  const entries = Object.entries(errors);
  if (!entries.length) return null;

  return (
    <div role="alert" aria-labelledby="error-summary-title">
      <h2 id="error-summary-title">Corrija os seguintes erros:</h2>
      <ul>
        {entries.map(([field, message]) => (
          <li key={field}>
            <a href={`#${field}`}>{message}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### 6. Autocomplete Attributes (WCAG 1.3.5)
| Campo | autocomplete |
|-------|-------------|
| Nome completo | name |
| Email | email |
| Telefone | tel |
| Endereco | street-address |
| CEP | postal-code |
| Cartao | cc-number |

## Saida
- Form system implementation
- FormField component (a11y-first)
- Validation with Zod schemas
- Multi-step form pattern
- Server Action integration
- Error handling patterns

## Validacao
- [ ] Validacao client + server
- [ ] Error messages com role="alert"
- [ ] Labels associados (htmlFor/id)
- [ ] aria-describedby para errors e help text
- [ ] Autocomplete attributes
- [ ] Multi-step com progress indicator
- [ ] Keyboard navigation funcional
