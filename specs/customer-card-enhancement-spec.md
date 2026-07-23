# Feature: CustomerCard Selection Enhancement

## Context
- Enhance the existing `CustomerCard` component to support selection
- Users click a customer card to select/deselect it; only one card is selected at a time
- Provides visual feedback for the selected state
- Built incrementally on the working `CustomerCard` without regressing existing behavior

## Requirements

### Functional Requirements
- Make `CustomerCard` clickable to select/deselect a customer
- Show a clear visual indication when a customer is selected (border highlight / background change)
- Support single selection at a time (selecting one deselects the previous)
- Preserve all existing CustomerCard functionality (health score colors, domains, styling)
- Emit selection events to the parent component

### User Interface Requirements
- Selected state uses theme tokens: `ring`/`ring-primary`, `border-primary`, or `bg-accent`
- Visible hover state to indicate the card is clickable
- Selected state is distinguishable in both light and dark mode
- Accessible: keyboard focusable and operable (Enter/Space), correct pressed/selected semantics

### Data / Props Requirements
- Extend `CustomerCardProps` with:
  - `selected?: boolean`
  - `onSelect?: (customer: Customer) => void`
- Selection state is owned by the parent (controlled component); the card is presentational

### Integration Requirements
- Parent (`CustomerSelector`) tracks the currently selected customer id and passes `selected` down
- No internal data fetching; events bubble up via `onSelect`

### UI Components (shadcn/ui)
- **Card** — reuse the existing base; apply selected styling via `data-[selected]`/conditional `ring`/`border` classes rather than a new component
- **Toggle** (`@/components/ui/toggle`) — optional pattern if a dedicated pressable affordance is preferred over a clickable card
- Use `aria-pressed` / `role` semantics and lucide **Check** icon to mark the selected card
- Keep the red/yellow/green health `Badge` from the base CustomerCard intact

## Incremental Development Approach
- **Loop 1**: Add click handling and `onSelect` wiring without breaking existing rendering
- **Loop 2**: Add the visual selected state (ring/background) with hover + focus feedback
- Preserve all current CustomerCard features throughout

## Constraints

### Technical Stack
- Next.js 15 (App Router), React 19, TypeScript strict mode
- Tailwind CSS v4 with shadcn/ui theme tokens

### File Structure and Naming
- Modify `src/components/CustomerCard.tsx`; keep `CustomerCardProps` exported
- Reuse shadcn primitives from `src/components/ui/`

### Security Considerations
- No new user-rendered strings introduced; maintain text-only rendering

## Acceptance Criteria

- [ ] Clicking a card selects it and invokes `onSelect` with the customer
- [ ] Clicking the selected card (or another card) updates selection to single-select behavior
- [ ] Selected card is visually distinct via theme tokens in light and dark mode
- [ ] Hover and keyboard focus states are visible; card is keyboard operable
- [ ] All existing CustomerCard features (health colors, domains) still work
- [ ] `selected` and `onSelect` added to `CustomerCardProps` and exported
- [ ] No console errors or warnings; passes TypeScript strict mode checks
