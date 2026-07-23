# Feature: Accessibility (WCAG 2.1 AA)

## Context
- Cross-cutting requirement: all dashboard components meet WCAG 2.1 AA
- Supports screen readers, keyboard navigation, and reduced-motion preferences
- shadcn/ui (Radix-based) primitives are the accessibility foundation for the whole app

## Requirements

### Functional Requirements
- All interactive elements keyboard accessible (Tab/Shift+Tab, Enter/Space, arrow keys where applicable)
- Semantic HTML with correct heading hierarchy and landmarks
- ARIA labels/descriptions for complex components
- Color contrast: 4.5:1 normal text, 3:1 large text
- Visible, clear focus indicators on all interactive elements
- Alt text for images; accessible names for icon-only controls
- Screen-reader-friendly structure; live regions for dynamic updates (alerts, loading)

### UI Components (shadcn/ui)
- Prefer shadcn primitives (`@/components/ui/`) — Radix provides keyboard interaction, focus management, and ARIA by default:
  - **Dialog** — focus trap, `Esc` to close, `aria-modal`, focus restored on close
  - **DropdownMenu** / **Select** / **Command** — roving tabindex + correct `role`/`aria-*`
  - **Tabs** — arrow-key nav with `aria-selected`/`aria-controls`
  - **Tooltip** — `aria-describedby` wiring
  - **Label** + **Form** — programmatic label association, `aria-invalid`, error-message linking
- Use theme tokens so contrast meets AA in light and dark; verify `muted-foreground` pairings
- Gate animations behind `motion-safe` (project ships `tw-animate-css`) to honor reduced motion
- Provide `aria-label`/`sr-only` text for lucide icons used as the sole affordance
- Never fork primitives in ways that strip built-in ARIA/keyboard behavior

## Constraints
- Applies to every component and spec in this repo
- Tailwind CSS v4 theme tokens; shadcn/ui `radix-luma` style
- No regressions to Radix-provided semantics when wrapping primitives

## Testing Requirements
- Automated: axe-core in component/integration tests
- Manual: keyboard-only navigation across all components
- Screen readers: NVDA, JAWS, VoiceOver
- Contrast validation (light + dark, high-contrast mode)
- Mobile accessibility on representative devices

## Acceptance Criteria

- [ ] Every interactive element is fully keyboard operable with a visible focus indicator
- [ ] Headings/landmarks form a correct, navigable structure
- [ ] Complex widgets expose appropriate ARIA roles/labels/descriptions
- [ ] Text contrast meets AA in both light and dark mode
- [ ] Icon-only controls have accessible names
- [ ] Dynamic content (alerts, loading, toasts) uses live regions/announcements
- [ ] Animations respect `prefers-reduced-motion`
- [ ] axe-core passes with no serious/critical violations
