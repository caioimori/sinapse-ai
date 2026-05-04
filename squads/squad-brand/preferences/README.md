# Preferences Directory

> Diretorio para logs de preferencias por projeto/cliente.
> Atualizado automaticamente pelo brand-auditor (Sentinel) via task `update-brand-preferences`.

## Como usar

1. Para cada novo projeto, criar uma copia de `templates/preference-log-template.md`
2. Nomear como `{projeto}-preferences.md` (ex: `astro-preferences.md`)
3. Sentinel atualiza apos cada ciclo de aprovacao
4. Todos os agents consultam antes de iniciar nova entrega

## Arquivos

- `README.md` — Este arquivo
- `{projeto}-preferences.md` — Um arquivo por projeto ativo
