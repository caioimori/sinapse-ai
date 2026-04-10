---
task: animate-data-visualization
responsavel: "@generative-particle-engineer"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: data_spec
    tipo: object
    origem: "animation_brief"
    obrigatorio: true
  - campo: dataset
    tipo: array
    origem: "usuario"
    obrigatorio: true

Saida:
  - campo: animated_dataviz
    tipo: code
    destino: "review-animation-quality"

Checklist:
  - "[ ] Mapear dados para geometria 3D"
  - "[ ] Implementar transicoes entre estados de dados"
  - "[ ] Adicionar interatividade (hover, filter, zoom)"
  - "[ ] Criar legenda e labels animados"
  - "[ ] Otimizar para datasets grandes"
---

# Task: Animate Data Visualization

## Metadata
- **Agent:** generative-particle-engineer (Cloud)
- **Squad:** squad-animations
- **Complexity:** HIGH

## Objetivo
Criar visualizacao de dados animada em 3D — mapear datasets para geometria, animar transicoes entre estados, adicionar interatividade e labels. O foco e comunicar dados de forma engajante, nao apenas exibir numeros.

## Pre-Conditions
- Dataset disponivel (JSON, CSV, API)
- Tipo de visualizacao definido (bar chart 3D, scatter plot, globe, network, terrain)
- Three.js scene configurada
- Brand colors e typography disponiveis
- Quantidade de data points estimada

## Passos

### 1. Selecionar Tipo de Visualizacao
| Tipo | Dados | Geometria | Dimensoes Mapeadas |
|------|-------|-----------|-------------------|
| 3D Bar Chart | Categorico + valor | Box/Cylinder height | x=categoria, y=valor, color=grupo |
| Scatter Plot 3D | 3 numericos | Sphere position | x,y,z=valores, size=4o dim, color=5o |
| Globe (geospatial) | Lat/lon + valor | Sphere + points | lat/lon=posicao, height=valor |
| Network Graph | Nodes + edges | Spheres + lines | position=force layout, size=weight |
| Terrain (heatmap) | Grid 2D + valor | Plane displacement | x,z=grid, y=valor, color=valor |
| Particle Cloud | High-dimensional | Points no espaco | PCA/t-SNE reduction |

### 2. Mapear Dados para Geometria
```javascript
// Example: 3D Bar Chart
function createBars(dataset, maxHeight = 5) {
  const group = new THREE.Group();
  const maxVal = Math.max(...dataset.map(d => d.value));

  dataset.forEach((d, i) => {
    const height = (d.value / maxVal) * maxHeight;
    const geometry = new THREE.BoxGeometry(0.8, height, 0.8);
    geometry.translate(0, height / 2, 0); // Pivot at bottom
    const material = new THREE.MeshStandardMaterial({
      color: categoryColor(d.category),
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = i * 1.2;
    mesh.userData = d; // Store data for interaction
    group.add(mesh);
  });
  return group;
}
```

### 3. Animar Entrada dos Dados
```javascript
// Bars grow from 0 to final height
bars.children.forEach((bar, i) => {
  const targetScale = bar.scale.y;
  bar.scale.y = 0;
  gsap.to(bar.scale, {
    y: targetScale,
    duration: 0.6,
    ease: 'back.out(1.5)',
    delay: i * 0.05, // Stagger
  });
});
```

### 4. Transicoes entre Estados de Dados
```javascript
// Morph from one dataset to another
function transitionData(bars, newDataset, maxHeight) {
  const maxVal = Math.max(...newDataset.map(d => d.value));
  bars.children.forEach((bar, i) => {
    const newHeight = (newDataset[i].value / maxVal) * maxHeight;
    gsap.to(bar.scale, {
      y: newHeight / bar.geometry.parameters.height,
      duration: 0.8,
      ease: 'power2.inOut',
    });
    // Animate color change
    gsap.to(bar.material.color, {
      r: newColor.r, g: newColor.g, b: newColor.b,
      duration: 0.8,
    });
  });
}
```

### 5. Interatividade: Hover e Selection
```javascript
const raycaster = new THREE.Raycaster();
let hoveredBar = null;

canvas.addEventListener('pointermove', (e) => {
  const mouse = getNormalizedMouse(e);
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(bars.children);

  if (hoveredBar) {
    gsap.to(hoveredBar.material, { emissiveIntensity: 0, duration: 0.2 });
    hideTooltip();
  }

  if (intersects.length > 0) {
    hoveredBar = intersects[0].object;
    gsap.to(hoveredBar.material, { emissiveIntensity: 0.3, duration: 0.2 });
    showTooltip(hoveredBar.userData, e.clientX, e.clientY);
  } else {
    hoveredBar = null;
  }
});
```

### 6. Labels e Legendas Animados
```javascript
// HTML overlay labels (CSS2DRenderer)
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

function addLabel(mesh, text) {
  const div = document.createElement('div');
  div.className = 'dataviz-label';
  div.textContent = text;
  const label = new CSS2DObject(div);
  label.position.set(0, mesh.geometry.parameters.height + 0.3, 0);
  mesh.add(label);
}

// Animate label entrance
function showLabels(labels) {
  labels.forEach((label, i) => {
    label.element.style.opacity = '0';
    label.element.style.transform = 'translateY(10px)';
    setTimeout(() => {
      label.element.style.transition = 'opacity 0.3s, transform 0.3s';
      label.element.style.opacity = '1';
      label.element.style.transform = 'translateY(0)';
    }, i * 50);
  });
}
```

### 7. Filtragem Animada
```javascript
// Filter: hide bars that don't match criteria
function filterByCategory(bars, category) {
  bars.children.forEach(bar => {
    const match = bar.userData.category === category;
    gsap.to(bar.scale, {
      y: match ? 1 : 0,
      duration: 0.4,
      ease: match ? 'back.out(1.2)' : 'power2.in',
    });
    gsap.to(bar.material, {
      opacity: match ? 1 : 0.1,
      duration: 0.3,
    });
  });
}
```

### 8. Camera Animation por Perspectiva
| Perspectiva | Camera Position | Uso |
|-------------|----------------|-----|
| Overview | Diagonal alta (45deg) | Visao geral |
| Front | Frente, nível | Comparar alturas |
| Top-down | Y alto, olhando para baixo | Heatmap view |
| Focused | Zoom em subset | Detalhe |

```javascript
function animateCameraTo(position, lookAt, duration = 1) {
  gsap.to(camera.position, { ...position, duration, ease: 'power2.inOut' });
  gsap.to(controls.target, { ...lookAt, duration, ease: 'power2.inOut',
    onUpdate: () => controls.update() });
}
```

### 9. Otimizar para Datasets Grandes
| Data Points | Tecnica | Descricao |
|-------------|---------|-----------|
| < 100 | Individual meshes | Cada ponto e um mesh |
| 100-10K | InstancedMesh | Single draw call |
| 10K-100K | Points + shader | BufferGeometry points |
| 100K+ | LOD + aggregation | Agregar dados, detalhe on zoom |
| Streaming | Chunked loading | Carregar por pages |

### 10. Accessibility e Reduced Motion
```javascript
// Aria labels for screen readers
bars.children.forEach(bar => {
  const d = bar.userData;
  bar.element?.setAttribute('aria-label',
    `${d.category}: ${d.value} ${d.unit}`);
});

// Reduced motion: show final state, skip entrance animation
if (prefersReducedMotion) {
  bars.children.forEach(bar => bar.scale.y = 1); // Full height
  showLabels(labels); // Static labels
  return;
}
```

## Output
- Visualizacao 3D animada funcional
- Dados mapeados para geometria correta
- Animacao de entrada (staggered growth)
- Transicoes entre estados de dados
- Interatividade (hover tooltip, click filter, camera)
- Labels e legendas animados
- Otimizacao para dataset size
- Accessibility (aria-labels, reduced motion)

## Quality Criteria
- [ ] Dados mapeados corretamente para geometria
- [ ] Animacao de entrada engajante (stagger + easing)
- [ ] Transicoes entre datasets suaves
- [ ] Hover mostra tooltip com dados corretos
- [ ] Labels legiveis de todas perspectivas
- [ ] Camera transitions suaves
- [ ] 60fps no target dataset size
- [ ] Reduced motion: estado final sem animacao
