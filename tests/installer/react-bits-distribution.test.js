'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const {
  REACT_BITS_CORPUS_RELATIVE_PATH,
  REQUIRED_REACT_BITS_CORPUS_FILES,
  copyReactBitsCorpusSync,
  hasCompleteReactBitsCorpus,
} = require('../../packages/installer/src/installer/react-bits-corpus');

describe('React Bits corpus distribution', () => {
  let root;

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'sinapse-react-bits-'));
  });

  afterEach(() => fs.rmSync(root, { recursive: true, force: true }));

  test('copies the managed corpus recursively without deleting destination-only files', () => {
    const source = path.join(root, 'package');
    const destination = path.join(root, 'global-home');
    const corpus = path.join(source, REACT_BITS_CORPUS_RELATIVE_PATH);
    fs.mkdirSync(path.join(corpus, 'nested'), { recursive: true });
    fs.writeFileSync(path.join(corpus, 'index.md'), '# React Bits\n');
    fs.writeFileSync(path.join(corpus, 'nested', 'catalog.json'), '{}\n');
    const custom = path.join(destination, REACT_BITS_CORPUS_RELATIVE_PATH, 'custom-notes.md');
    fs.mkdirSync(path.dirname(custom), { recursive: true });
    fs.writeFileSync(custom, 'user-owned\n');

    const copied = copyReactBitsCorpusSync(source, destination);

    expect(copied).toEqual(expect.arrayContaining([
      path.join(REACT_BITS_CORPUS_RELATIVE_PATH, 'index.md'),
      path.join(REACT_BITS_CORPUS_RELATIVE_PATH, 'nested', 'catalog.json'),
    ]));
    expect(fs.readFileSync(custom, 'utf8')).toBe('user-owned\n');
    expect(fs.readFileSync(path.join(destination, REACT_BITS_CORPUS_RELATIVE_PATH, 'index.md'), 'utf8'))
      .toBe('# React Bits\n');
  });

  test('requires all nine canonical corpus files before discovery can use a location', () => {
    const corpus = path.join(root, REACT_BITS_CORPUS_RELATIVE_PATH);
    fs.mkdirSync(corpus, { recursive: true });
    expect(hasCompleteReactBitsCorpus(root)).toBe(false);

    for (const file of REQUIRED_REACT_BITS_CORPUS_FILES) {
      fs.writeFileSync(path.join(corpus, file), '{}\n');
    }

    expect(REQUIRED_REACT_BITS_CORPUS_FILES).toHaveLength(9);
    expect(hasCompleteReactBitsCorpus(root)).toBe(true);
  });
});
