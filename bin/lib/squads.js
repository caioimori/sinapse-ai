// bin/lib/squads.js — squad discovery + agent metadata extraction.
// Story GA-1.2 — extracted from bin/cli.js.

const fs = require('fs');
const path = require('path');
const { ROOT } = require('./constants');

function getSquads(baseDir) {
  baseDir = baseDir || ROOT;
  const squads = [];
  let entries;
  try {
    entries = fs.readdirSync(baseDir).filter(d => {
      if (d.includes('.deprecated') || d.startsWith('.')) return false;
      const dirPath = path.join(baseDir, d);
      if (!fs.statSync(dirPath).isDirectory()) return false;
      // Include squad-* dirs OR any dir with a squad.yaml manifest
      return d.startsWith('squad-') || fs.existsSync(path.join(dirPath, 'squad.yaml'));
    });
  } catch { return squads; }

  for (const dir of entries) {
    const manifest = path.join(baseDir, dir, 'squad.yaml');
    if (!fs.existsSync(manifest)) continue;

    const content = fs.readFileSync(manifest, 'utf8');
    const descMatch = content.match(/^description:\s*["']?(.+)/m);

    const agentsDir = path.join(baseDir, dir, 'agents');
    const tasksDir = path.join(baseDir, dir, 'tasks');
    const kbDir = path.join(baseDir, dir, 'knowledge-base');
    const wfDir = path.join(baseDir, dir, 'workflows');

    const count = (d, ext) => {
      try { return fs.readdirSync(d).filter(f => f.endsWith(ext)).length; }
      catch { return 0; }
    };

    squads.push({
      name: dir,
      desc: descMatch ? descMatch[1].replace(/["']/g, '').slice(0, 65) : '',
      agents: count(agentsDir, '.md'),
      tasks: count(tasksDir, '.md'),
      kbs: count(kbDir, '.md'),
      workflows: count(wfDir, '.yaml'),
    });
  }
  return squads;
}

function getAgentFiles(squadDir) {
  const agentsDir = path.join(squadDir, 'agents');
  if (!fs.existsSync(agentsDir)) return [];
  return fs.readdirSync(agentsDir).filter(f => f.endsWith('.md'));
}

function extractAgentMeta(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const nameMatch = content.match(/^(?:Nome|name):\s*["']?(.+?)["']?\s*$/m);
    const iconMatch = content.match(/^(?:Icon|icon):\s*["']?(.+?)["']?\s*$/m);
    return {
      name: nameMatch ? nameMatch[1].replace(/\*/g, '').trim() : '',
      icon: iconMatch ? iconMatch[1].replace(/\*/g, '').trim() : '',
    };
  } catch { return { name: '', icon: '' }; }
}

module.exports = {
  getSquads,
  getAgentFiles,
  extractAgentMeta,
};
