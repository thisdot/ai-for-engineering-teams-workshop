# Accessibility Requirements

## Business Context
- Ensure all workshop components meet WCAG 2.1 AA standards
- Support users with disabilities including screen readers, keyboard navigation, and reduced motion preferences
- Build inclusive user interfaces that work for everyone

## Functional Requirements
- All interactive elements must be keyboard accessible
- Proper semantic HTML structure with heading hierarchy
- ARIA labels and descriptions for complex UI components
- Color contrast ratios meeting AA standards (4.5:1 for normal text, 3:1 for large text)
- Focus indicators visible and clear for all interactive elements
- Alternative text for images and icons
- Screen reader friendly content structure

## UI Components (shadcn/ui)
- Prefer shadcn/ui primitives (`src/components/ui/`) as the accessibility foundation — they are built on Radix UI, which ships keyboard interaction, focus management, and ARIA roles by default:
  - `Dialog` — focus trap, `Esc` to close, `aria-modal`, restored focus on close
  - `DropdownMenu` / `Select` / `Command` — roving-tabindex keyboard navigation and correct `role`/`aria-*`
  - `Tabs` — arrow-key navigation with `aria-selected` / `aria-controls`
  - `Tooltip` — accessible descriptions with proper `aria-describedby`
  - `Label` + `Form` — programmatic label association and `aria-invalid` / error message wiring
- Use theme tokens so color contrast meets AA in both light and dark mode; verify `foreground`/`muted-foreground` on their backgrounds
- Respect reduced-motion (the project includes `tw-animate-css`; gate animations behind `motion-safe`)
- Provide `aria-label`/`sr-only` text for lucide icons used as the sole affordance
- Do not fork shadcn primitives in ways that strip their built-in ARIA/keyboard behavior