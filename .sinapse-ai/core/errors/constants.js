/**
 * core/errors/constants.js — SINAPSE typed error constants.
 *
 * Ported from AIOX-Core (.aiox-core/core/errors/constants.js) with branding:
 *   AIOX_* error codes → SNPS_* ; "AIOX" prose → "SINAPSE".
 *
 * ErrorCategory / ErrorSeverity are the closed enums consumed across the
 * framework. DEFAULT_ERROR_CODE is the fallback code used when a thrown value
 * carries no recognizable code.
 */

const ErrorCategory = Object.freeze({
  CONFIGURATION: 'configuration',
  VALIDATION: 'validation',
  FILESYSTEM: 'filesystem',
  NETWORK: 'network',
  REGISTRY: 'registry',
  ORCHESTRATION: 'orchestration',
  SYNAPSE: 'synapse',
  EXECUTION: 'execution',
  PERMISSION: 'permission',
  EXTERNAL_EXECUTOR: 'external_executor',
  UNKNOWN: 'unknown',
});

const ErrorSeverity = Object.freeze({
  CRITICAL: 'critical',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
});

const DEFAULT_ERROR_CODE = 'SNPS_UNKNOWN_ERROR';

const CORE_ERROR_DEFINITIONS = Object.freeze([
  {
    code: DEFAULT_ERROR_CODE,
    category: ErrorCategory.UNKNOWN,
    severity: ErrorSeverity.ERROR,
    retryable: false,
    userMessage: 'An unexpected SINAPSE core error occurred.',
    recovery: ['Review the error metadata and retry if the operation is safe to repeat.'],
  },
  {
    code: 'SNPS_CONFIGURATION_INVALID',
    category: ErrorCategory.CONFIGURATION,
    severity: ErrorSeverity.ERROR,
    retryable: false,
    userMessage: 'SINAPSE configuration is invalid.',
    recovery: ['Validate the active SINAPSE configuration and retry.'],
  },
  {
    code: 'SNPS_VALIDATION_FAILED',
    category: ErrorCategory.VALIDATION,
    severity: ErrorSeverity.ERROR,
    retryable: false,
    userMessage: 'SINAPSE validation failed.',
    recovery: ['Review validation errors and correct the invalid input.'],
  },
  {
    code: 'SNPS_FILESYSTEM_ERROR',
    category: ErrorCategory.FILESYSTEM,
    severity: ErrorSeverity.ERROR,
    retryable: true,
    userMessage: 'A filesystem operation failed.',
    recovery: ['Check path existence, permissions, and disk availability.'],
  },
  {
    code: 'SNPS_PERMISSION_DENIED',
    category: ErrorCategory.PERMISSION,
    severity: ErrorSeverity.ERROR,
    retryable: false,
    exitCode: 13,
    userMessage: 'The operation does not have the required permissions.',
    recovery: ['Grant the required permission or run the command in an authorized context.'],
  },
  {
    code: 'SNPS_NETWORK_ERROR',
    category: ErrorCategory.NETWORK,
    severity: ErrorSeverity.ERROR,
    retryable: true,
    userMessage: 'A network operation failed.',
    recovery: ['Check connectivity and retry the operation.'],
  },
  {
    code: 'SNPS_REGISTRY_LOAD_FAILED',
    category: ErrorCategory.REGISTRY,
    severity: ErrorSeverity.ERROR,
    retryable: false,
    userMessage: 'SINAPSE could not load a registry.',
    recovery: ['Validate registry file syntax and path configuration.'],
  },
  {
    code: 'SNPS_REGISTRY_WRITE_FAILED',
    category: ErrorCategory.REGISTRY,
    severity: ErrorSeverity.ERROR,
    retryable: true,
    userMessage: 'SINAPSE could not write a registry.',
    recovery: ['Check registry path permissions and retry.'],
  },
  {
    code: 'SNPS_ORCHESTRATION_FAILED',
    category: ErrorCategory.ORCHESTRATION,
    severity: ErrorSeverity.ERROR,
    retryable: false,
    userMessage: 'SINAPSE orchestration failed.',
    recovery: ['Review orchestration metadata and the active workflow state.'],
  },
  {
    code: 'SNPS_SYNAPSE_LAYER_FAILED',
    category: ErrorCategory.SYNAPSE,
    severity: ErrorSeverity.WARNING,
    retryable: true,
    userMessage: 'A Synapse layer failed while processing context.',
    recovery: ['Review layer metadata and continue with graceful degradation when possible.'],
  },
  {
    code: 'SNPS_EXECUTION_FAILED',
    category: ErrorCategory.EXECUTION,
    severity: ErrorSeverity.ERROR,
    retryable: false,
    userMessage: 'SINAPSE execution failed.',
    recovery: ['Review execution logs and retry after correcting the failure cause.'],
  },
  {
    code: 'SNPS_EXTERNAL_EXECUTOR_FAILED',
    category: ErrorCategory.EXTERNAL_EXECUTOR,
    severity: ErrorSeverity.ERROR,
    retryable: true,
    userMessage: 'An external executor failed.',
    recovery: ['Review external executor logs and retry if the command is idempotent.'],
  },
  {
    code: 'SNPS_PERSISTENCE_DEGRADED',
    category: ErrorCategory.FILESYSTEM,
    severity: ErrorSeverity.WARNING,
    retryable: true,
    userMessage: 'SINAPSE persistence degraded and continued in memory.',
    recovery: ['Check persistence path permissions and available disk space.'],
  },
]);

module.exports = {
  ErrorCategory,
  ErrorSeverity,
  DEFAULT_ERROR_CODE,
  CORE_ERROR_DEFINITIONS,
};
