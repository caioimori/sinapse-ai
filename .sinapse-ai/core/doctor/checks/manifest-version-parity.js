/**
 * Doctor Check: Manifest Version Parity
 *
 * Audit 1 P1 — `package.json` and `.sinapse-ai/install-manifest.yaml`
 * must declare the same version string. The manifest is auto-generated
 * during `prepublishOnly` and the audit caught a window where the
 * manifest still said `10.0.0-rc.10` while package.json had moved to
 * `10.0.0-rc.11`. A user installing the rc.11 tarball would see a
 * mismatched manifest version, eroding trust in the install integrity
 * checks.
 *
 * This check fails when the two version fields disagree so any drift
 * surfaces immediately on local `sinapse doctor` runs and CI.
 *
 * @module sinapse-ai/doctor/checks/manifest-version-parity
 * @story Audit 1 P1
 */

const path = require('path');
const fs = require('fs');

const name = 'manifest-version-parity';

function readManifestVersion(manifestPath) {
  // The install-manifest is YAML but we only need the top `version` line.
  // Reading line-by-line avoids requiring js-yaml in the doctor critical path.
  if (!fs.existsSync(manifestPath)) return null;
  try {
    const lines = fs.readFileSync(manifestPath, 'utf8').split('\n');
    for (const line of lines.slice(0, 30)) {
      const m = line.match(/^version:\s*(\S+)/);
      if (m) return m[1].replace(/^['"]/, '').replace(/['"]$/, '');
    }
  } catch { /* fall through */ }
  return null;
}

async function run(context) {
  // v1.4.2 fix: this check was designed for the FRAMEWORK REPO itself — it
  // detects drift between `package.json` and the auto-generated install-manifest
  // during pre-publish. When run in a USER project, the cwd `package.json` is
  // the user's own (e.g. `version: "1.0.0"`), and `install-manifest.yaml` ships
  // with the framework version. Comparing them is meaningless and the FAIL
  // message + fix command (`npm run generate:manifest`) are confusing — that
  // script only exists in the framework repo.
  //
  // Detect framework-repo context by reading `name` from package.json. Only
  // perform parity check when name === "sinapse-ai". Otherwise INFO.

  const pkgPath = path.join(context.projectRoot, 'package.json');
  const manifestPath = path.join(context.projectRoot, '.sinapse-ai', 'install-manifest.yaml');

  if (!fs.existsSync(pkgPath)) {
    return {
      check: name,
      status: 'INFO',
      message: 'No package.json — parity check not applicable',
      fixCommand: null,
    };
  }

  let pkgJson;
  try {
    pkgJson = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  } catch {
    return {
      check: name,
      status: 'WARN',
      message: 'package.json could not be parsed',
      fixCommand: null,
    };
  }

  // Only audit parity inside the framework repo itself.
  if (pkgJson.name !== 'sinapse-ai') {
    return {
      check: name,
      status: 'INFO',
      message: 'Parity check skipped (not the sinapse-ai repo)',
      fixCommand: null,
    };
  }

  if (!fs.existsSync(manifestPath)) {
    return {
      check: name,
      status: 'WARN',
      message: 'install-manifest.yaml not found',
      fixCommand: 'npm run generate:manifest',
    };
  }

  const pkgVersion = pkgJson.version;
  const manifestVersion = readManifestVersion(manifestPath);

  if (!pkgVersion || !manifestVersion) {
    return {
      check: name,
      status: 'WARN',
      message: `Could not determine versions (pkg=${pkgVersion ?? '?'}, manifest=${manifestVersion ?? '?'})`,
      fixCommand: 'npm run generate:manifest',
    };
  }

  if (pkgVersion !== manifestVersion) {
    return {
      check: name,
      status: 'FAIL',
      message: `Version drift: package.json=${pkgVersion}, install-manifest=${manifestVersion}`,
      fixCommand: 'npm run generate:manifest',
    };
  }

  return {
    check: name,
    status: 'PASS',
    message: `Version ${pkgVersion} (manifest aligned)`,
    fixCommand: null,
  };
}

const onError = 'fail';

module.exports = { name, run, onError };
