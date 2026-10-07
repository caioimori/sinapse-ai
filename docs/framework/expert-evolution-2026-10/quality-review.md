# Revisão independente de qualidade

Status: **PASS local**, iteração 3/3. Story Ready `expert-evolution-20261002`; base `45e979f25931730ef1428d65e3dcb0a3b544a51f`. Revisão sem autoria do pacote/perfis, sem correções de código, staging, commit, instalação global ou publicação.

## Achados

| ID | Gravidade | Evidência | Efeito |
|---|---|---|---|
| QA-MODEL-TIME | MEDIUM | `now:'not-a-date'` aceita Sol; expiry sem reviewedAt valida | Entrada malformada não falha fechada |
| QA-MODEL-JUNCTION | MEDIUM | loadPolicy lê JSON por junction de ancestral externo | CLI standalone não confina a política; runtime já bloqueia essa rota |

Ambos corrigidos pelo developer e reprovados independentemente na iteração 2: relógio inválido e par expiry/review ausente rejeitados; junction ancestral externo rejeitado; Sol atual permitido e expiração exata bloqueada. Os achados estão fechados.

## Evidência observada

- Programa válido: 172 perfis planejados, 17 squads; 2 referências READ e 88 CANDIDATE. Cobertura é planejamento, sem promoção.
- Corpus: 67 fontes, 112 regras, 172 coverage=gap. Receipt de merge e hash do pack conferem; prioridade com 32 fontes/45 regras inferidas, hash/locator/readScope/licença presentes.
- Catálogo: 355 drifts esperados na baseline. Refresh atual PASS com 5.082 paths, 172 agentes, 17 squads e 9 entradas/66 comandos públicos; baseline não sobrescrita.
- Runtime/entrega: leitura de confinamento, budget JSON completo 12k/6k/3k, parcial/stale fail-closed, mapa global de canonical.path, backup, hashes e CAS antes da publicação de arquivo. Não houve instalação real.
- Autoridade: fontes suplementares preservam gates canônicos. As alterações de clonagem estão limitadas às duas fontes permitidas e substituem carga integral por recuperação medida.
- Modelos: Sol nativo disponível nesta sessão; acesso autenticado Opus não validado; Jev offline por falta de credencial, nenhum gasto/call atribuído.

## Benchmark cego

Julgamento em [benchmark-blind-review.json](../../../research/expert-evolution/benchmark-blind-review.json). Foram lidos apenas prompts, critérios reservados e outputs anônimos em `review-blind.json`; a identidade das variantes não foi consultada.

Modal A recebeu 1 por não especificar Escape; carousel-density B recebeu 1 por omitir equivalente textual acessível. Demais outputs receberam 2, sem alegações falsas identificadas. A/B são rótulos por caso, não variantes agregáveis.

A especificidade pode revelar indiretamente a condição. Dez decisões escritas e uma geração por dois agentes novos não provam qualidade de telas/vídeos, significância estatística ou qualificação dos 172 agentes.

## Gate final

Root confirmou teste principal final com fontes congeladas: **178/178 testes, 14/14 suites PASS**, em 64,575 s; lint/typecheck PASS e 191 arquivos originais preservados. O principal foi executado pelo root, não repetido pelo reviewer.

Após fechar o julgamento cego, o resultado revelado foi **baseline 18/20; enriched 20/20**, com nove preferências enriched e um empate; nenhum false claim identificado. A omissão crítica de Escape e a omissão de equivalente textual estavam na baseline.

A última revisão comparou prompt, criticality, expectedDecision, requiredEvidence e counterexamples dos dez casos atuais com os critérios do arquivo cego: zero diferenças. Metadados posteriores de reserva/receipt não alteraram os critérios avaliados.

A política final passou no schema, registrou localBenchmark=true no escopo delimitado e conservou passed=false. Sol segue disponível para execução; promoção continua bloqueada. O hash atual da política é `466f3fd15964a7981ec286a7c85dbfbe66b18b353124f7e78044db8d911bc1b9`.

Guardas de data malformada e junction ancestral externo foram novamente comprovadas na iteração 3. Diff independente dos paths protegidos contra a base permanece vazio. O report JSON registra os hashes atuais dos seis arquivos auditados.

PASS refere-se ao código e às alegações locais. Não certifica qualidade visual/audio, significância estatística, competências integrais, acesso Opus/Jev, instalação global ou publicação. Gates de staging/segredos/manifest/story e checkpoint permanecem com o root.
