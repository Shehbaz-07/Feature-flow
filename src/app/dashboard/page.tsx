import { getDashboardStats, getReleases, getBugs } from "@/app/actions"
import { DashboardClient } from "./dashboard-client"

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

  return (
    <DashboardClient
      stats={stats}
      upcomingReleases={upcomingReleases}
      recentBugs={recentBugs}
    />
  )
}
