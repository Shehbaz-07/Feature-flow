import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FolderKanban, Layers, Rocket, Bug } from "lucide-react"
import { getDashboardStats, getReleases, getBugs } from "@/app/actions"
import { Badge } from "@/components/ui/badge"

export default async function DashboardPage() {
  const [stats, releases, bugs] = await Promise.all([
    getDashboardStats(),
    getReleases(),
    getBugs()
  ])

  // Get upcoming releases (status planning or ready)
  const upcomingReleases = releases
    .filter((r: any) => r.status === "Planning" || r.status === "Ready" || r.status === "Testing")
    .slice(0, 5)

  // Get recent active bugs
  const recentBugs = bugs
    .filter((b: any) => b.status === "Open" || b.status === "In Progress")
    .slice(0, 5)

  const statCards = [
    { title: "Total Projects", value: stats.totalProjects, icon: FolderKanban },
    { title: "Active Features", value: stats.activeFeatures, icon: Layers },
    { title: "Planned Releases", value: stats.plannedReleases, icon: Rocket },
    { title: "Open Bugs", value: stats.openBugs, icon: Bug },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome to FeatureFlow. Here is an overview of your workspace.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
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
            <CardTitle>Recent Bugs</CardTitle>
          </CardHeader>
          <CardContent>
            {recentBugs.length === 0 ? (
              <div className="text-sm text-muted-foreground py-4 text-center">
                No active bugs right now!
              </div>
            ) : (
              <div className="space-y-4">
                {recentBugs.map((bug: any) => (
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
            <CardTitle>Upcoming Releases</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingReleases.length === 0 ? (
              <div className="text-sm text-muted-foreground py-4 text-center">
                No upcoming releases scheduled.
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingReleases.map((release: any) => (
                  <div key={release.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                    <div>
                      <p className="text-sm font-medium">{release.name}</p>
                      <p className="text-xs text-muted-foreground">{release.version} ({release.project?.code})</p>
                    </div>
                    <Badge variant="outline">
                      {release.status}
                    </Badge>
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
