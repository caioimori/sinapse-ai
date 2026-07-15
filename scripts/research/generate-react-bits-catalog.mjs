#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const valueOf = flag => {
  const index = args.indexOf(flag);
  return index === -1 ? undefined : args[index + 1];
};

const repo = resolve(valueOf('--repo') || '../.tmp-react-bits-research');
const output = resolve(valueOf('--output') || 'docs/framework/react-bits');
const infoPath = join(repo, 'src', 'constants', 'Information.js');

if (!existsSync(join(repo, '.git')) || !existsSync(infoPath)) {
  throw new Error(`React Bits checkout not found or incomplete: ${repo}`);
}

const sha = execFileSync('git', ['-C', repo, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const commitDate = execFileSync('git', ['-C', repo, 'show', '-s', '--format=%cI', 'HEAD'], {
  encoding: 'utf8'
}).trim();
const { componentMetadata, VARIANTS } = await import(`${pathToFileURL(infoPath).href}?sha=${sha}`);

if (!componentMetadata || !Array.isArray(VARIANTS) || VARIANTS.length !== 4) {
  throw new Error('Required React Bits metadata exports are missing or changed');
}

const categories = ['Animations', 'TextAnimations', 'Components', 'Backgrounds'];
const categorySlugs = {
  Animations: 'animations',
  TextAnimations: 'text-animations',
  Components: 'components',
  Backgrounds: 'backgrounds'
};

const walk = directory =>
  readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });

const codeMetadataFiles = walk(join(repo, 'src', 'constants', 'code')).filter(path => path.endsWith('.js'));
const codeMetadata = new Map();

for (const path of codeMetadataFiles) {
  const source = readFileSync(path, 'utf8');
  const sourceMatch = source.match(/@(?:content|ts-default)\/([^/]+)\/([^/]+)\//);
  if (!sourceMatch) continue;
  const dependencyMatch = source.match(/dependencies\s*:\s*([`'"])([\s\S]*?)\1/);
  const dependencies = dependencyMatch
    ? dependencyMatch[2].replace(/^\s*(?:npm|pnpm|yarn|bun)\s+(?:i|install|add)\s+/, '').trim()
    : '';
  codeMetadata.set(`${sourceMatch[1]}/${sourceMatch[2]}`.toLowerCase(), { dependencies, path });
}

const findComponentDirectory = (category, name) => {
  const root = join(repo, 'src', 'ts-default', category);
  const match = readdirSync(root, { withFileTypes: true }).find(
    entry => entry.isDirectory() && entry.name.toLowerCase() === name.toLowerCase()
  );
  if (!match) throw new Error(`Missing TS source directory for ${category}/${name}`);
  return join(root, match.name);
};

const extractProps = source => {
  const blocks = [];
  const declarations = /(?:type|interface)\s+\w*Props\w*(?:\s+extends[^\{]+)?\s*(?:=\s*)?\{/g;
  for (const match of source.matchAll(declarations)) {
    let depth = 1;
    let cursor = match.index + match[0].length;
    const start = cursor;
    while (cursor < source.length && depth > 0) {
      if (source[cursor] === '{') depth += 1;
      if (source[cursor] === '}') depth -= 1;
      cursor += 1;
    }
    blocks.push(source.slice(start, cursor - 1));
  }

  const props = new Set();
  for (const block of blocks) {
    for (const line of block.split('\n')) {
      const match = line.match(/^\s*(?:readonly\s+)?([A-Za-z_$][\w$]*)\??\s*:/);
      if (match) props.add(match[1]);
    }
  }
  return [...props];
};

const escapeCell = value => String(value || '').replaceAll('|', '\\|').replaceAll('\n', ' ');
const entries = Object.entries(componentMetadata).map(([key, metadata]) => {
  const directory = findComponentDirectory(metadata.category, metadata.name);
  const sourceFile = readdirSync(directory).find(file => file.endsWith('.tsx'));
  if (!sourceFile) throw new Error(`Missing TSX source for ${key}`);
  const source = readFileSync(join(directory, sourceFile), 'utf8');
  const demoPath = join(repo, 'src', 'demo', metadata.category, `${metadata.name}Demo.jsx`);
  const demo = existsSync(demoPath) ? readFileSync(demoPath, 'utf8') : '';
  const demoProps = [...demo.matchAll(/\bname\s*:\s*['"]([^'"]+)['"]/g)].map(match => match[1]);
  const props = [...new Set(demoProps.length ? demoProps : extractProps(source))];
  const code = codeMetadata.get(key.toLowerCase()) || codeMetadata.get(
    `${metadata.category}/${basename(directory)}`.toLowerCase()
  );
  if (!code) throw new Error(`Missing code metadata for ${key}`);

  const variantConfig = {
    'JS-CSS': { root: 'content', extension: 'jsx' },
    'JS-TW': { root: 'tailwind', extension: 'jsx' },
    'TS-CSS': { root: 'ts-default', extension: 'tsx' },
    'TS-TW': { root: 'ts-tailwind', extension: 'tsx' }
  };
  const declaredVariants = metadata.variants || VARIANTS;
  const variants = Object.fromEntries(declaredVariants.map(variant => {
    const config = variantConfig[variant];
    const sourcePath = join(repo, 'src', config.root, metadata.category, basename(directory), `${basename(directory)}.${config.extension}`);
    const registryPath = join(repo, 'public', 'r', `${metadata.name}-${variant}.json`);
    if (!existsSync(sourcePath) || !existsSync(registryPath)) throw new Error(`Missing published variant ${key}/${variant}`);
    const registry = JSON.parse(readFileSync(registryPath, 'utf8'));
    const sourceBytes = statSync(sourcePath).size;
    return [variant, {
      source: sourcePath.slice(repo.length + 1).replaceAll('\\', '/'),
      sourceBytes,
      functional: sourceBytes > 0,
      dependencies: registry.dependencies || [],
      registryDependencies: registry.registryDependencies || []
    }];
  }));

  return {
    key,
    ...metadata,
    documentedDependencies: code.dependencies ? code.dependencies.split(/\s+/).filter(Boolean) : [],
    dependencies: [...new Set(Object.values(variants).flatMap(variant => variant.dependencies))],
    props,
    variants,
    sourceDirectory: basename(directory),
    sourceFile
  };
});

mkdirSync(output, { recursive: true });
for (const category of categories) {
  const list = entries.filter(entry => entry.category === category).sort((a, b) => a.name.localeCompare(b.name));
  const lines = [
    `# React Bits - ${category}`,
    '',
    `> Snapshot oficial: \`${sha}\` (${commitDate}). Total nesta categoria: **${list.length}**.`,
    '',
    'Cada item abaixo aponta para a documentacao e para o codigo TypeScript/CSS oficial fixado no commit pesquisado.',
    '',
    '| Componente | O que faz | Dependencias | Props publicas | Variantes |',
    '|---|---|---|---|---|'
  ];

  for (const entry of list) {
    const sourceUrl = `https://github.com/DavidHDev/react-bits/tree/${sha}/src/ts-default/${entry.category}/${entry.sourceDirectory}`;
    const label = `[${entry.name}](${entry.docsUrl}) ([fonte](${sourceUrl}))`;
    const props = entry.props.length ? entry.props.map(prop => `\`${prop}\``).join(', ') : 'children / DOM props';
    const variantStatus = Object.entries(entry.variants)
      .map(([variant, details]) => details.functional ? variant : `${variant} (VAZIA no upstream)`)
      .join(', ');
    const dependencies = entry.dependencies.length ? entry.dependencies.join(' ') : 'none';
    lines.push(
      `| ${label} | ${escapeCell(entry.description)} | \`${escapeCell(dependencies)}\` | ${escapeCell(props)} | ${variantStatus} |`
    );
  }

  lines.push('', '## Comandos por componente', '');
  lines.push('Substituir `<Component>` pelo nome exato da primeira coluna:');
  lines.push('', '```bash');
  lines.push('npx shadcn@latest add @react-bits/<Component>-TS-TW');
  lines.push('npx shadcn@latest add https://reactbits.dev/r/<Component>-TS-TW');
  lines.push('npx jsrepo@latest add https://reactbits.dev/r/<Component>-TS-TW');
  lines.push('```', '');
  writeFileSync(join(output, `${categorySlugs[category]}.md`), `${lines.join('\n')}\n`);
}

const dependencyCounts = new Map();
for (const entry of entries) {
  const packages = entry.dependencies;
  for (const packageName of packages) dependencyCounts.set(packageName, (dependencyCounts.get(packageName) || 0) + 1);
}

const incompleteVariants = entries.flatMap(entry => Object.entries(entry.variants)
  .filter(([, details]) => !details.functional)
  .map(([variant, details]) => ({ component: entry.name, category: entry.category, variant, source: details.source })));

const summary = {
  source: 'https://github.com/DavidHDev/react-bits',
  sha,
  commitDate,
  total: entries.length,
  categories: Object.fromEntries(categories.map(category => [category, entries.filter(item => item.category === category).length])),
  variants: VARIANTS,
  registryItems: entries.reduce((total, entry) => total + Object.keys(entry.variants).length, 0),
  documentedProps: entries.reduce((total, entry) => total + entry.props.length, 0),
  incompleteVariants,
  dependencies: Object.fromEntries([...dependencyCounts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])))
};
writeFileSync(join(output, 'catalog-summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
writeFileSync(join(output, 'inventory.json'), `${JSON.stringify({ ...summary, components: entries }, null, 2)}\n`);

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
