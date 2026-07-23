# Code Quality Requirements

## Business Context
- Maintain consistent code quality across all AI-generated components
- Ensure code is readable, maintainable, and follows team conventions
- Reduce technical debt and improve long-term maintainability

## Code Quality Standards
- Use descriptive variable and function names (no abbreviations like `btn`, `usr`)
- Add TypeScript interfaces for all props and data structures
- Include JSDoc comments for complex functions
- Follow consistent naming conventions (camelCase for variables, PascalCase for components)
- Implement proper error boundaries and error handling
- Use meaningful commit messages and code comments

## React-Specific Quality Rules
- Prefer named exports over default exports for components
- Use custom hooks for reusable logic
- Implement proper loading and error states for async operations
- Add prop validation with TypeScript interfaces
- Use semantic JSX element names that describe purpose, not appearance

## UI Components (shadcn/ui)
- Build UI on the shared shadcn primitives in `src/components/ui/` (Card, Button, Badge, Input, Select, Form, Dialog, Table, Alert, etc.) instead of hand-rolling equivalents
- Do not fork or duplicate primitives; extend via `className` (merged with `cn()` from `@/lib/utils`) and composition
- Use theme tokens (`bg-card`, `text-foreground`, `text-muted-foreground`, `border`, `primary`, `destructive`) rather than hard-coded colors, so light/dark mode stay consistent
- Centralize repeated visual logic (e.g. the red/yellow/green `healthColor(score)` mapping) in one shared helper reused across CustomerCard, health, market-intelligence, and alerts widgets
- Keep the shadcn `radix-luma` style/config in `components.json` authoritative; add components via the CLI where available
- Prefer named exports and typed props for any component wrapping a primitive