'use strict';

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {stableRead, createExclusive} = require('../../scripts/expert-evolution/file-io.cjs');

describe('bounded file handles preserve concurrent writer bytes', () => {
  let root, file;
  beforeEach(() => {
    root = fs.realpathSync.native(fs.mkdtempSync(path.join(os.tmpdir(), 'expert-file-io-')));
    file = path.join(root, 'owned.txt');
    fs.writeFileSync(file, 'owned bytes');
  });
  afterEach(() => {
    jest.restoreAllMocks();
    if (path.dirname(root) !== fs.realpathSync.native(os.tmpdir()) || !path.basename(root).startsWith('expert-file-io-')) throw new Error('Unsafe fixture cleanup');
    fs.rmSync(root, {recursive:true, force:true});
  });
  test('reads an exact bounded Buffer and does not parse or change source bytes', () => {
    const before = fs.readFileSync(file);
    expect(stableRead(file, {root, maxBytes:before.length})).toEqual(before);
    expect(fs.readFileSync(file)).toEqual(before);
  });
  test('oversized input rejects before consuming any bytes', () => {
    const read = jest.spyOn(fs, 'readSync');
    expect(() => stableRead(file, {root, maxBytes:3})).toThrow('byte bound');
    expect(read).not.toHaveBeenCalled();
    expect(fs.readFileSync(file, 'utf8')).toBe('owned bytes');
  });
  test('optional means a legitimate missing path, while directories and linked parents reject', () => {
    expect(stableRead(path.join(root, 'missing'), {root, optional:true})).toBeNull();
    const dir = path.join(root, 'directory');
    fs.mkdirSync(dir);
    expect(() => stableRead(dir, {root, optional:true})).toThrow();
    fs.symlinkSync(dir, path.join(root, 'linked'), process.platform === 'win32' ? 'junction' : 'dir');
    expect(() => stableRead(path.join(root, 'linked/missing'), {root, optional:true})).toThrow(/symlink/);
    expect(fs.lstatSync(path.join(root, 'linked')).isSymbolicLink()).toBe(true);
  });
  test('a target replaced immediately after open rejects before reading and preserves both writers', () => {
    const original = fs.openSync.bind(fs), archived = path.join(root, 'prior.txt');
    jest.spyOn(fs, 'openSync').mockImplementation((target, ...args) => {
      const fd = original(target, ...args);
      if (target === file) {
        fs.renameSync(file, archived);
        fs.writeFileSync(file, 'concurrent bytes');
      }
      return fd;
    });
    const read = jest.spyOn(fs, 'readSync');
    expect(() => stableRead(file, {root})).toThrow(/identity changed/);
    expect(read).not.toHaveBeenCalled();
    jest.restoreAllMocks();
    expect(fs.readFileSync(file, 'utf8')).toBe('concurrent bytes');
    expect(fs.readFileSync(archived, 'utf8')).toBe('owned bytes');
  });
  test('a parent replaced between preflight and open rejects even when file bytes remain equal', () => {
    const dir = path.join(root, 'parent'), archived = path.join(root, 'prior-parent');
    fs.mkdirSync(dir);
    file = path.join(dir, 'owned.txt');
    fs.writeFileSync(file, 'owned bytes');
    const original = fs.openSync.bind(fs);
    jest.spyOn(fs, 'openSync').mockImplementation((target, ...args) => {
      if (target === file) {
        fs.renameSync(dir, archived);
        fs.mkdirSync(dir);
        fs.writeFileSync(file, 'owned bytes');
      }
      return original(target, ...args);
    });
    expect(() => stableRead(file, {root})).toThrow(/identity changed/);
    jest.restoreAllMocks();
    expect(fs.readFileSync(file, 'utf8')).toBe('owned bytes');
    expect(fs.readFileSync(path.join(archived, 'owned.txt'), 'utf8')).toBe('owned bytes');
  });
  test('in-place change through a hardlink during read rejects and preserves changed bytes', () => {
    const alias = path.join(root, 'alias.txt');
    fs.linkSync(file, alias);
    const original = fs.readSync.bind(fs);
    jest.spyOn(fs, 'readSync').mockImplementation((...args) => {
      const count = original(...args);
      fs.writeFileSync(alias, 'other bytes');
      fs.utimesSync(alias, new Date(), new Date(Date.now() + 2000));
      return count;
    });
    expect(() => stableRead(file, {root})).toThrow(/changed during read/);
    jest.restoreAllMocks();
    expect(fs.readFileSync(file, 'utf8')).toBe('other bytes');
    expect(fs.readFileSync(alias, 'utf8')).toBe('other bytes');
  });
  test('exclusive writes create owned bytes and cannot overwrite an existing destination', () => {
    const target = path.join(root, 'new.txt');
    createExclusive(target, Buffer.from('new bytes'), {root});
    expect(fs.readFileSync(target, 'utf8')).toBe('new bytes');
    expect(() => createExclusive(file, Buffer.from('replacement'), {root})).toThrow(/EEXIST/);
    expect(fs.readFileSync(file, 'utf8')).toBe('owned bytes');
  });
});
