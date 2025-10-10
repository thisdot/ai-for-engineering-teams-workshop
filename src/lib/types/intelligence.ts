/**
 * Intelligence System Type Definitions
 *
 * Defines types for market intelligence, health score history,
 * and trend analysis used throughout the predictive intelligence system.
 */

import { HealthScoreBreakdown } from '@/lib/healthCalculator';

export type MarketSentiment = 'positive' | 'neutral' | 'negative';
export type TrendDirection = 'improving' | 'stable' | 'declining';

/**
 * Individual news headline
 */
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

/**
 * Market intelligence data for a company
 */
export interface MarketIntelligence {
  company: string;
  sentiment: MarketSentiment;
  sentimentScore: number;              // -100 to +100
  sentimentTrend: TrendDirection;
  newsCount: number;
  headlines: NewsHeadline[];
  industryTrends?: string[];
  competitorActivity?: string[];
  lastUpdated: string;                 // ISO timestamp
  cached: boolean;
  confidence: number;                  // 0-100, data quality indicator
}

/**
 * Represents change in sentiment over time
 */
export interface SentimentChange {
  previousScore: number;
  currentScore: number;
  changeMagnitude: number;             // Absolute change
  changePercent: number;
  periodDays: number;
  significant: boolean;                // Change > threshold
}

/**
 * Historical health score data point
 */
export interface HealthScoreSnapshot {
  timestamp: string;                   // ISO timestamp
  score: number;                       // Overall health score 0-100
  breakdown: HealthScoreBreakdown;     // Full factor breakdown
  riskLevel: 'healthy' | 'warning' | 'critical';
}

/**
 * Time-series health score history for trend analysis
 */
export interface HealthScoreHistory {
  customerId: string;
  scores: HealthScoreSnapshot[];       // Ordered by timestamp (oldest first)
  trendDirection: TrendDirection;      // Overall trend over period
  averageScore: number;                // Average over period
  periodDays: number;                  // How many days of history
  volatility: number;                  // 0-100, score stability measure
}

/**
 * Engagement pattern data for baseline comparison
 */
export interface EngagementPattern {
  customerId: string;
  baselineLoginFrequency: number;      // Logins per week
  baselineFeatureUsage: number;        // Number of features used
  calculatedAt: string;                // ISO timestamp
  periodDays: number;                  // Days used to calculate baseline
}

/**
 * Payment behavior pattern
 */
export interface PaymentPattern {
  customerId: string;
  averagePaymentDelay: number;         // Days
  paymentConsistency: number;          // 0-100, how consistent payments are
  lastPaymentDate: string;             // ISO timestamp
  totalPayments: number;
  periodDays: number;
}
