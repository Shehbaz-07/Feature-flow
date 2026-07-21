import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { environmentSchema } from "@/schemas/flags";
import { AuditService } from "@/services/AuditService";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("environments").select("*").eq("id", params.id).single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const validatedData = environmentSchema.parse(body);

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // get old value for audit log
    const { data: oldData } = await supabase.from("environments").select("*").eq("id", params.id).single();

    const { data, error } = await supabase
      .from("environments")
      .update(validatedData)
      .eq("id", params.id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    if (user) {
      await AuditService.logAction("updated environment", user.id, oldData, data);
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: oldData } = await supabase.from("environments").select("*").eq("id", params.id).single();

  const { error } = await supabase.from("environments").delete().eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (user) {
    await AuditService.logAction("deleted environment", user.id, oldData, null);
  }

  return new NextResponse(null, { status: 204 });
}
