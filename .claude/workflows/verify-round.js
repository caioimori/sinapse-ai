export const meta = {
  name: 'verify-round',
  description: 'Rodada cética pós-auditoria ou pós-fix: re-verifica item a item os achados confirmados de um relatório AF anterior — o que continua de pé, o que caiu, lacunas do critic e itens de mesa',
  phases: [
    { title: 'Extração', detail: 'lê o relatório anterior e isola os achados verificáveis' },
    { title: 'Ceticismo', detail: 'céticos adversariais por achado, graduados por severidade' },
    { title: 'Relatório', detail: 'audits/AF-<date>-rodada<N>-verificacao.md com placar, lacunas e mesa' },
  ],
}

// Contrato de args:
//   reportPath (obrigatório) — path relativo do relatório AF anterior (ex.: 'audits/AF-20260702-fable5-upgrade.md')
//   date       (obrigatório, 'YYYYMMDD') — data desta rodada (Date.now() indisponível em workflows)
//   round      (opcional, default 2) — número da rodada, usado no nome do arquivo
//   context    (opcional) — decisões do dono / fatos que não se re-litigam

if (!args || !args.reportPath) {
  throw new Error("verify-round exige args.reportPath (relatório AF anterior). Ex.: {reportPath: 'audits/AF-20260702-fable5-upgrade.md', date: '20260711'}")
}
if (!/^\d{8}$/.test(String(args.date || ''))) {
  throw new Error("verify-round exige args.date no formato YYYYMMDD (workflows não têm acesso a Date.now()).")
}

const ROUND = Number(args.round) || 2
const DOC_PATH = `audits/AF-${args.date}-rodada${ROUND}-verificacao.md`

const CONTEXT = `Repo: o diretório de trabalho atual (paths RELATIVOS em toda evidência).
${args.context || ''}
Regras: evidência é file:line ou comando+saída da main ATUAL. Consumo dinâmico existe (dispatch por string, registries YAML, referências em markdown) — grep por import direto não basta. Read-only: não mude nada. Fixes aplicados desde o relatório anterior contam como evidência de resolução.`

const EXTRACT_SCHEMA = {
  type: 'object',
  required: ['items'],
  properties: {
    items: {
      type: 'array',
      items: {
        type: 'object',
        required: ['title', 'claim', 'severity', 'evidence'],
        properties: {
          title: { type: 'string' },
          claim: { type: 'string', description: 'O que o relatório afirma que é verdade, verificável' },
          severity: { enum: ['critical', 'high', 'medium', 'low'] },
          evidence: { type: 'string', description: 'Evidência citada no relatório original' },
        },
      },
      description: 'Apenas achados CONFIRMADOS/afirmações de estado do relatório — não inclua os já-refutados nem opinião',
    },
  },
}

const VERDICT_SCHEMA = {
  type: 'object',
  required: ['still_true', 'reasoning'],
  properties: {
    still_true: { type: 'boolean', description: 'true se o achado CONTINUA verdadeiro na main atual; false se caiu (foi corrigido, mudou, ou a evidência não sustenta)' },
    reasoning: { type: 'string' },
    evidence_now: { type: 'string', description: 'file:line (ou comando+saída) na main ATUAL que fundamenta o veredito' },
  },
}

const REPORT_SCHEMA = {
  type: 'object',
  required: ['docPath', 'summary', 'gaps', 'mesa'],
  properties: {
    docPath: { type: 'string' },
    summary: { type: 'string', description: '3-5 frases PT-BR' },
    gaps: { type: 'array', items: { type: 'string' }, description: 'Lacunas do critic: o que a rodada anterior não olhou' },
    mesa: { type: 'array', items: { type: 'string' }, description: 'Itens que aguardam decisão do dono — nada disso se executa sem ok' },
  },
}

log(`Rodada ${ROUND} de verificação sobre ${args.reportPath}`)

const extracted = await agent(
  `Você prepara uma rodada de verificação cética. Leia ${args.reportPath} por completo e extraia os achados/afirmações CONFIRMADOS que dá pra re-verificar hoje (título, claim verificável, severidade, evidência original). Ignore o que o próprio relatório já marcou como refutado.\n${CONTEXT}\nRetorne via StructuredOutput.`,
  { label: 'extração', phase: 'Extração', schema: EXTRACT_SCHEMA }
)

if (!extracted || !Array.isArray(extracted.items) || extracted.items.length === 0) {
  return { error: `nenhum item verificável extraído de ${args.reportPath}`, confirmados: 0, cairam: 0 }
}

log(`${extracted.items.length} itens a re-verificar`)

function lenses(item) {
  const claim = `Item do relatório ${args.reportPath}: "${item.title}" — claim: ${item.claim}. Severidade: ${item.severity}. Evidência original: ${item.evidence}.`
  return [
    `Você é um cético adversarial (lens: AINDA-É-VERDADE). ${claim}\n${CONTEXT}\nRe-verifique o claim na main ATUAL, você mesmo, do zero: a evidência original ainda existe e sustenta? Houve fix/mudança desde então? still_true=true só se o fato se sustenta HOJE com evidência em evidence_now.`,
    `Você é um cético adversarial (lens: CONSUMIDOR-ESCONDIDO + IMPACTO). ${claim}\n${CONTEXT}\nProcure o que a rodada anterior não viu: consumidor/mitigação escondida (dispatch dinâmico, registries, CI, markdown), mudança de contexto que altera o impacto, ou severidade que não se sustenta. still_true=false exige evidência concreta em evidence_now.`,
  ]
}

const verified = (await pipeline(
  extracted.items,
  async (item) => {
    const ls = lenses(item)
    const prompts = (item.severity === 'critical' || item.severity === 'high') ? ls : [ls[0]]
    const votes = (await parallel(prompts.map((p) => () =>
      agent(p, { label: `cético:${item.title.slice(0, 30)}`, phase: 'Ceticismo', schema: VERDICT_SCHEMA })
    ))).filter(Boolean)
    if (votes.length === 0) return { ...item, verdict: 'nao-verificado', votes: [] }
    const falls = votes.filter((v) => !v.still_true).length
    const verdict = falls === votes.length ? 'caiu' : falls > 0 ? 'dividido' : 'continua'
    return { ...item, verdict, votes }
  }
)).filter(Boolean)

const continua = verified.filter((v) => v.verdict === 'continua')
const cairam = verified.filter((v) => v.verdict === 'caiu')
const divididos = verified.filter((v) => v.verdict === 'dividido' || v.verdict === 'nao-verificado')

log(`Vereditos: ${continua.length} continuam, ${cairam.length} caíram, ${divididos.length} divididos/não-verificados. Escrevendo relatório...`)

phase('Relatório')

const report = await agent(
  `Você fecha uma rodada de verificação cética. Escreva ${DOC_PATH} (formato AF da casa, PT-BR sóbrio):\n1. Frontmatter YAML: id: AF-${args.date}-rodada${ROUND}-verificacao, type: verify-round, date ISO, source: ${args.reportPath}, placar (continuam/caíram/divididos).\n2. Placar em tabela.\n3. Vereditos por severidade (critical→low): cada item com veredito, racional do cético e evidência ATUAL.\n4. Seção "Lacunas do critic" — o que a rodada anterior não olhou (derive dos padrões que você viu re-verificando; seja específico).\n5. Seção "Mesa" — itens que exigem decisão do dono antes de qualquer execução.\n6. Próximo passo (1 linha).\n${CONTEXT}\n\nDADOS (JSON):\n${JSON.stringify({ verified })}`,
  { label: 'relatório', phase: 'Relatório', schema: REPORT_SCHEMA }
)

return {
  docPath: report ? report.docPath : null,
  summary: report ? report.summary : null,
  confirmados: continua.length,
  cairam: cairam.length,
  divididos: divididos.length,
  gaps: report ? report.gaps : [],
  mesa_items: report ? report.mesa : [],
}
