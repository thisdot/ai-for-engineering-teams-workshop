/**
 * CorrelationInsight Component
 *
 * Displays correlation between customer alerts and market events.
 * Shows correlation confidence score, insight summary, and recommended
 * conversation topics for customer success managers.
 */

'use client';

import type { MarketEventCorrelation } from '@/lib/types/correlation';

interface CorrelationInsightProps {
  correlation: MarketEventCorrelation;
  onDismiss: () => void;
  onViewDetails: () => void;
}

/**
 * Confidence Score Badge Component
 */
function ConfidenceBadge({ confidence }: { confidence: number }) {
  const getConfidenceColor = (score: number) => {
    if (score >= 70) return 'bg-green-100 text-green-700 border-green-500';
    if (score >= 50) return 'bg-yellow-100 text-yellow-700 border-yellow-500';
    return 'bg-gray-100 text-gray-700 border-gray-500';
  };

  const getConfidenceLabel = (score: number) => {
    if (score >= 70) return 'High';
    if (score >= 50) return 'Medium';
    return 'Low';
  };

  return (
    <div className={`px-3 py-1 rounded-full border-2 ${getConfidenceColor(confidence)}`}>
      <span className="text-xs font-semibold">
        {getConfidenceLabel(confidence)} Confidence ({confidence}%)
      </span>
    </div>
  );
}

/**
 * Correlation Metrics Display Component
 */
function CorrelationMetrics({ correlation }: { correlation: MarketEventCorrelation }) {
  const metrics = [
    { label: 'Event Timing', value: correlation.eventTiming, icon: '⏱️' },
    { label: 'Sentiment Alignment', value: correlation.sentimentAlignment, icon: '🎯' },
    { label: 'Pattern Strength', value: correlation.patternStrength, icon: '📊' }
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {metrics.map((metric) => (
        <div key={metric.label} className="bg-gray-50 rounded-lg p-2 text-center">
          <div className="text-xs text-gray-600 mb-1">{metric.label}</div>
          <div className="font-semibold text-sm text-gray-900">
            <span className="mr-1">{metric.icon}</span>
            {metric.value}%
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Market Event Display Component
 */
function MarketEventDisplay({ event }: { event: MarketEventCorrelation['marketEvent'] }) {
  const sentimentColors = {
    positive: 'text-green-600',
    neutral: 'text-yellow-600',
    negative: 'text-red-600'
  };

  const sentimentEmojis = {
    positive: '📈',
    neutral: '➡️',
    negative: '📉'
  };

  return (
    <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex-shrink-0 text-2xl">{sentimentEmojis[event.sentiment]}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-blue-700 uppercase">
            {event.type.replace(/_/g, ' ')}
          </span>
          <span className={`text-xs font-medium ${sentimentColors[event.sentiment]}`}>
            {event.sentiment}
          </span>
        </div>
        <p className="text-sm text-gray-700">{event.description}</p>
      </div>
    </div>
  );
}

/**
 * Conversation Topics Component
 */
function ConversationTopics({ topics }: { topics: string[] }) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        Suggested Talking Points
      </h4>
      <ul className="space-y-1.5">
        {topics.map((topic, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
            <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">
              {index + 1}
            </span>
            <span className="flex-1">{topic}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Visual Correlation Indicator Component
 */
function CorrelationVisualIndicator({ score }: { score: number }) {
  return (
    <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${
          score >= 70 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-gray-400'
        }`}
        style={{ width: `${score}%` }}
      />
    </div>
  );
}

/**
 * Main CorrelationInsight Component
 */
export default function CorrelationInsight({
  correlation,
  onDismiss,
  onViewDetails
}: CorrelationInsightProps) {
  return (
    <div className="rounded-lg shadow border-l-4 border-l-blue-500 bg-white p-4 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900">Market Correlation Detected</h3>
        </div>

        <button
          onClick={onDismiss}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          title="Dismiss correlation"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Confidence Badge */}
      <div className="flex items-center gap-3">
        <ConfidenceBadge confidence={correlation.confidence} />
        <div className="flex-1">
          <CorrelationVisualIndicator score={correlation.correlationScore} />
        </div>
        <span className="text-sm font-medium text-gray-600">
          {correlation.correlationScore}%
        </span>
      </div>

      {/* Insight Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-start gap-2">
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <p className="text-sm text-gray-700 leading-relaxed">{correlation.insight}</p>
        </div>
      </div>

      {/* Market Event */}
      <MarketEventDisplay event={correlation.marketEvent} />

      {/* Correlation Metrics */}
      <CorrelationMetrics correlation={correlation} />

      {/* Conversation Topics */}
      {correlation.conversationTopics.length > 0 && (
        <ConversationTopics topics={correlation.conversationTopics} />
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
        <button
          onClick={onViewDetails}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          View Alert Details
        </button>

        <button
          onClick={onDismiss}
          className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
        >
          Not Relevant
        </button>

        <div className="ml-auto text-xs text-gray-500">
          ID: {correlation.id.slice(0, 8)}...
        </div>
      </div>
    </div>
  );
}
