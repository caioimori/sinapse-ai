export const meta = {
  name: 'deep-dive-rationalization',
  description: 'Deep-dive SINAPSE-AI: mapa do core (28 módulos), features inertes/redundantes, gargalos de orquestração, verificação adversarial e plano P0-P3',
  phases: [
    { title: 'Mapa', detail: 'um auditor por módulo do core (28)' },
    { title: 'Especiais', detail: 'bin/ entries, tasks/workflows órfãos, linhagens de execução, coverage real' },
    { title: 'Verify', detail: 'céticos adversariais em cada achado não-funcional' },
    { title: 'Síntese', detail: 'doc consolidado + plano P0-P3 em docs/audits/' },
  ],
}

const REPO = '.' // repo = diretório de trabalho atual (agentes rodam com cwd no repo)
const MODULES = ['code-intel','config','docs','doctor','elicitation','errors','events','execution','external-executors','graph-dashboard','grounding','health-check','ideation','ids','logger','manifest','mcp','memory','migration','orchestration','permissions','quality-gates','registry','session','synapse','telemetry','ui','utils']

const CONTEXT = `Repo: ${REPO} (framework SINAPSE-AI, pacote npm Node.js, branch caio/epic/orchestration-consolidation).
LEI TRAVADA (decisão do dono): potencializar, não cortar. "Fundir duplicata real no módulo mais forte" É potencializar (não perde capacidade). Corte só pode ser PROPOSTO se comprovadamente: sem valor E sem consumidor E sem caminho de potencialização.
FATOS JÁ ESTABELECIDOS (não re-litigar, mas pode validar):
- synapse engine e ideation engine JÁ foram cabeados em sessões anteriores (auto-bootstrap via scripts/generate-synapse-runtime.js no pretest+postinstall; comando "sinapse ideate" com analisadores em Node puro). Se analisar esses módulos, valide se o cabeamento é REAL hoje — não os re-flague como inertes por histórico antigo.
- Os dois parallel-executor NÃO são duplicata (propósitos diferentes) — mislabel já corrigido.
- frameworkProtection: false neste repo é modo contribuidor deliberado, não bug.
ATENÇÃO CRÍTICA: o framework usa MUITO consumo dinâmico — dispatch por nome/string, registries YAML em .sinapse-ai/data/, tasks referenciados por path dentro de markdown de agents/workflows, subcommands de CLI montados dinamicamente. Grep por require/import direto NÃO basta: procure também referências por string (nome do módulo, nome de arquivo, nome de comando).
Use Grep/Glob com paths escopados e head_limit. Não instale nada, não mude arquivos do repo, não rode comandos com efeito colateral (smoke test read-only via node -e é ok).`

const MODULE_SCHEMA = {
  type: 'object',
  required: ['module','promise','consumers','works','verdict','recommended_action','action_detail','priority','evidence'],
  properties: {
    module: { type: 'string' },
    promise: { type: 'string', description: 'O que o módulo promete entregar, 1-2 frases' },
    consumers: { type: 'array', items: { type: 'object', required: ['file','detail'], properties: { file: { type: 'string' }, detail: { type: 'string' } } }, description: 'Consumidores REAIS encontrados (estáticos e dinâmicos), com file e como consome' },
    works: { type: 'string', description: 'Evidência de que funciona (ou não) quando invocado de verdade' },
    verdict: { enum: ['funcional','inerte','redundante','misto'] },
    overlap_with: { type: ['string','null'], description: 'Módulo(s) do core com sobreposição real, ou null' },
    recommended_action: { enum: ['manter','potencializar','cabear','fundir','cortar-propor'] },
    action_detail: { type: 'string', description: 'Como executar a ação recomendada, concreto' },
    priority: { enum: ['P0','P1','P2','P3'] },
    evidence: { type: 'string', description: 'file:line das evidências-chave' },
  },
}

const VERDICT_SCHEMA = {
  type: 'object',
  required: ['refuted','reasoning'],
  properties: {
    refuted: { type: 'boolean', description: 'true se você refutou o achado com evidência concreta' },
    reasoning: { type: 'string' },
    new_evidence: { type: 'string', description: 'file:line do que você encontrou que o auditor não viu (vazio se nada)' },
  },
}

const FINDINGS_SCHEMA = {
  type: 'object',
  required: ['summary','findings'],
  properties: {
    summary: { type: 'string', description: 'Resumo da frente em 3-5 frases' },
    findings: {
      type: 'array',
      items: {
        type: 'object',
        required: ['title','detail','verdict','recommended_action','priority','evidence'],
        properties: {
          title: { type: 'string' },
          detail: { type: 'string' },
          verdict: { enum: ['funcional','inerte','redundante','gargalo','info'] },
          recommended_action: { enum: ['manter','potencializar','cabear','fundir','cortar-propor','otimizar','nenhuma'] },
          priority: { enum: ['P0','P1','P2','P3'] },
          evidence: { type: 'string' },
        },
      },
      description: 'Agregue em no máximo 10 achados significativos (agrupe itens semelhantes, ex: lista de órfãos vira 1 achado com a lista no detail)',
    },
  },
}

const SYNTH_SCHEMA = {
  type: 'object',
  required: ['docPath','executive_summary','headline_findings','p0_count','p1_count','p2_count','p3_count'],
  properties: {
    docPath: { type: 'string' },
    executive_summary: { type: 'string', description: '3-5 frases, PT-BR' },
    headline_findings: { type: 'array', items: { type: 'string' }, description: 'Os 8-12 achados mais importantes, uma frase cada' },
    p0_count: { type: 'number' },
    p1_count: { type: 'number' },
    p2_count: { type: 'number' },
    p3_count: { type: 'number' },
  },
}

function skepticPrompts(subject, report) {
  const claim = `Veredicto do auditor: ${report.verdict}. Ação recomendada: ${report.recommended_action} (${report.action_detail}). Evidência alegada: ${report.evidence}. Consumidores que ele achou: ${JSON.stringify(report.consumers || [])}.`
  return [
    `Você é um cético adversarial (lens: CONSUMIDOR ESCONDIDO). Um auditor analisou "${subject}" no repo e concluiu: ${claim}\n${CONTEXT}\nSua missão é REFUTAR: cace consumidores que o auditor não viu — dispatch dinâmico por string, registries YAML em .sinapse-ai/data/, referências dentro de markdown de tasks/workflows/agents (.sinapse-ai/development/), subcommands em bin/, hooks de git, postinstall, CI em .github/workflows, scripts/ e tests/. Se achar UM consumidor real com file:line, refuted=true. Se não achar nada após busca honesta, refuted=false.`,
    `Você é um cético adversarial (lens: FUNCIONA-DE-VERDADE + VALOR LATENTE). Um auditor analisou "${subject}" no repo e concluiu: ${claim}\n${CONTEXT}\nSua missão é REFUTAR por dois ângulos: (1) verifique você mesmo se o código funciona ou não quando invocado — siga o caminho de execução real, smoke test read-only se seguro; se o auditor errou o diagnóstico de funcionamento, refuted=true. (2) Existe caminho ÓBVIO e barato de potencialização que muda a recomendação (ex: cabear em consumidor existente)? Se sim, refuted=true e descreva o caminho em new_evidence.`,
  ]
}

log('Mapa do core: 28 auditores + céticos por achado, em pipeline')

const modulePromise = pipeline(
  MODULES,
  (m) => agent(
    `Você é um auditor de framework. Analise o módulo \`${m}\` em ${REPO}/.sinapse-ai/core/${m}/.\n${CONTEXT}\nTarefas:\n1. Leia o código do módulo (entry points, index, README se houver) e resuma o que ele PROMETE.\n2. Encontre TODOS os consumidores reais: Grep por imports/requires E por referências dinâmicas (nome por string) em bin/, .sinapse-ai/core/ (outros módulos), .sinapse-ai/development/, .sinapse-ai/data/, scripts/, tests/, packages/, .github/. Auto-referência (o módulo consumindo a si mesmo) NÃO conta como consumidor.\n3. Avalie se o módulo FUNCIONA quando invocado de verdade (trace o caminho; smoke read-only via node -e se ajudar).\n4. Detecte sobreposição REAL de responsabilidade com outros módulos do core: ${MODULES.join(', ')}.\n5. Classifique (funcional/inerte/redundante/misto) e recomende ação conforme a LEI. Seja honesto: "tem testes" NÃO prova consumidor real — teste que só testa o próprio módulo é tautologia.\nRetorne via StructuredOutput.`,
    { label: `mapa:${m}`, phase: 'Mapa', schema: MODULE_SCHEMA }
  ),
  async (report, m) => {
    if (!report) return null
    const clean = report.verdict === 'funcional' && (report.recommended_action === 'manter' || report.recommended_action === 'potencializar')
    if (clean) return { ...report, contested: false, skeptics: [] }
    const votes = await parallel(
      skepticPrompts(`módulo core/${m}`, report).map((p) => () =>
        agent(p, { label: `verify:${m}`, phase: 'Verify', schema: VERDICT_SCHEMA })
      )
    )
    const valid = votes.filter(Boolean)
    const refuted = valid.filter((v) => v.refuted)
    return { ...report, contested: refuted.length > 0, skeptics: valid }
  }
)

const SPECIALS = [
  {
    key: 'bin-entries',
    prompt: `Analise os 8 entry points em ${REPO}/bin/ (cli.js, sinapse.js, sinapse-init.js, sinapse-ids.js, sinapse-graph.js, sinapse-delegate.js, sinapse-minimal.js, postinstall.js) MAIS o package.json (campos bin, main, scripts) e o install-manifest se relevante.\n${CONTEXT}\nDetermine: qual entry é o canônico; o que cada um faz; quais se sobrepõem (mesmos subcommands implementados 2x? wrappers finos?); proposta concreta de consolidação SEM quebrar contratos públicos (nomes de bin instalados via npm, postinstall, scripts referenciados em docs). Este é o item BIN-ENTRY-OVERLAP pendente do handoff.`,
  },
  {
    key: 'tasks-orfaos',
    prompt: `${REPO}/.sinapse-ai/development/tasks/ tem 211 tasks .md. Determine quais são ÓRFÃOS (zero referências fora da própria pasta) vs ativos.\n${CONTEXT}\nMétodo sugerido: script Bash único que, pra cada arquivo, busca o basename (com E sem extensão .md) no repo inteiro excluindo a própria pasta tasks, node_modules e .git. ATENÇÃO: tasks são referenciados sem extensão, por nome parcial, dentro de YAML de agents/workflows e dentro de markdown (inclusive .claude/ e squads/). Reporte: contagem órfãos vs ativos, lista completa dos órfãos (no detail de UM achado agregado), e clusters de tasks redundantes (nomes/temas quase idênticos que poderiam fundir).`,
  },
  {
    key: 'workflows-orfaos',
    prompt: `${REPO}/.sinapse-ai/development/workflows/ tem 16 workflows. Determine quais são invocados por CÓDIGO real (ex: greenfield-handler.js, workflow-executor, CLI) vs apenas citados em docs vs completamente órfãos.\n${CONTEXT}\nPra cada workflow: quem invoca (file:line), e se há workflows redundantes entre si (fluxos quase idênticos que poderiam fundir). Reporte achados agregados.`,
  },
  {
    key: 'linhagens-gargalos',
    prompt: `Trace o fluxo de orquestração end-to-end do framework: de um comando do usuário (ex: sinapse delegate, story development cycle, greenfield) até execução por agente e QA. Módulos-chave: ${REPO}/.sinapse-ai/core/orchestration/, core/execution/, core/external-executors/.\n${CONTEXT}\nO épico anterior unificou 3 linhagens de execução; terminal-spawner ainda existe (usado por bob/greenfield/workflow-executor). Identifique: (1) divergências restantes entre linhagens de execução; (2) redundâncias de caminho (mesma coisa feita 2x em pontos diferentes do fluxo); (3) gargalos reais — passos sequenciais que podiam ser paralelos, releituras repetidas de arquivos/YAML, hops desnecessários entre módulos; (4) localize também "workflow-intelligence" (citado na auditoria anterior como vaporware) — onde vive hoje, se tem consumidor real. Foco: deixar o motor FLUIDO.`,
  },
  {
    key: 'coverage-real',
    prompt: `A auditoria anterior do repo ${REPO} alegou que o coverage de 24% é decorativo e que orchestration/execution estão EXCLUÍDOS da medição.\n${CONTEXT}\nVerifique: (1) leia a config de teste/coverage (jest.config*, package.json scripts, .nycrc etc.) e confirme o que está excluído; (2) se viável em menos de 8 minutos, rode coverage ESCOPADO só pra .sinapse-ai/core/orchestration e core/execution (descubra o runner primeiro); se inviável, faça análise estática honesta: quais arquivos desses módulos têm teste que os exercita de verdade (não mock total). Reporte números reais e o gap.`,
  },
]

log('Frentes especiais: bin/, tasks órfãos, workflows, linhagens/gargalos, coverage')

const specialPromise = pipeline(
  SPECIALS,
  (s) => agent(s.prompt, { label: `especial:${s.key}`, phase: 'Especiais', schema: FINDINGS_SCHEMA }),
  async (rep, s) => {
    if (!rep) return null
    const checked = await parallel(
      (rep.findings || []).map((f) => () => {
        const needsCheck = ['fundir','cortar-propor','cabear'].includes(f.recommended_action) || ['inerte','redundante'].includes(f.verdict)
        if (!needsCheck) return Promise.resolve({ ...f, contested: false, skeptic: null })
        return agent(
          `Você é um cético adversarial. Na frente "${s.key}" do repo, um auditor alegou: "${f.title}" — ${f.detail}. Evidência: ${f.evidence}. Ação recomendada: ${f.recommended_action}.\n${CONTEXT}\nREFUTE com evidência concreta (consumidor escondido, consumo dinâmico, funcionamento real diferente do alegado, contrato público que quebraria, caminho de potencialização que muda a recomendação). refuted=true só com file:line concreto em new_evidence.`,
          { label: `verify:${s.key}`, phase: 'Verify', schema: VERDICT_SCHEMA }
        ).then((v) => ({ ...f, contested: !!(v && v.refuted), skeptic: v }))
      })
    )
    return { area: s.key, summary: rep.summary, findings: checked.filter(Boolean) }
  }
)

const [moduleResultsRaw, specialResultsRaw] = await Promise.all([modulePromise, specialPromise])
const moduleResults = moduleResultsRaw.filter(Boolean)
const specialResults = specialResultsRaw.filter(Boolean)

log(`Mapa: ${moduleResults.length}/28 módulos analisados. Especiais: ${specialResults.length}/5 frentes. Sintetizando...`)

phase('Síntese')

const data = { modules: moduleResults, specials: specialResults }

const synth = await agent(
  `Você é o sintetizador do deep-dive de racionalização do SINAPSE-AI.\n${CONTEXT}\nEscreva o arquivo ${REPO}/docs/audits/DEEP-DIVE-RATIONALIZATION-2026-06.md consolidando os dados abaixo. Estrutura do doc (PT-BR sóbrio, sem nome de agentes internos):\n1. Resumo executivo (3 frases).\n2. Mapa do core — tabela: módulo | veredicto | ação recomendada | prioridade | contestado?\n3. Frentes especiais — um bloco por frente com os achados.\n4. Achados CONTESTADOS — para cada um, os dois lados (auditor vs cético, com evidências) e seu julgamento fundamentado de qual lado vence.\n5. Plano de racionalização P0→P3 — cada item: o quê, como (passos concretos), risco, e se precisa de OK explícito do dono (qualquer corte precisa).\nRegras: a LEI vence (potencializar > cortar); achados refutados pelo cético com evidência concreta NÃO entram no plano como estavam — entram ajustados. Inclua no fim a lista de módulos 100% saudáveis (veredicto funcional, sem ação).\n\nDADOS (JSON):\n${JSON.stringify(data)}`,
  { label: 'síntese', schema: SYNTH_SCHEMA }
)

if (!synth) {
  return { error: 'síntese falhou', modules: moduleResults.length, specials: specialResults.length, data }
}

const contestedCount = moduleResults.filter((r) => r.contested).length + specialResults.flatMap((s) => s.findings).filter((f) => f.contested).length

return {
  docPath: synth.docPath,
  executive_summary: synth.executive_summary,
  headline_findings: synth.headline_findings,
  plan_counts: { P0: synth.p0_count, P1: synth.p1_count, P2: synth.p2_count, P3: synth.p3_count },
  stats: { modules_analyzed: moduleResults.length, special_fronts: specialResults.length, contested_findings: contestedCount },
}