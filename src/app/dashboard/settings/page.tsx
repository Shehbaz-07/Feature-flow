"use client"

import { useState, useEffect } from "react"
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
import { Save, User, Palette, KeyRound, Globe } from "lucide-react"
import { useTranslation } from "@/lib/i18n/context"
import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export default function SettingsPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const { t, locale, setLocale } = useTranslation()

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
      toast.success(t.settings.profileSaved)
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  const handleLanguageChange = (newLocale: Locale) => {
    setLocale(newLocale)
    toast.success(t.settings.languageSaved)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t.settings.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t.settings.subtitle}</p>
      </div>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Palette className="w-4 h-4 text-primary" />
            {t.settings.appearance}
          </CardTitle>
          <CardDescription>{t.settings.appearanceDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm font-medium">{t.settings.theme}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t.settings.themeDesc}</p>
            </div>
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>

      {/* Language */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Globe className="w-4 h-4 text-primary" />
            {t.settings.language}
          </CardTitle>
          <CardDescription>{t.settings.languageDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SUPPORTED_LOCALES.map((lang) => (
              <button
                key={lang.code}
                id={`settings-lang-${lang.code}`}
                onClick={() => handleLanguageChange(lang.code as Locale)}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-all text-left",
                  locale === lang.code
                    ? "border-primary bg-primary/10 text-primary font-medium shadow-sm"
                    : "border-border hover:border-primary/50 hover:bg-muted"
                )}
              >
                <span className="text-lg leading-none">{lang.flag}</span>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-medium leading-tight truncate">{lang.nativeName}</span>
                  {lang.code !== "en" && (
                    <span className="text-[10px] text-muted-foreground leading-tight">{lang.englishName}</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="w-4 h-4 text-primary" />
            {t.settings.profile}
          </CardTitle>
          <CardDescription>{t.settings.profileDesc}</CardDescription>
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
                <Label htmlFor="settings-fullname">{t.settings.fullName}</Label>
                <Input
                  id="settings-fullname"
                  placeholder={t.settings.namePlaceholder}
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="settings-email">{t.settings.emailAddress}</Label>
                <Input
                  id="settings-email"
                  type="email"
                  value={email}
                  disabled
                  className="opacity-60 cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground">{t.settings.emailNote}</p>
              </div>
              <Button
                id="save-profile-btn"
                onClick={handleSaveProfile}
                disabled={saving || !fullName.trim()}
                className="mt-2"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? t.settings.saving : t.settings.saveChanges}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Account security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <KeyRound className="w-4 h-4 text-primary" />
            {t.settings.security}
          </CardTitle>
          <CardDescription>{t.settings.securityDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm font-medium">{t.settings.authProvider}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t.settings.authProviderValue}</p>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-600 dark:text-green-400">
              {t.settings.active}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
