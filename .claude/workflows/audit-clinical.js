export const meta = {
  name: 'audit-clinical',
  description: 'Auditoria clínica multi-frente: fan-out de auditores → verificação adversarial graduada por severidade → síntese com veredito GO/NO_GO em audits/AF-<date>-<slug>.md',
  phases: [
    { title: 'Descoberta', detail: 'um auditor por frente, achados com severidade e evidência file:line' },
    { title: 'Verificação', detail: 'céticos graduados: critical/high = 2 lentes, medium = 1, low = direto' },
    { title: 'Síntese', detail: 'relatório AF consolidado, placar, plano em ondas, veredito' },
  ],
}

// Contrato de args (obrigatórios primeiro):
//   date  (string 'YYYYMMDD')  — data do relatório; Date.now() é indisponível em workflows, então vem de fora.
//   slug  (string kebab-case)  — sufixo do arquivo: audits/AF-<date>-<slug>.md
//   fronts (opcional)          — array de {key, prompt} ou de strings (keys das frentes default); default: 8 frentes clínicas
//   context (opcional)         — bloco de contexto extra: lei do dono, fatos já estabelecidos (não re-litigar), baseline
//   maxFindingsPerFront (opcional, default 10)

if (!args || !args.date || !/^\d{8}$/.test(String(args.date))) {
  throw new Error("audit-clinical exige args.date no formato YYYYMMDD (workflows não têm acesso a Date.now()). Ex.: {date: '20260711', slug: 'pre-release'}")
}
if (!args.slug || !/^[a-z0-9][a-z0-9-]*$/.test(String(args.slug))) {
  throw new Error("audit-clinical exige args.slug em kebab-case. Ex.: {date: '20260711', slug: 'pre-release'}")
}

const MAX_FINDINGS = args.maxFindingsPerFront || 10
const DOC_PATH = `audits/AF-${args.date}-${args.slug}.md`

const DEFAULT_FRONTS = [
  { key: 'codigo-core', prompt: 'Audite o core executável (bin/, .sinapse-ai/core/): promessas vs funcionamento real, código morto, erros silenciosos, contratos quebrados entre módulos.' },
  { key: 'seguranca', prompt: 'Audite segurança: segredos em plaintext, injeção, validação de input nos entry points, permissões de hooks, superfícies de escrita perigosas, dependências com vulnerabilidade conhecida (npm audit read-only).' },
  { key: 'docs-honestidade', prompt: 'Audite honestidade da documentação: docs/ e README prometem algo que o código não faz? Comandos documentados existem? Números citados batem com a realidade?' },
  { key: 'testes-evals', prompt: 'Audite a malha de testes e evals: o que os testes provam de verdade vs tautologia, módulos críticos sem cobertura real, suítes desligadas, flakiness conhecida.' },
  { key: 'instalacao-ux', prompt: 'Audite a experiência de instalação e primeiro uso: caminhos npx documentados funcionam? Wizard cobre os fluxos? Mensagens de erro ensinam o próximo passo?' },
  { key: 'squads-agents', prompt: 'Audite squads e agentes: definições quebradas, vazamento de estrutura interna em output user-facing, disciplina de delegação dos orquestradores, codinomes em colisão.' },
  { key: 'ci-release', prompt: 'Audite CI e release: workflows quebrados ou vermelhos, guards que não rodam onde deviam, gaps entre o que o CI valida e o que publica.' },
  { key: 'metricas-exatidao', prompt: 'Audite exatidão de métricas do ecossistema: contagens de squads/agentes/tasks citadas em qualquer doc batem com a fonte canônica (metadata.json / entity registry)?' },
]

const fronts = (Array.isArray(args.fronts) && args.fronts.length > 0)
  ? args.fronts.map((f) => (typeof f === 'string' ? DEFAULT_FRONTS.find((d) => d.key === f) || { key: f, prompt: `Audite a frente "${f}" do repositório com rigor clínico.` } : f))
  : DEFAULT_FRONTS

const CONTEXT = `Repo: o diretório de trabalho atual (use paths RELATIVOS em toda evidência).
${args.context || ''}
Regras de auditoria: evidência é file:line ou comando+saída — achado sem evidência concreta não existe. "Tem teste" não prova consumidor real. O framework usa consumo dinâmico (dispatch por string, registries YAML, referências dentro de markdown) — grep por import direto não basta. Não instale nada, não mude arquivos, não rode comandos com efeito colateral (smoke read-only via node -e é ok).`

const FINDINGS_SCHEMA = {
  type: 'object',
  required: ['summary', 'findings'],
  properties: {
    summary: { type: 'string', description: 'Resumo da frente em 3-5 frases' },
    findings: {
      type: 'array',
      description: `No máximo ${MAX_FINDINGS} achados significativos (agrupe itens semelhantes; lista longa vira 1 achado agregado com a lista no detail)`,
      items: {
        type: 'object',
        required: ['title', 'detail', 'severity', 'evidence'],
        properties: {
          title: { type: 'string' },
          detail: { type: 'string' },
          severity: { enum: ['critical', 'high', 'medium', 'low'] },
          evidence: { type: 'string', description: 'file:line das evidências-chave' },
          recommended_action: { type: 'string' },
        },
      },
    },
  },
}

const VERDICT_SCHEMA = {
  type: 'object',
  required: ['refuted', 'reasoning'],
  properties: {
    refuted: { type: 'boolean', description: 'true APENAS se você refutou o achado com evidência concreta (file:line)' },
    reasoning: { type: 'string' },
    new_evidence: { type: 'string', description: 'file:line do que o auditor não viu (vazio se nada)' },
  },
}

const SYNTH_SCHEMA = {
  type: 'object',
  required: ['docPath', 'verdict', 'executive_summary', 'headline_findings', 'counts'],
  properties: {
    docPath: { type: 'string' },
    verdict: { enum: ['GO', 'NO_GO'] },
    executive_summary: { type: 'string', description: '3-5 frases, PT-BR' },
    headline_findings: { type: 'array', items: { type: 'string' } },
    counts: {
      type: 'object',
      required: ['critical', 'high', 'medium', 'low', 'confirmed', 'refuted', 'unverified'],
      properties: {
        critical: { type: 'number' }, high: { type: 'number' }, medium: { type: 'number' }, low: { type: 'number' },
        confirmed: { type: 'number' }, refuted: { type: 'number' }, unverified: { type: 'number' },
      },
    },
  },
}

function skepticLenses(frontKey, f) {
  const claim = `Achado (frente ${frontKey}): "${f.title}" — ${f.detail}. Severidade alegada: ${f.severity}. Evidência alegada: ${f.evidence}.`
  return [
    `Você é um cético adversarial (lens: EVIDÊNCIA-CONCRETA). ${claim}\n${CONTEXT}\nSua missão é REFUTAR: verifique você mesmo a evidência na main atual — o file:line existe e sustenta o claim? Há consumidor/mitigação/config que o auditor não viu (dispatch dinâmico, registries YAML, referências em markdown, CI)? refuted=true só com evidência concreta em new_evidence.`,
    `Você é um cético adversarial (lens: RISCO-REAL). ${claim}\n${CONTEXT}\nSua missão é REFUTAR o IMPACTO: mesmo que o fato seja verdadeiro, a severidade se sustenta? Trace o caminho de execução real — o cenário de falha alcança usuário/produção, ou é teórico/inalcançável/mitigado? Se a severidade real for menor que a alegada, refuted=true e explique a reclassificação em new_evidence.`,
  ]
}

// Política de confirmação (padrão AF-20260702): critical/high = 2 lentes (2 refutam → REFUTADO;
// 1 refuta → NÃO-VERIFICADO/voto dividido; 0 refutam → CONFIRMADO). medium = 1 lente. low = confirmado direto.
async function verifyFinding(frontKey, f) {
  if (f.severity === 'low') return { ...f, status: 'confirmed', skeptics: [] }
  const lenses = skepticLenses(frontKey, f)
  const prompts = f.severity === 'medium' ? [lenses[0]] : lenses
  const votes = (await parallel(prompts.map((p) => () =>
    agent(p, { label: `verify:${frontKey}`, phase: 'Verificação', schema: VERDICT_SCHEMA })
  ))).filter(Boolean)
  if (votes.length === 0) return { ...f, status: 'unverified', skeptics: [] }
  const refutes = votes.filter((v) => v.refuted).length
  const status = refutes === votes.length ? 'refuted' : refutes > 0 ? 'unverified' : 'confirmed'
  return { ...f, status, skeptics: votes }
}

log(`Auditoria clínica: ${fronts.length} frentes, verificação graduada, saída em ${DOC_PATH}`)

const perFront = await pipeline(
  fronts,
  (front) => agent(
    `Você é um auditor clínico de framework. Frente: ${front.key}.\n${front.prompt}\n${CONTEXT}\nClassifique cada achado por severidade honesta (critical = quebra usuário/produção ou mente pro usuário; high = defeito real de alto impacto; medium = defeito real de impacto contido; low = melhoria). Retorne via StructuredOutput.`,
    { label: `descoberta:${front.key}`, phase: 'Descoberta', schema: FINDINGS_SCHEMA }
  ),
  async (report, front) => {
    if (!report) return null
    const verified = await parallel((report.findings || []).map((f) => () => verifyFinding(front.key, f)))
    return { front: front.key, summary: report.summary, findings: verified.filter(Boolean) }
  }
)

const frontResults = perFront.filter(Boolean)
const all = frontResults.flatMap((r) => r.findings.map((f) => ({ ...f, front: r.front })))
const confirmed = all.filter((f) => f.status === 'confirmed')
const criticalConfirmed = confirmed.filter((f) => f.severity === 'critical')

log(`Descoberta+verificação: ${all.length} achados (${confirmed.length} confirmados, ${criticalConfirmed.length} critical). Sintetizando...`)

phase('Síntese')

const synth = await agent(
  `Você é o sintetizador de uma auditoria clínica.\n${CONTEXT}\nEscreva o arquivo ${DOC_PATH} (crie a pasta se preciso) consolidando os dados abaixo. Formato AF da casa (PT-BR sóbrio, sem nomes de agentes internos):\n1. Frontmatter YAML: id: AF-${args.date}-${args.slug}, type: clinical-audit, date (ISO da data ${args.date}), verdict (NO_GO se houver QUALQUER critical confirmado, senão GO), counts por severidade e por status, method: "fan-out ${fronts.length} frentes + verificação adversarial graduada", agents_used (estime pelo volume).\n2. Placar (tabela: severidade × confirmado/refutado/não-verificado).\n3. Achados por frente — cada um com severidade, status, evidência file:line; AGRUPE duplicatas entre frentes num único achado citando also_reported_by.\n4. Seção "Refutados e não-verificados" com o racional do cético.\n5. Limitações da auditoria.\n6. Plano priorizado em Ondas (1 = crítico-barato, 2 = alto-valor, 3 = estrutural) — só com achados confirmados.\n7. Próximo passo (1 linha).\nRegra: achado refutado NÃO entra no plano; voto dividido entra como "não-verificado" fora do plano, listado pra decisão do dono.\n\nDADOS (JSON):\n${JSON.stringify({ fronts: frontResults })}`,
  { label: 'síntese', phase: 'Síntese', schema: SYNTH_SCHEMA }
)

if (!synth) {
  return { error: 'síntese falhou', fronts: frontResults.length, findings: all.length, data: frontResults }
}

return {
  docPath: synth.docPath,
  verdict: synth.verdict,
  executive_summary: synth.executive_summary,
  headline_findings: synth.headline_findings,
  counts: synth.counts,
  stats: { fronts: frontResults.length, findings: all.length, confirmed: confirmed.length, critical_confirmed: criticalConfirmed.length },
}
