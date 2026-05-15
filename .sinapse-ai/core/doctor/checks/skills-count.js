/**
 * Doctor Check: Skills Count
 *
 * Counts skill directories in .claude/skills/ that contain SKILL.md.
 * PASS: >=7, WARN: 1-6, FAIL: 0 or directory missing.
 *
 * @module sinapse-ai/doctor/checks/skills-count
 * @story INS-4.8
 */

const path = require('path');
const fs = require('fs');

const name = 'skills-count';

async function run(context) {
  // v1.4.2 fix: skills are OPTIONAL user-installed artifacts under .claude/skills/,
  // not shipped by `npx sinapse-ai install` (verified against install-manifest).
  // Previous behavior FAILed with "Run `npx sinapse-ai install --force`" — but
  // force-reinstall doesn't create skills either. Now reports as INFO when
  // absent and as PASS/WARN proportional to how many were installed by the user.

  const skillsDir = path.join(context.projectRoot, '.claude', 'skills');

  if (!fs.existsSync(skillsDir)) {
    return {
      check: name,
      status: 'INFO',
      message: 'No .claude/skills/ directory — skills are optional (install via `npx claude-skills add <name>`)',
      fixCommand: null,
    };
  }

  let entries;
  try {
    entries = fs.readdirSync(skillsDir, { withFileTypes: true });
  } catch {
    return {
      check: name,
      status: 'WARN',
      message: 'Cannot read .claude/skills/ directory',
      fixCommand: null,
    };
  }

  const skills = entries.filter(
    (d) => d.isDirectory() && fs.existsSync(path.join(skillsDir, d.name, 'SKILL.md')),
  );

  const count = skills.length;

  if (count === 0) {
    return {
      check: name,
      status: 'INFO',
      message: 'Skills directory exists but empty — skills are optional',
      fixCommand: null,
    };
  }

  return {
    check: name,
    status: 'PASS',
    message: `${count} skill${count === 1 ? '' : 's'} installed`,
    fixCommand: null,
  };
}

// v1.4.2: skills are optional — never FAIL on this check.
const onError = 'warn';

module.exports = { name, run, onError };

