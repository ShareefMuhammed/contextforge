# Coding Guidelines

## Language & Framework

- **Framework:** {{framework}}
- Follow the framework's recommended conventions and project structure.

## Code Style

- Use consistent formatting (Prettier / ESLint / Biome).
- Prefer explicit over implicit.
- Write self-documenting code; add comments only when the _why_ is non-obvious.
- Keep functions small and single-purpose.

## Naming Conventions

- **Files:** kebab-case for most files, PascalCase for components / classes.
- **Variables / functions:** camelCase.
- **Constants:** UPPER_SNAKE_CASE for true constants.
- **Types / interfaces:** PascalCase.

## Testing

- Write tests alongside implementation code.
- Aim for meaningful coverage, not 100 % for its own sake.
- Test behaviour, not implementation details.

## Error Handling

- Fail fast for programmer mistakes (assertions / invariants).
- Handle expected errors gracefully with user‑facing messages.
- Use typed errors or result types where the language supports it.

## Performance

- Avoid premature optimisation.
- Profile before and after any performance-sensitive change.
- Be mindful of bundle size and network payloads on the frontend.

## Security

{{#if securityStandards}}
Follow {{securityStandards}}.
{{/if}}
- Validate and sanitise all user input.
- Never log secrets, tokens, or PII.
- Keep dependencies up to date.
