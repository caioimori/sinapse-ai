/**
 * core/errors/index.js — barrel for the SINAPSE typed-error module.
 *
 * SINAPSE-branded barrel. This is the FOUNDATION module: downstream modules consume it via
 *   const { SinapseError, normalizeError, serializeError } = require('../errors');
 *
 * Public API exported here:
 *   - SinapseError              error class (code/category/severity/retryable/recovery/exitCode)
 *   - ErrorRegistry             registry class for custom error definition sets
 *   - ErrorCategory             frozen category enum
 *   - ErrorSeverity             frozen severity enum
 *   - DEFAULT_ERROR_CODE        'SNPS_UNKNOWN_ERROR'
 *   - CORE_ERROR_DEFINITIONS    frozen array of built-in SNPS_* definitions
 *   - defaultErrorRegistry      singleton registry (core definitions loaded)
 *   - isSinapseError(value)     duck-typed instanceof check
 *   - normalizeError(err, opts) envelope any thrown value into a SinapseError
 *   - serializeError(err, opts) JSON-safe envelope (stack redacted in prod)
 *   - sanitizeValue(value)      cycle-safe value sanitizer
 *   - shouldExposeErrorStack    stack-exposure policy predicate
 *   - deepMerge / isPlainObject / normalizeErrorCode  shared helpers
 */

const {
  ErrorCategory,
  ErrorSeverity,
  DEFAULT_ERROR_CODE,
  CORE_ERROR_DEFINITIONS,
} = require('./constants');
const { ErrorRegistry, defaultErrorRegistry } = require('./error-registry');
const { SinapseError, isSinapseError, normalizeError } = require('./sinapse-error');
const { shouldExposeErrorStack, sanitizeValue, serializeError } = require('./serializer');
const { deepMerge, isPlainObject, normalizeErrorCode } = require('./utils');

module.exports = {
  SinapseError,
  ErrorRegistry,
  ErrorCategory,
  ErrorSeverity,
  DEFAULT_ERROR_CODE,
  CORE_ERROR_DEFINITIONS,
  defaultErrorRegistry,
  isSinapseError,
  normalizeError,
  serializeError,
  sanitizeValue,
  shouldExposeErrorStack,
  deepMerge,
  isPlainObject,
  normalizeErrorCode,
};
