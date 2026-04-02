# Veritus CRM | Strategic Hierarchy Task Management

Veritus is a premium, high-fidelity CRM designed for structured organizations that require a strict top-down task assignment model. Built with **Next.js 15**, **Supabase**, and **Tailwind CSS 4**, it combines an elite monochrome aesthetic with robust enterprise security.

## 🚀 Strategic Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Authentication**: [Supabase Auth (SSR)](https://supabase.com/docs/guides/auth/server-side/nextjs)
- **Database**: [PostgreSQL (Supabase)](https://supabase.com/) with hierarchical RLS
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🛡️ Enterprise Hierarchy Model

Veritus enforces a strict organizational hierarchy where task visibility and assignment are governed by `role_level`:

| Role | Level | Authority Scope |
|---|---|---|
| **IT Administrator** | 0 | Full System Configuration & Personnel Management |
| **CEO / COO / CSO** | 1 | Strategic Oversight (Global Visibility) |
| **COO Associate** | 2 | Operational Coordination |
| **Department Head** | 3 | Departmental Resource Management |
| **Senior Associate** | 4 | Project Execution |
| **Junior Associate** | 5 | Operational Tasks |

> [!IMPORTANT]
> **Directive Protocol**: Tasks can only be assigned by a superior to a subordinate (Rank Level N -> N+1). Lateral or upward assignments are blocked at the database layer via Row Level Security (RLS).

## 🛠️ Infrastructure Setup

### 1. Environment Variables
Create a `.env` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Database Migration
Execute the [supabase_setup.sql](file:///C:/Users/aggar/.gemini/antigravity/brain/ab01b1e2-2249-4306-9954-49ad798db7a0/supabase_setup.sql) script in your Supabase SQL Editor. This initializes all tables, triggers, and the hierarchical security layer.

### 3. Installation
```powershell
npm install
npm run dev
```

## 📂 Core Architecture

- `/app`: Secure dashboard layouts and App Router logic.
- `/components`: High-fidelity UI units and CRM-specific modules.
- `/lib`: Supabase SSR utilities and core TypeScript definitions.
- `/hooks`: Operational state hooks and data listeners.

---
*© 2026 Veritus CRM Systems. All rights reserved.*
