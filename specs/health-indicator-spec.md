# Spec Template for Workshop

Copy this template for all workshop exercises:

## Feature: HealthIndicator Component

### Context
- Visual indicator component for displaying customer health scores
- Used within CustomerCard and dashboard widgets to provide at-a-glance health status
- Provides immediate visual feedback through color coding and iconography
- Essential for business users to quickly identify customers needing attention

### Requirements
- **Functional requirements:**
  - Display health score as color-coded indicator (red/yellow/green)
  - Support numerical score display (0-100)
  - Handle edge cases for missing or invalid health scores
- **User interface requirements:**
  - Clean, minimal design that doesn't overwhelm parent components
  - Consistent sizing and spacing within different contexts
  - Optional text label support
- **Data requirements:**
  - Accept health score as number (0-100 range)
  - Use established color ranges from mock data standards
- **Integration requirements:**
  - Reusable across CustomerCard, dashboard widgets, and future components
  - Props-based configuration for different display modes

### Constraints
- **Technical stack:** Next.js 15, React 19, TypeScript, Tailwind CSS
- **Performance requirements:** Lightweight rendering with no unnecessary re-renders
- **Design constraints:** 
  - Responsive sizing (16px, 24px, 32px variants)
  - Consistent with established color system
- **File structure:** Place in `src/components/ui/` following component organization
- **Props interface:** Strongly typed HealthIndicatorProps interface
- **Security considerations:** Validate health score inputs to prevent XSS
- **Accessibility requirements:**
  - ARIA labels for screen readers
  - Color contrast meeting WCAG 2.1 AA standards
  - Focus indicators for interactive variants

### Acceptance Criteria
- [ ] Displays correct color for health score ranges (0-30 red, 31-70 yellow, 71-100 green)
- [ ] Handles invalid/missing health scores gracefully
- [ ] Component is reusable with different size variants
- [ ] TypeScript props interface is properly defined
- [ ] Meets accessibility standards with ARIA labels
- [ ] Color contrast meets WCAG 2.1 AA requirements
- [ ] Integrates cleanly into parent components without layout issues
- [ ] Performance is optimal for rendering multiple indicators