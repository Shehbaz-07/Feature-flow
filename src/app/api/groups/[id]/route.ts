import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { AuditService } from "@/services/AuditService";
import { z } from "zod";

const updateGroupSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  member_ids: z.array(z.string()).optional(),
});

// GET /api/groups/[id] - Get a single group
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("groups")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return NextResponse.json({ error: "Group not found" }, { status: 404 });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH /api/groups/[id] - Update a group
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const validated = updateGroupSchema.parse(body);

    // Fetch old value for audit
    const { data: oldData } = await supabase.from("groups").select("*").eq("id", id).single();

    const { data, error } = await supabase
      .from("groups")
      .update({ ...validated, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    await AuditService.logAction(
      "group updated",
      user.email ?? user.id,
      oldData,
      data
    );

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// DELETE /api/groups/[id] - Delete a group
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: oldData } = await supabase.from("groups").select("*").eq("id", id).single();
    const { error } = await supabase.from("groups").delete().eq("id", id);

    if (error) throw error;

    await AuditService.logAction(
      "group deleted",
      user.email ?? user.id,
      oldData,
      null
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
