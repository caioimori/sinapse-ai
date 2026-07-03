# Protocolo de medição 2 braços (checkpoint repetível)

> Promoção do protocolo do CHECKPOINT-multistory-2026-06-30 a documento executável.
> Story onda3-s4-behavioral-eval-regression (AF-20260702 item 3.1, AC4).
> Consumidor imediato: o piloto de epic waves (story onda3-s5).

## Quando usar

Sempre que uma aposta de orquestração precisar de veredito (cabear fan-out,
wrapper de waves, novo executor): **medir antes de virar produto**. O critério
é pré-registrado ANTES de rodar — quem não vence (ou empata com custo menor)
o braço nativo, não vira produto.

## Task de referência

URL shortener Node.js sem dependências, decomposto em 3 stories com dependência
real (a estrutura exata varia por piloto; o requisito é dependência genuína):

- Variante encadeada (30/06): `url-1-codec` → `url-2-store` (depende de 1) → `url-3-validation` (depende de 2).
- Variante em waves (piloto S5): wave 1 = 2 stories independentes (codec + validação), wave 2 = 1 story integradora (store que consome ambas).

Cada story: arquivo `docs/stories/*.md`, status `Ready`, ACs no formato
`- [ ] AC1:` com asserções executáveis (ex.: `encode(62) === "10"`).

## Braços

| Braço | Execução |
|---|---|
| **A — candidato** | O mecanismo sob teste (motor, wrapper de waves, fan-out), story a story, com gates do mecanismo |
| **B — nativo** | UMA chamada única de `claude` com o briefing completo das 3 stories |

Regras de justiça: mesma task, mesmo modelo, mesmo cwd limpo por braço,
nenhuma dica extra pra nenhum braço.

## Scoreboard (dimensões pré-registradas)

Para cada braço, medir e registrar:

1. **Correctness** — stories completas (código existe e faz o que o AC pede) + `node --test` passes/total.
2. **Cost** — nº de invocações de modelo + wall time total.
3. **Coordination value** — a camada de coordenação pegou algum erro real, ou só adicionou latência? (evidência concreta, não opinião)
4. **Determinism/portability** — falhas de ambiente (spawn, estado compartilhado) por braço.

## Critério de veredito (pré-registrado, inegociável)

- Candidato **vence** em correctness E não custa mais → adota (vira produto com doc).
- Candidato **empata** em correctness com custo menor → adota.
- Qualquer outro resultado → **não vira produto**; registra o veredito no
  checkpoint e o mecanismo fica como utilitário/reserva com nota de honestidade.

## Registro

Resultado SEMPRE vira `CHECKPOINT-<tema>-<data>.md` no épico correspondente,
com dados brutos (contagens, tempos, falhas) — nunca só a conclusão. A falha
achada em qualquer braço vira caso permanente no golden set
(`tests/evals/epic-gates/cases.json`), conforme a política do README dos evals.
