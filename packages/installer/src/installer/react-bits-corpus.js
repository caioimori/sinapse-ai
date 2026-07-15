'use strict';

const fs = require('fs');
const path = require('path');

const REACT_BITS_CORPUS_RELATIVE_PATH = path.join('docs', 'framework', 'react-bits');
const REACT_BITS_SKILL_RELATIVE_PATH = path.join('.agents', 'skills', 'react-bits-frontend', 'SKILL.md');
const REQUIRED_REACT_BITS_CORPUS_FILES = Object.freeze([
  'animations.md',
  'audit-findings.md',
  'backgrounds.md',
  'catalog-summary.json',
  'components.md',
  'implementation-playbook.md',
  'index.md',
  'inventory.json',
  'text-animations.md',
]);

function listFilesRecursively(directory, root = directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const sourcePath = path.join(directory, entry.name);
    if (entry.isDirectory()) return listFilesRecursively(sourcePath, root);
    return entry.isFile() ? [path.relative(root, sourcePath)] : [];
  });
}

/**
 * Copy only the shipped React Bits corpus. Existing destination-only files are
 * intentionally left untouched so a project or global installation never
 * deletes user research alongside the managed corpus.
 */
function copyReactBitsCorpusSync(sourceRoot, destinationRoot) {
  const source = path.join(sourceRoot, REACT_BITS_CORPUS_RELATIVE_PATH);
  const destination = path.join(destinationRoot, REACT_BITS_CORPUS_RELATIVE_PATH);
  const files = listFilesRecursively(source);
  for (const relativePath of files) {
    const target = path.join(destination, relativePath);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(path.join(source, relativePath), target);
  }
  return files.map((relativePath) => path.join(REACT_BITS_CORPUS_RELATIVE_PATH, relativePath));
}

function hasCompleteReactBitsCorpus(root) {
  return REQUIRED_REACT_BITS_CORPUS_FILES.every((file) => fs.existsSync(
    path.join(root, REACT_BITS_CORPUS_RELATIVE_PATH, file),
  ));
}

/** Copy the corpus plus its canonical skill into a global SINAPSE home. */
function copyReactBitsCapabilitySync(sourceRoot, destinationRoot) {
  const files = copyReactBitsCorpusSync(sourceRoot, destinationRoot);
  const sourceSkill = path.join(sourceRoot, REACT_BITS_SKILL_RELATIVE_PATH);
  const destinationSkill = path.join(destinationRoot, REACT_BITS_SKILL_RELATIVE_PATH);
  if (!fs.existsSync(sourceSkill)) throw new Error(`Missing React Bits skill: ${sourceSkill}`);
  fs.mkdirSync(path.dirname(destinationSkill), { recursive: true });
  fs.copyFileSync(sourceSkill, destinationSkill);
  return { files, skillPath: destinationSkill };
}

module.exports = {
  REACT_BITS_CORPUS_RELATIVE_PATH,
  REACT_BITS_SKILL_RELATIVE_PATH,
  REQUIRED_REACT_BITS_CORPUS_FILES,
  listFilesRecursively,
  copyReactBitsCorpusSync,
  copyReactBitsCapabilitySync,
  hasCompleteReactBitsCorpus,
};
