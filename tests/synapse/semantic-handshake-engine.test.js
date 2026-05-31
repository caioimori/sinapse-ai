'use strict';

const {
  SemanticHandshakeEngine,
  ConstraintType,
  ConstraintSeverity,
  DEFAULT_EXTRACTORS,
} = require('../../.sinapse-ai/core/synapse/context/semantic-handshake-engine');

const barrel = require('../../.sinapse-ai/core/synapse/context');

describe('SemanticHandshakeEngine', () => {
  describe('registerConstraints', () => {
    it('extracts a hard constraint from planning text (require pg, forbid sqlite)', () => {
      const engine = new SemanticHandshakeEngine();
      const planning =
        'The architecture decision: persistence layer must use PostgreSQL. ' +
        'No local databases.';

      const registered = engine.registerConstraints(planning);

      expect(registered.length).toBeGreaterThan(0);
      const pgConstraint = registered.find(c => c.id === 'TECH-POSTGRESQL');
      expect(pgConstraint).toBeDefined();
      expect(pgConstraint.type).toBe(ConstraintType.TECH_STACK);
      expect(pgConstraint.severity).toBe(ConstraintSeverity.BLOCKER);
      expect(pgConstraint.metadata.extractedFrom).toBe('planning-output');

      // Confirm it landed in the engine's registry.
      const ids = engine.getConstraints().map(c => c.id);
      expect(ids).toContain('TECH-POSTGRESQL');
    });

    it('does not register constraints when planning text mentions no known rules', () => {
      const engine = new SemanticHandshakeEngine();
      const registered = engine.registerConstraints('Build a friendly onboarding screen.');
      expect(registered).toEqual([]);
      expect(engine.getConstraints()).toEqual([]);
    });
  });

  describe('validateExecutionIntent', () => {
    it('fails on violating code with blockingViolations and a correctionPrompt', async () => {
      const engine = new SemanticHandshakeEngine();
      engine.registerConstraints('Persistence must use PostgreSQL.');

      const result = await engine.validateExecutionIntent({
        files: [
          {
            path: 'db.js',
            content: "const Database = require('better-sqlite3');\nconst db = new Database('app.sqlite');",
          },
        ],
      });

      expect(result.passed).toBe(false);
      expect(result.blockingViolations.length).toBeGreaterThan(0);
      expect(result.blockingViolations[0].id).toBe('TECH-POSTGRESQL');
      expect(result.blockingViolations[0].severity).toBe(ConstraintSeverity.BLOCKER);
      expect(result.correctionPrompt).toContain('Semantic Handshake failed');
      expect(result.correctionPrompt).toContain('TECH-POSTGRESQL');
    });

    it('passes on conforming code that satisfies the constraint', async () => {
      const engine = new SemanticHandshakeEngine();
      engine.registerConstraints('Persistence must use PostgreSQL.');

      const result = await engine.validateExecutionIntent({
        files: [
          {
            path: 'db.js',
            content: "const { Client } = require('pg');\nconst client = new Client();",
          },
        ],
      });

      expect(result.passed).toBe(true);
      expect(result.blockingViolations).toEqual([]);
      expect(result.correctionPrompt).toBe('');
      expect(result.verifiedConstraints.map(c => c.id)).toContain('TECH-POSTGRESQL');
    });

    it('passes (with warnings) when a WARNING constraint is violated but no blocker exists', async () => {
      const engine = new SemanticHandshakeEngine();
      engine.addConstraint({
        id: 'STYLE-NO-CONSOLE',
        type: ConstraintType.CUSTOM,
        severity: ConstraintSeverity.WARNING,
        description: 'Avoid console.log in production code.',
        forbiddenPatterns: [/console\.log\s*\(/],
      });

      const result = await engine.validateExecutionIntent({
        files: [{ path: 'app.js', content: "console.log('debug');" }],
      });

      expect(result.passed).toBe(true);
      expect(result.blockingViolations).toEqual([]);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0]).toContain('console.log');
    });

    it('passes with no violations when no constraints are registered', async () => {
      const engine = new SemanticHandshakeEngine();

      const result = await engine.validateExecutionIntent({
        files: [{ path: 'anything.js', content: 'const x = 1;' }],
      });

      expect(result.passed).toBe(true);
      expect(result.constraintCount).toBe(0);
      expect(result.violations).toEqual([]);
      expect(result.blockingViolations).toEqual([]);
      expect(result.correctionPrompt).toBe('');
    });
  });

  describe('generateComplianceReport', () => {
    it('reports PASSED/FAILED status with verified and violating constraints', async () => {
      const engine = new SemanticHandshakeEngine();
      engine.registerConstraints('Persistence must use PostgreSQL.');

      const failing = await engine.validateExecutionIntent({
        files: [{ path: 'db.js', content: "require('sqlite');" }],
      });
      const report = engine.generateComplianceReport(failing);

      expect(report).toContain('Semantic Handshake Report');
      expect(report).toContain('Status: FAILED');
      expect(report).toContain('TECH-POSTGRESQL');
    });
  });

  describe('toContextMessage branding', () => {
    it('emits SINAPSE-branded metadata under the snps namespace', async () => {
      const engine = new SemanticHandshakeEngine();
      engine.registerConstraints('Persistence must use PostgreSQL.');
      const result = await engine.validateExecutionIntent({
        files: [{ path: 'db.js', content: "require('sqlite');" }],
      });

      const message = engine.toContextMessage(result);
      expect(message.role).toBe('system');
      expect(message.metadata.snps).toBeDefined();
      expect(message.metadata.snps.type).toBe('semantic_handshake_report');
      expect(message.metadata.snps.passed).toBe(false);
      expect(message.metadata).not.toHaveProperty('aiox');
    });
  });

  describe('clone', () => {
    it('produces an independent copy carrying registered constraints', () => {
      const engine = new SemanticHandshakeEngine();
      engine.registerConstraints('Persistence must use PostgreSQL.');

      const copy = engine.clone();
      expect(copy.getConstraints().map(c => c.id)).toContain('TECH-POSTGRESQL');

      copy.clear();
      expect(copy.getConstraints()).toEqual([]);
      // Original is unaffected.
      expect(engine.getConstraints().map(c => c.id)).toContain('TECH-POSTGRESQL');
    });
  });

  describe('context barrel', () => {
    it('re-exports the engine and existing context modules', () => {
      expect(typeof barrel.SemanticHandshakeEngine).toBe('function');
      expect(barrel.DEFAULT_EXTRACTORS).toBe(DEFAULT_EXTRACTORS);
      // context-builder export
      expect(typeof barrel.buildLayerContext).toBe('function');
      // context-tracker export
      expect(typeof barrel.calculateBracket).toBe('function');
    });
  });
});
