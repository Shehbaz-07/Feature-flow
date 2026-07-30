"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Save, User, Palette, KeyRound } from "lucide-react"
import { useEffect } from "react"

export default function SettingsPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setFullName(user?.user_metadata?.full_name || "")
      setEmail(user?.email || "")
      setLoading(false)
    }
    load()
  }, [])

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName },
      })
      if (error) throw error
      toast.success("Profile updated successfully")
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account settings and preferences.
        </p>
      </div>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Palette className="w-4 h-4 text-primary" />
            Appearance
          </CardTitle>
          <CardDescription>
            Customize the look and feel of the application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm font-medium">Theme</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Switch between light and dark mode.
              </p>
            </div>
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="w-4 h-4 text-primary" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Update your display name. Changes are saved to your account immediately.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded w-20 animate-pulse" />
              <div className="h-10 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded w-20 animate-pulse" />
              <div className="h-10 bg-muted rounded animate-pulse" />
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="settings-fullname">Full Name</Label>
                <Input
                  id="settings-fullname"
                  placeholder="Your display name"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="settings-email">Email Address</Label>
                <Input
                  id="settings-email"
                  type="email"
                  value={email}
                  disabled
                  className="opacity-60 cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed here. Contact your administrator.
                </p>
              </div>
              <Button
                id="save-profile-btn"
                onClick={handleSaveProfile}
                disabled={saving || !fullName.trim()}
                className="mt-2"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Saving…" : "Save Changes"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Account security - read only info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <KeyRound className="w-4 h-4 text-primary" />
            Account Security
          </CardTitle>
          <CardDescription>
            Your account is secured via Supabase Auth.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm font-medium">Authentication Provider</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Email &amp; Password via Supabase Auth
              </p>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-600 dark:text-green-400">
              Active
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
