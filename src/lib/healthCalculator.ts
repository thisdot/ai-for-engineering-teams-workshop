/**
 * Customer Health Score Calculator
 *
 * Provides comprehensive health scoring for customer relationship management.
 * Uses a multi-factor weighted algorithm to assess customer health and churn risk.
 *
 * Weighting:
 * - Payment History: 40%
 * - Engagement Metrics: 30%
 * - Contract Status: 20%
 * - Support Satisfaction: 10%
 */

// ==================== Type Definitions ====================

export interface PaymentData {
  daysSinceLastPayment: number;      // 0-365+, days since last successful payment
  averagePaymentDelay: number;        // days, 0-90+, average delay across recent payments
  overdueAmount: number;              // USD, 0+, current overdue balance
  totalContractValue: number;         // USD, total annual contract value
}

export interface EngagementData {
  loginFrequency: number;             // logins per week, 0-50+
  featureUsageCount: number;          // number of features used, 0-100+
  lastLoginDays: number;              // days since last login, 0-365+
}

export interface ContractData {
  daysUntilRenewal: number;           // 0-365+, days remaining until contract renewal
  contractValue: number;              // USD, annual contract value
  hasRecentUpgrade: boolean;          // upgraded in last 90 days
  autoRenewEnabled: boolean;          // auto-renewal is enabled
}

export interface SupportData {
  averageResolutionTime: number;      // hours, 0-168+, average ticket resolution time
  satisfactionScore: number;          // 1-5 scale, CSAT score
  escalationCount: number;            // count in last 90 days
  openTicketCount: number;            // current open tickets
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
  overallScore: number;      // 0-100, weighted combination
  riskLevel: 'healthy' | 'warning' | 'critical';
}

export class HealthCalculationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'HealthCalculationError';
  }
}

// ==================== Constants ====================

// Risk level thresholds
const RISK_LEVEL_HEALTHY_MIN = 71;
const RISK_LEVEL_WARNING_MIN = 31;

// Weighting factors
const PAYMENT_WEIGHT = 0.4;
const ENGAGEMENT_WEIGHT = 0.3;
const CONTRACT_WEIGHT = 0.2;
const SUPPORT_WEIGHT = 0.1;

// Payment scoring constants
const PAYMENT_DAYS_LATE_THRESHOLD = 30;
const PAYMENT_CRITICAL_BASELINE = 50;
const PAYMENT_DELAY_THRESHOLD = 7;
const PAYMENT_DELAY_PENALTY = 5;
const PAYMENT_OVERDUE_PERCENTAGE_THRESHOLD = 0.10; // 10%
const PAYMENT_OVERDUE_PENALTY = 20;

// Engagement scoring constants
const ENGAGEMENT_TARGET_LOGINS_PER_WEEK = 3;
const ENGAGEMENT_FEATURE_USAGE_HIGH_THRESHOLD = 0.5; // 50%
const ENGAGEMENT_FEATURE_USAGE_LOW_THRESHOLD = 0.2; // 20%
const ENGAGEMENT_TOTAL_FEATURES = 100; // Assume 100 total features
const ENGAGEMENT_LAST_LOGIN_SAFE_DAYS = 7;
const ENGAGEMENT_LAST_LOGIN_WARNING_DAYS = 30;

// Contract scoring constants
const CONTRACT_SAFE_DAYS = 180;
const CONTRACT_MONITORING_DAYS = 90;
const CONTRACT_HIGH_RISK_DAYS = 30;
const CONTRACT_AUTO_RENEW_BONUS = 20;
const CONTRACT_RECENT_UPGRADE_BONUS = 15;

// Support scoring constants
const SUPPORT_EXCELLENT_RESOLUTION_HOURS = 24;
const SUPPORT_GOOD_RESOLUTION_HOURS = 48;
const SUPPORT_ACCEPTABLE_RESOLUTION_HOURS = 72;
const SUPPORT_ESCALATION_PENALTY = 10;
const SUPPORT_OPEN_TICKET_PENALTY = 5;

// Default neutral score for missing data (reserved for future use)
// const NEUTRAL_SCORE = 70;

// ==================== Validation Functions ====================

/**
 * Validates payment data fields
 * @throws {HealthCalculationError} If data is invalid
 */
function validatePaymentData(data: PaymentData): void {
  if (data.daysSinceLastPayment < 0) {
    throw new HealthCalculationError('daysSinceLastPayment must be non-negative', 'daysSinceLastPayment');
  }
  if (data.averagePaymentDelay < 0) {
    throw new HealthCalculationError('averagePaymentDelay must be non-negative', 'averagePaymentDelay');
  }
  if (data.overdueAmount < 0) {
    throw new HealthCalculationError('overdueAmount must be non-negative', 'overdueAmount');
  }
  if (data.totalContractValue <= 0) {
    throw new HealthCalculationError('totalContractValue must be positive', 'totalContractValue');
  }
}

/**
 * Validates engagement data fields
 * @throws {HealthCalculationError} If data is invalid
 */
function validateEngagementData(data: EngagementData): void {
  if (data.loginFrequency < 0) {
    throw new HealthCalculationError('loginFrequency must be non-negative', 'loginFrequency');
  }
  if (data.featureUsageCount < 0) {
    throw new HealthCalculationError('featureUsageCount must be non-negative', 'featureUsageCount');
  }
  if (data.lastLoginDays < 0) {
    throw new HealthCalculationError('lastLoginDays must be non-negative', 'lastLoginDays');
  }
}

/**
 * Validates contract data fields
 * @throws {HealthCalculationError} If data is invalid
 */
function validateContractData(data: ContractData): void {
  if (data.daysUntilRenewal < 0) {
    throw new HealthCalculationError('daysUntilRenewal must be non-negative', 'daysUntilRenewal');
  }
  if (data.contractValue < 0) {
    throw new HealthCalculationError('contractValue must be non-negative', 'contractValue');
  }
}

/**
 * Validates support data fields
 * @throws {HealthCalculationError} If data is invalid
 */
function validateSupportData(data: SupportData): void {
  if (data.averageResolutionTime < 0) {
    throw new HealthCalculationError('averageResolutionTime must be non-negative', 'averageResolutionTime');
  }
  if (data.satisfactionScore < 1 || data.satisfactionScore > 5) {
    throw new HealthCalculationError('satisfactionScore must be between 1 and 5', 'satisfactionScore');
  }
  if (data.escalationCount < 0) {
    throw new HealthCalculationError('escalationCount must be non-negative', 'escalationCount');
  }
  if (data.openTicketCount < 0) {
    throw new HealthCalculationError('openTicketCount must be non-negative', 'openTicketCount');
  }
}

// ==================== Utility Functions ====================

/**
 * Clamps a score between 0 and 100
 */
function clampScore(score: number): number {
  return Math.max(0, Math.min(100, score));
}

/**
 * Linear interpolation between two values
 */
function lerp(value: number, min: number, max: number, outputMin: number, outputMax: number): number {
  if (value <= min) return outputMin;
  if (value >= max) return outputMax;
  const ratio = (value - min) / (max - min);
  return outputMin + ratio * (outputMax - outputMin);
}

// ==================== Scoring Functions ====================

/**
 * Calculates payment health score based on payment history
 *
 * Algorithm:
 * - Base score starts at 100
 * - Days since last payment: Linear decay after 30 days threshold
 * - Average payment delay: Penalty increases after 7-day threshold
 * - Overdue amount: Scaled penalty when > 10% of contract value
 *
 * Business Logic:
 * - Payment history is the strongest indicator of customer health (40% weight)
 * - Customers paying on time consistently receive high scores
 * - Significant overdue amounts are red flags for churn
 *
 * @param data - Payment history data
 * @returns Score from 0-100
 * @throws {HealthCalculationError} If data is invalid
 */
export function calculatePaymentScore(data: PaymentData): number {
  validatePaymentData(data);

  let score = 100;

  // Factor 1: Days since last payment
  if (data.daysSinceLastPayment >= PAYMENT_DAYS_LATE_THRESHOLD) {
    // If 30+ days late, start from critical baseline
    score = PAYMENT_CRITICAL_BASELINE;
  } else if (data.daysSinceLastPayment > 0) {
    // Linear decay from 100 to 50 over 30 days
    score = lerp(data.daysSinceLastPayment, 0, PAYMENT_DAYS_LATE_THRESHOLD, 100, PAYMENT_CRITICAL_BASELINE);
  }

  // Factor 2: Average payment delay penalty
  if (data.averagePaymentDelay > PAYMENT_DELAY_THRESHOLD) {
    const excessDays = data.averagePaymentDelay - PAYMENT_DELAY_THRESHOLD;
    score -= excessDays * PAYMENT_DELAY_PENALTY;
  }

  // Factor 3: Overdue amount relative to contract value
  const overduePercentage = data.overdueAmount / data.totalContractValue;
  if (overduePercentage > PAYMENT_OVERDUE_PERCENTAGE_THRESHOLD) {
    score -= PAYMENT_OVERDUE_PENALTY;
  }

  return clampScore(score);
}

/**
 * Calculates engagement health score based on product usage
 *
 * Algorithm:
 * - Login frequency: Weekly logins normalized to 0-100 scale
 * - Feature usage: Percentage of features used, normalized
 * - Last login recency: Decay function for stale engagement
 * - All factors averaged for final engagement score
 *
 * Business Logic:
 * - Active users are more likely to renew and expand
 * - Feature adoption indicates product value realization
 * - Recent activity is a strong positive signal
 *
 * @param data - Engagement metrics data
 * @returns Score from 0-100
 * @throws {HealthCalculationError} If data is invalid
 */
export function calculateEngagementScore(data: EngagementData): number {
  validateEngagementData(data);

  // Factor 1: Login frequency score (0-100)
  let loginScore = 100;
  if (data.loginFrequency >= ENGAGEMENT_TARGET_LOGINS_PER_WEEK) {
    loginScore = 100;
  } else if (data.loginFrequency >= 1) {
    // 1-2 logins per week: 60-80 points
    loginScore = lerp(data.loginFrequency, 1, ENGAGEMENT_TARGET_LOGINS_PER_WEEK, 60, 100);
  } else {
    // < 1 login per week: 0-50 points
    loginScore = data.loginFrequency * 50;
  }

  // Factor 2: Feature usage score (0-100)
  const featureUsagePercentage = data.featureUsageCount / ENGAGEMENT_TOTAL_FEATURES;
  let featureScore = 100;
  if (featureUsagePercentage >= ENGAGEMENT_FEATURE_USAGE_HIGH_THRESHOLD) {
    featureScore = 100;
  } else if (featureUsagePercentage >= ENGAGEMENT_FEATURE_USAGE_LOW_THRESHOLD) {
    // 20-50% usage: 60-80 points
    featureScore = lerp(featureUsagePercentage, ENGAGEMENT_FEATURE_USAGE_LOW_THRESHOLD, ENGAGEMENT_FEATURE_USAGE_HIGH_THRESHOLD, 60, 100);
  } else {
    // < 20% usage: 0-50 points
    featureScore = (featureUsagePercentage / ENGAGEMENT_FEATURE_USAGE_LOW_THRESHOLD) * 50;
  }

  // Factor 3: Last login recency score (0-100)
  let recencyScore = 100;
  if (data.lastLoginDays <= ENGAGEMENT_LAST_LOGIN_SAFE_DAYS) {
    recencyScore = 100;
  } else if (data.lastLoginDays <= ENGAGEMENT_LAST_LOGIN_WARNING_DAYS) {
    // 8-30 days: linear decay from 100 to 40
    recencyScore = lerp(data.lastLoginDays, ENGAGEMENT_LAST_LOGIN_SAFE_DAYS, ENGAGEMENT_LAST_LOGIN_WARNING_DAYS, 100, 40);
  } else {
    // 30+ days: critical penalty
    recencyScore = Math.max(0, 40 - (data.lastLoginDays - ENGAGEMENT_LAST_LOGIN_WARNING_DAYS));
  }

  // Average all three factors
  const score = (loginScore + featureScore + recencyScore) / 3;

  return clampScore(score);
}

/**
 * Calculates contract health score based on contract status
 *
 * Algorithm:
 * - Base score determined by days until renewal (risk increases as renewal approaches)
 * - Auto-renew enabled provides significant bonus
 * - Recent upgrades indicate positive momentum
 *
 * Business Logic:
 * - Renewal risk is highest in final 30 days before contract end
 * - Auto-renew customers require less intervention
 * - Recent upgrades show commitment and satisfaction
 *
 * @param data - Contract status data
 * @returns Score from 0-100
 * @throws {HealthCalculationError} If data is invalid
 */
export function calculateContractScore(data: ContractData): number {
  validateContractData(data);

  let score = 100;

  // Base score by days until renewal
  if (data.daysUntilRenewal > CONTRACT_SAFE_DAYS) {
    score = 100;
  } else if (data.daysUntilRenewal > CONTRACT_MONITORING_DAYS) {
    score = 80;
  } else if (data.daysUntilRenewal > CONTRACT_HIGH_RISK_DAYS) {
    score = 60;
  } else {
    score = 40;
  }

  // Bonuses for positive indicators
  if (data.autoRenewEnabled) {
    score += CONTRACT_AUTO_RENEW_BONUS;
  }

  if (data.hasRecentUpgrade) {
    score += CONTRACT_RECENT_UPGRADE_BONUS;
  }

  return clampScore(score);
}

/**
 * Calculates support health score based on support interactions
 *
 * Algorithm:
 * - Satisfaction score mapped directly (5-star scale to 0-100)
 * - Resolution time normalized against SLA targets
 * - Escalations and open tickets apply penalties
 * - All factors combined for support score
 *
 * Business Logic:
 * - Support satisfaction strongly correlates with retention
 * - Fast resolution times indicate smooth operations
 * - Escalations signal serious issues requiring attention
 * - Open tickets represent unresolved pain points
 *
 * @param data - Support interaction data
 * @returns Score from 0-100
 * @throws {HealthCalculationError} If data is invalid
 */
export function calculateSupportScore(data: SupportData): number {
  validateSupportData(data);

  // Factor 1: Satisfaction score (direct mapping from 1-5 to 20-100)
  const satisfactionScore = (data.satisfactionScore - 1) * 20 + 20;

  // Factor 2: Resolution time score
  let resolutionScore = 100;
  if (data.averageResolutionTime <= SUPPORT_EXCELLENT_RESOLUTION_HOURS) {
    resolutionScore = 100;
  } else if (data.averageResolutionTime <= SUPPORT_GOOD_RESOLUTION_HOURS) {
    resolutionScore = 80;
  } else if (data.averageResolutionTime <= SUPPORT_ACCEPTABLE_RESOLUTION_HOURS) {
    resolutionScore = 60;
  } else {
    resolutionScore = 40;
  }

  // Average satisfaction and resolution scores
  let score = (satisfactionScore + resolutionScore) / 2;

  // Factor 3: Escalation penalty
  score -= data.escalationCount * SUPPORT_ESCALATION_PENALTY;

  // Factor 4: Open ticket penalty
  score -= data.openTicketCount * SUPPORT_OPEN_TICKET_PENALTY;

  return clampScore(score);
}

/**
 * Calculates overall customer health score from all factors
 *
 * Algorithm:
 * - Calculates individual factor scores
 * - Applies weighted combination: Payment (40%), Engagement (30%), Contract (20%), Support (10%)
 * - Determines risk level based on overall score
 *
 * Business Logic:
 * - Payment health is weighted highest as revenue is critical
 * - Engagement is second priority as it indicates product value
 * - Contract status captures renewal risk
 * - Support is lowest weight but still meaningful
 *
 * Risk Levels:
 * - Healthy (71-100): Low churn risk, proactive engagement
 * - Warning (31-70): Monitor closely, intervention may be needed
 * - Critical (0-30): High churn risk, immediate action required
 *
 * @param data - Complete customer health data
 * @returns Health score breakdown with overall score and risk level
 * @throws {HealthCalculationError} If data is invalid
 */
export function calculateHealthScore(data: CustomerHealthData): HealthScoreBreakdown {
  // Calculate individual factor scores
  const paymentScore = calculatePaymentScore(data.payment);
  const engagementScore = calculateEngagementScore(data.engagement);
  const contractScore = calculateContractScore(data.contract);
  const supportScore = calculateSupportScore(data.support);

  // Calculate weighted overall score
  const overallScore = clampScore(
    paymentScore * PAYMENT_WEIGHT +
    engagementScore * ENGAGEMENT_WEIGHT +
    contractScore * CONTRACT_WEIGHT +
    supportScore * SUPPORT_WEIGHT
  );

  // Determine risk level
  let riskLevel: 'healthy' | 'warning' | 'critical';
  if (overallScore >= RISK_LEVEL_HEALTHY_MIN) {
    riskLevel = 'healthy';
  } else if (overallScore >= RISK_LEVEL_WARNING_MIN) {
    riskLevel = 'warning';
  } else {
    riskLevel = 'critical';
  }

  return {
    paymentScore,
    engagementScore,
    contractScore,
    supportScore,
    overallScore,
    riskLevel
  };
}

/**
 * Determines risk level from a health score
 *
 * @param score - Health score from 0-100
 * @returns Risk level classification
 */
export function getRiskLevel(score: number): 'healthy' | 'warning' | 'critical' {
  if (score >= RISK_LEVEL_HEALTHY_MIN) return 'healthy';
  if (score >= RISK_LEVEL_WARNING_MIN) return 'warning';
  return 'critical';
}
