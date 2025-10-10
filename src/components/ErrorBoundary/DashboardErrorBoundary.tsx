'use client';

/**
 * DashboardErrorBoundary
 *
 * Application-level error boundary that catches all unhandled errors
 * in the dashboard and displays a user-friendly error page with recovery options.
 *
 * Features:
 * - Full-page error UI with recovery actions
 * - Error logging with context
 * - Different error displays for development vs production
 * - Reload dashboard action
 * - Error state management to prevent error loops
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';

export interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  recoverable?: boolean;
}

interface Props {
  children: ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Default error fallback UI
 */
function DefaultErrorFallback({ error, resetError, severity = 'high', recoverable = true }: ErrorFallbackProps) {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        {/* Error Icon */}
        <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6 mx-auto">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        {/* Error Title */}
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-4">
          Something went wrong
        </h1>

        {/* Error Message */}
        <p className="text-gray-600 text-center mb-6">
          {isDevelopment
            ? error.message
            : 'The dashboard encountered an unexpected error. Our team has been notified.'}
        </p>

        {/* Development-only details */}
        {isDevelopment && (
          <div className="mb-6 p-4 bg-gray-100 rounded-lg overflow-auto max-h-64">
            <p className="text-xs font-mono text-gray-700 whitespace-pre-wrap">
              {error.stack}
            </p>
          </div>
        )}

        {/* Severity Badge */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-sm text-gray-600">Severity:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            severity === 'critical' ? 'bg-red-100 text-red-700 border border-red-300' :
            severity === 'high' ? 'bg-orange-100 text-orange-700 border border-orange-300' :
            severity === 'medium' ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' :
            'bg-blue-100 text-blue-700 border border-blue-300'
          }`}>
            {severity.charAt(0).toUpperCase() + severity.slice(1)}
          </span>
        </div>

        {/* Recovery Actions */}
        {recoverable && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={resetError}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Reload Dashboard
            </button>
          </div>
        )}

        {!recoverable && (
          <div className="text-center">
            <p className="text-red-600 font-medium mb-4">
              This error cannot be recovered automatically.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Reload Dashboard
            </button>
          </div>
        )}

        {/* Support Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            If this problem persists, please{' '}
            <a href="mailto:support@example.com" className="text-blue-600 hover:underline">
              contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * DashboardErrorBoundary Component
 *
 * Catches errors at the application level and provides recovery options
 */
export class DashboardErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('DashboardErrorBoundary caught an error:', error, errorInfo);
    }

    // Log error with context (in production, this would go to a service like Sentry)
    this.logError(error, errorInfo);

    // Call optional error handler
    this.props.onError?.(error, errorInfo);

    this.setState({ errorInfo });
  }

  logError(error: Error, errorInfo: ErrorInfo) {
    // In production, send to error monitoring service
    const errorContext = {
      component: 'DashboardErrorBoundary',
      errorInfo: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
    };

    // For now, just log to console (replace with actual error service)
    console.error('[Error Logged]', {
      message: error.message,
      stack: error.stack,
      context: errorContext
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;

      return (
        <FallbackComponent
          error={this.state.error}
          resetError={this.handleReset}
          severity="high"
          recoverable={true}
        />
      );
    }

    return this.props.children;
  }
}
