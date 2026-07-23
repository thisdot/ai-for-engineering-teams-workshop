# Market Intelligence Widget Requirements

## Business Context
- Build a market intelligence widget for the Customer Intelligence Dashboard
- Provide real-time market sentiment and news analysis for customer companies
- Demonstrate spec-driven context compression and component composition techniques
- Show how to maintain consistency across multiple AI-generated widgets

## Functional Requirements

### API Layer
- Create Next.js API route at `/api/market-intelligence/[company]`
- Use mock data generation for reliable workshop demonstration
- Validate company name input and sanitize responses
- Return consistent JSON response format with sentiment, news count, and headlines
- Follow same patterns as existing customer management API routes
- Include realistic API delay simulation for authentic user experience

### Service Layer
- Create MarketIntelligenceService class following established patterns
- Implement caching with TTL expiration (10-minute cache for mock news data)
- Centralized error handling with custom MarketIntelligenceError class
- Pure function implementations for testability and consistency
- Mock data service generates realistic company-specific headlines and sentiment

### UI Component
- Build MarketIntelligenceWidget component matching existing widget patterns
- Input field for company name entry with validation
- Display market sentiment with color-coded indicators (green/yellow/red)
- Show news article count and last updated timestamp
- Display top 3 headlines with source and publication date
- Loading and error states consistent with other widgets

### Dashboard Integration
- Integrate into main Dashboard component alongside existing widgets
- Receive company name from selected customer data
- Follow same prop passing and state management patterns
- Maintain responsive grid layout and consistent spacing

## Spec-Driven Workflow Requirements
- Generate comprehensive spec from these requirements
- Analyze existing components for pattern consistency before spec creation
- Store generated spec in @specs/ directory for reference
- Reference existing component patterns in spec constraints section

## Security Requirements
- Company name parameter validation to prevent injection attacks
- Input sanitization for mock data generation security
- Proper timeout simulation and error handling
- Error message sanitization (no sensitive information leakage)
- Follow same security patterns as customer management integration
- Mock data generation prevents external API vulnerabilities

## Technical Constraints
- Next.js 15 App Router with Route Handlers
- TypeScript with strict typing for all interfaces
- React 19 hooks and patterns for UI components  
- Tailwind CSS for styling with design system colors
- Error boundaries for robustness and graceful failure handling
- Follow established caching, error handling, and service layer patterns

## Integration Pattern Requirements
- Match existing widget styling and layout patterns
- Use same color coding system as customer management (green/yellow/red)
- Follow same input/button/error display patterns
- Implement same loading state and error handling UX
- Maintain consistent spacing, typography, and component structure

## Context Compression Goals
- Demonstrate automated pattern discovery across multiple components
- Show how to maintain consistency without manual pattern summarization
- Teach effective spec generation using existing codebase analysis
- Illustrate cohesive dashboard composition with multiple AI-generated widgets
- Use mock data to ensure reliable, predictable workshop outcomes

## UI Components (shadcn/ui)
- `Card` (`src/components/ui/card.tsx`) — widget container matching other widgets
- `Input` (`src/components/ui/input.tsx`) — company name entry with validation
- `Button` (`src/components/ui/button.tsx`) — trigger / refresh lookup
- `Badge` (`src/components/ui/badge.tsx`) — sentiment indicator using the shared green/yellow/red mapping
- `Skeleton` (`src/components/ui/skeleton.tsx`) — loading state during simulated API delay
- `Alert` (`src/components/ui/alert.tsx`) — error states from `MarketIntelligenceError`
- `Separator` (`src/components/ui/separator.tsx`) — divide headlines
- `Avatar` (`src/components/ui/avatar.tsx`) or small lucide icon — per-headline news source
- Optional `Chart` (`src/components/ui/chart.tsx`) — sentiment trend using theme `chart-*` tokens