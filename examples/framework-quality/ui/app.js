/* global document:readonly, location:readonly */
'use strict';
const projects = [
  { id: '01', title: 'Caderno de ideias', category: 'Editorial', description: 'Uma coleção de referências para transformar ideias soltas em uma direção clara.', status: 'Planejar' },
  { id: '02', title: 'Uma janela para o novo', category: 'Série de conteúdo', description: 'Três histórias sobre pequenos começos. Texto, composição e sequência prontos para ganhar forma.', status: 'Produzir' },
  { id: '03', title: 'Conversas que ficam: um encontro de processos e possibilidades', category: 'Oficina criativa', description: 'O último olhar sobre uma oficina de troca entre criadores: conferir a mensagem e os detalhes.', status: 'Revisar' },
];
const byId = (id) => document.getElementById(id);
const dialog = byId('details');
let activeProject = null;
let returnFocus = null;
let previousChange = null;
let hasError = new URLSearchParams(location.search).get('scenario') === 'error';
function announce(text) { byId('announcement').textContent = text; }
function render() {
  const query = byId('search').value.trim().toLocaleLowerCase('pt-BR');
  const visible = projects.filter((project) => `${project.title} ${project.category}`.toLocaleLowerCase('pt-BR').includes(query));
  byId('projects').replaceChildren();
  byId('error').hidden = !hasError;
  byId('empty').hidden = hasError || visible.length > 0;
  byId('count').textContent = hasError ? 'Atualização indisponível' : `${visible.length} ${visible.length === 1 ? 'projeto encontrado' : 'projetos no seu espaço'}`;
  if (hasError) return;
  for (const project of visible) {
    const row = document.createElement('article');
    row.className = 'project';
    const number = document.createElement('span'); number.className = 'project-number'; number.textContent = project.id;
    const body = document.createElement('div');
    const heading = document.createElement('h2'); heading.textContent = project.title;
    const category = document.createElement('p'); category.textContent = project.category;
    body.append(heading, category);
    const status = document.createElement('span'); status.className = 'status'; status.dataset.status = project.status; status.textContent = project.status;
    const open = document.createElement('button'); open.className = 'button'; open.type = 'button'; open.textContent = 'Ver detalhes'; open.dataset.project = project.id; open.setAttribute('aria-label', `Ver detalhes de ${project.title}`);
    open.addEventListener('click', () => {
      activeProject = project; returnFocus = project.id;
      byId('detail-title').textContent = project.title;
      byId('detail-category').textContent = project.category;
      byId('detail-description').textContent = project.description;
      byId('detail-status').value = project.status;
      dialog.showModal(); byId('detail-status').focus();
    });
    row.append(number, body, status, open); byId('projects').append(row);
  }
}
dialog.addEventListener('close', () => document.querySelector(`[data-project="${returnFocus}"]`)?.focus());
dialog.addEventListener('keydown', (event) => {
  if (event.key !== 'Tab') return;
  const controls = [...dialog.querySelectorAll('button:not(:disabled), select:not(:disabled), input:not(:disabled), a[href]')];
  const first = controls[0]; const last = controls.at(-1);
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
});
byId('cancel').addEventListener('click', () => dialog.close());
byId('details-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const newStatus = byId('detail-status').value;
  if (newStatus !== activeProject.status) {
    previousChange = { id: activeProject.id, status: activeProject.status };
    activeProject.status = newStatus;
    byId('toast-text').textContent = `Etapa alterada para ${newStatus}.`;
    byId('toast').hidden = false; announce(`Projeto ${activeProject.title}: etapa alterada para ${newStatus}. Você pode desfazer.`);
  }
  render(); dialog.close();
});
byId('undo').addEventListener('click', () => {
  if (!previousChange) return;
  const project = projects.find((item) => item.id === previousChange.id);
  project.status = previousChange.status; previousChange = null; byId('toast').hidden = true;
  render(); document.querySelector(`[data-project="${project.id}"]`)?.focus(); announce(`Alteração desfeita. ${project.title} voltou à etapa ${project.status}.`);
});
byId('search').addEventListener('input', () => { render(); announce(byId('count').textContent); });
byId('clear').addEventListener('click', () => { byId('search').value = ''; render(); byId('search').focus(); });
byId('refresh').addEventListener('click', () => { render(); announce(hasError ? 'A atualização falhou. Tente novamente.' : 'Lista atualizada.'); });
byId('retry').addEventListener('click', () => { hasError = false; render(); byId('search').focus(); announce('Lista carregada. 3 projetos disponíveis.'); });
render();
