---
background: /bg-blue-bottom-right.jpeg
---

# Exercise 06: Using Subagents for Dashboard Development


Learn to create and use specialized subagents for Customer Intelligence Dashboard components, combining subagent techniques with actual application development.

## Success Criteria

- [ ] Create a dashboard-focused component-generator subagent
- [ ] Generate the CustomerCard component using your subagent
- [ ] Review and refine the generated component for dashboard integration

---
background: /bg-blue-bottom-right.jpeg
---

## Your Tasks

### Part 1: Create Component Generator Subagent

**Step 1: Open the subagent creation interface**
```
/agents
```

**Step 2: Create a new project-level subagent:**
```
Name: dashboard-component-generator

Description: Customer Intelligence Dashboard component specialist. Creates React 19 + TypeScript components with Tailwind styling for customer data, health scores, and dashboard layouts. Specializes in Next.js App Router patterns, customer intelligence features, and health score displays.

Tools: Read, Write, Edit

Model: inherit
```

**This creates a subagent file at `.claude/agents/dashboard-component-generator.md`**

---
background: /bg-blue-bottom-right.jpeg
---

<div class="grid grid-cols-2 gap-8">

<div>

### Part 2: Generate CustomerCard Component

**Ask your subagent to create the component:**
```
Use the dashboard-component-generator subagent to 
create a CustomerCard component at 
components/CustomerCard.tsx based on 
@requirements/customer-card.md
and @specs/customer-card-example.md
```

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

- A specialized dashboard-component-generator subagent in your project
- A working CustomerCard component with health score functionality
- Understanding of subagent specialization for application domains
- Ready-to-use component for Customer Intelligence Dashboard integration

## Next Steps

Your CustomerCard component is now ready for integration into the CustomerSelector and main dashboard layout. You've learned how subagents can be specialized for specific application domains while maintaining the core Claude Code techniques.