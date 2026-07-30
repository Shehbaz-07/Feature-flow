import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { AuditService } from "@/services/AuditService";
import { z } from "zod";

const groupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  member_ids: z.array(z.string()).optional().default([]),
});

// GET /api/groups - List all groups
export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("groups")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/groups - Create a group
export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const validated = groupSchema.parse(body);

    const { data, error } = await supabase
      .from("groups")
      .insert({
        name: validated.name,
        description: validated.description ?? null,
        member_ids: validated.member_ids,
      })
      .select()
      .single();

    if (error) throw error;

    await AuditService.logAction(
      "group created",
      user.email ?? user.id,
      null,
      { name: validated.name }
    );

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
