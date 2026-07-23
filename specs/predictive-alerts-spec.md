# Feature: Predictive Alerts System

## Context
- Intelligent, proactive customer-risk monitoring for the Customer Intelligence Dashboard
- Rule-based engine plus a real-time alert widget integrated into the dashboard
- Builds on the health score calculator and existing customer data
- Emphasis on explainable rules, testability, and alert-fatigue avoidance

## Requirements

### Alert Rules Engine
- Multi-tier priority: High (immediate action), Medium (monitor closely)
- Configurable thresholds/conditions; priority scoring weighted by customer value (ARR), urgency, recency
- Cooldown periods and deduplication to prevent alert spam
- High-priority types: Payment Risk, Engagement Cliff, Contract Expiration Risk
- Medium-priority types: Support Ticket Spike, Feature Adoption Stall

### Pure Function Implementation
- Rule evaluation in `src/lib/alerts.ts`: one pure function per rule + an `alertEngine` combiner
- TypeScript interfaces for alert types, customer data, and responses
- Deduplication + alert-history/audit trail
- Input validation; no sensitive data in alert messages

### UI Component (PredictiveAlertsWidget)
- Real-time alert feed integrated into the dashboard
- Priority visualization with red/yellow/green color coding
- Alert detail panel with recommended actions and context
- Dismiss/acknowledge/action tracking
- Historical alerts view + analytics

### UI Components (shadcn/ui)
- **Card** (`@/components/ui/card`) — widget container matching other widgets
- **Alert** (`@/components/ui/alert`) — individual alert rows (title + recommended action)
- **Badge** (`@/components/ui/badge`) — priority indicator (High/Medium) via shared color mapping
- **Sonner** (`@/components/ui/sonner`) — toast for newly triggered high-priority alerts
- **ScrollArea** (`@/components/ui/scroll-area`) — scrollable alert feed / history
- **Dialog** (`@/components/ui/dialog`) — alert detail panel with context + actions
- **Button** (`@/components/ui/button`) — dismiss / acknowledge / take action
- **Tabs** (`@/components/ui/tabs`) — active alerts ↔ historical view
- **Table** (`@/components/ui/table`) — historical alerts + analytics
- **Skeleton** — loading; lucide **AlertTriangle** / **Bell** for priority affordances
- Reuse the shared `healthColor()`/priority-color mapping for consistency

## Constraints

### Technical Stack
- Next.js 15 App Router, React 19, TypeScript strict mode
- Tailwind CSS v4 + shadcn/ui theme tokens
- Pure-function rules engine for predictable testing

### File Structure and Naming
- Engine: `src/lib/alerts.ts`
- Component: `src/components/PredictiveAlertsWidget.tsx`
- Reuse shadcn primitives from `src/components/ui/`

### Security Requirements
- Input validation for customer data and rule parameters
- No sensitive customer data in alert messages
- Rate limiting on alert generation; audit-trail logging
- Client-side security review of alert logic

### Performance Requirements
- Real-time processing with minimal latency for hundreds of customers
- Efficient rule evaluation + caching for monitoring

## Testing Requirements
- Unit tests for every rule and the `alertEngine`
- Edge/boundary + realistic risk-profile scenarios
- Deduplication and cooldown behavior tests
- Performance tests for real-time generation

## Acceptance Criteria

- [ ] Each alert rule implemented as a pure function; `alertEngine` evaluates all rules
- [ ] High/Medium prioritization with ARR/urgency/recency weighting
- [ ] Deduplication + cooldown prevent duplicate/spam alerts
- [ ] Widget shows a feed of `Alert` rows with priority `Badge`s and color coding
- [ ] New high-priority alerts raise a `Sonner` toast; details open in a `Dialog`
- [ ] Active vs historical views via `Tabs`; history in a `Table`
- [ ] Dismiss/acknowledge actions tracked
- [ ] Uses theme tokens; dark mode works; passes TypeScript strict mode
