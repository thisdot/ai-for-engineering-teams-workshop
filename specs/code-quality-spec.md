# Feature: Code Quality Standards

## Context
- Cross-cutting requirement: consistent, maintainable code across all AI-generated components
- Reduce technical debt; keep components readable and conventional
- Standardizes how shadcn/ui primitives are consumed across the codebase

## Requirements

### Code Quality Standards
- Descriptive names (no `btn`, `usr`); camelCase variables, PascalCase components
- TypeScript interfaces for all props and data structures
- JSDoc for complex functions
- Proper error boundaries and error handling
- Meaningful commit messages and comments

### React-Specific Rules
- Prefer named exports for components
- Custom hooks for reusable logic
- Explicit loading and error states for async operations
- Prop validation via TypeScript interfaces
- Semantic JSX element names (purpose, not appearance)

### UI Components (shadcn/ui)
- Build UI on shared primitives in `@/components/ui/` (Card, Button, Badge, Input, Select, Form, Dialog, Table, Alert, …) instead of hand-rolling equivalents
- Do not fork/duplicate primitives; extend via `className` merged with `cn()` (`@/lib/utils`) and composition
- Use theme tokens (`bg-card`, `text-foreground`, `text-muted-foreground`, `border`, `primary`, `destructive`) — never hard-coded colors — so light/dark stay consistent
- Centralize repeated visual logic (e.g. `healthColor(score)`) in one shared helper reused across CustomerCard, health, market-intelligence, and alerts
- Keep `components.json` (`radix-luma` style) authoritative; add components via the shadcn CLI where available
- Wrap primitives with named exports and typed props

## Constraints
- Applies to all components and specs in this repo
- Next.js 15 App Router, React 19, TypeScript strict mode
- ESLint (`eslint-config-next`) and `tsc --noEmit` must pass

## Acceptance Criteria

- [ ] No hand-rolled equivalents of available shadcn primitives
- [ ] Primitives extended via `cn()` + composition, not forked
- [ ] Theme tokens used throughout; no hard-coded gray/blue/white colors
- [ ] Shared helpers used for repeated visual logic (e.g. health/priority colors)
- [ ] Components use named exports with typed props and explicit loading/error states
- [ ] `npm run lint` and `npm run type-check` pass
