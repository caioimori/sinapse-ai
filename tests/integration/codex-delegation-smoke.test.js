'use strict';

const {
  resolveCodexDelegation,
} = require('../../.codex/scripts/resolve-codex-delegation');

// TODO: resolveCodexDelegation incomplete — re-enable when delegation routes are finalized
describe.skip('Codex delegation smoke', () => {
  it('resolves representative validator-backed and shim routes from the real matrix', () => {
    const brandRoute = resolveCodexDelegation('brand-discovery');
    const launchRoute = resolveCodexDelegation('multi-domain-launch');
    const frameworkRoute = resolveCodexDelegation('framework-story-delivery');

    expect(brandRoute.classification).toBe('validator-backed');
    expect(brandRoute.delegationChain[1].to).toBe('brand-strategist');

    expect(launchRoute.classification).toBe('codex-only-shim');
    expect(launchRoute.delegationChain.map((step) => step.to)).toEqual(
      expect.arrayContaining(['product-orqx', 'copy-orqx', 'paidmedia-orqx']),
    );

    expect(frameworkRoute.classification).toBe('validator-backed');
    expect(frameworkRoute.delegationChain.map((step) => step.to)).toEqual([
      'sinapse-pm',
      'sinapse-po',
      'sinapse-sm',
      'sinapse-dev',
      'sinapse-qa',
    ]);
  });
});
