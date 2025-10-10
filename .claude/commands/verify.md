---
argument-hint: ComponentName or component-file-path (e.g., CustomerCard or src/components/CustomerCard.tsx)
---

# Component Verification

Verify component implementation against specification: **`$ARGUMENTS`**

## Task

You must thoroughly verify that a component implementation meets all specification requirements.

### Step 1: Parse the Argument

The argument `$ARGUMENTS` can be in two formats:

**Format 1: Component Name** (e.g., `CustomerCard`)
- Resolve to component path: `src/components/[ComponentName].tsx`
- Resolve to spec path: `specs/[kebab-case]-spec.md`
- Example: `CustomerCard` → `src/components/CustomerCard.tsx` + `specs/customer-card-spec.md`

**Format 2: Component File Path** (e.g., `src/components/CustomerCard.tsx`)
- Use the path directly
- Derive spec path from component name
- Example: `src/components/CustomerCard.tsx` → `specs/customer-card-spec.md`

If `$ARGUMENTS` is empty, respond: "Please provide a component name or file path. Usage: `/verify CustomerCard`"

### Step 2: Read Files

Read both files:
1. **Component implementation**: `src/components/[Name].tsx`
2. **Specification**: `specs/[name]-spec.md`

If either file is missing:
- Report which file is missing
- For missing component: suggest running `/implement [ComponentName]`
- For missing spec: suggest running `/spec [ComponentName]`

### Step 3: TypeScript Type Checking

Run TypeScript compilation check:
```bash
npm run type-check
```

**Check for**:
- [ ] No TypeScript errors
- [ ] No `any` types used
- [ ] Props interface properly defined
- [ ] All imports resolve correctly
- [ ] Strict mode compliance

Report any TypeScript errors with file:line references.

### Step 4: ESLint Verification

Run ESLint check:
```bash
npm run lint
```

**Check for**:
- [ ] No ESLint errors
- [ ] No ESLint warnings (report but don't fail)
- [ ] Follows React best practices
- [ ] No unused variables
- [ ] Proper hook usage

### Step 5: Code Structure Verification

Analyze the component code:

#### Required Elements
- [ ] `'use client'` directive at top of file
- [ ] Props interface defined with correct name (e.g., `CustomerCardProps`)
- [ ] Component exported as default
- [ ] Component function matches spec name
- [ ] All required imports present

#### TypeScript Interface Check
Compare props interface against spec:
- [ ] All required props defined
- [ ] Optional props marked with `?`
- [ ] Type definitions match spec
- [ ] Imported types used correctly (e.g., `Customer` from mock data)

#### Implementation Check
- [ ] All functional requirements implemented
- [ ] Conditional logic for optional fields
- [ ] Event handlers implemented if specified
- [ ] Helper functions for complex logic (e.g., color calculations)

### Step 6: Styling Verification

Check Tailwind CSS usage:

#### Tailwind Classes
- [ ] Uses only Tailwind utility classes (no custom CSS)
- [ ] Health score colors match spec ranges:
  - Red (0-30): `bg-red-100 text-red-600`
  - Yellow (31-70): `bg-yellow-100 text-yellow-600`
  - Green (71-100): `bg-green-100 text-green-600`
- [ ] Card styling matches spec (borders, shadows, rounded)
- [ ] Typography classes match spec (sizes, weights, colors)
- [ ] Spacing matches spec (padding, margins)

#### Responsive Design
- [ ] Mobile breakpoint handling (320px+)
- [ ] Tablet breakpoint with `md:` classes (768px+)
- [ ] Desktop breakpoint with `lg:` classes (1024px+)

#### Interactive States
- [ ] Hover states implemented if specified
- [ ] Cursor styles appropriate (e.g., `cursor-pointer`)
- [ ] Transitions for smooth interactions

### Step 7: Data Handling Verification

Check how component handles data:

#### Mock Data Integration
- [ ] Imports from correct mock data file
- [ ] Uses proper type interfaces
- [ ] Accesses data fields correctly (e.g., `customer.name`, `customer.healthScore`)

#### Edge Case Handling
Test with different data scenarios:

**Test Case 1: Minimal Data**
```typescript
{ id: '1', name: 'Test', company: 'Test Co', healthScore: 50 }
```
- [ ] Component renders without errors
- [ ] No undefined/null errors
- [ ] Optional sections don't break

**Test Case 2: Maximum Data**
```typescript
{
  id: '1',
  name: 'Test User',
  company: 'Test Company',
  healthScore: 85,
  domains: ['example.com', 'test.com', 'demo.com'],
  email: 'test@example.com',
  subscriptionTier: 'enterprise'
}
```
- [ ] All data displays correctly
- [ ] Domain count shows properly
- [ ] No overflow issues

**Test Case 3: Boundary Values**
- [ ] Health score 0 shows red
- [ ] Health score 30 shows red
- [ ] Health score 31 shows yellow
- [ ] Health score 70 shows yellow
- [ ] Health score 71 shows green
- [ ] Health score 100 shows green

**Test Case 4: Empty/Null Values**
- [ ] Undefined domains array handled
- [ ] Empty domains array handled
- [ ] Component doesn't crash

### Step 8: Acceptance Criteria Verification

Go through each acceptance criterion from the spec:

#### Core Functionality
For each criterion in the spec's "Core Functionality" section:
- [ ] Verify implementation
- [ ] Mark as ✅ Pass or ❌ Fail
- [ ] Note any issues

#### Edge Cases
For each criterion in the spec's "Edge Cases" section:
- [ ] Test the scenario
- [ ] Mark as ✅ Pass or ❌ Fail
- [ ] Document failures

#### User Experience
For each criterion in the spec's "User Experience" section:
- [ ] Verify visual hierarchy
- [ ] Check responsive behavior
- [ ] Validate styling
- [ ] Mark as ✅ Pass or ❌ Fail

#### Integration & Technical
For each criterion in the spec's "Integration" section:
- [ ] Verify imports
- [ ] Check exports
- [ ] Validate TypeScript compilation
- [ ] Mark as ✅ Pass or ❌ Fail

### Step 9: Generate Verification Report

Provide a comprehensive pass/fail summary:

```
## Verification Report: [ComponentName]

### TypeScript Compilation
✅ PASS - No type errors
⏱️  Compilation time: 2.3s

### ESLint
✅ PASS - No errors
⚠️  1 warning (unused import)

### Code Structure
✅ PASS - All required elements present
- ✅ 'use client' directive
- ✅ Props interface defined
- ✅ Default export
- ✅ All imports present

### Styling
✅ PASS - Tailwind classes correct
- ✅ Health score colors (3/3)
- ✅ Responsive breakpoints (3/3)
- ✅ Interactive states

### Data Handling
✅ PASS - All test cases passed
- ✅ Minimal data (no errors)
- ✅ Maximum data (displays correctly)
- ✅ Boundary values (correct colors)
- ✅ Empty/null values (handled gracefully)

### Acceptance Criteria
✅ PASS - 28/29 criteria met (96%)
- ✅ Core Functionality: 7/7
- ✅ Edge Cases: 8/8
- ✅ User Experience: 7/7
- ⚠️  Integration: 6/7 (1 minor issue)

### Issues Found
1. ⚠️ Unused import on line 3: `import type { Customer }`
   Fix: Remove or use the import

### Overall Status
✅ VERIFIED - Component meets specification requirements

### Recommendations
- Remove unused import
- Consider adding aria-label for accessibility
- Component is production-ready
```

### Step 10: Provide Next Steps

Based on verification results:

**If PASS**:
- Component is ready for use
- Can be imported into dashboard
- Suggest testing in browser: `npm run dev`

**If FAIL**:
- List all failures with line numbers
- Suggest fixes for each issue
- Offer to re-implement failed sections
- Recommend running `/implement` again

## Verification Levels

### Level 1: Basic (Always Run)
- TypeScript compilation
- ESLint checks
- File structure
- Required elements present

### Level 2: Standard (Default)
- All Level 1 checks
- Styling verification
- Basic data handling
- Core acceptance criteria

### Level 3: Comprehensive (Thorough)
- All Level 1 & 2 checks
- All edge cases tested
- Full acceptance criteria checklist
- Performance considerations
- Accessibility checks

## Example Usage

```bash
# Verify by component name
/verify CustomerCard

# Verify by file path
/verify src/components/CustomerCard.tsx

# Verify domain health component
/verify DomainHealthIndicator
```

## Error Handling

### Component File Not Found
```
❌ Component not found: src/components/CustomerCard.tsx

Suggestion: Run `/implement CustomerCard` to generate the component.
```

### Spec File Not Found
```
⚠️ Specification not found: specs/customer-card-spec.md

Verification will proceed with basic checks only.
Suggestion: Run `/spec CustomerCard` to generate the specification.
```

### TypeScript Errors
```
❌ TypeScript compilation failed

Errors found:
- src/components/CustomerCard.tsx:15:23 - Type 'undefined' is not assignable to type 'string'
- src/components/CustomerCard.tsx:22:10 - Property 'domains' does not exist on type 'Customer'

Fix these errors and run `/verify CustomerCard` again.
```

## Important Notes

- Verification checks implementation against the specification
- TypeScript and ESLint must pass for VERIFIED status
- Edge cases are critical for production readiness
- Styling must exactly match spec (colors, spacing, responsive)
- Component should work with mock data immediately
- Use this before committing or moving to next exercise
