---
task: build-flocking-system
responsavel: "@generative-particle-engineer"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: flocking_spec
    tipo: object
    origem: "animation_brief"
    obrigatorio: true

Saida:
  - campo: flocking_system
    tipo: code
    destino: "review-animation-quality"

Checklist:
  - "[ ] Implementar separation, alignment, cohesion"
  - "[ ] Configurar pesos por regra"
  - "[ ] Adicionar predator/attractor se necessario"
  - "[ ] Implementar spatial hashing para otimizacao"
  - "[ ] Adicionar boundary behavior (wrap, bounce, steer)"
---

# Task: Build Flocking System

## Metadata
- **Agent:** generative-particle-engineer (Cloud)
- **Squad:** squad-animations
- **Complexity:** MEDIUM

## Objetivo
Implementar sistema de flocking (Boids) — agentes autonomos que exibem comportamento emergente de grupo atraves de tres regras simples: separation, alignment e cohesion. Adicionar predator/attractor, spatial hashing e boundary behavior.

## Pre-Conditions
- Quantidade de boids definida (tipicamente 50-5000)
- Dimensao (2D canvas ou 3D Three.js)
- Estetica desejada (birds, fish, abstract particles, logos)
- Interatividade definida (mouse como predator/attractor)

## Passos

### 1. Definir Boid Entity
```javascript
class Boid {
  constructor(x, y, z = 0) {
    this.position = new THREE.Vector3(x, y, z);
    this.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2
    );
    this.acceleration = new THREE.Vector3();
    this.maxSpeed = 2;
    this.maxForce = 0.05;
  }
  update() {
    this.velocity.add(this.acceleration);
    this.velocity.clampLength(0, this.maxSpeed);
    this.position.add(this.velocity);
    this.acceleration.set(0, 0, 0);
  }
  applyForce(force) {
    this.acceleration.add(force);
  }
}
```

### 2. Implementar Tres Regras Core
```javascript
// Separation: steer away from nearby boids
function separation(boid, neighbors, desiredSeparation) {
  const steer = new THREE.Vector3();
  let count = 0;
  for (const other of neighbors) {
    const d = boid.position.distanceTo(other.position);
    if (d > 0 && d < desiredSeparation) {
      const diff = boid.position.clone().sub(other.position).normalize().divideScalar(d);
      steer.add(diff);
      count++;
    }
  }
  if (count > 0) steer.divideScalar(count);
  if (steer.length() > 0) {
    steer.normalize().multiplyScalar(boid.maxSpeed).sub(boid.velocity);
    steer.clampLength(0, boid.maxForce);
  }
  return steer;
}

// Alignment: steer toward average heading of neighbors
function alignment(boid, neighbors, neighborDist) {
  const avg = new THREE.Vector3();
  let count = 0;
  for (const other of neighbors) {
    if (boid.position.distanceTo(other.position) < neighborDist) {
      avg.add(other.velocity);
      count++;
    }
  }
  if (count > 0) {
    avg.divideScalar(count).normalize().multiplyScalar(boid.maxSpeed);
    const steer = avg.sub(boid.velocity);
    steer.clampLength(0, boid.maxForce);
    return steer;
  }
  return avg;
}

// Cohesion: steer toward center of neighbors
function cohesion(boid, neighbors, neighborDist) {
  const center = new THREE.Vector3();
  let count = 0;
  for (const other of neighbors) {
    if (boid.position.distanceTo(other.position) < neighborDist) {
      center.add(other.position);
      count++;
    }
  }
  if (count > 0) {
    center.divideScalar(count);
    return seek(boid, center); // Steer toward center
  }
  return center;
}
```

### 3. Configurar Pesos
| Regra | Peso Default | Range | Efeito de Peso Alto |
|-------|-------------|-------|---------------------|
| Separation | 1.5 | 0.5-3.0 | Mais espalhado |
| Alignment | 1.0 | 0.5-2.0 | Mais ordenado |
| Cohesion | 1.0 | 0.5-2.0 | Mais agrupado |
| Predator avoidance | 2.0 | 1.0-5.0 | Fuga mais forte |
| Attractor | 0.5 | 0.1-1.5 | Mais atraido |

```javascript
const weights = {
  separation: 1.5,
  alignment: 1.0,
  cohesion: 1.0,
  predator: 2.0,
  attractor: 0.5,
};
// Apply weighted forces
boid.applyForce(sep.multiplyScalar(weights.separation));
boid.applyForce(ali.multiplyScalar(weights.alignment));
boid.applyForce(coh.multiplyScalar(weights.cohesion));
```

### 4. Adicionar Predator/Attractor
```javascript
// Mouse as predator: boids flee
function fleePredator(boid, predatorPos, fleeRadius) {
  const d = boid.position.distanceTo(predatorPos);
  if (d < fleeRadius) {
    const desired = boid.position.clone().sub(predatorPos).normalize().multiplyScalar(boid.maxSpeed);
    const steer = desired.sub(boid.velocity);
    steer.clampLength(0, boid.maxForce * 3); // Stronger force
    return steer;
  }
  return new THREE.Vector3();
}

// Mouse as attractor: boids gather
function seekAttractor(boid, attractorPos, attractRadius) {
  const d = boid.position.distanceTo(attractorPos);
  if (d < attractRadius) {
    return seek(boid, attractorPos);
  }
  return new THREE.Vector3();
}
```

### 5. Implementar Spatial Hashing
```javascript
class SpatialHash {
  constructor(cellSize) {
    this.cellSize = cellSize;
    this.cells = new Map();
  }
  hash(x, y, z = 0) {
    const cx = Math.floor(x / this.cellSize);
    const cy = Math.floor(y / this.cellSize);
    const cz = Math.floor(z / this.cellSize);
    return `${cx},${cy},${cz}`;
  }
  insert(boid) {
    const key = this.hash(boid.position.x, boid.position.y, boid.position.z);
    if (!this.cells.has(key)) this.cells.set(key, []);
    this.cells.get(key).push(boid);
  }
  getNeighbors(boid, radius) {
    const neighbors = [];
    const r = Math.ceil(radius / this.cellSize);
    const cx = Math.floor(boid.position.x / this.cellSize);
    const cy = Math.floor(boid.position.y / this.cellSize);
    const cz = Math.floor(boid.position.z / this.cellSize);
    for (let dz = -r; dz <= r; dz++)
      for (let dy = -r; dy <= r; dy++)
        for (let dx = -r; dx <= r; dx++) {
          const cell = this.cells.get(`${cx+dx},${cy+dy},${cz+dz}`);
          if (cell) neighbors.push(...cell);
        }
    return neighbors;
  }
  clear() { this.cells.clear(); }
}
```

### 6. Boundary Behavior
| Tipo | Descricao | Visual |
|------|-----------|--------|
| Wrap | Sai de um lado, entra no outro | Toroidal, seamless |
| Bounce | Reflete velocidade na borda | Confinado, energetico |
| Steer | Forca gradual que empurra de volta | Suave, natural |
| Soft wall | Forca proporcional a distancia da borda | Mais suave que bounce |

```javascript
function steerWithinBounds(boid, bounds, margin) {
  const steer = new THREE.Vector3();
  if (boid.position.x < bounds.min.x + margin) steer.x = boid.maxSpeed;
  if (boid.position.x > bounds.max.x - margin) steer.x = -boid.maxSpeed;
  if (boid.position.y < bounds.min.y + margin) steer.y = boid.maxSpeed;
  if (boid.position.y > bounds.max.y - margin) steer.y = -boid.maxSpeed;
  return steer;
}
```

### 7. Rendering (Three.js InstancedMesh)
```javascript
const geometry = new THREE.ConeGeometry(0.1, 0.3, 4); // Arrow shape
const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
const mesh = new THREE.InstancedMesh(geometry, material, boidCount);

const dummy = new THREE.Object3D();
function updateInstances(boids) {
  boids.forEach((boid, i) => {
    dummy.position.copy(boid.position);
    dummy.lookAt(boid.position.clone().add(boid.velocity));
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
  });
  mesh.instanceMatrix.needsUpdate = true;
}
```

### 8. Visual Variantes
| Variante | Descricao | Tecnica |
|----------|-----------|---------|
| Birds | Cones rotacionados na direcao do voo | InstancedMesh + lookAt |
| Fish | Animated tails, undulation | Vertex shader displacement |
| Particles | Points sem orientacao | THREE.Points |
| Letters/logos | Caracteres que formam palavras | Sprite atlas + boid positions |
| Trails | Lines atras de cada boid | BufferGeometry lines, ring buffer |

### 9. Performance por Quantidade
| Boids | Approach | Neighbor Search |
|-------|----------|----------------|
| < 100 | Brute force O(n^2) | Todos vs todos |
| 100-1K | Spatial hash | Grid-based lookup |
| 1K-10K | Spatial hash + InstancedMesh | Grid + frustum cull |
| 10K+ | GPU compute (shader boids) | Texture-based lookup |

### 10. Cleanup e Reduced Motion
```javascript
function dispose() {
  cancelAnimationFrame(animId);
  mesh.dispose();
  geometry.dispose();
  material.dispose();
  scene.remove(mesh);
}

// Reduced motion: show static formation, no movement
if (prefersReducedMotion) {
  positionBoidsInFormation(boids); // Static arrangement
  updateInstances(boids);
  return;
}
```

## Output
- Flocking system com 3 regras core (separation, alignment, cohesion)
- Pesos configuraveis por regra
- Predator/attractor behavior
- Spatial hashing para neighbor lookup
- Boundary behavior (wrap, bounce, steer)
- InstancedMesh rendering
- Cleanup/dispose functions

## Quality Criteria
- [ ] Tres regras core funcionam corretamente
- [ ] Pesos configuraveis produzem comportamentos distintos
- [ ] Predator causa fuga convincente
- [ ] Spatial hash reduz neighbor search cost
- [ ] Boundary behavior previne boids escapando
- [ ] InstancedMesh orientado na direcao do voo
- [ ] 60fps no target boid count
- [ ] Reduced motion: formacao estatica
