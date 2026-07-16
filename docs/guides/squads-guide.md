# Squad Development Guide

Use [the contributing squads guide](contributing-squads.md) as the canonical
development contract and [the overview](squads-overview.md) for the operating
model.

## Minimal workflow

1. Open a squad proposal with a concrete domain boundary.
2. Create a ready story before implementation.
3. Build canonical files under `squads/squad-<id>/`.
4. Generate provider adapters from the canonical source.
5. Run schema, pointer, count, and provider-parity validators.
6. Submit a focused PR with activation examples and test evidence.

```bash
npm run validate:squad-schema:strict
npm run validate:squad-yaml
npm run sync:providers
npm run validate:parity
```

Current public distribution is the `sinapse-ai` package and this repository.
Historical marketplace, separate repository, `pack.yaml`, `manifest.yaml`, or
`@squad:agent` examples are not part of the current squad contract.
