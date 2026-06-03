'use strict';

const path = require('path');

// Module paths (mirrors verification-gates.test.js convention)
const G5_PATH = path.resolve(
  __dirname,
  '../../../.sinapse-ai/core/ids/gates/g5-semantic-handshake.js',
);
const ENGINE_PATH = path.resolve(
  __dirname,
  '../../../.sinapse-ai/core/synapse/context/semantic-handshake-engine.js',
);
const INDEX_PATH = path.resolve(
  __dirname,
  '../../../.sinapse-ai/core/ids/index.js',
);

const { G5SemanticHandshakeGate, G5_DEFAULT_TIMEOUT_MS } = require(G5_PATH);
const { SemanticHandshakeEngine } = require(ENGINE_PATH);

/**
 * Suppress gate logging during tests while recording calls.
 */
function createMockLogger() {
  return {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    log: jest.fn(),
  };
}

describe('G5SemanticHandshakeGate', () => {
  let logger;

  beforeEach(() => {
    logger = createMockLogger();
  });

  describe('constructor', () => {
    it('creates gate with correct blocking config', () => {
      const gate = new G5SemanticHandshakeGate({ logger });
      expect(gate.getGateId()).toBe('G5');
      expect(gate.getAgent()).toBe('@developer');
      expect(gate.isBlocking()).toBe(true);
    });

    it('defaults to 2s timeout', () => {
      expect(G5_DEFAULT_TIMEOUT_MS).toBe(2000);
    });

    it('accepts a pre-configured engine', () => {
      const engine = new SemanticHandshakeEngine();
      const gate = new G5SemanticHandshakeGate({ engine, logger });
      expect(gate.isBlocking()).toBe(true);
    });
  });

  describe('no constraints registered', () => {
    it('passes with an advisory note when nothing is registered', async () => {
      const gate = new G5SemanticHandshakeGate({ logger });
      const result = await gate.verify({
        proposedCode: 'const x = require("pg");',
      });

      expect(result.result.passed).toBe(true);
      expect(result.result.blocking).toBe(false);
      expect(result.result.warnings).toEqual(
        expect.arrayContaining([
          expect.stringContaining('No Semantic Handshake constraints registered'),
        ]),
      );
      expect(result.result.opportunities).toHaveLength(0);
    });
  });

  describe('constraints registered, no code provided', () => {
    it('passes and surfaces constraints as opportunities', async () => {
      const gate = new G5SemanticHandshakeGate({ logger });
      const result = await gate.verify({
        planningOutput: 'The service must use PostgreSQL as its database.',
        storyId: 'IDS-5b',
      });

      expect(result.result.passed).toBe(true);
      expect(result.result.blocking).toBe(false);
      expect(result.result.warnings).toEqual(
        expect.arrayContaining([
          expect.stringContaining('no proposed code was provided'),
        ]),
      );
      // The PostgreSQL extractor should register at least one constraint
      expect(result.result.opportunities.length).toBeGreaterThan(0);
      expect(result.result.opportunities[0]).toHaveProperty('entity');
      expect(result.result.opportunities[0]).toHaveProperty('severity');
    });

    it('surfaces explicit structured constraints as opportunities', async () => {
      const gate = new G5SemanticHandshakeGate({ logger });
      const result = await gate.verify({
        constraints: [
          {
            id: 'CUSTOM-RULE',
            description: 'Must not use console.log in production code.',
            severity: 'BLOCKER',
            forbiddenPatterns: [/console\.log/],
          },
        ],
      });

      expect(result.result.passed).toBe(true);
      expect(result.result.opportunities.some((o) => o.entity === 'CUSTOM-RULE')).toBe(true);
    });
  });

  describe('blocker violation', () => {
    it('fails (passed=false) and returns an override with correction prompt', async () => {
      const gate = new G5SemanticHandshakeGate({ logger });
      const result = await gate.verify({
        // Planning text triggers the PostgreSQL BLOCKER extractor
        planningOutput: 'The data layer must use PostgreSQL, never SQLite.',
        // Proposed code violates it by importing sqlite
        proposedCode: 'const db = require("better-sqlite3")("local.db");',
        storyId: 'IDS-5b',
      });

      expect(result.result.passed).toBe(false);
      expect(result.result.blocking).toBe(true);
      expect(result.override).not.toBeNull();
      expect(result.override.reason).toBe('Semantic Handshake blocker violation');
      expect(typeof result.override.correctionPrompt).toBe('string');
      expect(result.override.correctionPrompt.length).toBeGreaterThan(0);
      expect(result.override.report).toContain('Semantic Handshake Report');

      // The violating constraint should be surfaced as an opportunity
      const violation = result.result.opportunities.find(
        (o) => o.severity === 'BLOCKER' && o.matches && o.matches.length > 0,
      );
      expect(violation).toBeDefined();
    });

    it('passes (passed=true) when code complies with the blocker constraint', async () => {
      const gate = new G5SemanticHandshakeGate({ logger });
      const result = await gate.verify({
        planningOutput: 'The data layer must use PostgreSQL, never SQLite.',
        proposedCode: 'const { Pool } = require("pg"); const pool = new Pool();',
        storyId: 'IDS-5b',
      });

      expect(result.result.passed).toBe(true);
      expect(result.override).toBeNull();
    });

    it('blocks on an explicit BLOCKER constraint violated by proposed code', async () => {
      const gate = new G5SemanticHandshakeGate({ logger });
      const result = await gate.verify({
        constraints: [
          {
            id: 'NO-EVAL',
            description: 'Dynamic eval is forbidden.',
            severity: 'BLOCKER',
            forbiddenPatterns: [/\beval\s*\(/],
          },
        ],
        proposedCode: 'const result = eval(userInput);',
      });

      expect(result.result.passed).toBe(false);
      expect(result.result.blocking).toBe(true);
      expect(result.override).not.toBeNull();
    });
  });

  describe('statelessness across invocations', () => {
    it('does not leak context constraints between verify() calls', async () => {
      const gate = new G5SemanticHandshakeGate({ logger });

      // First call registers a PostgreSQL constraint via planning text
      await gate.verify({
        planningOutput: 'Use PostgreSQL only.',
        proposedCode: 'const { Pool } = require("pg");',
      });

      // Second call has no constraints — should report "none registered"
      const second = await gate.verify({
        proposedCode: 'const db = require("better-sqlite3")("x.db");',
      });

      expect(second.result.passed).toBe(true);
      expect(second.result.warnings).toEqual(
        expect.arrayContaining([
          expect.stringContaining('No Semantic Handshake constraints registered'),
        ]),
      );
    });
  });

  describe('barrel export', () => {
    it('is exported from the IDS index', () => {
      const ids = require(INDEX_PATH);
      expect(ids.G5SemanticHandshakeGate).toBe(G5SemanticHandshakeGate);
      expect(ids.G5_DEFAULT_TIMEOUT_MS).toBe(2000);
    });
  });
});
