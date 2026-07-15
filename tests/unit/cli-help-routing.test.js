'use strict';

const { spawnSync } = require('child_process');
const path = require('path');

describe('CLI help routing', () => {
  test('install --help exits through help without starting installation', () => {
    const cliPath = path.join(__dirname, '..', '..', 'bin', 'cli.js');
    const result = spawnSync(process.execPath, [cliPath, 'install', '--help'], {
      encoding: 'utf8',
      timeout: 15000,
    });
    const output = `${result.stdout || ''}\n${result.stderr || ''}`;

    expect(result.status).toBe(0);
    expect(output).toContain('npx sinapse-ai install');
    expect(output).not.toMatch(/Instalando SINAPSE AI globalmente|Installing SINAPSE core framework/);
  });
});
