# Spec: Predictive Intelligence System

## Feature: Unified Predictive Intelligence Platform

### Context

The Predictive Intelligence System is a comprehensive early warning and insights platform that combines predictive customer alerts with real-time market intelligence to provide customer success teams with actionable insights for proactive customer relationship management. This system correlates internal customer health signals with external market conditions to identify risks and opportunities before they impact business outcomes.

**Purpose and Role**:
- Provide unified view of customer risk signals from internal and external sources
- Generate predictive alerts for customer churn risk and relationship health issues
- Correlate market intelligence with customer engagement patterns
- Enable proactive intervention before customer issues escalate
- Demonstrate advanced AI collaboration for complex rule design and pattern recognition
- Show integration of multiple data sources into cohesive intelligence layer
- Support data-driven customer success strategy and prioritization

**System Integration**:
- **Alert Rules Engine**: Multi-tier priority system with configurable thresholds (`src/lib/alertEngine.ts`)
- **Market Intelligence Service**: Real-time sentiment and news analysis (`src/lib/services/marketIntelligenceService.ts`)
- **Correlation Engine**: Links market events with customer behavior changes (`src/lib/correlationEngine.ts`)
- **Intelligence Dashboard**: Unified UI displaying alerts and market context (`src/components/PredictiveIntelligenceDashboard.tsx`)
- **Data Sources**:
  - Customer health scores and trends
  - Engagement metrics and patterns
  - Payment history and contract status
  - Support ticket data
  - Market sentiment and news headlines
  - Industry trends (optional)
- **Integration Points**:
  - CustomerHealthMonitoring system for health data
  - CustomerSelector for customer context
  - Alert management system for action tracking

**User Interaction**:
- Customer success managers view unified intelligence dashboard
- High-priority alerts appear prominently with context
- Market intelligence displayed alongside customer alerts
- Users can correlate market events with customer behavior changes
- Alert actions tracked and outcomes measured
- Historical intelligence view for pattern analysis
- Primary users: CSMs, account executives, operations teams, leadership

### Requirements

**Functional Requirements - Alert Rules Engine**:

1. **Multi-Tier Alert Priority System**:

   **High Priority Alerts** (Immediate Action Required):

   a) **Payment Risk Alert**:
   - **Trigger Conditions**:
     - Payment overdue > 30 days, OR
     - Health score drops > 20 points in 7 days, OR
     - Overdue amount > 15% of contract value
   - **Priority Score Weighting**: Urgency (90/100) × Customer ARR weight
   - **Cooldown Period**: 7 days
   - **Recommended Actions**:
     - Immediate payment follow-up call
     - Review billing issues and payment terms
     - Executive escalation for high-value accounts (ARR > $100K)
     - Document conversation and commitment
   - **SLA**: Response within 4 hours

   b) **Engagement Cliff Alert**:
   - **Trigger Conditions**:
     - Login frequency drops > 50% vs 30-day rolling average, AND
     - Drop sustained for > 3 consecutive days
   - **Pattern Detection**:
     - Gradual decline vs sudden drop (different urgency)
     - Compare to customer's historical baseline (not absolute threshold)
   - **Priority Score Weighting**: Urgency (85/100) × Engagement weight
   - **Cooldown Period**: 7 days
   - **Recommended Actions**:
     - Check-in call to understand usage changes
     - Identify blockers or technical issues
     - Product training or support offer
     - Assess competitive threat
   - **SLA**: Response within 8 hours

   c) **Contract Expiration Risk Alert**:
   - **Trigger Conditions**:
     - Contract expires in < 90 days, AND
     - Health score < 50, OR
     - No engagement in past 14 days
   - **Risk Amplifiers**:
     - No auto-renew enabled (+20 urgency points)
     - Previous downgrades (-10 health score adjustment)
     - Champion turnover detected (+15 urgency points)
   - **Priority Score Weighting**: Urgency (80/100) × Contract value weight
   - **Cooldown Period**: 14 days (longer for renewal alerts)
   - **Recommended Actions**:
     - Immediate renewal conversation with stakeholder
     - Value demonstration and ROI review
     - Address concerns and negotiate terms
     - Executive sponsor engagement
   - **SLA**: Response within 24 hours

   **Medium Priority Alerts** (Monitor Closely):

   d) **Support Ticket Spike Alert**:
   - **Trigger Conditions**:
     - More than 3 support tickets in 7 days (threshold adjustable by tier), OR
     - Any escalated ticket, OR
     - Average resolution time > 72 hours
   - **Pattern Analysis**:
     - Ticket theme detection (same issue repeated)
     - Escalation velocity (time to escalate)
     - Satisfaction score trends
   - **Priority Score Weighting**: Urgency (60/100) × Support weight
   - **Cooldown Period**: 7 days
   - **Recommended Actions**:
     - Review ticket themes and root causes
     - Proactive support outreach
     - Process improvement discussion
     - Product feedback loop
   - **SLA**: Response within 48 hours

   e) **Feature Adoption Stall Alert**:
   - **Trigger Conditions**:
     - No new feature usage in 30 days, AND
     - Growing account (ARR > $50K or recent expansion), AND
     - Feature usage depth < 30% of available features
   - **Growth Opportunity Detection**:
     - Identify underutilized features relevant to customer goals
     - Cross-sell/upsell opportunity scoring
   - **Priority Score Weighting**: Urgency (50/100) × Growth potential
   - **Cooldown Period**: 30 days (longer for adoption alerts)
   - **Recommended Actions**:
     - Feature training session or webinar
     - Use case exploration and consulting
     - Product roadmap alignment
     - Success plan review
   - **SLA**: Response within 1 week

2. **Alert Prioritization Algorithm**:
   ```
   Priority Score = (Urgency × 0.4) + (Customer Value × 0.3) + (Recency × 0.15) + (Market Context × 0.15)

   Where:
   - Urgency: Alert type base urgency (0-100)
   - Customer Value: Normalized ARR (0-100, $1M = 100)
   - Recency: Time decay (100 for new, decays to 50 after 7 days)
   - Market Context: External market sentiment modifier (0-30)
   ```

3. **Alert Management Features**:
   - **Deduplication**: Prevent duplicate alerts for same customer/issue within cooldown
   - **Cooldown Periods**: Configurable per alert type (7-30 days)
   - **Alert History**: Full audit trail with timestamps and outcomes
   - **Alert Dismissal**: Require reason selection (false positive, resolved, irrelevant)
   - **Action Tracking**: Checklist completion and outcome recording
   - **Business Hours Filtering**: Optional delay of non-critical alerts to business hours
   - **Alert Assignment**: Route to specific CSM or team (optional)
   - **Snooze Functionality**: Defer alert for specified time period

**Functional Requirements - Market Intelligence Integration**:

1. **Real-Time Market Monitoring**:
   - **Company-Specific Intelligence**:
     - Market sentiment analysis (positive/neutral/negative)
     - Recent news headlines and sources
     - Industry trends affecting customer's sector
     - Competitor activity (if available)
   - **Data Sources**:
     - Mock news generation for workshop (realistic company-specific data)
     - News APIs in production (NewsAPI, Bloomberg, etc.)
   - **Update Frequency**: Every 10 minutes (configurable)
   - **Caching Strategy**: 10-minute TTL with stale-while-revalidate

2. **Market Intelligence Data Structure**:
   ```typescript
   interface MarketIntelligence {
     company: string;
     sentiment: 'positive' | 'neutral' | 'negative';
     sentimentScore: number;         // -100 to +100
     newsCount: number;
     headlines: NewsHeadline[];
     industryTrends?: string[];
     competitorActivity?: string[];
     lastUpdated: string;
     cached: boolean;
   }

   interface NewsHeadline {
     title: string;
     source: string;
     publishedAt: string;           // ISO 8601
     url?: string;
     sentiment?: 'positive' | 'neutral' | 'negative';
     relevanceScore?: number;       // 0-100
   }
   ```

3. **Sentiment Analysis**:
   - Aggregate sentiment from multiple headlines
   - Weight recent news more heavily (last 24 hours = 2x weight)
   - Identify sentiment changes (improving/declining trends)
   - Flag significant sentiment shifts (> 40 point change in 7 days)

**Functional Requirements - Correlation Engine**:

1. **Market-to-Alert Correlation**:
   - **Negative Market News + Engagement Drop**:
     - When customer company has negative market sentiment AND engagement drops
     - Amplify alert priority by 15-25%
     - Add market context to alert description
     - Suggest market-aware talking points for outreach

   - **Positive Market News + Low Engagement**:
     - When customer company has positive news BUT engagement is low
     - Create growth opportunity alert
     - Suggest expansion conversation timing
     - Identify cross-sell opportunities

   - **Contract Expiration + Market Uncertainty**:
     - When renewal approaching AND market sentiment negative
     - Increase renewal risk urgency
     - Prepare competitive positioning
     - Highlight stability and value during uncertainty

2. **Correlation Scoring**:
   ```
   Correlation Score = (Event Timing × 0.4) + (Sentiment Alignment × 0.3) + (Pattern Strength × 0.3)

   Where:
   - Event Timing: How closely market event and alert timing align (0-100)
   - Sentiment Alignment: How well sentiment matches customer behavior (0-100)
   - Pattern Strength: Historical correlation strength (0-100)
   ```

3. **Correlation Insights**:
   - Surface correlated events in alert details
   - Provide market context for customer conversations
   - Identify external factors influencing customer behavior
   - Distinguish internal vs external risk factors

**Functional Requirements - Intelligence Dashboard UI**:

1. **Unified Dashboard Layout**:
   - **Priority Alert Panel** (Top Section):
     - High-priority alerts prominently displayed
     - Color-coded by urgency (red for critical)
     - Alert count badges
     - Quick action buttons

   - **Market Intelligence Panel** (Side or Bottom):
     - Selected customer's market sentiment
     - Top 3 recent headlines
     - Sentiment trend indicator
     - "View Full Intelligence" link

   - **Correlation Insights Panel** (Center):
     - Identified correlations between alerts and market events
     - Confidence scores for correlations
     - Recommended talking points
     - Historical pattern matches

   - **Action Center** (Bottom):
     - Pending actions from alerts
     - Action completion checklist
     - Response time tracking
     - Outcome recording

2. **Alert Card Component**:
   - **Header**:
     - Priority badge (high/medium with color coding)
     - Alert type icon
     - Customer name and company
     - Time since alert created
   - **Body**:
     - Alert title and description
     - Trigger conditions summary
     - Customer health score (current)
     - Market correlation indicator (if applicable)
   - **Footer**:
     - Recommended actions (expandable)
     - Quick action buttons (dismiss, snooze, view details)
     - Assigned CSM badge

3. **Market Intelligence Card Component**:
   - **Header**:
     - Company name
     - Sentiment badge with color
     - Last updated timestamp
   - **Body**:
     - Sentiment score with trend arrow
     - News count
     - Top 3 headlines with sources
   - **Footer**:
     - "View all news" link
     - "Refresh" button

4. **Correlation Insight Component**:
   - Visual connector between alert and market event
   - Correlation confidence score (0-100%)
   - Insight summary ("Engagement drop may be related to...")
   - Recommended conversation topics
   - Dismiss if not relevant

5. **Interactive Features**:
   - **Real-time Updates**: WebSocket or polling for live alert stream
   - **Filtering**: By priority, alert type, customer tier
   - **Sorting**: By priority score, time, customer value
   - **Search**: Find alerts by customer or keyword
   - **Bulk Actions**: Dismiss/assign multiple alerts
   - **Alert Detail Modal**: Deep dive into alert context with full data

**Functional Requirements - Data Monitoring and Pattern Detection**:

1. **Real-Time Monitoring System**:
   - **Health Score Monitoring**:
     - Continuous health score tracking (5-minute intervals)
     - Threshold monitoring for alert triggers
     - Trend calculation (7-day, 30-day windows)
     - Change velocity detection (rate of decline)

   - **Engagement Pattern Analysis**:
     - Login frequency baseline calculation per customer
     - Deviation detection from personal baseline
     - Session duration and feature usage depth
     - Time-of-day and day-of-week patterns

   - **Payment Behavior Monitoring**:
     - Payment timing patterns and consistency
     - Early warning for overdue invoices (15 days before alert)
     - Payment method changes (risk signal)
     - Invoice dispute tracking

   - **Support Interaction Analysis**:
     - Ticket velocity and escalation patterns
     - Sentiment analysis from ticket text
     - First response and resolution times
     - CSAT score trends

2. **Pattern Detection Algorithms**:
   - **Anomaly Detection**: Identify unusual behavior vs customer baseline
   - **Trend Analysis**: Detect sustained directional changes
   - **Seasonality Adjustment**: Account for expected periodic variations
   - **Cohort Comparison**: Compare customer to similar customers

3. **Historical Data Requirements**:
   - Minimum 30 days of history for baseline calculation
   - 90 days recommended for accurate pattern detection
   - Rolling window calculations updated daily
   - Archived data for long-term trend analysis

**Integration Requirements**:

1. **CustomerHealthMonitoring Integration**:
   - Consume health scores and factor breakdowns
   - Receive health score change notifications
   - Access historical health data for trend analysis
   - Trigger alerts based on health thresholds

2. **CustomerSelector Integration**:
   - Display customer-specific intelligence when selected
   - Filter alerts by selected customer
   - Show customer context in alert details
   - Navigate between customers from alert cards

3. **Dashboard Widget Integration**:
   - Consistent styling with other dashboard components
   - Responsive grid layout
   - Shared state management patterns
   - Common error handling and loading states

4. **External API Integration** (Production):
   - Market intelligence APIs (NewsAPI, Bloomberg, etc.)
   - Webhook support for real-time news updates
   - API rate limiting and quota management
   - Fallback to cached data on API failures

### Constraints

**Technical Stack**:
- Next.js 15+ with App Router
- React 19 with TypeScript (strict mode)
- Tailwind CSS 4.x for all styling
- Pure function architecture for alert rules and correlation logic
- Mock data for workshop (realistic simulation)
- No external state management libraries (React hooks only)

**File Structure**:
```
src/
├── lib/
│   ├── alertEngine.ts                    # Alert rules and evaluation
│   ├── correlationEngine.ts              # Market-to-alert correlation
│   ├── patternDetection.ts               # Pattern analysis utilities
│   ├── services/
│   │   └── marketIntelligenceService.ts  # Market data service
│   └── types/
│       ├── alerts.ts                     # Alert type definitions
│       ├── intelligence.ts               # Intelligence type definitions
│       └── correlation.ts                # Correlation type definitions
├── components/
│   ├── PredictiveIntelligenceDashboard.tsx  # Main dashboard
│   ├── AlertCard.tsx                     # Individual alert card
│   ├── AlertDetailModal.tsx              # Alert details modal
│   ├── MarketIntelligenceCard.tsx        # Market intelligence display
│   ├── CorrelationInsight.tsx            # Correlation insight component
│   ├── ActionCenter.tsx                  # Action tracking panel
│   └── AlertFilters.tsx                  # Filtering controls
├── app/
│   └── api/
│       └── intelligence/
│           ├── alerts/
│           │   └── route.ts              # Alert API endpoint
│           └── market/
│               └── [company]/
│                   └── route.ts          # Market intelligence API
└── data/
    ├── mock-customers.ts                 # Extended with intelligence data
    ├── mock-alerts.ts                    # Sample alerts for demo
    └── mock-market-data.ts               # Mock market intelligence
```

**TypeScript Definitions**:

```typescript
// src/lib/types/alerts.ts

export type AlertPriority = 'high' | 'medium';

export type AlertType =
  | 'payment_risk'
  | 'engagement_cliff'
  | 'contract_expiration_risk'
  | 'support_ticket_spike'
  | 'feature_adoption_stall';

export type AlertStatus = 'active' | 'dismissed' | 'snoozed' | 'resolved';

export type DismissalReason = 'false_positive' | 'resolved_externally' | 'not_relevant' | 'duplicate' | 'other';

export interface AlertTrigger {
  type: AlertType;
  condition: string;                    // Human-readable condition
  threshold: number | string;
  actualValue: number | string;
  comparisonPeriod?: string;           // e.g., "30 days"
}

export interface AlertRecommendedAction {
  id: string;
  description: string;
  completed: boolean;
  completedAt?: string;
  completedBy?: string;
  notes?: string;
}

export interface CustomerAlert {
  id: string;
  customerId: string;
  customerName: string;
  customerCompany: string;
  alertType: AlertType;
  priority: AlertPriority;
  status: AlertStatus;
  title: string;
  description: string;
  trigger: AlertTrigger;
  recommendedActions: AlertRecommendedAction[];
  createdAt: string;                   // ISO timestamp
  dismissedAt?: string;
  dismissReason?: DismissalReason;
  dismissNotes?: string;
  snoozedUntil?: string;
  assignedTo?: string;                 // CSM user ID
  customerValue: number;               // ARR
  priorityScore: number;               // 0-100 calculated score
  slaDeadline?: string;                // ISO timestamp
  correlationId?: string;              // Link to correlated market event
  marketContext?: string;              // Brief market context if relevant
}

export interface AlertRule {
  type: AlertType;
  priority: AlertPriority;
  baseUrgency: number;                 // 0-100
  evaluationFunction: (
    customer: Customer,
    healthData: CustomerHealthData,
    history: HealthScoreHistory
  ) => boolean;
  cooldownDays: number;
  title: string;
  descriptionTemplate: (trigger: AlertTrigger, customer: Customer) => string;
  recommendedActions: string[];
  slaHours?: number;                   // Response time SLA
}

export interface AlertFilter {
  priorities?: AlertPriority[];
  types?: AlertType[];
  statuses?: AlertStatus[];
  customerIds?: string[];
  assignedTo?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface AlertSummary {
  totalActive: number;
  highPriority: number;
  mediumPriority: number;
  overdueCount: number;                // Past SLA deadline
  dismissedToday: number;
  resolvedToday: number;
  averageResponseTime: number;         // hours
}
```

```typescript
// src/lib/types/intelligence.ts

export type MarketSentiment = 'positive' | 'neutral' | 'negative';

export interface NewsHeadline {
  id: string;
  title: string;
  source: string;
  publishedAt: string;                 // ISO timestamp
  url?: string;
  sentiment?: MarketSentiment;
  relevanceScore?: number;             // 0-100
  summary?: string;
}

export interface MarketIntelligence {
  company: string;
  sentiment: MarketSentiment;
  sentimentScore: number;              // -100 to +100
  sentimentTrend: 'improving' | 'stable' | 'declining';
  newsCount: number;
  headlines: NewsHeadline[];
  industryTrends?: string[];
  competitorActivity?: string[];
  lastUpdated: string;
  cached: boolean;
  confidence: number;                  // 0-100, data quality indicator
}

export interface SentimentChange {
  previousScore: number;
  currentScore: number;
  changeMagnitude: number;             // Absolute change
  changePercent: number;
  periodDays: number;
  significant: boolean;                // Change > threshold
}
```

```typescript
// src/lib/types/correlation.ts

export interface MarketEventCorrelation {
  id: string;
  alertId: string;
  customerId: string;
  marketEvent: {
    type: 'sentiment_change' | 'news_headline' | 'industry_trend';
    description: string;
    sentiment: MarketSentiment;
    timestamp: string;
  };
  correlationScore: number;            // 0-100
  confidence: number;                  // 0-100
  eventTiming: number;                 // 0-100, how close in time
  sentimentAlignment: number;          // 0-100, how well sentiment matches behavior
  patternStrength: number;             // 0-100, historical pattern match
  insight: string;                     // Human-readable insight
  conversationTopics: string[];        // Suggested discussion points
  createdAt: string;
  dismissed: boolean;
}

export interface CorrelationPattern {
  pattern: string;                     // Pattern identifier
  description: string;
  occurrences: number;                 // Historical frequency
  successRate: number;                 // 0-100, how often correlation was meaningful
  lastSeen: string;
}
```

```typescript
// Component Props

interface PredictiveIntelligenceDashboardProps {
  customerId?: string;                 // Optional customer filter
  className?: string;
}

interface AlertCardProps {
  alert: CustomerAlert;
  onDismiss: (alertId: string, reason: DismissalReason, notes?: string) => void;
  onSnooze: (alertId: string, until: string) => void;
  onActionComplete: (alertId: string, actionId: string, notes?: string) => void;
  onClick: () => void;                 // Open detail modal
  showMarketContext?: boolean;
  compact?: boolean;
}

interface AlertDetailModalProps {
  alert: CustomerAlert;
  customer: Customer;
  healthData: CustomerHealthData;
  marketIntelligence?: MarketIntelligence;
  correlation?: MarketEventCorrelation;
  onClose: () => void;
  onDismiss: (reason: DismissalReason, notes?: string) => void;
  onActionComplete: (actionId: string, notes?: string) => void;
}

interface MarketIntelligenceCardProps {
  company: string;
  data: MarketIntelligence;
  onRefresh: () => void;
  expanded?: boolean;
  className?: string;
}

interface CorrelationInsightProps {
  correlation: MarketEventCorrelation;
  onDismiss: () => void;
  onViewDetails: () => void;
}

interface AlertFiltersProps {
  currentFilters: AlertFilter;
  onFilterChange: (filters: AlertFilter) => void;
  alertSummary: AlertSummary;
}
```

**Algorithm Design Specifications**:

**Alert Priority Score Calculation**:
```typescript
function calculateAlertPriorityScore(
  alert: CustomerAlert,
  customerARR: number,
  marketContext?: MarketIntelligence
): number {
  // Base urgency from alert rule (0-100)
  const urgency = getBaseUrgency(alert.alertType, alert.priority);

  // Customer value normalized to 0-100 (using $1M as max reference)
  const customerValue = Math.min(100, (customerARR / 1_000_000) * 100);

  // Recency score (100 for new, decays to 50 over 7 days)
  const ageHours = (Date.now() - new Date(alert.createdAt).getTime()) / 3600000;
  const recency = Math.max(50, 100 - (ageHours / 168) * 50); // 168 hours = 7 days

  // Market context modifier (0-30 additional points)
  let marketModifier = 0;
  if (marketContext) {
    if (marketContext.sentiment === 'negative' && alert.alertType === 'engagement_cliff') {
      marketModifier = 25; // Strong negative correlation
    } else if (marketContext.sentiment === 'positive' && alert.alertType === 'feature_adoption_stall') {
      marketModifier = 20; // Growth opportunity
    } else if (marketContext.sentimentTrend === 'declining') {
      marketModifier = 15; // General risk amplification
    }
  }

  // Weighted calculation
  const baseScore = (urgency * 0.4) + (customerValue * 0.3) + (recency * 0.15);
  const finalScore = baseScore + (marketModifier * 0.15);

  return Math.min(100, Math.round(finalScore));
}
```

**Market-to-Alert Correlation Algorithm**:
```typescript
function calculateCorrelation(
  alert: CustomerAlert,
  marketIntelligence: MarketIntelligence,
  historicalPatterns: CorrelationPattern[]
): MarketEventCorrelation | null {
  // Event timing: How close are alert and market event in time?
  const alertTime = new Date(alert.createdAt).getTime();
  const marketUpdateTime = new Date(marketIntelligence.lastUpdated).getTime();
  const timeDiffHours = Math.abs(alertTime - marketUpdateTime) / 3600000;
  const eventTiming = Math.max(0, 100 - (timeDiffHours / 168) * 100); // Decay over 7 days

  // Sentiment alignment: Does sentiment match behavior?
  let sentimentAlignment = 0;
  if (marketIntelligence.sentiment === 'negative') {
    if (alert.alertType === 'engagement_cliff' || alert.alertType === 'payment_risk') {
      sentimentAlignment = 80 + Math.abs(marketIntelligence.sentimentScore / 2);
    } else if (alert.alertType === 'contract_expiration_risk') {
      sentimentAlignment = 70;
    }
  } else if (marketIntelligence.sentiment === 'positive') {
    if (alert.alertType === 'feature_adoption_stall') {
      sentimentAlignment = 75; // Growth opportunity
    }
  }

  // Pattern strength: Have we seen this correlation before?
  const matchingPattern = findMatchingPattern(
    alert.alertType,
    marketIntelligence.sentiment,
    historicalPatterns
  );
  const patternStrength = matchingPattern ? matchingPattern.successRate : 30; // Default to low

  // Overall correlation score
  const correlationScore = (eventTiming * 0.4) + (sentimentAlignment * 0.3) + (patternStrength * 0.3);

  // Only return correlation if score is meaningful (> 40)
  if (correlationScore < 40) {
    return null;
  }

  return {
    id: generateCorrelationId(),
    alertId: alert.id,
    customerId: alert.customerId,
    marketEvent: {
      type: 'sentiment_change',
      description: `Market sentiment for ${marketIntelligence.company} is ${marketIntelligence.sentiment}`,
      sentiment: marketIntelligence.sentiment,
      timestamp: marketIntelligence.lastUpdated
    },
    correlationScore: Math.round(correlationScore),
    confidence: Math.round((correlationScore + patternStrength) / 2),
    eventTiming: Math.round(eventTiming),
    sentimentAlignment: Math.round(sentimentAlignment),
    patternStrength: Math.round(patternStrength),
    insight: generateInsight(alert, marketIntelligence, correlationScore),
    conversationTopics: generateConversationTopics(alert, marketIntelligence),
    createdAt: new Date().toISOString(),
    dismissed: false
  };
}
```

**Performance Constraints**:
- Alert evaluation: < 100ms for all rules per customer
- Correlation calculation: < 50ms per alert-market pair
- Dashboard render: < 300ms with 50 alerts
- Real-time update latency: < 2 seconds from event to UI
- Market intelligence fetch: < 2 seconds (including API delay)
- Alert list filtering: < 50ms for 1000+ alerts

**Design Constraints**:
- Dashboard max width: 1400px on desktop
- Alert card height: 120px compact, 240px expanded
- Market intelligence card: 300px × 400px
- Color coding:
  - High priority: `bg-red-50`, `border-red-500`, `text-red-700`
  - Medium priority: `bg-yellow-50`, `border-yellow-500`, `text-yellow-700`
  - Positive sentiment: `bg-green-50`, `border-green-500`, `text-green-700`
  - Neutral sentiment: `bg-gray-50`, `border-gray-500`, `text-gray-700`
  - Negative sentiment: `bg-red-50`, `border-red-500`, `text-red-700`
- Typography: System font stack, 14px base
- Responsive breakpoints: 768px (tablet), 1024px (desktop), 1280px (wide)

**Security Constraints**:
- Alert data sanitization (no sensitive PII in descriptions)
- Market data validation and sanitization
- Rate limiting on alert API (100 requests/minute per user)
- Rate limiting on market API (20 requests/minute per user)
- Input validation for all filter parameters
- XSS prevention in alert descriptions and market headlines
- No executable code in alert or market data

**Data Retention Constraints**:
- Active alerts: Indefinite until dismissed/resolved
- Dismissed alerts: 90 days retention
- Alert history: 1 year retention
- Market intelligence cache: 10 minutes TTL
- Correlation history: 90 days retention
- Pattern learning data: 1 year retention

### Acceptance Criteria

**Alert Engine - High Priority Alerts**:
- [ ] Payment Risk alert triggers when payment overdue > 30 days
- [ ] Payment Risk alert triggers when health score drops > 20 points in 7 days
- [ ] Payment Risk alert triggers when overdue amount > 15% of contract value
- [ ] Engagement Cliff alert triggers when login frequency drops > 50% vs 30-day average
- [ ] Engagement Cliff alert requires 3 consecutive days of sustained drop
- [ ] Contract Expiration Risk alert triggers for contract < 90 days + health score < 50
- [ ] Contract Expiration Risk alert triggers for contract < 90 days + no engagement 14 days
- [ ] All high priority alerts assigned correct base urgency scores
- [ ] All high priority alerts have SLA deadlines calculated correctly

**Alert Engine - Medium Priority Alerts**:
- [ ] Support Ticket Spike alert triggers for > 3 tickets in 7 days
- [ ] Support Ticket Spike alert triggers for any escalated ticket
- [ ] Support Ticket Spike alert triggers for avg resolution time > 72 hours
- [ ] Feature Adoption Stall alert triggers for 0 new features in 30 days (growing accounts)
- [ ] Feature Adoption Stall alert only triggers for accounts with ARR > $50K
- [ ] Feature Adoption Stall alert checks feature usage depth < 30%
- [ ] All medium priority alerts assigned correct base urgency scores

**Alert Management**:
- [ ] Alert deduplication prevents duplicate alerts within cooldown period
- [ ] Cooldown periods enforced correctly per alert type (7-30 days)
- [ ] Payment Risk cooldown: 7 days
- [ ] Engagement Cliff cooldown: 7 days
- [ ] Contract Expiration Risk cooldown: 14 days
- [ ] Support Ticket Spike cooldown: 7 days
- [ ] Feature Adoption Stall cooldown: 30 days
- [ ] Alert dismissal requires reason selection
- [ ] Alert dismissal records timestamp and user
- [ ] Alert snooze functionality works with specified date
- [ ] Alert action tracking updates completion status
- [ ] Alert history maintains full audit trail

**Alert Prioritization**:
- [ ] Priority score calculation uses correct weights (urgency 40%, value 30%, recency 15%, market 15%)
- [ ] Customer value normalized correctly ($1M = 100)
- [ ] Recency decays from 100 to 50 over 7 days
- [ ] Market context modifier applied correctly (0-30 points)
- [ ] Priority score capped at 100
- [ ] Alerts sorted by priority score in UI

**Market Intelligence Integration**:
- [ ] Market intelligence fetched for customer companies
- [ ] Sentiment analysis aggregates multiple headlines
- [ ] Recent news weighted more heavily (last 24 hours = 2x)
- [ ] Sentiment score calculated correctly (-100 to +100 scale)
- [ ] Sentiment trend detected (improving/stable/declining)
- [ ] Significant sentiment shifts flagged (> 40 point change in 7 days)
- [ ] Market intelligence cached with 10-minute TTL
- [ ] Headlines limited to top 3 most relevant
- [ ] Last updated timestamp displayed accurately

**Correlation Engine**:
- [ ] Correlation calculated between alerts and market events
- [ ] Event timing score decays correctly over 7 days
- [ ] Sentiment alignment scored correctly for alert-sentiment pairs
- [ ] Negative sentiment + engagement cliff: high alignment (80+)
- [ ] Negative sentiment + payment risk: high alignment (80+)
- [ ] Positive sentiment + adoption stall: medium alignment (75)
- [ ] Pattern strength uses historical success rate
- [ ] Correlation score threshold enforced (> 40 to display)
- [ ] Correlation insights generated with meaningful text
- [ ] Conversation topics suggested based on correlation

**Intelligence Dashboard UI**:
- [ ] Priority Alert Panel displays high-priority alerts prominently
- [ ] Alert count badges show correct counts by priority
- [ ] Market Intelligence Panel shows sentiment and headlines
- [ ] Correlation Insights Panel displays identified correlations
- [ ] Action Center shows pending actions from alerts
- [ ] Dashboard responsive at all breakpoints (768px, 1024px, 1280px)
- [ ] Real-time updates refresh dashboard without full page reload
- [ ] Loading states display while fetching data
- [ ] Error states display with retry options

**Alert Card Component**:
- [ ] Priority badge displays with correct color (red/yellow)
- [ ] Alert type icon displays
- [ ] Customer name and company display
- [ ] Time since alert created displays (relative time)
- [ ] Alert title and description display
- [ ] Trigger conditions summary displays
- [ ] Current health score displays
- [ ] Market correlation indicator shows when applicable
- [ ] Recommended actions expandable/collapsible
- [ ] Quick action buttons work (dismiss, snooze, view details)
- [ ] Assigned CSM badge displays if assigned

**Market Intelligence Card Component**:
- [ ] Company name displays
- [ ] Sentiment badge displays with correct color
- [ ] Last updated timestamp displays
- [ ] Sentiment score displays with trend arrow
- [ ] News count displays
- [ ] Top 3 headlines display with sources
- [ ] "View all news" link works
- [ ] "Refresh" button triggers data reload

**Correlation Insight Component**:
- [ ] Visual connector between alert and market event displays
- [ ] Correlation confidence score displays (0-100%)
- [ ] Insight summary displays with meaningful text
- [ ] Recommended conversation topics display
- [ ] Dismiss button removes correlation from view
- [ ] Correlation dismissed state persists

**Alert Detail Modal**:
- [ ] Full alert details display
- [ ] Customer context displays (health score, ARR, tier)
- [ ] Detailed trigger explanation displays
- [ ] Recommended actions checklist displays
- [ ] Action completion checkbox updates state
- [ ] Action notes can be added
- [ ] Dismiss alert workflow works
- [ ] Dismissal reason required
- [ ] Historical alerts for same customer display
- [ ] Market intelligence displays if available
- [ ] Correlation details display if available
- [ ] Close button closes modal

**Filtering and Search**:
- [ ] Filter by priority works (high/medium/all)
- [ ] Filter by alert type works (all 5 types)
- [ ] Filter by status works (active/dismissed/snoozed)
- [ ] Filter by customer works
- [ ] Filter by date range works
- [ ] Multiple filters combine correctly (AND logic)
- [ ] Alert count updates with filter changes
- [ ] Search by customer name works
- [ ] Search by keyword in alert text works
- [ ] Clear filters button resets all filters

**Data Monitoring and Pattern Detection**:
- [ ] Health score monitoring runs at 5-minute intervals
- [ ] Threshold monitoring detects alert trigger conditions
- [ ] Trend calculation uses correct time windows (7-day, 30-day)
- [ ] Change velocity calculated correctly (rate of decline)
- [ ] Engagement baseline calculated per customer (not global)
- [ ] Deviation detection compares to personal baseline
- [ ] Payment timing patterns tracked
- [ ] Support ticket velocity calculated correctly
- [ ] Anomaly detection identifies unusual behavior
- [ ] Seasonality adjustments applied (if applicable)

**Integration**:
- [ ] Integrates with CustomerHealthMonitoring system
- [ ] Consumes health scores and factor breakdowns
- [ ] Accesses historical health data for trends
- [ ] Integrates with CustomerSelector
- [ ] Displays customer-specific intelligence when selected
- [ ] Filters alerts by selected customer
- [ ] Navigates between customers from alert cards
- [ ] Consistent styling with dashboard widgets
- [ ] Shared error handling patterns
- [ ] Common loading state patterns

**Performance**:
- [ ] Alert evaluation < 100ms for all rules per customer
- [ ] Correlation calculation < 50ms per alert-market pair
- [ ] Dashboard render < 300ms with 50 alerts
- [ ] Real-time updates < 2 seconds latency
- [ ] Market intelligence fetch < 2 seconds
- [ ] Alert list filtering < 50ms for 1000+ alerts
- [ ] No memory leaks from polling or WebSocket connections
- [ ] Virtual scrolling for alert lists > 100 items

**Security**:
- [ ] Alert data sanitized (no sensitive PII)
- [ ] Market data validated and sanitized
- [ ] Rate limiting enforced on alert API (100/min)
- [ ] Rate limiting enforced on market API (20/min)
- [ ] Input validation on all filter parameters
- [ ] XSS prevention in alert descriptions
- [ ] XSS prevention in market headlines
- [ ] No executable code in alert or market data

**Code Quality**:
- [ ] TypeScript strict mode passes
- [ ] All functions have JSDoc comments
- [ ] No `any` types used
- [ ] Pure functions for alert rules and correlation
- [ ] Proper error handling in all async operations
- [ ] ESLint passes with no violations
- [ ] No console errors or warnings
- [ ] Comprehensive unit tests for alert rules
- [ ] Comprehensive unit tests for correlation algorithm

### Implementation Notes

**Implementation Order**:

1. **Phase 1: Alert Engine Core** (Highest Priority)
   - Create alert type definitions and interfaces
   - Implement 5 alert rule functions
   - Implement alert evaluation engine
   - Implement deduplication and cooldown logic
   - Implement priority score calculation
   - Test alert rules with sample customer data

2. **Phase 2: Market Intelligence** (High Priority)
   - Extend MarketIntelligenceService with sentiment analysis
   - Implement sentiment aggregation from headlines
   - Implement sentiment trend detection
   - Create mock market data with realistic variety
   - Test market intelligence fetch and caching

3. **Phase 3: Correlation Engine** (High Priority)
   - Implement correlation calculation algorithm
   - Implement pattern matching logic
   - Create correlation insight generation
   - Generate conversation topic suggestions
   - Test correlation scenarios

4. **Phase 4: UI Components** (Medium Priority)
   - Implement AlertCard component
   - Implement AlertDetailModal component
   - Implement MarketIntelligenceCard component
   - Implement CorrelationInsight component
   - Implement AlertFilters component
   - Test UI components with mock data

5. **Phase 5: Dashboard Integration** (Medium Priority)
   - Implement PredictiveIntelligenceDashboard
   - Integrate all components
   - Implement real-time updates (polling)
   - Add filtering and search
   - End-to-end testing

**Alert Rule Implementation Example**:

```typescript
// src/lib/alertEngine.ts

const ALERT_RULES: AlertRule[] = [
  {
    type: 'payment_risk',
    priority: 'high',
    baseUrgency: 90,
    cooldownDays: 7,
    slaHours: 4,
    title: 'Payment Risk Detected',
    evaluationFunction: (customer, healthData, history) => {
      // Condition 1: Payment overdue > 30 days
      if (healthData.payment.daysSinceLastPayment > 30) {
        return true;
      }

      // Condition 2: Health score drop > 20 points in 7 days
      if (history && history.scores.length >= 2) {
        const latestScore = history.scores[history.scores.length - 1].score;
        const sevenDaysAgo = findScoreNDaysAgo(history, 7);

        if (sevenDaysAgo && (sevenDaysAgo.score - latestScore) > 20) {
          return true;
        }
      }

      // Condition 3: Overdue amount > 15% of contract value
      const overduePercent = healthData.payment.overdueAmount / healthData.payment.totalContractValue;
      if (overduePercent > 0.15) {
        return true;
      }

      return false;
    },
    descriptionTemplate: (trigger, customer) => {
      return `Payment risk detected for ${customer.company}. ${trigger.condition}. Immediate follow-up required to prevent account escalation.`;
    },
    recommendedActions: [
      'Contact customer regarding payment status within 4 hours',
      'Review payment terms and identify any billing issues',
      'Escalate to account executive for high-value accounts (ARR > $100K)',
      'Document conversation and secure payment commitment',
      'Set follow-up reminder for 48 hours if not resolved'
    ]
  },

  {
    type: 'engagement_cliff',
    priority: 'high',
    baseUrgency: 85,
    cooldownDays: 7,
    slaHours: 8,
    title: 'Engagement Cliff Detected',
    evaluationFunction: (customer, healthData, history) => {
      // Calculate 30-day rolling average for this customer
      const rollingAverage = calculateRollingAverage(customer.id, 30);

      if (!rollingAverage) {
        return false; // Need baseline data
      }

      // Current login frequency
      const currentFrequency = healthData.engagement.loginFrequency;

      // Check if drop > 50%
      const dropPercent = ((rollingAverage - currentFrequency) / rollingAverage) * 100;

      if (dropPercent <= 50) {
        return false; // Not enough drop
      }

      // Check if sustained for 3+ days
      const recentData = getRecentEngagementData(customer.id, 3);
      const allDaysBelowThreshold = recentData.every(day => {
        return day.loginFrequency < (rollingAverage * 0.5);
      });

      return allDaysBelowThreshold;
    },
    descriptionTemplate: (trigger, customer) => {
      return `${customer.company} has experienced a ${trigger.actualValue}% drop in login frequency over the past 3 days. This sustained engagement decline requires immediate investigation.`;
    },
    recommendedActions: [
      'Schedule check-in call within 8 hours to understand usage changes',
      'Identify potential blockers or technical issues',
      'Assess competitive threats or internal champion changes',
      'Offer product training or support session',
      'Review account health and create action plan'
    ]
  },

  // ... other alert rules
];

export function evaluateCustomerAlerts(
  customer: Customer,
  healthData: CustomerHealthData,
  history: HealthScoreHistory,
  marketIntelligence?: MarketIntelligence,
  recentAlerts: CustomerAlert[] = []
): CustomerAlert[] {
  const triggeredAlerts: CustomerAlert[] = [];

  for (const rule of ALERT_RULES) {
    // Check cooldown
    if (isInCooldownPeriod(customer.id, rule.type, recentAlerts, rule.cooldownDays)) {
      continue;
    }

    // Evaluate rule
    if (rule.evaluationFunction(customer, healthData, history)) {
      const alert = createAlert(customer, rule, healthData, marketIntelligence);
      triggeredAlerts.push(alert);
    }
  }

  // Sort by priority score
  return triggeredAlerts.sort((a, b) => b.priorityScore - a.priorityScore);
}

function createAlert(
  customer: Customer,
  rule: AlertRule,
  healthData: CustomerHealthData,
  marketIntelligence?: MarketIntelligence
): CustomerAlert {
  const trigger = extractTriggerInfo(healthData, rule);
  const priorityScore = calculateAlertPriorityScore(
    { alertType: rule.type, priority: rule.priority } as any,
    customer.annualContractValue,
    marketIntelligence
  );

  const alert: CustomerAlert = {
    id: generateAlertId(),
    customerId: customer.id,
    customerName: customer.name,
    customerCompany: customer.company,
    alertType: rule.type,
    priority: rule.priority,
    status: 'active',
    title: rule.title,
    description: rule.descriptionTemplate(trigger, customer),
    trigger,
    recommendedActions: rule.recommendedActions.map((desc, i) => ({
      id: `${customer.id}-${rule.type}-action-${i}`,
      description: desc,
      completed: false
    })),
    createdAt: new Date().toISOString(),
    customerValue: customer.annualContractValue,
    priorityScore,
    slaDeadline: rule.slaHours
      ? new Date(Date.now() + rule.slaHours * 3600000).toISOString()
      : undefined
  };

  // Add market context if correlation exists
  if (marketIntelligence) {
    const correlation = calculateCorrelation(alert, marketIntelligence, []);
    if (correlation) {
      alert.correlationId = correlation.id;
      alert.marketContext = correlation.insight;
    }
  }

  return alert;
}
```

**Mock Data Strategy**:

```typescript
// src/data/mock-alerts.ts

import { CustomerAlert } from '@/lib/types/alerts';

export const mockAlerts: CustomerAlert[] = [
  {
    id: 'alert-001',
    customerId: 'customer-1',
    customerName: 'John Doe',
    customerCompany: 'Acme Corp',
    alertType: 'payment_risk',
    priority: 'high',
    status: 'active',
    title: 'Payment Risk Detected',
    description: 'Payment overdue by 35 days. Immediate follow-up required.',
    trigger: {
      type: 'payment_risk',
      condition: 'Payment overdue > 30 days',
      threshold: 30,
      actualValue: 35,
      comparisonPeriod: 'current'
    },
    recommendedActions: [
      { id: 'action-1', description: 'Contact customer regarding payment', completed: false },
      { id: 'action-2', description: 'Review billing issues', completed: false },
      { id: 'action-3', description: 'Escalate if needed', completed: false }
    ],
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    customerValue: 150000,
    priorityScore: 87,
    slaDeadline: new Date(Date.now() + 3 * 3600000).toISOString(), // 3 hours from now
    correlationId: 'corr-001',
    marketContext: 'Acme Corp has negative market sentiment, which may be impacting payment behavior.'
  },
  // ... more alerts
];

export const mockMarketData: Record<string, MarketIntelligence> = {
  'Acme Corp': {
    company: 'Acme Corp',
    sentiment: 'negative',
    sentimentScore: -45,
    sentimentTrend: 'declining',
    newsCount: 8,
    headlines: [
      {
        id: 'news-1',
        title: 'Acme Corp Reports Quarterly Loss',
        source: 'Bloomberg',
        publishedAt: new Date(Date.now() - 7200000).toISOString(),
        sentiment: 'negative',
        relevanceScore: 95
      },
      {
        id: 'news-2',
        title: 'Acme Corp Faces Increased Competition',
        source: 'TechCrunch',
        publishedAt: new Date(Date.now() - 14400000).toISOString(),
        sentiment: 'negative',
        relevanceScore: 87
      },
      {
        id: 'news-3',
        title: 'Industry Analysts Downgrade Acme Corp',
        source: 'Wall Street Journal',
        publishedAt: new Date(Date.now() - 21600000).toISOString(),
        sentiment: 'negative',
        relevanceScore: 92
      }
    ],
    lastUpdated: new Date().toISOString(),
    cached: false,
    confidence: 85
  }
};
```

**Dashboard Component Structure**:

```typescript
// src/components/PredictiveIntelligenceDashboard.tsx

'use client';

import { useState, useEffect, useMemo } from 'react';
import { CustomerAlert, AlertFilter, AlertSummary } from '@/lib/types/alerts';
import { MarketIntelligence } from '@/lib/types/intelligence';
import { MarketEventCorrelation } from '@/lib/types/correlation';
import AlertCard from './AlertCard';
import AlertDetailModal from './AlertDetailModal';
import MarketIntelligenceCard from './MarketIntelligenceCard';
import CorrelationInsight from './CorrelationInsight';
import AlertFilters from './AlertFilters';

interface Props {
  customerId?: string;
  className?: string;
}

export default function PredictiveIntelligenceDashboard({ customerId, className }: Props) {
  const [alerts, setAlerts] = useState<CustomerAlert[]>([]);
  const [marketData, setMarketData] = useState<Record<string, MarketIntelligence>>({});
  const [correlations, setCorrelations] = useState<MarketEventCorrelation[]>([]);
  const [filters, setFilters] = useState<AlertFilter>({});
  const [selectedAlert, setSelectedAlert] = useState<CustomerAlert | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch alerts and market data
  useEffect(() => {
    fetchAlerts();
    fetchMarketData();
  }, [customerId]);

  // Calculate alert summary
  const alertSummary: AlertSummary = useMemo(() => {
    const active = alerts.filter(a => a.status === 'active');
    return {
      totalActive: active.length,
      highPriority: active.filter(a => a.priority === 'high').length,
      mediumPriority: active.filter(a => a.priority === 'medium').length,
      overdueCount: active.filter(a =>
        a.slaDeadline && new Date(a.slaDeadline) < new Date()
      ).length,
      dismissedToday: alerts.filter(a =>
        a.dismissedAt && isToday(a.dismissedAt)
      ).length,
      resolvedToday: alerts.filter(a =>
        a.status === 'resolved' && isToday(a.createdAt)
      ).length,
      averageResponseTime: calculateAverageResponseTime(alerts)
    };
  }, [alerts]);

  // Filter alerts
  const filteredAlerts = useMemo(() => {
    return applyFilters(alerts, filters);
  }, [alerts, filters]);

  // Render
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${className}`}>
      {/* Priority Alerts Panel */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Predictive Alerts</h2>
            <AlertFilters
              currentFilters={filters}
              onFilterChange={setFilters}
              alertSummary={alertSummary}
            />
          </div>

          {isLoading ? (
            <LoadingState />
          ) : filteredAlerts.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-4">
              {filteredAlerts.map(alert => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onDismiss={handleDismiss}
                  onSnooze={handleSnooze}
                  onActionComplete={handleActionComplete}
                  onClick={() => setSelectedAlert(alert)}
                  showMarketContext
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Market Intelligence & Correlations Panel */}
      <div className="space-y-6">
        {/* Market Intelligence Card */}
        {customerId && marketData[customerId] && (
          <MarketIntelligenceCard
            company={marketData[customerId].company}
            data={marketData[customerId]}
            onRefresh={() => refreshMarketData(customerId)}
          />
        )}

        {/* Correlation Insights */}
        {correlations.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Correlation Insights</h3>
            <div className="space-y-3">
              {correlations.map(correlation => (
                <CorrelationInsight
                  key={correlation.id}
                  correlation={correlation}
                  onDismiss={() => dismissCorrelation(correlation.id)}
                  onViewDetails={() => {/* View details */}}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <AlertDetailModal
          alert={selectedAlert}
          customer={getCustomer(selectedAlert.customerId)}
          healthData={getHealthData(selectedAlert.customerId)}
          marketIntelligence={marketData[selectedAlert.customerCompany]}
          correlation={correlations.find(c => c.alertId === selectedAlert.id)}
          onClose={() => setSelectedAlert(null)}
          onDismiss={handleDismiss}
          onActionComplete={handleActionComplete}
        />
      )}
    </div>
  );
}
```

**Testing Checklist**:

**Alert Rule Tests**:
- Test payment risk with each trigger condition independently
- Test engagement cliff with various drop percentages (49%, 50%, 51%)
- Test engagement cliff sustained drop requirement (2 days vs 3 days)
- Test contract expiration with various combinations of conditions
- Test support ticket spike with exact threshold (3 tickets)
- Test feature adoption stall with ARR threshold ($49K vs $50K vs $51K)
- Test cooldown period enforcement (alert within cooldown vs after)
- Test alert deduplication (same customer/type)

**Correlation Tests**:
- Test negative sentiment + engagement cliff correlation (should be high)
- Test positive sentiment + engagement cliff correlation (should be low)
- Test neutral sentiment correlation (should be medium or none)
- Test event timing decay (same day vs 7 days apart)
- Test correlation threshold (score 39 vs 40 vs 41)
- Test pattern strength influence on correlation
- Test conversation topic generation

**UI Integration Tests**:
- Test alert list display with 0, 1, 50, 100+ alerts
- Test filtering by each filter type
- Test combined filters
- Test search functionality
- Test alert card click opens modal
- Test dismiss workflow (requires reason)
- Test snooze workflow (requires date)
- Test action completion tracking
- Test market intelligence display
- Test correlation insight display
- Test responsive layout at breakpoints

**Performance Tests**:
- Profile alert evaluation with 100 customers
- Profile correlation calculation with 50 alerts
- Test dashboard render time with 50 alerts
- Test filtering performance with 1000 alerts
- Monitor memory usage during long sessions
- Test real-time update performance

**Future Enhancements** (Out of scope for workshop):
- Machine learning for dynamic threshold tuning
- Advanced pattern recognition with ML models
- Real-time WebSocket updates instead of polling
- Email/Slack notifications for high-priority alerts
- Alert assignment and workflow routing
- Team collaboration features
- Advanced analytics and reporting dashboard
- Custom alert rule builder (no-code)
- Integration with CRM systems (Salesforce, HubSpot)
- Mobile app for alert notifications
- Predictive churn scoring with ML
