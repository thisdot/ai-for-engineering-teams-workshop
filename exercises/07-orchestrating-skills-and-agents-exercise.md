---
background: /bg-blue-bottom-right.jpeg
---

# Exercise 07: Implement All Dashboard Specs

You've created multiple specifications, custom commands, and a dashboard-components skill throughout the workshop. Now orchestrate all three layers to implement every spec as a working component for your Customer Intelligence Dashboard.

## Success Criteria

- [ ] Identify all specs in @specs/ directory
- [ ] Implement each spec with a subagent using your skill's conventions
- [ ] Verify each component against acceptance criteria
- [ ] Complete Customer Intelligence Dashboard ready for integration

---
background: /bg-blue-bottom-right.jpeg
---

## Your Tasks

### Part 1: Inventory Your Specs

**List all specification files:**
```
What spec files do we have in @specs/?
```

**Expected specs from earlier sessions:**
- customer-card-spec.md (from Exercise 01)
- Additional component specs (from Exercise 02)
- Integration specs (from Exercise 03)

---
background: /bg-blue-bottom-right.jpeg
---

### Part 2: Orchestrated Implementation

**Create orchestration workflow:**
```
For each spec file in @specs/, use a subagent to implement it:
1. Inside each run, use the /implement command to generate the
   component (the dashboard-components skill supplies our conventions)
2. Use the /verify command to test with mock data
3. Check if components/[ComponentName].tsx exists
4. Verify against acceptance criteria

After processing all specs, create a completion report:
- ✅ Specs fully implemented (component exists and passes criteria)
- ⚠️  Specs with issues (component exists but has problems)
- ❌ Specs not yet implemented (no component file)
```

**The orchestration should:**
- Delegate each spec to an isolated subagent run
- Apply the dashboard-components skill's conventions in every run
- Generate components at components/[ComponentName].tsx
- Track completion status for each component

---
background: /bg-blue-bottom-right.jpeg
---

### Part 3: Review Completion Report

**Analyze the completion report:**
```
Show me the completion report for all specs
```

**Questions to verify:**
- How many specs were fully implemented? ✅
- Are there any specs with issues? ⚠️
- Are there any unimplemented specs? ❌
- Do the components follow the skill's conventions consistently?
- What needs to be fixed or completed?

---
background: /bg-blue-bottom-right.jpeg
---

## Expected Outcomes

- All dashboard specs implemented as components
- Each component verified against its spec's acceptance criteria
- Consistent conventions across every component, supplied by your skill
- Complete set of components ready for dashboard assembly

## Key Patterns Learned

- **Layered Orchestration** - Commands as steps, skill as conventions, subagents as isolated workers
- **Batch Processing** - Implementing multiple specs efficiently
- **Systematic Verification** - Checking each component against its spec
- **Complete Dashboard** - From specs to working implementation
