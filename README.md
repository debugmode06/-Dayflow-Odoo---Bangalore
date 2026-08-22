# DAYFLOW — Human Resource Management System (HRMS)

> **Every workday, perfectly aligned.**

Dayflow is a premium, modern, responsive Human Resource Management System built on React, Vite, and Firebase. It unifies Employee Profiles, Attendance Intelligence, Smart Leave, Payroll, Workforce Availability, and AI Explainability into one cohesive SaaS product.

---

## 🏗️ Architecture & Module Ownership

Dayflow follows a **feature-based architecture**. Shared design tokens, UI components, layout shell, routing, and Firebase infrastructure reside in shared directories. Each feature module owns its pages, components, services, hooks, and feature-specific utilities.

### Shared Foundation (Frozen after initial commit)
* `src/components/ui/` — Design System components (Button, Input, Select, Modal, Drawer, Card, Badge, Avatar, DataTable, Skeleton, EmptyState, ErrorState, Toast)
* `src/components/layout/` — App Shell (AppShell, Sidebar, Topbar, MobileNav)
* `src/components/feedback/` — Feedback screens (LoadingScreen, ErrorBoundary)
* `src/config/` — Firebase, Constants, Navigation
* `src/styles/` — Design tokens (`tokens.css`), reset (`globals.css`), animations (`animations.css`)
* `src/lib/` — Firebase wrappers, Calculation helpers, Utilities

### Feature Modules (Individual Ownership)

| Feature Module | Responsibilities | Assigned Owner |
|---|---|---|
| `src/features/auth/` | Authentication, Role-based Access, Route Guards | **Member 1** |
| `src/features/employees/` | Employee 360° Profile, HR Employee Directory, Activity Timeline | **Member 1** |
| `src/features/attendance/` | Check-in/Check-out, Attendance Intelligence, Score & Patterns | **Member 2** |
| `src/features/leave/` | Leave Applications, Approvals, HR Comments, Leave Impact Simulator | **Member 3** |
| `src/features/payroll/` | Salary Visibility, Compensation Structures, HR Payroll Control | **Member 4** |
| `src/features/workforce/` | HR Command Center, Workforce Pulse Analytics, AI Explainability | **Member 4** |

---

## 🌿 Git Branch Strategy

Work strictly on feature branches off `develop`. Do not commit directly to `main`.

```text
main
 └── develop
      ├── feature/member-1-identity
      ├── feature/member-2-attendance
      ├── feature/member-3-leave
      └── feature/member-4-command-center
```

### Commit Message Standards
* `feat(module): add check-in action button`
* `fix(module): resolve leave simulator percentage calculation`
* `refactor(module): optimize attendance pattern detection`
* `chore(project): update dependencies`

---

## 🎨 Design System

Dayflow enforces an **iPhone-inspired, premium light theme visual language**:
* **Clean white surfaces** (`#FFFFFF`) on soft neutral backgrounds (`#F8FAFC`).
* **Strong typography hierarchy** (Inter / System SF Display).
* **Generous spacing** and rounded card containers (`16px` border radius).
* **Subtle, high-contrast borders** (`#E2E8F0`) with soft depth shadows.
* **Micro-interactions** for interactive state feedback.

---

## 🔒 Security & Data Principles

1. **Firebase Authentication UID** is the primary security identity. Employee ID is stored separately.
2. **Firestore Security Rules** (`firestore.rules`) enforce strict authorization for employees (owner-only access) and HR/Admins.
3. **AI Explainability**: Minimal structured operational signals are sent to the AI model. No personal identifiable information (PII) or salary amounts are transmitted.
4. **Resilience**: Rule-based fallback engines guarantee application functionality even if AI services are offline.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and supply your Firebase credentials:
```bash
cp .env.example .env
```

### 3. Run Local Development Server
```bash
npm run dev
```

### 4. Build Production Bundle
```bash
npm run build
```
