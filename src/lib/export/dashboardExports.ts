/**
 * Dashboard-Specific Export Functions
 *
 * Pre-configured export functions for common dashboard data types:
 * - Customer data
 * - Health scores
 * - Alerts
 * - Market intelligence
 */

import { exportToCSV, exportToJSON, ExportResult, ExportColumn } from './exportUtils';
import type { CustomerAlert } from '../types/alerts';
import type { Customer } from '@/data/mock-customers';
import type { HealthScoreBreakdown } from '../healthCalculator';
import type { MarketIntelligence } from '../types/intelligence';

/**
 * Exports customer data with health scores
 */
export function exportCustomers(
  customers: Customer[],
  format: 'csv' | 'json' = 'csv'
): ExportResult {
  const columns: ExportColumn<Customer>[] = [
    { key: 'id', label: 'Customer ID' },
    { key: 'name', label: 'Name' },
    { key: 'company', label: 'Company' },
    { key: 'email', label: 'Email', getValue: (c) => c.email || 'N/A' },
    { key: 'subscriptionTier', label: 'Subscription Tier', getValue: (c) => c.subscriptionTier || 'N/A' },
    { key: 'healthScore', label: 'Health Score' },
    { key: 'annualContractValue', label: 'ARR (USD)', getValue: (c) => c.annualContractValue || 0 },
    {
      key: 'domains',
      label: 'Domains',
      getValue: (c) => c.domains?.join('; ') || 'N/A'
    },
    { key: 'createdAt', label: 'Created At', getValue: (c) => c.createdAt || 'N/A' }
  ];

  if (format === 'csv') {
    return exportToCSV(customers, 'customers-export', columns);
  } else {
    return exportToJSON(customers, 'customers-export');
  }
}

/**
 * Exports customer alerts with details
 */
export function exportAlerts(
  alerts: CustomerAlert[],
  format: 'csv' | 'json' = 'csv'
): ExportResult {
  const columns: ExportColumn<CustomerAlert>[] = [
    { key: 'id', label: 'Alert ID' },
    { key: 'customerName', label: 'Customer Name' },
    { key: 'customerCompany', label: 'Company' },
    { key: 'alertType', label: 'Alert Type' },
    { key: 'priority', label: 'Priority' },
    { key: 'status', label: 'Status' },
    { key: 'title', label: 'Title' },
    { key: 'description', label: 'Description' },
    {
      key: 'trigger',
      label: 'Trigger Condition',
      getValue: (a) => a.trigger.condition
    },
    {
      key: 'trigger',
      label: 'Threshold',
      getValue: (a) => String(a.trigger.threshold)
    },
    {
      key: 'trigger',
      label: 'Actual Value',
      getValue: (a) => String(a.trigger.actualValue)
    },
    { key: 'priorityScore', label: 'Priority Score' },
    { key: 'customerValue', label: 'Customer ARR' },
    { key: 'createdAt', label: 'Created At' },
    { key: 'slaDeadline', label: 'SLA Deadline', getValue: (a) => a.slaDeadline || 'N/A' },
    { key: 'dismissReason', label: 'Dismiss Reason', getValue: (a) => a.dismissReason || 'N/A' },
    { key: 'marketContext', label: 'Market Context', getValue: (a) => a.marketContext || 'N/A' }
  ];

  if (format === 'csv') {
    return exportToCSV(alerts, 'alerts-export', columns);
  } else {
    return exportToJSON(alerts, 'alerts-export');
  }
}

/**
 * Exports health score data with factor breakdowns
 */
export function exportHealthScores(
  data: Array<{ customer: Customer; breakdown: HealthScoreBreakdown }>,
  format: 'csv' | 'json' = 'csv'
): ExportResult {
  const columns: ExportColumn<{ customer: Customer; breakdown: HealthScoreBreakdown }>[] = [
    { key: 'customer', label: 'Customer ID', getValue: (d) => d.customer.id },
    { key: 'customer', label: 'Customer Name', getValue: (d) => d.customer.name },
    { key: 'customer', label: 'Company', getValue: (d) => d.customer.company },
    { key: 'breakdown', label: 'Overall Score', getValue: (d) => d.breakdown.overallScore },
    { key: 'breakdown', label: 'Risk Level', getValue: (d) => d.breakdown.riskLevel },
    { key: 'breakdown', label: 'Payment Score', getValue: (d) => d.breakdown.paymentScore },
    { key: 'breakdown', label: 'Engagement Score', getValue: (d) => d.breakdown.engagementScore },
    { key: 'breakdown', label: 'Contract Score', getValue: (d) => d.breakdown.contractScore },
    { key: 'breakdown', label: 'Support Score', getValue: (d) => d.breakdown.supportScore }
  ];

  if (format === 'csv') {
    return exportToCSV(data, 'health-scores-export', columns);
  } else {
    return exportToJSON(data, 'health-scores-export');
  }
}

/**
 * Exports market intelligence data
 */
export function exportMarketIntelligence(
  data: MarketIntelligence[],
  format: 'csv' | 'json' = 'csv'
): ExportResult {
  const columns: ExportColumn<MarketIntelligence>[] = [
    { key: 'company', label: 'Company' },
    { key: 'sentiment', label: 'Sentiment' },
    { key: 'sentimentScore', label: 'Sentiment Score' },
    { key: 'sentimentTrend', label: 'Sentiment Trend' },
    { key: 'newsCount', label: 'News Count' },
    {
      key: 'headlines',
      label: 'Recent Headlines',
      getValue: (d) => d.headlines.map(h => h.title).join(' | ')
    },
    { key: 'lastUpdated', label: 'Last Updated' },
    { key: 'confidence', label: 'Confidence' }
  ];

  if (format === 'csv') {
    return exportToCSV(data, 'market-intelligence-export', columns);
  } else {
    return exportToJSON(data, 'market-intelligence-export');
  }
}
