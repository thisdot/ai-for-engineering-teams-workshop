# Feature: Health Score Calculator + CustomerHealthDisplay

## Context
- Customer health scoring system for the Customer Intelligence Dashboard
- Predictive analytics for relationship health and churn risk
- Pure-function algorithm plus a display widget that integrates with `CustomerSelector`
- Emphasis on explainable, testable business logic

## Requirements

### Core Algorithm
- Health score on a 0-100 scale with risk categorization
- Weighted multi-factor scoring: Payment (40%), Engagement (30%), Contract (20%), Support (10%)
- Risk levels: Healthy (71-100), Warning (31-70), Critical (0-30)

### Pure Function Implementation
- Modular functions in `src/lib/healthCalculator.ts`
- One scoring function per factor + a `calculateHealthScore` combiner
- Input validation + error handling; TypeScript interfaces for all inputs/returns
- Error classes extending `Error`; JSDoc explaining formulas

### Data Input Requirements
- Payment: days since last payment, average delay, overdue amounts
- Engagement: login frequency, feature usage count, support tickets
- Contract: days until renewal, contract value, recent upgrades
- Support: average resolution time, satisfaction scores, escalation counts

### UI Component Integration (CustomerHealthDisplay)
- Overall score with color-coded visualization
- Expandable breakdown of individual factor scores
- Loading and error states consistent with other widgets
- Real-time updates when `CustomerSelector` selection changes

### UI Components (shadcn/ui)
- **Card** (`@/components/ui/card`) — widget container matching other widgets
- **Progress** (`@/components/ui/progress`) — visualize the 0–100 overall score with color-coded fill
- **Badge** (`@/components/ui/badge`) — risk-level label (Healthy / Warning / Critical), same color mapping as CustomerCard
- **Accordion** (`@/components/ui/accordion`) or **Collapsible** — expandable per-factor breakdown (payment/engagement/contract/support)
- **Chart** (`@/components/ui/chart`, Recharts) — factor-weight breakdown; use theme `chart-1..5` tokens
- **Tooltip** (`@/components/ui/tooltip`) — explain each factor's weight (40/30/20/10) — supports the explainability goal
- **Skeleton** (`@/components/ui/skeleton`) — loading state
- **Alert** (`@/components/ui/alert`) — error state
- Reuse the shared `healthColor(score)` mapping so colors match CustomerCard and market intelligence

## Constraints

### Technical Stack
- TypeScript strict typing for all interfaces/functions
- Pure-function architecture (no side effects) for predictable testing
- Next.js 15 App Router / React 19 for the widget
- Tailwind CSS v4 + shadcn/ui theme tokens

### File Structure and Naming
- Algorithm: `src/lib/healthCalculator.ts`
- Widget: `src/components/CustomerHealthDisplay.tsx`
- Reuse shadcn primitives from `src/components/ui/`

### Performance Requirements
- Efficient calculation suitable for real-time dashboard updates
- Caching considerations for repeated calculations

## Testing Requirements
- Unit coverage for every calculation function
- Boundary/edge-case tests (new customers, missing data, range limits)
- Realistic scenario tests and mathematical-accuracy verification
- Input-validation and error-handling tests

## Acceptance Criteria

- [ ] `calculateHealthScore` combines factors with the 40/30/20/10 weighting
- [ ] Risk levels classified correctly: Healthy (71-100), Warning (31-70), Critical (0-30)
- [ ] Pure functions with validation and descriptive error classes
- [ ] `CustomerHealthDisplay` shows overall score via `Progress` + risk `Badge`
- [ ] Expandable factor breakdown via `Accordion`; weights explained via `Tooltip`
- [ ] Loading (`Skeleton`) and error (`Alert`) states consistent with other widgets
- [ ] Updates in real time when the selected customer changes
- [ ] Comprehensive unit tests pass; passes TypeScript strict mode checks
