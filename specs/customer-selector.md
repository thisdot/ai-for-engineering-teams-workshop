# Spec: CustomerSelector Component

## Feature: CustomerSelector

### Context
The CustomerSelector component serves as the main customer selection interface for the Customer Intelligence Dashboard. It enables users to browse, search, and select customers from a list of 100+ customers efficiently. This component acts as a central navigation element that controls which customer's details are displayed in other dashboard sections.

**Purpose and Role**:
- Primary interface for customer discovery and selection
- Acts as a filter/search mechanism for large customer datasets
- Provides visual feedback for the currently selected customer
- Integrates with the dashboard's state management to communicate customer selection

**System Integration**:
- Consumes mock customer data from `src/data/mock-customers.ts`
- Communicates selected customer state to parent dashboard component
- Works alongside other dashboard components that display detailed customer information

**User Interaction**:
- Users access this component when they first load the dashboard
- Users interact with it whenever they need to switch between different customers
- Primary users are customer success managers and account executives monitoring customer health

### Requirements

**Functional Requirements**:
- Display a list of all customers as individual CustomerCard components
- Implement real-time search/filter functionality by customer name or company name
- Provide visual indication of the currently selected customer (highlight state)
- Maintain selected customer state and persist across user interactions within the session
- Handle click events to select a customer
- Display "No customers found" state when search yields no results
- Support clearing the search filter

**User Interface Requirements**:
- Search input field positioned prominently at the top of the component
- Scrollable customer list container to handle 100+ customers
- Each customer displays via CustomerCard component showing:
  - Customer name
  - Company name
  - Health score with color coding (red: 0-30, yellow: 31-70, green: 71-100)
- Selected customer card has distinct visual treatment (border or background highlight)
- Responsive design that adapts to tablet and desktop breakpoints
- Loading/empty states handled gracefully

**Data Requirements**:
- Import Customer interface and mockCustomers array from `src/data/mock-customers.ts`
- Customer interface includes:
  ```typescript
  interface Customer {
    id: string;
    name: string;
    company: string;
    healthScore: number;
    email?: string;
    subscriptionTier?: string;
    domains?: string[];
    // timestamp fields if present
  }
  ```
- Filter logic operates on `name` and `company` fields (case-insensitive)
- Selected customer tracked by customer `id`

**Integration Requirements**:
- Accept callback prop to notify parent component of customer selection changes
- Optionally accept initial selected customer ID prop
- Use CustomerCard component for individual customer rendering
- Maintain compatibility with Next.js 15 App Router client components

### Constraints

**Technical Stack**:
- Next.js 15+ with App Router
- React 19 with client component directive (`'use client'`)
- TypeScript with strict mode
- Tailwind CSS 4.x for all styling (no custom CSS)

**File Structure**:
- Component location: `src/components/CustomerSelector.tsx`
- Depends on: `src/components/CustomerCard.tsx` (must exist)
- Imports from: `src/data/mock-customers.ts`

**TypeScript Definitions**:
```typescript
interface CustomerSelectorProps {
  onCustomerSelect: (customerId: string) => void;
  selectedCustomerId?: string;
}
```

**Performance Requirements**:
- Search filter must respond instantly (no debouncing needed for mock data)
- List rendering must handle 100+ items without lag
- Consider virtual scrolling if performance degrades (optional optimization)
- Initial render time < 500ms

**Design Constraints**:
- Maximum component height: 600px with internal scrolling
- Minimum card width: 280px
- Responsive breakpoints:
  - Mobile: Single column, full width
  - Tablet (`md:`): Single column, constrained width
  - Desktop (`lg:`): Consider grid layout if horizontal space allows
- Search input must be sticky/fixed at top of component
- Selected card highlight: 2px border with primary color or subtle background color

**Component Props Interface**:
```typescript
interface CustomerSelectorProps {
  onCustomerSelect: (customerId: string) => void;
  selectedCustomerId?: string;
}
```

**Styling Conventions**:
- Use Tailwind utility classes exclusively
- Health score colors:
  - 0-30: `text-red-600`, `bg-red-100`
  - 31-70: `text-yellow-600`, `bg-yellow-100`
  - 71-100: `text-green-600`, `bg-green-100`
- Card pattern: `rounded-lg shadow`
- Selected state: `ring-2 ring-blue-500` or `bg-blue-50`

**State Management**:
- Use React useState for search query
- Use React useState for filtered customers list
- Selected customer ID managed by parent component via props

**Security Considerations**:
- Sanitize search input to prevent XSS (though mock data is safe)
- No sensitive customer data displayed without proper authorization context
- Client-side filtering only (acceptable for workshop/mock data)

### Acceptance Criteria

- [ ] Component renders list of all customers from mockCustomers on initial load
- [ ] Search input filters customers by name (case-insensitive, partial match)
- [ ] Search input filters customers by company (case-insensitive, partial match)
- [ ] Clicking a CustomerCard triggers onCustomerSelect callback with customer ID
- [ ] Selected customer card displays visual highlight (ring or background)
- [ ] Selected state persists when typing in search (if selected customer matches filter)
- [ ] "No customers found" message displays when search returns zero results
- [ ] Search can be cleared (input cleared returns full customer list)
- [ ] Component is fully typed with TypeScript (no `any` types)
- [ ] Component uses 'use client' directive for client-side interactivity
- [ ] Responsive design works on mobile, tablet, and desktop breakpoints
- [ ] Customer list is scrollable when content exceeds max height
- [ ] Search input remains visible/accessible when scrolling customer list
- [ ] Health scores display with correct color coding on CustomerCard
- [ ] Component handles empty mockCustomers array gracefully
- [ ] Component handles undefined/null selectedCustomerId prop gracefully
- [ ] No console errors or warnings in browser
- [ ] TypeScript compilation passes without errors
- [ ] Component integrates successfully into dashboard page (src/app/page.tsx)

### Implementation Notes

**Imports Required**:
```typescript
'use client';

import { useState, useMemo } from 'react';
import { Customer, mockCustomers } from '@/data/mock-customers';
import CustomerCard from './CustomerCard';
```

**Search Filter Logic**:
- Use `useMemo` to derive filtered customers list from search query
- Filter function:
  ```typescript
  customers.filter(customer =>
    customer.name.toLowerCase().includes(query.toLowerCase()) ||
    customer.company.toLowerCase().includes(query.toLowerCase())
  )
  ```

**Component Structure**:
1. Search input container (sticky)
2. Customer list container (scrollable)
3. Conditional rendering for empty states

**Testing Checklist**:
- Test with empty search query (should show all customers)
- Test with search query matching multiple customers
- Test with search query matching single customer
- Test with search query matching no customers
- Test customer selection with and without active search filter
- Test responsive behavior at sm, md, lg breakpoints
- Test with very long customer/company names
- Test keyboard navigation (accessibility consideration)
