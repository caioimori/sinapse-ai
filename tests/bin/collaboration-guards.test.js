/**
 * @jest-environment node
 */

const { shouldBlockCommit } = require('../../bin/utils/git-branch-guard');
const {
  buildBranchName,
  buildWorkItemSlug,
  parseArgs,
  sanitizeSegment,
} = require('../../bin/utils/collab-start');
const { findSecretMatches, isBlockedEnvFile } = require('../../bin/utils/staged-secret-scan');
const { isProtectedPushTarget, parsePushRefs } = require('../../bin/utils/pre-push-safety');

describe('collaboration safety helpers', () => {
  describe('git-branch-guard', () => {
    it('blocks commits on the default branch when files are staged', () => {
      expect(
        shouldBlockCommit({
          branchName: 'main',
          defaultBranch: 'main',
          stagedFiles: ['README.md'],
        }),
      ).toBe(true);
    });

    it('allows commits on feature branches', () => {
      expect(
        shouldBlockCommit({
          branchName: 'caio/feat/story',
          defaultBranch: 'main',
          stagedFiles: ['README.md'],
        }),
      ).toBe(false);
    });
  });

  describe('collab-start', () => {
    it('sanitizes arbitrary strings into branch-safe segments', () => {
      expect(sanitizeSegment('Story 7.7.4 / Codex')).toBe('story-7-7-4-codex');
    });

    it('prefixes slugs with the story id when needed', () => {
      expect(buildWorkItemSlug('7.7.4', 'codex-collab-hardening')).toBe(
        '7-7-4-codex-collab-hardening',
      );
    });

    it('builds owner-prefixed branch names', () => {
      expect(
        buildBranchName({
          owner: 'caio',
          type: 'feat',
          storyId: '7.7.4',
          slug: 'codex-collab-hardening',
        }),
      ).toBe('caio/feat/7-7-4-codex-collab-hardening');
    });

    it('parses cli arguments', () => {
      expect(parseArgs(['7.7.4', 'codex-collab-hardening', '--type=docs', '--owner=soier'])).toEqual(
        {
          adoptCurrent: false,
          check: false,
          type: 'docs',
          owner: 'soier',
          storyId: '7.7.4',
          slug: 'codex-collab-hardening',
        },
      );
    });

    it('parses adopt-current mode', () => {
      expect(parseArgs(['--adopt-current', '7.7.4', 'codex-collab-hardening'])).toEqual({
        adoptCurrent: true,
        check: false,
        type: 'feat',
        owner: null,
        storyId: '7.7.4',
        slug: 'codex-collab-hardening',
      });
    });
  });

  describe('staged-secret-scan', () => {
    it('blocks committed env files except safe templates', () => {
      expect(isBlockedEnvFile('.env')).toBe(true);
      expect(isBlockedEnvFile('.env.local')).toBe(true);
      expect(isBlockedEnvFile('.env.example')).toBe(false);
    });

    it('detects obvious secret patterns', () => {
      expect(findSecretMatches('token=ghp_1234567890abcdefghijklmnop')).toContain(
        'GitHub personal token',
      );
      expect(findSecretMatches('-----BEGIN PRIVATE KEY-----')).toContain('generic private key');
    });
  });

  describe('pre-push-safety', () => {
    it('parses push ref payloads', () => {
      expect(parsePushRefs(Buffer.from('refs/heads/feat abc refs/heads/main def\n'))).toEqual([
        {
          localRef: 'refs/heads/feat',
          localSha: 'abc',
          remoteRef: 'refs/heads/main',
          remoteSha: 'def',
        },
      ]);
    });

    it('detects pushes to the protected default branch', () => {
      expect(isProtectedPushTarget('refs/heads/main', 'main')).toBe(true);
      expect(isProtectedPushTarget('refs/heads/release', 'main')).toBe(false);
    });
  });
});
