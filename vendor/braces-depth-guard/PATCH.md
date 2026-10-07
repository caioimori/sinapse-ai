# Local MIT fork: bounded brace AST

This is a local fork of `braces@3.0.3` from the official npm tarball, retaining its MIT license, authors, original README and original package manifest. The fork identity `sinapse-vendor-braces@1.0.0` is independent of the upstream version. It is not an official upstream security release and is not published to npm.

Upstream provenance: https://registry.npmjs.org/braces/3.0.3 ; tarball integrity `sha512-yQbXgO/OSZVD2IsiLlro+7Hf6Q18EJrKSEsdoMzKePKXct3gvD8oLcOQdIzGupr5Fj+EDe8gO/lxc1BzfMpxvA==`.

Advisory https://github.com/advisories/GHSA-vfj7-8cjw-p6xm describes stack exhaustion from recursive AST walkers, with affected upstream versions through3.0.3 and no patched upstream version observed on2026-10-07.

Changes are limited to a parser nesting bound and an iterative guard before compile, expand and stringify. Parsed nesting must stay below128; AST depth is at most128, scheduled node frames at most131072, and cycles are rejected before recursive traversal. Child frames are reserved against the total scheduled budget before enqueueing, including siblings already pending and previously visited nodes. Exit bookkeeping is bounded by the active depth. These hard limits cannot be raised through caller options. Parent/prev links are not traversed, preserving the upstream AST representation. Reused acyclic nodes remain admitted within the same visit budget.

Inputs inside these limits retain upstream behavior. Excessively deep patterns now throw a controlled RangeError before AST walkers recurse; applications still need normal error handling. This patch does not certify every denial-of-service case, expansion budget, hostile accessor or future dependency path. Existing rangeLimit/maxLength behavior is retained. Audit absence is not proof of the fork's correctness; behavior probes and independent review are required.
