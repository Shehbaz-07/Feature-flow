# Developer Onboarding: Feature Flow

Welcome to the **Feature Flow** project! This document serves as a comprehensive guide for new developers joining the team. It covers the architecture, tech stack, database schema, and core features of the system.

## Project Overview

**Feature Flow** is a full-stack Feature Flag and Release Control System. It allows teams to manage feature rollouts, target specific users or groups, toggle features on/off instantly across different environments (e.g., Development, Staging, Production), and maintain an audit log of all changes.

## Tech Stack

- **Frontend & Backend Framework:** [Next.js (App Router)](https://nextjs.org/)
- **Database & Authentication:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Styling:** Tailwind CSS & Shadcn UI (Radix UI primitives)
- **Language:** TypeScript
- **Validation:** Zod

## Folder Structure & Architecture

We use a structured architecture to cleanly separate concerns between the UI, business logic, and database schemas.

```
feature-flow/
├── src/
│   ├── app/                 # Next.js App Router (Frontend pages & API routes)
│   │   ├── (auth)/          # Authentication pages
│   │   ├── api/             # Backend API Endpoints (Environments, Flag Evaluation)
│   │   ├── dashboard/       # Dashboard UI
│   │   └── actions.ts       # Next.js Server Actions for UI data fetching/mutations
│   ├── components/          # Reusable React components (UI elements)
│   ├── lib/                 # Utility functions (e.g., Supabase client setup)
│   ├── models/              # TypeScript interfaces mirroring our DB schema
│   ├── schemas/             # Zod validation schemas for API inputs
│   └── services/            # Core business logic
└── supabase_schema.sql      # SQL script for initializing the database tables
```

### The `src/services/` Directory

This directory contains the core business logic of the backend:

- `FlagEvaluationService.ts`: Contains the `evaluateFlag` method. This is the heart of the system. It takes a flag key, environment ID, and optional user context to determine if a flag is enabled. It handles logic for percentage rollouts (using deterministic hashing) and user/group targeting.
- `CacheService.ts`: An in-memory cache layer to ensure flag evaluations are extremely fast and don't overwhelm the Supabase database.
- `AuditService.ts`: Responsible for logging every environment or flag change into the `flag_audit_logs` table for compliance and history tracking.

## Database Schema

Our PostgreSQL database (hosted on Supabase) uses the following core tables to power the system:

1. **`environments`**: Stores deployment targets (e.g., Production, Staging).
2. **`feature_flags`**: The core flags (e.g., `new-checkout-flow`, `dark-mode`).
3. **`environment_overrides`**: Links a flag to an environment and overrides its default value (e.g., ON in Dev, OFF in Prod).
4. **`feature_targeting`**: Stores rules for targeting specific `user_ids` or `group_names`.
5. **`rollout_rules`**: Stores percentage rollout configurations (e.g., 50% rollout).
6. **`flag_audit_logs`**: An immutable log of all actions performed in the system (who did what and when).

*You can view the full table definitions in `supabase_schema.sql`.*

## Core Features Explained

### 1. Flag Evaluation API
External applications communicate with our system via the `POST /api/flags/evaluate` endpoint. It expects a `flagKey` and `environmentId`, and optionally a `userId` and `groups`. 
The evaluation engine checks targeting rules first, then percentage rollouts, and falls back to environment overrides or default flag values.

### 2. User & Group Targeting
If a feature should only be available to internal testers or beta users, you can configure targeting rules. If an incoming evaluation request contains a matching `userId` or `group`, the flag is forcefully returned as `true`.

### 3. Percentage Rollouts
For canary releases, we use a deterministic hashing algorithm. By hashing the combination of the `flagKey` and `userId`, we generate a consistent integer between 0-99. If this number is less than the configured rollout percentage, the flag is enabled for that user. This ensures a user doesn't see a feature turn on and off randomly across sessions.

### 4. Cache Management
To minimize latency for the evaluation endpoint, results are temporarily stored in the `CacheService`. Subsequent identical requests within the TTL (Time to Live) will hit the cache instead of the database.

## Local Development Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup Supabase:**
   - Ensure your `.env.local` contains `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
   - Run the SQL statements found in `supabase_schema.sql` inside your Supabase project's SQL Editor to create the required tables.

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - Frontend UI: `http://localhost:3000`
   - API endpoints are available under `http://localhost:3000/api/...`

Welcome to the team! If you have any questions, refer to the code comments in `FlagEvaluationService.ts` to understand how the resolution engine works.
