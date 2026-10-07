/* Typed contract tree. Browser and Node share this single deterministic compiler. */
(function (host) {
  'use strict';
  /** @typedef {'string'|'number'|'integer'|'boolean'|'object'|'array'} FieldType */
  /** @typedef {{id:string,key:string,description:string,type:FieldType,required:boolean,children:Node[],items:Node|null}} Node */
  const TYPES = ['string', 'number', 'integer', 'boolean', 'object', 'array'];
  const LIMITS = Object.freeze({ depth: 4, nodes: 60, key: 120, description: 600 });
  let serial = 0;
  /** @returns {Node} */
  function node(key = '', type = 'string', required = false) {
    if (!TYPES.includes(type)) throw new Error('Tipo desconhecido.');
    return { id: `field-${++serial}`, key, description: '', type, required, children: [], items: type === 'array' ? node('', 'string') : null };
  }
  function initial() {
    const root = node('', 'object'); root.id = 'root';
    const title = node('titulo', 'string', true); title.description = 'Nome do encontro';
    const people = node('participantes', 'array', true); people.description = 'Pessoas convidadas';
    people.items = node('', 'object');
    const name = node('nome', 'string', true); name.description = 'Nome de cada participante';
    people.items.children = [name, node('email', 'string')];
    const send = node('enviar_convite', 'boolean'); send.description = 'Enviar o convite após a revisão';
    root.children = [title, people, send]; return root;
  }
  function clone(tree) { return JSON.parse(JSON.stringify(tree)); }
  function locate(tree, id, depth = 0, parent = null) {
    if (tree.id === id) return { node: tree, depth, parent };
    for (const child of tree.children) { const match = locate(child, id, depth + 1, tree); if (match) return match; }
    return tree.items ? locate(tree.items, id, depth + 1, tree) : null;
  }
  function count(tree) { return 1 + tree.children.reduce((sum, child) => sum + count(child), 0) + (tree.items ? count(tree.items) : 0); }
  function add(tree, scopeId) {
    const next = clone(tree); const scope = locate(next, scopeId);
    if (!scope || scope.node.type !== 'object') throw new Error('Este escopo não aceita campos.');
    if (scope.depth >= LIMITS.depth) throw new Error('Limite de quatro níveis atingido.');
    if (count(next) >= LIMITS.nodes) throw new Error('Limite de 60 nós atingido.');
    let index = 1; while (scope.node.children.some(child => child.key === `campo_${index}`)) index++;
    const added = node(`campo_${index}`); scope.node.children.push(added); return { tree: next, id: added.id };
  }
  function changeType(tree, id, type) {
    if (!TYPES.includes(type)) throw new Error('Tipo desconhecido.');
    const next = clone(tree); const found = locate(next, id);
    if (!found || id === 'root') throw new Error('Campo não encontrado.');
    if (type === 'array' && found.depth >= LIMITS.depth) throw new Error('Uma lista precisa de itens dentro do limite de quatro níveis.');
    const target = found.node;
    if (target.type === type) return next;
    target.type = type; target.children = []; target.items = type === 'array' ? node() : null;
    if (count(next) > LIMITS.nodes) throw new Error('Limite de 60 nós atingido.');
    return next;
  }
  function remove(tree, id) {
    const next = clone(tree); const found = locate(next, id);
    if (!found || !found.parent || found.parent.type !== 'object') throw new Error('Este campo não pode ser removido.');
    found.parent.children = found.parent.children.filter(child => child.id !== id); return next;
  }
  function compile(tree) {
    const errors = []; const ids = new Set(); let total = 0;
    const error = (id, message, control = 'key') => errors.push({ id, message, control });
    function visit(current, depth, isItem = false) {
      total++;
      if (depth > LIMITS.depth) { error(current.id, 'Limite de quatro níveis excedido.', 'type'); return {}; }
      if (total > LIMITS.nodes) { error(current.id, 'Limite de 60 nós excedido.', 'type'); return {}; }
      if (ids.has(current.id)) error(current.id, 'Identificador interno repetido.', 'type');
      ids.add(current.id);
      if (!TYPES.includes(current.type)) { error(current.id, 'Escolha um tipo válido.', 'type'); return {}; }
      if (!isItem && depth > 0 && (!current.key.trim() || current.key.length > LIMITS.key)) error(current.id, `Informe uma chave de 1 a ${LIMITS.key} caracteres.`);
      if (current.description.length > LIMITS.description) error(current.id, 'Descrição limitada a 600 caracteres.', 'description');
      const schema = { type: current.type }; if (current.description.trim()) schema.description = current.description;
      if (current.type === 'object') {
        const keys = new Set(); const required = []; schema.properties = Object.create(null);
        for (const child of current.children) {
          if (keys.has(child.key)) error(child.id, `A chave “${child.key}” já existe neste objeto.`);
          keys.add(child.key); schema.properties[child.key] = visit(child, depth + 1);
          if (child.required) required.push(child.key);
        }
        if (required.length) schema.required = required;
      } else if (current.type === 'array') {
        if (!current.items) error(current.id, 'Escolha o tipo dos itens.', 'type');
        else schema.items = visit(current.items, depth + 1, true);
      }
      return schema;
    }
    if (tree.type !== 'object') error(tree.id, 'A raiz precisa ser um objeto.', 'type');
    const schema = visit(tree, 0, true);
    if (total > LIMITS.nodes) error(tree.id, 'Limite de 60 nós excedido.', 'type');
    return { valid: errors.length === 0, errors, schema: errors.length ? null : { $schema: 'https://json-schema.org/draft/2020-12/schema', ...schema }, total };
  }
  const api = { TYPES, LIMITS, node, initial, clone, locate, count, add, changeType, remove, compile };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else host.ContractModel = api;
})(globalThis);
