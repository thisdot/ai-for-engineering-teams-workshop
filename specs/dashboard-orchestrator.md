# Spec: Dashboard Orchestrator - Production-Ready System

## Feature: Production-Ready Dashboard Orchestrator

### Context

The Dashboard Orchestrator transforms the Customer Intelligence Dashboard from a prototype into a production-ready, enterprise-grade application. This comprehensive system implements robust error handling, data export capabilities, performance optimization, accessibility compliance, and security hardening to create a business-critical dashboard suitable for real-world deployment.

**Purpose and Role**:
- Provide enterprise-grade error handling and resilience across all dashboard components
- Enable data export and portability for customer data, health scores, and alerts
- Optimize performance for fast loading, smooth interactions, and efficient resource usage
- Ensure WCAG 2.1 AA accessibility compliance for inclusive user experience
- Implement security hardening to protect against common web vulnerabilities
- Monitor system health, performance, and user experience metrics
- Demonstrate production-quality AI collaboration and enterprise development practices

**System Integration**:
- **Error Boundary System**: Multi-level error boundaries at dashboard, widget, and component levels
- **Export System**: Unified export utilities for CSV/JSON formats across all data sources
- **Performance Layer**: Optimization wrappers, code splitting, and caching strategies
- **Accessibility Layer**: ARIA enhancements, keyboard navigation, screen reader support
- **Security Layer**: CSP policies, input sanitization, rate limiting
- **Monitoring System**: Error tracking, performance metrics, health checks
- **Core Dashboard**: Integrates with all existing components (CustomerSelector, HealthDisplay, AlertsWidget, MarketIntelligence)

**User Interaction**:
- Users experience graceful degradation when errors occur (no complete failures)
- Users can export data for offline analysis and reporting
- Users benefit from fast load times and smooth interactions
- Users with assistive technologies can fully navigate and use the dashboard
- Users receive clear error messages with recovery options
- System administrators monitor health and performance metrics

### Requirements

**Functional Requirements - Error Handling and Resilience**:

1. **Multi-Level Error Boundaries**:

   **DashboardErrorBoundary** (Application Level):
   - Catches errors from any dashboard component
   - Displays full-page error UI with recovery options
   - Logs error details for monitoring
   - Provides "Reload Dashboard" action
   - Shows different UI for development vs production
   - Maintains error state and prevents error loops

   **WidgetErrorBoundary** (Component Level):
   - Isolates widget failures from rest of dashboard
   - Displays inline error UI within widget container
   - Allows other widgets to continue functioning
   - Provides widget-specific retry mechanism
   - Shows minimal error info in production
   - Tracks widget-level error rates

   **ComponentErrorBoundary** (Granular Level):
   - Wraps individual UI components
   - Provides fallback UI for failed components
   - Enables fine-grained error isolation
   - Supports custom fallback components

2. **Custom Error Classes**:
   ```typescript
   class DashboardError extends Error {
     code: string;
     severity: 'low' | 'medium' | 'high' | 'critical';
     component?: string;
     userMessage: string;
     technicalDetails?: any;
     recoverable: boolean;
   }

   // Specific error types
   class DataFetchError extends DashboardError
   class CalculationError extends DashboardError
   class ExportError extends DashboardError
   class ValidationError extends DashboardError
   ```

3. **Error Recovery Mechanisms**:
   - Automatic retry with exponential backoff (3 attempts max)
   - Manual retry buttons for user-initiated recovery
   - Fallback to cached data when available
   - Graceful degradation (show partial data if some sources fail)
   - Clear user feedback during recovery attempts

4. **Graceful Degradation**:
   - Core functionality remains available even if optional features fail
   - CustomerSelector works independently of other widgets
   - Health scores display even if alerts fail
   - Partial data display when some metrics unavailable
   - Fallback UI components maintain dashboard structure

**Functional Requirements - Data Export and Portability**:

1. **Customer Data Export**:
   - **Formats**: CSV, JSON
   - **Data Included**:
     - Customer basic info (name, company, email, tier)
     - Current health score and risk level
     - Contract details (ARR, renewal date, status)
     - Last updated timestamp
   - **Filters**:
     - By risk level (healthy/warning/critical)
     - By subscription tier
     - By health score range
     - By selected customers only
   - **File Naming**: `customers-export-{timestamp}.{format}`

2. **Health Score Reports Export**:
   - **Formats**: CSV, JSON
   - **Data Included**:
     - Customer identification
     - Overall health score
     - Individual factor scores (payment, engagement, contract, support)
     - Risk level and trend direction
     - Historical scores (configurable time range)
     - Factor breakdowns with details
   - **Date Range**: Last 7/30/90 days or custom range
   - **File Naming**: `health-scores-{timestamp}.{format}`

3. **Alert History Export**:
   - **Formats**: CSV, JSON
   - **Data Included**:
     - Alert ID and timestamp
     - Customer name and company
     - Alert type and priority
     - Trigger conditions
     - Recommended actions
     - Dismissal status and reason
     - Actions taken
   - **Filters**:
     - By priority (high/medium)
     - By alert type
     - By date range
     - By customer
     - Active vs dismissed alerts
   - **File Naming**: `alerts-export-{timestamp}.{format}`

4. **Market Intelligence Export**:
   - **Formats**: CSV, JSON
   - **Data Included**:
     - Company name
     - Market sentiment
     - News count and headlines
     - Sources and publication dates
     - Last updated timestamp
   - **File Naming**: `market-intelligence-{timestamp}.{format}`

5. **Export System Features**:
   - Progress indicators for large exports
   - Cancellation support for in-progress exports
   - Error handling with retry capability
   - Client-side data transformation and formatting
   - Download triggers without page navigation
   - Export history/audit logging
   - Rate limiting (max 10 exports per user per hour)

**Functional Requirements - Performance Optimization**:

1. **React Component Optimization**:
   - `React.memo` for pure components (CustomerCard, AlertCard)
   - `useMemo` for expensive calculations (health scores, filtered lists)
   - `useCallback` for event handlers passed to children
   - Component lazy loading with `React.lazy` and `Suspense`
   - Virtual scrolling for customer lists (100+ items)

2. **Code Splitting and Bundling**:
   - Route-based code splitting (if multi-page)
   - Component-level code splitting for heavy widgets
   - Dynamic imports for export utilities
   - Separate vendor bundles
   - Tree shaking for unused code elimination

3. **Resource Optimization**:
   - Image optimization (WebP format, responsive images)
   - Font subsetting and preloading
   - CSS purging for unused styles
   - Minification and compression (Brotli/Gzip)
   - Asset caching with proper cache headers

4. **Service Worker Implementation** (Optional Advanced):
   - Offline capability for critical dashboard features
   - Cache-first strategy for static assets
   - Network-first strategy for API calls with fallback
   - Background sync for export operations
   - Push notifications for critical alerts

5. **Memory Management**:
   - Proper cleanup in `useEffect` hooks
   - Event listener removal on unmount
   - Debouncing for search inputs
   - Throttling for scroll events
   - Limited cache sizes with LRU eviction

**Functional Requirements - Accessibility Compliance**:

1. **Semantic HTML Structure**:
   - Proper heading hierarchy (h1 → h2 → h3)
   - Landmark regions (`<nav>`, `<main>`, `<aside>`, `<footer>`)
   - Semantic lists (`<ul>`, `<ol>`) for customer lists and alerts
   - `<button>` vs `<div>` for interactive elements
   - `<table>` with proper headers for tabular data

2. **Keyboard Navigation**:
   - Tab order follows logical content flow
   - All interactive elements keyboard accessible
   - Focus indicators meet 3:1 contrast ratio
   - Skip links ("Skip to main content", "Skip to alerts")
   - Keyboard shortcuts:
     - `Ctrl/Cmd + K`: Focus search
     - `Ctrl/Cmd + E`: Export data
     - `Ctrl/Cmd + R`: Refresh dashboard
     - `Esc`: Close modals/panels
   - Modal focus trapping
   - Focus restoration after modal close

3. **ARIA Labels and Descriptions**:
   - `aria-label` for icon-only buttons
   - `aria-labelledby` for complex components
   - `aria-describedby` for additional context
   - `aria-live` regions for dynamic content updates
   - `role` attributes for custom components
   - `aria-expanded`, `aria-selected` for interactive states
   - `aria-current` for current selection

4. **Screen Reader Support**:
   - Descriptive alt text for visual elements
   - Loading state announcements (`aria-live="polite"`)
   - Error message announcements (`aria-live="assertive"`)
   - Form label associations
   - Status updates for async operations
   - Hidden text for context (sr-only class)

5. **Color and Contrast**:
   - 4.5:1 contrast ratio for normal text
   - 3:1 contrast ratio for large text (18pt+)
   - 3:1 contrast ratio for UI components and focus indicators
   - No information conveyed by color alone
   - High contrast mode support
   - Colorblind-friendly palettes

**Functional Requirements - Security Hardening**:

1. **Content Security Policy (CSP)**:
   ```
   default-src 'self';
   script-src 'self' 'unsafe-inline' 'unsafe-eval';
   style-src 'self' 'unsafe-inline';
   img-src 'self' data: https:;
   font-src 'self' data:;
   connect-src 'self' https://api.example.com;
   ```

2. **Security Headers**:
   - `X-Frame-Options: DENY` (prevent clickjacking)
   - `X-Content-Type-Options: nosniff` (prevent MIME sniffing)
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - `Permissions-Policy` for feature restrictions
   - `Strict-Transport-Security` for HTTPS enforcement

3. **Input Validation and Sanitization**:
   - Client-side validation for all form inputs
   - Sanitize search queries (XSS prevention)
   - Validate API response data structure
   - Escape user-generated content
   - Maximum length enforcement
   - Type checking for all inputs

4. **Rate Limiting**:
   - Client-side request throttling
   - Export rate limiting (10 per hour per user)
   - API call rate limiting (100 per minute per user)
   - Error reporting rate limiting (prevent DoS)

5. **Secure Data Handling**:
   - No sensitive data in localStorage (use sessionStorage)
   - Sanitize error messages (no stack traces in production)
   - No PII in client-side logs
   - Secure export file generation (prevent code injection)

**Functional Requirements - Monitoring and Analytics**:

1. **Error Monitoring**:
   - Error tracking with context (user, component, action)
   - Error rate monitoring and alerting
   - Stack trace capture (development only)
   - User impact assessment (% of users affected)
   - Error categorization and prioritization

2. **Performance Monitoring**:
   - Core Web Vitals tracking (LCP, FID, CLS)
   - Custom performance metrics (health calc time, export time)
   - API response time monitoring
   - Component render time tracking
   - Memory usage monitoring

3. **Health Check Endpoints** (API Routes):
   - `/api/health` - Basic health check (200 OK)
   - `/api/health/detailed` - Component health status
   - Response format:
     ```json
     {
       "status": "healthy" | "degraded" | "unhealthy",
       "timestamp": "ISO-8601",
       "components": {
         "database": "healthy",
         "cache": "healthy",
         "external_api": "degraded"
       }
     }
     ```

4. **User Analytics** (Privacy-Respecting):
   - Feature usage tracking (which widgets used most)
   - Export frequency and format preferences
   - Error recovery success rates
   - Average session duration
   - User journey tracking

### Constraints

**Technical Stack**:
- Next.js 15+ with App Router
- React 19 with TypeScript (strict mode)
- Tailwind CSS 4.x for all styling
- No external state management libraries (React hooks only)
- No external monitoring services in workshop (mock implementations)

**File Structure**:
```
src/
├── lib/
│   ├── errors/
│   │   ├── DashboardError.ts          # Custom error classes
│   │   └── errorLogger.ts             # Error logging utilities
│   ├── export/
│   │   ├── exportUtils.ts             # Export formatting utilities
│   │   ├── csvExport.ts               # CSV export functions
│   │   └── jsonExport.ts              # JSON export functions
│   ├── performance/
│   │   ├── monitoring.ts              # Performance tracking
│   │   └── optimizations.ts           # Optimization utilities
│   └── accessibility/
│       └── a11yUtils.ts               # Accessibility helpers
├── components/
│   ├── ErrorBoundary/
│   │   ├── DashboardErrorBoundary.tsx # App-level error boundary
│   │   ├── WidgetErrorBoundary.tsx    # Widget-level error boundary
│   │   └── ErrorFallback.tsx          # Error UI components
│   ├── Export/
│   │   ├── ExportButton.tsx           # Export trigger button
│   │   ├── ExportModal.tsx            # Export configuration modal
│   │   └── ExportProgress.tsx         # Export progress indicator
│   ├── A11y/
│   │   ├── SkipLink.tsx               # Skip navigation links
│   │   └── ScreenReaderAnnouncer.tsx  # Live region announcer
│   └── Dashboard/
│       └── DashboardOrchestrator.tsx  # Main orchestrator component
├── app/
│   ├── api/
│   │   └── health/
│   │       ├── route.ts               # Basic health check
│   │       └── detailed/
│   │           └── route.ts           # Detailed health check
│   ├── page.tsx                       # Main dashboard page
│   └── layout.tsx                     # Root layout with error boundaries
└── next.config.js                     # Production optimizations
```

**TypeScript Definitions**:

```typescript
// src/lib/errors/DashboardError.ts

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';
export type ErrorCategory = 'data_fetch' | 'calculation' | 'export' | 'validation' | 'unknown';

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  timestamp: string;
  url: string;
  userAgent?: string;
  additionalData?: Record<string, any>;
}

export class DashboardError extends Error {
  code: string;
  severity: ErrorSeverity;
  category: ErrorCategory;
  userMessage: string;
  technicalDetails?: any;
  recoverable: boolean;
  context?: ErrorContext;

  constructor(
    message: string,
    code: string,
    severity: ErrorSeverity,
    category: ErrorCategory,
    userMessage: string,
    recoverable: boolean = true,
    technicalDetails?: any
  ) {
    super(message);
    this.name = 'DashboardError';
    this.code = code;
    this.severity = severity;
    this.category = category;
    this.userMessage = userMessage;
    this.recoverable = recoverable;
    this.technicalDetails = technicalDetails;
  }
}

export class DataFetchError extends DashboardError {
  constructor(message: string, endpoint?: string) {
    super(
      message,
      'DATA_FETCH_ERROR',
      'medium',
      'data_fetch',
      'Failed to load data. Please try again.',
      true,
      { endpoint }
    );
  }
}

export class CalculationError extends DashboardError {
  constructor(message: string, calculationType?: string) {
    super(
      message,
      'CALCULATION_ERROR',
      'high',
      'calculation',
      'Error calculating results. Please refresh the page.',
      true,
      { calculationType }
    );
  }
}

export class ExportError extends DashboardError {
  constructor(message: string, format?: string) {
    super(
      message,
      'EXPORT_ERROR',
      'low',
      'export',
      'Failed to export data. Please try again.',
      true,
      { format }
    );
  }
}
```

```typescript
// src/lib/export/exportUtils.ts

export type ExportFormat = 'csv' | 'json';
export type ExportDataType = 'customers' | 'health_scores' | 'alerts' | 'market_intelligence';

export interface ExportOptions {
  format: ExportFormat;
  dataType: ExportDataType;
  filters?: Record<string, any>;
  dateRange?: {
    start: string;  // ISO date
    end: string;    // ISO date
  };
  includeHeaders?: boolean;  // CSV only
  pretty?: boolean;          // JSON only
}

export interface ExportResult {
  success: boolean;
  filename: string;
  rowCount: number;
  fileSize: number;  // bytes
  duration: number;  // milliseconds
  error?: string;
}

export interface ExportProgress {
  status: 'preparing' | 'processing' | 'complete' | 'error';
  progress: number;  // 0-100
  rowsProcessed: number;
  totalRows: number;
  message?: string;
}
```

```typescript
// Component Props

interface DashboardErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface WidgetErrorBoundaryProps {
  children: React.ReactNode;
  widgetName: string;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onRetry?: () => void;
}

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
  severity?: ErrorSeverity;
  recoverable?: boolean;
}

interface ExportButtonProps {
  dataType: ExportDataType;
  data: any[];
  filename?: string;
  disabled?: boolean;
  className?: string;
}

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableDataTypes: ExportDataType[];
  onExport: (options: ExportOptions) => Promise<void>;
}

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
}

interface ScreenReaderAnnouncerProps {
  message: string;
  priority?: 'polite' | 'assertive';
}
```

**Performance Constraints**:
- Initial page load: < 3 seconds (standard broadband)
- First Contentful Paint (FCP): < 1.5 seconds
- Largest Contentful Paint (LCP): < 2.5 seconds
- Cumulative Layout Shift (CLS): < 0.1
- Time to Interactive (TTI): < 3.5 seconds
- Health score calculation: < 10ms per customer
- Export generation: < 5 seconds for 1000 records
- Component render time: < 100ms
- 60fps for animations and interactions

**Bundle Size Constraints**:
- Total JavaScript bundle: < 300KB (gzipped)
- Initial bundle (critical path): < 150KB (gzipped)
- Individual route chunks: < 50KB (gzipped)
- CSS bundle: < 50KB (gzipped)
- Fonts: < 100KB total

**Accessibility Constraints**:
- WCAG 2.1 Level AA compliance (target AAA where possible)
- Minimum contrast ratio: 4.5:1 for normal text, 3:1 for large text
- All functionality keyboard accessible
- Tab order logical and predictable
- Focus indicators visible and clear
- No keyboard traps
- Time limits have user controls (pause, extend, disable)
- No flashing content > 3 times per second

**Security Constraints**:
- Content Security Policy enforced
- All security headers configured
- Input validation on all user inputs
- XSS prevention through sanitization
- HTTPS-only in production
- No sensitive data in client-side storage
- Rate limiting on exports and API calls
- Error messages sanitized (no stack traces in production)

**Code Quality Constraints**:
- TypeScript strict mode enabled
- ESLint with accessibility plugin (eslint-plugin-jsx-a11y)
- No console.log in production builds
- Comprehensive error handling (try-catch for all async operations)
- JSDoc comments for all public APIs
- Unit tests for error boundaries and utilities
- Integration tests for export functionality

### Acceptance Criteria

**Error Boundary System**:
- [ ] DashboardErrorBoundary catches all unhandled errors in dashboard
- [ ] DashboardErrorBoundary displays user-friendly error page
- [ ] DashboardErrorBoundary logs errors with full context
- [ ] DashboardErrorBoundary provides "Reload Dashboard" action
- [ ] WidgetErrorBoundary isolates widget failures from other widgets
- [ ] WidgetErrorBoundary displays inline error UI
- [ ] WidgetErrorBoundary allows retry for recoverable errors
- [ ] Other widgets continue functioning when one widget fails
- [ ] Custom error classes have proper type hierarchy
- [ ] Error severity and category correctly assigned
- [ ] Development mode shows detailed error info
- [ ] Production mode shows sanitized error messages
- [ ] Error recovery retry mechanism works (max 3 attempts)
- [ ] Exponential backoff implemented for retries

**Export System - Customer Data**:
- [ ] Export customers to CSV format
- [ ] Export customers to JSON format
- [ ] CSV includes all required fields (name, company, email, tier, health score, ARR)
- [ ] JSON format properly structured with correct types
- [ ] Filter by risk level works (healthy/warning/critical)
- [ ] Filter by subscription tier works
- [ ] Filter by health score range works
- [ ] Export only selected customers works
- [ ] Filename includes timestamp in format `customers-export-YYYYMMDD-HHMMSS.{ext}`
- [ ] File downloads without page navigation

**Export System - Health Scores**:
- [ ] Export health scores to CSV format
- [ ] Export health scores to JSON format
- [ ] Includes overall score and individual factor scores
- [ ] Historical scores included for selected date range
- [ ] Date range filter works (7/30/90 days or custom)
- [ ] Factor breakdowns included in export
- [ ] Trend direction included in export

**Export System - Alerts**:
- [ ] Export alerts to CSV format
- [ ] Export alerts to JSON format
- [ ] Filter by priority works (high/medium)
- [ ] Filter by alert type works
- [ ] Filter by date range works
- [ ] Filter by customer works
- [ ] Filter by status (active/dismissed) works
- [ ] Includes all alert fields (type, priority, trigger, actions)

**Export System - General**:
- [ ] Progress indicator displays for exports > 1 second
- [ ] Export cancellation works
- [ ] Export error handling with user feedback
- [ ] Export rate limiting enforced (10 per hour)
- [ ] Export audit logging records exports
- [ ] Large dataset exports (1000+ records) complete successfully
- [ ] Export file sizes reasonable (compression applied)

**Performance Optimization**:
- [ ] CustomerCard wrapped in React.memo
- [ ] AlertCard wrapped in React.memo
- [ ] Health score calculation uses useMemo
- [ ] Filtered lists use useMemo
- [ ] Event handlers use useCallback
- [ ] Export utilities lazy loaded with dynamic import
- [ ] Virtual scrolling implemented for customer list (100+ items)
- [ ] No unnecessary re-renders (verified with React DevTools Profiler)
- [ ] useEffect cleanup functions implemented
- [ ] Event listeners removed on unmount
- [ ] Search input debounced (300ms delay)
- [ ] Memory usage stable over time (no leaks)

**Performance Metrics**:
- [ ] Initial page load < 3 seconds
- [ ] First Contentful Paint < 1.5 seconds
- [ ] Largest Contentful Paint < 2.5 seconds
- [ ] Cumulative Layout Shift < 0.1
- [ ] Time to Interactive < 3.5 seconds
- [ ] JavaScript bundle < 300KB gzipped
- [ ] Initial bundle < 150KB gzipped
- [ ] CSS bundle < 50KB gzipped

**Accessibility - Semantic HTML**:
- [ ] Proper heading hierarchy (h1 → h2 → h3, no skips)
- [ ] Landmark regions defined (nav, main, aside)
- [ ] Lists use ul/ol elements
- [ ] Interactive elements use button or a elements
- [ ] Tables use proper table markup with headers
- [ ] Form inputs have associated labels

**Accessibility - Keyboard Navigation**:
- [ ] All interactive elements keyboard accessible
- [ ] Tab order follows logical flow
- [ ] Focus indicators visible with 3:1 contrast
- [ ] Skip links work ("Skip to main content")
- [ ] Keyboard shortcuts implemented and documented
- [ ] Ctrl/Cmd + K focuses search
- [ ] Ctrl/Cmd + E opens export modal
- [ ] Esc closes modals
- [ ] Modal focus trapping works
- [ ] Focus restored after modal close
- [ ] No keyboard traps anywhere in dashboard

**Accessibility - ARIA**:
- [ ] Icon-only buttons have aria-label
- [ ] Complex components have aria-labelledby
- [ ] Additional context provided via aria-describedby
- [ ] Dynamic updates use aria-live regions
- [ ] Custom components have appropriate role attributes
- [ ] aria-expanded used for expandable sections
- [ ] aria-selected used for selected items
- [ ] aria-current used for current selection

**Accessibility - Screen Reader**:
- [ ] Loading states announced with aria-live="polite"
- [ ] Errors announced with aria-live="assertive"
- [ ] Form labels properly associated with inputs
- [ ] Alternative text for visual elements
- [ ] Status updates announced for async operations
- [ ] Screen reader testing passes with NVDA/JAWS/VoiceOver

**Accessibility - Color & Contrast**:
- [ ] Normal text has 4.5:1 contrast ratio
- [ ] Large text has 3:1 contrast ratio
- [ ] UI components have 3:1 contrast ratio
- [ ] Focus indicators have 3:1 contrast ratio
- [ ] No information conveyed by color alone
- [ ] Colorblind-friendly palette used
- [ ] High contrast mode supported

**Security**:
- [ ] Content Security Policy configured and enforced
- [ ] X-Frame-Options header set to DENY
- [ ] X-Content-Type-Options header set to nosniff
- [ ] Referrer-Policy header configured
- [ ] Strict-Transport-Security header configured
- [ ] All form inputs validated client-side
- [ ] Search queries sanitized
- [ ] API responses validated
- [ ] User-generated content escaped
- [ ] Export rate limiting enforced
- [ ] No sensitive data in localStorage
- [ ] Error messages sanitized in production
- [ ] No PII in client-side logs
- [ ] Stack traces hidden in production

**Monitoring & Health Checks**:
- [ ] /api/health endpoint returns 200 OK
- [ ] /api/health/detailed returns component health status
- [ ] Error tracking captures errors with context
- [ ] Error rate monitoring implemented
- [ ] Performance metrics tracked (LCP, FID, CLS)
- [ ] API response times monitored
- [ ] Component render times tracked
- [ ] User analytics tracked (privacy-respecting)

**Integration**:
- [ ] Error boundaries wrap all existing components
- [ ] Export works with all data sources
- [ ] Performance optimizations don't break existing functionality
- [ ] Accessibility enhancements applied to all components
- [ ] Security headers don't break existing features
- [ ] Monitoring integrated without performance impact

**Code Quality**:
- [ ] TypeScript strict mode passes
- [ ] ESLint passes with no violations
- [ ] jsx-a11y plugin passes with no violations
- [ ] No console.log in production build
- [ ] All async operations have try-catch
- [ ] JSDoc comments on all public APIs
- [ ] No TypeScript `any` types
- [ ] Error handling comprehensive

### Implementation Notes

**Implementation Order**:

1. **Phase 1: Error Handling Foundation** (Highest Priority)
   - Create custom error classes
   - Implement DashboardErrorBoundary
   - Implement WidgetErrorBoundary
   - Create error fallback UI components
   - Add error logging utilities
   - Wrap existing components with error boundaries
   - Test error scenarios

2. **Phase 2: Export System** (High Priority)
   - Create export utilities (CSV, JSON formatters)
   - Implement ExportButton component
   - Implement ExportModal for configuration
   - Add export progress tracking
   - Implement rate limiting
   - Add export audit logging
   - Test with various data types and sizes

3. **Phase 3: Performance Optimization** (High Priority)
   - Audit current performance with Lighthouse
   - Add React.memo to pure components
   - Add useMemo for expensive calculations
   - Add useCallback for event handlers
   - Implement virtual scrolling for lists
   - Add code splitting with React.lazy
   - Optimize images and assets
   - Verify improvements with Lighthouse

4. **Phase 4: Accessibility** (Medium Priority)
   - Add semantic HTML structure
   - Implement skip links
   - Add ARIA labels and descriptions
   - Implement keyboard navigation
   - Add screen reader announcer
   - Test with screen readers
   - Fix contrast issues
   - Add keyboard shortcuts

5. **Phase 5: Security & Monitoring** (Medium Priority)
   - Configure security headers
   - Add input validation/sanitization
   - Implement rate limiting
   - Create health check endpoints
   - Add error monitoring
   - Add performance tracking
   - Sanitize production error messages

**Error Boundary Implementation Example**:

```typescript
// src/components/ErrorBoundary/DashboardErrorBoundary.tsx

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { DashboardError } from '@/lib/errors/DashboardError';
import { logError } from '@/lib/errors/errorLogger';
import ErrorFallback from './ErrorFallback';

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
    // Log error to monitoring service
    logError(error, {
      component: 'DashboardErrorBoundary',
      errorInfo: errorInfo.componentStack,
      severity: error instanceof DashboardError ? error.severity : 'high',
      timestamp: new Date().toISOString()
    });

    // Call optional error handler
    this.props.onError?.(error, errorInfo);

    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });

    // Optionally reload the page
    window.location.reload();
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || ErrorFallback;

      return (
        <FallbackComponent
          error={this.state.error}
          resetError={this.handleReset}
          severity={
            this.state.error instanceof DashboardError
              ? this.state.error.severity
              : 'high'
          }
          recoverable={
            this.state.error instanceof DashboardError
              ? this.state.error.recoverable
              : true
          }
        />
      );
    }

    return this.props.children;
  }
}
```

**Widget Error Boundary Example**:

```typescript
// src/components/ErrorBoundary/WidgetErrorBoundary.tsx

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logError } from '@/lib/errors/errorLogger';

interface Props {
  children: ReactNode;
  widgetName: string;
  onRetry?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  retryCount: number;
}

export class WidgetErrorBoundary extends Component<Props, State> {
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
    logError(error, {
      component: this.props.widgetName,
      errorInfo: errorInfo.componentStack,
      retryCount: this.state.retryCount
    });
  }

  handleRetry = () => {
    if (this.state.retryCount >= 3) {
      return; // Max retries exceeded
    }

    this.setState(prev => ({
      hasError: false,
      error: null,
      retryCount: prev.retryCount + 1
    }));

    this.props.onRetry?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="border-2 border-red-300 bg-red-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-700 mb-2">
            {this.props.widgetName} Error
          </h3>
          <p className="text-red-600 mb-4">
            This widget encountered an error and couldn't load.
          </p>
          {this.state.retryCount < 3 && (
            <button
              onClick={this.handleRetry}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry ({3 - this.state.retryCount} attempts remaining)
            </button>
          )}
          {this.state.retryCount >= 3 && (
            <p className="text-sm text-red-500">
              Max retries exceeded. Please refresh the page.
            </p>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
```

**Export Utilities Example**:

```typescript
// src/lib/export/csvExport.ts

export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  columns?: Array<{ key: keyof T; label: string }>
): ExportResult {
  const startTime = Date.now();

  try {
    // Determine columns
    const cols = columns || Object.keys(data[0] || {}).map(key => ({
      key: key as keyof T,
      label: key
    }));

    // Create CSV header
    const header = cols.map(col => col.label).join(',');

    // Create CSV rows
    const rows = data.map(item => {
      return cols.map(col => {
        const value = item[col.key];
        // Escape values containing commas, quotes, or newlines
        if (typeof value === 'string' && /[",\n]/.test(value)) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value ?? '';
      }).join(',');
    });

    // Combine header and rows
    const csv = [header, ...rows].join('\n');

    // Create blob and trigger download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);

    return {
      success: true,
      filename,
      rowCount: data.length,
      fileSize: blob.size,
      duration: Date.now() - startTime
    };
  } catch (error) {
    throw new ExportError(
      `Failed to export CSV: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'csv'
    );
  }
}
```

**Performance Optimization Example**:

```typescript
// Optimized CustomerSelector with React.memo and useMemo

'use client';

import { useState, useMemo, useCallback } from 'react';
import { Customer, mockCustomers } from '@/data/mock-customers';
import CustomerCard from './CustomerCard';

interface CustomerSelectorProps {
  onCustomerSelect: (customerId: string) => void;
  selectedCustomerId?: string;
}

// Memoize CustomerCard to prevent unnecessary re-renders
const MemoizedCustomerCard = React.memo(CustomerCard);

export default function CustomerSelector({
  onCustomerSelect,
  selectedCustomerId
}: CustomerSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Memoize filtered customers - only recalculate when query or data changes
  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return mockCustomers;

    const query = searchQuery.toLowerCase();
    return mockCustomers.filter(customer =>
      customer.name.toLowerCase().includes(query) ||
      customer.company.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Memoize callback to prevent child re-renders
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <input
        type="search"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search customers..."
        className="mb-4 px-4 py-2 border rounded-lg"
        aria-label="Search customers"
      />

      <div className="flex-1 overflow-y-auto">
        {filteredCustomers.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No customers found</p>
        ) : (
          <div className="space-y-2">
            {filteredCustomers.map(customer => (
              <MemoizedCustomerCard
                key={customer.id}
                customer={customer}
                isSelected={customer.id === selectedCustomerId}
                onClick={onCustomerSelect}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

**Accessibility Example - Skip Links**:

```typescript
// src/components/A11y/SkipLink.tsx

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
}

export default function SkipLink({ href, children }: SkipLinkProps) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:shadow-lg"
    >
      {children}
    </a>
  );
}

// Usage in layout:
<SkipLink href="#main-content">Skip to main content</SkipLink>
<SkipLink href="#customer-list">Skip to customer list</SkipLink>
<SkipLink href="#alerts">Skip to alerts</SkipLink>
```

**Security Headers Configuration**:

```javascript
// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
          }
        ]
      }
    ];
  },

  // Production optimizations
  compress: true,
  poweredByHeader: false,

  // Performance optimizations
  swcMinify: true,

  // Image optimization
  images: {
    formats: ['image/webp'],
    deviceSizes: [640, 768, 1024, 1280, 1536],
  }
};

module.exports = nextConfig;
```

**Health Check API Example**:

```typescript
// src/app/api/health/route.ts

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0'
    },
    { status: 200 }
  );
}
```

```typescript
// src/app/api/health/detailed/route.ts

import { NextResponse } from 'next/server';

export async function GET() {
  // Check various system components
  const components = {
    cache: checkCacheHealth(),
    monitoring: 'healthy',
    exports: 'healthy'
  };

  const allHealthy = Object.values(components).every(status => status === 'healthy');

  return NextResponse.json(
    {
      status: allHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      components
    },
    { status: allHealthy ? 200 : 503 }
  );
}

function checkCacheHealth(): 'healthy' | 'degraded' {
  // Mock implementation
  return 'healthy';
}
```

**Testing Checklist**:

**Error Handling Tests**:
- Simulate component throw error → error boundary catches it
- Test retry mechanism (should work 3 times, then stop)
- Test widget isolation (one widget fails, others work)
- Test error logging captures context
- Test different error severities display correctly
- Test production vs development error messages

**Export Tests**:
- Export 0 rows (edge case)
- Export 1 row
- Export 1000+ rows (performance)
- Export with special characters in data (CSV escaping)
- Export with filters applied
- Export cancellation
- Export rate limiting (11th export in hour should fail)

**Performance Tests**:
- Run Lighthouse audit (target score: 90+)
- Profile with React DevTools (check for unnecessary renders)
- Memory profiling (check for leaks over 5 minutes)
- Bundle size analysis with webpack-bundle-analyzer
- Test on slow 3G network connection

**Accessibility Tests**:
- Automated testing with axe-core
- Keyboard navigation testing (tab through entire dashboard)
- Screen reader testing (NVDA on Windows, VoiceOver on Mac)
- Color contrast checker
- Zoom to 200% (layout should remain usable)

**Security Tests**:
- Verify CSP in browser DevTools
- Verify security headers with curl or security scanner
- Test XSS prevention (inject script tags in search)
- Test rate limiting (make 11 rapid exports)
- Verify no sensitive data in localStorage

**Future Enhancements** (Out of scope for workshop):
- Real error monitoring service integration (Sentry, Datadog)
- Advanced analytics dashboard
- A/B testing framework
- Progressive Web App (PWA) capabilities
- Offline mode with service workers
- Real-time collaboration features
- Advanced data visualization exports (PDF, Excel)
- Custom report builder
- Scheduled exports via email
- Role-based access control (RBAC)
