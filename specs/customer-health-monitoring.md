# Spec: Customer Health Monitoring System

## Feature: Customer Health Monitoring with Predictive Alerts

### Context

The Customer Health Monitoring System is an intelligent, comprehensive monitoring solution that combines multi-factor health scoring with predictive alerts for proactive customer risk management. This system enables customer success teams to identify at-risk customers before churn occurs and take preventive action based on data-driven insights.

**Purpose and Role**:
- Monitor customer health across multiple dimensions (payment, engagement, contract, support)
- Calculate real-time health scores with explainable factor breakdowns
- Generate predictive alerts for high-risk customer situations
- Provide actionable recommendations for customer success interventions
- Enable proactive customer relationship management with early warning system
- Demonstrate advanced AI collaboration for complex business logic and rule design

**System Integration**:
- **Core Engine**: Health calculation and alert rules in `src/lib/healthMonitoring.ts`
- **Health Calculator**: Multi-factor scoring system (`src/lib/healthCalculator.ts`)
- **Alert Engine**: Rule-based alert generation (`src/lib/alertEngine.ts`)
- **UI Components**:
  - `CustomerHealthDisplay` - Health score visualization
  - `PredictiveAlertsWidget` - Real-time alert display
  - `AlertDetailPanel` - Alert details and actions
- **Dashboard Integration**: Unified monitoring view with customer selection
- **Data Sources**: Customer data, health metrics, engagement patterns, payment history

**User Interaction**:
- Customer success managers monitor customer health in real-time
- Alerts automatically appear when risk conditions are detected
- Users can drill down into alert details and health score breakdowns
- Action tracking for alert response and follow-up
- Historical view shows trends and alert patterns
- Primary users: CSMs, account executives, customer operations, leadership

### Requirements

**Functional Requirements - Health Score Calculation**:

1. **Multi-Factor Health Scoring** (from Health Score Calculator requirements):
   - **Payment Health (40% weight)**:
     - Days since last payment
     - Average payment delay
     - Overdue amounts vs contract value
   - **Engagement Health (30% weight)**:
     - Login frequency and patterns
     - Feature usage breadth and depth
     - Last login recency
   - **Contract Health (20% weight)**:
     - Days until renewal
     - Auto-renew status
     - Recent upgrades or expansions
   - **Support Health (10% weight)**:
     - Satisfaction scores
     - Resolution times
     - Escalation frequency
     - Open ticket counts

2. **Health Score Output**:
   - Overall score: 0-100 scale
   - Individual factor scores with breakdowns
   - Risk level classification:
     - Healthy: 71-100 (green)
     - Warning: 31-70 (yellow)
     - Critical: 0-30 (red)
   - Trend indicators (improving/stable/declining)
   - Calculation timestamp and data freshness

**Functional Requirements - Predictive Alerts**:

1. **High Priority Alerts** (Immediate Action Required):

   **Payment Risk Alert**:
   - **Trigger Conditions**:
     - Payment overdue > 30 days, OR
     - Health score drops > 20 points in 7 days
   - **Priority**: High
   - **Recommended Actions**:
     - Immediate payment follow-up
     - Account review meeting
     - Executive escalation if high-value customer

   **Engagement Cliff Alert**:
   - **Trigger Conditions**:
     - Login frequency drops > 50% compared to 30-day rolling average
   - **Priority**: High
   - **Recommended Actions**:
     - Check-in call to understand usage changes
     - Product training or support offer
     - Identify blockers or competitive threats

   **Contract Expiration Risk Alert**:
   - **Trigger Conditions**:
     - Contract expires in < 90 days AND health score < 50
   - **Priority**: High
   - **Recommended Actions**:
     - Renewal conversation with stakeholder
     - Value demonstration and ROI review
     - Address concerns and negotiate terms

2. **Medium Priority Alerts** (Monitor Closely):

   **Support Ticket Spike Alert**:
   - **Trigger Conditions**:
     - More than 3 support tickets in 7 days, OR
     - Any escalated ticket
   - **Priority**: Medium
   - **Recommended Actions**:
     - Review ticket themes and root causes
     - Proactive support outreach
     - Process improvement discussion

   **Feature Adoption Stall Alert**:
   - **Trigger Conditions**:
     - No new feature usage in 30 days for growing accounts (ARR > threshold)
   - **Priority**: Medium
   - **Recommended Actions**:
     - Feature training session
     - Use case exploration
     - Product roadmap alignment

3. **Alert Management Features**:
   - Alert deduplication (prevent duplicate alerts for same customer/issue)
   - Cooldown periods (configurable per alert type, default 7 days)
   - Alert history and audit trail
   - Alert dismissal with reason tracking
   - Action completion tracking
   - Business hours filtering (optional)

4. **Alert Prioritization Logic**:
   - Customer value weighting (ARR-based multiplier)
   - Urgency scoring (time sensitivity)
   - Recency factor (how recent is the risk)
   - Combined priority score: `(urgency * 0.5) + (customerValue * 0.3) + (recency * 0.2)`

**Functional Requirements - Data Monitoring**:

1. **Real-Time Health Monitoring**:
   - Periodic health score recalculation (configurable interval)
   - Change detection for significant health score drops
   - Threshold monitoring for alert triggers
   - Trend analysis (7-day, 30-day rolling windows)

2. **Pattern Detection**:
   - Gradual vs sudden engagement drops
   - Payment behavior changes
   - Support satisfaction trends
   - Feature adoption velocity

3. **Historical Data Tracking**:
   - Health score history (time series)
   - Alert history with outcomes
   - Action history and effectiveness
   - Customer state snapshots

**Functional Requirements - UI Components**:

1. **CustomerHealthDisplay Component**:
   - Large overall health score display
   - Risk level badge with color coding
   - Expandable factor breakdown section
   - Individual factor scores with visual indicators
   - Trend arrows (↑ improving, → stable, ↓ declining)
   - Last calculated timestamp
   - Calculation details on hover/expand

2. **PredictiveAlertsWidget Component**:
   - Alert count badge (high/medium priority counts)
   - Real-time alert list (sorted by priority)
   - Alert card with:
     - Priority indicator (color-coded)
     - Alert type and title
     - Customer name/company
     - Trigger summary
     - Recommended actions (collapsed)
     - Timestamp and alert age
   - Filter by priority level
   - "View All" link to historical alerts

3. **AlertDetailPanel Component**:
   - Full alert details
   - Customer context (health score, ARR, tier)
   - Detailed trigger explanation
   - Recommended actions checklist
   - Action tracking (mark as done)
   - Dismiss alert with reason
   - Historical alerts for same customer
   - Related data visualizations

4. **CustomerHealthMonitoring Dashboard View**:
   - Integrated health display + alerts widget
   - Customer selector integration
   - Real-time updates when selection changes
   - Responsive layout for all breakpoints
   - Loading and error states

**Integration Requirements**:
- Integrate with existing CustomerSelector component
- Use Customer data from `src/data/mock-customers.ts`
- Extend Customer interface with health data and historical metrics
- Dashboard state management for selected customer
- Alert state management (active, dismissed, historical)
- Real-time updates without full page refresh
- Consistent styling with existing dashboard widgets

### Constraints

**Technical Stack**:
- Next.js 15+ with App Router
- React 19 with TypeScript (strict mode)
- Tailwind CSS 4.x for all styling
- Pure function architecture for calculations and rules
- No external libraries for core logic (educational purposes)
- Mock data for workshop reliability

**File Structure**:
```
src/
├── lib/
│   ├── healthCalculator.ts           # Health score calculation functions
│   ├── alertEngine.ts                # Alert rules and evaluation
│   ├── healthMonitoring.ts           # Combined monitoring orchestration
│   └── types/
│       ├── health.ts                 # Health-related TypeScript interfaces
│       └── alerts.ts                 # Alert-related TypeScript interfaces
├── components/
│   ├── CustomerHealthDisplay.tsx     # Health score visualization
│   ├── PredictiveAlertsWidget.tsx    # Alert list widget
│   ├── AlertDetailPanel.tsx          # Alert detail view
│   └── AlertCard.tsx                 # Individual alert card
├── data/
│   ├── mock-customers.ts             # Extended with health data
│   └── mock-health-history.ts        # Historical health data
└── app/
    └── page.tsx                      # Dashboard integration
```

**TypeScript Definitions**:

```typescript
// src/lib/types/health.ts

export interface PaymentData {
  daysSinceLastPayment: number;
  averagePaymentDelay: number;
  overdueAmount: number;
  totalContractValue: number;
}

export interface EngagementData {
  loginFrequency: number;              // logins per week
  featureUsageCount: number;           // features actively used
  lastLoginDays: number;               // days since last login
  averageSessionDuration?: number;     // optional: minutes per session
}

export interface ContractData {
  daysUntilRenewal: number;
  contractValue: number;               // ARR in USD
  hasRecentUpgrade: boolean;
  autoRenewEnabled: boolean;
  contractStartDate: string;           // ISO date
}

export interface SupportData {
  averageResolutionTime: number;       // hours
  satisfactionScore: number;           // 1-5 scale
  escalationCount: number;             // last 90 days
  openTicketCount: number;
  recentTickets?: number;              // last 7 days
}

export interface CustomerHealthData {
  payment: PaymentData;
  engagement: EngagementData;
  contract: ContractData;
  support: SupportData;
}

export interface HealthScoreBreakdown {
  paymentScore: number;                // 0-100
  engagementScore: number;             // 0-100
  contractScore: number;               // 0-100
  supportScore: number;                // 0-100
  overallScore: number;                // 0-100
  riskLevel: 'healthy' | 'warning' | 'critical';
  calculatedAt: string;                // ISO timestamp
}

export interface HealthScoreHistory {
  customerId: string;
  scores: Array<{
    score: number;
    timestamp: string;
  }>;
}

export type TrendDirection = 'improving' | 'stable' | 'declining';

export interface HealthTrend {
  direction: TrendDirection;
  changePercent: number;              // e.g., -15 for 15% decline
  periodDays: number;                 // e.g., 7 or 30
}
```

```typescript
// src/lib/types/alerts.ts

export type AlertPriority = 'high' | 'medium';

export type AlertType =
  | 'payment_risk'
  | 'engagement_cliff'
  | 'contract_expiration_risk'
  | 'support_ticket_spike'
  | 'feature_adoption_stall';

export interface AlertTrigger {
  type: AlertType;
  condition: string;                  // Human-readable condition
  threshold: number | string;         // Threshold value that triggered
  actualValue: number | string;       // Actual value that exceeded threshold
}

export interface CustomerAlert {
  id: string;                         // Unique alert ID
  customerId: string;
  customerName: string;
  customerCompany: string;
  alertType: AlertType;
  priority: AlertPriority;
  title: string;
  description: string;
  trigger: AlertTrigger;
  recommendedActions: string[];
  createdAt: string;                  // ISO timestamp
  dismissedAt?: string;               // ISO timestamp if dismissed
  dismissReason?: string;
  actionsTaken?: string[];            // Tracked actions
  customerValue: number;              // ARR for prioritization
  priorityScore: number;              // Calculated priority score
}

export interface AlertRule {
  type: AlertType;
  priority: AlertPriority;
  evaluationFunction: (data: CustomerHealthData, history?: HealthScoreHistory) => boolean;
  cooldownDays: number;
  title: string;
  descriptionTemplate: (trigger: AlertTrigger) => string;
  recommendedActions: string[];
}

export interface AlertEngineResult {
  alerts: CustomerAlert[];
  evaluatedRules: number;
  triggeredRules: number;
  suppressedAlerts: number;          // Due to cooldown/deduplication
}

export class AlertEngineError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'AlertEngineError';
  }
}
```

```typescript
// Component Props

interface CustomerHealthDisplayProps {
  customerId: string;
  showTrend?: boolean;
  expandedByDefault?: boolean;
  className?: string;
}

interface PredictiveAlertsWidgetProps {
  customerId?: string;                // If provided, filter to this customer
  maxAlerts?: number;                 // Max alerts to display (default: 5)
  priorityFilter?: AlertPriority[];   // Filter by priority
  onAlertClick?: (alert: CustomerAlert) => void;
  className?: string;
}

interface AlertDetailPanelProps {
  alert: CustomerAlert;
  onDismiss: (alertId: string, reason: string) => void;
  onActionComplete: (alertId: string, action: string) => void;
  onClose: () => void;
}

interface AlertCardProps {
  alert: CustomerAlert;
  onClick?: () => void;
  compact?: boolean;
}
```

**Algorithm Design Specifications**:

**Health Score Calculation** (detailed formulas in health-score-calculator.md):
- Payment Score (40%): Considers days late, average delay, overdue percentage
- Engagement Score (30%): Normalizes login frequency, feature usage, recency
- Contract Score (20%): Renewal risk assessment with bonuses for auto-renew/upgrades
- Support Score (10%): Satisfaction mapping with penalties for escalations
- Overall Score: Weighted combination with trend analysis

**Alert Evaluation Algorithm**:
```typescript
// Pseudocode for alert engine

function evaluateAlerts(customer: Customer, healthData: CustomerHealthData, history: HealthScoreHistory): CustomerAlert[] {
  const alerts: CustomerAlert[] = [];

  // Check cooldown periods
  const recentAlerts = getRecentAlerts(customer.id, 7); // Last 7 days

  for (const rule of alertRules) {
    // Skip if in cooldown period
    if (isInCooldown(customer.id, rule.type, recentAlerts, rule.cooldownDays)) {
      continue;
    }

    // Evaluate rule
    if (rule.evaluationFunction(healthData, history)) {
      const alert = createAlert(customer, rule, healthData);
      alerts.push(alert);
    }
  }

  // Sort by priority score
  return alerts.sort((a, b) => b.priorityScore - a.priorityScore);
}
```

**Priority Score Calculation**:
```typescript
function calculatePriorityScore(
  alert: CustomerAlert,
  customerARR: number,
  urgency: number  // 0-100 scale
): number {
  // Normalize customer value (ARR) to 0-100 scale
  const maxARR = 1000000; // $1M reference point
  const customerValue = Math.min(100, (customerARR / maxARR) * 100);

  // Recency is always 100 for new alerts, decays over time
  const recency = 100;

  // Weighted combination
  const score = (urgency * 0.5) + (customerValue * 0.3) + (recency * 0.2);

  return Math.round(score);
}
```

**Alert Rule Definitions**:

```typescript
// Example: Payment Risk Alert Rule

const paymentRiskRule: AlertRule = {
  type: 'payment_risk',
  priority: 'high',
  cooldownDays: 7,
  title: 'Payment Risk Detected',
  evaluationFunction: (data: CustomerHealthData, history?: HealthScoreHistory) => {
    // Condition 1: Payment overdue > 30 days
    if (data.payment.daysSinceLastPayment > 30) {
      return true;
    }

    // Condition 2: Health score drop > 20 points in 7 days
    if (history && history.scores.length >= 2) {
      const latestScore = history.scores[history.scores.length - 1].score;
      const sevenDaysAgo = history.scores.find(s => {
        const daysDiff = (Date.now() - new Date(s.timestamp).getTime()) / (1000 * 60 * 60 * 24);
        return daysDiff >= 7;
      });

      if (sevenDaysAgo && (sevenDaysAgo.score - latestScore) > 20) {
        return true;
      }
    }

    return false;
  },
  descriptionTemplate: (trigger: AlertTrigger) => {
    return `Payment risk detected: ${trigger.condition}. Immediate action required to prevent account escalation.`;
  },
  recommendedActions: [
    'Contact customer regarding payment status',
    'Review payment terms and any billing issues',
    'Escalate to account executive for high-value accounts',
    'Document conversation and next steps'
  ]
};
```

**Performance Constraints**:
- Health score calculation: < 10ms per customer
- Alert evaluation: < 50ms for all rules per customer
- UI render time: < 200ms for health display + alerts
- Real-time monitoring interval: 5-minute default (configurable)
- History query optimization: Index by customer ID and timestamp
- Memory-efficient data structures for historical tracking

**Design Constraints**:
- Health display max width: 600px desktop, full-width mobile
- Alert widget max height: 500px with scrolling
- Alert cards: Compact design, expandable for details
- Color coding consistency:
  - High priority: `bg-red-50`, `border-red-500`, `text-red-700`
  - Medium priority: `bg-yellow-50`, `border-yellow-500`, `text-yellow-700`
  - Healthy: `bg-green-50`, `border-green-500`, `text-green-700`
- Typography: Consistent with dashboard (system font stack)
- Spacing: 4px/8px/16px/24px grid
- Responsive breakpoints: 640px (mobile), 768px (tablet), 1024px (desktop)

**Security Constraints**:
- Input validation for all customer data
- No sensitive PII in alert messages
- Alert history access control (not implemented in workshop, but noted)
- Rate limiting on alert generation (max 100 alerts per customer per day)
- Sanitize user-provided dismiss reasons
- No executable code in alert data
- Client-side validation + server-side validation (if API exists)

**Code Quality Constraints**:
- Pure functions for all calculation and evaluation logic
- Comprehensive JSDoc comments
- No magic numbers (named constants)
- Descriptive error messages with error codes
- TypeScript strict mode (no `any`, no implicit `any`)
- Consistent naming conventions (camelCase for functions/variables)
- Modular code structure (single responsibility principle)

### Acceptance Criteria

**Health Score Calculation**:
- [ ] All factor calculation functions implemented (payment, engagement, contract, support)
- [ ] Overall health score calculation combines factors with correct weights (40/30/20/10)
- [ ] Risk level classification correct for all score ranges
- [ ] Trend calculation compares current vs historical scores
- [ ] Input validation throws errors for invalid data
- [ ] Pure functions with no side effects
- [ ] TypeScript interfaces defined for all data structures
- [ ] JSDoc comments explain all calculation logic

**Alert Engine - High Priority Alerts**:
- [ ] Payment Risk alert triggers for overdue > 30 days
- [ ] Payment Risk alert triggers for health score drop > 20 points in 7 days
- [ ] Engagement Cliff alert triggers for 50% login frequency drop vs 30-day average
- [ ] Contract Expiration Risk alert triggers for <90 days + health score <50
- [ ] All high priority alerts have correct priority level
- [ ] All high priority alerts have recommended actions

**Alert Engine - Medium Priority Alerts**:
- [ ] Support Ticket Spike alert triggers for >3 tickets in 7 days
- [ ] Support Ticket Spike alert triggers for any escalated ticket
- [ ] Feature Adoption Stall alert triggers for 0 new features in 30 days (growing accounts)
- [ ] All medium priority alerts have correct priority level
- [ ] All medium priority alerts have recommended actions

**Alert Management**:
- [ ] Alert deduplication prevents duplicate alerts for same customer/issue
- [ ] Cooldown periods enforced (default 7 days, configurable per rule)
- [ ] Alert history tracked with timestamps
- [ ] Alert dismissal with reason tracking works
- [ ] Action completion tracking updates alert state
- [ ] Priority score calculation uses correct weights (urgency 50%, value 30%, recency 20%)

**UI Component - CustomerHealthDisplay**:
- [ ] Overall health score displays prominently with correct value
- [ ] Risk level badge shows with correct color (green/yellow/red)
- [ ] Factor breakdown expandable/collapsible
- [ ] Individual factor scores display with labels and values
- [ ] Trend indicators show direction (↑/→/↓)
- [ ] Last calculated timestamp displays
- [ ] Loading state shows while calculating
- [ ] Error state shows with error message
- [ ] Component uses 'use client' directive
- [ ] Fully typed with TypeScript

**UI Component - PredictiveAlertsWidget**:
- [ ] Alert count badge shows high/medium priority counts
- [ ] Alert list displays sorted by priority score
- [ ] High priority alerts appear first
- [ ] Alert cards show priority indicator with color coding
- [ ] Alert cards show alert type, customer name, trigger summary
- [ ] Alert cards show timestamp and age
- [ ] Filter by priority level works
- [ ] "View All" link (or functionality) for historical alerts
- [ ] Loading state while fetching alerts
- [ ] Empty state when no alerts present
- [ ] Component fully typed with TypeScript

**UI Component - AlertDetailPanel**:
- [ ] Full alert details display correctly
- [ ] Customer context shows (health score, ARR, tier)
- [ ] Trigger explanation detailed and clear
- [ ] Recommended actions display as checklist
- [ ] Action tracking marks actions as complete
- [ ] Dismiss alert with reason input works
- [ ] Historical alerts for same customer display
- [ ] Close/back functionality works
- [ ] Component fully typed with TypeScript

**Integration**:
- [ ] Integrates with CustomerSelector component
- [ ] Health display updates when customer selection changes
- [ ] Alerts widget updates when customer selection changes
- [ ] Real-time updates without page refresh
- [ ] Dashboard layout maintains responsive grid
- [ ] No layout shifts during loading states
- [ ] Consistent styling with other dashboard widgets
- [ ] Color coding consistent across components

**Data & State Management**:
- [ ] Mock customer data extended with health data
- [ ] Historical health data structure defined
- [ ] Alert state managed correctly (active, dismissed, historical)
- [ ] State updates trigger appropriate re-renders
- [ ] No unnecessary re-calculations
- [ ] useEffect cleanup functions implemented

**Performance**:
- [ ] Health score calculation < 10ms per customer
- [ ] Alert evaluation < 50ms for all rules per customer
- [ ] Component render time < 200ms
- [ ] No memory leaks from state or event listeners
- [ ] Efficient data queries for history

**Code Quality**:
- [ ] All functions have JSDoc comments
- [ ] No magic numbers (constants named and explained)
- [ ] No `any` types in TypeScript
- [ ] Proper error handling in all async operations
- [ ] TypeScript compilation passes with no errors
- [ ] ESLint passes with no violations
- [ ] No console errors or warnings in browser

**Edge Cases**:
- [ ] New customers with minimal data handled gracefully
- [ ] Missing optional data fields use defaults
- [ ] Invalid data ranges throw descriptive errors
- [ ] Zero/null values handled without crashes
- [ ] Multiple simultaneous alerts for one customer handled
- [ ] Alert cooldown prevents spam
- [ ] Historical data gaps handled gracefully
- [ ] Extreme values (365+ days, 1000+ logins) normalized

### Implementation Notes

**Implementation Order**:

1. **Phase 1: Health Score Foundation**
   - Implement `healthCalculator.ts` with all factor calculations
   - Create TypeScript interfaces in `types/health.ts`
   - Test calculation functions with sample data
   - Implement `CustomerHealthDisplay` component

2. **Phase 2: Alert Engine Core**
   - Create TypeScript interfaces in `types/alerts.ts`
   - Implement alert rule definitions in `alertEngine.ts`
   - Implement evaluation functions for each alert type
   - Implement deduplication and cooldown logic
   - Test alert rules with various scenarios

3. **Phase 3: Alert UI Components**
   - Implement `AlertCard` component
   - Implement `PredictiveAlertsWidget` component
   - Implement `AlertDetailPanel` component
   - Test UI with mock alerts

4. **Phase 4: Integration & Monitoring**
   - Extend mock customer data with health data and history
   - Create monitoring orchestration in `healthMonitoring.ts`
   - Integrate components into dashboard
   - Implement real-time updates
   - End-to-end testing

**Mock Data Strategy**:

```typescript
// Extend Customer interface in mock-customers.ts

export interface Customer {
  id: string;
  name: string;
  company: string;
  email?: string;
  subscriptionTier?: string;
  healthScore: number;                 // Current overall score
  // Add health data
  healthData: CustomerHealthData;
  // Add contract value for alert prioritization
  annualContractValue: number;         // ARR in USD
}

// Create mock health history
export const mockHealthHistory: Record<string, HealthScoreHistory> = {
  'customer-1': {
    customerId: 'customer-1',
    scores: [
      { score: 85, timestamp: '2025-10-03T10:00:00Z' },
      { score: 82, timestamp: '2025-10-04T10:00:00Z' },
      { score: 78, timestamp: '2025-10-05T10:00:00Z' },
      // ... more history
    ]
  },
  // ... more customers
};
```

**Alert Evaluation Example**:

```typescript
// src/lib/alertEngine.ts

export function evaluateCustomerAlerts(
  customer: Customer,
  history: HealthScoreHistory,
  recentAlerts: CustomerAlert[]
): CustomerAlert[] {
  const results: CustomerAlert[] = [];

  for (const rule of ALERT_RULES) {
    // Check cooldown
    if (isInCooldown(customer.id, rule.type, recentAlerts, rule.cooldownDays)) {
      continue;
    }

    // Evaluate rule
    if (rule.evaluationFunction(customer.healthData, history)) {
      const alert = createAlert(customer, rule);
      results.push(alert);
    }
  }

  // Sort by priority score
  return results.sort((a, b) => b.priorityScore - a.priorityScore);
}

function createAlert(customer: Customer, rule: AlertRule): CustomerAlert {
  const urgency = rule.priority === 'high' ? 90 : 60;
  const priorityScore = calculatePriorityScore(
    urgency,
    customer.annualContractValue,
    100 // New alert, full recency score
  );

  return {
    id: generateAlertId(),
    customerId: customer.id,
    customerName: customer.name,
    customerCompany: customer.company,
    alertType: rule.type,
    priority: rule.priority,
    title: rule.title,
    description: rule.descriptionTemplate(/* trigger data */),
    trigger: extractTriggerInfo(customer, rule),
    recommendedActions: rule.recommendedActions,
    createdAt: new Date().toISOString(),
    customerValue: customer.annualContractValue,
    priorityScore
  };
}
```

**Component Integration Example**:

```typescript
// src/app/page.tsx

'use client';

import { useState, useEffect } from 'react';
import CustomerSelector from '@/components/CustomerSelector';
import CustomerHealthDisplay from '@/components/CustomerHealthDisplay';
import PredictiveAlertsWidget from '@/components/PredictiveAlertsWidget';
import { mockCustomers } from '@/data/mock-customers';

export default function DashboardPage() {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const handleCustomerSelect = (customerId: string) => {
    setSelectedCustomerId(customerId);
    const customer = mockCustomers.find(c => c.id === customerId);
    setSelectedCustomer(customer || null);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Customer Intelligence Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Selector */}
        <div className="lg:col-span-1">
          <CustomerSelector
            onCustomerSelect={handleCustomerSelect}
            selectedCustomerId={selectedCustomerId}
          />
        </div>

        {/* Health Display */}
        <div className="lg:col-span-1">
          {selectedCustomerId && (
            <CustomerHealthDisplay customerId={selectedCustomerId} showTrend />
          )}
        </div>

        {/* Alerts Widget */}
        <div className="lg:col-span-1">
          <PredictiveAlertsWidget
            customerId={selectedCustomerId || undefined}
            maxAlerts={5}
          />
        </div>
      </div>
    </div>
  );
}
```

**Testing Checklist**:

**Health Score Tests**:
- Test perfect scores (all factors = 100)
- Test poor scores (all factors = 0)
- Test mixed factor scores
- Test boundary conditions (exactly 30, 70, 100)
- Test with missing optional data
- Test with invalid negative values
- Test trend calculation with various histories

**Alert Rule Tests**:
- Test each rule trigger condition independently
- Test each rule with values just below/above thresholds
- Test cooldown period enforcement
- Test deduplication logic
- Test priority score calculation
- Test alert creation with all fields populated
- Test with multiple simultaneous alerts

**Integration Tests**:
- Test customer selection triggering health recalculation
- Test customer selection triggering alert re-evaluation
- Test loading states for all components
- Test error states for all components
- Test responsive layout at breakpoints
- Test rapid customer selection changes
- Test alert dismissal and action tracking

**Performance Tests**:
- Measure health calculation time with realistic data
- Measure alert evaluation time with all rules
- Measure component render time
- Test with 100+ customers
- Monitor memory usage over time

**Future Enhancements** (Out of scope for workshop):
- Historical alert analytics and effectiveness tracking
- Machine learning for dynamic threshold tuning
- Configurable alert rules through admin interface
- Email/Slack notifications for high-priority alerts
- Alert assignment and workflow management
- A/B testing framework for alert optimization
- Predictive churn modeling with ML
- Integration with CRM systems
- Real-time WebSocket updates for multi-user dashboards
- Advanced visualization and reporting
