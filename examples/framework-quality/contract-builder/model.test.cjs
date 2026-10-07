'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const M = require('./model.js');
test('scope, required and descriptions compile from a single typed tree', () => {
  const tree = M.initial(); const schema = M.compile(tree).schema;
  assert.deepEqual(schema.required, ['titulo', 'participantes']);
  assert.deepEqual(schema.properties.participantes.items.required, ['nome']);
  assert.equal(schema.properties.nome, undefined);
  assert.equal(schema.properties.participantes.minItems, undefined);
  tree.children[0].description = 'title';
  assert.equal(M.compile(tree).schema.properties.titulo.description, 'title');
  assert.equal(M.compile(tree).schema.properties.title, undefined);
  assert.deepEqual(JSON.parse(JSON.stringify(schema)), JSON.parse(JSON.stringify(M.compile(M.initial()).schema)));
});
test('duplicates preserve the draft, recover, and permit the same key in other scopes', () => {
  const tree = M.initial(); tree.children[2].key = 'titulo';
  assert.equal(M.compile(tree).valid, false); assert.equal(tree.children.length, 3);
  tree.children[2].key = 'nome'; assert.equal(M.compile(tree).valid, true);
  tree.children[2].key = ' '; assert.equal(M.compile(tree).valid, false);
  tree.children[2].key = ' chave com espaço '; assert.equal(M.compile(tree).schema.properties[' chave com espaço '].type, 'boolean');
});
test('prototype keys remain own properties and never pollute objects', () => {
  const tree = M.initial(); tree.children[0].key = '__proto__'; tree.children[2].key = 'constructor';
  const schema = M.compile(tree).schema; const parsed = JSON.parse(JSON.stringify(schema));
  assert(Object.hasOwn(parsed.properties, '__proto__')); assert.equal(parsed.properties.__proto__.type, 'string');
  assert(Object.hasOwn(parsed.properties, 'constructor')); assert.equal({}.polluted, undefined);
});
test('depth and size boundaries refuse unsafe additions and item depth', () => {
  let tree = M.initial(); let scopeId = 'root'; let lastId;
  for (let i = 1; i <= 4; i++) { const added = M.add(tree, scopeId); tree = M.changeType(added.tree, added.id, 'object'); scopeId = added.id; lastId = added.id; }
  assert.equal(M.compile(tree).valid, true);
  assert.throws(() => M.add(tree, scopeId), /quatro níveis/);
  assert.throws(() => M.changeType(tree, lastId, 'array'), /quatro níveis/);
  M.locate(tree, lastId).node.children.push(M.node('profundo', 'object'));
  assert.equal(M.compile(tree).valid, false);
  let large = M.node('', 'object'); large.id = 'root';
  while (M.count(large) < 60) large = M.add(large, 'root').tree;
  assert.equal(M.compile(large).valid, true); assert.throws(() => M.add(large, 'root'), /60 nós/);
  large.children.push(M.node('mais')); assert.equal(M.compile(large).valid, false);
});
test('all primitives, array of array, empty required, and reversible subtree snapshots', () => {
  const tree = M.initial(); const original = JSON.stringify(tree); const snapshot = M.clone(tree);
  const peopleId = tree.children[1].id; const removed = M.remove(tree, peopleId);
  assert.equal(removed.children.length, 2); assert.equal(JSON.stringify(snapshot), original); assert.equal(JSON.stringify(tree), original);
  const changed = M.changeType(tree, peopleId, 'integer'); assert.equal(M.compile(changed).schema.properties.participantes.type, 'integer');
  let list = M.changeType(tree, tree.children[0].id, 'array'); list = M.changeType(list, list.children[0].items.id, 'array');
  assert.equal(M.compile(list).schema.properties.titulo.items.items.type, 'string');
  const empty = M.node('', 'object'); empty.id = 'root'; assert.equal(M.compile(empty).schema.required, undefined);
  assert.deepEqual(M.compile(empty).schema.properties, Object.create(null));
  for (const type of M.TYPES.filter(type => !['array', 'object'].includes(type))) { assert.equal(M.compile(M.changeType(tree, tree.children[0].id, type)).schema.properties.titulo.type, type); }
});
