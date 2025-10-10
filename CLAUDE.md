# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a workshop repository for teaching **spec-driven development with AI agents**. Students build a Customer Intelligence Dashboard progressively through 8 exercises, learning to create detailed specifications before implementing features.

**Core Philosophy**: Transform ideas into AI-ready specifications before implementation. All features should follow the spec-driven workflow: Requirements → Specification → Implementation.

## Development Commands

### Essential Commands
```bash
npm install          # Install dependencies
npm run dev          # Start development server on http://localhost:3000
npm run build        # Production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking without emitting files
```

### Development Workflow
- **Dev server**: Runs on port 3000 with hot reload
- **Type checking**: Always run `npm run type-check` before committing
- The app uses Next.js App Router (not Pages Router)

## Architecture & Code Structure

### Tech Stack
- **Next.js 15+** with App Router (React 19)
- **TypeScript** (strict mode enabled)
- **Tailwind CSS 4.x** for styling
- **Mock data** for workshop exercises (no real backend)

### Directory Structure

```
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── page.tsx      # Main dashboard page (client component)
│   │   ├── layout.tsx    # Root layout with fonts
│   │   └── globals.css   # Global Tailwind styles
│   ├── components/       # React components (created during exercises)
│   └── data/             # Mock data exports
│       ├── mock-customers.ts             # Customer interface & data
│       └── mock-market-intelligence.ts   # Market data for exercises
├── requirements/         # Feature requirements (input documents)
├── specs/               # Generated specifications (AI output)
├── templates/           # spec-template.md for consistent spec generation
└── exercises/           # Workshop exercise instructions (00-07)
```

### Key Patterns

**Data Layer**:
- All data is mock data from `src/data/`
- Customer interface defined in `mock-customers.ts` includes:
  - Basic fields: `id`, `name`, `company`, `healthScore`
  - Optional: `email`, `subscriptionTier`, `domains[]`, timestamps
- Export both the interface and data array: `export const mockCustomers: Customer[]`

**Component Architecture**:
- Components go in `src/components/` (created during exercises)
- Use TypeScript interfaces for all props
- Client components need `'use client'` directive
- Main page (`src/app/page.tsx`) dynamically imports workshop components with error handling

**Styling Conventions**:
- Use Tailwind CSS utility classes exclusively
- Health score color coding:
  - 0-30: Red (danger) - `text-red-600`, `bg-red-100`
  - 31-70: Yellow (warning) - `text-yellow-600`, `bg-yellow-100`
  - 71-100: Green (success) - `text-green-600`, `bg-green-100`
- Responsive breakpoints: `md:` (tablet), `lg:` (desktop)
- Card-based layouts with `rounded-lg shadow` pattern

## Spec-Driven Development Workflow

### The Process
1. **Start with requirements** in `/requirements/` directory
2. **Generate specification** using `/templates/spec-template.md` structure
3. **Save spec** to `/specs/` for reference
4. **Implement** from the detailed specification

### Spec Template Structure
All specifications must follow this template:

```markdown
## Feature: [Component/Feature Name]

### Context
- Purpose and role in the application
- How it fits into the larger system
- Who will use it and when

### Requirements
- Functional requirements (what it must do)
- User interface requirements
- Data requirements
- Integration requirements

### Constraints
- Technical stack (Next.js 15, React 19, TypeScript, Tailwind CSS)
- Performance requirements
- Design constraints (responsive breakpoints, component size limits)
- File structure and naming conventions
- Props interface and TypeScript definitions
- Security considerations

### Acceptance Criteria
- [ ] Testable success criteria
- [ ] Edge cases handled
- [ ] User experience validated
- [ ] Integration points verified
```

### When Writing Specs
- **Be explicit** about TypeScript interfaces
- **Specify** exact file paths (e.g., `src/components/CustomerCard.tsx`)
- **Define** props interfaces completely
- **Include** import statements needed
- **Document** integration with existing mock data
- **Reference** the spec template structure

### When Implementing from Specs
- Read the spec thoroughly before coding
- Follow the constraints exactly (TypeScript, Tailwind, file paths)
- Implement all acceptance criteria
- Use mock data from `src/data/`
- Test responsive behavior at different breakpoints

## Workshop Context

### Exercise Flow
Students progress through 8 exercises building the Customer Intelligence Dashboard:
1. **Exercise 00**: Effective prompting (comparing vague vs refined prompts)
2. **Exercise 01**: First spec (CustomerCard)
3. **Exercise 02**: Multiple component specs
4. **Exercise 03**: Complex multi-component features
5. **Exercise 04**: Implementation from specs
6. **Exercise 05**: Custom slash commands
7. **Exercise 06**: Subagent definitions
8. **Exercise 07**: Batch implementation patterns

### Current State
- Basic Next.js app is scaffolded
- Mock data exists in `src/data/`
- Main page shows progress tracker and component placeholders
- Components are built progressively during exercises

### Important Notes for AI Agents
- **Do not create components** unless explicitly working through an exercise
- **Use the spec template** for all feature specifications
- **Save generated specs** to `/specs/` directory
- **Reference requirements** from `/requirements/` as starting points
- Main page dynamically imports components, so missing components won't break the app
- Students refresh the page after completing exercises to see their progress
