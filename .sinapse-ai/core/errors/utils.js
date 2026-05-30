/**
 * core/errors/utils.js — pure helpers for the SINAPSE error module.
 *
 * Ported verbatim from AIOX-Core (.aiox-core/core/errors/utils.js); contains
 * no AIOX branding, so logic is unchanged. These helpers are shared by the
 * registry, the SinapseError class, and the serializer — keep them dependency
 * free so every other error file can require them safely.
 */

function isPlainObject(value) {
  if (value === null || typeof value !== 'object') {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function cloneMetadataValue(value, seen = new WeakSet()) {
  if (Array.isArray(value)) {
    if (seen.has(value)) {
      return '[Circular]';
    }

    seen.add(value);
    try {
      return value.map((entry) => cloneMetadataValue(entry, seen));
    } finally {
      seen.delete(value);
    }
  }

  if (isPlainObject(value)) {
    if (seen.has(value)) {
      return '[Circular]';
    }

    seen.add(value);
    try {
      return Object.keys(value).reduce((clone, key) => {
        clone[key] = cloneMetadataValue(value[key], seen);
        return clone;
      }, {});
    } finally {
      seen.delete(value);
    }
  }

  return value;
}

function deepMerge(...sources) {
  return sources.reduce((merged, source) => {
    if (!isPlainObject(source)) {
      return merged;
    }

    const sourceSeen = new WeakSet();
    sourceSeen.add(source);

    for (const key of Object.keys(source)) {
      const current = merged[key];
      const next = source[key];

      if (isPlainObject(current) && isPlainObject(next)) {
        merged[key] = deepMerge(current, next);
      } else {
        merged[key] = cloneMetadataValue(next, sourceSeen);
      }
    }

    return merged;
  }, {});
}

function normalizeErrorCode(code) {
  if (typeof code !== 'string') {
    return null;
  }

  const normalized = code.trim().toUpperCase();
  return normalized.length > 0 ? normalized : null;
}

function normalizeRecovery(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((entry) => typeof entry === 'string' && entry.trim().length > 0);
}

function hasOwn(value, key) {
  return Object.prototype.hasOwnProperty.call(value, key);
}

/**
 * sanitizeValue — turn an arbitrary value into something JSON-safe.
 *
 * Handles: bigint (→ string), function/symbol (→ String()), Date (→ ISO),
 * RegExp (→ string), Map/Set (→ arrays), circular references (via WeakSet,
 * → '[Circular]'), and nested plain objects/arrays. Never throws on a cycle.
 *
 * Note on Error values: when `serializeErrorFn` is supplied (the serializer
 * injects its own `serializeError`), Error instances are delegated to it so
 * the full typed envelope is produced. When called standalone (no injection),
 * Error instances fall through to plain-object enumeration — still cycle-safe.
 */
function sanitizeValue(value, seen = new WeakSet(), options = {}, serializeErrorFn = null) {
  if (value === undefined || value === null) {
    return value;
  }

  const valueType = typeof value;

  if (valueType === 'bigint') {
    return value.toString();
  }

  if (valueType === 'function' || valueType === 'symbol') {
    return String(value);
  }

  if (valueType !== 'object') {
    return value;
  }

  if (seen.has(value)) {
    return '[Circular]';
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? value.toString() : value.toISOString();
  }

  if (value instanceof RegExp) {
    return value.toString();
  }

  if (value instanceof Error && typeof serializeErrorFn === 'function') {
    return serializeErrorFn(value, options, seen);
  }

  seen.add(value);

  try {
    if (value instanceof Map) {
      return Array.from(value.entries()).map(([key, entryValue]) => [
        sanitizeValue(key, seen, options, serializeErrorFn),
        sanitizeValue(entryValue, seen, options, serializeErrorFn),
      ]);
    }

    if (value instanceof Set) {
      return Array.from(value.values()).map((entryValue) =>
        sanitizeValue(entryValue, seen, options, serializeErrorFn),
      );
    }

    if (Array.isArray(value)) {
      return value.map((entryValue) => sanitizeValue(entryValue, seen, options, serializeErrorFn));
    }

    return Object.keys(value).reduce((safeValue, key) => {
      try {
        safeValue[key] = sanitizeValue(value[key], seen, options, serializeErrorFn);
      } catch (error) {
        safeValue[key] = `[Unserializable: ${error.message}]`;
      }
      return safeValue;
    }, {});
  } catch (error) {
    return `[Unserializable: ${error.message}]`;
  } finally {
    seen.delete(value);
  }
}

module.exports = {
  isPlainObject,
  cloneMetadataValue,
  deepMerge,
  normalizeErrorCode,
  normalizeRecovery,
  hasOwn,
  sanitizeValue,
};
