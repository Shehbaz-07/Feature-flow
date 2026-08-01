"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FolderKanban, Layers, Rocket, Bug } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "@/lib/i18n/context"

interface DashboardStats {
  totalProjects: number
  activeFeatures: number
  plannedReleases: number
  openBugs: number
}

interface Release {
  id: string
  name: string
  version: string
  status: string
  project?: { code: string }
}

interface BugItem {
  id: string
  title: string
  severity: string
  status: string
  project?: { name: string; code: string }
}

interface DashboardClientProps {
  stats: DashboardStats
  upcomingReleases: Release[]
  recentBugs: BugItem[]
}

export function DashboardClient({ stats, upcomingReleases, recentBugs }: DashboardClientProps) {
  const { t } = useTranslation()

  const statCards = [
    { title: t.dashboard.totalProjects,    value: stats.totalProjects,    icon: FolderKanban },
    { title: t.dashboard.activeFeatures,   value: stats.activeFeatures,   icon: Layers       },
    { title: t.dashboard.plannedReleases,  value: stats.plannedReleases,  icon: Rocket       },
    { title: t.dashboard.openBugs,         value: stats.openBugs,         icon: Bug          },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t.dashboard.title}</h1>
        <p className="text-muted-foreground mt-1">{t.dashboard.subtitle}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>{t.dashboard.recentBugs}</CardTitle>
          </CardHeader>
          <CardContent>
            {recentBugs.length === 0 ? (
              <div className="text-sm text-muted-foreground py-4 text-center">
                {t.dashboard.noBugs}
              </div>
            ) : (
              <div className="space-y-4">
                {recentBugs.map((bug) => (
                  <div key={bug.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                    <div>
                      <p className="text-sm font-medium">{bug.title}</p>
                      <p className="text-xs text-muted-foreground">{bug.project?.name} - {bug.project?.code}</p>
                    </div>
                    <Badge variant={bug.severity === "Critical" ? "destructive" : "secondary"}>
                      {bug.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>{t.dashboard.upcomingReleases}</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingReleases.length === 0 ? (
              <div className="text-sm text-muted-foreground py-4 text-center">
                {t.dashboard.noReleases}
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingReleases.map((release) => (
                  <div key={release.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                    <div>
                      <p className="text-sm font-medium">{release.name}</p>
                      <p className="text-xs text-muted-foreground">{release.version} ({release.project?.code})</p>
                    </div>
                    <Badge variant="outline">{release.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
