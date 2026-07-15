# Epic: Engineering Applicability Engine

**Status:** Proposed
**Type:** Framework capability
**Authority:** Project Lead + Architect + Quality Gate
**Source corpus:** Engenharia de Software, 60 domains, 275 canonical workflows and 1,617 knowledge cards

## 1. Objective

Create a canonical, deterministic and provider-neutral engine that determines which engineering workflows and gates apply to a project or change, explains every decision, and records evidence that the selected obligations were fulfilled.

The engine must turn the engineering corpus into an applicability policy. It must not attempt to execute all 275 workflows or embed provider behavior in domain rules. Claude Code and Codex consume the same decision package through thin adapters.

## 2. Problem

SINAPSE currently has strong constitutional rules, agent guidance and several documented workflows, but applicability is distributed across prompts, handlers, YAML files and human interpretation. A workflow may be documented without being selected, enforced or evidenced. Provider-specific integrations can therefore expose different behavior even when they share canonical sources.

## 3. Non-goals

- Convert all 275 research workflows into executable automation.
- Replace canonical tasks, agents, workflows or the Constitution.
- Build a new agent runtime, model router or autonomous multi-agent engine.
- Let an LLM decide mandatory gates without deterministic validation.
- Copy the full research corpus into runtime context.
- Perform push, deploy, destructive data operations or other irreversible actions.

## 4. Operating Principles

1. **Policy before orchestration:** applicability is computed before agents or workflows run.
2. **Least autonomy:** deterministic checks win over workflows; workflows win over agents when both can satisfy the requirement.
3. **Fail closed on mandatory policy:** unknown schema, missing source or unresolved mandatory conflict blocks the decision package.
4. **Explainability:** every selected, skipped or excluded obligation has a source and reason code.
5. **Provider neutrality:** the core accepts and emits versioned JSON; adapters only translate events and render results.
6. **Bounded execution:** every retrying obligation declares a maximum iteration count or timeout.
7. **Human authority:** irreversible actions always end in an explicit human checkpoint.

## 5. Architecture

```text
Project Signals + Change Signals + Risk Profile
                       |
                       v
              Applicability Normalizer
                       |
        Canonical Policy Registry <--- Corpus Manifest
                       |
                       v
             Deterministic Rule Evaluator
                       |
             Conflict / Exclusion Resolver
                       |
                       v
                Applicability Plan
              /           |           \
     Claude Adapter   Codex Adapter   CLI/CI Adapter
              \           |           /
                       v
                  Evidence Ledger
                       |
                 Quality Gate Result
```

### 5.1 Canonical core

The core owns normalization, policy evaluation, conflict resolution, plan generation, evidence validation and drift checks. It has no dependency on Claude Code, Codex, prompts or model output.

### 5.2 Provider adapters

Adapters may:

- map provider events into canonical project/change signals;
- present the applicability plan to agents and humans;
- submit evidence references produced by tools;
- translate a canonical block, warning or checkpoint into provider-native output.

Adapters may not alter severity, suppress mandatory obligations, select workflows independently or mark evidence as verified.

### 5.3 Registries

- **Corpus manifest:** immutable identity, version, checksum and source URI for domains, workflows and cards.
- **Policy registry:** applicability rules maintained with the framework and linked to corpus IDs.
- **Capability registry:** declares which obligations are documentation-only, deterministic, workflow-assisted or agent-assisted.
- **Adapter registry:** declares supported contract versions and provider event mappings.

## 6. Canonical Contracts

All contracts use JSON Schema, semantic versions and stable IDs. Illustrative fields below define the minimum surface, not final storage paths.

### 6.1 Applicability input

```json
{
  "schemaVersion": "1.0.0",
  "project": {
    "type": "greenfield|brownfield",
    "surfaces": ["frontend", "api", "database"],
    "stack": ["typescript", "postgresql"],
    "dataClasses": ["personal"],
    "deploymentTargets": ["cloud"]
  },
  "change": {
    "kind": "feature|fix|migration|release|infrastructure",
    "paths": [],
    "storyRef": "Story 2.1",
    "reversibility": "reversible|conditional|irreversible"
  },
  "risk": {
    "security": "low|medium|high|critical",
    "availability": "low|medium|high|critical",
    "privacy": "low|medium|high|critical"
  }
}
```

### 6.2 Policy rule

```json
{
  "id": "policy.secure-sdlc.threat-model",
  "version": "1.0.0",
  "sourceRefs": ["domain:29", "workflow:<canonical-id>"],
  "when": { "any": ["risk.security>=high", "dataClasses contains personal"] },
  "obligation": "threat-model",
  "severity": "mandatory",
  "implementationMode": "deterministic|workflow|agent|human",
  "requires": [],
  "excludes": [],
  "maxIterations": 2,
  "timeoutSeconds": 900,
  "evidenceContract": "evidence.threat-model@1"
}
```

### 6.3 Applicability plan

```json
{
  "decisionId": "ap_<stable-id>",
  "inputDigest": "sha256:<digest>",
  "corpusVersion": "<version>",
  "policyVersion": "<version>",
  "selected": [{ "obligationId": "threat-model", "reasonCodes": ["SECURITY_HIGH"] }],
  "excluded": [{ "obligationId": "mobile-accessibility", "reasonCodes": ["SURFACE_ABSENT"] }],
  "conflicts": [],
  "humanCheckpoints": [],
  "decisionDigest": "sha256:<digest>"
}
```

### 6.4 Evidence ledger

The ledger is append-only. An adapter submits a claim; a deterministic verifier records its verdict as a separate event.

```json
{
  "eventId": "ev_<stable-id>",
  "decisionId": "ap_<stable-id>",
  "obligationId": "threat-model",
  "eventType": "claimed|verified|rejected|waived",
  "artifact": { "uri": "repo://docs/...", "digest": "sha256:<digest>" },
  "producer": { "type": "tool|agent|human", "id": "quality-gate" },
  "verifier": { "type": "deterministic", "contract": "evidence.threat-model@1" },
  "timestamp": "<ISO-8601>",
  "previousEventDigest": "sha256:<digest>"
}
```

A waiver requires human identity, reason, expiry and explicit policy permission. Mandatory non-waivable obligations cannot be bypassed by adapters.

## 7. Selection Algorithm

1. Validate input against the supported schema version.
2. Normalize stack, project, change and risk signals into canonical enums.
3. Load a checksum-verified corpus manifest and policy registry.
4. Evaluate `when` expressions using a restricted deterministic DSL.
5. Expand dependencies and remove valid exclusions.
6. Resolve conflicts by constitutional precedence, then severity, then explicit policy priority. Ties block.
7. Choose the lowest-autonomy available implementation mode that satisfies the evidence contract.
8. Attach retry limits, timeouts and required human checkpoints.
9. Emit selected and excluded obligations with reason codes and stable digests.
10. Require verified ledger evidence before a mandatory obligation can pass.

LLM output may propose missing signals, but it cannot mutate the normalized input or final decision without schema validation and an attributable human/tool action.

## 8. Drift Detection

Drift checks run during framework validation and release preparation:

- corpus manifest checksum differs from the pinned source;
- policy references an absent domain, workflow, card or evidence contract;
- provider adapters support different canonical contract versions;
- a canonical mandatory policy has no available capability;
- generated provider views differ semantically from the canonical plan;
- documented counts or versions differ from measured sources.

Corpus updates produce a machine-readable diff: added, changed and removed IDs plus impacted policies. Removed or meaningfully changed mandatory sources require architecture, domain-owner and quality-gate review. Network unavailability never silently upgrades the pinned corpus.

## 9. Rollout and Migration

### Phase 0: Contract baseline

Version the manifest and schemas, define reason codes, and build fixtures from existing greenfield, brownfield, SDC, QA and release cases. No runtime enforcement.

### Phase 1: Advisory shadow mode

Run selection in CI and both providers without blocking. Compare decisions against current manual behavior and record false positives, false negatives and unknown signals.

### Phase 2: Priority workflows

Enable evidence collection for the highest-value paths: brownfield discovery, greenfield discovery, story development, QA/eval and release. Existing workflow files remain canonical task sources; the engine only selects and verifies obligations.

### Phase 3: Graduated enforcement

Promote calibrated rules from advisory to mandatory by risk tier. Security, destructive actions, story readiness and release authority are promoted first. Every promotion has rollback configuration and an owner.

### Phase 4: Provider parity

Make Claude Code, Codex and CLI/CI adapter contract tests blocking. Deprecate provider-local applicability logic only after two releases with equivalent decision digests.

Existing projects start in advisory mode, generate a baseline profile and explicitly accept enforcement. New projects may adopt the current default profile at initialization. Migration never rewrites project artifacts or marks historical obligations as verified.

## 10. Quality Strategy

- JSON Schema tests for every contract and migration.
- Table-driven policy tests for positive, negative, boundary and conflict cases.
- Golden decision fixtures shared by all adapters.
- Metamorphic tests: irrelevant signals cannot change a decision; higher risk cannot reduce mandatory obligations.
- Evidence verifier tests for missing, stale, forged and digest-mismatched artifacts.
- Corpus and adapter drift tests in release readiness.
- Behavioral evaluation for ambiguous signal proposals, always downstream of deterministic gates.
- Performance budget for local evaluation and a zero-network deterministic test mode.
- Security review of DSL parsing, path handling, evidence URIs and waiver authority.

## 11. Deliverables

1. Versioned canonical schemas and reason-code catalog.
2. Corpus, policy, capability and adapter registries.
3. Deterministic evaluator and conflict resolver.
4. Append-only evidence ledger and evidence verifiers.
5. Drift detector and impact report.
6. Claude Code, Codex and CLI/CI adapters with parity fixtures.
7. Advisory-mode reports and migration guide.
8. Calibrated policy pack for the five priority workflow families.

## 12. Definition of Done

- The same fixture produces the same decision digest in core, Claude Code, Codex and CLI/CI.
- Every selected and excluded obligation has valid source references and reason codes.
- All mandatory obligations declare evidence, retry/timeout behavior and human checkpoints where applicable.
- Missing sources, schema errors and unresolved mandatory conflicts fail closed.
- The evidence ledger detects mutation, stale artifacts and unauthorized waivers.
- Drift detection reports corpus, policy, capability and adapter incompatibilities before release.
- Priority workflow fixtures cover greenfield, brownfield, SDC, QA/eval and release across low and high-risk cases.
- Advisory-mode calibration has documented precision targets and no unresolved critical false negatives.
- Provider parity, schema, policy, security and migration tests pass in CI.
- Documentation states accurately that SINAPSE enforces a versioned applicable subset of the corpus, not all 275 workflows universally.
- Architecture, domain owner, Quality Gate and DevOps approve enforcement activation through the normal branch and PR process.

## 13. Key Decisions Required

- Ownership and release cadence of the corpus manifest.
- Restricted DSL format and evaluator implementation.
- Persistence location and retention policy for project evidence ledgers.
- Initial precision thresholds for promotion from advisory to mandatory.
- Which obligations are non-waivable under the Constitution.
