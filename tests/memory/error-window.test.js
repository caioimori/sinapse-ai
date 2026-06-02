'use strict';

/**
 * Error Window Rolling Tests — PORT #8
 * Story: error window rolante (errorWindowMs)
 *
 * Verifica que:
 * 1. Erros dentro da janela acumulam count (ficam "quentes")
 * 2. Erros fora da janela são podados — count decai (esfria)
 * 3. Backward-compat: tracking legado só com lastSeen é migrado
 */

const os = require('os');
const path = require('path');
const fs = require('fs');

const { GotchasMemory } = require('../../.sinapse-ai/core/memory/gotchas-memory');

// ── helpers ──────────────────────────────────────────────────────────────────

/**
 * Cria instância com tmpdir isolado e arquivos desabilitados (quiet).
 * errorWindowMs configurável.
 */
function makeMemory(errorWindowMs = 60_000) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'snps-gotchas-'));
  return new GotchasMemory(tmpDir, { errorWindowMs, quiet: true });
}

const ERROR_DATA = { message: 'SNPS_TEST_ERROR: something broke', stack: '' };

// ── suite ─────────────────────────────────────────────────────────────────────

describe('GotchasMemory — rolling error window (errorWindowMs)', () => {
  let dateSpy;

  afterEach(() => {
    if (dateSpy) {
      dateSpy.mockRestore();
      dateSpy = null;
    }
  });

  // ── 1. Erros dentro da janela acumulam ──────────────────────────────────

  describe('within window — count accumulates (hot)', () => {
    test('first occurrence creates count = 1', () => {
      const mem = makeMemory(60_000);
      dateSpy = jest.spyOn(Date, 'now').mockReturnValue(1_000_000);

      mem.trackError(ERROR_DATA);

      const tracking = mem.errorTracking.get([...mem.errorTracking.keys()][0]);
      expect(tracking.count).toBe(1);
      expect(tracking.timestamps).toHaveLength(1);
    });

    test('three rapid occurrences in window → count = 3', () => {
      const mem = makeMemory(60_000);
      const base = 1_000_000;

      dateSpy = jest.spyOn(Date, 'now').mockReturnValue(base);
      mem.trackError(ERROR_DATA);

      dateSpy.mockReturnValue(base + 1_000);
      mem.trackError(ERROR_DATA);

      dateSpy.mockReturnValue(base + 2_000);
      mem.trackError(ERROR_DATA);

      const key = [...mem.errorTracking.keys()][0];
      const tracking = mem.errorTracking.get(key);
      expect(tracking.count).toBe(3);
      expect(tracking.timestamps).toHaveLength(3);
    });

    test('count within window triggers auto-capture at threshold (3)', () => {
      const mem = makeMemory(60_000);
      const base = 2_000_000;

      dateSpy = jest.spyOn(Date, 'now').mockReturnValue(base);
      mem.trackError(ERROR_DATA);
      dateSpy.mockReturnValue(base + 100);
      mem.trackError(ERROR_DATA);
      dateSpy.mockReturnValue(base + 200);
      const result = mem.trackError(ERROR_DATA);

      // threshold = 3 → deve auto-capturar gotcha
      expect(result).not.toBeNull();
      expect(result.source.type).toBe('auto_detected');
    });
  });

  // ── 2. Erros fora da janela são podados — count decai (cold) ──────────

  describe('beyond window — count decays (cold)', () => {
    test('single old error is pruned after window passes → count = 1 (novo)', () => {
      const mem = makeMemory(60_000); // janela de 60 s
      const base = 5_000_000;

      // Adiciona erro no tempo base
      dateSpy = jest.spyOn(Date, 'now').mockReturnValue(base);
      mem.trackError(ERROR_DATA);

      const key = [...mem.errorTracking.keys()][0];
      expect(mem.errorTracking.get(key).count).toBe(1);

      // Avança 70 s além da janela
      dateSpy.mockReturnValue(base + 70_000);
      mem.trackError(ERROR_DATA);

      const tracking = mem.errorTracking.get(key);
      // O erro antigo foi podado; só o novo timestamp sobrou
      expect(tracking.count).toBe(1);
      expect(tracking.timestamps).toHaveLength(1);
      expect(tracking.timestamps[0]).toBe(base + 70_000);
    });

    test('two old + one new → count decai de 2 para 1', () => {
      const mem = makeMemory(30_000); // janela de 30 s
      const base = 8_000_000;

      dateSpy = jest.spyOn(Date, 'now').mockReturnValue(base);
      mem.trackError(ERROR_DATA);
      dateSpy.mockReturnValue(base + 5_000);
      mem.trackError(ERROR_DATA);

      const key = [...mem.errorTracking.keys()][0];
      expect(mem.errorTracking.get(key).count).toBe(2);

      // Avança 40 s — ambos antigos ficam fora da janela de 30 s
      dateSpy.mockReturnValue(base + 40_000);
      mem.trackError(ERROR_DATA);

      const tracking = mem.errorTracking.get(key);
      expect(tracking.count).toBe(1);
    });

    test('threshold NÃO dispara se count apenas por erros fora da janela', () => {
      const mem = makeMemory(10_000); // janela de 10 s, threshold 3
      const base = 10_000_000;

      // 2 erros dentro da janela
      dateSpy = jest.spyOn(Date, 'now').mockReturnValue(base);
      mem.trackError(ERROR_DATA);
      dateSpy.mockReturnValue(base + 1_000);
      mem.trackError(ERROR_DATA);

      // Avança 15 s → ambos fora da janela
      dateSpy.mockReturnValue(base + 15_000);
      const result = mem.trackError(ERROR_DATA);

      const key = [...mem.errorTracking.keys()][0];
      expect(mem.errorTracking.get(key).count).toBe(1);
      // Com count = 1 não atinge threshold 3 → não captura gotcha
      expect(result).toBeNull();
    });
  });

  // ── 3. Backward-compat: tracking legado (só lastSeen, sem timestamps) ──

  describe('backward-compat — legacy tracking migrated', () => {
    test('legacy entry without timestamps[] is handled via lastSeen fallback', () => {
      const mem = makeMemory(60_000);
      const base = 20_000_000;

      // Injeta diretamente um tracking legado (sem campo timestamps)
      const hash = 'abc123legacy';
      mem.errorTracking.set(hash, {
        count: 1,
        firstSeen: base - 5_000,
        lastSeen: base - 5_000,
        samples: [],
        errorPattern: 'legacy error',
        category: 'runtime',
        // sem timestamps: []
      });

      // _normalizeErrorTimestamps deve cair no fallback [lastSeen]
      const legacyTracking = mem.errorTracking.get(hash);
      const normalized = mem._normalizeErrorTimestamps(legacyTracking);

      expect(normalized).toEqual([base - 5_000]);
    });

    test('legacy entry within window is preserved on next trackError', () => {
      const mem = makeMemory(60_000);
      const base = 25_000_000;

      // Injeta tracking legado com lastSeen dentro da janela
      const errorData = { message: 'legacy compatible error', stack: '' };
      const hash = mem._hashError(errorData);
      mem.errorTracking.set(hash, {
        count: 1,
        firstSeen: base - 10_000,
        lastSeen: base - 10_000,
        samples: [],
        errorPattern: errorData.message,
        category: 'runtime',
      });

      dateSpy = jest.spyOn(Date, 'now').mockReturnValue(base);
      mem.trackError(errorData);

      const tracking = mem.errorTracking.get(hash);
      // legado (dentro da janela) + novo = 2
      expect(tracking.count).toBe(2);
      expect(tracking.timestamps).toHaveLength(2);
    });

    test('legacy entry outside window is dropped on next trackError', () => {
      const mem = makeMemory(60_000);
      const base = 30_000_000;

      const errorData = { message: 'legacy expired error', stack: '' };
      const hash = mem._hashError(errorData);
      // lastSeen = 2 minutos atrás (fora de 60 s)
      mem.errorTracking.set(hash, {
        count: 5,
        firstSeen: base - 120_000,
        lastSeen: base - 120_000,
        samples: [],
        errorPattern: errorData.message,
        category: 'runtime',
      });

      dateSpy = jest.spyOn(Date, 'now').mockReturnValue(base);
      mem.trackError(errorData);

      const tracking = mem.errorTracking.get(hash);
      // count legado (5) era baseado em timestamps fora da janela → resetado para 1
      expect(tracking.count).toBe(1);
    });
  });

  // ── 4. firstSeen atualiza para o timestamp vivo mais antigo ─────────────

  describe('firstSeen reflects oldest live timestamp', () => {
    test('firstSeen moves forward when old entries are pruned', () => {
      const mem = makeMemory(30_000);
      const base = 40_000_000;

      dateSpy = jest.spyOn(Date, 'now').mockReturnValue(base);
      mem.trackError(ERROR_DATA);
      dateSpy.mockReturnValue(base + 5_000);
      mem.trackError(ERROR_DATA);

      const key = [...mem.errorTracking.keys()][0];
      expect(mem.errorTracking.get(key).firstSeen).toBe(base);

      // Avança 40 s — ambos fora da janela de 30 s; novo erro adicionado
      dateSpy.mockReturnValue(base + 40_000);
      mem.trackError(ERROR_DATA);

      const tracking = mem.errorTracking.get(key);
      // firstSeen deve ser o novo timestamp (único vivo)
      expect(tracking.firstSeen).toBe(base + 40_000);
    });
  });
});
