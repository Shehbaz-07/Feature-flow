import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { environmentSchema } from "@/schemas/flags";
import { AuditService } from "@/services/AuditService";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("environments").select("*").order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = environmentSchema.parse(body);

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("environments")
      .insert(validatedData)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    if (user) {
      await AuditService.logAction("created environment", user.id, null, data);
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
