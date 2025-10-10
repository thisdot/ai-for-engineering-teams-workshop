# Spec: Button Component

## Feature: Button Component

### Context
- Reusable button component for the Customer Intelligence Dashboard
- Used throughout the dashboard for primary actions (submit forms, trigger actions, navigate)
- Part of the design system that ensures consistency across all dashboard features
- Foundation component that other features will depend on

### Requirements

#### Functional Requirements
- Accept customizable text label via props
- Handle click events through onClick callback prop
- Support multiple visual variants for different action types
- Display loading state with visual feedback (spinner/indicator)
- Be disabled when in loading state to prevent multiple submissions
- Support disabled state independent of loading state

#### User Interface Requirements
- Three visual variants:
  - **Primary**: Main call-to-action buttons (blue background)
  - **Secondary**: Alternative actions (gray/outlined)
  - **Danger**: Destructive actions (red background)
- Loading state shows spinner icon with dimmed appearance
- Disabled state uses reduced opacity and no hover effects
- Smooth hover and focus transitions
- Full width option for mobile-responsive layouts

#### Data Requirements
- Props interface with TypeScript definitions
- Label text (string, required)
- onClick handler (function, required)
- Variant type (string literal union, optional, defaults to 'primary')
- Loading state (boolean, optional, defaults to false)
- Disabled state (boolean, optional, defaults to false)
- Full width flag (boolean, optional, defaults to false)

#### Integration Requirements
- Export component as default export from `src/components/Button.tsx`
- Export TypeScript `ButtonProps` interface for type safety
- Compatible with React 19 event handling
- Works within Next.js 15 App Router (client component)

### Constraints

#### Technical Stack
- React 19 with TypeScript (strict mode)
- Next.js 15 App Router
- Tailwind CSS 4.x for all styling (no custom CSS)
- Must use `'use client'` directive (client component)

#### Performance Requirements
- No external dependencies for icons (use Unicode or Tailwind-compatible approach)
- Minimal re-renders (memoize if used in lists)
- Fast paint time (< 16ms for 60fps interactions)

#### Design Constraints
- Maximum width: 200px (unless fullWidth prop is true)
- Minimum height: 40px for accessibility (touch target size)
- Padding: 12px horizontal, 8px vertical
- Border radius: 6px (rounded-md)
- Font size: 14px (text-sm)
- Font weight: 500 (medium)
- Responsive: Full width on mobile (< 640px) when fullWidth is true

#### File Structure and Naming
- File path: `src/components/Button.tsx`
- Component name: `Button`
- Props interface name: `ButtonProps`
- Use PascalCase for component, camelCase for props

#### Props Interface Definition
```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}
```

#### Security Considerations
- Sanitize label text if it ever comes from user input (not needed for hardcoded labels)
- Prevent onClick execution when disabled or loading
- No inline event handlers (use React's synthetic events)

### Acceptance Criteria

- [ ] Button renders with provided label text
- [ ] onClick handler fires when button is clicked (not disabled/loading)
- [ ] All three variants (primary, secondary, danger) render with correct colors
- [ ] Loading state displays spinner and disables interaction
- [ ] Disabled state prevents clicks and shows disabled styling
- [ ] fullWidth prop makes button span full container width
- [ ] Button meets accessibility standards:
  - [ ] Proper ARIA attributes when disabled/loading
  - [ ] Minimum 40px height (touch target)
  - [ ] Visible focus indicator for keyboard navigation
  - [ ] Sufficient color contrast (WCAG AA)
- [ ] Hover effects work on all variants (except when disabled)
- [ ] TypeScript interface is properly exported
- [ ] Component integrates with existing dashboard without errors
- [ ] Responsive behavior works on mobile, tablet, and desktop breakpoints

## Implementation Notes

### Tailwind Classes by Variant
**Primary:**
- Background: `bg-blue-600 hover:bg-blue-700`
- Text: `text-white`
- Disabled: `disabled:bg-blue-300 disabled:cursor-not-allowed`

**Secondary:**
- Background: `bg-gray-200 hover:bg-gray-300`
- Text: `text-gray-800`
- Border: `border border-gray-300`
- Disabled: `disabled:bg-gray-100 disabled:cursor-not-allowed`

**Danger:**
- Background: `bg-red-600 hover:bg-red-700`
- Text: `text-white`
- Disabled: `disabled:bg-red-300 disabled:cursor-not-allowed`

### Loading Spinner
Use simple CSS animation with Tailwind:
```tsx
<span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></span>
```

### Usage Example
```tsx
import Button from '@/components/Button';

<Button
  label="Save Changes"
  onClick={() => handleSave()}
  variant="primary"
  loading={isSaving}
/>
```
