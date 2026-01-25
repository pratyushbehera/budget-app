# FinPal – AI Agent Operating Rules (agents.md)

## 1. Purpose
This document defines strict rules for AI agents (Google Antigravity, Copilot, Cursor, Claude, etc.) contributing to the FinPal codebase.

Goals:
- Maintain architectural consistency
- Prevent over-engineering
- Ensure financial correctness
- Preserve frontend performance & UX quality
- Avoid security, compliance, and data integrity risks

Agents must follow all rules below. If uncertain, agents must ask for clarification instead of guessing.

---

## 2. Project Context
FinPal is a personal finance & budgeting application.
It is NOT a trading, advisory, or portfolio management system.

---

## 3. Tech Stack (NON-NEGOTIABLE)

### Frontend
- React (functional components only)
- React Router
- Redux Toolkit
- Tailwind CSS
- JavaScript (ES2020+)

### Backend
- Node.js
- Express
- MongoDB (Mongoose)
- REST APIs only

---

## 4. Folder Structure (STRICT)

### Frontend
src/
- app/
  - layouts/
  - providers/
  - routes/
  - store/
- assets/
- contexts/
- features/
  - <feature-name>/components/
  - <feature-name>/hooks/
- pages/
- services/
- shared/
  - components/
  - constants/
  - hooks/
  - utils/
- styles/
- themes/

### Backend
server/
- api/
- config/
- controllers/
- jobs/
- middleware/
- models/
- routes/
- utils/

---

## 5. Frontend Coding Rules
- Hooks only at top-level
- No API calls inside components
- Business logic in hooks/services
- Redux for global state only
- Local state for UI only

---

## 6. Styling Rules
- Tailwind utility-first
- No inline styles
- No new CSS frameworks
- Consistent spacing & colors

---

## 7. API Rules
- RESTful, versioned (/api/v1)
- Consistent response shape
- Backend validates all inputs

---

## 8. Database Rules
- Mongoose schemas mandatory
- No deep nesting
- Use ObjectId references
- No silent mutations

---

## 9. AI Features (CRITICAL)
- Descriptive, never prescriptive
- No financial advice
- Mandatory disclaimer:
  “This is informational only, not financial advice.”

---

## 10. Security Rules
- No secrets in code
- Prevent IDOR
- Validate user ownership
- Rate limit sensitive APIs

---

## 11. Performance Rules
- Memoize expensive logic
- Lazy-load heavy pages
- Paginate large lists

---

## 12. Testing
- Unit tests for utilities
- Component tests for flows
- No snapshot-only tests

---

## 13. Forbidden Actions
- Introducing new frameworks
- Changing architecture
- Adding unrelated features
- Guessing requirements

---

## 14. When in Doubt
Explain assumptions and ask before proceeding.
