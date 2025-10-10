# Spec: Health Score Calculator System

## Feature: Customer Health Score Calculator

### Context

The Health Score Calculator is a comprehensive customer health scoring system that provides predictive analytics for customer relationship health and churn risk. This feature demonstrates advanced AI collaboration for complex business logic development and algorithm design within the Customer Intelligence Dashboard.

**Purpose and Role**:
- Calculate multi-factor customer health scores on a 0-100 scale
- Provide risk level categorization (Healthy, Warning, Critical) for customer success teams
- Enable proactive intervention for at-risk customers
- Support data-driven decision making for account management
- Demonstrate transparent, explainable AI-assisted algorithm development

**System Integration**:
- Core calculation logic lives in pure functions (`src/lib/healthCalculator.ts`)
- UI component (`CustomerHealthDisplay`) integrates with existing dashboard
- Consumes customer data structure from `src/data/mock-customers.ts`
- Integrates with CustomerSelector for real-time score updates when selection changes
- Follows established dashboard component patterns and styling conventions

**User Interaction**:
- Customer success managers view health scores for selected customers
- Users can expand/collapse detailed factor breakdowns
- Real-time updates when switching between customers
- Visual color coding provides at-a-glance risk assessment
- Primary users: CSMs, account executives, and customer operations teams

### Requirements

**Functional Requirements - Core Algorithm**:

1. **Multi-Factor Scoring System**:
   - Payment History: 40% weight
   - Engagement Metrics: 30% weight
   - Contract Status: 20% weight
   - Support Satisfaction: 10% weight
   - Final score: 0-100 scale

2. **Risk Level Classification**:
   - Healthy: 71-100 (green)
   - Warning: 31-70 (yellow)
   - Critical: 0-30 (red)

3. **Individual Scoring Functions**:
   - `calculatePaymentScore()`: Evaluates payment history and timeliness
   - `calculateEngagementScore()`: Measures product usage and activity
   - `calculateContractScore()`: Assesses contract health and renewal risk
   - `calculateSupportScore()`: Analyzes support interactions and satisfaction
   - `calculateHealthScore()`: Main function combining all factors with weights

4. **Input Validation**:
   - Validate all numeric inputs are within expected ranges
   - Handle missing/null data gracefully with defaults or errors
   - Provide descriptive error messages for invalid inputs
   - Type safety enforced through TypeScript interfaces

**Functional Requirements - Data Inputs**:

**Payment History Data**:
```typescript
interface PaymentData {
  daysSinceLastPayment: number;      // 0-365+
  averagePaymentDelay: number;        // days, 0-90+
  overdueAmount: number;              // USD, 0+
  totalContractValue: number;         // USD, for percentage calculation
}
```

**Engagement Metrics**:
```typescript
interface EngagementData {
  loginFrequency: number;             // logins per week, 0-50+
  featureUsageCount: number;          // features used, 0-100+
  lastLoginDays: number;              // days since last login, 0-365+
}
```

**Contract Information**:
```typescript
interface ContractData {
  daysUntilRenewal: number;           // 0-365+
  contractValue: number;              // USD annually
  hasRecentUpgrade: boolean;          // upgraded in last 90 days
  autoRenewEnabled: boolean;
}
```

**Support Data**:
```typescript
interface SupportData {
  averageResolutionTime: number;      // hours, 0-168+
  satisfactionScore: number;          // 1-5 scale
  escalationCount: number;            // count in last 90 days
  openTicketCount: number;            // current open tickets
}
```

**Functional Requirements - UI Component**:

1. **CustomerHealthDisplay Component**:
   - Display overall health score prominently (large number)
   - Show risk level label with color coding
   - Expandable/collapsible factor breakdown section
   - Individual factor scores with labels and percentages
   - Visual progress bars or indicators for each factor
   - Loading state while calculating
   - Error state for calculation failures

2. **Real-time Updates**:
   - Recalculate when selected customer changes
   - Smooth transitions between score updates
   - No flickering or layout shifts during updates

3. **Responsive Design**:
   - Mobile: Stacked layout, collapsible details
   - Tablet: Compact horizontal factor display
   - Desktop: Full breakdown with visual indicators

**Integration Requirements**:
- Accept customer ID prop to fetch relevant data
- Integrate with CustomerSelector state management
- Use consistent error boundaries with dashboard
- Follow dashboard widget layout patterns
- Maintain color coding consistency across dashboard

### Constraints

**Technical Stack**:
- Next.js 15+ with App Router
- React 19 with TypeScript (strict mode)
- Tailwind CSS 4.x for all styling
- Pure function architecture for calculation logic
- No external calculation libraries (implement from scratch for learning)

**File Structure**:
```
src/
├── lib/
│   ├── healthCalculator.ts         # Pure calculation functions
│   └── healthCalculator.test.ts    # Unit tests (optional for workshop)
├── components/
│   └── CustomerHealthDisplay.tsx   # UI component
├── data/
│   └── mock-customers.ts           # Extended with health data
```

**TypeScript Definitions**:

```typescript
// src/lib/healthCalculator.ts

export interface PaymentData {
  daysSinceLastPayment: number;
  averagePaymentDelay: number;
  overdueAmount: number;
  totalContractValue: number;
}

export interface EngagementData {
  loginFrequency: number;
  featureUsageCount: number;
  lastLoginDays: number;
}

export interface ContractData {
  daysUntilRenewal: number;
  contractValue: number;
  hasRecentUpgrade: boolean;
  autoRenewEnabled: boolean;
}

export interface SupportData {
  averageResolutionTime: number;
  satisfactionScore: number;
  escalationCount: number;
  openTicketCount: number;
}

export interface CustomerHealthData {
  payment: PaymentData;
  engagement: EngagementData;
  contract: ContractData;
  support: SupportData;
}

export interface HealthScoreBreakdown {
  paymentScore: number;      // 0-100
  engagementScore: number;   // 0-100
  contractScore: number;     // 0-100
  supportScore: number;      // 0-100
  overallScore: number;      // 0-100
  riskLevel: 'healthy' | 'warning' | 'critical';
}

export class HealthCalculationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'HealthCalculationError';
  }
}
```

```typescript
// src/components/CustomerHealthDisplay.tsx

interface CustomerHealthDisplayProps {
  customerId: string;
  className?: string;
}
```

**Algorithm Design Specifications**:

**Payment Score Calculation (40% weight)**:
- Days since last payment: Score decreases linearly beyond 30 days
- Average payment delay: Penalty increases exponentially for delays > 7 days
- Overdue amount: Percentage of contract value, scaled impact
- Formula considerations:
  - 0 days late = 100 points
  - 30+ days late = 50 points baseline
  - Each day of average delay beyond 7 = -5 points
  - Overdue > 10% of contract value = additional -20 points

**Engagement Score Calculation (30% weight)**:
- Login frequency: Weekly logins normalized to 0-100 scale
  - Target: 3+ logins per week = 100 points
  - 1-2 logins per week = 60-80 points
  - < 1 login per week = 0-50 points
- Feature usage: Normalized by total available features
  - Using 50%+ features = 100 points
  - Using 20-50% features = 60-80 points
  - Using < 20% features = 0-50 points
- Last login recency: Decay function
  - Within 7 days = no penalty
  - 8-30 days = linear decay
  - 30+ days = critical penalty

**Contract Score Calculation (20% weight)**:
- Days until renewal: Risk increases as renewal approaches
  - > 180 days = 100 points
  - 90-180 days = 80 points
  - 30-90 days = 60 points (monitoring period)
  - < 30 days = 40 points (high risk)
- Auto-renew enabled = +20 point bonus
- Recent upgrade = +15 point bonus
- Contract value tier impacts weighting (optional sophistication)

**Support Score Calculation (10% weight)**:
- Satisfaction score: Direct mapping
  - 5.0 rating = 100 points
  - 4.0 rating = 80 points
  - 3.0 rating = 60 points
  - 2.0 rating = 40 points
  - 1.0 rating = 20 points
- Resolution time: Normalized against SLA target
  - < 24 hours = 100 points
  - 24-48 hours = 80 points
  - 48-72 hours = 60 points
  - > 72 hours = 40 points
- Escalation penalty: -10 points per escalation
- Open ticket penalty: -5 points per open ticket

**Overall Score Combination**:
```
overallScore = (paymentScore * 0.4) +
               (engagementScore * 0.3) +
               (contractScore * 0.2) +
               (supportScore * 0.1)
```

**Edge Case Handling**:
- New customers (< 30 days): Use default "healthy" assumptions for missing data
- Missing data fields: Use neutral score (70 points) for that factor
- Invalid data ranges: Throw `HealthCalculationError` with field name
- Zero contract value: Treat as validation error

**Performance Requirements**:
- Calculation execution time: < 10ms per customer
- No blocking operations in calculation functions
- Consider memoization for repeated calculations with same data
- Efficient data structure lookups
- Component render time: < 100ms including calculations

**Design Constraints**:
- Component max width: 600px on desktop
- Compact mobile layout: < 400px width
- Score display font size: 3rem (48px) minimum
- Factor breakdown: List or grid layout
- Progress bars: Height 8px, rounded
- Color coding matches dashboard standards:
  - Healthy (71-100): `text-green-600`, `bg-green-100`, `border-green-500`
  - Warning (31-70): `text-yellow-600`, `bg-yellow-100`, `border-yellow-500`
  - Critical (0-30): `text-red-600`, `bg-red-100`, `border-red-500`

**Code Quality Constraints**:
- Pure functions with no side effects
- Comprehensive JSDoc comments for all calculation functions
- Explain mathematical rationale in comments
- Document business assumptions
- Input validation on every function
- Descriptive error messages
- No magic numbers (use named constants)

**Testing Constraints** (for production, optional for workshop):
- Unit test coverage > 90% for calculation functions
- Test boundary conditions (0, 30, 70, 100 scores)
- Test edge cases (missing data, invalid inputs)
- Test mathematical accuracy with known scenarios
- Snapshot testing for error messages

### Acceptance Criteria

**Algorithm Implementation**:
- [ ] `calculatePaymentScore()` function implemented with correct weighting logic
- [ ] `calculateEngagementScore()` function implemented with normalization
- [ ] `calculateContractScore()` function implemented with renewal risk logic
- [ ] `calculateSupportScore()` function implemented with satisfaction mapping
- [ ] `calculateHealthScore()` main function combines all factors with correct weights
- [ ] All calculation functions are pure (no side effects)
- [ ] All functions include comprehensive input validation
- [ ] All functions throw `HealthCalculationError` for invalid inputs with descriptive messages
- [ ] TypeScript interfaces defined for all data structures
- [ ] Risk level classification works correctly (healthy/warning/critical)

**Edge Case Handling**:
- [ ] New customers with minimal data receive appropriate default scores
- [ ] Missing optional data fields use neutral score defaults
- [ ] Invalid data ranges (negative numbers, out-of-range values) throw errors
- [ ] Zero or null values handled gracefully without crashes
- [ ] Extreme values (365+ days, 1000+ logins) normalized appropriately

**UI Component Implementation**:
- [ ] CustomerHealthDisplay component renders overall score prominently
- [ ] Risk level label displays with correct color coding
- [ ] Factor breakdown section is expandable/collapsible
- [ ] Individual factor scores display with labels and values
- [ ] Visual progress bars or indicators show factor contributions
- [ ] Component uses 'use client' directive
- [ ] Component is fully typed with TypeScript
- [ ] Loading state displays while calculating
- [ ] Error state displays for calculation failures

**Integration**:
- [ ] Component accepts customerId prop
- [ ] Component fetches or receives customer health data
- [ ] Real-time updates when selected customer changes in CustomerSelector
- [ ] Smooth transitions between score updates (no flicker)
- [ ] Integrates into dashboard layout without breaking existing components
- [ ] Color coding consistent with other dashboard health indicators
- [ ] Responsive design works on mobile, tablet, and desktop breakpoints

**Code Quality**:
- [ ] All calculation functions have JSDoc comments explaining logic
- [ ] Mathematical formulas documented with rationale
- [ ] Business assumptions clearly stated in comments
- [ ] No magic numbers (all constants named and explained)
- [ ] TypeScript compilation passes with no errors
- [ ] No console errors or warnings in browser
- [ ] ESLint passes with no violations

**Performance**:
- [ ] Health score calculation completes in < 10ms
- [ ] Component renders in < 100ms including calculations
- [ ] No unnecessary re-calculations on re-renders
- [ ] Efficient data lookups and transformations

**Testing** (Optional for workshop):
- [ ] Unit tests for all calculation functions
- [ ] Edge case tests for boundary conditions
- [ ] Test scenarios with realistic customer data
- [ ] Error handling tests for invalid inputs
- [ ] Mathematical accuracy verification tests

### Implementation Notes

**Algorithm Development Process**:
1. Start with individual factor calculation functions
2. Test each function independently with sample data
3. Implement main `calculateHealthScore()` combining function
4. Validate weighting produces expected results
5. Refine normalization and edge case handling
6. Document business logic rationale

**Calculation Function Structure**:
```typescript
/**
 * Calculates payment health score based on payment history
 *
 * Algorithm:
 * - Days since last payment: Linear decay after 30 days
 * - Average delay: Exponential penalty beyond 7 days
 * - Overdue amount: Scaled by contract value percentage
 *
 * @param data - Payment history data
 * @returns Score from 0-100
 * @throws {HealthCalculationError} If data is invalid
 */
export function calculatePaymentScore(data: PaymentData): number {
  // Validation
  validatePaymentData(data);

  // Constants
  const DAYS_LATE_THRESHOLD = 30;
  const DELAY_THRESHOLD = 7;
  const OVERDUE_THRESHOLD = 0.10; // 10% of contract value

  // Calculation logic
  let score = 100;

  // ... implementation

  return Math.max(0, Math.min(100, score));
}
```

**UI Component Structure**:
```typescript
'use client';

import { useState, useEffect } from 'react';
import { calculateHealthScore, type CustomerHealthData, type HealthScoreBreakdown } from '@/lib/healthCalculator';

export default function CustomerHealthDisplay({ customerId }: CustomerHealthDisplayProps) {
  const [breakdown, setBreakdown] = useState<HealthScoreBreakdown | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch customer health data and calculate
    // Handle loading and error states
  }, [customerId]);

  // Render logic
}
```

**Mock Data Extension**:
Extend `src/data/mock-customers.ts` to include health data:
```typescript
export interface Customer {
  // ... existing fields
  healthData?: CustomerHealthData; // Add health data
}

// Add sample health data to mockCustomers array
```

**Testing Checklist**:
- Test with customer having perfect scores (all 100s)
- Test with customer having poor scores (all 0s)
- Test with mixed scores across factors
- Test boundary conditions (exactly 30, 70, 100)
- Test with missing data fields
- Test with invalid negative values
- Test with extremely large values
- Test risk level transitions (70→71, 30→31)
- Test responsive layout at all breakpoints
- Test expand/collapse interaction
- Test customer selection changes

**Business Logic Validation**:
- Payment weight (40%) reflects revenue criticality
- Engagement weight (30%) balances usage importance
- Contract weight (20%) captures renewal risk
- Support weight (10%) reflects operational health
- Weights sum to 100% correctly
- Risk thresholds align with business intervention points
- Algorithm explainable to stakeholders

**Future Enhancements** (Out of scope for workshop):
- Trend analysis (improving vs declining scores over time)
- Historical score tracking and visualization
- Configurable weights per customer segment
- Machine learning refinement based on actual churn data
- Predictive next-action recommendations
- A/B testing framework for algorithm variations
