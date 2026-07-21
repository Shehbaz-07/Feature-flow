-- Environments Table
CREATE TABLE IF NOT EXISTS public.environments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Feature Flags Table (assuming it doesn't exist in the new structure, or we alter existing 'features' table)
-- We will create a new table specific for the feature flag system, as the existing 'features' table might be for project management.
CREATE TABLE IF NOT EXISTS public.feature_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    type VARCHAR(50) NOT NULL DEFAULT 'boolean',
    default_value VARCHAR(255),
    enabled BOOLEAN DEFAULT false,
    owner_team VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Environment Overrides (values of flags per environment)
CREATE TABLE IF NOT EXISTS public.environment_overrides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    flag_id UUID REFERENCES public.feature_flags(id) ON DELETE CASCADE,
    environment_id UUID REFERENCES public.environments(id) ON DELETE CASCADE,
    value VARCHAR(255) NOT NULL,
    UNIQUE(flag_id, environment_id)
);

-- Feature Targeting Rules (User / Group Targeting)
CREATE TABLE IF NOT EXISTS public.feature_targeting (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    flag_id UUID REFERENCES public.feature_flags(id) ON DELETE CASCADE,
    environment_id UUID REFERENCES public.environments(id) ON DELETE CASCADE,
    user_ids TEXT[], -- Array of targeted user IDs
    group_names TEXT[], -- Array of targeted group names
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Percentage Rollout Rules
CREATE TABLE IF NOT EXISTS public.rollout_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    flag_id UUID REFERENCES public.feature_flags(id) ON DELETE CASCADE,
    environment_id UUID REFERENCES public.environments(id) ON DELETE CASCADE,
    rollout_percentage INTEGER NOT NULL CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(flag_id, environment_id)
);

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS public.flag_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action VARCHAR(255) NOT NULL, -- e.g., 'override set', 'created', 'enabled', 'disabled'
    performed_by VARCHAR(255) NOT NULL,
    old_value JSONB,
    new_value JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
