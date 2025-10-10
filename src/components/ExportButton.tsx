'use client';

/**
 * ExportButton Component
 *
 * Reusable button for exporting data to CSV or JSON formats.
 * Shows export progress and result feedback.
 *
 * Features:
 * - Format selection (CSV/JSON)
 * - Export progress indication
 * - Success/error feedback
 * - File size and row count display
 */

import { useState } from 'react';
import { ExportResult, formatFileSize, formatDuration } from '@/lib/export/exportUtils';

interface ExportButtonProps {
  label?: string;
  onExport: (format: 'csv' | 'json') => ExportResult | Promise<ExportResult>;
  disabled?: boolean;
  className?: string;
}

export default function ExportButton({
  label = 'Export',
  onExport,
  disabled = false,
  className = ''
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [lastResult, setLastResult] = useState<ExportResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleExport = async (format: 'csv' | 'json') => {
    setIsExporting(true);
    setShowResult(false);

    try {
      const result = await Promise.resolve(onExport(format));
      setLastResult(result);
      setShowResult(true);

      // Hide result after 5 seconds
      setTimeout(() => setShowResult(false), 5000);
    } catch (error) {
      setLastResult({
        success: false,
        filename: '',
        rowCount: 0,
        fileSize: 0,
        duration: 0,
        error: error instanceof Error ? error.message : 'Export failed'
      });
      setShowResult(true);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative">
      {/* Export Button with Dropdown */}
      <div className="inline-flex rounded-lg shadow-sm">
        <button
          onClick={() => handleExport('csv')}
          disabled={disabled || isExporting}
          className={`
            px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300
            rounded-l-lg hover:bg-gray-50 focus:z-10 focus:ring-2 focus:ring-blue-500
            disabled:opacity-50 disabled:cursor-not-allowed transition-colors
            ${className}
          `}
        >
          {isExporting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Exporting...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {label} CSV
            </span>
          )}
        </button>

        <button
          onClick={() => handleExport('json')}
          disabled={disabled || isExporting}
          className={`
            px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-l-0 border-gray-300
            rounded-r-lg hover:bg-gray-50 focus:z-10 focus:ring-2 focus:ring-blue-500
            disabled:opacity-50 disabled:cursor-not-allowed transition-colors
          `}
        >
          {label} JSON
        </button>
      </div>

      {/* Result Feedback */}
      {showResult && lastResult && (
        <div
          className={`
            absolute top-full mt-2 right-0 z-10 w-80 rounded-lg shadow-lg p-4 border
            ${lastResult.success
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
            }
          `}
        >
          <div className="flex items-start gap-3">
            {lastResult.success ? (
              <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}

            <div className="flex-1">
              <p className={`font-medium text-sm ${lastResult.success ? 'text-green-800' : 'text-red-800'}`}>
                {lastResult.success ? 'Export Successful' : 'Export Failed'}
              </p>

              {lastResult.success ? (
                <div className="mt-2 text-xs text-green-700 space-y-1">
                  <p><span className="font-medium">File:</span> {lastResult.filename}</p>
                  <p><span className="font-medium">Rows:</span> {lastResult.rowCount.toLocaleString()}</p>
                  <p><span className="font-medium">Size:</span> {formatFileSize(lastResult.fileSize)}</p>
                  <p><span className="font-medium">Duration:</span> {formatDuration(lastResult.duration)}</p>
                </div>
              ) : (
                <p className="mt-1 text-xs text-red-700">
                  {lastResult.error || 'Unknown error occurred'}
                </p>
              )}
            </div>

            <button
              onClick={() => setShowResult(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
