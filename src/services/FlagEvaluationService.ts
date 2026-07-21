import { createClient } from "@/lib/supabase/server";
import { CacheService } from "./CacheService";

export class FlagEvaluationService {
  /**
   * Simple hash string function to get a deterministic integer between 0 and 99.
   */
  private static hashToPercentage(input: string): number {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash) % 100;
  }

  static async evaluateFlag(flagKey: string, environmentId: string, userId?: string, groups?: string[]): Promise<boolean | string | null> {
    const cacheKey = `flag_eval:${flagKey}:${environmentId}:${userId || 'anon'}`;
    const cached = CacheService.get(cacheKey);
    if (cached !== null) return cached;

    const supabase = await createClient();

    // Fetch the flag and its base configuration
    const { data: flagData, error: flagError } = await supabase
      .from("feature_flags")
      .select("id, type, default_value, enabled")
      .eq("key", flagKey)
      .single();

    if (flagError || !flagData) {
      return null; // Flag not found
    }

    if (!flagData.enabled) {
       CacheService.set(cacheKey, false, 60);
       return false;
    }

    // Fetch environment overrides
    const { data: overrideData } = await supabase
      .from("environment_overrides")
      .select("value")
      .eq("flag_id", flagData.id)
      .eq("environment_id", environmentId)
      .single();

    // Fetch targeting rules
    const { data: targetingData } = await supabase
      .from("feature_targeting")
      .select("user_ids, group_names")
      .eq("flag_id", flagData.id)
      .eq("environment_id", environmentId)
      .single();

    // Fetch rollout rules
    const { data: rolloutData } = await supabase
      .from("rollout_rules")
      .select("rollout_percentage")
      .eq("flag_id", flagData.id)
      .eq("environment_id", environmentId)
      .single();

    let finalValue: boolean | string = overrideData ? overrideData.value === 'true' : flagData.default_value === 'true';

    // Apply User and Group Targeting
    if (targetingData) {
      let isTargeted = false;
      if (userId && targetingData.user_ids?.includes(userId)) {
        isTargeted = true;
      }
      if (groups && targetingData.group_names && groups.some(g => targetingData.group_names!.includes(g))) {
        isTargeted = true;
      }
      if (isTargeted) {
        CacheService.set(cacheKey, true, 60);
        return true; 
      }
    }

    // Apply Percentage Rollout
    if (rolloutData && userId) {
      const hashValue = this.hashToPercentage(`${flagKey}-${userId}`);
      if (hashValue < rolloutData.rollout_percentage) {
        CacheService.set(cacheKey, true, 60);
        return true;
      } else {
        CacheService.set(cacheKey, false, 60);
        return false;
      }
    }

    // Convert string 'true'/'false' to boolean if type is boolean
    if (flagData.type === 'boolean' && typeof finalValue === 'string') {
      finalValue = finalValue === 'true';
    }

    CacheService.set(cacheKey, finalValue, 60);
    return finalValue;
  }
}
