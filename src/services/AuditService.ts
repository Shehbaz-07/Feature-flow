import { createClient } from "@/lib/supabase/server";

export class AuditService {
  static async logAction(
    action: string,
    performedBy: string,
    oldValue: any,
    newValue: any,
    flagId?: string
  ) {
    const supabase = await createClient();

    const { error } = await supabase.from("flag_audit_logs").insert({
      action,
      performed_by: performedBy,
      old_value: oldValue ? JSON.stringify(oldValue) : null,
      new_value: newValue ? JSON.stringify(newValue) : null,
      flag_id: flagId ?? null,
    });

    if (error) {
      console.error("Failed to write audit log:", error);
    }
  }

  static async getAuditLogs(limit = 100) {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("flag_audit_logs")
      .select("*, flag:feature_flags(key)")
      .order("timestamp", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Failed to fetch audit logs:", error);
      return [];
    }

    return data ?? [];
  }
}
