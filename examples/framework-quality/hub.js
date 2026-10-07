/* global document:readonly */
'use strict';

(() => {
  const byId = (id) => document.getElementById(id);
  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const normalize = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
  const safeExamples = new Set(['ui/index.html', 'motion/index.html', 'media/index.html#reel-title', 'media/index.html#carousel-title', '#pendencias']);
  let data;
  let loading = false;
  let selected = 'frontend';

  function validate(input) {
    if (input?.schemaVersion !== 1 || input.metrics?.squads !== 17 || input.metrics?.agents !== 172 || input.metrics?.validatedExperts !== 0) throw new Error('Unsupported snapshot');
    if (!['reviewedFunctions', 'reviewedCommands', 'individualProfiles', 'specificMechanisms', 'mentalModels', 'qualityCriteria', 'diagnosticCases', 'externalSectionReads'].every(metric => Number.isInteger(input.metrics[metric]) && input.metrics[metric] >= 0)) throw new Error('Invalid metrics');
    if (!['operationalProfiles', 'commandRecords', 'newOwnedTasks', 'curatedMechanisms', 'providerSkills', 'readReferences', 'candidateReferences'].every((metric) => Number.isInteger(input.metrics[metric]) && input.metrics[metric] >= 0)) throw new Error('Invalid closeout metrics');
    if (!Array.isArray(input.squads) || input.squads.length !== 17 || !Array.isArray(input.pending) || input.pending.length !== 8 || !Array.isArray(input.evidence)) throw new Error('Incomplete snapshot');
    if (!Array.isArray(input.deliverables) || input.deliverables.length !== 5 || !input.deliverables.every((item) => safeExamples.has(item.exampleUrl))) throw new Error('Invalid local navigation');
    if (!input.squads.every((squad) => typeof squad.id === 'string' && typeof squad.name === 'string' && Array.isArray(squad.agents) && squad.agents.every((agent) => typeof agent === 'string'))) throw new Error('Invalid squad catalog');
    return input;
  }

  function renderDeliverable() {
    const item = data.deliverables.find((entry) => entry.id === selected) || data.deliverables[0];
    selected = item.id;
    for (const button of byId('deliverable-buttons').querySelectorAll('button')) button.setAttribute('aria-pressed', String(button.dataset.deliverable === selected));
    const copy = element('div');
    copy.append(element('h3', '', item.title), element('p', '', item.description));
    const action = element('a', 'action', `${item.exampleLabel} ↗`);
    action.href = item.exampleUrl;
    copy.append(action, element('p', 'scope-note', item.gap));
    const right = element('div');
    const flow = element('ol', 'flow-list');
    item.steps.forEach((step, index) => {
      const row = element('li');
      const text = element('div', 'step-copy', step[0]);
      text.append(element('span', '', step[1]));
      row.append(element('span', 'item-number', String(index + 1).padStart(2, '0')), text);
      flow.append(row);
    });
    const details = element('details', 'route-proof');
    details.append(element('summary', '', 'Ver a função e a tarefa vinculadas'), element('code', '', `${item.agentId} → ${item.command}`));
    right.append(flow, details);
    byId('deliverable-detail').replaceChildren(copy, right);
  }

  function renderSquads() {
    const query = normalize(byId('squad-search').value.trim());
    const matches = data.squads.filter((squad) => normalize([squad.name, squad.description, squad.id, ...(squad.keywords || []), ...squad.agents].join(' ')).includes(query));
    const list = byId('squad-list');
    list.replaceChildren();
    matches.forEach((squad) => {
      const details = element('details', 'squad');
      const summary = element('summary');
      const label = element('div');
      label.append(element('h3', '', squad.name), element('span', 'squad-description', squad.description));
      summary.append(element('span', 'item-number', String(data.squads.indexOf(squad) + 1).padStart(2, '0')), label);
      const content = element('div', 'squad-content');
      content.append(element('p', '', `${squad.agents.length} agentes · ${squad.taskCount} tarefas · ${squad.knowledgeCount} documentos de conhecimento.`));
      const agents = element('ul', 'squad-agent-list');
      for (const agent of squad.agents) agents.append(element('li', '', agent));
      content.append(agents, element('p', 'scope-note', 'Acervo preservado. Especialização e transferência ainda precisam de comprovação por tarefa.'));
      details.append(summary, content);
      list.append(details);
    });
    byId('search-count').textContent = `${matches.length} de 17 squads`;
    byId('squad-empty').hidden = matches.length > 0;
  }

  function renderPending() {
    byId('pending-list').replaceChildren();
    data.pending.forEach((item, index) => {
      const row = element('article', 'pending-row');
      const state = element('p', 'pending-state');
      state.append(element('span', '', item.status), element('span', '', item.detail));
      row.append(element('span', 'item-number', String(index + 1).padStart(2, '0')), element('h3', '', item.title), element('p', '', item.description), state);
      byId('pending-list').append(row);
    });
  }

  function renderEvidence() {
    byId('evidence-list').replaceChildren();
    for (const item of data.evidence) {
      const details = element('details', 'evidence-item');
      const summary = element('summary');
      const label = element('div');
      label.append(element('h3', '', item.title), element('span', '', item.summary));
      summary.append(label);
      const copy = element('div', 'evidence-copy');
      for (const paragraph of item.paragraphs) copy.append(element('p', '', paragraph));
      copy.append(element('p', 'evidence-path', `Registro: ${item.sources.join(' · ')}`));
      details.append(summary, copy);
      byId('evidence-list').append(details);
    }
    byId('evidence-provenance').textContent = `Snapshot ${data.snapshot.date} · ${data.snapshot.scope} · ${data.snapshot.typography}`;
  }

  function render() {
    byId('reviewed-functions').textContent = data.metrics.reviewedFunctions;
    byId('reviewed-commands').textContent = data.metrics.reviewedCommands;
    byId('operational-summary').textContent = `Nesta onda: ${data.metrics.individualProfiles} perfis individuais, ${data.metrics.specificMechanisms} mecanismos, ${data.metrics.mentalModels} modelos de decisão e ${data.metrics.qualityCriteria} critérios. Contagens descrevem o conhecimento escrito; não são notas de qualidade.`;
    byId('expertise-summary').textContent = `${data.metrics.externalSectionReads} recortes externos observados e ${data.metrics.diagnosticCases} casos diagnósticos da mesma coorte. Leitura delimitada e revisão escrita não comprovam transferência, pesquisa profunda integral ou expertise global.`;
    byId('local-status').textContent = data.deployment.local;
    byId('install-status').textContent = data.deployment.installed;
    byId('publish-status').textContent = data.deployment.published;
    byId('deliverable-buttons').replaceChildren();
    data.deliverables.forEach((item) => {
      const button = element('button', '', item.label);
      button.type = 'button';
      button.dataset.deliverable = item.id;
      button.setAttribute('aria-controls', 'deliverable-detail');
      button.addEventListener('click', () => { selected = item.id; renderDeliverable(); });
      byId('deliverable-buttons').append(button);
    });
    renderDeliverable(); renderPending(); renderSquads(); renderEvidence();
  }

  async function load() {
    if (loading) return;
    loading = true;
    byId('retry-load').disabled = true;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    try {
      const response = await fetch('hub-data.json', { signal: controller.signal, cache: 'no-store' });
      if (!response.ok) throw new Error('Snapshot unavailable');
      data = validate(await response.json());
      render();
      byId('load-error').hidden = true;
    } catch {
      byId('load-error').hidden = false;
    } finally {
      clearTimeout(timer);
      loading = false;
      byId('retry-load').disabled = false;
    }
  }
  function clearSearch() { byId('squad-search').value = ''; if (data) renderSquads(); byId('squad-search').focus(); }
  byId('squad-search').addEventListener('input', () => { if (data) renderSquads(); });
  byId('clear-search').addEventListener('click', clearSearch);
  byId('empty-clear').addEventListener('click', clearSearch);
  byId('retry-load').addEventListener('click', load);
  load();
})();
