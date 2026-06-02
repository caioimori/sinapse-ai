/**
 * core/errors/serializer.js — JSON-safe error serialization for SINAPSE.
 *
 * SINAPSE-branded serializer with one ADDITIVE, defensive hardening on stack exposure:
 * stacks are NEVER exposed when NODE_ENV === 'production' unless the caller
 * explicitly passes `includeStack: true`. This prevents leaking internal stack
 * traces to users in production (security: do not leak implementation detail).
 *
 * `sanitizeValue` lives in ./utils (cycle-safe via WeakSet). Here we inject the
 * local `serializeError` into it so nested Error values get the full typed
 * envelope. We re-export `sanitizeValue` so the module's public surface is
 * unchanged from the original (index barrel still exports it from here too).
 */

const { DEFAULT_ERROR_CODE } = require('./constants');
const { hasOwn, sanitizeValue: sanitizeValueBase } = require('./utils');

const STACK_TRUTHY_FLAGS = ['1', 'true', 'yes', 'on'];

function isProductionEnv() {
  return String(process.env.NODE_ENV || '').toLowerCase() === 'production';
}

/**
 * Decide whether an error stack may be included in serialized output.
 *
 * Precedence:
 *   1. options.includeStack === true  → always expose (explicit caller intent)
 *   2. options.includeStack === false → never expose
 *   3. NODE_ENV === 'production'       → NEVER expose (additive prod guard)
 *   4. otherwise → expose only if a debug flag is set
 *      (SINAPSE_DEBUG | DEBUG_ERROR_STACKS | DEBUG_STACKS)
 */
function shouldExposeErrorStack(options = {}) {
  if (options.includeStack === true) {
    return true;
  }

  if (options.includeStack === false) {
    return false;
  }

  // Additive defensive guard: in production, never auto-expose stacks.
  if (isProductionEnv()) {
    return false;
  }

  const stackFlag =
    process.env.SINAPSE_DEBUG ||
    process.env.DEBUG_ERROR_STACKS ||
    process.env.DEBUG_STACKS ||
    '';

  return STACK_TRUTHY_FLAGS.includes(String(stackFlag).toLowerCase());
}

function sanitizeValue(value, seen = new WeakSet(), options = {}) {
  // Inject serializeError so nested Error values produce the full envelope.
  return sanitizeValueBase(value, seen, options, serializeError);
}

function serializeError(error, options = {}, seen = new WeakSet()) {
  if (!(error instanceof Error)) {
    return sanitizeValue(error, seen, options);
  }

  if (seen.has(error)) {
    return '[Circular]';
  }

  seen.add(error);

  try {
    const serialized = {
      name: error.name || 'Error',
      message: error.message || '',
      stack: shouldExposeErrorStack(options) ? error.stack : '[redacted]',
    };

    if (error.code) {
      serialized.code = error.code;
    }

    if (error.isSinapseError || error.name === 'SinapseError') {
      serialized.code = error.code || DEFAULT_ERROR_CODE;
      serialized.category = error.category;
      serialized.severity = error.severity;
      serialized.retryable = Boolean(error.retryable);

      if (hasOwn(error, 'exitCode')) {
        serialized.exitCode = error.exitCode;
      }

      if (error.userMessage) {
        serialized.userMessage = error.userMessage;
      }

      if (Array.isArray(error.recovery)) {
        serialized.recovery = [...error.recovery];
      }

      serialized.metadata = sanitizeValue(error.metadata || {}, seen, options);
    }

    if (error.cause !== undefined) {
      serialized.cause = error.cause instanceof Error
        ? serializeError(error.cause, options, seen)
        : sanitizeValue(error.cause, seen, options);
    }

    for (const key of Object.getOwnPropertyNames(error)) {
      if ([
        'name',
        'message',
        'stack',
        'code',
        'category',
        'severity',
        'retryable',
        'exitCode',
        'metadata',
        'cause',
        'userMessage',
        'recovery',
        'isSinapseError',
      ].includes(key)) {
        continue;
      }

      try {
        serialized[key] = sanitizeValue(error[key], seen, options);
      } catch (serializationError) {
        serialized[key] = `[Unserializable: ${serializationError.message}]`;
      }
    }

    return serialized;
  } finally {
    seen.delete(error);
  }
}

module.exports = {
  shouldExposeErrorStack,
  sanitizeValue,
  serializeError,
};
