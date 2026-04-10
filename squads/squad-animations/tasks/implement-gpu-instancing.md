---
task: implement-gpu-instancing
responsavel: "@animation-performance-engineer"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: repeated_objects
    tipo: code
    origem: "threejs-architect ou generative-particle-engineer"
    obrigatorio: true

Saida:
  - campo: instanced_objects
    tipo: code
    destino: "review-animation-quality"

Checklist:
  - "[ ] Converter para InstancedMesh"
  - "[ ] Configurar instance matrix"
  - "[ ] Implementar per-instance attributes se necessario"
  - "[ ] Atualizar matrices no loop de animacao"
  - "[ ] Validar count e frustum culling"
---

# Task: Implement GPU Instancing

## Metadata
- **Agent:** animation-performance-engineer (Benchmark)
- **Squad:** squad-animations
- **Complexity:** MEDIUM
