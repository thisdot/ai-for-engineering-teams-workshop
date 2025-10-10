/**
 * AlertCard Component
 *
 * Displays an individual customer alert with priority badge, trigger conditions,
 * health score, and action buttons. Supports both compact and expanded views.
 */

'use client';

import { useState } from 'react';
import type { CustomerAlert, DismissalReason } from '@/lib/types/alerts';

interface AlertCardProps {
  alert: CustomerAlert;
  onDismiss: (alertId: string, reason: DismissalReason, notes?: string) => void;
  onSnooze: (alertId: string, until: string) => void;
  onActionComplete: (alertId: string, actionId: string, notes?: string) => void;
  onClick: () => void;
  showMarketContext?: boolean;
  compact?: boolean;
}

/**
 * Formats an ISO date string to relative time
 */
function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

/**
 * Priority Badge Component
 */
function PriorityBadge({ priority, priorityScore }: { priority: 'high' | 'medium'; priorityScore: number }) {
  const styles = priority === 'high'
    ? 'bg-red-50 text-red-700 border-red-500'
    : 'bg-yellow-50 text-yellow-700 border-yellow-500';

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border-2 ${styles}`}>
      <span className="font-semibold text-xs uppercase">{priority}</span>
      <span className="text-xs">({priorityScore})</span>
    </div>
  );
}

/**
 * Alert Type Icon Component
 */
function AlertTypeIcon({ type }: { type: string }) {
  const iconPaths: Record<string, string> = {
    payment_risk: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    engagement_cliff: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
    contract_expiration_risk: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    support_ticket_spike: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z',
    feature_adoption_stall: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
  };

  return (
    <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPaths[type] || iconPaths.feature_adoption_stall} />
      </svg>
    </div>
  );
}

/**
 * Health Score Display Component
 */
function HealthScoreDisplay({ score }: { score: number }) {
  const getScoreColor = (score: number) => {
    if (score >= 71) return 'text-green-600 bg-green-100 border-green-200';
    if (score >= 31) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-red-600 bg-red-100 border-red-200';
  };

  return (
    <div className={`px-3 py-1 rounded-lg border ${getScoreColor(score)}`}>
      <span className="text-sm font-semibold">Health: {score}</span>
    </div>
  );
}

/**
 * Main AlertCard Component
 */
export default function AlertCard({
  alert,
  onDismiss,
  onSnooze,
  onActionComplete,
  onClick,
  showMarketContext = true,
  compact = false
}: AlertCardProps) {
  const [showActions, setShowActions] = useState(false);
  const [showSnooze, setShowSnooze] = useState(false);
  const [snoozeDate, setSnoozeDate] = useState('');

  const handleSnoozeSubmit = () => {
    if (snoozeDate) {
      onSnooze(alert.id, new Date(snoozeDate).toISOString());
      setShowSnooze(false);
      setSnoozeDate('');
    }
  };

  const isOverdue = alert.slaDeadline && new Date(alert.slaDeadline) < new Date();

  return (
    <div
      className={`rounded-lg shadow border-l-4 bg-white hover:shadow-lg transition-shadow cursor-pointer ${
        alert.priority === 'high' ? 'border-l-red-500' : 'border-l-yellow-500'
      } ${compact ? 'p-3' : 'p-4'}`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <AlertTypeIcon type={alert.alertType} />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 truncate">{alert.title}</h3>
              {isOverdue && (
                <span className="px-2 py-0.5 text-xs bg-red-600 text-white rounded-full">
                  OVERDUE
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-1">
              {alert.customerName} • {alert.customerCompany}
            </p>
            <p className="text-xs text-gray-500">{formatRelativeTime(alert.createdAt)}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <PriorityBadge priority={alert.priority} priorityScore={alert.priorityScore} />
        </div>
      </div>

      {/* Description */}
      {!compact && (
        <div className="mb-3">
          <p className="text-sm text-gray-700 mb-2">{alert.description}</p>

          {/* Trigger Condition */}
          <div className="bg-gray-50 rounded px-3 py-2">
            <p className="text-xs text-gray-600">
              <span className="font-semibold">Trigger: </span>
              {alert.trigger.condition}
              {' '}
              <span className="text-gray-500">
                (threshold: {alert.trigger.threshold}, actual: {alert.trigger.actualValue})
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Health Score and Market Context */}
      <div className="flex items-center gap-2 mb-3">
        <HealthScoreDisplay score={alert.customerValue > 0 ? Math.round((alert.priorityScore / 100) * 85) : 50} />

        {showMarketContext && alert.marketContext && (
          <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Market correlation detected</span>
          </div>
        )}
      </div>

      {/* Recommended Actions (Expandable) */}
      {!compact && (
        <div className="mb-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowActions(!showActions);
            }}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>{showActions ? 'Hide' : 'Show'} Actions ({alert.recommendedActions.length})</span>
            <svg
              className={`w-4 h-4 transition-transform ${showActions ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showActions && (
            <div className="mt-2 space-y-2">
              {alert.recommendedActions.map((action) => (
                <div
                  key={action.id}
                  className="flex items-start gap-2 text-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={action.completed}
                    onChange={() => onActionComplete(alert.id, action.id)}
                    className="mt-0.5 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className={action.completed ? 'text-gray-500 line-through' : 'text-gray-700'}>
                    {action.description}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors"
        >
          View Details
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowSnooze(!showSnooze);
          }}
          className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded transition-colors"
        >
          Snooze
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            // For demo, auto-dismiss with "other" reason
            onDismiss(alert.id, 'other', 'Quick dismiss from card');
          }}
          className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded transition-colors"
        >
          Dismiss
        </button>

        {alert.slaDeadline && (
          <div className="ml-auto text-xs text-gray-500">
            SLA: {formatRelativeTime(alert.slaDeadline)}
          </div>
        )}
      </div>

      {/* Snooze Input */}
      {showSnooze && (
        <div
          className="mt-3 p-3 bg-gray-50 rounded-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Snooze until:
          </label>
          <div className="flex gap-2">
            <input
              type="datetime-local"
              value={snoozeDate}
              onChange={(e) => setSnoozeDate(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleSnoozeSubmit}
              disabled={!snoozeDate}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Snooze
            </button>
            <button
              onClick={() => {
                setShowSnooze(false);
                setSnoozeDate('');
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
