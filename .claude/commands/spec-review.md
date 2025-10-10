---
argument-hint: ComponentName (e.g., CustomerCard, DomainHealthIndicator)
---

# Generate Specification from Requirements

You are tasked with generating a detailed specification document following the spec-driven development workflow.

**Component Name**: `$ARGUMENTS`

## Instructions

1. **Validate the component name argument**:
   - The component name is provided via `$ARGUMENTS`
   - If `$ARGUMENTS` is empty or not provided, stop and ask the user to provide a component name
   - Component name should be in PascalCase (e.g., "CustomerCard", "DomainHealthIndicator")
   - Extract the component name exactly as provided (e.g., if user passes "CustomerCard", use "CustomerCard")

2. **Read the requirements file** from `requirements/[component-name].md`:
   - Convert the component name from `$ARGUMENTS` to kebab-case for file lookup
     - Example: "CustomerCard" → "customer-card.md"
     - Example: "DomainHealthIndicator" → "domain-health-indicator.md"
   - Full path will be: `requirements/[kebab-case-name].md`
   - If the file doesn't exist, inform the user and ask them to create it first

3. **Read the spec template** from `templates/spec-template.md` to understand the required structure

4. **Generate a comprehensive specification** that includes:
   - **Context**: Purpose, system integration, users, and use cases
   - **Requirements**: Functional, UI, data, and integration requirements
   - **Constraints**: Tech stack (Next.js 15, React 19, TypeScript, Tailwind CSS 4.x), performance, design, file structure, TypeScript interfaces, security
   - **Acceptance Criteria**: Testable success criteria with checkboxes

5. **Save the specification** to `specs/[component-name]-spec.md`:
   - Convert the component name from `$ARGUMENTS` to kebab-case
   - Append `-spec.md` suffix
   - Examples:
     - "CustomerCard" → `specs/customer-card-spec.md`
     - "DomainHealthIndicator" → `specs/domain-health-indicator-spec.md`
   - Ensure all sections from the template are included

6. **Provide a summary** showing:
   - Requirements file read
   - Specification file created
   - Key requirements captured
   - Next steps (implementation)

## Key Requirements

- Use the exact structure from `templates/spec-template.md`
- Include complete TypeScript interface definitions in the Constraints section
- Reference mock data from `src/data/` directory
- Specify exact file paths (e.g., `src/components/ComponentName.tsx`)
- Include Tailwind CSS classes for styling constraints
- Add comprehensive acceptance criteria with checkboxes `- [ ]`
- Ensure specs are AI-ready for implementation

## Example Usage

```bash
# Generate spec for CustomerCard component
/spec-review CustomerCard
# $ARGUMENTS = "CustomerCard"
# Reads: requirements/customer-card.md
# Creates: specs/customer-card-spec.md

# Generate spec for multi-word component
/spec-review DomainHealthIndicator
# $ARGUMENTS = "DomainHealthIndicator"
# Reads: requirements/domain-health-indicator.md
# Creates: specs/domain-health-indicator-spec.md

# No argument provided
/spec-review
# $ARGUMENTS = "" (empty)
# Should ask user for component name
```

## Argument Validation

**Required**: Component name in PascalCase (e.g., CustomerCard, DomainHealthIndicator)

**Validation Checks**:
1. If `$ARGUMENTS` is empty, respond with: "Please provide a component name. Usage: `/spec-review ComponentName`"
2. If multiple words are provided, use the first word as the component name and warn about extra arguments
3. Component name should start with uppercase letter (PascalCase convention)

## Notes

- This workflow follows the spec-driven development philosophy: Requirements → Specification → Implementation
- The generated spec becomes the source of truth for implementation
- All components should be client components with `'use client'` directive
- Use only Tailwind CSS utility classes (no custom CSS)
- The `$ARGUMENTS` variable automatically captures all arguments passed to the slash command
