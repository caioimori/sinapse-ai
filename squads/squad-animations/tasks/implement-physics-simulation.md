---
task: implement-physics-simulation
responsavel: "@generative-particle-engineer"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: physics_spec
    tipo: object
    origem: "animation_brief"
    obrigatorio: true

Saida:
  - campo: physics_simulation
    tipo: code
    destino: "animation-performance-engineer"

Checklist:
  - "[ ] Selecionar engine (custom, cannon-es, rapier)"
  - "[ ] Implementar forces e constraints"
  - "[ ] Configurar collision detection"
  - "[ ] Sincronizar com render loop"
  - "[ ] Otimizar timestep fixo"
---

# Task: Implement Physics Simulation

## Metadata
- **Agent:** generative-particle-engineer (Cloud)
- **Squad:** squad-animations
- **Complexity:** HIGH

## Objetivo
Implementar simulacao de fisica para animacoes — gravity, collision, constraints, soft body, cloth ou fluids. Selecionar engine correta (custom lightweight vs full physics library), sincronizar com render loop e otimizar timestep.

## Pre-Conditions
- Tipo de simulacao definido (rigid body, soft body, cloth, fluid, ragdoll)
- Three.js scene configurada (se 3D)
- Complexidade estimada (poucos objetos vs centenas)
- Target devices definidos (afeta engine choice)

## Passos

### 1. Selecionar Engine
| Engine | Tipo | Bundle Size | Melhor Para |
|--------|------|-------------|-------------|
| Custom (Verlet) | Lightweight | 0 KB | Pontos, springs, cloth simples |
| cannon-es | Rigid body | ~150 KB | Boxes, spheres, compound shapes |
| Rapier (WASM) | Full physics | ~250 KB | Performance critica, complex sim |
| Oimo.js | Rigid body | ~100 KB | Simples, leve |
| Matter.js | 2D physics | ~80 KB | 2D scenes, DOM elements |
| Custom SPH | Fluid | 0 KB | Fluid sim (advanced) |

### 2. Implementar Verlet Integration (Custom)
```javascript
class VerletParticle {
  constructor(x, y, z) {
    this.position = new THREE.Vector3(x, y, z);
    this.previous = this.position.clone();
    this.acceleration = new THREE.Vector3();
    this.mass = 1;
    this.pinned = false;
  }
  update(dt) {
    if (this.pinned) return;
    const velocity = this.position.clone().sub(this.previous);
    this.previous.copy(this.position);
    this.position.add(velocity);
    this.position.add(this.acceleration.multiplyScalar(dt * dt));
    this.acceleration.set(0, 0, 0);
  }
  applyForce(force) {
    this.acceleration.add(force.clone().divideScalar(this.mass));
  }
}
```

### 3. Implementar Constraints
```javascript
class DistanceConstraint {
  constructor(p1, p2, restLength, stiffness = 1) {
    this.p1 = p1;
    this.p2 = p2;
    this.restLength = restLength ?? p1.position.distanceTo(p2.position);
    this.stiffness = stiffness;
  }
  solve() {
    const diff = this.p2.position.clone().sub(this.p1.position);
    const dist = diff.length();
    const correction = diff.multiplyScalar((dist - this.restLength) / dist * 0.5 * this.stiffness);
    if (!this.p1.pinned) this.p1.position.add(correction);
    if (!this.p2.pinned) this.p2.position.sub(correction);
  }
}
// Solve constraints multiple iterations for stability
for (let i = 0; i < solverIterations; i++) {
  constraints.forEach(c => c.solve());
}
```

### 4. Configurar Cannon-es (Rigid Body)
```javascript
import * as CANNON from 'cannon-es';

const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.82, 0) });
world.broadphase = new CANNON.SAPBroadphase(world);
world.solver.iterations = 10;

// Create body
const body = new CANNON.Body({
  mass: 1,
  shape: new CANNON.Sphere(0.5),
  position: new CANNON.Vec3(0, 10, 0),
  material: new CANNON.Material({ friction: 0.3, restitution: 0.5 }),
});
world.addBody(body);

// Ground plane
const ground = new CANNON.Body({
  mass: 0, // Static
  shape: new CANNON.Plane(),
});
ground.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(ground);
```

### 5. Sincronizar Physics com Three.js
```javascript
// Fixed timestep physics loop
const fixedDt = 1 / 60;
let accumulator = 0;

function animate(time) {
  const dt = clock.getDelta();
  accumulator += dt;

  while (accumulator >= fixedDt) {
    world.step(fixedDt);
    accumulator -= fixedDt;
  }

  // Interpolate for smooth rendering
  const alpha = accumulator / fixedDt;
  bodies.forEach((body, i) => {
    meshes[i].position.lerpVectors(body.previousPosition, body.position, alpha);
    meshes[i].quaternion.slerpQuaternions(body.previousQuaternion, body.quaternion, alpha);
  });

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
```

### 6. Implementar Cloth Simulation
```javascript
// Grid of Verlet particles with distance constraints
function createCloth(widthSegments, heightSegments, spacing) {
  const particles = [];
  const constraints = [];

  for (let y = 0; y <= heightSegments; y++) {
    for (let x = 0; x <= widthSegments; x++) {
      const p = new VerletParticle(x * spacing, -y * spacing, 0);
      if (y === 0) p.pinned = true; // Pin top row
      particles.push(p);
    }
  }

  // Structural constraints (horizontal + vertical)
  // Shear constraints (diagonal)
  // Bend constraints (skip one) for stiffness
  // ... connect neighbors

  return { particles, constraints };
}
```

### 7. Collision Detection
| Tipo | Algoritmo | Performance |
|------|-----------|-------------|
| Sphere-sphere | Distance check | O(1) per pair |
| AABB | Overlap test | O(1) per pair |
| Broadphase | Spatial hash / SAP | O(n log n) |
| Narrowphase | GJK / EPA | O(faces) |
| Point-plane | Dot product | O(1) |
| Ray-mesh | BVH traversal | O(log n) |

```javascript
// Simple sphere collision
function resolveSphereCollision(p1, p2, r1, r2) {
  const diff = p1.position.clone().sub(p2.position);
  const dist = diff.length();
  const minDist = r1 + r2;
  if (dist < minDist) {
    const correction = diff.normalize().multiplyScalar((minDist - dist) * 0.5);
    p1.position.add(correction);
    p2.position.sub(correction);
  }
}
```

### 8. Forces e Interacao
| Force | Implementacao | Uso |
|-------|--------------|-----|
| Gravity | `vel.y -= 9.82 * dt` | Universal |
| Wind | `force = windDir * strength * noise(time)` | Cloth, particulas |
| Mouse attract | `force = (mouse - pos).normalize() * strength / dist` | Interactive |
| Spring | `force = -k * (dist - rest) * dir` | Soft body, connections |
| Damping | `vel *= (1 - damping * dt)` | Estabilizacao |
| Buoyancy | `force.y = volume * density * g` | Flutuacao |

### 9. Debug Visualization
```javascript
// Wireframe helpers for physics shapes
function debugPhysics(world, scene) {
  const debugMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
  world.bodies.forEach(body => {
    body.shapes.forEach(shape => {
      const helper = createShapeHelper(shape, debugMaterial);
      helper.position.copy(body.position);
      helper.quaternion.copy(body.quaternion);
      scene.add(helper);
    });
  });
}
```

### 10. Cleanup e Reduced Motion
```javascript
function dispose() {
  world.bodies.forEach(b => world.removeBody(b));
  constraints.forEach(c => world.removeConstraint(c));
  cancelAnimationFrame(animId);
}

// Reduced motion: show final resting state, skip simulation
if (prefersReducedMotion) {
  // Place objects at rest positions
  // Skip animation loop
}
```

## Output
- Physics simulation funcional com engine selecionada
- Forces configuradas (gravity, wind, attraction, springs)
- Constraints implementados (distance, hinge, lock)
- Collision detection funcional
- Sincronizacao smooth com render loop (interpolation)
- Fixed timestep loop estavel
- Debug visualization helpers
- Cleanup/dispose functions

## Quality Criteria
- [ ] Engine correta para complexidade da simulacao
- [ ] Fixed timestep (deterministic, frame-rate independent)
- [ ] Interpolacao entre physics steps (smooth rendering)
- [ ] Constraints estaveis (sem jitter, sem explosao)
- [ ] Collision detection funcional
- [ ] 60fps no target device
- [ ] Memoria limpa no dispose
- [ ] Reduced motion: estado estatico final
