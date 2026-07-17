import Link from "next/link"
import { getBugs } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function BugsPage() {
  const bugs = await getBugs()

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical": return "destructive"
      case "High": return "warning" 
      case "Medium": return "default"
      case "Low": return "secondary"
      default: return "outline"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved": return "default"
      case "Closed": return "outline"
      case "In Progress": return "secondary"
      case "Open": return "destructive"
      default: return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bugs</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage issues across projects.
          </p>
        </div>
        <Link href="/dashboard/bugs/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Report Bug
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Bugs</CardTitle>
        </CardHeader>
        <CardContent>
          {bugs.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No bugs found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Reporter</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bugs.map((bug: any) => (
                  <TableRow key={bug.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {bug.project?.code}
                    </TableCell>
                    <TableCell className="font-semibold">{bug.title}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(bug.status) as any}>
                        {bug.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getSeverityColor(bug.severity) as any}>
                        {bug.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>{bug.reporter?.full_name || "Unknown"}</TableCell>
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
