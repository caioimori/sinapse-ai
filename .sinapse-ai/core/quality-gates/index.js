/**
 * Quality Gates Module — 3-Layer Quality System
 *
 * Unified entry point for the programmatic quality gate system.
 *
 * Layer 1: Precommit   — Local checks before commit (lint, typecheck, test, secret-scan, story-gate)
 * Layer 2: PR Auto     — Automated PR checks (CodeRabbit, coverage, story-validation, dependency-audit)
 * Layer 3: Human Review — Review orchestration (reviewer assignment, approval tracking, escalation)
 *
 * @module core/quality-gates
 * @version 2.0.0
 * @story 10.4 — Quality Gates Module
 */

const { QualityGateConfig } = require('./quality-gate-config');
const { ChecklistGenerator } = require('./checklist-generator');
const { FocusAreaRecommender } = require('./focus-area-recommender');
const { HumanReviewOrchestrator } = require('./human-review-orchestrator');
const { NotificationManager } = require('./notification-manager');
const { QualityGateManager } = require('./quality-gate-manager');

/**
 * QualityGates — Unified facade for the 3-layer quality system.
 *
 * Provides a simplified API that delegates to the underlying
 * QualityGateManager, ChecklistGenerator, FocusAreaRecommender,
 * HumanReviewOrchestrator, and NotificationManager.
 */
class QualityGates {
  /**
   * Create a new QualityGates instance
   * @param {Object} config - Inline configuration (merged with YAML defaults)
   */
  constructor(config = {}) {
    this.config = new QualityGateConfig(config);
    this.checklist = new ChecklistGenerator(this.config.get('layer3.checklist', {}));
    this.focusArea = new FocusAreaRecommender(this.config.get('focusAreas', {}));
    this.humanReview = new HumanReviewOrchestrator(this.config.get('humanReview', {}));
    this.notifications = new NotificationManager(this.config.get('notifications', {}));
    this.manager = new QualityGateManager(this.config.toPlainObject());
  }

  /**
   * Load from YAML config file and create instance
   * @param {string} [configPath] - Path to quality-gate-config.yaml
   * @returns {Promise<QualityGates>} Configured instance
   */
  static async load(configPath) {
    const config = await QualityGateConfig.loadFromFile(configPath);
    const instance = new QualityGates({});
    instance.config = config;
    instance.checklist = new ChecklistGenerator(config.get('layer3.checklist', {}));
    instance.focusArea = new FocusAreaRecommender(config.get('focusAreas', {}));
    instance.humanReview = new HumanReviewOrchestrator(config.get('humanReview', {}));
    instance.notifications = new NotificationManager(config.get('notifications', {}));
    instance.manager = new QualityGateManager(config.toPlainObject());
    return instance;
  }

  /**
   * Run a specific quality gate layer
   *
   * @param {number|string} layer - Layer identifier: 1|2|3 or 'precommit'|'pr'|'human'
   * @param {Object} [context={}] - Execution context (changedFiles, storyId, verbose, etc.)
   * @returns {Promise<Object>} Layer result with verdict, results array, and timestamp
   */
  async runLayer(layer, context = {}) {
    const layerNum = this._resolveLayerNumber(layer);
    const result = await this.manager.runLayer(layerNum, context);

    const verdict = this._calculateVerdict(result);

    if (this.config.get('notifications.enabled', false)) {
      await this.notifications.sendThroughChannels({
        id: this.notifications.generateNotificationId(),
        type: `layer${layerNum}_result`,
        template: verdict === 'PASS' ? 'approved' : 'blocked',
        timestamp: new Date().toISOString(),
        recipient: context.recipient || '@dev',
        subject: `Layer ${layerNum}: ${verdict}`,
        content: `Quality gate layer ${layerNum} completed with verdict: ${verdict}`,
        status: 'sent',
      });
    }

    return {
      layer: layerNum,
      verdict,
      results: result.results || [],
      duration: result.duration || 0,
      pass: result.pass,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Run the full 3-layer pipeline sequentially
   *
   * Layers execute in order with fail-fast on blocker failures:
   * Layer 1 → Layer 2 → Layer 3
   *
   * @param {Object} [context={}] - Execution context
   * @returns {Promise<Object>} Full pipeline result
   */
  async runAll(context = {}) {
    return await this.manager.orchestrate(context);
  }

  /**
   * Run the full 3-layer pipeline with human review orchestration
   *
   * Same as runAll but includes human review request generation,
   * focus area recommendations, and reviewer notification.
   *
   * @param {Object} [prContext={}] - PR/change context
   * @returns {Promise<Object>} Orchestration result with reviewRequest
   */
  async orchestrateReview(prContext = {}) {
    return await this.manager.orchestrateHumanReview(prContext);
  }

  /**
   * Generate a context-aware quality checklist
   *
   * Analyzes changed files to determine which checks are relevant:
   * - tests/ changed → full test suite
   * - .sinapse-ai/core/ changed → framework validation
   * - packages/ changed → dependency audit
   * - docs/ changed → spell check
   *
   * @param {Object} context - Generation context
   * @param {Array<string>} context.changedFiles - List of changed file paths
   * @param {string} [context.storyId] - Story identifier
   * @param {Array} [context.layers] - Previous layer results
   * @returns {Promise<Object>} Checklist with items, each having name, required, and layer
   */
  async generateChecklist(context = {}) {
    return await this.checklist.generate(context);
  }

  /**
   * Recommend focus areas for human review
   *
   * Prioritizes review based on:
   * - Files changed (core/ > docs/)
   * - Complexity of changes (large diffs get more attention)
   * - History (files with prior bugs / high churn get flagged)
   *
   * @param {Object} context - Recommendation context
   * @returns {Promise<Object>} Ranked focus areas with rationale
   */
  async recommendFocusAreas(context = {}) {
    return await this.focusArea.recommend(context);
  }

  /**
   * Complete a pending human review
   * @param {string} requestId - Review request ID
   * @param {Object} reviewResult - Review outcome (approved, comments, requestedChanges)
   * @returns {Promise<Object>} Completion result
   */
  async completeReview(requestId, reviewResult) {
    return await this.manager.completeHumanReview(requestId, reviewResult);
  }

  /**
   * Get pending human review requests
   * @returns {Promise<Array>} Pending review requests
   */
  async getPendingReviews() {
    return await this.manager.getPendingReviews();
  }

  /**
   * Get current quality gate status
   * @returns {Promise<Object>} Current pipeline status
   */
  async getStatus() {
    return await this.manager.getStatus();
  }

  /**
   * Calculate verdict from layer result
   * @param {Object} result - Layer execution result
   * @returns {string} Verdict: 'PASS' | 'FAIL' | 'CONCERNS'
   * @private
   */
  _calculateVerdict(result) {
    if (!result) return 'FAIL';

    const results = result.results || [];
    const hasBlockerFail = results.some(
      (r) => !r.pass && !r.skipped && (r.check === 'test' || r.check === 'typecheck' || r.check === 'lint'),
    );
    const hasWarningFail = results.some((r) => !r.pass && r.skipped !== true);
    const allPassed = result.pass === true;

    if (hasBlockerFail) return 'FAIL';
    if (allPassed) return 'PASS';
    if (hasWarningFail) return 'CONCERNS';
    return 'PASS';
  }

  /**
   * Resolve layer identifier to number
   * @param {number|string} layer - Layer identifier
   * @returns {number} Layer number (1, 2, or 3)
   * @private
   */
  _resolveLayerNumber(layer) {
    const aliases = {
      precommit: 1,
      'pre-commit': 1,
      pr: 2,
      'pr-auto': 2,
      human: 3,
      'human-review': 3,
    };

    if (typeof layer === 'string') {
      const num = aliases[layer.toLowerCase()];
      if (num) return num;
      const parsed = parseInt(layer, 10);
      if (parsed >= 1 && parsed <= 3) return parsed;
      throw new Error(`Unknown layer: "${layer}". Use 1|2|3 or precommit|pr|human.`);
    }

    if (typeof layer === 'number' && layer >= 1 && layer <= 3) {
      return layer;
    }

    throw new Error(`Invalid layer: ${layer}. Use 1, 2, or 3.`);
  }
}

module.exports = {
  QualityGates,
  QualityGateConfig,
  QualityGateManager,
  ChecklistGenerator,
  FocusAreaRecommender,
  HumanReviewOrchestrator,
  NotificationManager,
};
