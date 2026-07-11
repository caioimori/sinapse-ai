export const meta = {
  name: 're-baseline',
  description: 'Re-baseline de claims: verifica item a item os claims de documentos-lastro (auditorias/épicos anteriores) contra a main atual — resolved/changed/open/unverifiable com evidência',
  phases: [
    { title: 'Claims', detail: 'um verificador por documento-lastro' },
    { title: 'Consolidação', detail: 'placar agregado e, opcionalmente, relatório em audits/' },
  ],
}

// Contrato de args:
//   docs  (obrigatório)  — array de paths relativos dos documentos-lastro (ex.: ['audits/AF-20260702-fable5-upgrade.md'])
//   date  (opcional, 'YYYYMMDD') — obrigatório apenas se write=true
//   write (opcional, default false) — se true, escreve audits/AF-<date>-rebaseline.md
//   context (opcional) — fatos já estabelecidos / decisões do dono que os verificadores não devem re-litigar

if (!args || !Array.isArray(args.docs) || args.docs.length === 0) {
  throw new Error("re-baseline exige args.docs (array de paths de documentos-lastro). Ex.: {docs: ['audits/AF-20260702-fable5-upgrade.md']}")
}
if (args.write && !/^\d{8}$/.test(String(args.date || ''))) {
  throw new Error("re-baseline com write=true exige args.date no formato YYYYMMDD (workflows não têm acesso a Date.now()).")
}

const CONTEXT = `Repo: o diretório de trabalho atual (paths RELATIVOS em toda evidência).
${args.context || ''}
Regras: um claim só muda de status com evidência file:line ou comando+saída da main ATUAL. O framework usa consumo dinâmico (dispatch por string, registries YAML, referências em markdown) — grep por import direto não basta. Read-only: não mude nada.`

const CLAIMS_SCHEMA = {
  type: 'object',
  required: ['doc', 'claims'],
  properties: {
    doc: { type: 'string' },
    claims: {
      type: 'array',
      items: {
        type: 'object',
        required: ['claim', 'status', 'note', 'evidence'],
        properties: {
          claim: { type: 'string', description: 'O claim original, resumido fiel (1-2 frases)' },
          status: { enum: ['resolved', 'changed', 'open', 'unverifiable'] },
          note: { type: 'string', description: 'O que a main atual mostra' },
          evidence: { type: 'string', description: 'file:line (ou comando+saída) na main atual; vazio só se unverifiable' },
          severity: { type: 'string', description: 'Severidade original do claim se o doc declarar (critical/high/medium/low), senão vazio' },
        },
      },
    },
  },
}

const SYNTH_SCHEMA = {
  type: 'object',
  required: ['docPath', 'summary'],
  properties: { docPath: { type: 'string' }, summary: { type: 'string' } },
}

log(`Re-baseline: ${args.docs.length} documento(s)-lastro contra a main atual`)

const perDocRaw = await pipeline(
  args.docs,
  (docPath) => agent(
    `Você é um verificador de baseline. Documento-lastro: ${docPath}.\n${CONTEXT}\nTarefas:\n1. Leia o documento e extraia TODOS os claims verificáveis (achados, pendências, números, afirmações de estado — ignore prosa opinativa sem fato).\n2. Verifique CADA claim contra a main atual: resolved (foi resolvido/não existe mais), changed (o fato mudou de forma — descreva), open (segue exatamente como descrito), unverifiable (não dá pra verificar sem executar algo com efeito colateral — diga o porquê).\n3. Preserve a severidade original quando o doc declarar.\nRetorne via StructuredOutput.`,
    { label: `claims:${String(docPath).split('/').pop()}`, phase: 'Claims', schema: CLAIMS_SCHEMA }
  )
)

const perDoc = perDocRaw.filter(Boolean)
const allClaims = perDoc.flatMap((d) => (d.claims || []).map((c) => ({ ...c, doc: d.doc })))
const count = (s) => allClaims.filter((c) => c.status === s).length
const placar = { total: allClaims.length, resolved: count('resolved'), changed: count('changed'), open: count('open'), unverifiable: count('unverifiable') }
const open_items = allClaims.filter((c) => c.status === 'open' || c.status === 'changed')

log(`Placar: ${placar.total} claims — ${placar.resolved} resolved, ${placar.changed} changed, ${placar.open} open, ${placar.unverifiable} unverifiable`)

if (!args.write) {
  return { ...placar, open_items, perDoc }
}

phase('Consolidação')
const DOC_PATH = `audits/AF-${args.date}-rebaseline.md`
const synth = await agent(
  `Escreva o arquivo ${DOC_PATH} consolidando um re-baseline de claims (formato AF da casa, PT-BR sóbrio):\n1. Frontmatter YAML: id: AF-${args.date}-rebaseline, type: re-baseline, date ISO, docs verificados, placar (total/resolved/changed/open/unverifiable).\n2. Uma tabela POR documento-lastro: claim | status | nota | evidência.\n3. Seção "Itens vivos" (open+changed) ordenada por severidade — é o backlog real que sobrou.\n4. Limitações (unverifiable e por quê).\n${CONTEXT}\n\nDADOS (JSON):\n${JSON.stringify({ placar, perDoc })}`,
  { label: 'consolidação', phase: 'Consolidação', schema: SYNTH_SCHEMA }
)

return { ...placar, open_items, perDoc, docPath: synth ? synth.docPath : null }
