/**
 * @fileoverview Claude Code Provider
 *
 * AI Provider implementation for Anthropic's Claude Code CLI.
 * Wraps the `claude` CLI command for prompt execution.
 *
 * @see Epic GEMINI-INT - Story 2: AI Provider Factory Pattern
 */

const { execSync } = require('child_process');
const { AIProvider } = require('./ai-provider');
// runSafe (cross-spawn): resolves claude.cmd on Windows and delivers the prompt
// via stdin/argv — same hardened spawn path used by the SubagentDispatcher.
const { runSafe } = require('../../../core/utils/spawn-safe');

/**
 * Claude Code provider implementation
 *
 * @class ClaudeProvider
 * @extends AIProvider
 */
class ClaudeProvider extends AIProvider {
  /**
   * Create a Claude provider
   * @param {Object} [config={}] - Provider configuration
   * @param {string} [config.model] - Model override; omitted → CLI default model
   * @param {number} [config.timeout=300000] - Execution timeout
   * @param {boolean} [config.dangerouslySkipPermissions=false] - Skip permission prompts
   */
  constructor(config = {}) {
    super({
      name: 'claude',
      command: 'claude',
      timeout: config.timeout || 300000,
      maxRetries: config.maxRetries || 3,
      options: {
        // No hardcoded model: stale IDs break the CLI. Only pass --model when
        // a caller explicitly configures one; otherwise use the CLI's default.
        model: config.model || null,
        dangerouslySkipPermissions: config.dangerouslySkipPermissions || false,
        ...config,
      },
    });
  }

  /**
   * Check if Claude CLI is available
   * @returns {Promise<boolean>} True if available
   */
  async checkAvailability() {
    try {
      const version = execSync('claude --version', {
        encoding: 'utf8',
        timeout: 5000,
        windowsHide: true,
      }).trim();

      this.isAvailable = true;
      this.version = version;
      return true;
    } catch (error) {
      this.isAvailable = false;
      this.lastError = error;
      return false;
    }
  }

  /**
   * Execute a prompt using Claude CLI
   * @param {string} prompt - The prompt to send
   * @param {Object} [options={}] - Execution options
   * @returns {Promise<AIResponse>} The AI response
   */
  async execute(prompt, options = {}) {
    const startTime = Date.now();
    const workingDir = options.workingDir || process.cwd();
    const timeout = options.timeout || this.timeout;

    // Build command arguments
    const args = ['--print'];

    if (this.options.dangerouslySkipPermissions || options.dangerouslySkipPermissions) {
      args.push('--dangerously-skip-permissions');
    }

    if (options.model || this.options.model) {
      args.push('--model', options.model || this.options.model);
    }

    // runSafe: argv-based spawn via cross-spawn (resolves claude.cmd on Windows),
    // prompt delivered through stdin — shell injection structurally impossible.
    const result = await runSafe(this.command, args, {
      cwd: workingDir,
      env: { ...process.env, ...options.env },
      timeout,
      input: prompt,
    });

    const duration = Date.now() - startTime;

    const stdout = (result.stdout || '').trim();
    const stderr = (result.stderr || '').trim();

    if (result.success) {
      return {
        success: true,
        output: stdout,
        metadata: {
          duration,
          provider: 'claude',
          model: options.model || this.options.model || 'cli-default',
        },
      };
    }

    if (result.signal) {
      throw new Error(
        `Claude killed by signal ${result.signal} (timeout ${timeout}ms?): ${stderr || stdout}`,
      );
    }

    // User-environment hooks (SessionEnd etc.) can fail AFTER the model already
    // printed its full response, poisoning the exit code. In --print mode a
    // non-empty stdout + hook-related stderr means the work was done — accept it
    // (with a warning) instead of discarding paid output and retrying.
    if (stdout.length > 0 && /hook/i.test(stderr)) {
      return {
        success: true,
        output: stdout,
        metadata: {
          duration,
          provider: 'claude',
          model: options.model || this.options.model || 'cli-default',
          warning: `non-zero exit (${result.code}) caused by environment hook failure: ${stderr.slice(0, 200)}`,
        },
      };
    }

    throw new Error(`Claude exited with code ${result.code}: ${stderr || stdout}`);
  }

  /**
   * Execute with JSON output parsing
   * @param {string} prompt - The prompt to send
   * @param {Object} [options={}] - Execution options
   * @returns {Promise<Object>} Parsed JSON response
   */
  async executeJson(prompt, options = {}) {
    const jsonPrompt = `${prompt}\n\nRespond with valid JSON only, no markdown or explanation.`;
    const response = await this.execute(jsonPrompt, options);

    try {
      // Try to extract JSON from response
      const jsonMatch = response.output.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (jsonMatch) {
        return {
          ...response,
          data: JSON.parse(jsonMatch[0]),
        };
      }
      throw new Error('No valid JSON found in response');
    } catch (parseError) {
      return {
        ...response,
        success: false,
        error: `JSON parse error: ${parseError.message}`,
      };
    }
  }
}

module.exports = { ClaudeProvider };

