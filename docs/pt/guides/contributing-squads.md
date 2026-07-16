# Contribuindo com Squads

Squads públicos são contribuídos neste repositório, em `squads/`. Não existe um
marketplace ou repositório oficial separado no contrato atual.

Antes de implementar, abra uma proposta com problema, domínio, autoridade não
sobreposta, agentes, tasks, providers, segurança e mantenedor. Depois valide:

```bash
npm run validate:squad-schema:strict
npm run validate:squad-yaml
npm run sync:providers
npm run validate:parity
```

Veja o [guia canônico](../../guides/contributing-squads.md).
