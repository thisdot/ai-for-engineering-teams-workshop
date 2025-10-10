# Spec: CustomerCard Component

## Feature: CustomerCard

### Context
- Purpose: Display individual customer information in a compact, visually appealing card format for the Customer Intelligence Dashboard
- System integration: Used as a child component within the CustomerSelector container to show a list of customers with their health status and domain information
- Users: Customer Success Managers and Support teams who need to quickly assess customer health and identify customers for follow-up actions
- Usage: Primary component for customer browsing and selection in the main dashboard interface, providing at-a-glance visibility into customer status

### Requirements

#### Functional Requirements
- Display three core customer attributes:
  - Customer name (from `Customer.name`)
  - Company name (from `Customer.company`)
  - Health score (from `Customer.healthScore` as a number 0-100)
- Render domain information when available:
  - Show single domain when customer has one domain
  - Show primary domain plus count indicator for multiple domains (e.g., "acmecorp.com +1 more")
  - Handle customers with no domains gracefully (don't display domain section)
- Implement color-coded health score visualization:
  - Red styling for scores 0-30 (critical health)
  - Yellow styling for scores 31-70 (moderate health)
  - Green styling for scores 71-100 (good health)
- Support click interactions for future selection functionality (component should be interactive)

#### User Interface Requirements
- Card-based layout with clear visual hierarchy
- Health score displayed as a badge or pill with colored background
- Domain information shown in a secondary text style
- Responsive design that works on mobile (320px+), tablet (768px+), and desktop (1024px+)
- Consistent spacing and padding following Tailwind's spacing scale
- Clear visual separation between cards when displayed in a list
- Hover states to indicate interactivity

#### Data Requirements
- Consume data from `src/data/mock-customers.ts`
- Use the `Customer` interface as the TypeScript type definition
- Required fields: `id`, `name`, `company`, `healthScore`
- Optional fields: `domains` (string array)
- Handle undefined/null domains array gracefully

#### Integration Requirements
- Designed to be used within CustomerSelector component
- Accept Customer object as a prop
- No external API calls (uses static mock data)
- Support future onClick handler prop for customer selection
- Compatible with Next.js 15 App Router and React 19

### Constraints

#### Technical Stack
- **Framework**: Next.js 15 with App Router
- **React Version**: React 19
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS 4.x utility classes only (no custom CSS)
- **Component Type**: Client component (requires `'use client'` directive)

#### File Structure
- **Component location**: `src/components/CustomerCard.tsx`
- **Import path for data**: `import { Customer } from '@/data/mock-customers'`

#### TypeScript Interface
```typescript
interface CustomerCardProps {
  customer: Customer;
  onClick?: (customerId: string) => void;
}
```

#### Performance Requirements
- Component should render in < 16ms for smooth 60fps scrolling
- No expensive calculations in render function
- Use appropriate React patterns (no unnecessary re-renders)

#### Design Constraints
- **Responsive breakpoints**:
  - Mobile: 320px - 767px (full width, stacked layout)
  - Tablet: 768px - 1023px (2-column grid when in list)
  - Desktop: 1024px+ (3-column grid when in list)
- **Card dimensions**:
  - Minimum height: 120px
  - Padding: 1rem (p-4)
  - Border radius: 0.5rem (rounded-lg)
  - Shadow: Tailwind's shadow class for elevation

#### Styling Constraints (Tailwind Classes)
- **Health Score Colors**:
  - Critical (0-30): `text-red-600`, `bg-red-100`
  - Moderate (31-70): `text-yellow-600`, `bg-yellow-100`
  - Good (71-100): `text-green-600`, `bg-green-100`
- **Card base**: `bg-white`, `rounded-lg`, `shadow`, `border border-gray-200`
- **Typography**:
  - Customer name: `text-lg font-semibold text-gray-900`
  - Company name: `text-sm text-gray-600`
  - Domain info: `text-xs text-gray-500`
- **Interactive states**: `hover:shadow-lg`, `cursor-pointer`, `transition-shadow`

#### Props Interface
```typescript
import { Customer } from '@/data/mock-customers';

interface CustomerCardProps {
  customer: Customer;
  onClick?: (customerId: string) => void;
}

export default function CustomerCard({ customer, onClick }: CustomerCardProps) {
  // Component implementation
}
```

#### Security Considerations
- No user-generated content rendered (using mock data only)
- No XSS vulnerabilities (React escapes by default)
- No sensitive data exposure (appropriate for workshop context)

### Acceptance Criteria

#### Core Functionality
- [ ] Component renders customer name, company, and health score correctly
- [ ] Health score displays with appropriate color coding (red/yellow/green)
- [ ] Health score ranges work correctly:
  - [ ] Score of 15 shows red styling
  - [ ] Score of 45 shows yellow styling
  - [ ] Score of 85 shows green styling
- [ ] Domain information displays when customer has domains array
- [ ] Single domain shows full domain name
- [ ] Multiple domains show first domain plus count (e.g., "+2 more")
- [ ] Missing domains don't cause errors or display empty section

#### Edge Cases
- [ ] Handles customers with no domains gracefully
- [ ] Handles customers with 1 domain (no count shown)
- [ ] Handles customers with 2+ domains (shows count)
- [ ] Health score of exactly 30 displays as red
- [ ] Health score of exactly 31 displays as yellow
- [ ] Health score of exactly 70 displays as yellow
- [ ] Health score of exactly 71 displays as green
- [ ] Component doesn't break with minimal Customer data (only required fields)

#### User Experience
- [ ] Card has clear visual hierarchy (name most prominent)
- [ ] Hover state provides visual feedback
- [ ] Component is responsive on mobile devices (320px width)
- [ ] Component is responsive on tablet devices (768px width)
- [ ] Component is responsive on desktop devices (1024px+ width)
- [ ] Text is readable with sufficient color contrast
- [ ] Spacing and padding feel balanced

#### Integration & Technical
- [ ] Component imports Customer type from mock-customers.ts
- [ ] Component uses 'use client' directive
- [ ] TypeScript compiles without errors (`npm run type-check`)
- [ ] Component accepts optional onClick handler
- [ ] onClick handler receives customer ID when provided
- [ ] No ESLint errors (`npm run lint`)
- [ ] Component renders successfully in Next.js app
- [ ] No console errors or warnings in browser
