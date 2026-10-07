'use strict';

// Bound every recursive walker, including callers that supply their own AST.
const MAX_DEPTH = 128;
const MAX_NODES = 131072;

const assertDepth = ast => {
  const active = new Set();
  const pending = [{ node: ast, depth: 0, exit: false }];
  let count = 0;
  let scheduled = 1;
  while (pending.length) {
    const frame = pending.pop();
    const node = frame.node;
    if (!node || typeof node !== 'object') continue;
    if (frame.exit) {
      active.delete(node);
      continue;
    }
    if (frame.depth > MAX_DEPTH || ++count > MAX_NODES || active.has(node)) {
      throw new RangeError('Brace AST exceeds bounded depth, size, or contains a cycle');
    }
    active.add(node);
    pending.push({ node, depth: frame.depth, exit: true });
    if (Array.isArray(node.nodes)) {
      if (node.nodes.length > MAX_NODES - scheduled) {
        throw new RangeError('Brace AST exceeds bounded node budget');
      }
      scheduled += node.nodes.length;
      for (let index = node.nodes.length - 1; index >= 0; index--) {
        pending.push({ node: node.nodes[index], depth: frame.depth + 1, exit: false });
      }
    }
  }
};

module.exports = { MAX_DEPTH, assertDepth };
