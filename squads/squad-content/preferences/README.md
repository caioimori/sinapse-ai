# Content Preferences

> Diretorio de preferencias de conteudo por cliente. Cada arquivo documenta aprendizados acumulados sobre o que funciona e o que nao funciona para cada projeto.

---

## Estrutura

```
preferences/
├── README.md                          # Este arquivo
├── {client-name}-preferences.md       # Preferencias por cliente
└── global-preferences.md              # Preferencias transversais (todos os clientes)
```

---

## Como Usar

### Criar Preferencias de Novo Cliente
Ao onboardar novo cliente, criar arquivo `{client-name}-preferences.md` com o template abaixo.

### Atualizar Preferencias
A task `update-content-preferences` (Index) e responsavel por atualizar preferencias baseado em:
- Feedback direto do cliente
- Padroes de performance (Lens)
- Padroes de rejeicao (Index)
- Feedback da audiencia

### Consultar Preferencias
Todos os agentes devem consultar preferencias do cliente antes de produzir:
- **Arc**: Consulta tom, estilo, formato preferido
- **North**: Consulta pilares favoritos, temas que funcionam
- **Morph**: Consulta plataformas prioritarias, horarios
- **Index**: Consulta padroes de qualidade especificos

---

## Template de Preferencias por Cliente

```markdown
# Preferencias: {Nome do Cliente}

## Tom e Estilo
- Tom preferido: {formal/informal/tecnico/casual}
- Palavras que adora: {lista}
- Palavras que odeia: {lista}
- Nivel de humor: {nenhum/leve/moderado}

## Formatos
- Formato favorito: {formato que mais gosta}
- Formato que evita: {formato que nao quer}
- Comprimento preferido: {curto/medio/longo}

## Temas
- Pilar favorito: {pilar com melhor recepcao}
- Temas que engajam mais: {lista}
- Temas a evitar: {lista}

## Plataformas
- Plataforma prioritaria: {principal}
- Horarios preferidos: {lista}

## Padroes de Performance
- Hook que funciona: {tipo}
- CTA que converte: {tipo}
- Formato top performer: {formato}

## Feedback Direto
| Data | Feedback | Fonte | Confianca |
|------|----------|-------|-----------|
| | | | |

## Historico de Atualizacoes
| Data | Mudanca | Motivo |
|------|---------|--------|
| | | |
```

---

*Operado por: content-governor (Index)*
*Task de referencia: update-content-preferences.md*
