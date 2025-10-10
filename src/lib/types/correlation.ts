/**
 * Correlation Engine Type Definitions
 *
 * Defines types for correlating market events with customer alerts
 * to provide contextual insights for customer success teams.
 */

import { MarketSentiment } from './intelligence';

/**
 * Type of market event that can be correlated
 */
export type MarketEventType = 'sentiment_change' | 'news_headline' | 'industry_trend';

/**
 * Market event that may correlate with a customer alert
 */
export interface MarketEvent {
  type: MarketEventType;
  description: string;
  sentiment: MarketSentiment;
  timestamp: string;                   // ISO timestamp
}

/**
 * Correlation between a market event and customer alert
 */
export interface MarketEventCorrelation {
  id: string;
  alertId: string;
  customerId: string;
  marketEvent: MarketEvent;
  correlationScore: number;            // 0-100
  confidence: number;                  // 0-100
  eventTiming: number;                 // 0-100, how close in time
  sentimentAlignment: number;          // 0-100, how well sentiment matches behavior
  patternStrength: number;             // 0-100, historical pattern match
  insight: string;                     // Human-readable insight
  conversationTopics: string[];        // Suggested discussion points
  createdAt: string;                   // ISO timestamp
  dismissed: boolean;
}

/**
 * Historical pattern of correlations
 * Used to improve future correlation detection
 */
export interface CorrelationPattern {
  pattern: string;                     // Pattern identifier (e.g., "negative_sentiment_engagement_drop")
  description: string;
  occurrences: number;                 // Historical frequency
  successRate: number;                 // 0-100, how often correlation was meaningful
  lastSeen: string;                    // ISO timestamp
}

/**
 * Configuration for correlation analysis
 */
export interface CorrelationConfig {
  minimumCorrelationScore: number;     // Threshold to display correlation (default 40)
  timingDecayDays: number;             // Days for timing score to decay (default 7)
  enablePatternLearning: boolean;      // Whether to use historical patterns
  sentimentWeights: {                  // Weights for different sentiment combinations
    [key: string]: number;             // Allow any sentiment-alert combination
  };
}
