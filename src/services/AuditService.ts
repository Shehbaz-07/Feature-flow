import { createClient } from "@/lib/supabase/server";

export class AuditService {
  static async logAction(
    action: string,
    performedBy: string,
    oldValue: any,
    newValue: any
  ) {
    const supabase = await createClient();

    const { error } = await supabase.from("flag_audit_logs").insert({
      action,
      performed_by: performedBy,
      old_value: oldValue ? JSON.stringify(oldValue) : null,
      new_value: newValue ? JSON.stringify(newValue) : null,
    });

    if (error) {
      console.error("Failed to write audit log:", error);
    }
  }
}
