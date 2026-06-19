/**
 * Type declarations for the SINAPSE programmatic API (CommonJS + ESM entry points).
 *
 * The underlying modules are authored in JavaScript, so these declarations expose
 * the public constructors only — enough for `import { MetaAgent } from 'sinapse-ai'`
 * to resolve. Member signatures are intentionally permissive (the JS implementation
 * is the source of truth); this file does NOT fabricate detailed types it cannot
 * guarantee. The framework is CLI-first; the programmatic API is a secondary surface.
 */

/** A JS class/constructor exposed by the framework, with an unconstrained surface. */
type FrameworkConstructor = new (...args: unknown[]) => unknown;

export const MetaAgent: FrameworkConstructor;
export const TaskManager: FrameworkConstructor;
export const ElicitationEngine: FrameworkConstructor;
export const TemplateEngine: FrameworkConstructor;
export const ComponentSearch: FrameworkConstructor;
export const DependencyAnalyzer: FrameworkConstructor;
