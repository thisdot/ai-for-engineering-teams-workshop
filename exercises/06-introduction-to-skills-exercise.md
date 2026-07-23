---
background: /bg-blue-bottom-right.jpeg
---

# Exercise 06: Create a Dashboard Components Skill

Package your Customer Intelligence Dashboard conventions as an Agent Skill, then use it to generate the CustomerCard component.

## Success Criteria

- [ ] Create a `dashboard-components` skill with a well-written description
- [ ] Confirm the skill triggers on component requests
- [ ] Generate the CustomerCard component with the skill's conventions applied

---
background: /bg-blue-bottom-right.jpeg
---

## Your Tasks

### Part 1: Create the Dashboard Components Skill

**Ask Claude to scaffold the skill:**
```
Create a skill at .claude/skills/dashboard-components/SKILL.md
that encodes our Customer Intelligence Dashboard conventions:

- React 19 + TypeScript components with Tailwind styling
- Next.js App Router patterns (Server Components by default,
  'use client' only when needed)
- Health score color rules: red 0-40, yellow 41-70, green 71-100
- Components live at components/[ComponentName].tsx

The description should make it trigger whenever we create or
modify dashboard components, health score displays, or customer
data UI.
```

**Review the generated SKILL.md** — is the `description` specific about *what* it does and *when* to use it?

---
background: /bg-blue-bottom-right.jpeg
---

<div class="grid grid-cols-2 gap-8">

<div>

### Part 2: Generate CustomerCard with the Skill

**Ask for the component — no need to mention the skill:**
```
Create a CustomerCard component at
components/CustomerCard.tsx based on
@requirements/customer-card.md
and @specs/customer-card-example.md
```

**Verify the skill triggered:** did the agent mention loading the `dashboard-components` skill? Are its conventions reflected in the output?

</div>

<div>

### Part 3: Review and Integration

**Review the generated CustomerCard component:**
- Does it match the Customer Intelligence Dashboard design?
- Are health score colors implemented correctly?
- Is it ready for integration with CustomerSelector?
- Does it handle customer domains properly?

</div>

</div>

---
background: /bg-blue-bottom-right.jpeg
---

## Expected Outcomes

- A `dashboard-components` skill versioned in your project at `.claude/skills/`
- A working CustomerCard component built with your skill's conventions
- Understanding of how the `description` field controls when a skill triggers
- Reusable conventions that apply to every dashboard component you build next

## Next Steps

Your CustomerCard component is ready for integration into the CustomerSelector and main dashboard layout. In Session 6, this same skill supplies conventions to every implementation run when you orchestrate the full dashboard build.
