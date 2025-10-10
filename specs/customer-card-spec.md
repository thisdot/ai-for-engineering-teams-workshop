# Spec: CustomerCard Component

## Feature: CustomerCard

### Context
- Individual customer display component for the Customer Intelligence Dashboard
- Used within the CustomerSelector container component to show multiple customers
- Provides at-a-glance customer information for quick identification and selection
- Foundation component that will integrate with domain health monitoring features in future exercises
- Consumed by business users monitoring customer account health and technical teams tracking domain status

### Requirements

#### Functional Requirements
- Display customer name, company name, and health score in a card format
- Show customer domains (websites) with clear visual presentation
- Implement color-coded health indicator system:
  - Red (0-30): Poor health score indicating critical issues
  - Yellow (31-70): Moderate health score requiring attention
  - Green (71-100): Good health score showing healthy account
- Display domain count badge when customer has multiple domains (e.g., "3 domains")
- Show single domain inline when customer has only one domain
- Support responsive layout for mobile (stacked) and desktop (card grid) views

#### User Interface Requirements
- Card-based design with rounded corners and subtle shadow
- Clear visual hierarchy: customer name most prominent, then company, then domains
- Health score displayed as a colored badge in top-right corner
- Domain information section with icon or label
- Sufficient padding and spacing for readability
- Hover state to indicate interactivity (preparation for future selection feature)

#### Data Requirements
- Uses mock data from `src/data/mock-customers.ts`
- Consumes Customer interface with fields:
  - `id: string` - unique identifier
  - `name: string` - customer full name
  - `company: string` - company name
  - `healthScore: number` - integer between 0-100
  - `domains?: string[]` - optional array of website URLs
- Must handle customers with no domains, one domain, or multiple domains gracefully

#### Integration Requirements
- Component will be imported into CustomerSelector container (future exercise)
- Must export as default for dynamic imports in main dashboard page
- Should be a client component (`'use client'`) for future interactivity
- Uses Tailwind CSS classes from global stylesheet

### Constraints

#### Technical Stack
- **Framework**: Next.js 15 with React 19
- **Language**: TypeScript with strict mode enabled
- **Styling**: Tailwind CSS 4.x utility classes only (no custom CSS)
- **Component Type**: Client component with `'use client'` directive

#### File Structure
- **File Location**: `src/components/CustomerCard.tsx`
- **Naming Convention**: PascalCase for component and file name
- **Import Path Example**: `import CustomerCard from '@/components/CustomerCard'`

#### TypeScript Definitions
```typescript
// Props interface
interface CustomerCardProps {
  customer: Customer;
}

// Customer interface (imported from mock-customers.ts)
interface Customer {
  id: string;
  name: string;
  company: string;
  healthScore: number;
  domains?: string[];
  // Note: email, subscriptionTier, timestamps exist but not used in v1
}
```

#### Design Constraints
- **Responsive Breakpoints**:
  - Mobile (default): Full width cards, stacked layout
  - Tablet (`md:`): 2-column grid
  - Desktop (`lg:`): 3-column grid
- **Component Dimensions**:
  - Min height: Not specified, let content determine
  - Padding: `p-4` or `p-6` for internal spacing
  - Border radius: `rounded-lg`
  - Shadow: `shadow` or `shadow-md`
- **Color System** (Tailwind classes):
  - Red zone (0-30): `bg-red-100 text-red-600 border-red-300`
  - Yellow zone (31-70): `bg-yellow-100 text-yellow-600 border-yellow-300`
  - Green zone (71-100): `bg-green-100 text-green-600 border-green-300`

#### Performance Requirements
- Component must render in under 16ms for smooth 60fps
- No external API calls (uses local mock data)
- Minimal re-renders (use React.memo if used in large lists)

#### Security Considerations
- No user input in v1, so XSS not a concern
- Domain URLs displayed as text only (not clickable links in v1)
- Health score must be validated as number type (TypeScript enforcement)

### Acceptance Criteria

#### Core Functionality
- [x] Component renders customer name prominently
- [x] Component displays company name with visual distinction from customer name
- [x] Health score appears as colored badge matching score range
- [x] Color coding is correct: red (0-30), yellow (31-70), green (71-100)
- [x] Domain count badge displays when customer has 2+ domains
- [x] Single domain displays inline when customer has exactly 1 domain
- [x] No domain section shown when domains array is empty or undefined

#### Edge Cases
- [x] Handles customer with `healthScore: 0` (shows red)
- [x] Handles customer with `healthScore: 100` (shows green)
- [x] Handles customer with no domains property (undefined)
- [x] Handles customer with empty domains array `[]`
- [x] Handles very long customer names (text truncation with ellipsis)
- [x] Handles very long company names (text truncation with ellipsis)

#### User Experience
- [x] Card has clear visual boundaries (border or shadow)
- [x] Text is readable with sufficient contrast ratios
- [x] Component is responsive across mobile, tablet, desktop
- [x] Health score badge positioned consistently (top-right)
- [x] Spacing between elements is consistent and visually balanced

#### Integration
- [x] TypeScript compilation passes with no errors
- [x] Component exports correctly for import in other files
- [x] Component accepts Customer type from mock-customers.ts
- [x] Component uses only Tailwind classes from configured theme
- [x] Component marked as client component with `'use client'` directive

#### Code Quality
- [x] Props interface properly typed with CustomerCardProps
- [x] No `any` types used
- [x] Helper function or logic for health score color mapping
- [x] Consistent code formatting (Prettier/ESLint compliant)
