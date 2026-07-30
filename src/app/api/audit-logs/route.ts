import { NextResponse } from "next/server";
import { AuditService } from "@/services/AuditService";

// GET /api/audit-logs - Fetch recent audit logs
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") ?? "100", 10);

    const logs = await AuditService.getAuditLogs(limit);
    return NextResponse.json(logs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
