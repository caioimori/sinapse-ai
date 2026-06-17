# Collaboration Activation Runbook

> When a second contributor (e.g. Matheus / `Matheus-soier`) starts pushing to
> this repo, the agent flips the repository from **solo mode** to **collab mode**.
> The user never runs these steps — the agent runs them on the first sign of a
> second contributor. Policy source: `.claude/rules/safe-collaboration.md`.

## Solo mode (default, today)

- Maintainer (Caio) branches → PR → self-merges (admin bypass). No required review.
- Branch protection on `main` may be off or advisory.

## Trigger to switch → collab mode

Any of:
- A push/PR appears from a non-maintainer account (`Matheus-soier`).
- The user says "vou trabalhar com o Matheus" (or names a collaborator).

## Collab-mode activation (agent runs, once)

1. **Require PR review on `main`** (1 approval), keep the maintainer's admin bypass so Caio can still merge own work:
   ```bash
   gh api -X PUT repos/{owner}/{repo}/branches/main/protection \
     -f required_pull_request_reviews.required_approving_review_count=1 \
     -F enforce_admins=false \
     -F required_status_checks.strict=true \
     -F restrictions=null
   ```
   (`enforce_admins=false` = maintainer admin bypass preserved; collaborator PRs still need the approval.)
2. **Reviewer assignment** (already in safe-collaboration.md): collaborator PR → auto-assign the maintainer as reviewer; maintainer PR → may self-merge.
3. **Branch prefixes** stay automatic: `caio/…` for the maintainer, `soier/…` for Matheus, `dev/…` fallback.
4. Confirm to the user in plain language: "Ativei revisão de mudanças — agora o que o Matheus enviar passa pela sua aprovação antes de entrar no principal."

## Revert to solo mode

If collaboration ends, the agent may relax the required review (set
`required_approving_review_count=0` or remove the protection rule), keeping the
secret/SQL/boundary git guards and CI checks active regardless of mode.

## Invariants (both modes)

- The commit-time **security guards** (secret-scan, destructive-SQL, framework
  boundary) and the **CI status checks** apply to everyone, always — collab mode
  only adds the human-review gate on top.
- The user never touches git directly; the agent handles branch/PR/merge.
