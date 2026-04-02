# SQL Implementation Tracking | Veritus CRM

This document tracks the current state of the PostgreSQL (Supabase) schema and the implemented security logic.

## 📊 Current Schema State

| Table Name | Purpose | Implementation Status |
|---|---|---|
| **departments** | Organizational units | ✅ Implemented |
| **profiles** | Extended user data (Auth link) | ✅ Implemented (with Trigger) |
| **tasks** | Strategic mission directives | ✅ Implemented |
| **comments** | Communication & feedback | ✅ Implemented |
| **notifications** | Activity alerts & mentions | ✅ Implemented |

## 🛡️ Implemented Security Logic (RLS)

- **Global Hierarchy Rules**: Verified Top-Down assignment (`superior.role_level < subordinate.role_level`).
- **Profile Privacy**: Auth users can view all profiles for transparency, but only Rank 0 (IT Admin) can modify them.
- **Task Visibility**: Limited to the assigner, the assignee, or a superior with a lower `role_level` (Full CEO visibility).

## 🌱 Seeded Data (v1.0)

The following official departments are currently seeded:
1. `Digital Infrastructure`
2. `Legal & IP`
3. `Digital Engagement & Design`
4. `Global Alliance & Advocacy`
5. `R&D`
6. `Business Research & Analysis`


## 🔄 Triggers & Functions

- `handle_new_user()`: Automatically creates a `profiles` entry when a user is added to `auth.users`. Defaults to `Junior Associate` (Level 5).

---
*Last Updated: 2026-04-02*
