---
background: /bg-blue-bottom-right.jpeg
---

# Exercise 05: Building Custom Slash Commands


Build custom slash commands that automate repetitive workflow steps: spec generation, component implementation, and testing. This teaches command automation and the single responsibility principle.

## Success Criteria

- [ ] Define `/spec` command for specification generation
- [ ] Define `/implement` command for component generation
- [ ] Define `/verify` command for testing and verification
- [ ] Test all three commands with dashboard components

---
background: /bg-blue-bottom-right.jpeg
---

## Your Task

### Part 1: Spec Generation Command

**Create `/spec` command:**
```markdown
Create a /spec command that:
- Takes a component name as parameter (e.g., "CustomerCard")
- Checks for @requirements/[component-name].md file
- Generates a well-structured spec with Context, Requirements, Constraints, Acceptance Criteria
- Saves to @specs/[component-name]-spec.md
```

**Test it:**
```
/spec HealthIndicator
```

---
background: /bg-blue-bottom-right.jpeg
---

### Part 2: Implementation Command

**Create `/implement` command:**
```markdown
Create a /implement command that:
- Takes a spec file path as parameter (e.g., "@specs/customer-card-spec.md")
- Reads the specification file
- Generates component at components/[ComponentName].tsx
- Verifies output against acceptance criteria from spec
- Iteratively refines until criteria are met
```

**Test it:**
```
/implement @specs/health-indicator-spec.md
```

---
background: /bg-blue-bottom-right.jpeg
---

### Part 3: Verification Command

**Create `/verify` command:**
```markdown
Create a /verify command that:
- Takes a component file path as parameter (e.g., "components/CustomerCard.tsx")
- Checks TypeScript types are correct
- Verifies component renders with @data/mock-customers.ts
- Tests responsive design at different breakpoints
- Returns pass/fail summary with specific issues
```

**Test it:**
```
/verify components/HealthIndicator.tsx
```

---
background: /bg-blue-bottom-right.jpeg
---

## Expected Outcomes

- Three well-defined single-responsibility commands
- Understanding of focused command design
- Automated workflow from spec to verified component
- Experience with composable command patterns

---
background: /bg-blue-bottom-right.jpeg
---

## Command Definition Pattern

Each command should follow this structure:

```markdown
/[command-name] - [Single focused action]

Parameters: [parameter-name] (required type)

Behavior:
- [One primary responsibility]
- [Related validation/verification]
- [Output format]
```

**Key insight:** Commands that do one thing well can be composed into powerful workflows