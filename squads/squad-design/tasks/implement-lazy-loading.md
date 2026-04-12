---
task: implement-lazy-loading
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

# Task: Implement Lazy Loading

## Metadata
- **Squad:** squad-design
- **Agent:** Scaffold (dx-frontend-engineer)
- **Complexity:** Standard

## Objetivo
Implementar lazy loading estrategico — carregar recursos sob demanda para otimizar performance inicial (LCP, FCP).

## Entrada
- Performance budgets
- Route structure
- Component weight analysis
- Image inventory

## Passos

### 1. Code Splitting (Routes)
Next.js App Router faz automaticamente por route. Para dynamic imports adicionais:
```typescript
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('@/components/Chart'), {
  loading: () => <ChartSkeleton />,
  ssr: false, // Client-only
});
```

### 2. Image Lazy Loading
```typescript
import Image from 'next/image';

// Above fold — priority, no lazy
<Image src="/hero.jpg" alt="" priority sizes="100vw" />

// Below fold — lazy (default)
<Image src="/feature.jpg" alt="" sizes="(max-width: 768px) 100vw, 50vw" />
```

### 3. Component Lazy Loading
| Componente | Strategy | Trigger |
|-----------|---------|---------|
| Modal | Dynamic import | User action |
| Heavy charts | Dynamic import + ssr:false | Viewport |
| Rich text editor | Dynamic import | Focus |
| Map | Dynamic import + ssr:false | Viewport |
| Video player | Facade pattern | Click |

### 4. Intersection Observer Pattern
```typescript
function useLazyLoad(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { rootMargin: '200px', ...options });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

// Usage
function LazySection() {
  const { ref, isVisible } = useLazyLoad();
  return (
    <div ref={ref}>
      {isVisible ? <HeavyContent /> : <Skeleton />}
    </div>
  );
}
```

### 5. Facade Pattern (Third-Party)
```typescript
// YouTube facade — loads iframe only on click
function YouTubeFacade({ videoId }: { videoId: string }) {
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return <iframe src={`https://youtube.com/embed/${videoId}`} />;
  }

  return (
    <button onClick={() => setLoaded(true)} aria-label="Play video">
      <img src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} alt="" />
      <PlayIcon />
    </button>
  );
}
```

### 6. Prefetching
```typescript
// Prefetch on hover/visibility
<Link href="/products" prefetch={true}>Products</Link>

// Manual prefetch
import { useRouter } from 'next/navigation';
const router = useRouter();
router.prefetch('/dashboard');
```

## Saida
- Lazy loading strategy per component type
- Dynamic import patterns
- Image optimization setup
- Intersection Observer hooks
- Facade patterns for third-party
- Prefetch configuration

## Validacao
- [ ] Above-fold content loads immediately
- [ ] Below-fold content lazy loaded
- [ ] Images use next/image with sizes
- [ ] Heavy components dynamically imported
- [ ] Third-party facades implemented
- [ ] LCP not impacted by lazy loading
