---
background: /bg-blue-bottom-right.jpeg
---

# Exercise 04: Implementing from Specs


Bridge the gap between specification and implementation by using your CustomerCard spec to generate production-ready component code for the Customer Intelligence Dashboard.

## Success Criteria

- [ ] Generate CustomerCard component from your spec
- [ ] Verify output matches specification acceptance criteria
- [ ] Test component renders correctly with mock data
- [ ] Component ready for dashboard integration

---
background: /bg-blue-bottom-right.jpeg
---

## Your Task

### Part 1: Generate Component

**Ask Claude Code to implement from your specification:**
```
Implement the CustomerCard component based on @specs/customer-card-spec.md

Use @requirements/customer-card.md for context and create the component at components/CustomerCard.tsx
```

**Review the generated code against your spec's acceptance criteria:**
- Does it display customer name, company, and health score?
- Are health score colors correct (red/yellow/green)?
- Does it show customer domains with proper count?
- Is the component properly typed with TypeScript?
- Does it use Tailwind CSS as specified?

---
background: /bg-blue-bottom-right.jpeg
---

### Part 2: Iterative Refinement

**If the component doesn't fully match your spec:**
```
The component is missing [specific requirement from spec]. Please update it to match the acceptance criteria in @specs/customer-card-spec.md
```

**Common refinements:**
- Adjust health score color thresholds
- Fix TypeScript interface definitions
- Improve responsive design
- Add missing customer domain display

---
background: /bg-blue-bottom-right.jpeg
---

### Part 3: Testing and Validation

**Step 1: Create Test Usage**

Ask Claude to show component usage:
```
Show me how to use the CustomerCard component with mock data from @data/mock-customers.ts
```

**Step 2: Verify Against Spec**

Cross-reference the implementation with your spec:
- [ ] All requirements implemented?
- [ ] Constraints followed (Next.js 15, React 19, TypeScript, Tailwind)?
- [ ] Acceptance criteria met?

---
background: /bg-blue-bottom-right.jpeg
---

## Expected Outcomes

- Working CustomerCard component matching your specification
- Understanding of spec-to-code workflow with AI assistance
- Experience with iterative refinement based on spec requirements
- Component ready for Customer Intelligence Dashboard integration

## Key Patterns Learned

- **Spec Referencing** - Using `@specs/` to provide implementation context
- **Acceptance-Driven Development** - Verifying output against spec criteria
- **Iterative Refinement** - Improving implementation through targeted prompts
- **Spec as Contract** - Treating specification as source of truth for implementation
