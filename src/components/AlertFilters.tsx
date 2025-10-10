/**
 * AlertFilters Component
 *
 * Filter controls for alert list with priority, type, status, and date range filters.
 * Displays alert count summary and provides clear all filters functionality.
 */

'use client';

import { useState } from 'react';
import type { AlertFilter, AlertPriority, AlertType, AlertStatus, AlertSummary } from '@/lib/types/alerts';

interface AlertFiltersProps {
  currentFilters: AlertFilter;
  onFilterChange: (filters: AlertFilter) => void;
  alertSummary: AlertSummary;
}

/**
 * Filter Section Component
 */
function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-gray-700">{title}</h4>
      {children}
    </div>
  );
}

/**
 * Checkbox Filter Component
 */
function CheckboxFilter({
  label,
  checked,
  onChange,
  count
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  count?: number;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
      />
      <span className="text-sm text-gray-700 flex-1">{label}</span>
      {count !== undefined && (
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </label>
  );
}

/**
 * Alert Summary Stats Component
 */
function AlertSummaryStats({ summary }: { summary: AlertSummary }) {
  const stats = [
    { label: 'Total Active', value: summary.totalActive, color: 'text-gray-900' },
    { label: 'High Priority', value: summary.highPriority, color: 'text-red-600' },
    { label: 'Medium Priority', value: summary.mediumPriority, color: 'text-yellow-600' },
    { label: 'Overdue', value: summary.overdueCount, color: 'text-red-700' }
  ];

  return (
    <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
      {stats.map((stat) => (
        <div key={stat.label} className="text-center">
          <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
          <div className="text-xs text-gray-600">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

/**
 * Main AlertFilters Component
 */
export default function AlertFilters({
  currentFilters,
  onFilterChange,
  alertSummary
}: AlertFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Priority filters
  const priorityOptions: { value: AlertPriority; label: string; count: number }[] = [
    { value: 'high', label: 'High Priority', count: alertSummary.highPriority },
    { value: 'medium', label: 'Medium Priority', count: alertSummary.mediumPriority }
  ];

  // Alert type filters
  const typeOptions: { value: AlertType; label: string }[] = [
    { value: 'payment_risk', label: 'Payment Risk' },
    { value: 'engagement_cliff', label: 'Engagement Cliff' },
    { value: 'contract_expiration_risk', label: 'Contract Expiration' },
    { value: 'support_ticket_spike', label: 'Support Spike' },
    { value: 'feature_adoption_stall', label: 'Feature Adoption' }
  ];

  // Status filters
  const statusOptions: { value: AlertStatus; label: string }[] = [
    { value: 'active', label: 'Active' },
    { value: 'snoozed', label: 'Snoozed' },
    { value: 'dismissed', label: 'Dismissed' },
    { value: 'resolved', label: 'Resolved' }
  ];

  const handlePriorityChange = (priority: AlertPriority, checked: boolean) => {
    const priorities = currentFilters.priorities || [];
    const newPriorities = checked
      ? [...priorities, priority]
      : priorities.filter((p) => p !== priority);

    onFilterChange({
      ...currentFilters,
      priorities: newPriorities.length > 0 ? newPriorities : undefined
    });
  };

  const handleTypeChange = (type: AlertType, checked: boolean) => {
    const types = currentFilters.types || [];
    const newTypes = checked
      ? [...types, type]
      : types.filter((t) => t !== type);

    onFilterChange({
      ...currentFilters,
      types: newTypes.length > 0 ? newTypes : undefined
    });
  };

  const handleStatusChange = (status: AlertStatus, checked: boolean) => {
    const statuses = currentFilters.statuses || [];
    const newStatuses = checked
      ? [...statuses, status]
      : statuses.filter((s) => s !== status);

    onFilterChange({
      ...currentFilters,
      statuses: newStatuses.length > 0 ? newStatuses : undefined
    });
  };

  const handleDateRangeChange = (field: 'start' | 'end', value: string) => {
    const dateRange = currentFilters.dateRange || { start: '', end: '' };
    const newDateRange = { ...dateRange, [field]: value };

    onFilterChange({
      ...currentFilters,
      dateRange: newDateRange.start || newDateRange.end ? newDateRange : undefined
    });
  };

  const handleClearFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters =
    (currentFilters.priorities?.length ?? 0) > 0 ||
    (currentFilters.types?.length ?? 0) > 0 ||
    (currentFilters.statuses?.length ?? 0) > 0 ||
    !!currentFilters.dateRange;

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <AlertSummaryStats summary={alertSummary} />

      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="font-medium text-gray-900">Filters</span>
          {hasActiveFilters && (
            <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full font-medium">
              Active
            </span>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="bg-white border border-gray-300 rounded-lg p-4 space-y-4">
          {/* Priority Filter */}
          <FilterSection title="Priority">
            <div className="space-y-1">
              {priorityOptions.map((option) => (
                <CheckboxFilter
                  key={option.value}
                  label={option.label}
                  checked={currentFilters.priorities?.includes(option.value) ?? false}
                  onChange={(checked) => handlePriorityChange(option.value, checked)}
                  count={option.count}
                />
              ))}
            </div>
          </FilterSection>

          {/* Alert Type Filter */}
          <FilterSection title="Alert Type">
            <div className="space-y-1">
              {typeOptions.map((option) => (
                <CheckboxFilter
                  key={option.value}
                  label={option.label}
                  checked={currentFilters.types?.includes(option.value) ?? false}
                  onChange={(checked) => handleTypeChange(option.value, checked)}
                />
              ))}
            </div>
          </FilterSection>

          {/* Status Filter */}
          <FilterSection title="Status">
            <div className="space-y-1">
              {statusOptions.map((option) => (
                <CheckboxFilter
                  key={option.value}
                  label={option.label}
                  checked={currentFilters.statuses?.includes(option.value) ?? false}
                  onChange={(checked) => handleStatusChange(option.value, checked)}
                />
              ))}
            </div>
          </FilterSection>

          {/* Date Range Filter */}
          <FilterSection title="Date Range">
            <div className="space-y-2">
              <div>
                <label className="block text-xs text-gray-600 mb-1">From</label>
                <input
                  type="date"
                  value={currentFilters.dateRange?.start.split('T')[0] || ''}
                  onChange={(e) => handleDateRangeChange('start', e.target.value ? new Date(e.target.value).toISOString() : '')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">To</label>
                <input
                  type="date"
                  value={currentFilters.dateRange?.end.split('T')[0] || ''}
                  onChange={(e) => handleDateRangeChange('end', e.target.value ? new Date(e.target.value).toISOString() : '')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </FilterSection>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
