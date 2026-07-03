#!/usr/bin/env node
'use strict';

/**
 * Bracket Report — leitor de medição da DEC-04 (read-only).
 *
 * Sumariza os brackets das sessões reais em .synapse/sessions/ para a apuração
 * pré-registrada em docs/epics/epic-ultra-optimization/decisions/DEC-04-brackets-medicao.md
 * (critério: >=95% das sessões reais em FRESH até 2026-07-30 → aposentar
 * DEPLETED/CRITICAL + SYNAPSE_LEGACY_MODE, cada corte com story própria).
 *
 * Duas fontes por sessão, ambas persistidas:
 *   - observed  = context.last_bracket (gravado pelo hook a cada prompt — QW-1,
 *                 .claude/hooks/synapse-engine.cjs:72-84)
 *   - derived   = calculateBracket(estimateContextPercent(prompt_count)) usando o
 *                 MESMO código de produção (context-tracker.js) e o registry de
 *                 modelos ativo em core-config.yaml — zero lógica duplicada.
 *
 * hook-metrics.json NÃO serve de série histórica (é snapshot do último prompt);
 * por isso a apuração lê as sessions. Fixtures sintéticas são excluídas.
 *
 * Uso: node scripts/bracket-report.js [--json]
 * Read-only: não escreve nada, exit 0 sempre (ferramenta de apuração, não gate).
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SESSIONS_DIR = path.join(ROOT, '.synapse', 'sessions');

// Fixtures/artefatos que não são sessões reais de uso (excluídos do critério).
const EXCLUDE = new Set(['_active-agent.json', 'e2e-test-session.json']);

function main() {
  const asJson = process.argv.includes('--json');

  if (!fs.existsSync(SESSIONS_DIR)) {
    console.log('Sem .synapse/sessions/ — nada a apurar (motor inativo nesta máquina).');
    return;
  }

  const {
    calculateBracket,
    estimateContextPercent,
    getModelConfig,
  } = require(path.join(ROOT, '.sinapse-ai', 'core', 'synapse', 'context', 'context-tracker.js'));

  const model = getModelConfig(ROOT);
  const rows = [];

  for (const file of fs.readdirSync(SESSIONS_DIR).sort()) {
    if (!file.endsWith('.json') || EXCLUDE.has(file)) continue;
    let session;
    try {
      session = JSON.parse(fs.readFileSync(path.join(SESSIONS_DIR, file), 'utf8'));
    } catch {
      continue; // arquivo corrompido não entra na amostra
    }
    const prompts = session.prompt_count || 0;
    const percent = estimateContextPercent(prompts, ROOT);
    rows.push({
      session: file.replace('.json', '').slice(0, 8),
      prompts,
      contextPercent: Math.round(percent * 10) / 10,
      derived: calculateBracket(percent),
      observed: (session.context && session.context.last_bracket) || null,
      lastActivity: (session.last_activity || '').slice(0, 10),
    });
  }

  const total = rows.length;
  const fresh = rows.filter((r) => r.derived === 'FRESH').length;
  const freshPct = total ? Math.round((fresh / total) * 1000) / 10 : 0;
  const summary = {
    apuracao: new Date().toISOString().slice(0, 10),
    modelConfig: { maxContext: model.maxContext, avgTokensPerPrompt: model.avgTokensPerPrompt },
    sessoesReais: total,
    emFresh: fresh,
    pctFresh: freshPct,
    criterio: 'DEC-04: >=95% em FRESH ate 2026-07-30 -> aposentar DEPLETED/CRITICAL + SYNAPSE_LEGACY_MODE',
    criterioAtendido: freshPct >= 95,
    sessions: rows,
  };

  if (asJson) {
    console.log(JSON.stringify(summary, null, 2));
    return;
  }

  console.log(`Bracket Report — ${summary.apuracao} (modelo ativo: janela ${model.maxContext}, avg ${model.avgTokensPerPrompt} tok/prompt)`);
  console.log(`Sessões reais: ${total} | FRESH: ${fresh} (${freshPct}%) | critério >=95%: ${summary.criterioAtendido ? 'ATENDIDO' : 'não atendido'}`);
  console.log('');
  console.log('session  | prompts | ctx%  | derived  | observed | last_activity');
  for (const r of rows) {
    console.log(
      `${r.session} | ${String(r.prompts).padStart(7)} | ${String(r.contextPercent).padStart(5)} | ${String(r.derived).padEnd(8)} | ${String(r.observed || '-').padEnd(8)} | ${r.lastActivity}`,
    );
  }
}

main();
process.exitCode = 0; // apuração nunca falha o build
