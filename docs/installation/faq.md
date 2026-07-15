# SINAPSE FAQ

> 🌐 **EN** | [PT](../pt/installation/faq.md)

**Version:** 2.1.0
**Last Updated:** 2025-01-24

---

## Table of Contents

- [Installation Questions](#installation-questions)
- [Updates & Maintenance](#updates--maintenance)
- [Offline & Air-Gapped Usage](#offline--air-gapped-usage)
- [IDE & Configuration](#ide--configuration)
- [Agents & Workflows](#agents--workflows)
- [Squads](#Squads)
- [Advanced Usage](#advanced-usage)

---

## Installation Questions

### Q1: Why npx instead of npm install -g?

**Answer:** We recommend `npx sinapse-ai install` over global installation for several reasons:

1. **Always Latest Version**: npx fetches the latest version automatically
2. **No Global Pollution**: Doesn't add to your global npm packages
3. **Project Isolation**: Each project can have its own version
4. **No Permission Issues**: Avoids common global npm permission problems
5. **CI/CD Friendly**: Works seamlessly in automated pipelines

**If you prefer global installation:**

```bash
npm install -g sinapse-ai
sinapse-ai install
```

---

### Q2: What are the system requirements?

**Answer:**

| Component      | Minimum                            | Recommended     |
| -------------- | ---------------------------------- | --------------- |
| **Node.js**    | 18.0.0                             | 20.x LTS        |
| **npm**        | 9.0.0                              | 10.x            |
| **Disk Space** | 100 MB                             | 500 MB          |
| **RAM**        | 2 GB                               | 8 GB            |
| **OS**         | Windows 10, macOS 12, Ubuntu 20.04 | Latest versions |

**Check your system:**

```bash
node --version  # Should be 18+
npm --version   # Should be 9+
```

---

### Q3: Can I install SINAPSE in an existing project?

**Answer:** Yes! SINAPSE is designed for both greenfield and brownfield projects.

**For existing projects:**

```bash
cd /path/to/existing-project
npx sinapse-ai install
```

The installer will:

- Create `.sinapse-ai/` directory (framework files)
- Create Claude Code and Codex adapters (`.claude/`, `.codex/`, and `.agents/skills/`)
- NOT modify your existing source code
- NOT overwrite existing documentation unless you choose to

**Important:** Existing provider directories are reconciled conservatively; keep custom files outside framework-managed adapter names.

---

### Q4: How long does installation take?

**Answer:**

| Scenario                | Time          |
| ----------------------- | ------------- |
| **First-time install**  | 2-5 minutes   |
| **Update existing**     | 1-2 minutes   |
| **Starter squad only** | 30-60 seconds |

Factors affecting installation time:

- Internet connection speed
- npm cache status
- Number of IDEs selected
- Starter squads selected

---

### Q5: What files does SINAPSE create in my project?

**Answer:** SINAPSE creates the following structure:

```text
your-project/
├── .sinapse-ai/                 # Runtime, configuration, and development assets
│   └── core-config.yaml         # Framework configuration
│
├── .claude/                    # Claude Code (if selected)
│   ├── agents/                 # Native Claude agent adapters
│   └── skills/                 # Claude Code skills
│
├── .codex/                     # Codex (if selected)
│   └── agents/                 # Native Codex agent descriptors
│
├── .agents/skills/             # Codex-compatible SINAPSE skills
│
├── docs/                       # Documentation structure
│   ├── stories/                # Development stories
│   ├── architecture/           # Architecture docs
│   └── prd/                    # Product requirements
│
└── squads/                      # 17 squad definitions and their assets
```

---

## Updates & Maintenance

### Q6: How do I update SINAPSE to the latest version?

**Answer:**

```bash
# Update via npx (recommended)
npx sinapse-ai update

# Or reinstall latest
npx sinapse-ai install --force-upgrade

# Check current version
npx sinapse-ai status
```

**What gets updated:**

- `.sinapse-ai/` files (agents, tasks, templates)
- IDE configurations
- Starter squads (if installed)

**What is preserved:**

- Your custom modifications in `core-config.yaml`
- Your documentation (`docs/`)
- Your source code

---

### Q7: How often should I update?

**Answer:** We recommend:

| Update Type          | Frequency   | Command                     |
| -------------------- | ----------- | --------------------------- |
| **Security patches** | Immediately | `npx sinapse-ai update` |
| **Minor updates**    | Monthly     | `npx sinapse-ai update` |
| **Major versions**   | Quarterly   | Review changelog first      |

**Check for updates:**

```bash
npm show sinapse-ai version
npx sinapse-ai status
```

---

### Q8: Can I rollback to a previous version?

**Answer:** Yes, several options:

**Option 1: Reinstall specific version**

```bash
npx sinapse-ai@1.1.0 install --force-upgrade
```

**Option 2: Use Git to restore**

```bash
# If .sinapse-ai is tracked in git
git checkout HEAD~1 -- .sinapse-ai/
```

**Option 3: Restore from backup**

```bash
# Installer creates backups
mv .sinapse-ai .sinapse-ai.failed
mv .sinapse-ai.backup .sinapse-ai
```

---

## Offline & Air-Gapped Usage

### Q9: Can I use SINAPSE without internet?

**Answer:** Yes, with some preparation:

**Initial setup (requires internet):**

```bash
# Install once with internet
npx sinapse-ai install

# Package for offline use
tar -czvf sinapse-offline.tar.gz .sinapse-ai/ .claude/ .codex/ .agents/ squads/
```

**On air-gapped machine:**

```bash
# Extract the package
tar -xzvf sinapse-offline.tar.gz

# SINAPSE agents work without internet
# (They don't require external API calls)
```

**Limitations without internet:**

- Cannot update to new versions
- MCP integrations (ClickUp, GitHub) won't work
- Cannot fetch library documentation (Context7)

---

### Q10: How do I transfer SINAPSE to an air-gapped environment?

**Answer:**

1. **On connected machine:**

   ```bash
   # Install and package
   npx sinapse-ai install
   cd your-project
   tar -czvf sinapse-transfer.tar.gz .sinapse-ai/ .claude/ .codex/ .agents/ squads/ docs/
   ```

2. **Transfer the archive** via USB, secure transfer, etc.

3. **On air-gapped machine:**

   ```bash
   cd your-project
   tar -xzvf sinapse-transfer.tar.gz
   ```

4. **Configure IDE manually** if needed (paths may differ)

---

## IDE & Configuration

### Q11: Which IDEs does SINAPSE support?

**Answer:**

| IDE             | Status       | Agent Activation                    |
| --------------- | ------------ | ----------------------------------- |
| **Claude Code** | Full Support | `@developer`, `@quality-gate`, etc. |
| **Codex CLI**   | Full Support | `$snps` or `$sinapse-agent <id>`    |

---

### Q12: Can I configure SINAPSE for multiple IDEs?

**Answer:** Yes. Claude Code and Codex can use the same canonical SINAPSE
installation. Run `npx sinapse-ai install`; the installer generates the
provider-native adapters:

- Claude Code agents: `.claude/agents/`
- Codex agents: `.codex/agents/`
- Codex skills: `.agents/skills/`

Activate with `@developer` in Claude Code or `$sinapse-agent developer` in
Codex. Use `$snps` in Codex when you want the primary orchestrator to route the
request.

---

### Q13: How do I configure SINAPSE for a new team member?

**Answer:**

If `.sinapse-ai/` is committed to your repository:

```bash
# New team member just clones
git clone your-repo
cd your-repo

# Generate or reconcile the Claude Code and Codex adapters
npx sinapse-ai install
```

If `.sinapse-ai/` is not committed:

```bash
git clone your-repo
cd your-repo
npx sinapse-ai install
```

**Best practice:** Commit `.sinapse-ai/` to share consistent agent configurations.

---

## Agents & Workflows

### Q14: What agents are included?

**Answer:** SINAPSE includes **172 agents across 17 squads**. The squad layer
contains 160 members, and the framework layer contains 12. The framework set is:

| Agent | Persona | Role |
| ----- | ------- | ---- |
| `snps-orqx` | Imperator | Primary cross-squad orchestrator |
| `developer` | Pixel | Full-stack implementation and debugging |
| `quality-gate` | Litmus | Testing, review, and quality gates |
| `architect` | Stratum | System architecture and technology decisions |
| `project-lead` | Beacon | Product management and epics |
| `product-lead` | Axis | Story validation and prioritization |
| `sprint-lead` | Sync | Story creation and sprint facilitation |
| `analyst` | Scope | Research and business analysis |
| `data-engineer` | Tensor | Database design, migrations, and RLS |
| `ux-design-expert` | Mosaic | UX/UI and design systems |
| `devops` | Pipeline | CI/CD, exclusive push authority, and releases |
| `squad-creator` | Loom | Squad creation and extension |

In Claude Code, activate an agent with `@agent-id`. In Codex, use `$snps` for
routing or `$sinapse-agent agent-id` for direct activation. Both providers
resolve the same canonical agent and task sources.

---

### Q15: How do I create a custom agent?

**Answer:** Keep framework agents immutable and create extensions through the
squad workflow. In Claude Code, activate `@squad-creator`; in Codex, use
`$sinapse-agent squad-creator`. After the squad definition is validated, run
`npx sinapse-ai@latest install --reconfigure` to regenerate the selected provider
adapters from the canonical source.

---

### Q16: What is "yolo mode"?

**Answer:** Yolo mode is autonomous development mode where the agent:

- Implements story tasks without step-by-step confirmation
- Makes decisions autonomously based on story requirements
- Logs all decisions in `.ai/decision-log-{story-id}.md`
- Can be stopped at any time

**Enable yolo mode:** Activate `@developer` in Claude Code or
`$sinapse-agent developer` in Codex, then run:

```text
*develop-yolo docs/stories/your-story.md
```

**When to use:**

- For well-defined stories with clear acceptance criteria
- When you trust the agent's decision-making
- For repetitive tasks

**When NOT to use:**

- For complex architectural changes
- When requirements are ambiguous
- For production-critical code

---

## Squads

### Q17: What are Squads?

**Answer:** Starter squads are optional add-ons that extend SINAPSE capabilities:

| Pack           | Features                                                       |
| -------------- | -------------------------------------------------------------- |
| **squad-brand** | ClickUp integration, process automation, specialized workflows |

**Install an Squad:**

```bash
npx sinapse-ai install --Squads squad-brand
```

**List available packs:**

```bash
npx sinapse-ai install
```

---

### Q18: Can I create my own Squad?

**Answer:** Yes! Starter squads follow this structure:

```
my-expansion/
├── pack.yaml           # Pack manifest
├── README.md           # Documentation
├── agents/             # Custom agents
│   └── my-agent.md
├── tasks/              # Custom tasks
│   └── my-task.md
├── templates/          # Custom templates
│   └── my-template.yaml
└── workflows/          # Custom workflows
    └── my-workflow.yaml
```

**pack.yaml example:**

```yaml
name: my-expansion
version: 1.0.0
description: My custom Squad
dependencies:
  sinapse-ai: ">=1.0.0"
agents:
  - my-agent
tasks:
  - my-task
```

---

## Advanced Usage

### Q19: How do I integrate SINAPSE with CI/CD?

**Answer:**

**GitHub Actions example:**

```yaml
name: CI with SINAPSE
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npx sinapse-ai install --full --ide claude-code
      - run: npm test
```

**GitLab CI example:**

```yaml
test:
  image: node:18
  script:
    - npx sinapse-ai install --full
    - npm test
```

---

### Q20: How do I customize core-config.yaml?

**Answer:** The `core-config.yaml` file controls framework behavior:

```yaml
# Document sharding
prd:
  prdSharded: true
  prdShardedLocation: docs/prd

# Story location
devStoryLocation: docs/stories

# Files loaded by dev agent
devLoadAlwaysFiles:
  - docs/framework/coding-standards.md
  - docs/framework/tech-stack.md

# Git configuration
git:
  showConfigWarning: true
  cacheTimeSeconds: 300

# Project status in agent greetings
projectStatus:
  enabled: true
  showInGreeting: true
```

**After editing, restart your IDE to apply changes.**

---

### Q21: How do I contribute to SINAPSE?

**Answer:**

1. **Fork the repository:** https://github.com/caioimori/sinapse-ai

2. **Create a feature branch:**

   ```bash
   git checkout -b feature/my-feature
   ```

3. **Make changes following coding standards:**
   - Read `docs/framework/coding-standards.md`
   - Add tests for new features
   - Update documentation

4. **Submit a pull request:**
   - Describe your changes
   - Link to related issues
   - Wait for review

**Types of contributions welcome:**

- Bug fixes
- New agents
- Documentation improvements
- Starter squads
- IDE integrations

---

### Q22: Where can I get help?

**Answer:**

| Resource            | Link                                                       |
| ------------------- | ---------------------------------------------------------- |
| **Documentation**   | `docs/` in your project                                    |
| **Troubleshooting** | [troubleshooting.md](./troubleshooting.md)                 |
| **GitHub Issues**   | https://github.com/caioimori/sinapse-ai/issues |
| **Source Code**     | https://github.com/caioimori/sinapse-ai        |

**Before asking for help:**

1. Check this FAQ
2. Check the [Troubleshooting Guide](./troubleshooting.md)
3. Search existing GitHub issues
4. Include system info and error messages in your question

---

## Related Documentation

- [Troubleshooting Guide](./troubleshooting.md)
- [Coding Standards](../framework/coding-standards.md)
