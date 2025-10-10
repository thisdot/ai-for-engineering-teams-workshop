# HealthIndicator Requirements

## Business Context
- Visual health score indicator component for Customer Intelligence Dashboard
- Reusable component for displaying numeric health scores (0-100)
- Used within CustomerCard and other components requiring health status visualization
- Provides instant visual feedback on customer health through color coding
- Foundation for consistent health status display across the dashboard

## Functional Requirements
- Display health score as a numeric value (0-100)
- Apply color-coded visual styling based on health score ranges:
  - Red (0-30): Critical/Poor health - requires immediate attention
  - Yellow (31-70): Warning/Moderate health - needs monitoring
  - Green (71-100): Healthy/Good - performing well
- Support multiple display variants:
  - Badge style: Compact pill/badge with score
  - Dot style: Small colored dot indicator
  - Full style: Score with label text
- Show health score number clearly and legibly
- Optional label text (e.g., "Health Score", "Status")
- Responsive sizing for different container contexts

## User Interface Requirements
- Clean, minimal design that doesn't distract from content
- Clear visual hierarchy with health score as focal point
- Color coding must be accessible (sufficient contrast ratios)
- Multiple size variants: small, medium, large
- Rounded corners for modern appearance (badge/pill shape)
- Optional icon support (checkmark, warning, alert symbols)
- Consistent padding and spacing
- Text should be centered within the indicator

## Data Requirements
- Accept health score as a number (0-100) via props
- No direct data dependencies (pure presentation component)
- Health score is required prop
- Optional label/text props
- Optional size variant prop
- Type-safe props with TypeScript interface

## Design Requirements
- Use Tailwind CSS utility classes exclusively
- Support for dark mode (future consideration)
- Accessible color combinations (WCAG AA compliance)
- Smooth transitions between states if interactive
- Must work within various container sizes (CustomerCard, tables, lists)

## Integration Requirements
- Pure presentational component (no business logic)
- Can be imported and used in any component
- Works with Next.js 15 App Router
- Client component for potential future interactivity
- Exports as default for standard imports
- No external API calls or data fetching
