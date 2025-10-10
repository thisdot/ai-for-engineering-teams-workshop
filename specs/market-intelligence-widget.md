# Spec: Market Intelligence Widget

## Feature: Market Intelligence Widget

### Context

The Market Intelligence Widget provides real-time market sentiment and news analysis for customer companies within the Customer Intelligence Dashboard. This feature demonstrates spec-driven context compression and component composition techniques, showing how to maintain consistency across multiple AI-generated dashboard widgets.

**Purpose and Role**:
- Display market sentiment analysis for selected customer's company
- Show recent news headlines and article counts for market awareness
- Provide customer success teams with external market context
- Enable proactive customer conversations based on market conditions
- Demonstrate pattern consistency across dashboard widget architecture

**System Integration**:
- API Layer: Next.js Route Handler at `src/app/api/market-intelligence/[company]/route.ts`
- Service Layer: `MarketIntelligenceService` class in `src/lib/services/marketIntelligenceService.ts`
- UI Component: `MarketIntelligenceWidget` in `src/components/MarketIntelligenceWidget.tsx`
- Dashboard Integration: Integrated into main dashboard alongside existing widgets
- Data Flow: Customer selection → Company name → API call → Service layer → Mock data → UI display

**User Interaction**:
- Automatically loads market intelligence when customer is selected
- Displays market sentiment with color-coded indicators
- Shows top 3 recent headlines with sources
- Updates in real-time when customer selection changes
- Primary users: Customer success managers, account executives, sales teams

### Requirements

**Functional Requirements - API Layer**:

1. **Next.js Route Handler** (`src/app/api/market-intelligence/[company]/route.ts`):
   - GET endpoint accepting company name as dynamic route parameter
   - URL format: `/api/market-intelligence/[company]`
   - Company name validation and sanitization
   - Simulate realistic API delay (500-1000ms) for authentic UX
   - Return consistent JSON response format
   - Proper HTTP status codes (200, 400, 500)
   - Error handling with descriptive messages

2. **API Response Format**:
```typescript
interface MarketIntelligenceResponse {
  company: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  newsCount: number;
  headlines: Array<{
    title: string;
    source: string;
    publishedAt: string;  // ISO 8601 date string
    url?: string;         // Optional for mock data
  }>;
  lastUpdated: string;    // ISO 8601 timestamp
  cached: boolean;
}
```

3. **Input Validation**:
   - Company name must be non-empty string
   - Sanitize special characters to prevent injection
   - Maximum length: 100 characters
   - Trim whitespace
   - Return 400 error for invalid input

**Functional Requirements - Service Layer**:

1. **MarketIntelligenceService Class** (`src/lib/services/marketIntelligenceService.ts`):
   - Singleton pattern or static methods
   - `getMarketIntelligence(company: string)` main method
   - Caching mechanism with TTL expiration (10-minute cache)
   - Mock data generation for realistic company-specific data
   - Pure function implementations for testability
   - Custom error handling with `MarketIntelligenceError` class

2. **Caching Strategy**:
   - In-memory cache (Map or object) keyed by company name
   - 10-minute TTL (600,000ms) for cached entries
   - Cache hit returns immediately without regeneration
   - Cache miss triggers new mock data generation
   - Include `cached: boolean` flag in response

3. **Mock Data Generation**:
   - Generate 5-10 realistic headlines per company
   - Vary sentiment based on company name hash or random seed
   - Create believable news sources (TechCrunch, Reuters, Bloomberg, etc.)
   - Realistic publication dates (within last 7 days)
   - Company-specific keyword insertion in headlines
   - Consistent data for same company across requests (within cache TTL)

4. **Error Handling**:
   - Custom `MarketIntelligenceError` extends Error
   - Categorize errors: validation, service, unknown
   - Include error codes for client handling
   - Sanitize error messages (no sensitive data)
   - Graceful degradation for service failures

**Functional Requirements - UI Component**:

1. **MarketIntelligenceWidget Component** (`src/components/MarketIntelligenceWidget.tsx`):
   - Accept company name via props
   - Fetch market intelligence from API endpoint
   - Display market sentiment with color-coded badge
   - Show news article count and last updated timestamp
   - List top 3 headlines with source and date
   - Loading state with skeleton or spinner
   - Error state with retry capability
   - Empty state when no company selected

2. **Display Elements**:
   - **Widget Header**: "Market Intelligence" title, company name badge
   - **Sentiment Indicator**: Large badge with color coding
     - Positive: Green background, "Positive" label
     - Neutral: Yellow background, "Neutral" label
     - Negative: Red background, "Negative" label
   - **Metadata Bar**: News count, last updated time
   - **Headlines List**: Top 3 headlines with:
     - Headline title (truncate if > 100 characters)
     - Source name
     - Publication date (relative format: "2 hours ago")
   - **Footer**: "Powered by Mock Data" or similar attribution

3. **Interaction States**:
   - **Loading**: Show skeleton loader or spinner, disable interactions
   - **Success**: Display all data with proper formatting
   - **Error**: Show error message with retry button
   - **Empty**: Show "Select a customer to view market intelligence" message

4. **Responsive Behavior**:
   - Mobile: Stacked layout, full-width headlines
   - Tablet: Compact horizontal sentiment display
   - Desktop: Full layout with grid-based headlines

**Functional Requirements - Dashboard Integration**:

1. **Main Dashboard Integration**:
   - Add MarketIntelligenceWidget to dashboard layout
   - Pass selected customer's company name as prop
   - Position alongside existing widgets (grid layout)
   - Maintain consistent spacing and alignment
   - Follow same responsive breakpoint behavior

2. **State Management**:
   - Receive company name from parent dashboard state
   - React to customer selection changes
   - Re-fetch data when company name changes
   - Handle loading states independently from other widgets
   - No cross-widget state dependencies

### Constraints

**Technical Stack**:
- Next.js 15+ with App Router and Route Handlers
- React 19 with TypeScript (strict mode)
- Tailwind CSS 4.x for all styling
- No external API dependencies (mock data only)
- No external state management libraries (use React hooks)

**File Structure**:
```
src/
├── app/
│   └── api/
│       └── market-intelligence/
│           └── [company]/
│               └── route.ts              # API Route Handler
├── lib/
│   └── services/
│       └── marketIntelligenceService.ts  # Service layer with caching
├── components/
│   └── MarketIntelligenceWidget.tsx      # UI component
└── app/
    └── page.tsx                          # Dashboard integration
```

**TypeScript Definitions**:

```typescript
// src/lib/services/marketIntelligenceService.ts

export type MarketSentiment = 'positive' | 'neutral' | 'negative';

export interface NewsHeadline {
  title: string;
  source: string;
  publishedAt: string;  // ISO 8601
  url?: string;
}

export interface MarketIntelligenceData {
  company: string;
  sentiment: MarketSentiment;
  newsCount: number;
  headlines: NewsHeadline[];
  lastUpdated: string;  // ISO 8601
  cached: boolean;
}

export class MarketIntelligenceError extends Error {
  constructor(
    message: string,
    public code: 'VALIDATION_ERROR' | 'SERVICE_ERROR' | 'UNKNOWN_ERROR',
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'MarketIntelligenceError';
  }
}

interface CacheEntry {
  data: MarketIntelligenceData;
  timestamp: number;
}

export class MarketIntelligenceService {
  private static cache = new Map<string, CacheEntry>();
  private static readonly CACHE_TTL = 10 * 60 * 1000; // 10 minutes

  static async getMarketIntelligence(company: string): Promise<MarketIntelligenceData> {
    // Implementation
  }

  private static validateCompany(company: string): void {
    // Validation logic
  }

  private static generateMockData(company: string): MarketIntelligenceData {
    // Mock data generation
  }

  private static isCacheValid(entry: CacheEntry): boolean {
    // Cache validation
  }
}
```

```typescript
// src/components/MarketIntelligenceWidget.tsx

interface MarketIntelligenceWidgetProps {
  companyName: string | null;
  className?: string;
}
```

**API Route Handler Structure**:
```typescript
// src/app/api/market-intelligence/[company]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { MarketIntelligenceService, MarketIntelligenceError } from '@/lib/services/marketIntelligenceService';

export async function GET(
  request: NextRequest,
  { params }: { params: { company: string } }
) {
  try {
    const { company } = params;

    // Simulate realistic API delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));

    const data = await MarketIntelligenceService.getMarketIntelligence(company);

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    if (error instanceof MarketIntelligenceError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', code: 'UNKNOWN_ERROR' },
      { status: 500 }
    );
  }
}
```

**Security Constraints**:
- Input validation: Whitelist alphanumeric characters, spaces, hyphens
- Maximum input length: 100 characters
- Sanitize company name in responses
- No external API calls (prevents data leakage)
- Error messages must not expose internal implementation details
- Rate limiting consideration (optional for workshop)
- CORS headers if needed for external access

**Performance Constraints**:
- API response time: < 2 seconds (including simulated delay)
- Cache lookup: < 10ms
- Mock data generation: < 100ms
- UI render time: < 200ms
- Memory-efficient caching (limit cache size if needed)
- No memory leaks in cache management

**Design Constraints**:
- Widget follows established dashboard card pattern
- Color coding matches customer health score system:
  - Positive: `bg-green-100`, `text-green-700`, `border-green-500`
  - Neutral: `bg-yellow-100`, `text-yellow-700`, `border-yellow-500`
  - Negative: `bg-red-100`, `text-red-700`, `border-red-500`
- Widget max-width: 600px on desktop
- Card pattern: `rounded-lg shadow-md p-6`
- Headlines truncated with ellipsis beyond 100 characters
- Responsive grid: 1 column mobile, 2 columns tablet, 3 columns desktop (for dashboard layout)

**Pattern Consistency Requirements**:
- Match existing widget styling (if other widgets exist)
- Use same loading spinner/skeleton pattern
- Follow same error display pattern
- Maintain consistent typography hierarchy
- Use same button styles for retry actions
- Consistent spacing with other dashboard widgets

**Code Quality Constraints**:
- JSDoc comments for all public methods
- Descriptive variable and function names
- No magic numbers (use named constants)
- Proper TypeScript typing (no `any` types)
- Error handling in all async operations
- Proper cleanup in useEffect hooks

### Acceptance Criteria

**API Layer**:
- [ ] Route handler at `/api/market-intelligence/[company]` responds to GET requests
- [ ] Company name parameter extracted from dynamic route correctly
- [ ] Input validation rejects empty, null, or overly long company names
- [ ] Special characters sanitized to prevent injection attacks
- [ ] API simulates realistic delay (500-1000ms)
- [ ] Success response returns proper JSON format with all required fields
- [ ] 400 error returned for validation failures with descriptive message
- [ ] 500 error returned for service failures with sanitized message
- [ ] Response includes proper HTTP headers (Content-Type: application/json)

**Service Layer**:
- [ ] MarketIntelligenceService class implemented with static methods
- [ ] `getMarketIntelligence(company)` method validates input
- [ ] Caching mechanism stores data with timestamp
- [ ] Cache TTL of 10 minutes enforced correctly
- [ ] Cache hit returns existing data with `cached: true` flag
- [ ] Cache miss generates new mock data
- [ ] Mock data generation creates 5-10 realistic headlines
- [ ] Sentiment varies based on company (consistent within cache period)
- [ ] News sources are realistic (TechCrunch, Reuters, Bloomberg, etc.)
- [ ] Publication dates within last 7 days
- [ ] Company name appears in generated headlines
- [ ] MarketIntelligenceError class extends Error with proper structure
- [ ] Error codes categorize different error types
- [ ] TypeScript interfaces defined for all data structures

**UI Component**:
- [ ] MarketIntelligenceWidget component accepts companyName prop
- [ ] Component uses 'use client' directive
- [ ] Fetches data from API endpoint when companyName provided
- [ ] Loading state displays skeleton/spinner while fetching
- [ ] Success state displays all data elements correctly
- [ ] Error state displays error message with retry button
- [ ] Empty state shows message when no company selected
- [ ] Sentiment badge displays with correct color coding
- [ ] News count and last updated timestamp formatted properly
- [ ] Top 3 headlines displayed with title, source, and date
- [ ] Publication dates formatted as relative time ("2 hours ago")
- [ ] Headlines truncated if longer than 100 characters
- [ ] Retry button re-fetches data on error
- [ ] Component fully typed with TypeScript
- [ ] Responsive design works at mobile, tablet, desktop breakpoints

**Dashboard Integration**:
- [ ] Widget integrated into main dashboard layout
- [ ] Receives selected customer's company name from parent
- [ ] Re-fetches data when customer selection changes
- [ ] Widget positioned in grid layout with consistent spacing
- [ ] Maintains responsive behavior with other widgets
- [ ] No layout shifts or overlaps with existing components
- [ ] Loading state doesn't block other widgets
- [ ] Error in widget doesn't crash entire dashboard

**Pattern Consistency**:
- [ ] Widget styling matches existing dashboard card pattern
- [ ] Color coding consistent with health score indicators
- [ ] Loading state matches other widget patterns
- [ ] Error display matches other widget patterns
- [ ] Typography hierarchy consistent with dashboard
- [ ] Button styles match existing dashboard buttons
- [ ] Spacing and padding consistent with other widgets

**Security & Validation**:
- [ ] Company name validated for length and character set
- [ ] Special characters sanitized in input
- [ ] Error messages don't expose sensitive information
- [ ] No external API calls made (mock data only)
- [ ] Cache doesn't grow unbounded (optional: implement size limit)

**Performance**:
- [ ] API responds within 2 seconds including simulated delay
- [ ] Cache lookup completes in < 10ms
- [ ] Mock data generation completes in < 100ms
- [ ] Component renders in < 200ms
- [ ] No memory leaks from caching or event listeners
- [ ] useEffect cleanup functions properly implemented

**Code Quality**:
- [ ] All functions have JSDoc comments
- [ ] No magic numbers (constants named)
- [ ] No `any` types in TypeScript
- [ ] Proper error handling in all async operations
- [ ] TypeScript compilation passes with no errors
- [ ] ESLint passes with no violations
- [ ] No console errors or warnings in browser

### Implementation Notes

**Mock Data Generation Strategy**:

```typescript
private static generateMockData(company: string): MarketIntelligenceData {
  // Use company name to seed consistent sentiment
  const sentimentScore = this.hashString(company) % 3;
  const sentiment: MarketSentiment =
    sentimentScore === 0 ? 'positive' :
    sentimentScore === 1 ? 'neutral' : 'negative';

  // Generate 5-10 headlines
  const newsCount = 5 + (this.hashString(company) % 6);
  const headlines = this.generateHeadlines(company, newsCount);

  return {
    company,
    sentiment,
    newsCount,
    headlines: headlines.slice(0, 3), // Return top 3
    lastUpdated: new Date().toISOString(),
    cached: false
  };
}

private static generateHeadlines(company: string, count: number): NewsHeadline[] {
  const sources = ['TechCrunch', 'Reuters', 'Bloomberg', 'Wall Street Journal', 'Forbes'];
  const templates = [
    `${company} announces new product initiative`,
    `${company} reports quarterly earnings`,
    `Market analysis: ${company}'s growth strategy`,
    `${company} expands into new markets`,
    `Industry experts weigh in on ${company}'s future`,
  ];

  return Array.from({ length: count }, (_, i) => ({
    title: templates[i % templates.length],
    source: sources[i % sources.length],
    publishedAt: this.getRandomRecentDate(),
    url: undefined // Optional for mock data
  }));
}

private static getRandomRecentDate(): string {
  const now = Date.now();
  const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
  const randomTime = sevenDaysAgo + Math.random() * (now - sevenDaysAgo);
  return new Date(randomTime).toISOString();
}

private static hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}
```

**Component Data Fetching Pattern**:

```typescript
'use client';

import { useState, useEffect } from 'react';

export default function MarketIntelligenceWidget({ companyName }: MarketIntelligenceWidgetProps) {
  const [data, setData] = useState<MarketIntelligenceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!companyName) {
      setData(null);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/market-intelligence/${encodeURIComponent(companyName)}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch market intelligence');
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [companyName]);

  // Render logic for different states
  if (!companyName) {
    return <EmptyState />;
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={() => {/* refetch */}} />;
  }

  if (data) {
    return <DataDisplay data={data} />;
  }

  return null;
}
```

**Relative Time Formatting**:

```typescript
function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);

  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  return `${days} day${days !== 1 ? 's' : ''} ago`;
}
```

**Sentiment Badge Component**:

```typescript
function SentimentBadge({ sentiment }: { sentiment: MarketSentiment }) {
  const styles = {
    positive: 'bg-green-100 text-green-700 border-green-500',
    neutral: 'bg-yellow-100 text-yellow-700 border-yellow-500',
    negative: 'bg-red-100 text-red-700 border-red-500'
  };

  const labels = {
    positive: 'Positive',
    neutral: 'Neutral',
    negative: 'Negative'
  };

  return (
    <span className={`px-4 py-2 rounded-full border-2 font-semibold ${styles[sentiment]}`}>
      {labels[sentiment]}
    </span>
  );
}
```

**Testing Checklist**:
- Test with various company names (short, long, special characters)
- Test with empty/null company name
- Test cache hit scenario (same company within 10 minutes)
- Test cache miss scenario (different company or expired cache)
- Test API error handling (simulate service failure)
- Test component loading state
- Test component error state with retry
- Test component empty state
- Test responsive layout at all breakpoints
- Test headline truncation for long titles
- Test relative time formatting for various dates
- Test sentiment color coding for all three states
- Test dashboard integration with customer selection changes
- Test multiple rapid customer selection changes (race conditions)

**Dashboard Integration Example**:

```typescript
// src/app/page.tsx

'use client';

import { useState } from 'react';
import CustomerSelector from '@/components/CustomerSelector';
import MarketIntelligenceWidget from '@/components/MarketIntelligenceWidget';

export default function DashboardPage() {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const handleCustomerSelect = (customerId: string) => {
    setSelectedCustomerId(customerId);
    const customer = mockCustomers.find(c => c.id === customerId);
    setSelectedCustomer(customer || null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <CustomerSelector
        onCustomerSelect={handleCustomerSelect}
        selectedCustomerId={selectedCustomerId}
      />
      <MarketIntelligenceWidget
        companyName={selectedCustomer?.company || null}
      />
    </div>
  );
}
```

**Future Enhancements** (Out of scope for workshop):
- Real API integration with news services
- Sentiment analysis using ML models
- Historical sentiment tracking and visualization
- Configurable news sources and filters
- Export functionality for reports
- Webhook notifications for significant sentiment changes
- Advanced caching with Redis or similar
- Rate limiting and API key management
