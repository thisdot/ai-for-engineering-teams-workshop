# Feature: Production-Ready Dashboard

## Context
- Harden the Customer Intelligence Dashboard from prototype to production
- Comprehensive error handling, data export, performance, accessibility, and security
- Unifies all previously built widgets under consistent, resilient patterns

## Requirements

### Error Handling and Resilience
- Multi-level error boundaries (dashboard, widget, component)
- Graceful degradation when a widget/service fails; fallback UIs preserve core functionality
- User-friendly error messages with retry/recovery
- Error reporting/logging; dev vs prod error display modes

### Data Export and Portability
- Customer data export in CSV and JSON with configurable filters
- Health-score reports, alert history/audit logs, market summaries
- Configurable date ranges, segments, filters
- Progress indicators + cancellation for long exports; timestamped file names

### Performance Optimization
- Memoization (`React.memo`/`useMemo`/`useCallback`), code splitting, lazy loading
- Virtual scrolling for large customer lists/tables
- Core Web Vitals targets: LCP < 2.5s, CLS < 0.1, TTI < 3.5s, 60fps interactions

### Accessibility Compliance
- WCAG 2.1 AA across all components (see accessibility-spec)
- Semantic landmarks/headings, full keyboard nav + focus management, screen-reader support

### Security Hardening
- CSP + security headers (X-Frame-Options, X-Content-Type-Options)
- Input validation/sanitization for all inputs and API responses
- Rate limiting on API + export endpoints; sanitized error messages

### UI Components (shadcn/ui)
- **Alert** (`@/components/ui/alert`) — error-boundary fallback messaging with recovery guidance
- **Button** (`@/components/ui/button`) — retry/recover actions
- **Skeleton** (`@/components/ui/skeleton`) — Suspense / lazy-load fallbacks
- **Sonner** (`@/components/ui/sonner`) — non-blocking error + export-status notifications
- **Dialog** (`@/components/ui/dialog`) — export configuration (formats, filters, ranges) with progress + cancel
- **Select** / **Tabs** — export format (CSV/JSON) and segment/date-range selection
- **Table** (`@/components/ui/table`) — virtualized large lists + export previews
- **NavigationMenu** / **Sidebar** + **Breadcrumb** — production app shell and landmarks
- Theme tokens + mode toggle for light/dark (tokens already in `globals.css`)
- Radix-based primitives supply the keyboard/ARIA foundation for the accessibility requirements

## Constraints

### Technical Stack
- Next.js 15 App Router (production config + security headers)
- React 19, TypeScript strict mode
- Tailwind CSS v4 + shadcn/ui theme tokens

### Architecture
- `DashboardErrorBoundary` + `WidgetErrorBoundary`; custom error classes with context
- `ExportUtils` with format-specific handlers, streaming, audit logging
- Suspense boundaries for code splitting; virtual scrolling for tables
- Health-check endpoints; env-specific config; CSP policy

### File Structure and Naming
- Boundaries: `src/components/DashboardErrorBoundary.tsx`, `WidgetErrorBoundary.tsx`
- Export: `src/lib/exportUtils.ts`
- Reuse shadcn primitives from `src/components/ui/`; never fork them

## Acceptance Criteria

- [ ] Dashboard/widget/component error boundaries with `Alert`-based fallbacks + retry
- [ ] One failing widget does not crash the dashboard (graceful degradation)
- [ ] CSV + JSON export via a `Dialog` with filters, progress, and cancel; `Sonner` status
- [ ] Large tables virtualized; memoization applied to expensive components
- [ ] Core Web Vitals targets met (LCP/CLS/TTI); 60fps interactions
- [ ] WCAG 2.1 AA validated (axe-core + keyboard/screen-reader checks)
- [ ] CSP + security headers configured; inputs validated/sanitized; errors sanitized
- [ ] Uses theme tokens with working light/dark; passes TypeScript strict mode
