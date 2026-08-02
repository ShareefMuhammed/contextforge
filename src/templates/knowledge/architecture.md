# Architecture

## Tech Stack

- **Framework:** {{framework}}
- **Database:** {{databases}}
- **ORM:** {{orms}}
- **Authentication:** {{auth}}
- **Infrastructure:** {{infra}}
- **CI/CD:** {{ci}}
- **Docker:** {{docker}}

## High-Level Architecture

<!-- Describe your project's architecture here -->

### Key Architectural Decisions

<!-- Record notable ADRs here -->

### Data Flow

<!-- Document main data flow paths -->

### Deployment

{{#if ci}}
CI/CD is handled via {{ci}}.
{{/if}}

{{#if docker}}
The project is containerised with Docker.
{{/if}}
