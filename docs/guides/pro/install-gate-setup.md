# SINAPSE Pro — Guia de Instalacao e Licenciamento

Guia completo para instalar, ativar e gerenciar o SINAPSE Pro.

**Story:** PRO-6 — License Key & Feature Gating System

---

## Visao Geral

O SINAPSE Pro e distribuido via npm publico. O pacote e livre para instalar, mas as features premium requerem uma **licenca ativa** para funcionar.

```
Comprar Licenca → Instalar → Ativar → Usar Features Pro
```

### Pacotes npm

| Pacote | Tipo | Proposito |
|--------|------|-----------|
| `sinapse-pro` | CLI (1.8 KB) | Comandos de instalacao e gerenciamento |
| `@sinapse-fullstack/pro` | Core (10 MB) | Features premium (squads, memory, metrics, integrations) |

---

## Instalacao Rapida

```bash
# Instalar SINAPSE Pro (instala @sinapse-fullstack/pro automaticamente)
npx sinapse-pro install

# Ativar sua licenca
npx sinapse-pro activate --key PRO-XXXX-XXXX-XXXX-XXXX

# Verificar ativacao
npx sinapse-pro status
```

---

## Passo a Passo

### Prerequisitos

- Node.js >= 18
- `sinapse-ai` >= 4.0.0 instalado no projeto

### Passo 1: Instalar SINAPSE Pro

```bash
npx sinapse-pro install
```

Isso executa `npm install @sinapse-fullstack/pro` no seu projeto.

**Alternativa** (instalacao manual):

```bash
npm install @sinapse-fullstack/pro
```

### Passo 2: Ativar Licenca

Apos a compra, voce recebera uma chave no formato `PRO-XXXX-XXXX-XXXX-XXXX`.

```bash
npx sinapse-pro activate --key PRO-XXXX-XXXX-XXXX-XXXX
```

Esse comando:
1. Valida a chave contra o License Server (`https://sinapse-license-server.vercel.app`)
2. Registra sua maquina (machine ID unico)
3. Salva um cache local criptografado para uso offline

### Passo 3: Verificar

```bash
# Status da licenca
npx sinapse-pro status

# Listar features disponiveis
npx sinapse-pro features
```

---

## Comandos Disponiveis

| Comando | Descricao |
|---------|-----------|
| `npx sinapse-pro install` | Instala `@sinapse-fullstack/pro` no projeto |
| `npx sinapse-pro activate --key KEY` | Ativa uma chave de licenca |
| `npx sinapse-pro status` | Mostra status da licenca atual |
| `npx sinapse-pro features` | Lista todas as features pro e disponibilidade |
| `npx sinapse-pro validate` | Forca revalidacao online da licenca |
| `npx sinapse-pro deactivate` | Desativa a licenca nesta maquina |
| `npx sinapse-pro help` | Mostra todos os comandos |

---

## Operacao Offline

Apos a instalacao e ativacao, o SINAPSE Pro funciona offline:

- **30 dias** sem necessidade de revalidacao
- **7 dias de grace period** apos expirar o cache
- Verificacao de features 100% local no dia a dia

A internet so e necessaria para:
1. Ativacao inicial (`npx sinapse-pro activate`)
2. Revalidacao periodica (automatica a cada 30 dias)
3. Desativacao (`npx sinapse-pro deactivate`)

---

## CI/CD

Para pipelines, instale e ative usando secrets de ambiente:

**GitHub Actions:**
```yaml
- name: Install SINAPSE Pro
  run: npx sinapse-pro install

- name: Activate License
  run: npx sinapse-pro activate --key ${{ secrets.SINAPSE_PRO_LICENSE_KEY }}
```

**GitLab CI:**
```yaml
before_script:
  - npx sinapse-pro install
  - npx sinapse-pro activate --key ${SINAPSE_PRO_LICENSE_KEY}
```

---

## Troubleshooting

### Chave de licenca invalida

```
License activation failed: Invalid key format
```

- Verifique o formato: `PRO-XXXX-XXXX-XXXX-XXXX` (4 blocos de 4 caracteres hex)
- Sem espacos extras
- Abra uma issue em https://github.com/caioimori/sinapse-ai/issues se a chave foi fornecida a voce

### Maximo de seats excedido

```
License activation failed: Maximum seats exceeded
```

- Desative a licenca na outra maquina: `npx sinapse-pro deactivate`
- Ou contate support para aumentar o limite de seats

### Erro de rede na ativacao

```
License activation failed: ECONNREFUSED
```

- Verifique sua conexao com a internet
- O License Server pode estar temporariamente indisponivel
- Tente novamente em alguns minutos

---

## Arquitetura do Sistema

```
┌─────────────────┐     ┌─────────────────────────────────┐     ┌──────────┐
│  Cliente (CLI)   │────>│  License Server (Vercel)        │────>│ Supabase │
│  npx sinapse-pro    │<────│  sinapse-license-server.vercel.app │<────│ Database │
└─────────────────┘     └─────────────────────────────────┘     └──────────┘
                                                                      │
                                                                      │
                        ┌─────────────────────────────────┐           │
                        │  Admin Dashboard (Vercel)       │───────────┘
                        │  sinapse-license-dashboard         │
                        │  Cria/revoga/gerencia licencas  │
                        └─────────────────────────────────┘
```

| Componente | URL | Proposito |
|-----------|-----|-----------|
| License Server | `https://sinapse-license-server.vercel.app` | API de ativacao/validacao |
| Admin Dashboard | `https://sinapse-license-dashboard.vercel.app` | Gestao de licencas (admin) |
| Database | Supabase PostgreSQL | Armazena licencas e ativacoes |

---

## Suporte

- **Documentacao:** https://sinapse.ai/pro/docs
- **Comprar:** https://sinapse.ai/pro
- **Suporte:** https://github.com/caioimori/sinapse-ai/issues
- **Issues:** https://github.com/caioimori/sinapse-ai/issues

---

*SINAPSE Pro Installation Guide v3.0*
*Story PRO-6 — License Key & Feature Gating System*
