'use strict';

const { shouldCheckManifest } = require('../../scripts/ensure-manifest');

describe('ensure-manifest', () => {
  describe('shouldCheckManifest', () => {
    it('returns false when no staged files', () => {
      expect(shouldCheckManifest([])).toBe(false);
    });

    it('returns false when only manifest file is staged', () => {
      expect(shouldCheckManifest(['.sinapse-ai/install-manifest.yaml'])).toBe(false);
    });

    it('returns true when any other .sinapse-ai file is staged', () => {
      expect(shouldCheckManifest(['.sinapse-ai/core-config.yaml'])).toBe(true);
      expect(
        shouldCheckManifest([
          'README.md',
          '.sinapse-ai/infrastructure/scripts/ide-sync/index.js',
        ]),
      ).toBe(true);
    });

    it('returns false when only non-.sinapse-ai files are staged', () => {
      expect(shouldCheckManifest(['README.md', 'package.json'])).toBe(false);
    });
  });
});

