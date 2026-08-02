# Engineering Standards

## Code Quality

- All code must pass lint and type checks before merging.
- Maintain a consistent style — use the project's formatter configuration.
- Avoid dead code, commented‑out blocks, and debugging artefacts in PRs.

## Code Review

- Every PR needs at least one approval.
- Reviewers should verify:
  - Correctness
  - Test coverage
  - Adherence to conventions
  - No security regressions

## Documentation

- Keep README and API docs up to date with code changes.
- Document non‑obvious decisions in ADRs or commit messages.

## Dependencies

- Prefer well‑maintained libraries with stable APIs.
- Regularly audit dependencies for vulnerabilities.
- Pin exact versions for reproducible builds.
