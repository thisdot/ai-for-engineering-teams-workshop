/**
 * Market Intelligence Widget Component
 * Displays market sentiment and news analysis for customer companies
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import type {
  MarketIntelligenceData,
  MarketSentiment
} from '@/lib/services/marketIntelligenceService';

interface MarketIntelligenceWidgetProps {
  companyName: string | null;
  className?: string;
}

/**
 * Formats an ISO date string to relative time (e.g., "2 hours ago")
 * @param isoDate - ISO 8601 date string
 * @returns Formatted relative time string
 */
function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  return `${days} day${days !== 1 ? 's' : ''} ago`;
}

/**
 * Truncates text to specified length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Sentiment Badge Component
 * Displays color-coded sentiment indicator
 */
function SentimentBadge({ sentiment }: { sentiment: MarketSentiment }) {
  const styles = {
    positive: 'bg-green-100 text-green-700 border-green-500',
    neutral: 'bg-yellow-100 text-yellow-700 border-yellow-500',
    negative: 'bg-red-100 text-red-700 border-red-500'
  };

  const labels = {
    positive: 'Positive',
    neutral: 'Neutral',
    negative: 'Negative'
  };

  return (
    <span className={`px-4 py-2 rounded-full border-2 font-semibold text-sm ${styles[sentiment]}`}>
      {labels[sentiment]}
    </span>
  );
}

/**
 * Loading State Component
 * Displays skeleton loader while fetching data
 */
function LoadingState() {
  return (
    <div className="rounded-lg shadow-md p-6 bg-white animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>
  );
}

/**
 * Error State Component
 * Displays error message with retry option
 */
function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="rounded-lg shadow-md p-6 bg-white">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4">
          <svg
            className="w-6 h-6 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Failed to Load Market Intelligence
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

/**
 * Empty State Component
 * Displays message when no company is selected
 */
function EmptyState() {
  return (
    <div className="rounded-lg shadow-md p-6 bg-white">
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Company Selected
        </h3>
        <p className="text-gray-600">
          Select a customer to view market intelligence
        </p>
      </div>
    </div>
  );
}

/**
 * Market Intelligence Widget
 * Main component that fetches and displays market intelligence data
 */
export default function MarketIntelligenceWidget({
  companyName,
  className = ''
}: MarketIntelligenceWidgetProps) {
  const [data, setData] = useState<MarketIntelligenceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches market intelligence data from API
   */
  const fetchData = useCallback(async () => {
    if (!companyName) {
      setData(null);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/market-intelligence/${encodeURIComponent(companyName)}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch market intelligence');
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [companyName]);

  /**
   * Fetch data when company name changes
   */
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /**
   * Render empty state when no company is selected
   */
  if (!companyName) {
    return (
      <div className={className}>
        <EmptyState />
      </div>
    );
  }

  /**
   * Render loading state while fetching
   */
  if (isLoading) {
    return (
      <div className={className}>
        <LoadingState />
      </div>
    );
  }

  /**
   * Render error state if fetch failed
   */
  if (error) {
    return (
      <div className={className}>
        <ErrorState error={error} onRetry={fetchData} />
      </div>
    );
  }

  /**
   * Render data display when data is available
   */
  if (data) {
    return (
      <div className={className}>
        <div className="rounded-lg shadow-md p-6 bg-white max-w-2xl">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Market Intelligence
              </h2>
              <p className="text-sm text-gray-600">{data.company}</p>
            </div>
            {data.cached && (
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                Cached
              </span>
            )}
          </div>

          {/* Sentiment Badge */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Market Sentiment
            </h3>
            <SentimentBadge sentiment={data.sentiment} />
          </div>

          {/* Metadata Bar */}
          <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
              <span>{data.newsCount} articles</span>
            </div>
            <div className="flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Updated {formatRelativeTime(data.lastUpdated)}</span>
            </div>
          </div>

          {/* Headlines List */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Recent Headlines
            </h3>
            <div className="space-y-4">
              {data.headlines.map((headline, index) => (
                <div
                  key={index}
                  className="border-l-4 border-gray-200 pl-4 py-2 hover:border-blue-500 transition-colors"
                >
                  <h4 className="font-medium text-gray-900 mb-1 leading-snug">
                    {truncateText(headline.title, 100)}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-gray-600">
                    <span className="font-medium">{headline.source}</span>
                    <span>•</span>
                    <span>{formatRelativeTime(headline.publishedAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Attribution */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Powered by Mock Data for Workshop Demonstration
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
