# Archived Workflows

Files in this directory use the `.disabled` suffix and cannot be executed by
GitHub Actions. They are retained only for audit history.

| Workflow | Reason archived |
|---|---|
| `issue-labeler.yml.disabled` | Replaced by the active path labeler |
| `publish-pro.yml.disabled` | Removed private distribution path |
| `pro-integration.yml.disabled` | Repository has no active Pro submodule or credential |
| `release.yml.disabled` | Legacy tag-driven GitHub Release writer |
| `npm-publish.yml.disabled` | Legacy second npm publisher |

The canonical release path is documented in
[../README.md](../README.md). Re-enabling an archived publisher requires a
governance decision, threat review, and proof that only one workflow can write a
given package version or release tag.
