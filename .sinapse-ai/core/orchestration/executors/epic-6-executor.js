/**
 * Epic6Executor - QA Loop Executor
 *
 * Story: 0.3 - Epic Executors (AC5)
 * Epic: Epic 0 - ADE Master Orchestrator
 *
 * Wraps qa-loop-orchestrator to execute review → fix → re-review cycles
 * until quality standards are met.
 *
 * @module core/orchestration/executors/epic-6-executor
 * @version 1.0.0
 */

const fs = require('fs-extra');
const path = require('path');
const EpicExecutor = require('./epic-executor');

/**
 * QA verdict types
 */
const QAVerdict = {
  APPROVED: 'approved',
  NEEDS_REVISION: 'needs_revision',
  BLOCKED: 'blocked',
};

/**
 * Epic 6 Executor - QA Loop
 * Manages quality assurance review cycles
 */
class Epic6Executor extends EpicExecutor {
  constructor(orchestrator) {
    super(orchestrator, 6);
    this.maxIterations = 3;

    // Lazy-load QA orchestrator
    this._qaOrchestrator = null;
  }

  // NOTE: the previous `_getQAOrchestrator()` path was triple-broken theater —
  // it did `new` on the module object (not the QALoopOrchestrator class), passed
  // the wrong constructor shape, and called a `runReview()` method that doesn't
  // exist. It ALWAYS threw and silently fell back to basic checks while reporting
  // success:true. Replaced by a real @quality-gate agent invocation (_reviewViaAgent),
  // same proven path as epic-3 spec generation (epic: orchestration-consolidation).

  /**
   * Execute QA Loop
   * @param {Object} context - Execution context
   * @param {Object} context.buildResult - Result from Epic 4
   * @param {Array} context.testResults - Test results
   * @param {Array} context.codeChanges - Code changes to review
   * @returns {Promise<Object>} QA result with verdict
   */
  async execute(context) {
    this._startExecution();

    try {
      const { buildResult, testResults, codeChanges, storyId, techStack } = context;

      this._log(`Starting QA loop for ${storyId}`);

      let iteration = 0;
      let currentVerdict = QAVerdict.NEEDS_REVISION;
      const reviewHistory = [];

      while (iteration < this.maxIterations && currentVerdict === QAVerdict.NEEDS_REVISION) {
        iteration++;
        this._log(`QA iteration ${iteration}/${this.maxIterations}`);

        // Run review
        const reviewResult = await this._runReview({
          storyId,
          buildResult,
          testResults,
          codeChanges,
          iteration,
          techStack,
        });

        reviewHistory.push(reviewResult);

        // Check verdict
        currentVerdict = reviewResult.verdict;

        if (currentVerdict === QAVerdict.BLOCKED) {
          this._log('Review blocked - critical issues found', 'error');
          break;
        }

        if (currentVerdict === QAVerdict.NEEDS_REVISION && iteration < this.maxIterations) {
          this._log('Review needs revision, applying fixes...');
          // Record whether fixes were really applied (honesty invariant): a
          // stubbed fix must not look like a real one in the QA report.
          reviewResult.fixResult = await this._applyFixes(reviewResult.issues, context);
        }
      }

      // Generate QA report
      const reportPath = await this._generateReport(storyId, reviewHistory, currentVerdict);
      this._addArtifact('qa-report', reportPath);

      const passed = currentVerdict === QAVerdict.APPROVED;
      const anyRealReview = reviewHistory.some((r) => r.reviewSource === 'agent');

      const baseResult = {
        verdict: currentVerdict,
        passed,
        iterations: iteration,
        reviewHistory,
        reportPath,
      };

      // Honesty invariant (F0a/F7): a QA loop that only ran deterministic basic
      // checks did NOT really review the work — it must report STUB, not success.
      if (!anyRealReview) {
        return this._stubExecution(
          'QA ran deterministic basic checks only — no real review agent wired',
          baseResult,
        );
      }

      return this._completeExecution(baseResult);
    } catch (error) {
      return this._failExecution(error);
    }
  }

  /**
   * Run a single review cycle.
   *
   * Tries a REAL review via the @quality-gate agent (orchestrator.invokeAgent →
   * SubagentDispatcher → claude). Falls back to deterministic basic checks when
   * no executor is wired or real execution isn't allowed — and marks the source
   * (`agent` vs `basic-checks`) so the epic can report honestly.
   * @private
   */
  async _runReview(context) {
    const { iteration } = context;
    this._log(`Running review cycle ${iteration}`);

    const invokeAgent = this.orchestrator && this.orchestrator.invokeAgent;
    if (typeof invokeAgent === 'function' && this._realExecutionAllowed()) {
      try {
        const realReview = await this._reviewViaAgent(invokeAgent, context);
        if (realReview) return realReview;
      } catch (error) {
        this._log(`Real review failed, falling back to basic checks: ${error.message}`, 'warn');
      }
    }

    // Honest fallback: deterministic basic checks (clearly marked as a stub source).
    const issues = await this._performBasicChecks(context);

    let verdict = QAVerdict.APPROVED;
    const criticalIssues = issues.filter((i) => i.severity === 'critical');
    const majorIssues = issues.filter((i) => i.severity === 'major');
    if (criticalIssues.length > 0) {
      verdict = QAVerdict.BLOCKED;
    } else if (majorIssues.length > 0 || issues.length > 5) {
      verdict = QAVerdict.NEEDS_REVISION;
    }

    return {
      iteration,
      verdict,
      issues,
      reviewSource: 'basic-checks',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Perform a real QA review by invoking the @quality-gate agent.
   * @param {Function} invokeAgent - orchestrator.invokeAgent
   * @param {Object} context - review context
   * @returns {Promise<Object|null>} review result with verdict, or null when the
   *   agent produced nothing usable (caller falls back to basic checks).
   * @private
   */
  async _reviewViaAgent(invokeAgent, context) {
    const { storyId, iteration, codeChanges, testResults } = context;

    const description =
      `Perform a QA review for story "${storyId || 'unknown'}". ` +
      'Assess correctness, test coverage, and adherence to acceptance criteria. ' +
      `${Array.isArray(codeChanges) ? `${codeChanges.length} code change(s). ` : ''}` +
      `${Array.isArray(testResults) ? `${testResults.length} test result(s). ` : ''}` +
      'End your response with a single verdict line in the form: ' +
      'VERDICT: APPROVED | NEEDS_REVISION | BLOCKED.';

    const result = await invokeAgent(
      { name: 'quality-gate' },
      { id: `qa-review-${storyId || 'story'}-${iteration}`, type: 'review', description },
      { storyId, iteration },
    );

    const output = result && (result.output || result.content);
    if (!result || result.success === false || !output || output.trim().length === 0) {
      return null;
    }

    return {
      iteration,
      verdict: this._parseVerdict(output),
      issues: [],
      reviewSource: 'agent',
      raw: output,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Parse a QA verdict from free-form agent output. Defaults to NEEDS_REVISION
   * (the safe, non-approving default) when no explicit verdict is found.
   * @param {string} output
   * @returns {string} QAVerdict
   * @private
   */
  _parseVerdict(output) {
    const text = String(output).toUpperCase();
    const m = text.match(/VERDICT:\s*(APPROVED|NEEDS[_\s]?REVISION|BLOCKED)/);
    const token = (m ? m[1] : '').replace(/\s/g, '_');
    if (token === 'APPROVED') return QAVerdict.APPROVED;
    if (token === 'BLOCKED') return QAVerdict.BLOCKED;
    if (token === 'NEEDS_REVISION') return QAVerdict.NEEDS_REVISION;
    // No explicit verdict → don't fabricate approval.
    if (/\bBLOCKED\b/.test(text)) return QAVerdict.BLOCKED;
    if (/\bAPPROVED\b/.test(text)) return QAVerdict.APPROVED;
    return QAVerdict.NEEDS_REVISION;
  }

  /**
   * Perform basic quality checks
   * @private
   */
  async _performBasicChecks(_context) {
    const issues = [];

    // Check if tests exist
    const testsDir = this._getPath('tests');
    if (!(await fs.pathExists(testsDir))) {
      issues.push({
        type: 'missing_tests',
        severity: 'major',
        message: 'No tests directory found',
      });
    }

    // Check for lint errors (would run actual linter in full implementation)
    // For now, return stub
    this._log('Basic quality checks completed');

    return issues;
  }

  /**
   * Apply fixes for found issues by invoking the real @developer agent through
   * the orchestrator (orchestrator.invokeAgent → SubagentDispatcher → claude).
   *
   * epic: orchestration-consolidation — connects Epic 6 to the real executor,
   * same pattern as Epic 3. Falls back honestly (logs that no real fix ran) when
   * no executor is wired or real execution isn't allowed in this environment.
   *
   * @param {Array} issues - Issues found by the review
   * @param {Object} context - Execution context (storyId, techStack, ...)
   * @returns {Promise<Object>} { applied: boolean, fixed: number, stub: boolean }
   * @private
   */
  async _applyFixes(issues, context = {}) {
    this._log(`Applying fixes for ${issues.length} issues`);

    const invokeAgent = this.orchestrator && this.orchestrator.invokeAgent;
    const canRunReal = typeof invokeAgent === 'function' && this._realExecutionAllowed();

    if (!canRunReal || issues.length === 0) {
      // Honest fallback: do NOT claim fixes were applied.
      for (const issue of issues) {
        this._log(`Fix not applied (no real executor): ${issue.type} - ${issue.message}`, 'warn');
      }
      return { applied: false, fixed: 0, stub: true };
    }

    const issueList = issues
      .map((i, n) => `${n + 1}. [${i.severity || 'unknown'}] ${i.type}: ${i.message}`)
      .join('\n');

    const description =
      `Fix the following QA issues found during review of story "${context.storyId || 'unknown'}". ` +
      'Apply the minimal, correct change for each; preserve existing patterns and tests.\n\n' +
      `Issues:\n${issueList}`;

    try {
      const result = await invokeAgent(
        { name: 'developer' },
        { id: `qa-fix-${context.storyId || 'story'}`, type: 'bugfix', description },
        {
          storyId: context.storyId,
          techStack: context.techStack,
          issues: issues.map((i) => ({ type: i.type, severity: i.severity, message: i.message })),
        },
      );

      if (result && result.success !== false) {
        this._log(`Applied fixes via real agent (${issues.length} issues addressed)`);
        return {
          applied: true,
          fixed: issues.length,
          stub: false,
          filesModified: result.filesModified || [],
        };
      }
      this._log(`Fix agent returned no success: ${result && result.error}`, 'warn');
    } catch (err) {
      this._log(`Fix agent invocation failed: ${err.message}`, 'warn');
    }

    return { applied: false, fixed: 0, stub: true };
  }

  /**
   * Generate QA report
   * @private
   */
  async _generateReport(storyId, reviewHistory, finalVerdict) {
    const reportPath = this._getPath('.sinapse', 'qa-reports', `${storyId}-${Date.now()}.md`);

    const verdictEmoji = {
      [QAVerdict.APPROVED]: '✅',
      [QAVerdict.NEEDS_REVISION]: '⚠️',
      [QAVerdict.BLOCKED]: '❌',
    };

    let report = `# QA Report: ${storyId}

**Final Verdict:** ${verdictEmoji[finalVerdict]} ${finalVerdict.toUpperCase()}
**Iterations:** ${reviewHistory.length}
**Generated:** ${new Date().toISOString()}

---

## Review History

`;

    for (const review of reviewHistory) {
      report += `### Iteration ${review.iteration}

**Verdict:** ${verdictEmoji[review.verdict]} ${review.verdict}
**Time:** ${review.timestamp}
**Issues Found:** ${review.issues?.length || 0}

`;

      if (review.issues && review.issues.length > 0) {
        report += '**Issues:**\n\n';
        for (const issue of review.issues) {
          report += `- [${issue.severity}] ${issue.type}: ${issue.message}\n`;
        }
        report += '\n';
      }
    }

    report += `---
*Generated by Epic 6 QA Loop Executor*
`;

    await fs.ensureDir(path.dirname(reportPath));
    await fs.writeFile(reportPath, report);

    return reportPath;
  }
}

module.exports = Epic6Executor;
module.exports.QAVerdict = QAVerdict;

