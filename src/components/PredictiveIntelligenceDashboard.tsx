/**
 * PredictiveIntelligenceDashboard Component
 *
 * Main orchestrator for the Predictive Intelligence System. Integrates alerts,
 * market intelligence, and correlation analysis into a unified dashboard.
 * Fetches and manages state for alerts, filters, and correlations.
 */

'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { mockCustomers } from '@/data/mock-customers';
import { evaluateCustomerAlerts } from '@/lib/alertEngine';
import { calculateCorrelation } from '@/lib/correlationEngine';
import { calculateHealthScore } from '@/lib/healthCalculator';
import type { CustomerAlert, AlertFilter, AlertSummary, DismissalReason } from '@/lib/types/alerts';
import type { MarketIntelligence, HealthScoreHistory } from '@/lib/types/intelligence';
import type { MarketEventCorrelation } from '@/lib/types/correlation';
import AlertCard from './AlertCard';
import AlertDetailModal from './AlertDetailModal';
import AlertFilters from './AlertFilters';
import CorrelationInsight from './CorrelationInsight';

interface PredictiveIntelligenceDashboardProps {
  customerId?: string;
  className?: string;
}

/**
 * Generates mock health history for trend analysis
 */
function generateMockHealthHistory(customerId: string): HealthScoreHistory {
  const scores = [];
  const now = Date.now();

  // Generate 30 days of history
  for (let i = 30; i >= 0; i--) {
    const timestamp = new Date(now - i * 24 * 60 * 60 * 1000).toISOString();
    const customer = mockCustomers.find((c) => c.id === customerId);
    const baseScore = customer?.healthScore || 50;

    // Add some variance
    const variance = Math.random() * 10 - 5;
    const score = Math.max(0, Math.min(100, baseScore + variance));

    if (customer?.healthData) {
      const breakdown = calculateHealthScore(customer.healthData);
      scores.push({
        timestamp,
        score,
        breakdown,
        riskLevel: breakdown.riskLevel
      });
    }
  }

  const avgScore = scores.reduce((sum, s) => sum + s.score, 0) / scores.length;
  const firstScore = scores[0]?.score || 50;
  const lastScore = scores[scores.length - 1]?.score || 50;

  let trendDirection: 'improving' | 'stable' | 'declining';
  if (lastScore - firstScore > 10) {
    trendDirection = 'improving';
  } else if (firstScore - lastScore > 10) {
    trendDirection = 'declining';
  } else {
    trendDirection = 'stable';
  }

  return {
    customerId,
    scores,
    trendDirection,
    averageScore: avgScore,
    periodDays: 30,
    volatility: 15
  };
}

/**
 * Fetches mock market intelligence for a company
 */
async function fetchMarketIntelligence(company: string): Promise<MarketIntelligence | null> {
  try {
    const response = await fetch(`/api/market-intelligence/${encodeURIComponent(company)}`);
    if (!response.ok) return null;

    const data = await response.json();

    // Convert to MarketIntelligence type
    return {
      company: data.company,
      sentiment: data.sentiment,
      sentimentScore: data.sentimentScore || (data.sentiment === 'positive' ? 50 : data.sentiment === 'negative' ? -50 : 0),
      sentimentTrend: 'stable',
      newsCount: data.newsCount,
      headlines: data.headlines.map((h: { title: string; source: string; publishedAt: string }, i: number) => ({
        id: `headline-${i}`,
        title: h.title,
        source: h.source,
        publishedAt: h.publishedAt,
        sentiment: data.sentiment
      })),
      lastUpdated: data.lastUpdated,
      cached: data.cached,
      confidence: 80
    };
  } catch (error) {
    console.error('Failed to fetch market intelligence:', error);
    return null;
  }
}

/**
 * Applies filters to alert list
 */
function applyFilters(alerts: CustomerAlert[], filters: AlertFilter): CustomerAlert[] {
  return alerts.filter((alert) => {
    // Priority filter
    if (filters.priorities && filters.priorities.length > 0) {
      if (!filters.priorities.includes(alert.priority)) return false;
    }

    // Type filter
    if (filters.types && filters.types.length > 0) {
      if (!filters.types.includes(alert.alertType)) return false;
    }

    // Status filter
    if (filters.statuses && filters.statuses.length > 0) {
      if (!filters.statuses.includes(alert.status)) return false;
    }

    // Customer filter
    if (filters.customerIds && filters.customerIds.length > 0) {
      if (!filters.customerIds.includes(alert.customerId)) return false;
    }

    // Date range filter
    if (filters.dateRange) {
      const alertDate = new Date(alert.createdAt).getTime();
      if (filters.dateRange.start) {
        const startDate = new Date(filters.dateRange.start).getTime();
        if (alertDate < startDate) return false;
      }
      if (filters.dateRange.end) {
        const endDate = new Date(filters.dateRange.end).getTime();
        if (alertDate > endDate) return false;
      }
    }

    return true;
  });
}

/**
 * Calculates alert summary statistics
 */
function calculateAlertSummary(alerts: CustomerAlert[]): AlertSummary {
  const activeAlerts = alerts.filter((a) => a.status === 'active');
  const now = Date.now();
  const todayStart = new Date(now).setHours(0, 0, 0, 0);

  return {
    totalActive: activeAlerts.length,
    highPriority: activeAlerts.filter((a) => a.priority === 'high').length,
    mediumPriority: activeAlerts.filter((a) => a.priority === 'medium').length,
    overdueCount: activeAlerts.filter((a) => a.slaDeadline && new Date(a.slaDeadline).getTime() < now).length,
    dismissedToday: alerts.filter(
      (a) => a.dismissedAt && new Date(a.dismissedAt).getTime() >= todayStart
    ).length,
    resolvedToday: alerts.filter(
      (a) => a.status === 'resolved' && new Date(a.createdAt).getTime() >= todayStart
    ).length,
    averageResponseTime: 24 // Mock value
  };
}

/**
 * Loading State Component
 */
function LoadingState() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-600">Loading alerts...</p>
      </div>
    </div>
  );
}

/**
 * Empty State Component
 */
function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Alerts</h3>
      <p className="text-gray-600">All customers are healthy. Great work!</p>
    </div>
  );
}

/**
 * Main PredictiveIntelligenceDashboard Component
 */
export default function PredictiveIntelligenceDashboard({
  customerId,
  className = ''
}: PredictiveIntelligenceDashboardProps) {
  const [alerts, setAlerts] = useState<CustomerAlert[]>([]);
  const [marketData, setMarketData] = useState<Record<string, MarketIntelligence>>({});
  const [correlations, setCorrelations] = useState<MarketEventCorrelation[]>([]);
  const [filters, setFilters] = useState<AlertFilter>({
    statuses: ['active'] // Default to showing only active alerts
  });
  const [selectedAlert, setSelectedAlert] = useState<CustomerAlert | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Evaluates alerts for all customers or specific customer
   */
  const evaluateAlerts = useCallback(async () => {
    setIsLoading(true);
    const newAlerts: CustomerAlert[] = [];
    const newMarketData: Record<string, MarketIntelligence> = {};
    const newCorrelations: MarketEventCorrelation[] = [];

    // Filter customers if specific customer selected
    const customersToEvaluate = customerId
      ? mockCustomers.filter((c) => c.id === customerId)
      : mockCustomers;

    for (const customer of customersToEvaluate) {
      if (!customer.healthData) continue;

      // Generate health history
      const history = generateMockHealthHistory(customer.id);

      // Fetch market intelligence
      const intelligence = await fetchMarketIntelligence(customer.company);
      if (intelligence) {
        newMarketData[customer.company] = intelligence;
      }

      // Evaluate alerts
      const customerAlerts = evaluateCustomerAlerts(
        customer,
        customer.healthData,
        history,
        intelligence || undefined,
        [] // No recent alerts for now
      );

      // Calculate correlations
      if (intelligence) {
        for (const alert of customerAlerts) {
          const correlation = calculateCorrelation(alert, intelligence);
          if (correlation) {
            newCorrelations.push(correlation);
            // Add correlation to alert
            alert.correlationId = correlation.id;
            alert.marketContext = correlation.insight;
          }
        }
      }

      newAlerts.push(...customerAlerts);
    }

    // Sort by priority score
    newAlerts.sort((a, b) => b.priorityScore - a.priorityScore);

    setAlerts(newAlerts);
    setMarketData(newMarketData);
    setCorrelations(newCorrelations);
    setIsLoading(false);
  }, [customerId]);

  /**
   * Initial evaluation on mount and when customer changes
   */
  useEffect(() => {
    evaluateAlerts();
  }, [evaluateAlerts]);

  /**
   * Handle alert dismissal
   */
  const handleDismiss = useCallback((alertId: string, reason: DismissalReason, notes?: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              status: 'dismissed',
              dismissedAt: new Date().toISOString(),
              dismissReason: reason,
              dismissNotes: notes
            }
          : alert
      )
    );

    // Close modal if open
    if (selectedAlert?.id === alertId) {
      setSelectedAlert(null);
    }
  }, [selectedAlert]);

  /**
   * Handle alert snooze
   */
  const handleSnooze = useCallback((alertId: string, until: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              status: 'snoozed',
              snoozedUntil: until
            }
          : alert
      )
    );
  }, []);

  /**
   * Handle action completion
   */
  const handleActionComplete = useCallback((alertId: string, actionId: string, notes?: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              recommendedActions: alert.recommendedActions.map((action) =>
                action.id === actionId
                  ? {
                      ...action,
                      completed: !action.completed,
                      completedAt: !action.completed ? new Date().toISOString() : undefined,
                      notes: notes || action.notes
                    }
                  : action
              )
            }
          : alert
      )
    );
  }, []);

  /**
   * Handle correlation dismissal
   */
  const handleCorrelationDismiss = useCallback((correlationId: string) => {
    setCorrelations((prev) =>
      prev.map((corr) =>
        corr.id === correlationId ? { ...corr, dismissed: true } : corr
      )
    );
  }, []);

  /**
   * Filter and summarize alerts
   */
  const filteredAlerts = useMemo(() => applyFilters(alerts, filters), [alerts, filters]);
  const alertSummary = useMemo(() => calculateAlertSummary(alerts), [alerts]);
  const visibleCorrelations = useMemo(
    () => correlations.filter((c) => !c.dismissed && filteredAlerts.some((a) => a.id === c.alertId)),
    [correlations, filteredAlerts]
  );

  /**
   * Get customer for selected alert
   */
  const getCustomerForAlert = (alert: CustomerAlert) => {
    return mockCustomers.find((c) => c.id === alert.customerId);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Predictive Intelligence</h1>
          <button
            onClick={evaluateAlerts}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
        <p className="text-gray-600">
          Early warning system combining customer health signals with market intelligence
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Alert Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filters */}
          <AlertFilters
            currentFilters={filters}
            onFilterChange={setFilters}
            alertSummary={alertSummary}
          />

          {/* Alert List */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Active Alerts ({filteredAlerts.length})
            </h2>

            {isLoading ? (
              <LoadingState />
            ) : filteredAlerts.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-4">
                {filteredAlerts.map((alert) => (
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

        {/* Side Panel - Correlations */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Market Correlations
            </h2>

            {visibleCorrelations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No market correlations detected</p>
              </div>
            ) : (
              <div className="space-y-4">
                {visibleCorrelations.slice(0, 3).map((correlation) => (
                  <CorrelationInsight
                    key={correlation.id}
                    correlation={correlation}
                    onDismiss={() => handleCorrelationDismiss(correlation.id)}
                    onViewDetails={() => {
                      const alert = alerts.find((a) => a.id === correlation.alertId);
                      if (alert) setSelectedAlert(alert);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <AlertDetailModal
          alert={selectedAlert}
          customer={getCustomerForAlert(selectedAlert)!}
          healthData={getCustomerForAlert(selectedAlert)?.healthData || undefined}
          marketIntelligence={marketData[selectedAlert.customerCompany]}
          correlation={correlations.find((c) => c.alertId === selectedAlert.id)}
          onClose={() => setSelectedAlert(null)}
          onDismiss={(reason, notes) => handleDismiss(selectedAlert.id, reason, notes)}
          onActionComplete={(actionId, notes) =>
            handleActionComplete(selectedAlert.id, actionId, notes)
          }
        />
      )}
    </div>
  );
}
