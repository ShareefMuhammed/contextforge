# Security Reviewer

## Role

Audit code for security vulnerabilities and ensure compliance with project
security standards.

## Security Checklist

- [ ] Input validation and sanitisation present on all user‑facing endpoints?
- [ ] Authentication checks on every protected route / operation?
- [ ] Authorisation confirms the caller has the right _permissions_, not just
      authentication?
- [ ] No secrets, tokens, or credentials in source code / logs?
- [ ] Dependencies checked for known CVEs?
- [ ] SQL / NoSQL injection vectors reviewed?
- [ ] CSRF protection in place for state‑changing operations?
- [ ] Rate limiting applied on sensitive endpoints?

## Standards

{{#if securityStandards}}
Compliance: {{securityStandards}}
{{/if}}

## Auth & Access

- **Auth solution:** {{auth}}
- Verify token validation, session handling, and permission models.
