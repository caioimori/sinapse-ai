#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const engine = require(path.join(__dirname, '..', 'packages', 'engineering-workflows'));

const HELP = `SINAPSE Engineering — execução guiada e contexto sob demanda

Uso: sinapse-engineering <comando> [opções]

  catalog                            Estatísticas e IDs disponíveis
  search <consulta> [--domain ID]     Busca limitada de workflows
  show <workflowId>                  Trecho original de um workflow
  plan --input plano.json            Plano proporcional, sem escrita
  start <runId> --input plano.json --root <projeto>
  status <runId> --root <projeto>     Retomada e evidências, sem mutação
  advance <runId> --input etapa.json --root <projeto>

--json emite JSON; --limit N limita search (1–20).
start recebe os mesmos sinais de plan e cria um novo plano.
O input inclui brief e completionCriterion explícito antes de iniciar.
advance exige expectedRevision, stageId, outcome (pass/fail/requires-human),
evidencePath relativo ao projeto e notes sanitizadas.
O runtime registra hashes e resultados declarados; não verifica semântica,
não executa diagramas, shell, LLM, publicação, envio, cobrança ou destruição.
`;

function parse(argv) {
  const options = {};
  const positional = [];
  for (let index = 0; index < argv.length; index++) {
    const value = argv[index];
    if (value === '--json') {
      if (options.json) throw new Error('Duplicate --json');
      options.json = true;
    } else if (value.startsWith('--')) {
      const name = value.slice(2);
      if (!['input', 'root', 'domain', 'limit'].includes(name) || options[name] !== undefined) throw new Error(`Unknown or duplicate option: ${value}`);
      const next = argv[++index];
      if (!next || next.startsWith('--')) throw new Error(`Missing value: ${value}`);
      options[name] = next;
    } else positional.push(value);
  }
  return { options, positional };
}

function inputFile(filename) {
  if (!filename) throw new Error('--input JSON file is required');
  const absolute = path.resolve(filename);
  if (fs.lstatSync(absolute).isSymbolicLink() || !fs.statSync(absolute).isFile() || fs.statSync(absolute).size > 2 * 1024 * 1024) throw new Error('Input must be a regular JSON file of at most 2 MB');
  return JSON.parse(fs.readFileSync(absolute, 'utf8'));
}

function main(argv = process.argv.slice(2)) {
  const { options, positional } = parse(argv);
  const [command = 'help', ...args] = positional;
  const supported = {
    help: ['json'], catalog: ['json'], search: ['json', 'domain', 'limit'], show: ['json'],
    plan: ['json', 'input'], start: ['json', 'input', 'root'], status: ['json', 'root'], advance: ['json', 'input', 'root'],
  };
  if (!supported[command]) throw new Error(`Unknown command: ${command}`);
  for (const option of Object.keys(options)) if (!supported[command].includes(option)) throw new Error(`Option --${option} is not supported by ${command}`);
  if (['catalog', 'help', 'plan'].includes(command) && args.length) throw new Error(`Unexpected argument for ${command}`);
  if (['show', 'start', 'status', 'advance'].includes(command) && args.length !== 1) throw new Error(`${command} requires exactly one ID`);
  let result;
  if (command === 'help') return { help: HELP };
  if (command === 'catalog') {
    const data = engine.loadCatalog();
    result = { schemaVersion: data.schemaVersion, source: data.source, stats: data.stats, recipes: Object.keys(engine.RECIPES), workflows: data.workflows.map(({ id, title, kind, domains }) => ({ id, title, kind, domains })) };
  } else if (command === 'search') {
    const limit = options.limit === undefined ? 5 : Number(options.limit);
    if (!Number.isInteger(limit) || limit < 1 || limit > 20 || !args.length) throw new Error('search requires a query and --limit from 1 to 20');
    result = engine.searchWorkflows(args.join(' '), { domain: options.domain, limit });
  } else if (command === 'show') result = engine.readWorkflow(args[0]);
  else if (command === 'plan') result = engine.createPlan(inputFile(options.input));
  else if (command === 'start') result = engine.startRun(options.root, args[0], engine.createPlan(inputFile(options.input)));
  else if (command === 'status') result = engine.statusRun(options.root, args[0]);
  else if (command === 'advance') result = engine.advanceRun(options.root, args[0], inputFile(options.input));
  return result;
}

if (require.main === module) {
  try {
    const result = main();
    const asJson = process.argv.includes('--json');
    if (result.help && !asJson) process.stdout.write(result.help);
    else if (result.markdown && !asJson) process.stdout.write(`${result.markdown}\n`);
    else process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } catch (error) {
    process.stderr.write(`${JSON.stringify({ error: error.message })}\n`);
    process.exitCode = 1;
  }
}

module.exports = { main, parse, HELP };
