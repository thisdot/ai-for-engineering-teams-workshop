---
background: /bg-blue-bottom-right.jpeg
---

# Exercise 07: Implement All Dashboard Specs

You've created multiple specifications throughout the workshop. Now use subagent orchestration to implement all of them as working components for your Customer Intelligence Dashboard.

## Success Criteria

- [ ] Identify all specs in @specs/ directory
- [ ] Implement each spec as a component
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
Use the dashboard-component-generator subagent to implement all component specs from @specs/.

For each spec file:
1. Read the spec file
2. Use /implement command to generate the component
3. Use /verify command to test with mock data
4. Check if components/[ComponentName].tsx exists
5. Verify against acceptance criteria

After processing all specs, create a completion report:
- ✅ Specs fully implemented (component exists and passes criteria)
- ⚠️  Specs with issues (component exists but has problems)
- ❌ Specs not yet implemented (no component file)
```

**The subagent should:**
- Process specs systematically
- Generate components at components/[ComponentName].tsx
- Verify against acceptance criteria from each spec
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
- What needs to be fixed or completed?

---
background: /bg-blue-bottom-right.jpeg
---

## Expected Outcomes

- All dashboard specs implemented as components
- Each component verified against its spec's acceptance criteria
- Complete set of components ready for dashboard assembly
- Experience with batch implementation workflows

## Key Patterns Learned

- **Batch Processing** - Implementing multiple specs efficiently
- **Command Composition** - Using /implement and /verify in orchestrated workflow
- **Systematic Verification** - Checking each component against its spec
- **Complete Dashboard** - From specs to working implementation