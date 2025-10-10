/**
 * AlertDetailModal Component
 *
 * Full alert details modal with customer context, detailed trigger explanation,
 * action completion checklist, market intelligence, and historical alerts.
 * Includes dismiss workflow with reason selection.
 */

'use client';

import { useState } from 'react';
import type { CustomerAlert, DismissalReason } from '@/lib/types/alerts';
import type { Customer } from '@/data/mock-customers';
import type { CustomerHealthData } from '@/lib/healthCalculator';
import type { MarketIntelligence } from '@/lib/types/intelligence';
import type { MarketEventCorrelation } from '@/lib/types/correlation';

interface AlertDetailModalProps {
  alert: CustomerAlert;
  customer: Customer;
  healthData: CustomerHealthData;
  marketIntelligence?: MarketIntelligence;
  correlation?: MarketEventCorrelation;
  onClose: () => void;
  onDismiss: (reason: DismissalReason, notes?: string) => void;
  onActionComplete: (actionId: string, notes?: string) => void;
}

/**
 * Modal Overlay Component
 */
function ModalOverlay({ onClick }: { onClick: () => void }) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
      onClick={onClick}
    />
  );
}

/**
 * Customer Context Section
 */
function CustomerContextSection({ customer, healthData }: { customer: Customer; healthData: CustomerHealthData }) {
  const getHealthColor = (score: number) => {
    if (score >= 71) return 'text-green-600 bg-green-100';
    if (score >= 31) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        Customer Context
      </h3>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-xs text-gray-600 mb-1">Company</div>
          <div className="font-medium text-gray-900">{customer.company}</div>
        </div>
        <div>
          <div className="text-xs text-gray-600 mb-1">Contact</div>
          <div className="font-medium text-gray-900">{customer.name}</div>
        </div>
        <div>
          <div className="text-xs text-gray-600 mb-1">Health Score</div>
          <div className={`font-semibold px-3 py-1 rounded-lg inline-block ${getHealthColor(customer.healthScore)}`}>
            {customer.healthScore}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-600 mb-1">ARR</div>
          <div className="font-medium text-gray-900">
            ${(customer.annualContractValue || 0).toLocaleString()}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-600 mb-1">Tier</div>
          <div className="font-medium text-gray-900 capitalize">
            {customer.subscriptionTier || 'N/A'}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-600 mb-1">Contract Renewal</div>
          <div className="font-medium text-gray-900">
            {healthData.contract.daysUntilRenewal} days
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Trigger Explanation Section
 */
function TriggerExplanationSection({ alert }: { alert: CustomerAlert }) {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        What Triggered This Alert
      </h3>

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="mb-2">
          <span className="text-xs font-semibold text-orange-700 uppercase">
            {alert.trigger.type.replace(/_/g, ' ')}
          </span>
        </div>
        <p className="text-sm text-gray-900 font-medium mb-2">{alert.trigger.condition}</p>
        <div className="flex items-center gap-4 text-sm text-gray-700">
          <div>
            <span className="text-gray-600">Threshold: </span>
            <span className="font-medium">{alert.trigger.threshold}</span>
          </div>
          <div>
            <span className="text-gray-600">Actual: </span>
            <span className="font-medium">{alert.trigger.actualValue}</span>
          </div>
          {alert.trigger.comparisonPeriod && (
            <div>
              <span className="text-gray-600">Period: </span>
              <span className="font-medium">{alert.trigger.comparisonPeriod}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Action Checklist Section
 */
function ActionChecklistSection({
  alert,
  onActionComplete
}: {
  alert: CustomerAlert;
  onActionComplete: (actionId: string, notes?: string) => void;
}) {
  const [actionNotes, setActionNotes] = useState<Record<string, string>>({});
  const [editingActionId, setEditingActionId] = useState<string | null>(null);

  const completedCount = alert.recommendedActions.filter(a => a.completed).length;
  const totalCount = alert.recommendedActions.length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          Recommended Actions
        </h3>
        <span className="text-sm text-gray-600">
          {completedCount} of {totalCount} completed
        </span>
      </div>

      <div className="space-y-2">
        {alert.recommendedActions.map((action) => (
          <div key={action.id} className="border border-gray-200 rounded-lg p-3 bg-white">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={action.completed}
                onChange={() => onActionComplete(action.id, actionNotes[action.id])}
                className="mt-1 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <p className={`text-sm ${action.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                  {action.description}
                </p>
                {action.completed && action.completedAt && (
                  <p className="text-xs text-gray-500 mt-1">
                    Completed {new Date(action.completedAt).toLocaleString()}
                    {action.completedBy && ` by ${action.completedBy}`}
                  </p>
                )}
                {action.notes && (
                  <p className="text-xs text-gray-600 mt-1 italic">Note: {action.notes}</p>
                )}
              </div>
              <button
                onClick={() => setEditingActionId(editingActionId === action.id ? null : action.id)}
                className="text-gray-400 hover:text-gray-600"
                title="Add notes"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>

            {editingActionId === action.id && (
              <div className="mt-2">
                <textarea
                  value={actionNotes[action.id] || ''}
                  onChange={(e) => setActionNotes({ ...actionNotes, [action.id]: e.target.value })}
                  placeholder="Add notes about this action..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Market Intelligence Section
 */
function MarketIntelligenceSection({
  marketIntelligence,
  correlation
}: {
  marketIntelligence?: MarketIntelligence;
  correlation?: MarketEventCorrelation;
}) {
  if (!marketIntelligence) return null;

  const sentimentColors = {
    positive: 'bg-green-100 text-green-700',
    neutral: 'bg-yellow-100 text-yellow-700',
    negative: 'bg-red-100 text-red-700'
  };

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Market Intelligence
      </h3>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-gray-900">{marketIntelligence.company}</div>
            <div className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mt-1 ${sentimentColors[marketIntelligence.sentiment]}`}>
              {marketIntelligence.sentiment.toUpperCase()} ({marketIntelligence.sentimentScore})
            </div>
          </div>
          {correlation && (
            <div className="text-right">
              <div className="text-xs text-gray-600">Correlation</div>
              <div className="text-lg font-bold text-blue-600">{correlation.correlationScore}%</div>
            </div>
          )}
        </div>

        {correlation && (
          <div className="mt-3 pt-3 border-t border-blue-300">
            <p className="text-sm text-gray-700">{correlation.insight}</p>
          </div>
        )}

        <div className="text-xs text-gray-600">
          {marketIntelligence.newsCount} recent articles • Updated{' '}
          {new Date(marketIntelligence.lastUpdated).toLocaleString()}
        </div>
      </div>
    </div>
  );
}

/**
 * Dismiss Workflow Section
 */
function DismissWorkflowSection({
  onDismiss,
  onCancel
}: {
  onDismiss: (reason: DismissalReason, notes?: string) => void;
  onCancel: () => void;
}) {
  const [reason, setReason] = useState<DismissalReason>('other');
  const [notes, setNotes] = useState('');

  const reasons: { value: DismissalReason; label: string }[] = [
    { value: 'false_positive', label: 'False Positive - Alert triggered incorrectly' },
    { value: 'resolved_externally', label: 'Resolved Externally - Already handled' },
    { value: 'not_relevant', label: 'Not Relevant - Does not require action' },
    { value: 'duplicate', label: 'Duplicate - Same as another alert' },
    { value: 'other', label: 'Other - Specify in notes' }
  ];

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-900">Dismiss Alert</h3>

      <div className="space-y-2">
        <label className="block text-sm text-gray-700">
          Select dismissal reason <span className="text-red-600">*</span>
        </label>
        {reasons.map((r) => (
          <label key={r.value} className="flex items-start gap-2 cursor-pointer">
            <input
              type="radio"
              name="dismissReason"
              value={r.value}
              checked={reason === r.value}
              onChange={(e) => setReason(e.target.value as DismissalReason)}
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{r.label}</span>
          </label>
        ))}
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-1">
          Additional Notes {reason === 'other' && <span className="text-red-600">*</span>}
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Provide details about why this alert is being dismissed..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
          rows={3}
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onDismiss(reason, notes)}
          disabled={reason === 'other' && !notes.trim()}
          className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Confirm Dismissal
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

/**
 * Main AlertDetailModal Component
 */
export default function AlertDetailModal({
  alert,
  customer,
  healthData,
  marketIntelligence,
  correlation,
  onClose,
  onDismiss,
  onActionComplete
}: AlertDetailModalProps) {
  const [showDismissWorkflow, setShowDismissWorkflow] = useState(false);

  const handleDismiss = (reason: DismissalReason, notes?: string) => {
    onDismiss(reason, notes);
    onClose();
  };

  return (
    <>
      <ModalOverlay onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-gray-200">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{alert.title}</h2>
              <p className="text-sm text-gray-600">
                {alert.customerName} • {alert.customerCompany}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Description */}
            <div>
              <p className="text-gray-700">{alert.description}</p>
            </div>

            {/* Customer Context */}
            <CustomerContextSection customer={customer} healthData={healthData} />

            {/* Trigger Explanation */}
            <TriggerExplanationSection alert={alert} />

            {/* Market Intelligence */}
            {marketIntelligence && (
              <MarketIntelligenceSection
                marketIntelligence={marketIntelligence}
                correlation={correlation}
              />
            )}

            {/* Action Checklist */}
            <ActionChecklistSection alert={alert} onActionComplete={onActionComplete} />

            {/* Dismiss Workflow */}
            {showDismissWorkflow && (
              <DismissWorkflowSection
                onDismiss={handleDismiss}
                onCancel={() => setShowDismissWorkflow(false)}
              />
            )}
          </div>

          {/* Footer Actions */}
          {!showDismissWorkflow && (
            <div className="flex items-center gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowDismissWorkflow(true)}
                className="px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Dismiss Alert
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
              <div className="ml-auto text-sm text-gray-500">
                Alert ID: {alert.id.slice(0, 12)}...
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
