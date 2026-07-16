# Contribuindo com Squads

Squads publicos sao contribuidos neste repositorio, em `squads/`. Nao existe um
marketplace ou repositorio oficial separado no contrato atual.

Antes de implementar, abra uma proposta com problema, dominio, autoridade nao
sobreposta, agentes, tasks, providers, seguranca e mantenedor. Depois valide:

```bash
npm run validate:squad-schema:strict
npm run validate:squad-yaml
npm run sync:providers
npm run validate:parity
```

Veja o [guia canonico](../../guides/contributing-squads.md).
