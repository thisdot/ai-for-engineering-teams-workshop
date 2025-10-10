'use client';

import { useState, useEffect } from 'react';
import {
  calculateHealthScore,
  type HealthScoreBreakdown,
  HealthCalculationError
} from '@/lib/healthCalculator';
import { mockCustomers } from '@/data/mock-customers';

interface CustomerHealthDisplayProps {
  customerId: string;
  className?: string;
}

/**
 * CustomerHealthDisplay Component
 *
 * Displays comprehensive customer health score with factor breakdown.
 * Shows overall health score prominently with color-coded risk level.
 * Provides expandable details showing individual factor contributions.
 *
 * Features:
 * - Large overall health score display
 * - Color-coded risk level indicator
 * - Expandable factor breakdown
 * - Individual factor scores with visual progress bars
 * - Loading and error states
 * - Responsive design for mobile, tablet, desktop
 */
export default function CustomerHealthDisplay({ customerId, className = '' }: CustomerHealthDisplayProps) {
  const [breakdown, setBreakdown] = useState<HealthScoreBreakdown | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset states when customer changes
    setIsLoading(true);
    setError(null);
    setBreakdown(null);

    try {
      // Find customer data
      const customer = mockCustomers.find(c => c.id === customerId);

      if (!customer) {
        throw new Error(`Customer with ID ${customerId} not found`);
      }

      if (!customer.healthData) {
        throw new Error(`No health data available for customer ${customer.name}`);
      }

      // Calculate health score
      const calculatedBreakdown = calculateHealthScore(customer.healthData);
      setBreakdown(calculatedBreakdown);
    } catch (err) {
      if (err instanceof HealthCalculationError) {
        setError(`Calculation error: ${err.message}${err.field ? ` (${err.field})` : ''}`);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred while calculating health score');
      }
    } finally {
      setIsLoading(false);
    }
  }, [customerId]);

  // Helper function to get color classes based on risk level
  const getRiskLevelColors = (riskLevel: 'healthy' | 'warning' | 'critical') => {
    switch (riskLevel) {
      case 'healthy':
        return {
          text: 'text-green-600',
          bg: 'bg-green-100',
          border: 'border-green-500',
          progressBg: 'bg-green-500'
        };
      case 'warning':
        return {
          text: 'text-yellow-600',
          bg: 'bg-yellow-100',
          border: 'border-yellow-500',
          progressBg: 'bg-yellow-500'
        };
      case 'critical':
        return {
          text: 'text-red-600',
          bg: 'bg-red-100',
          border: 'border-red-500',
          progressBg: 'bg-red-500'
        };
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={`rounded-lg shadow p-6 bg-white ${className} max-w-[600px]`}>
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`rounded-lg shadow p-6 bg-white ${className} max-w-[600px]`}>
        <div className="text-red-600">
          <h3 className="font-semibold text-lg mb-2">Error Calculating Health Score</h3>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // No data state
  if (!breakdown) {
    return (
      <div className={`rounded-lg shadow p-6 bg-white ${className} max-w-[600px]`}>
        <div className="text-gray-500">
          <p>No health score data available</p>
        </div>
      </div>
    );
  }

  const colors = getRiskLevelColors(breakdown.riskLevel);

  return (
    <div className={`rounded-lg shadow p-6 bg-white ${className} max-w-[600px]`}>
      {/* Overall Score Display */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-3">
          <div className={`text-5xl font-bold ${colors.text}`}>
            {Math.round(breakdown.overallScore)}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Customer Health Score</h3>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${colors.text} ${colors.bg} border ${colors.border}`}
            >
              {breakdown.riskLevel.charAt(0).toUpperCase() + breakdown.riskLevel.slice(1)}
            </span>
          </div>
        </div>

        {/* Overall progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${colors.progressBg}`}
            style={{ width: `${breakdown.overallScore}%` }}
          ></div>
        </div>
      </div>

      {/* Expandable Factor Breakdown */}
      <div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left text-gray-700 hover:text-gray-900 transition-colors"
          aria-expanded={isExpanded}
        >
          <span className="font-medium">Factor Breakdown</span>
          <svg
            className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Factor Details */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isExpanded ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="space-y-4">
            {/* Payment Score */}
            <FactorScore
              label="Payment History"
              score={breakdown.paymentScore}
              weight="40%"
              description="Payment timeliness and history"
            />

            {/* Engagement Score */}
            <FactorScore
              label="Engagement"
              score={breakdown.engagementScore}
              weight="30%"
              description="Product usage and activity"
            />

            {/* Contract Score */}
            <FactorScore
              label="Contract Status"
              score={breakdown.contractScore}
              weight="20%"
              description="Contract health and renewal risk"
            />

            {/* Support Score */}
            <FactorScore
              label="Support Satisfaction"
              score={breakdown.supportScore}
              weight="10%"
              description="Support interactions and satisfaction"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * FactorScore Sub-component
 *
 * Displays an individual factor score with label, value, weight, and progress bar
 */
interface FactorScoreProps {
  label: string;
  score: number;
  weight: string;
  description: string;
}

function FactorScore({ label, score, weight, description }: FactorScoreProps) {
  // Determine color based on score
  const getScoreColor = (score: number): string => {
    if (score >= 71) return 'bg-green-500';
    if (score >= 31) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-800">{label}</span>
            <span className="text-xs text-gray-500 font-medium">{weight}</span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        </div>
        <span className="text-lg font-semibold text-gray-800 ml-4">
          {Math.round(score)}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${getScoreColor(score)}`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  );
}
