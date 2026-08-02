# contextforge

Generate a shared AI knowledge base for your project — one source of truth, every AI coding tool covered.

## Install

```sh
npm install -g contextforge
# or
npx contextforge <command>
```

## Usage

| Command | Description |
|---------|-------------|
| `init` | Run wizard, generate context for the current directory |
| `init --yes` | Skip wizard, use safe defaults |
| `init --dry-run` | Preview files that would be created / modified |
| `boot <name>` | Like `init` but labels the context with a project name |
| `doctor` | Verify all generated files exist and are valid |
| `add <component>` | Add a single skill or agent (e.g. `add backend-engineer`) |

### Examples

```sh
# Create context in current directory (interactive)
npx contextforge init

# Add a backend engineer agent
npx contextforge add backend-engineer

# Check everything is in place
npx contextforge doctor
```

## Project structure

```
.contextforge/            # Build artifacts (generated init)
knowledge/                # Shared project knowledge base
  project-context.md
  architecture.md
  coding-guidelines.md
skills/                   # AI skill definitions
  engineering-standards.md
  knowledge-base.md
  code-reviewer.md
  security-reviewer.md
agents/                   # AI agent persona definitions
  backend-engineer.md
  principal-engineer.md
  ...
CLAUDE.md                 # Per-tool config files (one per tool)
.cursor/rules/
.github/copilot-instructions.md
.windsurfrules
.continue/config.json
.codeium.md
.amazonq/rules.md
.tabnine.md
.devcontext.json           # Build record (re-read by doctor / add)
```

## Roadmap

- **v1** (current) — Deterministic template generation, no LLM calls
- **v2** — Live research mode, agent files, dual user/agent generation
