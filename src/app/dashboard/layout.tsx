"use client"

import { ReactNode, useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  FolderKanban,
  Layers,
  Rocket,
  Bug,
  Kanban,
  LogOut,
  Settings,
  ClipboardList,
  BookOpen,
  Users,
  ChevronRight,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { User } from "@supabase/supabase-js"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useTranslation } from "@/lib/i18n/context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

// ─── NavLink ────────────────────────────────────────────────────────────────────

function NavLink({
  href,
  icon: Icon,
  label,
  active,
}: {
  href: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  label: string
  active: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon size={16} className="shrink-0" />
      <span className="flex-1">{label}</span>
      {active && <ChevronRight size={12} className="opacity-60" />}
    </Link>
  )
}

// ─── SectionLabel ───────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mt-5 mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 select-none">
      {children}
    </p>
  )
}

// ─── Layout ─────────────────────────────────────────────────────────────────────

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const { t } = useTranslation()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  const initials =
    user?.user_metadata?.full_name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ||
    user?.email?.charAt(0).toUpperCase() ||
    "U"

  // Nav items built inside the component so they pick up translations reactively
  const NAV_MAIN = [
    { href: "/dashboard",          icon: LayoutDashboard, label: t.sidebar.dashboard   },
    { href: "/dashboard/projects", icon: FolderKanban,    label: t.sidebar.projects    },
    { href: "/dashboard/features", icon: Layers,          label: t.sidebar.features    },
    { href: "/dashboard/releases", icon: Rocket,          label: t.sidebar.releases    },
    { href: "/dashboard/bugs",     icon: Bug,             label: t.sidebar.bugs        },
    { href: "/dashboard/sprint",   icon: Kanban,          label: t.sidebar.sprintBoard },
  ]

  const NAV_FLAGS = [
    { href: "/dashboard/groups",     icon: Users,         label: t.sidebar.groups    },
    { href: "/dashboard/audit-logs", icon: ClipboardList, label: t.sidebar.auditLogs },
    { href: "/dashboard/sdk-docs",   icon: BookOpen,      label: t.sidebar.sdkDocs   },
  ]

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* ── Sidebar ──────────────────────────────────────────────────── */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r bg-background">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-4 border-b">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-md shadow-sm shrink-0">
            <Layers size={18} />
          </div>
          <span className="font-bold text-lg tracking-tight">FeatureFlow</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <SectionLabel>{t.sidebar.workspace}</SectionLabel>
          {NAV_MAIN.map(item => (
            <NavLink
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              active={pathname === item.href}
            />
          ))}

          <SectionLabel>{t.sidebar.featureFlags}</SectionLabel>
          {NAV_FLAGS.map(item => (
            <NavLink
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              active={pathname === item.href}
            />
          ))}

          <SectionLabel>{t.sidebar.settings}</SectionLabel>
          <NavLink
            href="/dashboard/settings"
            icon={Settings}
            label={t.sidebar.settings}
            active={pathname === "/dashboard/settings"}
          />
        </nav>

        {/* User footer */}
        <div className="border-t px-3 py-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                id="sidebar-user-menu"
                className="w-full flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm hover:bg-muted transition-colors text-left"
              >
                <Avatar className="h-7 w-7 shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-xs truncate">
                    {user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Account"}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {user?.email || "Loading…"}
                  </p>
                </div>
                <ChevronRight size={12} className="text-muted-foreground shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mb-1" side="top" align="start">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-semibold leading-none">
                      {user?.user_metadata?.full_name || "User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/dashboard/settings" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  {t.userMenu.settings}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                {t.userMenu.signOut}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* ── Main area ────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-sm flex items-center justify-between px-6 h-14">
          {/* Mobile logo */}
          <Link
            href="/dashboard"
            className="flex md:hidden items-center gap-2 font-bold text-lg tracking-tight"
          >
            <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
              <Layers size={16} />
            </div>
            FeatureFlow
          </Link>

          {/* Page breadcrumb — desktop only */}
          <div className="hidden md:block" />

          {/* Right controls */}
          <div className="flex items-center gap-1 ml-auto">
            <LanguageSwitcher />
            <ThemeToggle />

            {/* User avatar — desktop redundant with sidebar but kept for mobile */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    id="topbar-user-menu"
                    className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-52" align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col gap-0.5">
                        <p className="text-sm font-semibold">
                          {user?.user_metadata?.full_name || "User"}
                        </p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/dashboard/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      {t.userMenu.settings}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {t.userMenu.signOut}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
