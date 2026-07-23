# Feature: CustomerCard Component

## Context
- Individual customer display component for the Customer Intelligence Dashboard
- Rendered within the `CustomerSelector` container, typically in a grid of multiple customers
- Provides at-a-glance customer information for quick identification by business analysts
- Foundation component for domain health monitoring integration

## Requirements

### Functional Requirements
- Display the customer's name, company name, and health score (0-100)
- Show the customer's domains (websites) to provide health-monitoring context
- Render a color-coded health indicator based on the health score
- Display a domain count when the customer has more than one domain
- Use a clean, card-based visual layout that includes domain information

### User Interface Requirements
- Color-coded health indicator:
  - Red: 0-30 (poor health)
  - Yellow: 31-70 (moderate health)
  - Green: 71-100 (good health)
- Basic responsive design that works on mobile and desktop
- Clear typography hierarchy (name > company > supporting details)

### Data Requirements
- Accepts a single `Customer` object via props
- Consumes the `Customer` interface and mock data from `src/data/mock-customers.ts`
- `Customer` fields used: `id`, `name`, `company`, `healthScore`, and optional `domains: string[]`
- Handles customers with a single domain, multiple domains, or no `domains` array present

### Integration Requirements
- Used within the `CustomerSelector` container component
- Data flows from parent to child via props (no internal data fetching)
- Exposes a properly typed `CustomerCardProps` interface

### UI Components (shadcn/ui)
- **Card** (`@/components/ui/card`) — the base container; compose with `CardHeader`, `CardTitle`, `CardContent`, `CardFooter` rather than hand-rolling card styling
- **Badge** (`@/components/ui/badge`) — render the health status ("Healthy / Warning / Critical") and, optionally, subscription tier; use it as the color-coded indicator instead of ad-hoc spans
- **Avatar** (`@/components/ui/avatar`) — show customer initials for quick visual identification in a grid
- **Tooltip** (`@/components/ui/tooltip`) — reveal the full domain list on hover when a customer has multiple domains
- **Separator** (`@/components/ui/separator`) — divide the header (name/company) from the domain/health section
- Icons from **lucide-react** for domain/health affordances
- Centralize the red/yellow/green mapping in a shared helper (e.g. `healthColor(score)`) so CustomerCard, the health widget, and market intelligence stay consistent

## Constraints

### Technical Stack
- Next.js 15 (App Router)
- React 19
- TypeScript with strict mode
- Tailwind CSS v4 with shadcn/ui (`radix-luma` style, lucide icons)

### Design Constraints
- Responsive breakpoints: mobile (320px+) and desktop (1024px+)
- Use theme tokens (`bg-card`, `text-card-foreground`, `text-muted-foreground`, `border`) — never hard-coded gray/blue hex or `bg-white`
- Consistent spacing using the Tailwind spacing scale

### File Structure and Naming
- Component file: `src/components/CustomerCard.tsx`
- Props interface: `CustomerCardProps`, exported from the component file
- Reuse shadcn primitives from `src/components/ui/`; do not fork them
- Follow project naming conventions (PascalCase for components)

### Security Considerations
- Render name, company, and domain strings as text only (no `dangerouslySetInnerHTML`) to prevent XSS
- No sensitive customer data written to client-side logs

## Acceptance Criteria

- [ ] Displays customer name, company name, and health score correctly
- [ ] Shows customer domains, with a domain count when there is more than one domain
- [ ] Gracefully handles a customer with no `domains` array
- [ ] Health score colors match the specification: red (0-30), yellow (31-70), green (71-100)
- [ ] Built on the shadcn `Card` primitive and uses `Badge` for the health indicator
- [ ] Responsive design works on mobile (320px+) and desktop (1024px+)
- [ ] Uses theme tokens throughout (dark mode works without changes)
- [ ] `CustomerCardProps` interface is defined and exported
- [ ] No console errors or warnings; passes TypeScript strict mode checks
