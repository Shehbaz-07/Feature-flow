import Link from "next/link"
import { getReleases } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function ReleasesPage() {
  const releases = await getReleases()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Released": return "default"
      case "Approved": return "default"
      case "Testing": return "warning"
      case "Planning": return "outline"
      default: return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Releases</h1>
          <p className="text-muted-foreground mt-1">
            Manage your product releases and versions.
          </p>
        </div>
        <Link href="/dashboard/releases/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> New Release
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Releases</CardTitle>
        </CardHeader>
        <CardContent>
          {releases.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No releases found. Create one to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {releases.map((release: any) => (
                  <TableRow key={release.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {release.project?.code}
                    </TableCell>
                    <TableCell className="font-semibold">{release.version}</TableCell>
                    <TableCell>{release.name}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(release.status) as any}>
                        {release.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{release.release_type}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
