"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Projects
export async function getProjects() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("projects")
    .select("*, owner:profiles(full_name)")
    .order("created_at", { ascending: false })
  
  if (error) throw new Error(error.message)
  return data
}

export async function createProject(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const name = formData.get("name") as string
  const code = formData.get("code") as string
  const description = formData.get("description") as string
  
  const { error } = await supabase.from("projects").insert({
    name,
    code,
    description,
    owner_id: user.id,
    status: "Active"
  })

  if (error) throw new Error(error.message)
  revalidatePath("/dashboard/projects")
}

// Features
export async function getFeatures() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("features")
    .select("*, project:projects(name, code), assignee:profiles(full_name)")
    .order("created_at", { ascending: false })
  
  if (error) throw new Error(error.message)
  return data
}

export async function createFeature(formData: FormData) {
  const supabase = await createClient()
  
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const project_id = formData.get("project_id") as string
  const priority = formData.get("priority") as string || "Medium"
  const feature_type = formData.get("feature_type") as string || "Feature"
  
  const { error } = await supabase.from("features").insert({
    title,
    description,
    project_id,
    priority,
    feature_type,
    status: "Backlog"
  })

  if (error) throw new Error(error.message)
  revalidatePath("/dashboard/features")
}

// Releases
export async function getReleases() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("releases")
    .select("*, project:projects(name, code)")
    .order("created_at", { ascending: false })
  
  if (error) throw new Error(error.message)
  return data
}

export async function createRelease(formData: FormData) {
  const supabase = await createClient()
  
  const version = formData.get("version") as string
  const name = formData.get("name") as string
  const project_id = formData.get("project_id") as string
  const description = formData.get("description") as string
  const release_type = formData.get("release_type") as string || "Minor"
  
  const { error } = await supabase.from("releases").insert({
    version,
    name,
    project_id,
    description,
    release_type,
    status: "Planning"
  })

  if (error) throw new Error(error.message)
  revalidatePath("/dashboard/releases")
}

// Bugs
export async function getBugs() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("bugs")
    .select("*, project:projects(name, code), reporter:profiles!bugs_reporter_id_fkey(full_name), assignee:profiles!bugs_assignee_id_fkey(full_name)")
    .order("created_at", { ascending: false })
  
  if (error) throw new Error(error.message)
  return data
}

export async function createBug(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")
  
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const project_id = formData.get("project_id") as string
  const severity = formData.get("severity") as string || "Medium"
  const priority = formData.get("priority") as string || "Medium"
  
  const { error } = await supabase.from("bugs").insert({
    title,
    description,
    project_id,
    severity,
    priority,
    reporter_id: user.id,
    status: "Open"
  })

  if (error) throw new Error(error.message)
  revalidatePath("/dashboard/bugs")
}

// Dashboard Stats
export async function getDashboardStats() {
  const supabase = await createClient()

  // We can run these concurrently using Promise.all
  const [
    { count: totalProjects },
    { count: activeFeatures },
    { count: plannedReleases },
    { count: openBugs }
  ] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("features").select("*", { count: "exact", head: true }).neq("status", "Archived").neq("status", "Released"),
    supabase.from("releases").select("*", { count: "exact", head: true }).eq("status", "Planning"),
    supabase.from("bugs").select("*", { count: "exact", head: true }).eq("status", "Open")
  ])

  return {
    totalProjects: totalProjects || 0,
    activeFeatures: activeFeatures || 0,
    plannedReleases: plannedReleases || 0,
    openBugs: openBugs || 0
  }
}
