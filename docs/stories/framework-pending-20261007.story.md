---
id: framework-pending-20261007
status: Ready
---
# Corrigir pendências do framework com evidência real

## Status: Ready

## Story
Como operador, quero que as falhas remotas sejam corrigidas na causa e que as pendências de execução, avaliação e mídia tenham provas próprias, sem confundir uma instalação offline com qualidade global demonstrada.

## Authorization
Pedido direto de Caio nesta conversa em 07.10.2026: "arrume um jeito de passar e resolver essas paradas pendentes". Este lote abre a frente de reparos de testes e segurança. Produção, merge, NPM publish, cobranças novas e remoção de conteúdo continuam fora da autorização.

## Scope
Conteúdo-base `0415eac59835bdf450305d37fa3ddd564bb65761`, reaplicado sobre `origin/main` `842eeabc4e9fe39d42f1119c9dc85a8a1e70cbc5`; branch `codex/fix/framework-pending-clean-20261007`. O checkpoint `codex/fix/framework-pending-20261007` permanece preservado. A nova linha evita reincorporar os hashes derivados dos commits anteriores na faixa histórica de segredos, sem reescrever nenhum histórico. Trabalho somente na worktree `framework-pending`; fontes instaladas e históricas permanecem intactas. Testes e fixtures acompanham contratos reais, mantendo negativos de autoridade, orçamento, tamanho e segurança. Código de scripts e exemplos pode receber correções demonstráveis; dependências exigem pesquisa oficial, proveniência, licença e compatibilidade.

Não editar caminhos protegidos, ferramentas compartilhadas, hooks ou configuração de CI. Não remover, pular ou enfraquecer testes nem fazer bypass de alertas. Falsos positivos exigem prova da origem e controles negativos que continuem detectando segredos; nenhuma exceção ampla. Não iniciar build ou suíte local com C: abaixo de 10 GB. Checks remotos existentes são a alternativa pesada; infraestrutura tem freio de 20 minutos.

## Acceptance Criteria
- [ ] Falhas Node24/Windows/Coverage e macOS classificadas individualmente; reparos mantêm assertions de comportamento e segurança; resultados remotos observados por SHA.
- [ ] Alertas de segurança tratados por causa com revisão independente; nenhum alerta ou pacote anunciado resolvido por mera contagem, suppress ou mudança sem prova.
- [ ] Instalação real atual permanece íntegra durante os reparos; nova fonte é aplicada somente por plano CAS, snapshots e readback de ambos os provedores.
- [ ] Execução nativa dos provedores é observada quando acesso e orçamento permitirem; ausência de login ou autoridade é registrada exatamente, sem inventar inferência.
- [ ] Benchmark novo tem protocolo e casos congelados antes das respostas, condições separadas, revisão cega e limites explícitos; resultados não são extrapolados para expertise global.
- [ ] Mídia recebe reprodução e conferência técnica contínuas possíveis; audição/aprovação humana só é marcada com observação humana. Painel final é conferido em 1440/390 sem overflow.
- [ ] Lote termina com validação proporcional, commit/push/PR, prévia e relato de bloqueios restantes; nenhuma publicação em produção.

## File List
- `docs/stories/framework-pending-20261007.story.md`
- `docs/framework/expert-evolution-2026-10/PENDING-CLOSEOUT-SPEC.md`
- `docs/framework/expert-evolution-2026-10/pending-closeout.workflow.json`
- Demais arquivos são acrescentados pelos owners antes do fechamento.

## Rollback
Reverter apenas o lote novo pela branch/PR; manter fontes históricas e instalação `104c516d` íntegra até nova CAS. Qualquer instalação nova deve conservar journal e snapshots e ser recuperável sem modificar uma fonte já instalada.
