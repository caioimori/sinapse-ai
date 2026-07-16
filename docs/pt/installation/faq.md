# FAQ de Instalação

## Qual é o comando recomendado?

```bash
npx sinapse-ai@latest install
```

## O comando sem flags instala os dois providers?

Sim, em uma instalação nova. Projetos existentes preservam a seleção salva; use
`--reconfigure` para trocá-la.

## Como atualizar?

```bash
npx sinapse-ai@latest install
```

O comando é idempotente e detecta a instalação existente.

## Como validar?

```bash
npx sinapse-ai@latest status
npx sinapse-ai@latest doctor
```

## Existe marketplace ou repositório oficial separado de squads?

Não no contrato público atual. Os 17 squads incluídos são distribuídos pelo
pacote `sinapse-ai` e validados neste repositório.

Veja o [FAQ canônico](../../installation/faq.md) e [SUPPORT.md](../../../SUPPORT.md).
