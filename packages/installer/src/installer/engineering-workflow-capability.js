'use strict';

const fs = require('fs');
const path = require('path');
const {
  ensureSafeDirectoryWithinHome,
  readRegularFileNoFollowSync,
  writeFileAtomically,
} = require(path.resolve(__dirname, '../../../../bin/lib/global-provider-adapters'));

const ENGINEERING_SKILL_RELATIVE_PATH = path.join('.agents', 'skills', 'sinapse-engineering', 'SKILL.md');
const FIXED_FILES = [
  ENGINEERING_SKILL_RELATIVE_PATH,
  'bin/engineering-workflows.js',
  'scripts/import-engineering-workflows.js',
  'packages/engineering-applicability/index.js',
  'NOTICE.md',
  'LICENSE',
];
const CAPABILITY_DIRECTORIES = ['packages/engineering-workflows', 'docs/framework/engineering-workflows'];

/** Copy the shipped capability only; preserve destination-only user files. */
function copyEngineeringWorkflowCapabilitySync(sourceRoot, destinationRoot) {
  const root = fs.realpathSync(sourceRoot);
  const files = [...FIXED_FILES];
  const collect = (relative) => {
    const absolute = path.join(root, relative);
    const stat = fs.lstatSync(absolute);
    if (stat.isSymbolicLink()) throw new Error('Engineering capability source must not contain links');
    if (stat.isDirectory()) {
      for (const entry of fs.readdirSync(absolute).sort()) collect(path.join(relative, entry));
    } else if (stat.isFile() && /\.(?:js|json|md)$/.test(relative)) files.push(relative);
    else throw new Error('Unexpected engineering capability source');
    if (files.length > 128) throw new Error('Engineering capability file limit exceeded');
  };
  CAPABILITY_DIRECTORIES.forEach(collect);
  // Read and validate the complete payload before the first destination write.
  let bytes = 0;
  const payload = files.map((relative) => {
    let current = root;
    for (const part of relative.split(path.sep)) {
      current = path.join(current, part);
      if (fs.lstatSync(current).isSymbolicLink()) throw new Error('Engineering source path contains a link');
    }
    const buffer = readRegularFileNoFollowSync(current);
    if (!buffer || buffer.length > 2 * 1024 * 1024) throw new Error('Missing or oversized engineering capability file');
    bytes += buffer.length;
    if (bytes > 16 * 1024 * 1024) throw new Error('Engineering capability byte limit exceeded');
    return { relative, buffer };
  });
  ensureSafeDirectoryWithinHome(destinationRoot, destinationRoot);
  for (const { relative, buffer } of payload) {
    const target = path.join(destinationRoot, relative);
    ensureSafeDirectoryWithinHome(destinationRoot, path.dirname(target));
    writeFileAtomically(target, buffer, destinationRoot);
  }
  return { files: files.map((file) => file.replace(/\\/g, '/')), bytes, skillPath: path.join(destinationRoot, ENGINEERING_SKILL_RELATIVE_PATH) };
}

module.exports = { ENGINEERING_SKILL_RELATIVE_PATH, copyEngineeringWorkflowCapabilitySync };
