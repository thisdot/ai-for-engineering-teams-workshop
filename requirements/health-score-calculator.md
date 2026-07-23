# Health Score Calculator Requirements

## Business Context
- Build a comprehensive customer health scoring system for the Customer Intelligence Dashboard
- Provide predictive analytics for customer relationship health and churn risk
- Demonstrate AI collaboration for complex business logic development and algorithm design
- Show collaborative requirements exploration and transparent algorithm development

## Functional Requirements

### Core Algorithm
- Calculate customer health scores on 0-100 scale with clear risk level categorization
- Multi-factor scoring system considering payment history, engagement, contract status, and support satisfaction
- Weighted calculation approach: Payment (40%), Engagement (30%), Contract (20%), Support (10%)
- Risk level classification: Healthy (71-100), Warning (31-70), Critical (0-30)

### Pure Function Implementation
- Modular calculator functions in lib/healthCalculator.ts
- Individual scoring functions for each factor (payment, engagement, contract, support)
- Main calculateHealthScore function that combines all factors
- Input validation and error handling for all data inputs
- TypeScript interfaces for all data structures and return types

### Data Input Requirements
- Payment history: days since last payment, average payment delay, overdue amounts
- Engagement metrics: login frequency, feature usage count, support tickets
- Contract information: days until renewal, contract value, recent upgrades
- Support data: average resolution time, satisfaction scores, escalation counts

### UI Component Integration
- CustomerHealthDisplay widget following established component patterns
- Overall health score display with color-coded visualization
- Expandable breakdown showing individual factor scores
- Loading and error states consistent with other dashboard widgets
- Integration with CustomerSelector for real-time updates

## AI Collaboration Requirements
- Collaborative requirements exploration phase before implementation
- AI-assisted algorithm design with explanation of mathematical choices
- Request detailed reasoning for weighting schemes and calculation approaches
- AI explanation of trade-offs and potential failure points
- Iterative refinement through AI feedback and business logic validation

## Algorithm Design Specifications
- Pure functions with no side effects for predictable testing
- Comprehensive input validation with descriptive error messages
- Normalization strategies for different data types and ranges
- Edge case handling for new customers and missing data
- Trend analysis consideration for improving vs declining customers

## Testing Requirements
- Comprehensive unit test coverage for all calculation functions
- Edge case testing for boundary conditions and data validation
- Realistic customer data scenario testing
- Mathematical accuracy verification tests
- Error handling and input validation testing

## Technical Constraints
- TypeScript with strict typing for all interfaces and functions
- Pure function architecture for easy testing and predictability
- Detailed JSDoc comments explaining business logic and mathematical formulas
- Error classes extending base Error for proper exception handling
- Integration with existing dashboard component patterns

## Performance Requirements
- Efficient calculation algorithms suitable for real-time dashboard updates
- Caching considerations for repeated calculations
- Minimal computational overhead for dashboard responsiveness
- Optimized data structures for health score breakdown display

## Business Logic Validation
- Explainable algorithm decisions for stakeholder communication
- Clear mathematical rationale for weighting and scoring approaches
- Business assumption documentation and validation requirements
- Monitoring and calibration recommendations for production deployment
- A/B testing considerations for algorithm refinement

## Integration Requirements
- Seamless integration with existing CustomerSelector component
- Consistent error handling and loading state patterns
- Real-time score updates when customer selection changes
- Dashboard layout integration maintaining responsive design
- Color coding consistency with other dashboard health indicators

## UI Components (shadcn/ui)
- `Card` (`src/components/ui/card.tsx`) — CustomerHealthDisplay container matching other widgets
- `Progress` (`src/components/ui/progress.tsx`) — 0–100 overall score with color-coded fill
- `Badge` (`src/components/ui/badge.tsx`) — risk-level label (Healthy / Warning / Critical), shared color mapping
- `Accordion` (`src/components/ui/accordion.tsx`) or `Collapsible` — expandable per-factor breakdown (payment/engagement/contract/support)
- `Chart` (`src/components/ui/chart.tsx`, Recharts) — factor-weight breakdown using theme `chart-1..5` tokens
- `Tooltip` (`src/components/ui/tooltip.tsx`) — explain each factor's weight (40/30/20/10)
- `Skeleton` — loading state; `Alert` — error state
- Reuse the shared `healthColor(score)` mapping so colors match CustomerCard and market intelligence