import { NextResponse } from "next/server";
import { flagEvaluateSchema } from "@/schemas/flags";
import { FlagEvaluationService } from "@/services/FlagEvaluationService";
import { AuditService } from "@/services/AuditService";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = flagEvaluateSchema.parse(body);

    const result = await FlagEvaluationService.evaluateFlag(
      validatedData.flagKey,
      validatedData.environmentId,
      validatedData.userId,
      validatedData.groups
    );

    if (result === null) {
      return NextResponse.json({ error: "Flag not found or evaluation failed" }, { status: 404 });
    }

    // Optionally log evaluation (if auditing evaluates is required, though usually only changes are audited)
    // await AuditService.logAction("evaluate flag", "system", null, { flagKey: validatedData.flagKey, result });

    return NextResponse.json({ result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
