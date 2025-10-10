/**
 * Alert Engine
 *
 * Core alert evaluation system that monitors customer health and triggers
 * predictive alerts for customer success teams.
 *
 * Implements 5 alert types:
 * 1. Payment Risk (high priority)
 * 2. Engagement Cliff (high priority)
 * 3. Contract Expiration Risk (high priority)
 * 4. Support Ticket Spike (medium priority)
 * 5. Feature Adoption Stall (medium priority)
 */

import { Customer } from '@/data/mock-customers';
import { CustomerHealthData } from '@/lib/healthCalculator';
import type { AlertRule, AlertType, CustomerAlert, AlertTrigger } from './types/alerts';
import type { HealthScoreHistory } from './types/intelligence';
import type { MarketIntelligence } from './types/intelligence';

// ==================== Alert Rule Definitions ====================

/**
 * Payment Risk Alert Rule
 * Triggers when payment is overdue or health score drops significantly
 */
const PAYMENT_RISK_RULE: AlertRule = {
  type: 'payment_risk',
  priority: 'high',
  baseUrgency: 90,
  cooldownDays: 7,
  slaHours: 4,
  title: 'Payment Risk Detected',
  evaluationFunction: (customer: Customer, healthData: CustomerHealthData, history?: HealthScoreHistory) => {
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
  descriptionTemplate: (trigger: AlertTrigger, customer: Customer) => {
    return `Payment risk detected for ${customer.company}. ${trigger.condition}. Immediate follow-up required to prevent account escalation.`;
  },
  recommendedActions: [
    'Contact customer regarding payment status within 4 hours',
    'Review payment terms and identify any billing issues',
    'Escalate to account executive for high-value accounts (ARR > $100K)',
    'Document conversation and secure payment commitment',
    'Set follow-up reminder for 48 hours if not resolved'
  ]
};

/**
 * Engagement Cliff Alert Rule
 * Triggers when customer engagement drops significantly
 */
const ENGAGEMENT_CLIFF_RULE: AlertRule = {
  type: 'engagement_cliff',
  priority: 'high',
  baseUrgency: 85,
  cooldownDays: 7,
  slaHours: 8,
  title: 'Engagement Cliff Detected',
  evaluationFunction: (customer: Customer, healthData: CustomerHealthData, history?: HealthScoreHistory) => {
    if (!history || history.scores.length < 4) {
      return false; // Need at least 4 data points for trend analysis
    }

    // Calculate 30-day rolling average login frequency
    const recentScores = history.scores.slice(-30);
    if (recentScores.length === 0) return false;

    const avgLoginFrequency = recentScores.reduce((sum, s) => {
      return sum + (s.breakdown.engagementScore / 10); // Rough estimate
    }, 0) / recentScores.length;

    const currentFrequency = healthData.engagement.loginFrequency;

    // Check if drop > 50%
    const dropPercent = ((avgLoginFrequency - currentFrequency) / avgLoginFrequency) * 100;

    if (dropPercent <= 50) {
      return false;
    }

    // Check if sustained for 3+ days (last 3 scores)
    const last3Scores = history.scores.slice(-3);
    const allBelowThreshold = last3Scores.every(s => {
      const estimatedFreq = s.breakdown.engagementScore / 10;
      return estimatedFreq < (avgLoginFrequency * 0.5);
    });

    return allBelowThreshold;
  },
  descriptionTemplate: (trigger: AlertTrigger, customer: Customer) => {
    return `${customer.company} has experienced a ${trigger.actualValue}% drop in login frequency over the past 3 days. This sustained engagement decline requires immediate investigation.`;
  },
  recommendedActions: [
    'Schedule check-in call within 8 hours to understand usage changes',
    'Identify potential blockers or technical issues',
    'Assess competitive threats or internal champion changes',
    'Offer product training or support session',
    'Review account health and create action plan'
  ]
};

/**
 * Contract Expiration Risk Alert Rule
 * Triggers when contract is expiring soon with poor health
 */
const CONTRACT_EXPIRATION_RISK_RULE: AlertRule = {
  type: 'contract_expiration_risk',
  priority: 'high',
  baseUrgency: 80,
  cooldownDays: 14,
  slaHours: 24,
  title: 'Contract Expiration Risk',
  evaluationFunction: (customer: Customer, healthData: CustomerHealthData, history?: HealthScoreHistory) => {
    // Contract must be expiring within 90 days
    if (healthData.contract.daysUntilRenewal >= 90) {
      return false;
    }

    // Check health score
    const currentScore = history && history.scores.length > 0
      ? history.scores[history.scores.length - 1].score
      : 50; // Default to warning level if no history

    // Condition 1: Health score < 50
    if (currentScore < 50) {
      return true;
    }

    // Condition 2: No engagement in past 14 days
    if (healthData.engagement.lastLoginDays >= 14) {
      return true;
    }

    return false;
  },
  descriptionTemplate: (trigger: AlertTrigger, customer: Customer) => {
    return `${customer.company} contract expires in ${trigger.actualValue} days with ${trigger.condition}. Immediate renewal conversation required.`;
  },
  recommendedActions: [
    'Immediate renewal conversation with key stakeholder',
    'Conduct value demonstration and ROI review',
    'Address concerns and negotiate renewal terms',
    'Engage executive sponsor for strategic accounts',
    'Document renewal blockers and create mitigation plan'
  ]
};

/**
 * Support Ticket Spike Alert Rule
 * Triggers when support tickets increase significantly
 */
const SUPPORT_TICKET_SPIKE_RULE: AlertRule = {
  type: 'support_ticket_spike',
  priority: 'medium',
  baseUrgency: 60,
  cooldownDays: 7,
  slaHours: 48,
  title: 'Support Ticket Spike',
  evaluationFunction: (customer: Customer, healthData: CustomerHealthData) => {
    // Condition 1: More than 3 open tickets
    if (healthData.support.openTicketCount > 3) {
      return true;
    }

    // Condition 2: Any escalations
    if (healthData.support.escalationCount > 0) {
      return true;
    }

    // Condition 3: Average resolution time > 72 hours
    if (healthData.support.averageResolutionTime > 72) {
      return true;
    }

    return false;
  },
  descriptionTemplate: (trigger: AlertTrigger, customer: Customer) => {
    return `${customer.company} is experiencing ${trigger.condition}. Proactive support outreach recommended to prevent escalation.`;
  },
  recommendedActions: [
    'Review ticket themes and identify root causes',
    'Proactive support outreach to customer',
    'Discuss process improvements with customer',
    'Create product feedback loop for recurring issues',
    'Schedule follow-up to ensure resolution'
  ]
};

/**
 * Feature Adoption Stall Alert Rule
 * Triggers when customer isn't adopting new features
 */
const FEATURE_ADOPTION_STALL_RULE: AlertRule = {
  type: 'feature_adoption_stall',
  priority: 'medium',
  baseUrgency: 50,
  cooldownDays: 30,
  slaHours: 168, // 1 week
  title: 'Feature Adoption Stall',
  evaluationFunction: (customer: Customer, healthData: CustomerHealthData) => {
    // Only for growing accounts (ARR > $50K)
    if (!customer.annualContractValue || customer.annualContractValue <= 50000) {
      return false;
    }

    // Check feature usage depth < 30%
    const featureUsagePercent = healthData.engagement.featureUsageCount / 100; // Assume 100 total features

    if (featureUsagePercent >= 0.3) {
      return false;
    }

    // Check if last login is recent (active but shallow usage)
    if (healthData.engagement.lastLoginDays > 7) {
      return false; // If not logging in, this is an engagement issue, not adoption
    }

    return true;
  },
  descriptionTemplate: (trigger: AlertTrigger, customer: Customer) => {
    return `${customer.company} is using only ${trigger.actualValue}% of available features despite being a growing account. Growth opportunity identified.`;
  },
  recommendedActions: [
    'Schedule feature training session or webinar',
    'Explore use cases and consulting opportunities',
    'Align on product roadmap and future needs',
    'Review success plan and expansion opportunities',
    'Identify potential for cross-sell or upsell'
  ]
};

// Array of all alert rules
const ALERT_RULES: AlertRule[] = [
  PAYMENT_RISK_RULE,
  ENGAGEMENT_CLIFF_RULE,
  CONTRACT_EXPIRATION_RISK_RULE,
  SUPPORT_TICKET_SPIKE_RULE,
  FEATURE_ADOPTION_STALL_RULE
];

// ==================== Helper Functions ====================

/**
 * Finds a health score snapshot from N days ago
 */
function findScoreNDaysAgo(history: HealthScoreHistory, days: number) {
  const targetDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  // Find closest score to target date
  let closest = null;
  let minDiff = Infinity;

  for (const snapshot of history.scores) {
    const snapshotDate = new Date(snapshot.timestamp);
    const diff = Math.abs(snapshotDate.getTime() - targetDate.getTime());

    if (diff < minDiff) {
      minDiff = diff;
      closest = snapshot;
    }
  }

  return closest;
}

/**
 * Checks if an alert is in cooldown period
 */
function isInCooldownPeriod(
  customerId: string,
  alertType: AlertType,
  recentAlerts: CustomerAlert[],
  cooldownDays: number
): boolean {
  const cooldownMs = cooldownDays * 24 * 60 * 60 * 1000;
  const now = Date.now();

  return recentAlerts.some(alert =>
    alert.customerId === customerId &&
    alert.alertType === alertType &&
    (now - new Date(alert.createdAt).getTime()) < cooldownMs
  );
}

/**
 * Extracts trigger information from health data
 */
function extractTriggerInfo(
  healthData: CustomerHealthData,
  rule: AlertRule,
  history?: HealthScoreHistory
): AlertTrigger {
  let condition = '';
  let threshold: number | string = 0;
  let actualValue: number | string = 0;

  switch (rule.type) {
    case 'payment_risk':
      if (healthData.payment.daysSinceLastPayment > 30) {
        condition = 'Payment overdue > 30 days';
        threshold = 30;
        actualValue = healthData.payment.daysSinceLastPayment;
      } else if (healthData.payment.overdueAmount / healthData.payment.totalContractValue > 0.15) {
        condition = 'Overdue amount > 15% of contract value';
        threshold = '15%';
        actualValue = `${Math.round((healthData.payment.overdueAmount / healthData.payment.totalContractValue) * 100)}%`;
      } else {
        condition = 'Health score dropped > 20 points in 7 days';
        threshold = 20;
        actualValue = history ? Math.round(findScoreNDaysAgo(history, 7)?.score || 0 - history.scores[history.scores.length - 1].score) : 0;
      }
      break;

    case 'engagement_cliff':
      condition = 'Login frequency dropped > 50%';
      threshold = '50%';
      actualValue = '52%'; // Simplified for demo
      break;

    case 'contract_expiration_risk':
      condition = healthData.engagement.lastLoginDays >= 14
        ? 'No engagement in past 14 days'
        : 'Health score < 50';
      threshold = healthData.engagement.lastLoginDays >= 14 ? 14 : 50;
      actualValue = healthData.contract.daysUntilRenewal;
      break;

    case 'support_ticket_spike':
      if (healthData.support.openTicketCount > 3) {
        condition = `${healthData.support.openTicketCount} open support tickets`;
        threshold = 3;
        actualValue = healthData.support.openTicketCount;
      } else if (healthData.support.escalationCount > 0) {
        condition = 'Escalated support tickets detected';
        threshold = 0;
        actualValue = healthData.support.escalationCount;
      } else {
        condition = 'Average resolution time > 72 hours';
        threshold = 72;
        actualValue = Math.round(healthData.support.averageResolutionTime);
      }
      break;

    case 'feature_adoption_stall':
      condition = 'Feature usage < 30%';
      threshold = '30%';
      actualValue = `${Math.round((healthData.engagement.featureUsageCount / 100) * 100)}%`;
      break;
  }

  return {
    type: rule.type,
    condition,
    threshold,
    actualValue
  };
}

/**
 * Calculates priority score for an alert
 */
export function calculateAlertPriorityScore(
  alert: Partial<CustomerAlert>,
  customerARR: number,
  marketContext?: MarketIntelligence
): number {
  // Get base urgency from alert type
  const rule = ALERT_RULES.find(r => r.type === alert.alertType);
  const urgency = rule?.baseUrgency || 50;

  // Customer value normalized to 0-100 (using $1M as max reference)
  const customerValue = Math.min(100, (customerARR / 1_000_000) * 100);

  // Recency score (100 for new, decays to 50 over 7 days)
  const ageHours = alert.createdAt
    ? (Date.now() - new Date(alert.createdAt).getTime()) / 3600000
    : 0;
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

/**
 * Creates an alert instance from a triggered rule
 */
function createAlert(
  customer: Customer,
  rule: AlertRule,
  healthData: CustomerHealthData,
  history?: HealthScoreHistory,
  marketIntelligence?: MarketIntelligence
): CustomerAlert {
  const trigger = extractTriggerInfo(healthData, rule, history);
  const alertId = `alert-${customer.id}-${rule.type}-${Date.now()}`;

  const baseAlert: Partial<CustomerAlert> = {
    alertType: rule.type,
    priority: rule.priority,
    createdAt: new Date().toISOString()
  };

  const priorityScore = calculateAlertPriorityScore(
    baseAlert,
    customer.annualContractValue || 0,
    marketIntelligence
  );

  const alert: CustomerAlert = {
    id: alertId,
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
      id: `${alertId}-action-${i}`,
      description: desc,
      completed: false
    })),
    createdAt: new Date().toISOString(),
    customerValue: customer.annualContractValue || 0,
    priorityScore,
    slaDeadline: rule.slaHours
      ? new Date(Date.now() + rule.slaHours * 3600000).toISOString()
      : undefined
  };

  return alert;
}

// ==================== Public API ====================

/**
 * Evaluates all alert rules for a customer and returns triggered alerts
 */
export function evaluateCustomerAlerts(
  customer: Customer,
  healthData: CustomerHealthData,
  history?: HealthScoreHistory,
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
    try {
      if (rule.evaluationFunction(customer, healthData, history)) {
        const alert = createAlert(customer, rule, healthData, history, marketIntelligence);
        triggeredAlerts.push(alert);
      }
    } catch (error) {
      console.error(`Error evaluating rule ${rule.type} for customer ${customer.id}:`, error);
      // Continue with other rules
    }
  }

  // Sort by priority score (highest first)
  return triggeredAlerts.sort((a, b) => b.priorityScore - a.priorityScore);
}

/**
 * Gets all alert rules (useful for displaying available alert types)
 */
export function getAlertRules(): AlertRule[] {
  return [...ALERT_RULES];
}

/**
 * Gets a specific alert rule by type
 */
export function getAlertRule(type: AlertType): AlertRule | undefined {
  return ALERT_RULES.find(r => r.type === type);
}
