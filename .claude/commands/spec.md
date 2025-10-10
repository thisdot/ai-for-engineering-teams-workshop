---
argument-hint: ComponentName (e.g., CustomerCard, DomainHealthIndicator)
---

# Generate Specification from Requirements

Generate a detailed specification document for the component: **`$ARGUMENTS`**

## Task

You must generate a comprehensive specification following the spec-driven development workflow.

### Step 1: Validate Component Name

- Component name from arguments: `$ARGUMENTS`
- If `$ARGUMENTS` is empty, respond: "Please provide a component name. Usage: `/spec ComponentName`"
- Convert to kebab-case for file operations

### Step 2: Read Requirements File

Read the requirements from: `requirements/[kebab-case-name].md`

**Example conversions**:
- `CustomerCard` → `requirements/customer-card.md`
- `DomainHealthIndicator` → `requirements/domain-health-indicator.md`

If the file doesn't exist, inform the user and stop.

### Step 3: Read Spec Template

Read the template structure from: `templates/spec-template.md`

This provides the required sections and format.

### Step 4: Generate Comprehensive Specification

Create a detailed spec with these sections:

#### Context
- Purpose and role in the application
- How it fits into the larger system
- Who will use it and when
- Usage scenarios

#### Requirements
- **Functional requirements**: What the component must do
- **User interface requirements**: Visual design and interaction
- **Data requirements**: Data sources, interfaces, mock data usage
- **Integration requirements**: How it connects with other components

#### Constraints
- **Technical stack**: Next.js 15, React 19, TypeScript (strict mode), Tailwind CSS 4.x
- **Performance requirements**: Render times, optimization needs
- **Design constraints**: Responsive breakpoints (mobile/tablet/desktop), spacing, sizing
- **File structure**: Exact file path (e.g., `src/components/ComponentName.tsx`)
- **TypeScript interfaces**: Complete props interface with types
- **Styling constraints**: Exact Tailwind CSS classes to use
- **Security considerations**: XSS prevention, data handling

#### Acceptance Criteria
- [ ] Testable success criteria with checkboxes
- [ ] Core functionality verified
- [ ] Edge cases handled
- [ ] User experience validated
- [ ] Integration points verified
- [ ] TypeScript compilation passes
- [ ] No ESLint errors

### Step 5: Save Specification

Save the generated spec to: `specs/[kebab-case-name]-spec.md`

**Example outputs**:
- `CustomerCard` → `specs/customer-card-spec.md`
- `DomainHealthIndicator` → `specs/domain-health-indicator-spec.md`

### Step 6: Provide Summary

After generating the spec, show:
- ✅ Requirements file read: `requirements/[name].md`
- ✅ Specification created: `specs/[name]-spec.md`
- 📋 Key requirements captured (list 3-5 main points)
- 🚀 Next steps: Ready for implementation

## Implementation Guidelines

### TypeScript Requirements
- Include complete props interface definition
- Specify all required and optional fields
- Import types from `@/data/mock-customers` when needed
- Use strict TypeScript types (no `any`)

### Tailwind CSS Specifications
- Provide exact Tailwind classes for:
  - Health score colors: red (0-30), yellow (31-70), green (71-100)
  - Card styling: background, borders, shadows, rounded corners
  - Typography: font sizes, weights, colors
  - Spacing: padding, margins, gaps
  - Responsive: breakpoints (md:, lg:)
  - Interactive states: hover, focus, active

### File Structure
- Component location: `src/components/[ComponentName].tsx`
- Must be a client component with `'use client'` directive
- Export as default for dynamic imports

### Data Integration
- Reference mock data from `src/data/` directory
- Use the `Customer` interface from `mock-customers.ts`
- Handle optional fields gracefully
- No external API calls

### Acceptance Criteria Format
```markdown
- [ ] Core functionality item
- [ ] Edge case handling
- [ ] Responsive design verified
- [ ] TypeScript compilation passes
```

## Example Usage

```bash
# Generate spec for CustomerCard
/spec CustomerCard

# Generate spec for DomainHealthIndicator
/spec DomainHealthIndicator

# Generate spec for CustomerSelector
/spec CustomerSelector
```

## Important Notes

- This follows the **spec-driven development philosophy**: Requirements → Specification → Implementation
- The generated spec becomes the **source of truth** for implementation
- All components use **Next.js 15 App Router** and **React 19**
- **Tailwind CSS 4.x only** - no custom CSS files
- All components must be **client components** (`'use client'`)
- Reference the **Customer interface** from mock data when applicable
