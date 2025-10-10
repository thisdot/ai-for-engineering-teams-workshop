# Spec: HealthIndicator Component

## Feature: HealthIndicator

### Context
- Purpose: Reusable visual indicator component that displays health scores (0-100) with color-coded styling for the Customer Intelligence Dashboard
- System integration: Used as a child component within CustomerCard, tables, lists, and any component requiring health status visualization
- Users: Customer Success Managers and Support teams who need instant visual feedback on customer health status
- Usage: Provides consistent health score display across the entire dashboard, ensuring uniform visual language for health metrics

### Requirements

#### Functional Requirements
- Display numeric health score value (0-100) prominently
- Apply color-coded styling based on score ranges:
  - Red zone (0-30): Critical health requiring immediate attention
  - Yellow zone (31-70): Moderate health needing monitoring
  - Green zone (71-100): Good health, performing well
- Support multiple display variants:
  - `badge`: Compact pill/badge style with score (default)
  - `dot`: Small colored dot indicator without number
  - `full`: Score with descriptive label text
- Display health score number clearly and legibly in all variants
- Support optional label text (e.g., "Health Score: 85")
- Support multiple size variants: `sm`, `md`, `lg`
- Handle edge case scores (0, 30, 31, 70, 71, 100) with correct color boundaries

#### User Interface Requirements
- Clean, minimal design that complements rather than distracts
- Badge variant: Pill-shaped with rounded corners, colored background, contrasting text
- Dot variant: Small circular indicator (8px for sm, 12px for md, 16px for lg)
- Full variant: Score number with label, colored text or background
- Text centered within the indicator
- Sufficient padding for readability
- Consistent with dashboard's visual design system
- Accessible color contrast ratios (WCAG AA compliance)
- Typography should be clear and readable at all sizes

#### Data Requirements
- Accepts health score as required prop: `score: number` (0-100)
- Accepts optional variant prop: `variant?: 'badge' | 'dot' | 'full'` (default: 'badge')
- Accepts optional size prop: `size?: 'sm' | 'md' | 'lg'` (default: 'md')
- Accepts optional label prop: `label?: string`
- Accepts optional className prop for additional styling: `className?: string`
- Pure presentational component with no data fetching
- Type-safe props using TypeScript interface

#### Integration Requirements
- Exported as default for standard imports
- Client component with `'use client'` directive
- Compatible with Next.js 15 App Router and React 19
- Can be nested within CustomerCard and other components
- No external dependencies beyond React and Tailwind CSS
- No state management or side effects
- No API calls or data fetching

### Constraints

#### Technical Stack
- **Framework**: Next.js 15 with App Router
- **React Version**: React 19
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS 4.x utility classes only (no custom CSS)
- **Component Type**: Client component (requires `'use client'` directive)

#### File Structure
- **Component location**: `src/components/HealthIndicator.tsx`
- **Naming convention**: PascalCase for component and file
- **Import path**: `import HealthIndicator from '@/components/HealthIndicator'`

#### TypeScript Interface
```typescript
type HealthIndicatorVariant = 'badge' | 'dot' | 'full'
type HealthIndicatorSize = 'sm' | 'md' | 'lg'

interface HealthIndicatorProps {
  score: number; // 0-100
  variant?: HealthIndicatorVariant; // default: 'badge'
  size?: HealthIndicatorSize; // default: 'md'
  label?: string; // optional label text
  className?: string; // additional CSS classes
}
```

#### Performance Requirements
- Component must render in < 5ms (very lightweight)
- No expensive calculations (simple conditional logic only)
- Pure component - same props always produce same output
- No re-renders unless props change
- Memoization not required (component is already very fast)

#### Design Constraints

**Size Specifications**:
- **Small (sm)**:
  - Badge: `text-xs px-2 py-0.5` (height: ~20px)
  - Dot: `w-2 h-2` (8px diameter)
  - Full: `text-xs`
- **Medium (md)** - default:
  - Badge: `text-sm px-2.5 py-1` (height: ~28px)
  - Dot: `w-3 h-3` (12px diameter)
  - Full: `text-sm`
- **Large (lg)**:
  - Badge: `text-base px-3 py-1.5` (height: ~36px)
  - Dot: `w-4 h-4` (16px diameter)
  - Full: `text-base`

**Badge Variant**:
- Border radius: `rounded-full` (pill shape)
- Font weight: `font-semibold` or `font-medium`
- Text alignment: `text-center`
- Display: `inline-flex items-center justify-center`

**Dot Variant**:
- Shape: `rounded-full` (perfect circle)
- Display: `inline-block`
- No text content

**Full Variant**:
- Layout: Score and label in flex container
- Gap between elements: `gap-1` or `gap-2`
- Font weight: Score is `font-bold`, label is `font-normal`

#### Styling Constraints (Tailwind Classes)

**Health Score Color Mappings**:

**Red Zone (0-30)**:
- Badge: `bg-red-100 text-red-700 border border-red-200`
- Dot: `bg-red-500`
- Full: `text-red-600`

**Yellow Zone (31-70)**:
- Badge: `bg-yellow-100 text-yellow-700 border border-yellow-200`
- Dot: `bg-yellow-500`
- Full: `text-yellow-600`

**Green Zone (71-100)**:
- Badge: `bg-green-100 text-green-700 border border-green-200`
- Dot: `bg-green-500`
- Full: `text-green-600`

**Helper Function Example**:
```typescript
function getHealthColorClasses(score: number, variant: HealthIndicatorVariant): string {
  if (score <= 30) {
    if (variant === 'badge') return 'bg-red-100 text-red-700 border-red-200'
    if (variant === 'dot') return 'bg-red-500'
    return 'text-red-600'
  }
  if (score <= 70) {
    if (variant === 'badge') return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    if (variant === 'dot') return 'bg-yellow-500'
    return 'text-yellow-600'
  }
  // score >= 71
  if (variant === 'badge') return 'bg-green-100 text-green-700 border-green-200'
  if (variant === 'dot') return 'bg-green-500'
  return 'text-green-600'
}
```

#### Props Interface
```typescript
'use client'

type HealthIndicatorVariant = 'badge' | 'dot' | 'full'
type HealthIndicatorSize = 'sm' | 'md' | 'lg'

interface HealthIndicatorProps {
  score: number;
  variant?: HealthIndicatorVariant;
  size?: HealthIndicatorSize;
  label?: string;
  className?: string;
}

export default function HealthIndicator({
  score,
  variant = 'badge',
  size = 'md',
  label,
  className = ''
}: HealthIndicatorProps) {
  // Component implementation
}
```

#### Security Considerations
- No user-generated content (score is numeric, label is optional string)
- React automatically escapes text content (XSS protection)
- Score should be validated as number type (TypeScript enforcement)
- Label text is safely rendered (no dangerouslySetInnerHTML)
- No security concerns for this pure presentational component

### Acceptance Criteria

#### Core Functionality
- [ ] Component accepts score prop (0-100) and displays it correctly
- [ ] Health score color coding works correctly:
  - [ ] Score 0 displays red
  - [ ] Score 30 displays red
  - [ ] Score 31 displays yellow
  - [ ] Score 70 displays yellow
  - [ ] Score 71 displays green
  - [ ] Score 100 displays green
- [ ] Badge variant displays score in pill-shaped container with colored background
- [ ] Dot variant displays colored circle without score number
- [ ] Full variant displays score with optional label text
- [ ] Default variant is 'badge' when not specified
- [ ] Default size is 'md' when not specified

#### Size Variants
- [ ] Small (sm) size renders at correct dimensions
- [ ] Medium (md) size renders at correct dimensions
- [ ] Large (lg) size renders at correct dimensions
- [ ] Badge variant scales correctly across all sizes
- [ ] Dot variant scales correctly across all sizes (8px, 12px, 16px)
- [ ] Full variant scales text correctly across all sizes

#### Edge Cases
- [ ] Score of 0 renders without errors
- [ ] Score of 100 renders without errors
- [ ] Boundary score of 30 shows red (not yellow)
- [ ] Boundary score of 31 shows yellow (not red)
- [ ] Boundary score of 70 shows yellow (not green)
- [ ] Boundary score of 71 shows green (not yellow)
- [ ] Component handles missing optional props (uses defaults)
- [ ] Component handles custom className prop (appends classes correctly)
- [ ] Label text displays correctly when provided
- [ ] Component works without label prop

#### User Experience
- [ ] Badge variant has clear visual boundaries (colored background + border)
- [ ] Text is readable with sufficient contrast in all color zones
- [ ] Dot variant is clearly visible at all sizes
- [ ] Full variant has proper spacing between score and label
- [ ] Component appears visually consistent across different contexts
- [ ] Colors are distinguishable for users (red/yellow/green clearly different)
- [ ] Typography is legible at all size variants
- [ ] Component doesn't break layout when placed in different containers

#### Integration & Technical
- [ ] Component imports correctly: `import HealthIndicator from '@/components/HealthIndicator'`
- [ ] Component uses `'use client'` directive
- [ ] TypeScript compiles without errors (`npm run type-check`)
- [ ] Props interface properly typed with HealthIndicatorProps
- [ ] Type definitions for variant and size are strict (no arbitrary strings)
- [ ] No `any` types used
- [ ] No ESLint errors (`npm run lint`)
- [ ] Component exports as default
- [ ] Component renders in Next.js app without console errors
- [ ] Helper function for color class selection works correctly

#### Code Quality
- [ ] Component is pure (no side effects)
- [ ] Props destructuring with defaults is clean
- [ ] Helper function for color classes is extracted (not inline)
- [ ] Size class mapping is clear and maintainable
- [ ] Variant logic is straightforward and readable
- [ ] No unused props or variables
- [ ] Comments explain color thresholds if not obvious
- [ ] Component can be easily extended with new variants/sizes in future
