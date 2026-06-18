/**
 * node-prerequisite.test.js
 *
 * Guards the install/init Node.js version preflight. Without it, users on an
 * old Node (< engines.node) hit a cryptic failure deep inside the wizard
 * instead of a clear "upgrade Node" message at the door.
 */

'use strict';

const { nodeSatisfies } = require('../../bin/sinapse.js');

describe('nodeSatisfies — install Node.js preflight', () => {
  it('accepts versions that meet the requirement', () => {
    expect(nodeSatisfies('v18.0.0', '>=18.0.0')).toBe(true);
    expect(nodeSatisfies('v20.1.0', '>=18.0.0')).toBe(true);
    expect(nodeSatisfies('v24.13.1', '>=18.0.0')).toBe(true);
  });

  it('rejects versions below the requirement', () => {
    expect(nodeSatisfies('v16.20.0', '>=18.0.0')).toBe(false);
    expect(nodeSatisfies('v17.9.0', '>=18.0.0')).toBe(false);
  });

  it('handles versions with or without the leading v', () => {
    expect(nodeSatisfies('18.5.0', '>=18.0.0')).toBe(true);
    expect(nodeSatisfies('16.0.0', '>=18.0.0')).toBe(false);
  });
});
