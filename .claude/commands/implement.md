---
argument-hint: ComponentName or spec-file-path (e.g., CustomerCard or specs/customer-card-spec.md)
---

# Component Implementation from Specification

Implement a React component based on its specification: **`$ARGUMENTS`**

## Task

You must implement a production-ready component following the specification exactly.

### Step 1: Parse the Argument

The argument `$ARGUMENTS` can be in two formats:

**Format 1: Component Name** (e.g., `CustomerCard`)
- Convert to spec file path: `specs/[kebab-case]-spec.md`
- Example: `CustomerCard` → `specs/customer-card-spec.md`

**Format 2: Spec File Path** (e.g., `specs/customer-card-spec.md`)
- Use the path directly
- Extract component name from filename

If `$ARGUMENTS` is empty, respond: "Please provide a component name or spec file path. Usage: `/implement CustomerCard`"

### Step 2: Read the Specification

Read the complete specification from the resolved file path.

The spec contains:
- **Context**: Purpose and integration points
- **Requirements**: Functional, UI, data, integration requirements
- **Constraints**: Tech stack, TypeScript interfaces, Tailwind classes, file structure
- **Acceptance Criteria**: Testable success criteria

### Step 3: Generate Component Implementation

Create a fully functional React component that implements ALL requirements from the spec.

#### Component Structure

```typescript
'use client'

import { Customer } from '@/data/mock-customers'

interface [ComponentName]Props {
  // Props from spec
}

export default function [ComponentName]({ /* props */ }: [ComponentName]Props) {
  // Implementation following spec requirements
}
```

#### Implementation Checklist

- [ ] Add `'use client'` directive at the top
- [ ] Import required types from spec (e.g., `Customer` from mock-customers)
- [ ] Define props interface exactly as specified
- [ ] Implement all functional requirements
- [ ] Apply exact Tailwind CSS classes from spec
- [ ] Handle all edge cases mentioned in spec
- [ ] Implement responsive design (mobile/tablet/desktop)
- [ ] Add hover/interactive states if specified
- [ ] Handle optional fields gracefully
- [ ] Follow TypeScript strict mode (no `any` types)

#### Styling Requirements

Use **only** Tailwind CSS classes as specified:
- Health score colors from spec (red/yellow/green ranges)
- Card styling (borders, shadows, rounded corners)
- Typography (font sizes, weights, colors)
- Spacing (padding, margins, gaps)
- Responsive breakpoints (md:, lg:)
- Interactive states (hover:, focus:)

#### Data Handling

- Use mock data from `src/data/` as specified
- Import the `Customer` interface or other data types
- Handle optional fields with safe defaults
- No hardcoded data (use props/imports)

### Step 4: Save the Component

Save to the exact location specified in the spec:
- Default: `src/components/[ComponentName].tsx`
- Use PascalCase for filename (e.g., `CustomerCard.tsx`)

### Step 5: Verify Against Acceptance Criteria

After implementation, check each acceptance criterion from the spec:

#### Core Functionality
- [ ] All required props are defined
- [ ] All functional requirements implemented
- [ ] Data displays correctly
- [ ] Conditional logic works (if any)

#### Edge Cases
- [ ] Handles undefined/null values
- [ ] Handles empty arrays
- [ ] Handles boundary values (e.g., health scores 0, 30, 31, 70, 71, 100)
- [ ] No runtime errors with minimal data

#### User Experience
- [ ] Visual hierarchy is clear
- [ ] Colors and styling match spec
- [ ] Responsive at all breakpoints
- [ ] Interactive states work (hover, click)
- [ ] Text is readable with good contrast

#### Technical
- [ ] TypeScript types are correct
- [ ] No `any` types used
- [ ] Imports are correct
- [ ] Component exports properly
- [ ] Uses `'use client'` directive
- [ ] Only Tailwind classes (no custom CSS)

### Step 6: Run Type Check

After generating the component, run:
```bash
npm run type-check
```

Report any TypeScript errors and fix them.

### Step 7: Provide Implementation Summary

Show:
- ✅ Specification read: `specs/[name]-spec.md`
- ✅ Component created: `src/components/[Name].tsx`
- ✅ TypeScript compilation: Pass/Fail
- 📋 Acceptance criteria checked: X/Y passed
- ⚠️ Any issues or warnings
- 🚀 Next steps: Test in browser or run `/verify`

## Implementation Best Practices

### Component Patterns

1. **Helper Functions**: Extract color logic, formatting logic into separate functions
```typescript
function getHealthScoreColor(score: number): string {
  if (score <= 30) return 'bg-red-100 text-red-600'
  if (score <= 70) return 'bg-yellow-100 text-yellow-600'
  return 'bg-green-100 text-green-600'
}
```

2. **Conditional Rendering**: Handle optional data cleanly
```typescript
{customer.domains && customer.domains.length > 0 && (
  <div className="text-xs text-gray-500">
    {/* Domain display logic */}
  </div>
)}
```

3. **Event Handlers**: Use optional props safely
```typescript
const handleClick = () => {
  onClick?.(customer.id)
}
```

### TypeScript Strictness

- Always import types: `import type { Customer } from '@/data/mock-customers'`
- Use proper interface definitions
- Avoid type assertions unless necessary
- Handle undefined/null with optional chaining

### Responsive Design

Use Tailwind breakpoints:
```typescript
<div className="w-full md:w-1/2 lg:w-1/3">
  {/* Content adapts to screen size */}
</div>
```

## Example Usage

```bash
# Implement from component name
/implement CustomerCard

# Implement from spec file path
/implement specs/customer-card-spec.md

# Implement domain health component
/implement DomainHealthIndicator
```

## Error Handling

If the spec file doesn't exist:
- Inform the user
- Suggest running `/spec [ComponentName]` first

If implementation has TypeScript errors:
- Show the errors
- Fix them automatically
- Re-run type-check

If acceptance criteria aren't met:
- List which criteria failed
- Explain what needs to be fixed
- Offer to revise implementation

## Important Notes

- **Follow the spec exactly** - don't add features not specified
- **Use only Tailwind CSS** - no custom CSS or inline styles
- **TypeScript strict mode** - must compile with no errors
- **Client component** - always include `'use client'`
- **Production-ready** - handle edge cases, proper error handling
- The component should work immediately when imported into the app
