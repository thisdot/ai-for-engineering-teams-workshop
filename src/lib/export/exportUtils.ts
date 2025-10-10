/**
 * Export Utilities
 *
 * Provides functions to export dashboard data to CSV and JSON formats.
 * Handles data transformation, file generation, and browser download triggers.
 *
 * Features:
 * - CSV export with proper escaping
 * - JSON export with pretty printing
 * - Automatic file naming with timestamps
 * - Column customization
 * - Export result tracking (file size, duration, row count)
 */

export type ExportFormat = 'csv' | 'json';

export interface ExportResult {
  success: boolean;
  filename: string;
  rowCount: number;
  fileSize: number;  // bytes
  duration: number;  // milliseconds
  error?: string;
}

export interface ExportColumn<T> {
  key: keyof T | string;
  label: string;
  getValue?: (item: T) => string | number;
}

/**
 * Exports data to CSV format
 *
 * @param data - Array of objects to export
 * @param filename - Output filename (without extension)
 * @param columns - Optional column configuration
 * @returns Export result with metadata
 */
export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  columns?: ExportColumn<T>[]
): ExportResult {
  const startTime = Date.now();

  try {
    if (!data || data.length === 0) {
      throw new Error('No data to export');
    }

    // Determine columns
    const cols = columns || Object.keys(data[0]).map(key => ({
      key: key as keyof T,
      label: key,
      getValue: undefined
    }));

    // Create CSV header
    const header = cols.map(col => escapeCSVValue(col.label)).join(',');

    // Create CSV rows
    const rows = data.map(item => {
      return cols.map(col => {
        let value: string | number | boolean | null | undefined;

        if (col.getValue) {
          value = col.getValue(item);
        } else {
          value = item[col.key as keyof T];
        }

        // Convert to string and escape
        return escapeCSVValue(String(value ?? ''));
      }).join(',');
    });

    // Combine header and rows
    const csv = [header, ...rows].join('\n');

    // Generate filename with timestamp
    const timestampedFilename = `${filename}-${formatTimestamp()}.csv`;

    // Trigger download
    downloadFile(csv, timestampedFilename, 'text/csv');

    // Calculate file size
    const fileSize = new Blob([csv]).size;

    return {
      success: true,
      filename: timestampedFilename,
      rowCount: data.length,
      fileSize,
      duration: Date.now() - startTime
    };
  } catch (error) {
    return {
      success: false,
      filename,
      rowCount: 0,
      fileSize: 0,
      duration: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Exports data to JSON format
 *
 * @param data - Array of objects to export
 * @param filename - Output filename (without extension)
 * @param pretty - Whether to pretty-print JSON (default: true)
 * @returns Export result with metadata
 */
export function exportToJSON<T>(
  data: T[],
  filename: string,
  pretty: boolean = true
): ExportResult {
  const startTime = Date.now();

  try {
    if (!data || data.length === 0) {
      throw new Error('No data to export');
    }

    // Convert to JSON
    const json = JSON.stringify(data, null, pretty ? 2 : 0);

    // Generate filename with timestamp
    const timestampedFilename = `${filename}-${formatTimestamp()}.json`;

    // Trigger download
    downloadFile(json, timestampedFilename, 'application/json');

    // Calculate file size
    const fileSize = new Blob([json]).size;

    return {
      success: true,
      filename: timestampedFilename,
      rowCount: data.length,
      fileSize,
      duration: Date.now() - startTime
    };
  } catch (error) {
    return {
      success: false,
      filename,
      rowCount: 0,
      fileSize: 0,
      duration: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Escapes a CSV value (handles commas, quotes, newlines)
 */
function escapeCSVValue(value: string): string {
  // If value contains comma, quote, or newline, wrap in quotes and escape internal quotes
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Formats current timestamp for filename
 * Format: YYYYMMDD-HHMMSS
 */
function formatTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}-${hours}${minutes}${seconds}`;
}

/**
 * Triggers file download in browser
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up object URL
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Formats file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Formats duration for display
 */
export function formatDuration(milliseconds: number): string {
  if (milliseconds < 1000) {
    return `${milliseconds}ms`;
  }

  const seconds = Math.round(milliseconds / 100) / 10;
  return `${seconds}s`;
}
