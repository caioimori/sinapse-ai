/**
 * L0 Constitution Processor Tests
 *
 * Tests for constitution rule loading, nonNegotiable validation,
 * graceful degradation on missing files, and ALWAYS_ON behavior.
 *
 * @story SYN-4 - Layer Processors L0-L3
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const LayerProcessor = require('../../.sinapse-ai/core/synapse/layers/layer-processor');
const L0ConstitutionProcessor = require('../../.sinapse-ai/core/synapse/layers/l0-constitution');

jest.setTimeout(30000);

function createTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'synapse-l0-test-'));
}

function cleanupTempDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
}

describe('L0ConstitutionProcessor', () => {
  let tempDir;
  let processor;

  beforeEach(() => {
    tempDir = createTempDir();
    processor = new L0ConstitutionProcessor();
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  describe('constructor', () => {
    test('should extend LayerProcessor', () => {
      expect(processor).toBeInstanceOf(LayerProcessor);
    });

    test('should set name to constitution', () => {
      expect(processor.name).toBe('constitution');
    });

    test('should set layer to 0', () => {
      expect(processor.layer).toBe(0);
    });

    test('should set timeout to 5ms', () => {
      expect(processor.timeout).toBe(5);
    });
  });

  describe('process()', () => {
    test('should load constitution rules from domain file', () => {
      // Given: constitution domain file with rules
      const constitutionFile = path.join(tempDir, 'constitution');
      fs.writeFileSync(constitutionFile, [
        'CONSTITUTION_RULE_ART1_0=CLI First (NON-NEGOTIABLE)',
        'CONSTITUTION_RULE_ART2_0=Agent Authority (NON-NEGOTIABLE)',
        'CONSTITUTION_RULE_ART3_0=Story-Driven (MUST)',
      ].join('\n'));

      const context = {
        prompt: 'test prompt',
        session: {},
        config: {
          synapsePath: tempDir,
          manifest: {
            domains: {
              CONSTITUTION: {
                state: 'active',
                alwaysOn: true,
                nonNegotiable: true,
                file: 'constitution',
              },
            },
          },
        },
        previousLayers: [],
      };

      const result = processor.process(context);

      expect(result).not.toBeNull();
      expect(result.rules).toHaveLength(3);
      expect(result.rules[0]).toContain('CLI First');
      expect(result.metadata.layer).toBe(0);
      expect(result.metadata.source).toBe('constitution');
      expect(result.metadata.nonNegotiable).toBe(true);
    });

    test('should validate nonNegotiable flag from manifest', () => {
      const constitutionFile = path.join(tempDir, 'constitution');
      fs.writeFileSync(constitutionFile, 'RULE_1=Test rule\n');

      const context = {
        prompt: '',
        session: {},
        config: {
          synapsePath: tempDir,
          manifest: {
            domains: {
              CONSTITUTION: {
                state: 'active',
                nonNegotiable: true,
                file: 'constitution',
              },
            },
          },
        },
        previousLayers: [],
      };

      const result = processor.process(context);
      expect(result.metadata.nonNegotiable).toBe(true);
    });

    test('should set nonNegotiable false when not in manifest', () => {
      const constitutionFile = path.join(tempDir, 'constitution');
      fs.writeFileSync(constitutionFile, 'RULE_1=Test rule\n');

      const context = {
        prompt: '',
        session: {},
        config: {
          synapsePath: tempDir,
          manifest: {
            domains: {
              CONSTITUTION: {
                state: 'active',
                file: 'constitution',
              },
            },
          },
        },
        previousLayers: [],
      };

      const result = processor.process(context);
      expect(result.metadata.nonNegotiable).toBe(false);
    });

    test('should return null when domain file is missing', () => {
      const context = {
        prompt: '',
        session: {},
        config: {
          synapsePath: tempDir,
          manifest: {
            domains: {
              CONSTITUTION: {
                state: 'active',
                file: 'nonexistent-file',
              },
            },
          },
        },
        previousLayers: [],
      };

      const result = processor.process(context);
      expect(result).toBeNull();
    });

    test('should return null when domain file is empty', () => {
      const constitutionFile = path.join(tempDir, 'constitution');
      fs.writeFileSync(constitutionFile, '');

      const context = {
        prompt: '',
        session: {},
        config: {
          synapsePath: tempDir,
          manifest: {
            domains: {
              CONSTITUTION: {
                state: 'active',
                file: 'constitution',
              },
            },
          },
        },
        previousLayers: [],
      };

      const result = processor.process(context);
      expect(result).toBeNull();
    });

    test('should use default path when domain has no file property', () => {
      const constitutionFile = path.join(tempDir, 'constitution');
      fs.writeFileSync(constitutionFile, 'RULE_1=Default path rule\n');

      const context = {
        prompt: '',
        session: {},
        config: {
          synapsePath: tempDir,
          manifest: {
            domains: {
              CONSTITUTION: { state: 'active', nonNegotiable: true },
            },
          },
        },
        previousLayers: [],
      };

      const result = processor.process(context);
      expect(result).not.toBeNull();
      expect(result.rules[0]).toContain('Default path rule');
    });

    test('should process regardless of session state (ALWAYS_ON)', () => {
      const constitutionFile = path.join(tempDir, 'constitution');
      fs.writeFileSync(constitutionFile, 'RULE=Always on rule\n');

      // Session with no agent, no workflow
      const context = {
        prompt: '',
        session: { active_agent: { id: null }, active_workflow: null },
        config: {
          synapsePath: tempDir,
          manifest: {
            domains: {
              CONSTITUTION: { state: 'active', file: 'constitution', nonNegotiable: true },
            },
          },
        },
        previousLayers: [],
      };

      const result = processor.process(context);
      expect(result).not.toBeNull();
      expect(result.rules).toHaveLength(1);
    });

    test('should handle manifest with no domains', () => {
      const constitutionFile = path.join(tempDir, 'constitution');
      fs.writeFileSync(constitutionFile, 'RULE=Fallback\n');

      const context = {
        prompt: '',
        session: {},
        config: {
          synapsePath: tempDir,
          manifest: { domains: {} },
        },
        previousLayers: [],
      };

      // Should use default path since no domain key matches
      const result = processor.process(context);
      expect(result).not.toBeNull();
    });
  });

  describe('_safeProcess()', () => {
    test('should return result via safe wrapper', () => {
      const constitutionFile = path.join(tempDir, 'constitution');
      fs.writeFileSync(constitutionFile, 'RULE=Safe test\n');

      const context = {
        prompt: '',
        session: {},
        config: {
          synapsePath: tempDir,
          manifest: {
            domains: {
              CONSTITUTION: { state: 'active', file: 'constitution', nonNegotiable: true },
            },
          },
        },
        previousLayers: [],
      };

      const result = processor._safeProcess(context);
      expect(result).not.toBeNull();
      expect(result.rules[0]).toContain('Safe test');
    });
  });

  // ==========================================================================
  // Context diet (Story onda1-s2) — full block only on 1st prompt;
  // reminder + pointer on prompts 2+; fail-safe = full block.
  // ==========================================================================
  describe('context diet (Story onda1-s2)', () => {
    const GRANULAR_RULE = 'MUST: Apenas @devops pode executar git push';
    const REALISTIC_CONSTITUTION = [
      'CONSTITUTION_RULE_ART1_0=CLI First (NON-NEGOTIABLE)',
      'CONSTITUTION_RULE_ART1_1=MUST: Toda funcionalidade nova DEVE funcionar via CLI',
      'CONSTITUTION_RULE_ART2_0=Agent Authority (NON-NEGOTIABLE)',
      `CONSTITUTION_RULE_ART2_1=${GRANULAR_RULE}`,
      'CONSTITUTION_RULE_ART3_0=Quality First (MUST)',
      'CONSTITUTION_RULE_ART3_1=MUST NOT: Declarar Done com teste vermelho',
    ].join('\n');

    /** Mirror of formatter.formatConstitution rendering (header + 2-space indent). */
    function formattedSection(rules) {
      return ['[CONSTITUTION] (NON-NEGOTIABLE)', ...rules.map(r => `  ${r}`)].join('\n');
    }

    function buildContext(session, fileContent = REALISTIC_CONSTITUTION) {
      fs.writeFileSync(path.join(tempDir, 'constitution'), fileContent);
      return {
        prompt: 'test prompt',
        session,
        config: {
          synapsePath: tempDir,
          manifest: {
            domains: {
              CONSTITUTION: { state: 'active', alwaysOn: true, nonNegotiable: true, file: 'constitution' },
            },
          },
        },
        previousLayers: [],
      };
    }

    test('(a) 1st prompt of the session (prompt_count=0) emits the FULL block', () => {
      const result = processor.process(buildContext({ prompt_count: 0 }));

      expect(result).not.toBeNull();
      expect(result.rules).toHaveLength(6);
      expect(result.rules).toContain(GRANULAR_RULE);
      expect(result.metadata.constitutionMode).toBe('full');
      expect(result.metadata.totalRules).toBe(6);
      expect(result.metadata.nonNegotiable).toBe(true);
    });

    test('(b) prompts 2+ emit a reminder with the mandatory pointer to .synapse/constitution', () => {
      const result = processor.process(buildContext({ prompt_count: 1 }));

      expect(result).not.toBeNull();
      expect(result.metadata.constitutionMode).toBe('reminder');
      expect(result.metadata.totalRules).toBe(6);

      const joined = result.rules.join('\n');
      // Pointer to the GRANULAR source is mandatory (adversarial-review ressalva:
      // the CLAUDE.md 11-article table does NOT substitute the granular rules)
      expect(joined).toContain('.synapse/constitution');
      expect(joined).toContain('NÃO substitui');
      // Article titles table present (derived dynamically, roman-numbered)
      expect(joined).toContain('I. CLI First (NON-NEGOTIABLE)');
      expect(joined).toContain('II. Agent Authority (NON-NEGOTIABLE)');
      expect(joined).toContain('III. Quality First (MUST)');
      // Granular rules are NOT repeated in the reminder
      expect(joined).not.toContain(GRANULAR_RULE);
    });

    test('(b) reminder formatted section stays <= 1000 chars', () => {
      const result = processor.process(buildContext({ prompt_count: 7 }));
      expect(result.metadata.constitutionMode).toBe('reminder');
      expect(formattedSection(result.rules).length).toBeLessThanOrEqual(1000);
    });

    test('(b) reminder keeps the pointer even with an oversized synthetic constitution', () => {
      // 40 long-titled articles → forces the compact/truncated layouts
      const lines = [];
      for (let i = 1; i <= 40; i++) {
        lines.push(`CONSTITUTION_RULE_ART${i}_0=Artigo Sintetico Numero ${i} Com Titulo Bem Comprido Para Estourar (NON-NEGOTIABLE)`);
        lines.push(`CONSTITUTION_RULE_ART${i}_1=MUST: regra granular ${i}`);
      }
      const result = processor.process(buildContext({ prompt_count: 3 }, lines.join('\n')));

      expect(result.metadata.constitutionMode).toBe('reminder');
      expect(formattedSection(result.rules).length).toBeLessThanOrEqual(1000);
      expect(result.rules.join('\n')).toContain('.synapse/constitution');
    });

    test('(c) session reset (prompt_count back to 0) returns to the FULL block', () => {
      const reminded = processor.process(buildContext({ prompt_count: 5 }));
      expect(reminded.metadata.constitutionMode).toBe('reminder');

      // New session → prompt_count resets to 0 → full block again
      const reset = processor.process(buildContext({ prompt_count: 0 }));
      expect(reset.metadata.constitutionMode).toBe('full');
      expect(reset.rules).toHaveLength(6);
      expect(reset.rules).toContain(GRANULAR_RULE);
    });

    test('(d) FAIL-SAFE: unreadable prompt_count always emits the FULL block', () => {
      const badSessions = [
        null,                          // session unreadable upstream
        undefined,
        {},                            // field missing
        { prompt_count: NaN },         // corrupted value
        { prompt_count: -1 },          // negative
        { prompt_count: 1.5 },         // non-integer
        { prompt_count: '3' },         // wrong type
        { prompt_count: Infinity },    // non-finite
      ];

      for (const session of badSessions) {
        const result = processor.process(buildContext(session));
        expect(result).not.toBeNull();
        expect(result.metadata.constitutionMode).toBe('full');
        expect(result.rules).toHaveLength(6);
      }
    });

    test('(d) FAIL-SAFE: constitution without article titles cannot be summarized → FULL block', () => {
      const noTitles = [
        'RULE_1=MUST: only granular rule one',
        'RULE_2=MUST NOT: only granular rule two',
      ].join('\n');
      const result = processor.process(buildContext({ prompt_count: 4 }, noTitles));

      expect(result.metadata.constitutionMode).toBe('full');
      expect(result.rules).toHaveLength(2);
    });

    test('real .synapse/constitution: reminder <= 1000 chars, pointer present, reduction >= 85%', () => {
      const realPath = path.join(__dirname, '..', '..', '.synapse', 'constitution');
      if (!fs.existsSync(realPath)) {
        return; // environment without the real domain file
      }
      const realContent = fs.readFileSync(realPath, 'utf8');

      const full = processor.process(buildContext({ prompt_count: 0 }, realContent));
      const reminder = processor.process(buildContext({ prompt_count: 1 }, realContent));

      expect(full.metadata.constitutionMode).toBe('full');
      expect(reminder.metadata.constitutionMode).toBe('reminder');

      const fullLen = formattedSection(full.rules).length;
      const reminderLen = formattedSection(reminder.rules).length;

      // Measured 2026-07-02: full = 7,226 chars; reminder = 683 chars (90.5% cut)
      expect(reminderLen).toBeLessThanOrEqual(1000);
      expect(reminder.rules.join('\n')).toContain('.synapse/constitution');
      const reductionPercent = ((fullLen - reminderLen) / fullLen) * 100;
      expect(reductionPercent).toBeGreaterThanOrEqual(85);
    });
  });

  // ==========================================================================
  // Context diet — engine integration (real pipeline, temp .synapse)
  // ==========================================================================
  describe('context diet — engine integration (Story onda1-s2)', () => {
    const GRANULAR_RULE = 'MUST: Apenas @devops pode executar git push';

    function writeConstitution(dir) {
      // Realistic size (24 granular rules) — the diet's size win only shows on
      // real-sized constitutions; a 4-rule toy file would be smaller than the
      // reminder itself (whose pointer line has a fixed cost).
      const lines = [
        'CONSTITUTION_RULE_ART1_0=CLI First (NON-NEGOTIABLE)',
        `CONSTITUTION_RULE_ART1_1=${GRANULAR_RULE}`,
        'CONSTITUTION_RULE_ART2_0=Agent Authority (NON-NEGOTIABLE)',
        'CONSTITUTION_RULE_ART2_1=MUST: Nenhum agente assume autoridade de outro',
        'CONSTITUTION_RULE_ART3_0=Quality First (MUST)',
      ];
      for (let i = 1; i <= 20; i++) {
        lines.push(`CONSTITUTION_RULE_ART3_${i}=MUST: regra granular de qualidade numero ${i} com texto realista de enforcement`);
      }
      fs.writeFileSync(path.join(dir, 'constitution'), lines.join('\n'));
    }

    test('AC1-AC3: turn 1 full → turn 2+ reminder → session reset full again', async () => {
      const { SynapseEngine } = require('../../.sinapse-ai/core/synapse/engine');
      writeConstitution(tempDir);
      const engine = new SynapseEngine(tempDir, { manifest: { domains: {} } });

      // AC1 — 1st prompt: full block with granular rules
      const turn1 = await engine.process('first prompt', { prompt_count: 0 });
      expect(turn1.xml).toContain('[CONSTITUTION] (NON-NEGOTIABLE)');
      expect(turn1.xml).toContain(GRANULAR_RULE);

      // AC2 — 2nd prompt: reminder with pointer, no granular repetition
      const turn2 = await engine.process('second prompt', { prompt_count: 1 });
      expect(turn2.xml).toContain('[CONSTITUTION] (NON-NEGOTIABLE)');
      expect(turn2.xml).toContain('.synapse/constitution');
      expect(turn2.xml).not.toContain(GRANULAR_RULE);
      expect(turn2.xml.length).toBeLessThan(turn1.xml.length);

      // AC3 — new session (prompt_count reset): full block again
      const newSession = await engine.process('new session prompt', { prompt_count: 0 });
      expect(newSession.xml).toContain(GRANULAR_RULE);
    });

    test('metrics.budget accounting is exposed and coherent (AC4)', async () => {
      const { SynapseEngine } = require('../../.sinapse-ai/core/synapse/engine');
      writeConstitution(tempDir);
      const engine = new SynapseEngine(tempDir, { manifest: { domains: {} } });

      const result = await engine.process('prompt', { prompt_count: 1 });
      expect(result.metrics.budget).toBeDefined();
      expect(result.metrics.budget.bracket).toBe('FRESH');
      expect(result.metrics.budget.tokenBudget).toBe(2000);
      expect(result.metrics.budget.emittedTokens).toBeGreaterThan(0);
      expect(result.metrics.budget.overBudget).toBe(false);
    });
  });
});

