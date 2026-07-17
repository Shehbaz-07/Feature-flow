import Link from "next/link"
import { getFeatures } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function FeaturesPage() {
  const features = await getFeatures()

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical": return "destructive"
      case "High": return "warning" // Note: add a custom warning variant or use default
      case "Medium": return "default"
      case "Low": return "secondary"
      default: return "outline"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Released": return "default"
      case "In Progress": return "secondary"
      case "Backlog": return "outline"
      default: return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Features</h1>
          <p className="text-muted-foreground mt-1">
            Manage epics, features, and tasks across projects.
          </p>
        </div>
        <Link href="/dashboard/features/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> New Feature
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Features</CardTitle>
          <CardDescription>A list of features across all projects.</CardDescription>
        </CardHeader>
        <CardContent>
          {features.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No features found. Create one to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Assignee</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {features.map((feature: any) => (
                  <TableRow key={feature.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {feature.project?.code}
                    </TableCell>
                    <TableCell className="font-semibold">{feature.title}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(feature.status) as any}>
                        {feature.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPriorityColor(feature.priority) as any}>
                        {feature.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>{feature.assignee?.full_name || "Unassigned"}</TableCell>
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
