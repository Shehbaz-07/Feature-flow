export interface Environment {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface FeatureFlag {
  id: string;
  key: string;
  description: string | null;
  type: string;
  default_value: string | null;
  enabled: boolean;
  owner_team: string | null;
  created_at: string;
}

export interface EnvironmentOverride {
  id: string;
  flag_id: string;
  environment_id: string;
  value: string;
}

export interface FeatureTargeting {
  id: string;
  flag_id: string;
  environment_id: string;
  user_ids: string[] | null;
  group_names: string[] | null;
  created_at: string;
}

export interface RolloutRule {
  id: string;
  flag_id: string;
  environment_id: string;
  rollout_percentage: number;
  created_at: string;
}

export interface FlagAuditLog {
  id: string;
  action: string;
  performed_by: string;
  old_value: any;
  new_value: any;
  timestamp: string;
}
