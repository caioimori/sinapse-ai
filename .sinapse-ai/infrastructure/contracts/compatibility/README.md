# Compatibility Contracts

This directory stores the cross-IDE compatibility contracts read by
`.sinapse-ai/infrastructure/scripts/validate-parity.js`.

## Files

| File | Purpose | When to edit |
|------|---------|--------------|
| `sinapse-current.yaml` | Authoritative contract for the current release | Whenever the IDE matrix, required-checks, or expected statuses change |
| `sinapse-4.0.4.yaml` | Historical snapshot of the 4.0.4-era contract | Never (kept as a frozen reference for diffing) |

## Resolution Policy

The validator's `getDefaultContractPath()` always prefers `sinapse-current.yaml`
when it exists on disk. The legacy `sinapse-4.0.4.yaml` is read only as a
fallback for repositories that have not yet been migrated.

Story 10.18 introduced this split because pinning the validator to a single
versioned filename caused the contract to silently track a stale release for
five major versions (4.0.4 → 9.4.0 → v10.0.0 target).

## Updating the Contract

1. Edit `sinapse-current.yaml` in place.
2. Bump the `release` field to the new SINAPSE version label (e.g. `SINAPSE 10.1.0`).
3. Bump `updated_at` to today's date (ISO format).
4. Run `npm run validate:parity` to verify the new contract still passes.
5. If the change adds or removes a required check, run `npm test` to make
   sure no parity unit test is hard-coded to the old shape.

## Diffing Two Contracts

Use the validator's `--diff` flag to compare the current contract against
any historical snapshot:

```bash
npm run validate:parity -- --diff=.sinapse-ai/infrastructure/contracts/compatibility/sinapse-4.0.4.yaml
```

The diff output is shown both in the human-readable report and in `--json`
mode under `contractDiff`.
