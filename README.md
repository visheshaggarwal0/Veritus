# Veritus CRM | Institutional Hierarchy & Task Management

Veritus is a premium, high-fidelity CRM designed for structured organizations that require a strict top-down task assignment model. Built with **Next.js 16**, **Supabase**, and **Tailwind CSS 4**, it combines an elite "Elegant & Sharp" aesthetic with robust enterprise security and a Poppins-powered typographic system.

## 🚀 Institutional Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) with `proxy.ts` convention
- **Authentication**: [Supabase Auth (SSR)](https://supabase.com/docs/guides/auth/server-side/nextjs)
- **Database**: [PostgreSQL (Supabase)](https://supabase.com/) with hierarchical RLS
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) (Poppins & Outfit Typography)
- **Security**: Institutional Air-Gapped administrative layer

## 💎 Elite Features

- **Personnel Directory**: Full organizational hierarchy management with real-time status tracking.
- **Node Provisioning**: IT Administrators (Rank 0) can instantly provision new accounts with custom roles and mandatory department assignment.
- **Identity Self-Repair**: Automated protocol to reconstruct missing database profiles from Auth metadata.
- **Security Logs**: High-precision audit trail of all hierarchical modifications and system alerts.
- **Mission Control**: Refined Kanban and Calendar views for strategic task orchestration.

## 🛡️ Enterprise Hierarchy Model

Veritus enforces a strict organizational hierarchy where task visibility and assignment are governed by `role_level`:

| Role | Level | Authority Scope |
|---|---|---|
| **IT Administrator** | 0 | Full System Configuration & Personnel Provisioning |
| **CEO / Executive** | 1 | Strategic Oversight (Global Visibility) |
| **Department Head** | 2 | Departmental Resource Management |
| **Project Manager** | 3 | Operational Coordination |
| **Senior Associate** | 4 | Project Execution |
| **Junior Associate** | 5 | Operational Tasks |

> [!IMPORTANT]
> **Directive Protocol**: Tasks can only be assigned by a superior to a subordinate (Rank Level N -> N+1). Lateral or upward assignments are blocked at the database layer via Row Level Security (RLS).

## 🛠️ Infrastructure Setup

### 1. Environment Variables
Create a `.env` file in the root directory (refer to `.env.example`):
```env
# Public Supabase Config
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Secret Admin Config (Required for Provisioning/Repair)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
```

### 2. Database Migration
Execute the `supabase_setup.sql` script in your Supabase SQL Editor to initialize the tables, triggers, and hierarchical security layer. 

> [!NOTE]
> **Seed Scripts Deprecated**: Legacy `.mjs` seed scripts have been purged for security. Use the **Personnel Directory > Provision Node** UI to manage accounts.

### 3. Installation
```powershell
npm install
npm run dev
```

## 📂 Core Architecture

- `/app`: Secure dashboard layouts and Next.js 16 `proxy.ts`.
- `/components`: High-fidelity UI units and Poppins-powered modules.
- `/lib`: Supabase SSR utilities and administrative server actions.
- `/hooks`: Operational state hooks and data listeners.

---
*© 2026 Veritus CRM Systems. All rights reserved.*
