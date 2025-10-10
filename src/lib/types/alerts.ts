/**
 * Alert System Type Definitions
 *
 * Defines types for the predictive alert system including alert rules,
 * alert instances, filters, and summary statistics.
 */

import { Customer } from '@/data/mock-customers';
import { CustomerHealthData } from '@/lib/healthCalculator';
import { HealthScoreHistory } from './intelligence';

export type AlertPriority = 'high' | 'medium';

export type AlertType =
  | 'payment_risk'
  | 'engagement_cliff'
  | 'contract_expiration_risk'
  | 'support_ticket_spike'
  | 'feature_adoption_stall';

export type AlertStatus = 'active' | 'dismissed' | 'snoozed' | 'resolved';

export type DismissalReason =
  | 'false_positive'
  | 'resolved_externally'
  | 'not_relevant'
  | 'duplicate'
  | 'other';

/**
 * Describes what triggered an alert
 */
export interface AlertTrigger {
  type: AlertType;
  condition: string;                    // Human-readable condition description
  threshold: number | string;           // The threshold that was exceeded
  actualValue: number | string;         // The actual value that triggered the alert
  comparisonPeriod?: string;           // e.g., "30 days", "7 days"
}

/**
 * A recommended action for addressing an alert
 */
export interface AlertRecommendedAction {
  id: string;
  description: string;
  completed: boolean;
  completedAt?: string;                // ISO timestamp
  completedBy?: string;                // User ID
  notes?: string;
}

/**
 * Complete customer alert instance
 */
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
  dismissedAt?: string;                // ISO timestamp
  dismissReason?: DismissalReason;
  dismissNotes?: string;
  snoozedUntil?: string;               // ISO timestamp
  assignedTo?: string;                 // CSM user ID
  customerValue: number;               // ARR in USD
  priorityScore: number;               // 0-100 calculated score
  slaDeadline?: string;                // ISO timestamp
  correlationId?: string;              // Link to correlated market event
  marketContext?: string;              // Brief market context if relevant
}

/**
 * Alert rule definition
 * Defines how to evaluate and generate alerts
 */
export interface AlertRule {
  type: AlertType;
  priority: AlertPriority;
  baseUrgency: number;                 // 0-100, base priority score
  evaluationFunction: (
    customer: Customer,
    healthData: CustomerHealthData,
    history?: HealthScoreHistory
  ) => boolean;
  cooldownDays: number;                // Days before same alert can trigger again
  title: string;
  descriptionTemplate: (trigger: AlertTrigger, customer: Customer) => string;
  recommendedActions: string[];
  slaHours?: number;                   // Response time SLA in hours
}

/**
 * Filter criteria for alerts
 */
export interface AlertFilter {
  priorities?: AlertPriority[];
  types?: AlertType[];
  statuses?: AlertStatus[];
  customerIds?: string[];
  assignedTo?: string[];
  dateRange?: {
    start: string;                     // ISO timestamp
    end: string;                       // ISO timestamp
  };
}

/**
 * Summary statistics for alerts
 */
export interface AlertSummary {
  totalActive: number;
  highPriority: number;
  mediumPriority: number;
  overdueCount: number;                // Past SLA deadline
  dismissedToday: number;
  resolvedToday: number;
  averageResponseTime: number;         // hours
}
