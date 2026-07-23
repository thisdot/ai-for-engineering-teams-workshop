# Feature: Market Intelligence Widget

## Context
- Market intelligence widget for the Customer Intelligence Dashboard
- Real-time market sentiment and news analysis for customer companies
- Demonstrates spec-driven context compression and consistent widget composition
- Follows the same patterns as customer management and the health widget

## Requirements

### API Layer
- Route: `GET /api/market-intelligence/[company]`
- Mock data generation for reliable workshop demos
- Validate company name; sanitize responses
- Consistent JSON: sentiment, news count, headlines
- Realistic API delay simulation; follow existing customer API patterns

### Service Layer
- `MarketIntelligenceService` class following established patterns
- Caching with TTL expiration (10-minute cache for mock news)
- Custom `MarketIntelligenceError` class; centralized error handling
- Pure functions where practical; company-specific mock headlines + sentiment

### UI Component (MarketIntelligenceWidget)
- Company name input with validation
- Color-coded sentiment indicator (green/yellow/red)
- News article count + last-updated timestamp
- Top 3 headlines with source and publication date
- Loading and error states consistent with other widgets

### Dashboard Integration
- Integrate into the main dashboard alongside existing widgets
- Receive company name from the selected customer
- Same prop-passing/state patterns; responsive grid + consistent spacing

### UI Components (shadcn/ui)
- **Card** (`@/components/ui/card`) — widget container matching other widgets
- **Input** (`@/components/ui/input`) — company name entry with validation
- **Button** (`@/components/ui/button`) — trigger/refresh lookup
- **Badge** (`@/components/ui/badge`) — sentiment indicator using the shared green/yellow/red mapping
- **Skeleton** (`@/components/ui/skeleton`) — loading state during simulated API delay
- **Alert** (`@/components/ui/alert`) — error states from `MarketIntelligenceError`
- **Separator** (`@/components/ui/separator`) — divide headlines
- **Avatar** (`@/components/ui/avatar`) or small lucide icon — per-headline news source
- Optional **Chart** (`@/components/ui/chart`) — sentiment trend using theme `chart-*` tokens

## Constraints

### Technical Stack
- Next.js 15 App Router with Route Handlers
- React 19 hooks; TypeScript strict typing for all interfaces
- Tailwind CSS v4 + shadcn/ui theme tokens
- Error boundaries; established caching/error/service-layer patterns

### File Structure and Naming
- API: `src/app/api/market-intelligence/[company]/route.ts`
- Service: `src/lib/MarketIntelligenceService.ts` (or `src/services/`)
- Component: `src/components/MarketIntelligenceWidget.tsx`
- Reuse shadcn primitives from `src/components/ui/`

### Integration Pattern Requirements
- Match existing widget styling/layout
- Use the same green/yellow/red color system as customer + health widgets
- Same input/button/error/loading UX patterns
- Consistent spacing, typography, and structure

### Security Requirements
- Company name validation to prevent injection
- Input sanitization for mock data generation
- Timeout simulation + error handling
- Error message sanitization (no sensitive info leakage)
- Mock data avoids external API vulnerabilities

## Acceptance Criteria

- [ ] API route returns validated, sanitized JSON (sentiment, count, headlines) with delay simulation
- [ ] `MarketIntelligenceService` implements TTL caching (10 min) and `MarketIntelligenceError`
- [ ] Widget shows sentiment via `Badge`, count + last-updated timestamp, and top 3 headlines
- [ ] Company name received from the selected customer
- [ ] Loading (`Skeleton`) and error (`Alert`) states consistent with other widgets
- [ ] Color coding matches CustomerCard/health widgets (green/yellow/red)
- [ ] Uses theme tokens throughout; dark mode works
- [ ] Passes TypeScript strict mode checks; no console errors
