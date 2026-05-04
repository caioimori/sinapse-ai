# Generative Algorithms Reference

> Algoritmos para criar arte generativa, particulas e padroes procedurais.

---

## Noise Functions

| Tipo | Resultado | Uso |
|------|-----------|-----|
| Perlin 2D/3D | Gradientes suaves, terrenos | Deformacao, texturas |
| Simplex | Similar ao Perlin, mais rapido | Versao otimizada |
| Worley/Cellular | Padrao celular, cristais | Voronoi-like, organico |
| Value noise | Blocos suaves interpolados | Pixel art, retro |
| FBM (multi-octave) | Detalhes multi-escala | Nuvens, terrenos detalhados |
| Domain warping | Distorcao organica | Fluidos, marmores |
| Curl noise | Fluxo turbulento sem divergencia | Particulas, fumaca |

---

## Flow Fields

Vetores em uma grade que guiam particulas:
1. Gerar grade 2D/3D de angulos (noise-based)
2. Particula consulta angulo na sua posicao
3. Aplicar angulo como direcao de velocidade
4. Resultado: linhas fluidas e organicas

```javascript
// Pseudocodigo
for (particle of particles) {
  const col = floor(particle.x / cellSize);
  const row = floor(particle.y / cellSize);
  const angle = noise(col * 0.1, row * 0.1, time) * TWO_PI;
  particle.vx += cos(angle) * force;
  particle.vy += sin(angle) * force;
  particle.update();
}
```

---

## Boids (Flocking)

3 regras simples criam comportamento de bando:
1. **Separation:** Evitar colisao com vizinhos proximos
2. **Alignment:** Alinhar direcao com vizinhos medios
3. **Cohesion:** Mover em direcao ao centro do grupo

Variantes: predator-prey, leader following, obstacle avoidance

---

## L-Systems (Fractais Vegetais)

Gramatica de substituicao para estruturas ramificadas:
```
Axiom: F
Rule: F → F[+F]F[-F]F

F = desenhar linha
+ = girar +25°
- = girar -25°
[ = salvar posicao (push)
] = restaurar posicao (pop)
```

Resultado: arvores, plantas, corais, redes neuronais

---

## Voronoi & Delaunay

- **Voronoi:** Espaco dividido em regioes, cada uma mais proxima de um ponto seed
- **Delaunay:** Triangulacao dual do Voronoi — conecta pontos em triangulos
- **Uso:** Padrao celular, mosaicos, fragmentacao, shatter effect

---

## Reaction-Diffusion

Simula 2 substancias quimicas (A e B) interagindo:
- A se difunde e alimenta B
- B se difunde e consome A
- Resultado: padrao de Turing (coral, leopardo, labirin)

Parametros: feed rate, kill rate, difusao A, difusao B

---

## Metaballs

Campos escalares que se fundem quando proximos:
```glsl
float metaball(vec2 p, vec2 center, float radius) {
  return radius / length(p - center);
}
// Somar multiplas metaballs e aplicar threshold
```

---

## Cellular Automata

Grade de celulas com regras simples de vizinhanca:
- **Game of Life:** 2 estados, 8 vizinhos, regras 23/3
- **Rule 30/110:** 1D automata, patterns complexos
- **Uso:** Backgrounds generativos, padroes emergentes

---

## Fractais

| Tipo | Tecnica |
|------|---------|
| Mandelbrot | z = z² + c, iterar e colorir |
| Julia | Similar, c fixo |
| Fractal tree | Recursao + angulo de ramificacao |
| Sierpinski | Subdivisao triangular/quadrada |
| Koch snowflake | Adicionar triangulos em cada aresta |
