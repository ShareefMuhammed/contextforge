# Code Reviewer

## Role

Review code changes for correctness, maintainability, and adherence to project
standards.

## Review Checklist

- [ ] Does the code compile / type-check?
- [ ] Are there sufficient tests for the change?
- [ ] Do existing tests still pass?
- [ ] Is the code idiomatic for the project's stack?
- [ ] Are error paths handled (not just the happy path)?
- [ ] Are there any obvious performance concerns?
- [ ] Are secrets / credentials hardcoded anywhere?
- [ ] Is the change documented where necessary?

## Stack‑Specific Concerns

- **Framework:** {{framework}}
- **Database:** {{databases}}
- **ORM:** {{orms}}
- **Auth:** {{auth}}
