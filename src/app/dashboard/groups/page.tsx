"use client"

import { useEffect, useState } from "react"
import {
  Users,
  Plus,
  Search,
  RefreshCw,
  Pencil,
  Trash2,
  X,
  AlertCircle,
  UserCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Group {
  id: string
  name: string
  description: string | null
  member_ids: string[] | null
  created_at: string
  updated_at: string
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([])
  const [filtered, setFiltered] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [editGroup, setEditGroup] = useState<Group | null>(null)
  const [deleteGroup, setDeleteGroup] = useState<Group | null>(null)
  const [form, setForm] = useState({ name: "", description: "", memberIds: "" })
  const [submitting, setSubmitting] = useState(false)

  const fetchGroups = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/groups")
      if (!res.ok) throw new Error("Failed to load groups")
      const data = await res.json()
      setGroups(data)
      setFiltered(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchGroups() }, [])

  useEffect(() => {
    if (!search.trim()) { setFiltered(groups); return }
    const q = search.toLowerCase()
    setFiltered(groups.filter(g =>
      g.name.toLowerCase().includes(q) ||
      (g.description ?? "").toLowerCase().includes(q)
    ))
  }, [search, groups])

  const openEdit = (g: Group) => {
    setEditGroup(g)
    setForm({
      name: g.name,
      description: g.description ?? "",
      memberIds: (g.member_ids ?? []).join(", "),
    })
  }

  const openCreate = () => {
    setForm({ name: "", description: "", memberIds: "" })
    setShowCreate(true)
  }

  const handleSubmitCreate = async () => {
    setSubmitting(true)
    try {
      const member_ids = form.memberIds.split(",").map(s => s.trim()).filter(Boolean)
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, description: form.description || undefined, member_ids }),
      })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error) }
      toast.success(`Group "${form.name}" created`)
      setShowCreate(false)
      fetchGroups()
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmitEdit = async () => {
    if (!editGroup) return
    setSubmitting(true)
    try {
      const member_ids = form.memberIds.split(",").map(s => s.trim()).filter(Boolean)
      const res = await fetch(`/api/groups/${editGroup.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, description: form.description || undefined, member_ids }),
      })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error) }
      toast.success("Group updated")
      setEditGroup(null)
      fetchGroups()
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteGroup) return
    try {
      const res = await fetch(`/api/groups/${deleteGroup.id}`, { method: "DELETE" })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error) }
      toast.success(`Group "${deleteGroup.name}" deleted`)
      setDeleteGroup(null)
      fetchGroups()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const GroupFormFields = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="group-name">Group Name</Label>
        <Input
          id="group-name"
          placeholder="e.g. beta-users"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="group-description">Description</Label>
        <Textarea
          id="group-description"
          placeholder="Optional description…"
          rows={2}
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="group-members">Member IDs</Label>
        <Textarea
          id="group-members"
          placeholder="Comma-separated user IDs, e.g. user_1, user_2, user_3"
          rows={3}
          value={form.memberIds}
          onChange={e => setForm(f => ({ ...f, memberIds: e.target.value }))}
        />
        <p className="text-xs text-muted-foreground">Enter user IDs separated by commas.</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Groups</h1>
            <p className="text-sm text-muted-foreground">Manage user groups for targeted feature flag rollouts.</p>
          </div>
        </div>
        <Button id="create-group-btn" onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" />
          New Group
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="border rounded-xl p-4 bg-card flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg"><Users className="w-5 h-5 text-blue-500" /></div>
          <div>
            <div className="text-2xl font-bold">{groups.length}</div>
            <div className="text-xs text-muted-foreground">Total Groups</div>
          </div>
        </div>
        <div className="border rounded-xl p-4 bg-card flex items-center gap-3">
          <div className="p-2 bg-green-500/10 rounded-lg"><UserCheck className="w-5 h-5 text-green-500" /></div>
          <div>
            <div className="text-2xl font-bold">
              {groups.reduce((acc, g) => acc + (g.member_ids?.length ?? 0), 0)}
            </div>
            <div className="text-xs text-muted-foreground">Total Members</div>
          </div>
        </div>
      </div>

      {/* Search + Refresh */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="group-search"
            placeholder="Search groups…"
            className="pl-9"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" size="sm" onClick={fetchGroups} disabled={loading} id="group-refresh-btn">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-destructive border border-destructive/30 bg-destructive/10 rounded-lg p-4">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Groups Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border rounded-xl p-5 bg-card space-y-3 animate-pulse">
              <div className="h-5 bg-muted rounded w-1/2" />
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-8 bg-muted rounded" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="border rounded-xl p-16 text-center text-muted-foreground bg-card">
          <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="font-medium text-lg">No groups found</p>
          <p className="text-sm mt-1">Create a group to start targeting users by group membership.</p>
          <Button className="mt-4" onClick={openCreate} id="empty-create-group-btn">
            <Plus className="w-4 h-4 mr-2" />
            Create First Group
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(group => (
            <div key={group.id} className="border rounded-xl p-5 bg-card hover:shadow-md transition-shadow group/card">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="p-1.5 bg-primary/10 rounded-md shrink-0">
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="font-semibold truncate">{group.name}</h3>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity shrink-0">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(group)} id={`edit-group-${group.id}`}>
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => setDeleteGroup(group)} id={`delete-group-${group.id}`}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              {group.description && (
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{group.description}</p>
              )}

              <div className="mt-4 pt-3 border-t flex items-center justify-between">
                <Badge variant="secondary" className="text-xs">
                  <UserCheck className="w-3 h-3 mr-1" />
                  {group.member_ids?.length ?? 0} members
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {new Date(group.created_at).toLocaleDateString()}
                </span>
              </div>

              {(group.member_ids ?? []).length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {(group.member_ids ?? []).slice(0, 4).map(id => (
                    <span key={id} className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">
                      {id}
                    </span>
                  ))}
                  {(group.member_ids ?? []).length > 4 && (
                    <span className="text-xs text-muted-foreground px-1.5 py-0.5">
                      +{(group.member_ids ?? []).length - 4} more
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
          </DialogHeader>
          <GroupFormFields />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={handleSubmitCreate} disabled={submitting || !form.name} id="confirm-create-group-btn">
              {submitting ? "Creating…" : "Create Group"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editGroup} onOpenChange={() => setEditGroup(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Group</DialogTitle>
          </DialogHeader>
          <GroupFormFields />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditGroup(null)}>Cancel</Button>
            <Button onClick={handleSubmitEdit} disabled={submitting || !form.name} id="confirm-edit-group-btn">
              {submitting ? "Saving…" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteGroup} onOpenChange={() => setDeleteGroup(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Group</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deleteGroup?.name}</strong>? This action cannot be undone.
              Any targeting rules referencing this group name will stop matching.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90" id="confirm-delete-group-btn">
              Delete Group
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
