'use client';

/**
 * WidgetErrorBoundary
 *
 * Component-level error boundary that isolates widget failures from the rest
 * of the dashboard. When a widget fails, other widgets continue functioning.
 *
 * Features:
 * - Inline error UI within widget container
 * - Automatic retry with exponential backoff
 * - Max 3 retry attempts
 * - Widget-specific error tracking
 * - Minimal error info in production
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  widgetName: string;
  fallback?: React.ComponentType<WidgetErrorFallbackProps>;
  onRetry?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  retryCount: number;
}

export interface WidgetErrorFallbackProps {
  error: Error;
  widgetName: string;
  retryCount: number;
  maxRetries: number;
  onRetry: () => void;
}

/**
 * Default widget error fallback UI
 */
function DefaultWidgetErrorFallback({
  error,
  widgetName,
  retryCount,
  maxRetries,
  onRetry
}: WidgetErrorFallbackProps) {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const retriesRemaining = maxRetries - retryCount;

  return (
    <div className="border-2 border-red-300 bg-red-50 rounded-lg p-6">
      {/* Error Icon and Title */}
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-shrink-0">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-red-700 mb-2">
            {widgetName} Error
          </h3>
          <p className="text-red-600 text-sm">
            {isDevelopment
              ? error.message
              : 'This widget encountered an error and couldn\'t load.'}
          </p>
        </div>
      </div>

      {/* Development-only error details */}
      {isDevelopment && error.stack && (
        <div className="mb-4 p-3 bg-red-100 rounded border border-red-200 overflow-auto max-h-32">
          <p className="text-xs font-mono text-red-800 whitespace-pre-wrap">
            {error.stack.split('\n').slice(0, 5).join('\n')}
          </p>
        </div>
      )}

      {/* Retry Section */}
      {retriesRemaining > 0 ? (
        <div className="flex items-center gap-3">
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-medium"
          >
            Retry
          </button>
          <span className="text-sm text-red-600">
            ({retriesRemaining} {retriesRemaining === 1 ? 'attempt' : 'attempts'} remaining)
          </span>
        </div>
      ) : (
        <div className="text-sm text-red-700">
          <p className="font-medium mb-2">Max retries exceeded</p>
          <p>Please refresh the page or contact support if the problem persists.</p>
        </div>
      )}
    </div>
  );
}

/**
 * WidgetErrorBoundary Component
 *
 * Isolates widget errors and provides retry functionality
 */
export class WidgetErrorBoundary extends Component<Props, State> {
  private retryTimeouts: NodeJS.Timeout[] = [];

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error with widget context
    this.logError(error, errorInfo);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`${this.props.widgetName} error:`, error, errorInfo);
    }
  }

  componentWillUnmount() {
    // Clean up any pending retry timeouts
    this.retryTimeouts.forEach(timeout => clearTimeout(timeout));
  }

  logError(error: Error, errorInfo: ErrorInfo) {
    const errorContext = {
      component: this.props.widgetName,
      errorInfo: errorInfo.componentStack,
      retryCount: this.state.retryCount,
      timestamp: new Date().toISOString()
    };

    // In production, send to error monitoring service
    console.error('[Widget Error Logged]', {
      widget: this.props.widgetName,
      message: error.message,
      context: errorContext
    });
  }

  handleRetry = () => {
    const maxRetries = 3;

    if (this.state.retryCount >= maxRetries) {
      return; // Max retries exceeded
    }

    // Calculate exponential backoff delay
    const delay = Math.min(1000 * Math.pow(2, this.state.retryCount), 8000);

    // Reset error state after delay
    const timeout = setTimeout(() => {
      this.setState(prev => ({
        hasError: false,
        error: null,
        retryCount: prev.retryCount + 1
      }));

      // Call optional retry callback
      this.props.onRetry?.();
    }, delay);

    this.retryTimeouts.push(timeout);
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultWidgetErrorFallback;
      const maxRetries = 3;

      return (
        <FallbackComponent
          error={this.state.error || new Error('Unknown error')}
          widgetName={this.props.widgetName}
          retryCount={this.state.retryCount}
          maxRetries={maxRetries}
          onRetry={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}
