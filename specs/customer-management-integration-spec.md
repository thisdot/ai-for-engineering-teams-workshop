# Feature: Customer Management Integration

## Context
- Complete customer management feature (CRUD) for the Customer Intelligence Dashboard
- Users add, view, update, and list customers with full metadata
- Demonstrates multi-step orchestration for full-stack CRUD
- Integrates with existing customer browsing/selection workflows

## Requirements

### User Experience Flow
- Navigate from the home screen to customer management
- Clear entry point ("Manage Customers") on the main dashboard
- Seamless transition between customer browsing (CustomerSelector) and management (CRUD)

### API Layer (Next.js Route Handlers)
- `GET /api/customers` — list all customers with optional filtering
- `POST /api/customers` — add a new customer with validation
- `GET /api/customers/[id]` — get specific customer details
- `PUT /api/customers/[id]` — update customer information
- Validate input (name, email, company, health score); sanitize responses
- Consistent JSON response format with data + metadata

### Service Layer
- `CustomerService` class abstracting business logic
- In-memory storage simulating persistence
- Validation + sanitization; pure functions where practical for testability

### UI Components
- `AddCustomerForm` — create a customer (name, email, company, health score, subscription tier)
- Real-time validation feedback; success/error states with notifications
- `CustomerList` — display existing customers with filtering
- Navigation entry point from the home dashboard

### UI Components (shadcn/ui)
- **Form** (`@/components/ui/form`) with **react-hook-form + zod** — `AddCustomerForm` field state, validation, and per-field error messages (real-time feedback)
- **Input** (`@/components/ui/input`) + **Label** (`@/components/ui/label`) — name, email, company fields
- **Select** (`@/components/ui/select`) — subscription tier (`basic` / `premium` / `enterprise`, matching the `Customer` type)
- **Slider** (`@/components/ui/slider`) or numeric **Input** — health score entry bounded 0–100
- **Dialog** (`@/components/ui/dialog`) — modal for "Add Customer" without leaving the list
- **Table** (`@/components/ui/table`) — `CustomerList` with sortable/filterable columns
- **DropdownMenu** (`@/components/ui/dropdown-menu`) — per-row actions (view / edit)
- **Alert** (`@/components/ui/alert`) — surfacing API/validation errors
- **Sonner** (`@/components/ui/sonner`) — success/error toast notifications after CRUD calls
- **Tabs** (`@/components/ui/tabs`) or **NavigationMenu** — "Browse" ↔ "Manage Customers" navigation
- **Button** (`@/components/ui/button`) — submit/cancel/actions
- lucide icons (Plus, Pencil, Trash, etc.) for actions

## Constraints

### Technical Stack
- Next.js 15 App Router with Route Handlers
- React 19 hooks/patterns; TypeScript strict typing for `Customer` and form data
- Tailwind CSS v4 + shadcn/ui theme tokens
- In-memory storage (no external database)
- Error boundaries for graceful failure handling

### File Structure and Naming
- API: `src/app/api/customers/route.ts`, `src/app/api/customers/[id]/route.ts`
- Service: `src/lib/CustomerService.ts` (or `src/services/`)
- Components: `src/components/AddCustomerForm.tsx`, `src/components/CustomerList.tsx`
- Reuse shadcn primitives from `src/components/ui/`; do not fork them

### Security Requirements
- Input validation to prevent injection (name, email, company)
- Email format validation and sanitization
- Sanitize data before storage and display
- Error message sanitization (no sensitive info leakage)
- Rate-limiting considerations for creation routes

## Acceptance Criteria

- [ ] All four API routes implemented with validation and consistent JSON responses
- [ ] `CustomerService` encapsulates storage + validation with testable functions
- [ ] `AddCustomerForm` uses shadcn `Form` + zod with real-time per-field validation
- [ ] Subscription tier via `Select`; health score bounded 0–100
- [ ] `CustomerList` renders in a `Table` with filtering and row actions
- [ ] Success/error feedback via `Sonner` toasts and `Alert`
- [ ] Navigation entry point ("Manage Customers") present via `Tabs`/`NavigationMenu`
- [ ] Uses theme tokens throughout; dark mode works
- [ ] Passes TypeScript strict mode checks; no console errors
