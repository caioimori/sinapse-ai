/* global ContractModel */
'use strict';
(() => {
  const M = ContractModel;
  let tree = M.initial(); let undo = null; let lastValid = M.compile(tree).schema;
  const $ = id => document.getElementById(id);
  const names = { string: 'Texto', number: 'Número', integer: 'Inteiro', boolean: 'Sim / não', object: 'Objeto', array: 'Lista' };
  function el(tag, className, text) { const result = document.createElement(tag); if (className) result.className = className; if (text !== undefined) result.textContent = text; return result; }
  function announce(message) { $('announcement').textContent = message; }
  function focus(id, control = 'key') {
    const target = document.getElementById(`${control}-${id}`) || document.getElementById(`add-${id}`) || document.getElementById(`type-${id}`) || $('add-root');
    target?.focus();
  }
  function structural(action, nextFocus, message, restoreFocus, restoreControl = 'key') {
    try {
      const previous = M.clone(tree); const next = action();
      undo = { tree: previous, focus: restoreFocus || nextFocus, control: restoreControl }; tree = next;
      render(); focus(nextFocus); announce(message);
    } catch (error) { announce(error.message); }
  }
  function button(text, handler, className = 'button') { const result = el('button', className, text); result.type = 'button'; result.addEventListener('click', handler); return result; }
  function control(current, kind, labelText, depth) {
    const wrap = el('label', `control ${kind}`); const title = el('span', '', labelText);
    title.id = `${kind}-label-${current.id}`;
    let input;
    if (kind === 'type') {
      input = el('select');
      for (const type of M.TYPES) {
        const option = el('option', '', names[type]); option.value = type;
        if (type === 'array' && depth >= M.LIMITS.depth) { option.disabled = true; option.textContent += ' · limite de profundidade'; }
        input.append(option);
      }
      input.value = current.type;
      input.addEventListener('change', () => {
        const value = input.value;
        structural(() => M.changeType(tree, current.id, value), current.id, `Tipo alterado para ${names[value]}. Desfazer restaura a estrutura anterior.`, current.id, 'type');
        focus(current.id, 'type');
      });
    } else {
      input = el('input'); input.type = 'text'; input.value = current[kind]; input.autocomplete = 'off';
      input.maxLength = kind === 'key' ? M.LIMITS.key : M.LIMITS.description;
      input.addEventListener('input', () => { M.locate(tree, current.id).node[kind] = input.value; refresh(); });
    }
    input.id = `${kind}-${current.id}`; input.dataset.control = kind;
    input.setAttribute('aria-labelledby', title.id);
    wrap.htmlFor = input.id; wrap.append(title, input);
    return wrap;
  }
  function scope(current, depth, path) {
    const area = el('div', 'scope'); area.dataset.scope = current.id;
    const label = el('div', 'scope-label'); label.append(el('strong', '', depth === 0 ? 'Objeto raiz' : 'Campos do objeto'), el('span', '', path)); area.append(label);
    if (!current.children.length) area.append(el('p', 'empty', 'Este objeto ainda não tem campos. Adicione o primeiro para continuar.'));
    current.children.forEach((child, index) => area.append(field(child, depth + 1, path, index)));
    const row = el('div', 'add-row');
    const add = button('+ Adicionar campo', () => {
      try {
        const result = M.add(tree, current.id);
        structural(() => result.tree, result.id, 'Campo adicionado. Informe a chave e escolha o tipo.', current.id);
      } catch (error) { announce(error.message); }
    });
    add.id = `add-${current.id}`; add.setAttribute('aria-label', `Adicionar campo em ${path}`);
    const reason = depth >= M.LIMITS.depth ? 'Limite de quatro níveis atingido.' : M.count(tree) >= M.LIMITS.nodes ? 'Limite de 60 nós atingido.' : '';
    if (reason) { add.disabled = true; const note = el('span', 'limit-reason', reason); note.id = `limit-${current.id}`; add.setAttribute('aria-describedby', note.id); row.append(note); }
    row.prepend(add); area.append(row); return area;
  }
  function nested(current, depth, path) {
    if (current.type === 'object') { const box = el('div', 'nested'); box.append(scope(current, depth, path)); return box; }
    if (current.type !== 'array') return null;
    const box = el('div', 'nested'); box.setAttribute('aria-label', `Itens de ${path}`);
    const head = el('div', 'items-header'); head.append(el('span', 'items-title', 'Tipo dos itens'), control(current.items, 'type', 'Itens', depth + 1)); box.append(head);
    box.append(control(current.items, 'description', 'Descrição dos itens', depth + 1));
    const body = nested(current.items, depth + 1, `${path} / itens`); if (body) box.append(body);
    return box;
  }
  function field(current, depth, path, index) {
    const card = el('div', 'field-card'); card.dataset.field = current.id; card.setAttribute('role', 'group'); card.setAttribute('aria-label', `Campo ${path} / ${current.key}`);
    const top = el('div', 'field-top'); top.append(el('span', 'field-index', `CAMPO ${String(index + 1).padStart(2, '0')}`));
    const remove = button('Remover', () => {
      const found = M.locate(tree, current.id); const siblings = found.parent.children; const at = siblings.findIndex(child => child.id === current.id);
      const destination = siblings[at + 1]?.id || siblings[at - 1]?.id || found.parent.id;
      structural(() => M.remove(tree, current.id), destination, `Campo ${current.key || 'sem chave'} removido. Você pode desfazer.`, current.id);
    }, 'remove'); remove.id = `remove-${current.id}`; remove.setAttribute('aria-label', `Remover campo ${current.key || 'sem chave'} em ${path}`); top.append(remove); card.append(top);
    const grid = el('div', 'field-controls'); grid.append(control(current, 'key', 'Chave', depth), control(current, 'type', 'Tipo', depth), control(current, 'description', 'Descrição', depth)); card.append(grid);
    const required = el('label', 'required'); const checkbox = el('input'); checkbox.type = 'checkbox'; checkbox.checked = current.required; checkbox.id = `required-${current.id}`;
    checkbox.addEventListener('change', () => { M.locate(tree, current.id).node.required = checkbox.checked; refresh(); });
    required.append(checkbox, el('span', '', 'Obrigatório neste objeto')); card.append(required);
    const children = nested(current, depth, `${path} / ${current.key || 'sem chave'}`); if (children) card.append(children);
    return card;
  }
  function refresh() {
    function updatePaths(current, path) {
      if (current.type === 'object') {
        const area = document.querySelector(`[data-scope="${current.id}"]`);
        const caption = area?.querySelector(':scope > .scope-label > span'); if (caption) caption.textContent = path;
        current.children.forEach(child => {
          const card = document.querySelector(`[data-field="${child.id}"]`);
          card?.setAttribute('aria-label', `Campo ${path} / ${child.key || 'sem chave'}`);
          document.getElementById(`remove-${child.id}`)?.setAttribute('aria-label', `Remover campo ${child.key || 'sem chave'} em ${path}`);
          updatePaths(child, `${path} / ${child.key || 'sem chave'}`);
        });
        document.getElementById(`add-${current.id}`)?.setAttribute('aria-label', `Adicionar campo em ${path}`);
      } else if (current.type === 'array') updatePaths(current.items, `${path} / itens`);
    }
    updatePaths(tree, 'raiz');
    const result = M.compile(tree);
    if (result.valid) lastValid = result.schema;
    $('json').textContent = JSON.stringify(lastValid, null, 2);
    $('node-count').textContent = `${result.total} de 60 nós`;
    $('valid-state').textContent = result.valid ? 'Atualizado' : 'Revisão necessária';
    $('preview-warning').hidden = result.valid; $('copy').disabled = !result.valid;
    $('copy').setAttribute('aria-describedby', 'copy-help');
    $('copy-help').textContent = result.valid ? 'O JSON acompanha as alterações nos campos.' : 'Corrija os campos indicados para copiar.';
    $('error-summary').hidden = result.valid; $('error-links').replaceChildren();
    document.querySelectorAll('.inline-error').forEach(node => node.remove());
    document.querySelectorAll('[aria-invalid]').forEach(node => { node.removeAttribute('aria-invalid'); node.removeAttribute('aria-describedby'); });
    for (const error of result.errors) {
      const input = document.getElementById(`${error.control}-${error.id}`); const item = el('li');
      if (input) {
        input.setAttribute('aria-invalid', 'true'); const note = el('p', 'inline-error', error.message); note.id = `error-${error.id}-${error.control}`;
        input.setAttribute('aria-describedby', note.id); input.parentElement.append(note);
        const link = el('a', '', error.message); link.href = `#${input.id}`; link.addEventListener('click', event => { event.preventDefault(); input.focus(); }); item.append(link);
      } else item.textContent = error.message;
      $('error-links').append(item);
    }
    $('clear').disabled = tree.children.length === 0; $('undo').disabled = !undo;
  }
  function render() { $('fields').replaceChildren(scope(tree, 0, 'raiz')); refresh(); }
  $('clear').addEventListener('click', () => structural(() => { const next = M.clone(tree); next.children = []; return next; }, 'root', 'Contrato limpo. Desfazer restaura todos os campos.', tree.children[0]?.id || 'root'));
  $('undo').addEventListener('click', () => { if (!undo) return; const previous = undo; tree = previous.tree; undo = null; render(); focus(previous.focus, previous.control); announce('Última alteração de estrutura desfeita.'); });
  $('copy').addEventListener('click', async () => {
    if (!M.compile(tree).valid) return;
    try { await navigator.clipboard.writeText(JSON.stringify(lastValid, null, 2)); announce('JSON copiado.'); }
    catch { const selection = window.getSelection(); const range = document.createRange(); range.selectNodeContents($('json')); selection.removeAllRanges(); selection.addRange(range); $('json').focus(); announce('Não foi possível copiar. O JSON está selecionado; use Ctrl+C ou a opção Copiar do navegador.'); }
  });
  render();
})();
