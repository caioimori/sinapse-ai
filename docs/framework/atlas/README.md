# Framework Operating Atlas

The living, generated map of **how the SINAPSE framework works** — routing,
model selection, the constitution, the full workflow catalog, every agent and
squad. One source of truth, two renderings (plus the raw data):

| File | For | Format |
|---|---|---|
| [`OPERATING-ATLAS.md`](./OPERATING-ATLAS.md) | reading (human or LLM) | dense, navigable markdown with Mermaid diagrams |
| [`atlas.html`](./atlas.html) | exploring visually | self-contained dashboard — searchable/filterable tables + flow diagram |
| [`atlas-data.json`](./atlas-data.json) | tooling | structured data (one object per workflow / agent / squad / article / rule) |

## Regenerate

```bash
sinapse atlas          # regenerate all three from disk
sinapse atlas --open    # ...and open the visual dashboard
```

Counts are read directly from the repository every time, so the atlas is always
exact (Constitution **Article VII — Ecosystem Metrics Accuracy**). After adding
or changing a squad, agent, workflow, rule, or constitutional article, run
`sinapse atlas` to refresh.

## How it's built

- `​.sinapse-ai/core/atlas/atlas-data.js` — scans the repo → the single data object.
- `​.sinapse-ai/core/atlas/render-markdown.js` — the LLM-readable atlas.
- `​.sinapse-ai/core/atlas/render-html.js` — the visual dashboard.
- `​.sinapse-ai/core/atlas/index.js` — `generateAtlas()` (writes all three).

The narrative "operating model" and "routing" sections are authored in the
markdown renderer; every catalog (constitution, workflows, agents, squads,
rules) is generated, so the docs can never drift from the code.
