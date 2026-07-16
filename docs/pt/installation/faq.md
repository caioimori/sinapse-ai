# FAQ de Instalacao

## Qual e o comando recomendado?

```bash
npx sinapse-ai@latest install
```

## O comando sem flags instala os dois providers?

Sim, em uma instalacao nova. Projetos existentes preservam a selecao salva; use
`--reconfigure` para troca-la.

## Como atualizar?

```bash
npx sinapse-ai@latest update
```

## Como validar?

```bash
npx sinapse-ai@latest status
npx sinapse-ai@latest doctor
```

## Existe marketplace ou repositorio oficial separado de squads?

Nao no contrato publico atual. Os 17 squads incluidos sao distribuidos pelo
pacote `sinapse-ai` e validados neste repositorio.

Veja o [FAQ canonico](../../installation/faq.md) e [SUPPORT.md](../../../SUPPORT.md).
