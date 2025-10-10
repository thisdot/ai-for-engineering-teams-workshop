/**
 * Correlation Engine
 *
 * Analyzes relationships between market events and customer alerts
 * to provide contextual insights for customer success teams.
 *
 * Uses a multi-factor scoring algorithm to determine if external market
 * conditions are influencing customer behavior and alert triggers.
 */

import type { CustomerAlert } from './types/alerts';
import type { MarketIntelligence } from './types/intelligence';
import type {
  MarketEventCorrelation,
  CorrelationPattern,
  CorrelationConfig
} from './types/correlation';

// ==================== Constants ====================

const DEFAULT_CONFIG: CorrelationConfig = {
  minimumCorrelationScore: 40,
  timingDecayDays: 7,
  enablePatternLearning: true,
  sentimentWeights: {
    negative_engagement_cliff: 85,
    negative_payment_risk: 80,
    negative_contract_expiration: 70,
    positive_feature_adoption_stall: 75,
    neutral_any: 30
  }
};

// Mock historical patterns (in production, this would be learned from data)
const HISTORICAL_PATTERNS: CorrelationPattern[] = [
  {
    pattern: 'negative_sentiment_engagement_drop',
    description: 'Negative market sentiment correlates with engagement decline',
    occurrences: 45,
    successRate: 82,
    lastSeen: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    pattern: 'negative_sentiment_payment_risk',
    description: 'Negative market sentiment correlates with payment delays',
    occurrences: 38,
    successRate: 75,
    lastSeen: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    pattern: 'positive_sentiment_adoption_stall',
    description: 'Positive market sentiment with low adoption suggests opportunity',
    occurrences: 22,
    successRate: 68,
    lastSeen: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// ==================== Helper Functions ====================

/**
 * Calculates how closely two events align in time
 * Returns score from 0-100, decaying over configured days
 */
function calculateEventTiming(
  alertTime: string,
  marketUpdateTime: string,
  decayDays: number = 7
): number {
  const alertDate = new Date(alertTime).getTime();
  const marketDate = new Date(marketUpdateTime).getTime();
  const timeDiffHours = Math.abs(alertDate - marketDate) / 3600000;

  // Decay linearly over decayDays (default 7 days = 168 hours)
  const decayHours = decayDays * 24;
  const score = Math.max(0, 100 - (timeDiffHours / decayHours) * 100);

  return Math.round(score);
}

/**
 * Calculates how well market sentiment aligns with customer behavior
 * Returns score from 0-100 based on sentiment-alert type pairs
 */
function calculateSentimentAlignment(
  alert: CustomerAlert,
  marketIntelligence: MarketIntelligence,
  config: CorrelationConfig
): number {
  const sentiment = marketIntelligence.sentiment;
  const alertType = alert.alertType;

  // Check specific sentiment-alert combinations
  if (sentiment === 'negative') {
    if (alertType === 'engagement_cliff') {
      // Strong correlation: negative news + engagement drop
      return config.sentimentWeights.negative_engagement_cliff || 85;
    } else if (alertType === 'payment_risk') {
      // Strong correlation: negative news + payment issues
      return config.sentimentWeights.negative_payment_risk || 80;
    } else if (alertType === 'contract_expiration_risk') {
      // Medium correlation: negative news + renewal risk
      return config.sentimentWeights.negative_contract_expiration || 70;
    }
  } else if (sentiment === 'positive') {
    if (alertType === 'feature_adoption_stall') {
      // Growth opportunity: positive news but low adoption
      return config.sentimentWeights.positive_feature_adoption_stall || 75;
    }
  }

  // Neutral or weak correlation
  return config.sentimentWeights.neutral_any || 30;
}

/**
 * Finds matching historical pattern for this alert-sentiment pair
 */
function findMatchingPattern(
  alertType: string,
  sentiment: string,
  patterns: CorrelationPattern[]
): CorrelationPattern | null {
  const patternKey = `${sentiment}_sentiment_${alertType.replace(/_/g, '_')}`;

  return patterns.find(p =>
    p.pattern.toLowerCase().includes(sentiment) &&
    p.pattern.toLowerCase().includes(alertType.split('_')[0])
  ) || null;
}

/**
 * Generates human-readable insight from correlation
 */
function generateInsight(
  alert: CustomerAlert,
  marketIntelligence: MarketIntelligence,
  correlationScore: number
): string {
  const company = marketIntelligence.company;
  const sentiment = marketIntelligence.sentiment;
  const alertType = alert.alertType;

  const confidence = correlationScore >= 70 ? 'strongly' :
                    correlationScore >= 50 ? 'likely' : 'may be';

  if (sentiment === 'negative' && alertType === 'engagement_cliff') {
    return `${company}'s engagement decline ${confidence} relates to recent negative market sentiment. Market challenges may be impacting team focus and product usage.`;
  } else if (sentiment === 'negative' && alertType === 'payment_risk') {
    return `${company}'s payment delays ${confidence} correlate with negative market conditions. Financial pressures may be affecting payment capacity.`;
  } else if (sentiment === 'negative' && alertType === 'contract_expiration_risk') {
    return `${company}'s renewal risk ${confidence} relates to current market uncertainty. Budget constraints and strategic shifts are likely under review.`;
  } else if (sentiment === 'positive' && alertType === 'feature_adoption_stall') {
    return `${company} is experiencing positive market momentum but hasn't expanded feature usage. Strong opportunity for growth conversation and upsell.`;
  } else if (sentiment === 'neutral') {
    return `${company}'s ${alertType.replace(/_/g, ' ')} appears independent of market conditions. Focus on internal factors and relationship quality.`;
  }

  return `${company}'s current situation may be influenced by market conditions. Consider market context in customer conversation.`;
}

/**
 * Generates conversation topics based on correlation
 */
function generateConversationTopics(
  alert: CustomerAlert,
  marketIntelligence: MarketIntelligence
): string[] {
  const topics: string[] = [];
  const sentiment = marketIntelligence.sentiment;
  const alertType = alert.alertType;

  if (sentiment === 'negative') {
    topics.push('Acknowledge awareness of market challenges their company is facing');
    topics.push('Position your product as stability during uncertain times');

    if (alertType === 'engagement_cliff') {
      topics.push('Ask how market conditions are affecting their team and priorities');
      topics.push('Offer additional support or training during transition period');
    } else if (alertType === 'payment_risk') {
      topics.push('Show flexibility on payment terms if needed');
      topics.push('Demonstrate ROI and value during cost-conscious period');
    } else if (alertType === 'contract_expiration_risk') {
      topics.push('Emphasize partnership and long-term value');
      topics.push('Explore creative pricing or phased approaches');
    }
  } else if (sentiment === 'positive') {
    topics.push('Congratulate them on positive market news and momentum');
    topics.push('Position yourself as partner in their growth journey');

    if (alertType === 'feature_adoption_stall') {
      topics.push('Explore how additional features can support expansion');
      topics.push('Discuss upsell opportunities that align with growth');
      topics.push('Share use cases from similar high-growth companies');
    }
  } else {
    topics.push('Focus conversation on relationship quality and product value');
    topics.push('Understand internal factors driving current situation');
  }

  return topics;
}

// ==================== Public API ====================

/**
 * Calculates correlation between an alert and market intelligence
 * Returns null if correlation score is below threshold
 */
export function calculateCorrelation(
  alert: CustomerAlert,
  marketIntelligence: MarketIntelligence,
  historicalPatterns: CorrelationPattern[] = HISTORICAL_PATTERNS,
  config: CorrelationConfig = DEFAULT_CONFIG
): MarketEventCorrelation | null {
  // Calculate correlation components
  const eventTiming = calculateEventTiming(
    alert.createdAt,
    marketIntelligence.lastUpdated,
    config.timingDecayDays
  );

  const sentimentAlignment = calculateSentimentAlignment(
    alert,
    marketIntelligence,
    config
  );

  // Find matching historical pattern
  const matchingPattern = config.enablePatternLearning
    ? findMatchingPattern(alert.alertType, marketIntelligence.sentiment, historicalPatterns)
    : null;

  const patternStrength = matchingPattern?.successRate || 30; // Default to low if no pattern

  // Calculate overall correlation score
  // Weights: timing 40%, sentiment alignment 30%, pattern strength 30%
  const correlationScore = Math.round(
    (eventTiming * 0.4) +
    (sentimentAlignment * 0.3) +
    (patternStrength * 0.3)
  );

  // Only return correlation if score is meaningful
  if (correlationScore < config.minimumCorrelationScore) {
    return null;
  }

  // Calculate confidence (combination of correlation score and pattern strength)
  const confidence = Math.round((correlationScore + patternStrength) / 2);

  // Generate insights and conversation topics
  const insight = generateInsight(alert, marketIntelligence, correlationScore);
  const conversationTopics = generateConversationTopics(alert, marketIntelligence);

  return {
    id: `corr-${alert.id}-${Date.now()}`,
    alertId: alert.id,
    customerId: alert.customerId,
    marketEvent: {
      type: 'sentiment_change',
      description: `Market sentiment for ${marketIntelligence.company} is ${marketIntelligence.sentiment} (${marketIntelligence.sentimentScore})`,
      sentiment: marketIntelligence.sentiment,
      timestamp: marketIntelligence.lastUpdated
    },
    correlationScore,
    confidence,
    eventTiming,
    sentimentAlignment,
    patternStrength,
    insight,
    conversationTopics,
    createdAt: new Date().toISOString(),
    dismissed: false
  };
}

/**
 * Calculates correlations for multiple alerts at once
 * Returns array of correlations sorted by correlation score
 */
export function calculateCorrelationsForAlerts(
  alerts: CustomerAlert[],
  marketIntelligence: MarketIntelligence,
  config: CorrelationConfig = DEFAULT_CONFIG
): MarketEventCorrelation[] {
  const correlations: MarketEventCorrelation[] = [];

  for (const alert of alerts) {
    const correlation = calculateCorrelation(
      alert,
      marketIntelligence,
      HISTORICAL_PATTERNS,
      config
    );

    if (correlation) {
      correlations.push(correlation);
    }
  }

  // Sort by correlation score (highest first)
  return correlations.sort((a, b) => b.correlationScore - a.correlationScore);
}

/**
 * Gets historical correlation patterns
 * Useful for displaying pattern insights to users
 */
export function getHistoricalPatterns(): CorrelationPattern[] {
  return [...HISTORICAL_PATTERNS];
}

/**
 * Updates the configuration for correlation analysis
 */
export function setCorrelationConfig(config: Partial<CorrelationConfig>): CorrelationConfig {
  return { ...DEFAULT_CONFIG, ...config };
}
