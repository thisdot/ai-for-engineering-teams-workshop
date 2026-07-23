# CustomerCard Requirements

## Business Context
- Individual customer display component for Customer Intelligence Dashboard
- Used within CustomerSelector container component
- Provides at-a-glance customer information for quick identification
- Foundation for domain health monitoring integration

## Functional Requirements
- Display customer name, company name, and health score
- Show customer domains (websites) for health monitoring context
- Use color-coded health indicator:
  - Red (0-30): Poor health score
  - Yellow (31-70): Moderate health score  
  - Green (71-100): Good health score
- Display domain count when customer has multiple domains
- Basic responsive design for mobile and desktop
- Clean, card-based visual design with domain information

## Data Requirements
- Uses mock data from `src/data/mock-customers.ts`
- Customer interface includes optional `domains` array of website URLs
- Supports customers with 1 or multiple domains for health checking

## UI Primitives
- Build on the shared `Card` primitive from `src/components/ui/card.tsx`
- Compose the card using its subcomponents: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, and `CardFooter`
- Do not hand-roll the card container styling; rely on the primitive for consistent spacing, radius, and theming